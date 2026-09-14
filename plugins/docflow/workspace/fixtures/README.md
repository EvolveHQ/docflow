# Workspace producer fixtures

`two-repository/` is a synthetic, valid workspace evaluated at
`2026-09-15T13:00:00Z`. `manifest.json` lists full canonical record paths and
expected consumer observations. API uses native numbered decisions; mobile
uses an issue reference. Their rules remain different and unchanged.

The seven records show a selected idea, accepted agreement, sourced knowledge,
active work, a stopped API attempt, reconciled reassignment with a successful
return, and a stopped mobile attempt after revocation. Provider completion is
a separate native observation; overall completion remains false. Every actor,
mandate, command output and Git revision is synthetic and labelled as such.

`adverse.json` contains portable mutation recipes over that exact fixture.
Each operation edits one JSON metadata field or file and names expected
diagnostic codes. `materialise.mjs` copies the base and applies one recipe
to a new, non-existing destination. It performs no native Git/host actions.
The test suite exercises these real files through the shipped validator.

```text
node validate.mjs fixtures/two-repository --at 2026-09-15T13:00:00Z
node fixtures/materialise.mjs invalid-agreement-state <new-destination>
node validate.mjs <new-destination> --at 2026-09-15T13:00:00Z
```

The first command exits 0. The adverse case exits 1 with `schema` diagnostics
and preserves readable unaffected records. Tests additionally cover valid
empty/planned, running/resume, complete, reference-only, sibling/external
member, two-workspace, collision extension and historical comparison cases.
Consumer reads/copy/handoff must leave these bytes unchanged; compare file
digests before and after the consumer session and pin the Docflow source SHA.

## Status at a glance

- **This run:** Provides source-controlled synthetic producer inputs and expected outcomes.
- **Overall:** partially verified — supplied facts are deterministic examples, not native evidence.
- **Yet to do:** Consume the pinned fixtures in Clarity and qualify actual
  workspace skills, eighteen scenarios and six host guides separately.
