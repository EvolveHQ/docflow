# Evals — behavioural / e2e tier (ADR 0012)

Two tiers of testing back this plugin:

- **Static tier (ADR 0011)** — `scripts/verify.mjs`, the verify gate.
  Deterministic, no model. Validates skill/manifest structure, ADR
  catalogue integrity, and ADR-privacy. Runs on every push.
- **Behavioural tier (ADR 0012)** — *this directory.* Runs a skill
  through a coding agent against a fixture repo and asserts the result.
  Model-in-the-loop; a release gate, not a per-push gate.

## Two supported behavioural runners

The opt-in `behavioural.workflow.mjs` uses native worktree subagents. The
independent vendor-host Docker runner under [hosts/](hosts/README.md) uses
actual installed CLIs or the Cowork desktop and externally checks target
files and Git state. Record the actual model and permission context; a
model's success claim or CLI exit zero is insufficient.

`node evals/run.mjs` runs deterministic checks and explicitly skips model
cases. It is not a complete behavioural release gate. Model tests use
disposable fixtures and local bare remotes; the real repo is never writable.
Freeze the tested plugin snapshot and record its revision plus digest,
especially when a host caches an installation or a working tree has edits.

Final reports are checked by `reporting.mjs`; missing blocks fail independently
of a model's verdict. Host evidence and remaining gaps are recorded in
`hosts/results/2026-09-11.json`. The full delegated-host/release matrix remains
pending while pi's tested configuration fails and Cowork cannot write target
Git history in its observed cloud-connector session.

## Fixtures

`fixtures/<name>/` holds a checked-in repository state a case needs and
this repo cannot itself be. Each fixture carries a `README.md` saying
what makes it what it is and what a case should expect from it.

- **`fixtures/legacy-range/`** — a range-numbered catalogue as bootstrap
  scaffolded a two-shape repo before the shape became a declared field:
  a cutoff in `CONVENTIONS.md`, `adr/0100-template.md` at the boundary,
  capability `0001`–`0003` below it, technology `0101`–`0102` above,
  cross-references both ways, and the seed record as the exception the
  range forces. It feeds the legacy-detection and migration case
  (adr/0035-range-numbered-catalogue-migration.md AC1–AC9).
- **`fixtures/scratch-gate/`** — a runnable verify gate for a freshly
  scaffolded repo (node built-ins only, exit 0 on a sane tree). The
  bootstrap case copies it to `<scratch>/tools/verify.mjs` **before**
  invoking the skill and records `node tools/verify.mjs` as its Q8
  answer, so the gate the scaffolded repo records is one it can actually
  run — bootstrap does not install this checkout's `scripts/verify.mjs`.

A fixture is a directory of files, not a git repo. A case that migrates
or otherwise mutates one **copies it to a scratch directory first** —
mutating it in place destroys the state it exists to provide. A
deterministic self-check case guards each fixture's defining properties,
so a fixture that silently rots fails `npm run evals` rather than
quietly making a behavioural case vacuous.
