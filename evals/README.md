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

## Layers

- **Self-checks** (`cases.mjs`, `agentDependent: false`): this repo as
  fixture — catalogue invariants, capability manifest shape, trust
  posture present, evidenced ADRs backed (digests recomputed), CON
  entries valid, abandonment documented.
- **Mutation suite** (`mutations.mjs` + cases): cuts a pristine copy of
  committed HEAD (`git archive`), applies one mutation, runs the static
  gate **in the copy**, asserts the expected FAIL (or green, for
  positive cases). Encodes permanently the by-hand mutation tests run
  at each slice's ship: evidence-digest drift, illegal manifest model,
  reserved `autonomy` set, illegal constraint source, duplicate
  constraint id, malformed dropped item, orphan evidence directory —
  plus baseline-green and Withdrawn-accepted positives. The live
  working tree is never touched.
- **Behavioural** (`behavioural.workflow.mjs`): worktree-subagent
  cases — bootstrap (full + express, both asserting the manifest and
  express asserting constraints stay off), evidence-regime ship
  (records written, digests gate-validated), partial-evidence refusal
  (Implemented withheld, no invented attestations),
  supersession-timing (predecessor untouched at Proposed), withdrawn
  proposal (kept, never deleted), gated-boundary routing (no ungated
  CON entry), and a full 18-check audit run.

## Status

- Deterministic layer (self-checks + mutation suite): **green** —
  `npm run evals`.
- Behavioural layer: **authored**; individual cases have been
  demonstrated live at ships (`new-adr` via a worktree subagent; the
  evidence flow and mutation checks at the S1–S3 ships). Running the
  full suite green via the Workflow tool is the release gate for the
  next published version.
