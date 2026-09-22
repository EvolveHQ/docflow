import assert from 'node:assert/strict';
import { test } from 'node:test';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { scratchFixture, migrateRangeFixture } from './qualification-test-support.mjs';

const repoRoot = resolve(import.meta.dirname, '../..');
const checker = join(import.meta.dirname, 'check-release.mjs');

for (const key of ['bootstrap-full', 'bootstrap-express', 'new-adr', 'legacy-range', 'legacy-coordination']) {
  test(`release checker retains ${key} and rejects invalid target state`, (t) => {
    const { scratch, env } = scratchFixture(t);
    const target = join(scratch, 'target');
    const source = join(scratch, 'source');
    mkdirSync(target);
    const write = (path, body = '# fixture\n') => {
      mkdirSync(dirname(join(target, path)), { recursive: true });
      writeFileSync(join(target, path), body);
    };
    const git = (...args) => {
      const r = spawnSync('git', ['-C', target, ...args], { env, encoding: 'utf8' });
      assert.equal(r.status, 0, r.stderr);
    };
    let corrupt;
    if (key === 'bootstrap-full') {
      for (const path of ['CLAUDE.md', 'CONVENTIONS.md', 'INDEX.md', 'adr/0000-template.md']) write(path);
      for (const path of ['plan/todo', 'plan/done']) mkdirSync(join(target, path), { recursive: true });
      write('AGENTS.md', 'Picking up this repo\n');
      write('_agent/prompts/autonomous.md', 'node tools/verify.mjs\n');
      write('tools/verify.mjs', 'process.exit(0);\n');
      corrupt = () => write('tools/verify.mjs', 'process.exit(1);\n');
    } else if (key === 'bootstrap-express') {
      for (const path of ['AGENTS.md', 'CLAUDE.md', '.docflow/INDEX.md', '.docflow/adr/0000-template.md',
        '.docflow/adr/0001-record-architecture-decisions.md']) write(path);
      write('.docflow/CONVENTIONS.md', 'Assessment depth: **express**\nIntegration: fast-forward\n');
      corrupt = () => {
        write('.docflow/CONVENTIONS.md', 'Assessment depth: full\nIntegration: fast-forward\n');
        git('add', '-A'); git('commit', '-qm', 'wrong profile');
      };
    } else if (key === 'new-adr') {
      write('adr/0001-seed.md', '---\nadr: 0001\nstatus: Implemented\n---\n');
      write('adr/0002-export.md', '---\nadr: 0002\nstatus: Proposed\n---\n');
      write('INDEX.md', '[seed](adr/0001-seed.md)\n[export](adr/0002-export.md)\n');
      corrupt = () => write('adr/0002-export.md', '---\nadr: 0002\nstatus: Accepted\n---\n');
    } else if (key === 'legacy-range') {
      const original = join(repoRoot, 'evals/fixtures/legacy-range');
      cpSync(original, target, { recursive: true });
      cpSync(original, join(source, 'evals/fixtures/legacy-range'), { recursive: true });
      migrateRangeFixture(target);
      // Keep the old number: the independent checker must compare full bytes.
      corrupt = () => {
        const path = 'plan/done/2026-01-19-catalogue-and-store.md';
        write(path, readFileSync(join(target, path), 'utf8') + '\nHistory was edited.\n');
      };
    } else {
      cpSync(join(repoRoot, 'evals/fixtures/legacy-coordination'), target, { recursive: true });
      for (const file of ['WORKLOG.md', 'IN_FLIGHT.md', 'CURRENT_FOCUS.md', 'HANDOFF.md', 'LOCKS.md']) {
        rmSync(join(target, '.docflow/_agent', file), { force: true });
      }
      for (const file of ['.gitattributes', '.gitignore']) rmSync(join(target, file), { force: true });
      write('.docflow/_agent/ROLES.md');
      write('.docflow/_agent/prompts/autonomous.md', 'node tools/verify.mjs\n');
      write('.docflow/plan/todo/0001-example.md', '## Status\nexecutor-live\nAwaiting fixture data\n');
      write('AGENTS.md', 'Picking up this repo\nRead .docflow/\n');
      write('tools/verify.mjs', 'process.exit(0);\n');
      corrupt = () => write('.docflow/plan/todo/0001-example.md', '## Status\nAwaiting fixture data\n');
    }
    git('init', '-q'); git('config', 'user.name', 'Fixture'); git('config', 'user.email', 'fixture@example.invalid');
    git('config', 'commit.gpgsign', 'false'); git('add', '-A'); git('commit', '-qm', 'fixture');
    const check = () => {
      const r = spawnSync(process.execPath, [checker, key, target, source], { cwd: scratch, env, encoding: 'utf8' });
      return { exit: r.status, ...JSON.parse(r.stdout) };
    };
    const good = check();
    assert.equal(good.exit, 0, good.error || key);
    assert.equal(good.passed, true);
    if (key === 'bootstrap-express') {
      const r = spawnSync(process.execPath, [join(import.meta.dirname, 'test-release-assertions.mjs'), target],
        { cwd: scratch, env: { ...env, TMPDIR: scratch }, encoding: 'utf8' });
      assert.equal(r.status, 0, r.stderr);
    }
    corrupt();
    const bad = check();
    assert.equal(bad.exit, 1);
    assert.equal(bad.passed, false);
    assert.doesNotMatch(bad.error, /unknown release case/);
  });
}
