import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { cases } from './qualification-cases.mjs';
import { scratchFixture, migrateGlossaryFixture } from './qualification-test-support.mjs';

for (const mutation of ['none', 'dropped-pipe', 'dropped-link', 'dropped-anchor', 'not-canonical']) {
  test(`audit-glossary rejects lost invariants: ${mutation}`, async (t) => {
    const fixture = scratchFixture(t);
    const ctx = {
      ...fixture,
      host: 'synthetic',
      modelHosts: ['synthetic'],
      adapter: { id: 'synthetic', launch: () => ({ argv: ['synthetic-host'] }) },
      run: async (argv, { cwd }) => {
        if (argv[0] === 'synthetic-host') {
          migrateGlossaryFixture(cwd);
          const path = join(cwd, 'GLOSSARY.md');
          if (mutation === 'dropped-pipe') {
            writeFileSync(path, readFileSync(path, 'utf8').replace('\\|', '|'));
          } else if (mutation === 'dropped-link') {
            writeFileSync(path, readFileSync(path, 'utf8').replace('[member index](federation-index.md)', 'the member index'));
          } else if (mutation === 'dropped-anchor') {
            writeFileSync(path, readFileSync(path, 'utf8').replace('<a id="delivery"></a>', ''));
          } else if (mutation === 'not-canonical') {
            writeFileSync(path, readFileSync(path, 'utf8').replace('| Term | Definition |', '| Term | Meaning |'));
          }
        }
        return { exit: 0, stdout: '', stderr: '' };
      },
    };
    const result = await cases.find((c) => c.id === 'audit-glossary').run(ctx);
    assert.equal(result.status, mutation === 'none' ? 'pass' : 'fail', result.cause || `accepted ${mutation}`);
    if (mutation !== 'none') assert.match(result.cause, /pipe|link|anchor|non-canonical/);
  });
}
