import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { cases } from './qualification-cases.mjs';
import { scratchFixture, migrateRangeFixture } from './qualification-test-support.mjs';

for (const mutation of ['none', 'seed-capability', 'rewritten-history', 'missing-adoption']) {
  test(`audit-range rejects lost invariants: ${mutation}`, async (t) => {
    const fixture = scratchFixture(t);
    const ctx = { ...fixture, host: 'synthetic', modelHosts: ['synthetic'],
      adapter: { id: 'synthetic', launch: () => ({ argv: ['synthetic-host'] }) },
      run: async (argv, { cwd }) => {
        if (argv[0] === 'synthetic-host') {
          migrateRangeFixture(cwd);
          if (mutation === 'seed-capability') {
            const seed = join(cwd, 'adr/0001-record-architecture-decisions.md');
            writeFileSync(seed, readFileSync(seed, 'utf8').replace('shape: technology', 'shape: capability')
              .replace('## Decision', '## Capability statement').replace('## Rationale', '## User stories / scenarios'));
          } else if (mutation === 'rewritten-history') {
            const history = join(cwd, 'plan/done/2026-01-19-catalogue-and-store.md');
            writeFileSync(history, readFileSync(history, 'utf8').replaceAll('0101', '0004'));
          } else if (mutation === 'missing-adoption') {
            rmSync(join(cwd, 'plan/done/2026-01-12-adopt-the-method.md'));
          }
        }
        return { exit: 0, stdout: '', stderr: '' };
      } };
    const result = await cases.find((c) => c.id === 'audit-range').run(ctx);
    assert.equal(result.status, mutation === 'none' ? 'pass' : 'fail', result.cause || `accepted ${mutation}`);
    if (mutation !== 'none') assert.match(result.cause, /shape: technology|history was rewritten|adopt-the-method/);
  });
}
