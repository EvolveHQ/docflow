// Bounded, explicit fixture contract, not a Markdown migration algorithm.
// Keep the complete before/after pair: even one lost prose word changes the
// approved migration. A source-fixture change requires reviewing this pair.
export const GLOSSARY_MIXED_BEFORE = '# Glossary\n\n' +
  'Shared terms for the fixture repository. Entries predate the canonical\nshape.\n\n' +
  '## Delivery\n\nA native repository contribution.\n\n' +
  '| Term | Meaning |\n|------|---------|\n| Federation | A multi-repo product. |\n\n' +
  '- `workspace` — the coordination layer.\n' +
  '- Pipe — a literal \\| inside a definition.\n\n' +
  'See the [member index](federation-index.md) for repositories.\n';

export const GLOSSARY_MIXED_EXPECTED = {
  artifact: '# Glossary\n\n' +
    'Shared terms for the fixture repository. Entries predate the canonical\n' +
    'shape. See the [member index](federation-index.md) for repositories.\n\n' +
    '| Term | Definition |\n|------|------------|\n' +
    '| <a id="delivery"></a>Delivery | A native repository contribution. |\n' +
    '| Federation | A multi-repo product. |\n' +
    '| `workspace` | the coordination layer. |\n' +
    '| Pipe | a literal \\| inside a definition. |\n',
  entries: [
    { term: '<a id="delivery"></a>Delivery', definition: 'A native repository contribution.' },
    { term: 'Federation', definition: 'A multi-repo product.' },
    { term: '`workspace`', definition: 'the coordination layer.' },
    { term: 'Pipe', definition: 'a literal \\| inside a definition.' },
  ],
};

// Full replacement hunk, supplied verbatim in the authorised host prompt.
// No approval of an as-yet-unseen host proposal is implied.
const diffLines = (text, prefix) => text.slice(0, -1).split('\n').map((line) => prefix + line);
export const GLOSSARY_MIXED_APPROVED_DIFF = [
  '--- a/GLOSSARY.md', '+++ b/GLOSSARY.md',
  `@@ -1,${GLOSSARY_MIXED_BEFORE.split('\n').length - 1} +1,${GLOSSARY_MIXED_EXPECTED.artifact.split('\n').length - 1} @@`,
  ...diffLines(GLOSSARY_MIXED_BEFORE, '-'),
  ...diffLines(GLOSSARY_MIXED_EXPECTED.artifact, '+'),
].join('\n') + '\n';

// Synthetic control output; never native-host evidence.
export function renderCanonicalMixedGlossary() {
  return GLOSSARY_MIXED_EXPECTED.artifact;
}

export const GLOSSARY_FIRST_EXPECTED = {
  artifact: '# Glossary\n\n| Term | Definition |\n|------|------------|\n' +
    '| Delivery | A native repository contribution. |\n',
  entries: [{ term: 'Delivery', definition: 'A native repository contribution.' }],
};
export const GLOSSARY_APPEND_EXPECTED = {
  artifact: GLOSSARY_FIRST_EXPECTED.artifact + '| Federation | A multi-repo product. |\n',
  entries: [
    ...GLOSSARY_FIRST_EXPECTED.entries,
    { term: 'Federation', definition: 'A multi-repo product.' },
  ],
};
