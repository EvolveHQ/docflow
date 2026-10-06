import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, writeFileSync, mkdirSync, symlinkSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { cases } from './qualification-cases.mjs';
import { scratchFixture, writeFirstGlossaryTerm, appendGlossaryTerm } from './qualification-test-support.mjs';
import { assertGlossaryLossless, assertGlossaryAnchorsPreserved, glossaryHeadingAnchors } from '../assertions.mjs';

// Independent literal: do not render positives from the acceptance oracle.
const APPROVED_AFTER = '# Glossary\n\n' +
  'Shared terms for the fixture repository. Entries predate the canonical\n' +
  'shape. See the [member index](federation-index.md) for repositories.\n\n' +
  '| Term | Definition |\n|------|------------|\n' +
  '| <a id="delivery"></a>Delivery | A native repository contribution. |\n' +
  '| Federation | A multi-repo product. |\n' +
  '| `workspace` | the coordination layer. |\n' +
  '| Pipe | a literal \\| inside a definition. |\n';
const INTRO = 'Shared terms for the fixture repository. Entries predate the canonical\nshape. ';
const LINK_PROSE = 'See the [member index](federation-index.md) for repositories.';
const deliveryRow = '| <a id="delivery"></a>Delivery | A native repository contribution. |\n';

function context(t, act) {
  const fixture = scratchFixture(t);
  let turn = 0, request;
  return {
    ...fixture, host: 'synthetic', modelHosts: ['synthetic'],
    adapter: { id: 'synthetic', launch: (_ctx, spec) => {
      request = spec;
      return { argv: ['synthetic-host'] };
    } },
    run: async (argv, { cwd }) => {
      if (argv[0] === 'synthetic-host') {
        turn += 1;
        return act({ cwd, turn, ...request, env: fixture.env }) || { exit: 0, stdout: '', stderr: '' };
      }
      return { exit: 0, stdout: '', stderr: '' };
    },
  };
}
const runCase = (id, ctx) => cases.find((c) => c.id === id).run(ctx);
const rewrite = (root, transform) => {
  const path = join(root, 'GLOSSARY.md');
  const before = readFileSync(path, 'utf8'), after = transform(before);
  assert.notEqual(after, before, 'adverse control must actually change its input');
  writeFileSync(path, after);
};

// Exercise the real two-turn case and exact authorisation sent through the
// host API, including application of the prompt's literal diff by Git.
const mutations = {
  none: (s) => s,
  'dropped-pipe': (s) => s.replace('\\|', '|'),
  'dropped-link': (s) => s.replace('[member index](federation-index.md)', 'the member index'),
  'dropped-anchor': (s) => s.replace('<a id="delivery"></a>', ''),
  'not-canonical': (s) => s.replace('| Term | Definition |', '| Term | Meaning |'),
  'rewrite-definition': (s) => s.replace('A multi-repo product.', 'A completely different meaning.'),
  'delete-entry': (s) => s.replace('| Federation | A multi-repo product. |\n', ''),
  'reorder-entries': (s) => s.replace(
    '| Federation | A multi-repo product. |\n| `workspace` | the coordination layer. |',
    '| `workspace` | the coordination layer. |\n| Federation | A multi-repo product. |'),
  'duplicate-plain-row': (s) => s + '| Delivery | A native repository contribution. |\n',
  'reported-shape-word-deletion': (s) => s.replace('shape. See', 'See'),
  'delete-intro-word': (s) => s.replace('fixture repository', 'repository'),
  'reorder-prose': (s) => s.replace(INTRO + LINK_PROSE, LINK_PROSE + ' ' + INTRO.trim()),
  'duplicate-prose': (s) => s.replace(INTRO, INTRO + INTRO),
  'insert-prose': (s) => s.replace(INTRO, INTRO + 'Never preserve original meanings. '),
  'comment-only-prose': (s) => s.replace(INTRO + LINK_PROSE, `<!-- ${INTRO}${LINK_PROSE} -->`),
  'fenced-only-prose': (s) => s.replace(INTRO + LINK_PROSE, '```\n' + INTRO + LINK_PROSE + '\n```'),
  'correct-word-only-in-comment': (s) => s.replace('shape. See', '<!-- shape. -->See'),
  'correct-row-only-in-comment': (s) => s.replace(deliveryRow, '<!--\n' + deliveryRow + '-->\n' + deliveryRow.replace('contribution', 'mistake')),
  'extra-hidden-row': (s) => s + '<!-- | Extra | Unapproved. | -->\n',
};
for (const [name, mutate] of Object.entries(mutations)) {
  test(`audit-glossary exact migration control: ${name}`, async (t) => {
    let turns = 0, candidate;
    const result = await runCase('audit-glossary', context(t, ({ cwd, turn, prompt, readOnly, env }) => {
      turns = turn;
      const diff = prompt.slice(prompt.indexOf('--- a/GLOSSARY.md\n'));
      assert.ok(diff.startsWith('--- a/GLOSSARY.md\n+++ b/GLOSSARY.md\n@@ '));
      assert.ok(!prompt.includes('approved as displayed'), 'no blind prospective consent');
      if (turn === 1) {
        assert.equal(readOnly, true);
        assert.match(prompt, /No migration or other edit is authorised yet/);
        candidate = diff;
        return;
      }
      assert.equal(turn, 2);
      assert.equal(readOnly, false);
      assert.match(prompt, /Operator authorisation: I approve this concrete diff/);
      assert.equal(diff, candidate, 'authorisation covers exactly the reviewed candidate');
      const applied = spawnSync('git', ['apply', '-'], { cwd, input: diff, encoding: 'utf8', env });
      assert.equal(applied.status, 0, applied.stderr);
      assert.equal(readFileSync(join(cwd, 'GLOSSARY.md'), 'utf8'), APPROVED_AFTER);
      if (name !== 'none') rewrite(cwd, mutate);
    }));
    assert.equal(turns, 2);
    assert.equal(result.status, name === 'none' ? 'pass' : 'fail', result.cause || `accepted ${name}`);
    if (name !== 'none') assert.match(result.cause, /pipe|link|anchor|non-canonical|prose|entr|duplicate/);
  });
}

