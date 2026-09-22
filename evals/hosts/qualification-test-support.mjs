// Hostless regression fixtures: every write stays in disposable scratch.
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, readFileSync, readdirSync, renameSync, writeFileSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { GUARD_ROOTS, fingerprintRoots } from './qualify.mjs';

export function scratchFixture(t) {
  const base = '/tmp/hq-qa';
  mkdirSync(base, { recursive: true });
  const scratch = mkdtempSync(join(base, 'docflow-r2-'));
  const home = join(scratch, 'home');
  mkdirSync(home);
  const before = fingerprintRoots(GUARD_ROOTS);
  t.after(() => {
    assert.equal(fingerprintRoots(GUARD_ROOTS), before, 'ISOLATION BREACH: guarded checkout changed');
    assert(resolve(scratch).startsWith(base + sep), 'isolation: scratch escaped /tmp/hq-qa');
    rmSync(scratch, { recursive: true, force: true });
  });
  return { scratch, home, env: { ...process.env, HOME: home, XDG_CONFIG_HOME: join(home, '.config'),
    GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null' } };
}

// A synthetic migration for checker controls, never native-host evidence.
export function migrateRangeFixture(root) {
  assert(resolve(root).startsWith('/tmp/hq-qa/'), 'isolation: fixture escaped /tmp/hq-qa');
  const map = { '0101': '0004', '0102': '0005' };
  const walk = (rel = '') => {
    for (const item of readdirSync(join(root, rel), { withFileTypes: true })) {
      const child = join(rel, item.name);
      if (item.name === '.git' || child === 'plan/done') continue;
      if (item.isDirectory()) walk(child);
      else if (item.name.endsWith('.md')) {
        let text = readFileSync(join(root, child), 'utf8');
        for (const [from, to] of Object.entries(map)) text = text.replaceAll(from, to);
        writeFileSync(join(root, child), text);
      }
    }
  };
  walk();
  for (const name of readdirSync(join(root, 'adr'))) {
    if (name === '0100-template.md') renameSync(join(root, 'adr', name), join(root, 'adr/0000-template-technology.md'));
    else if (/^\d{4}-/.test(name) && !name.startsWith('0000')) {
      const number = name.slice(0, 4);
      const shape = ['0001', '0101', '0102'].includes(number) ? 'technology' : 'capability';
      const target = join(root, 'adr', name.replace(number, map[number] || number));
      renameSync(join(root, 'adr', name), target);
      writeFileSync(target, readFileSync(target, 'utf8').replace(/^---\n/, `---\nshape: ${shape}\n`));
    }
  }
  writeFileSync(join(root, 'CONVENTIONS.md'), '# Conventions\n\nDeclare shape: capability or technology.\n');
  const index = join(root, 'INDEX.md');
  writeFileSync(index, readFileSync(index, 'utf8').replace('| ADR |', '| Shape | ADR |'));
}
