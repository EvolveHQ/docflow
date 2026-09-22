import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildCtx } from './qualify.mjs';
import { cases } from './qualification-cases.mjs';
import { scratchFixture } from './qualification-test-support.mjs';

const bootstrap = cases.find((c) => c.id === 'bootstrap-full');
for (const modelHosts of [undefined, [], ['pi'], ['codex']]) {
  test(`model host selection ${JSON.stringify(modelHosts) ?? 'omitted'} gates actual launch`, async (t) => {
    const fixture = scratchFixture(t);
    const selected = modelHosts ?? ['pi'];
    for (const host of ['pi', 'claude', 'codex', 'grok', 'omp', 'copilot', 'opencode']) {
      let launches = 0;
      let commands = 0;
      const adapter = { id: host, launch() { launches++; throw Error('synthetic launch reached'); } };
      const ctx = { ...buildCtx({ ...fixture, host, adapter, modelHosts }),
        // Fixture git calls are inert; the launch sentinel never calls a model.
        run: async () => { commands++; return { exit: 0 }; } };
      if (selected.includes(host)) {
        await assert.rejects(bootstrap.run(ctx), /synthetic launch reached/);
        assert.equal(launches, 1);
      } else {
        const result = await bootstrap.run(ctx);
        assert.equal(result.status, 'blocked');
        assert.match(result.cause, /not selected by --model-hosts/);
        assert.equal(launches, 0);
        assert.equal(commands, 0);
      }
    }
  });
}
