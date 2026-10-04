import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { cases } from './qualification-cases.mjs';
import { scratchFixture, migrateGlossaryFixture, writeFirstGlossaryTerm, appendGlossaryTerm } from './qualification-test-support.mjs';

// Every mutation is applied on top of the synthetic canonical migration; the
// approved case must pass only for `none`. Rewrites, deletions, reordering
// and duplicates join the shape/link/pipe/anchor losses as negative controls.
const MUTATIONS = [
  'none', 'dropped-pipe', 'dropped-link', 'dropped-anchor', 'not-canonical',
  'rewrite-definition', 'delete-entry', 'reorder-entries', 'duplicate-plain-row',
];
const EXPECTED_FAIL = /pipe|link|anchor|non-canonical|prose|entr|repeats terms|duplicate/;

for (const mutation of MUTATIONS) {
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
          const text = readFileSync(path, 'utf8');
          if (mutation === 'dropped-pipe') {
            writeFileSync(path, text.replace('\\|', '|'));
          } else if (mutation === 'dropped-link') {
            writeFileSync(path, text.replace('[member index](federation-index.md)', 'the member index'));
          } else if (mutation === 'dropped-anchor') {
            writeFileSync(path, text.replace('<a id="delivery"></a>', ''));
          } else if (mutation === 'not-canonical') {
            writeFileSync(path, text.replace('| Term | Definition |', '| Term | Meaning |'));
          } else if (mutation === 'rewrite-definition') {
            writeFileSync(path, text.replace('A multi-repo product.', 'A completely different meaning.'));
          } else if (mutation === 'delete-entry') {
            writeFileSync(path, text.replace('| Federation | A multi-repo product. |\n', ''));
          } else if (mutation === 'reorder-entries') {
            writeFileSync(path, text.replace(
              '| Federation | A multi-repo product. |\n| `workspace` | the coordination layer. |',
              '| `workspace` | the coordination layer. |\n| Federation | A multi-repo product. |'));
          } else if (mutation === 'duplicate-plain-row') {
            writeFileSync(path, text + '| Delivery | A native repository contribution. |\n');
          }
        }
        return { exit: 0, stdout: '', stderr: '' };
      },
    };
    const result = await cases.find((c) => c.id === 'audit-glossary').run(ctx);
    assert.equal(result.status, mutation === 'none' ? 'pass' : 'fail', result.cause || `accepted ${mutation}`);
    if (mutation !== 'none') assert.match(result.cause, EXPECTED_FAIL);
  });
}

// Consent/decline: an adapter that writes on a decline must be rejected; one
// that leaves the tree alone passes.
for (const [name, writes, expected] of [
  ['decline-no-write', false, 'pass'],
  ['decline-writes', true, 'fail'],
]) {
  test(`audit-glossary decline control: ${name}`, async (t) => {
    const fixture = scratchFixture(t);
    const ctx = {
      ...fixture,
      host: 'synthetic',
      modelHosts: ['synthetic'],
      adapter: { id: 'synthetic', launch: () => ({ argv: ['synthetic-host'] }) },
      run: async (argv, { cwd }) => {
        if (argv[0] === 'synthetic-host' && writes) migrateGlossaryFixture(cwd);
        return { exit: 0, stdout: '', stderr: '' };
      },
    };
    const result = await cases.find((c) => c.id === 'audit-glossary-decline').run(ctx);
    assert.equal(result.status, expected, result.cause || `decline control ${name}`);
  });
}

// First-term creation and repeat-append exercise the add-convention case. The
// positive adapter keeps one table and preserves the existing rows; an adapter
// that appends a second table is rejected.
for (const [name, append, expected] of [
  ['single-table', appendGlossaryTerm, 'pass'],
  ['second-table', (root) => {
    const path = join(root, 'GLOSSARY.md');
    writeFileSync(path, readFileSync(path, 'utf8') +
      '\n| Term | Definition |\n|------|------------|\n| Federation | A multi-repo product. |\n');
  }, 'fail'],
]) {
  test(`add-convention maintenance control: ${name}`, async (t) => {
    const fixture = scratchFixture(t);
    let turn = 0;
    const ctx = {
      ...fixture,
      host: 'synthetic',
      modelHosts: ['synthetic'],
      adapter: { id: 'synthetic', launch: () => ({ argv: ['synthetic-host'] }) },
      run: async (argv, { cwd }) => {
        if (argv[0] === 'synthetic-host') {
          turn += 1;
          if (turn === 1) writeFirstGlossaryTerm(cwd);
          else append(cwd);
        }
        return { exit: 0, stdout: '', stderr: '' };
      },
    };
    const result = await cases.find((c) => c.id === 'add-convention-maintenance').run(ctx);
    assert.equal(result.status, expected, result.cause || `add-convention control ${name}`);
  });
}
