# Evals — behavioural / e2e tier (ADR 0012)

Two tiers of testing back this plugin:

- **Static tier (ADR 0011)** — `scripts/verify.mjs`, the verify gate.
  Deterministic, no model. Validates skill/manifest structure, ADR
  catalogue integrity, and ADR-privacy. Runs on every push.
- **Behavioural tier (ADR 0012)** — *this directory.* Runs a skill
  through a coding agent against a fixture repo and asserts the result.
  Model-in-the-loop; a release gate, not a per-push gate.

## The runner is the subagent mechanism

There is **no external headless runner, API key, or pinned model**. The
agent that drives a skill is the host's own subagent mechanism: one
worktree-isolated subagent per case runs the named skill, then runs the
deterministic layer (`scripts/verify.mjs` + `assertions.mjs`) inside its
worktree and reports PASS/FAIL.

A plain `node` process cannot spawn subagents, so the suite splits in two:

| Layer | File | How to run |
|-------|------|------------|
| Deterministic self-check + assertion helpers | `assertions.mjs`, `cases.mjs`, `harness.mjs`, `run.mjs` | `npm run evals` |
| Behavioural (subagent-driven) suite | `behavioural.workflow.mjs` | the Workflow tool (opt-in) |

```
npm run evals                                  # deterministic; self-check PASS, behavioural cases SKIP
Workflow({ scriptPath: 'evals/behavioural.workflow.mjs' })   # spawns a worktree subagent per skill case
```

### Caveat: evals see committed state

A worktree subagent's checkout is cut from a **committed ref** (e.g.
`origin/main`), so the behavioural suite evaluates committed/pushed
skills — not uncommitted local edits. Commit (and push, for shared runs)
before evaluating. This was confirmed empirically: an early `new-adr`
subagent eval ran against `origin/main` and so saw the pre-expansion
`verify.mjs`.

## Status

- Deterministic layer: **done**. `npm run evals` self-check passes
  against this repo as a fixture.
- Behavioural layer: **authored** as `behavioural.workflow.mjs` with
  cases for `new-adr`, `ship-item`, `bootstrap`, and the legacy-range
  migration. The `new-adr` path has
  been demonstrated live (a worktree subagent produced a contiguous ADR +
  INDEX row; the static gate passed). Running the full suite as a green
  release gate is the remaining step for plan item 0002.

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