const noWriteMutations = {
  none: () => {},
  'migrate-before-authorisation': (root) => writeFileSync(join(root, 'GLOSSARY.md'), APPROVED_AFTER),
  'rewrite-conventions': (root) => writeFileSync(join(root, 'CONVENTIONS.md'), '# Entirely replaced\n'),
  'unrelated-file': (root) => writeFileSync(join(root, 'UNAPPROVED.md'), 'not authorised\n'),
  'empty-directory': (root) => mkdirSync(join(root, 'unapproved')),
  'symlink': (root) => symlinkSync('GLOSSARY.md', join(root, 'unapproved-link')),
  'delete-file': (root) => rmSync(join(root, 'AGENTS.md')),
};
for (const id of ['audit-glossary', 'audit-glossary-decline']) {
  for (const [name, mutate] of Object.entries(noWriteMutations)) {
    test(`${id} no-write boundary: ${name}`, async (t) => {
      let turns = 0;
      const result = await runCase(id, context(t, ({ cwd, turn }) => {
        turns = turn;
        if (turn === 1) mutate(cwd);
        else writeFileSync(join(cwd, 'GLOSSARY.md'), APPROVED_AFTER);
      }));
      assert.equal(result.status, name === 'none' ? 'pass' : 'fail', result.cause || name);
      if (name !== 'none') {
        assert.equal(turns, 1, 'must stop before granting consent after any unapproved write');
        assert.match(result.cause, /unapproved glossary review changed|declined migration/);
      }
    });
  }
}
for (const change of ['unrelated-file', 'rewrite-conventions', 'symlink']) {
  test(`approved migration rejects unrelated mutation: ${change}`, async (t) => {
    const result = await runCase('audit-glossary', context(t, ({ cwd, turn }) => {
      if (turn === 2) {
        writeFileSync(join(cwd, 'GLOSSARY.md'), APPROVED_AFTER);
        noWriteMutations[change](cwd);
      }
    }));
    assert.equal(result.status, 'fail');
    assert.match(result.cause, /unrelated paths/);
  });
}

// Independent first/append mutations. Test each definition and each convention
// boundary separately so a first-turn failure cannot mask an append defect.
const maintenanceMutations = [
  ['none', 0, () => {}],
  ['wrong-first-definition', 1, (root) => rewrite(root, (s) => s.replace('A native repository contribution.', 'Wrong first definition.'))],
  ['wrong-appended-definition', 2, (root) => rewrite(root, (s) => s.replace('A multi-repo product.', 'Wrong appended definition.'))],
  ['append-rewrites-first-definition', 2, (root) => rewrite(root, (s) => s.replace('A native repository contribution.', 'Wrong first definition.'))],
  ['first-replaces-conventions', 1, noWriteMutations['rewrite-conventions']],
  ['append-replaces-conventions', 2, noWriteMutations['rewrite-conventions']],
  ['append-deletes-conventions', 2, (root) => rmSync(join(root, 'CONVENTIONS.md'))],
  ['second-table', 2, (root) => rewrite(root, (s) => s.replace('| Federation', '\n| Term | Definition |\n|------|------------|\n| Federation'))],
  ['extra-first-term', 1, (root) => rewrite(root, (s) => s + '| Placeholder | Unrequested. |\n')],
  ['duplicate-appended-term', 2, (root) => rewrite(root, (s) => s + '| Federation | A multi-repo product. |\n')],
  ['append-drops-first-row', 2, (root) => rewrite(root, (s) => s.replace('| Delivery | A native repository contribution. |\n', ''))],
  ['append-changes-title', 2, (root) => rewrite(root, (s) => s.replace('# Glossary', '# Changed'))],
  ['first-hides-definition', 1, (root) => rewrite(root, (s) => s.replace('A native repository contribution.', '<!-- A native repository contribution. -->Wrong.'))],
  ['append-hides-definition', 2, (root) => rewrite(root, (s) => s.replace('A multi-repo product.', '<!-- A multi-repo product. -->Wrong.'))],
];
for (const [name, mutateTurn, mutate] of maintenanceMutations) {
  test(`add-convention exact maintenance control: ${name}`, async (t) => {
    let turns = 0;
    const result = await runCase('add-convention-maintenance', context(t, ({ cwd, turn, prompt }) => {
      turns = turn;
      assert.match(prompt, /Do not record or edit any CONVENTIONS.md rule/);
      if (turn === 1) writeFirstGlossaryTerm(cwd);
      else appendGlossaryTerm(cwd);
      assert.ok(prompt.endsWith(readFileSync(join(cwd, 'GLOSSARY.md'), 'utf8')), 'host receives complete expected artifact');
      if (turn === mutateTurn) mutate(cwd);
    }));
    assert.equal(turns, mutateTurn === 1 ? 1 : 2);
    assert.equal(result.status, name === 'none' ? 'pass' : 'fail', result.cause || name);
    if (name !== 'none') assert.match(result.cause, /entr|CONVENTIONS|canonical|repeats|artifact/);
  });
}

