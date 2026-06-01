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
  cases for `new-adr`, `ship-item`, `bootstrap`. The `new-adr` path has
  been demonstrated live (a worktree subagent produced a contiguous ADR +
  INDEX row; the static gate passed). Running the full suite as a green
  release gate is the remaining step for plan item 0002.
