// The explicit ordered expected mapping for the mixed glossary fixture used
// by the host qualification case and its hostless controls. This is the
// contract a lossless migration must satisfy: original term spelling,
// definition wording, entry order, prose, link, inline code, escaped pipe
// and the preserved `#delivery` heading anchor — nothing added or reworded.
export const GLOSSARY_MIXED_EXPECTED = {
  prose: [
    'Shared terms for the fixture repository. Entries predate the canonical',
    'See the [member index](federation-index.md) for repositories.',
  ],
  entries: [
    { term: '<a id="delivery"></a>Delivery', definition: 'A native repository contribution.' },
    { term: 'Federation', definition: 'A multi-repo product.' },
    { term: '`workspace`', definition: 'the coordination layer.' },
    { term: 'Pipe', definition: 'a literal \\| inside a definition.' },
  ],
};

// Render exactly that canonical file. Used by the synthetic control adapter;
// it is never native-host evidence.
export function renderCanonicalMixedGlossary() {
  return '# Glossary\n\n' +
    'Shared terms for the fixture repository. Entries predate the canonical\n' +
    'shape. See the [member index](federation-index.md) for repositories.\n\n' +
    '| Term | Definition |\n|------|------------|\n' +
    '| <a id="delivery"></a>Delivery | A native repository contribution. |\n' +
    '| Federation | A multi-repo product. |\n' +
    '| `workspace` | the coordination layer. |\n' +
    '| Pipe | a literal \\| inside a definition. |\n';
}