// A successful-looking tree after a failed host process is not qualification.
for (const [id, failTurn] of [['audit-glossary', 1], ['audit-glossary', 2],
  ['audit-glossary-decline', 1], ['add-convention-maintenance', 1], ['add-convention-maintenance', 2]]) {
  test(`${id} rejects host failure on turn ${failTurn}`, async (t) => {
    const result = await runCase(id, context(t, ({ cwd, turn }) => {
      if (id === 'audit-glossary' && turn === 2) writeFileSync(join(cwd, 'GLOSSARY.md'), APPROVED_AFTER);
      if (id === 'add-convention-maintenance') {
        if (turn === 1) writeFirstGlossaryTerm(cwd); else appendGlossaryTerm(cwd);
      }
      return { exit: turn === failTurn ? 1 : 0, stdout: '', stderr: '' };
    }));
    assert.equal(result.status, 'fail');
    assert.match(result.cause, /did not complete/);
  });
}

const NO_TITLE_BEFORE = readFileSync(new URL('../fixtures/glossary/headings-h1-no-title.md', import.meta.url), 'utf8');
const NO_TITLE_AFTER = '# Glossary\n\n| Term | Definition |\n|------|------------|\n' +
  '| <a id="delivery"></a>Delivery | A native contribution. See [Federation](#federation). |\n' +
  '| <a id="federation"></a>Federation | A multi-repo product. See [Delivery](#delivery). |\n';
test('no-title multiple-H1 fixture preserves both complete definitions and targets', () => {
  assert.deepEqual(glossaryHeadingAnchors(NO_TITLE_BEFORE), ['delivery', 'federation']);
  assert.doesNotThrow(() => assertGlossaryAnchorsPreserved(NO_TITLE_BEFORE, NO_TITLE_AFTER));
});
for (const [name, replacement] of [
  ['reported-dropped-first-anchor', ''], ['wrong-first-anchor', '<a id="deliver"></a>'],
  ['comment-only-first-anchor', '<!-- <a id="delivery"></a> -->'],
  ['inline-code-first-anchor', '`<a id="delivery"></a>`'],
]) {
  test(`no-title anchor control: ${name}`, () => {
    assert.throws(() => assertGlossaryAnchorsPreserved(NO_TITLE_BEFORE,
      NO_TITLE_AFTER.replace('<a id="delivery"></a>', replacement)), /dropped heading anchors: delivery/);
  });
}
test('fenced phantom first anchor does not satisfy an incoming link', () => {
  const after = NO_TITLE_AFTER.replace('<a id="delivery"></a>', '') + '\n```html\n<a id="delivery"></a>\n```\n';
  assert.throws(() => assertGlossaryAnchorsPreserved(NO_TITLE_BEFORE, after), /delivery/);
});
test('noncanonical document title is conservatively preserved, regardless of following heading level', () => {
  for (const next of ['# Federation', '## Federation']) {
    assert.deepEqual(glossaryHeadingAnchors('# Vocabulary\n\nIntro.\n\n' + next + '\n\nTwo.\n'), ['vocabulary', 'federation']);
    assert.deepEqual(glossaryHeadingAnchors('# Delivery\n\nOne.\n\n' + next + '\n\nTwo.\n'), ['delivery', 'federation']);
  }
  assert.deepEqual(glossaryHeadingAnchors('# Delivery\n\nOne.\n'), ['delivery']);
});
test('lossless oracle requires a complete artifact, not an optional fragment whitelist', () => {
  const artifact = '| Term | Definition |\n|------|------------|\n| A | One. |\n';
  const entries = [{ term: 'A', definition: 'One.' }];
  assert.throws(() => assertGlossaryLossless(artifact, { entries, prose: ['One.'] }), /requires a complete expected artifact/);
  assert.doesNotThrow(() => assertGlossaryLossless(artifact, { entries, artifact }));
  assert.doesNotThrow(() => assertGlossaryLossless(artifact.replaceAll('\n', '\r\n'), { entries, artifact }));
});
