# Evals — behavioural / e2e tier (ADR 0012)

Two tiers of testing back this plugin:

- **Static tier (ADR 0011)** — `scripts/verify.mjs`, the verify gate.
  Deterministic, no model. Validates skill/manifest structure, ADR
  catalogue integrity, and ADR-privacy. Runs on every push.
- **Behavioural tier (ADR 0012)** — *this directory.* Runs a skill
  through a coding agent against a fixture repo and asserts the result.
  Model-in-the-loop; a release gate, not a per-push gate.

## Status: scaffold

The deterministic pieces are done and runnable:

- `assertions.mjs` — assertion helpers (tree, contiguous numbering,
  INDEX sync, ADR status, plan shipped). CRLF-tolerant.
- `cases.mjs` — eval case definitions for `bootstrap`, `new-adr`,
  `ship-item`, plus a **self-check** that asserts this repo (a valid
  bootstrapped fixture) satisfies its own invariants.
- `harness.mjs` / `run.mjs` — the runner.

The one missing piece is the **headless agent runner** — how an agent is
driven through a skill non-interactively. That is ADR 0012's open
question. Until it is chosen and `runAgent()` in `harness.mjs` is
implemented, agent-dependent cases report **SKIPPED**; the self-check
still runs and must pass.

```
npm run evals
```

## Finishing item 0002

1. Decide the runner (e.g. a non-interactive CLI that loads this plugin
   and runs a named skill with scripted answers) and whether evals pin a
   model — see `plan/todo/0002-e2e-fixture-harness.md`.
2. Implement `runAgent({ repo, skill, inputs })` in `harness.mjs`.
3. Give each agent-dependent case a `setup()` that builds its fixture
   repo and real `inputs`.
4. Flip the cases from SKIPPED to PASS/FAIL and designate `npm run evals`
   a release gate.
