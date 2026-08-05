# Glossary

Shared terms for this repo — one entry per term, kept short. Terms are
added through the convention skill (which routes a shared definition
here) or directly; keep entries alphabetical.

## Attestation
A named human's recorded confirmation that a `manual`-verified
criterion holds — verifier ≠ implementer, with date and scope. Never
invented; a missing attestation leaves the criterion unevidenced.

## Autonomy level
The manifest's `autonomy:` grant (`L0`–`L5`): how much an agent may
initiate **unattended**. Absent = no grant. Attended work is
unaffected at every level; eight escalation triggers bind at all of
them.

## Bound evidence record
An append-only file `evidence/<record-slug>/AC<n>-<seq>.md` tying a
criterion's content digest to an execution transcript (method,
source commit, exit code, verifier). Never edited; corrections and
re-executions are new records.

## Candidate branch
A `v1/<approach>` development line. `main` is the released line,
frozen at the last release tag; exactly one candidate is promoted to
it; alternatives are archived unmerged.

## Capability manifest
`docflow.yml` at the artefact root — schema, record model, enabled
layers, evidence adoption commit, autonomy grant. On disagreement
with prose, the manifest wins.

## Coverage walk
`COVERAGE.md`, the generated chain goal → serving record → criteria
evidence state → plan items. Derived, never hand-edited.

## Escalation trigger
One of the eight events an unattended agent always surfaces to the
operator (constraint or goal changes, acceptance, supersession,
outward commitments, gate changes, untraceable work, constraint
conflicts). The list is the autonomy boundary; everything not on it
is delegated.

## Goal
A per-file record (`goals/G-<kebab-slug>.md`) of an outcome sought:
statement, measure, horizon, review-by, state. The top of the
traceability chain; 3–7 Active is the guide.

## Lineage (`migrated-from:`)
The front-matter link a migrated record carries to its old path.
Tooling follows it so pre-move evidence keeps resolving; the mapping
file (`MIGRATION.md`) accounts for the numbering gaps moves leave.

## Measure
How the world looks different if a goal is met — with recommended
`baseline` / `threshold` / `source`. A goal that cannot name one can
never be validated.

## Outcome entry
An append-only `### Cycle <n> — <date>` record in a goal file:
verdict, measure before/after, basis, harm (or none), disposition
when harm exists, and the human who decided.

## Promotion
The operator's decision that fast-forwards `main` to the winning
candidate, recorded on that candidate. The only way the released
line advances, apart from a tagged hotfix.

## Record model
Where capability content lives: `capability-first` (default),
`two-shape`, `decisions+specs`, or `decisions-only`. A re-run never
converts it; migration is the sanctioned path.

## Verdict
The human judgement closing a validation cycle: `achieved`,
`not-achieved-execution`, `not-achieved-hypothesis`, or
`inconclusive` — each with a defined goal transition. Harm is not a
verdict.

## Verify method
The trailing `Verify:` line on every in-scope acceptance criterion —
an inline command, `gate-check`, or `manual` — naming how the
criterion is checked and evidenced.
