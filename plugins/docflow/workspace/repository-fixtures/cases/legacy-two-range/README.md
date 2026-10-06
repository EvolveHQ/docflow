# legacy-range fixture

A **range-numbered** ADR catalogue, as `bootstrap` scaffolded a two-shape
repo before the shape became a declared `shape:` metadata field. It is the
input for the legacy-detection and migration eval (adr/0035 AC1–AC9).

What makes it legacy:

- `CONVENTIONS.md` §ADR Shapes records a **cutoff** (`0100`) and a
  "recorded exception" clause for the seed ADR.
- `adr/0100-template.md` — the technology template numbered at the
  boundary, not `0000`.
- Capability ADRs `0001`–`0003` below the cutoff, technology ADRs
  `0101`–`0102` at or above it, with the gap between the blocks.
- No ADR carries a `shape:` field; `INDEX.md` has no Shape column.
- `0001` is the seed: technology-shaped but below the cutoff — the
  exception the range encoding forces.

Cross-references run **both ways**: capability `0003` depends on
technology `0101`, technology `0102` depends on capability `0002` and on
technology `0101`. `plan/todo/`, `plan/done/`, and `domains/platform/`
all name numbers that move.

Expected migration (highest capability ADR is `0003`):

| old | new |
|---|---|
| `0101-markdown-files-in-git` | `0004-markdown-files-in-git` |
| `0102-static-verify-script` | `0005-static-verify-script` |

`0001`–`0003` keep their numbers; `0001` keeps its number **and** gains
`shape: technology` — a technology-shaped ADR inside the old capability
range is not renumbered, it just declares what it always was.
`plan/done/` footers keep the old numbers: they are history.

The fixture is a directory of files, not a git repo. A case that needs to
run the migration copies it into a scratch directory first and works
there — never in place, or the fixture stops being a legacy catalogue.
