import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cases } from './qualification-cases.mjs';
import { scratchFixture } from './qualification-test-support.mjs';

for (const id of ['dispatch-brief', 'dispatch-refusal', 'sync-reconcile', 'sync-prepared-not-complete']) {
  for (const mode of ['excluded', 'no-launcher', 'selected']) {
    test(`${id}: ${mode} honours the skill gate before fixture work`, async (t) => {
      const fixture = scratchFixture(t);
      let commands = 0;
      let launches = 0;
      const ctx = { ...fixture, host: 'codex', node: process.execPath,
        modelHosts: mode === 'excluded' ? ['pi'] : ['codex'],
        adapter: { id: 'codex' },
        run: async () => { commands++; throw Error('synthetic fixture reached'); } };
      if (mode !== 'no-launcher') ctx.adapter.launch = () => { launches++; throw Error('unexpected model turn'); };
      const run = () => cases.find((c) => c.id === id).run(ctx);
      if (mode === 'selected') {
        await assert.rejects(run, /synthetic fixture reached/);
        assert.equal(commands, 1);
      } else {
        const result = await run();
        assert.equal(result.status, 'blocked');
        assert.match(result.cause, mode === 'excluded' ? /not selected by --model-hosts/ : /no non-interactive launcher/);
        assert.equal(commands, 0);
      }
      assert.equal(launches, 0);
    });
  }
}
