import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { adapters, scanSkills } from './host-adapters.mjs';
import { cases } from './qualification-cases.mjs';
import { scratchFixture } from './qualification-test-support.mjs';

const repo = resolve(import.meta.dirname, '../..');
const discovery = cases.find((c) => c.id === 'discovery');

for (const id of ['claude', 'pi', 'codex', 'grok', 'omp']) {
  test(`${id}: installed package without resolved names cannot pass discovery`, async (t) => {
    const { scratch } = scratchFixture(t);
    const stage = join(scratch, 'stage');
    const plugin = join(stage, 'plugins/docflow');
    for (const name of scanSkills(join(repo, 'plugins/docflow/skills'))) {
      mkdirSync(join(plugin, 'skills', name), { recursive: true });
      writeFileSync(join(plugin, 'skills', name, 'SKILL.md'), '# staged skill\n');
    }
    const stdout = { claude: '[{"id":"docflow@evolvehq"}]', pi: stage,
      codex: 'docflow@evolvehq installed', grok: '[{"name":"docflow"}]',
      omp: '[{"name":"docflow"}]' }[id];
    const ctx = { repo, stage, plugin, adapter: adapters.find((a) => a.id === id),
      installResult: { exit: 0 }, run: async () => ({ exit: 0, stdout }) };
    const result = await discovery.run(ctx);
    assert.equal(result.status, 'blocked');
    assert.match(result.cause, /resolved skill names/);
    assert.deepEqual((await ctx.adapter.discover(ctx)).skills, []);
  });
}

test('pi: unrelated repo mention does not identify the staged package', async (t) => {
  const { scratch } = scratchFixture(t);
  const pi = adapters.find((a) => a.id === 'pi');
  for (const stdout of ['repo: /elsewhere/unrelated', `${scratch}/stage-other`, 'docflow-other']) {
    const result = await pi.discover({ stage: join(scratch, 'stage'), plugin: scratch,
      run: async () => ({ exit: 0, stdout }) });
    assert.equal(result.loaded, false, stdout);
  }
});

test('discovery still requires the complete native list', async () => {
  const names = scanSkills(join(repo, 'plugins/docflow/skills'));
  for (const [skills, status] of [[names, 'pass'], [names.slice(1), 'fail'], [[...names, 'foreign'], 'fail']]) {
    const result = await discovery.run({ repo, installResult: { exit: 0 },
      adapter: { discover: async () => ({ exit: 0, loaded: true, skills }) } });
    assert.equal(result.status, status);
  }
});
