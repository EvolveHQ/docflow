# 0002 — End-to-end fixture-repo eval harness

Owning ADR: adr/0012-skill-behavioural-evals.md

## Scope

Build the behavioural eval harness that runs a skill against a fixture
repository with scripted inputs and asserts the resulting state. Reuse
fixtures/assertion helpers from item 0001 where possible; may build on
the skill-creator eval tooling.

## Exit criteria

Maps to adr/0012-skill-behavioural-evals.md acceptance criteria:

1. Harness runs a named skill against a fixture repo with scripted
   inputs and asserts the file tree / content. → AC1
2. Behavioural evals exist for `bootstrap`, `new-adr`, `ship-item`. → AC2
3. Runnable on demand; designated as a release gate (separate from the
   per-push static gate). → AC3
4. Assertions tolerate incidental wording, strict on structural outcomes
   (file existence, contiguous numbering, status transitions). → AC4

## Dependencies

Depends on item 0001 (reuses its fixtures and assertion helpers).

## Progress (2026-06-02) — partial, still in todo

Deterministic scaffold landed under `evals/` (not shipped; ADR 0012
stays Accepted):

- `evals/assertions.mjs` — assertion helpers (tree, contiguous numbering,
  INDEX sync, ADR status, plan shipped); CRLF-tolerant. → satisfies AC4.
- `evals/cases.mjs` — cases for `bootstrap`, `new-adr`, `ship-item`, plus
  a self-check asserting this repo's invariants. → AC2 (definitions).
- `evals/harness.mjs` + `evals/run.mjs` — runner; `npm run evals`. The
  self-check PASSes today; agent-dependent cases SKIP. → AC3 (wiring).

## Update (2026-06-02) — runner resolved, runner = subagents

ADR 0012's open question is resolved: the runner is the host **subagent
mechanism**, not an external CLI. `evals/behavioural.workflow.mjs` is the
subagent-driven suite — one worktree subagent per case (`new-adr`,
`ship-item`, `bootstrap`) runs the skill then the static gate and reports
PASS/FAIL. The `new-adr` path was demonstrated live (worktree subagent →
contiguous 0013 + INDEX row → `verify.mjs` exit 0).

**Remaining to ship 0002 / ADR 0012 → Implemented:**

1. Commit + push these skills (worktree subagents see committed/pushed
   state, so they must include current work).
2. Run `Workflow evals/behavioural.workflow.mjs` and get all three cases
   green (tune the `ship-item` / `bootstrap` prompts if a case flakes).
3. Then `git mv` this item to `plan/done`, advance ADR 0012, regenerate
   INDEX, WORKLOG.

---

**Shipped** at HEAD `pending` (2026-06-02). The behavioural suite was run
against current local HEAD via three worktree subagents (worktrees cut
from HEAD, since the committed-state caveat means origin would be stale):

- `new-adr` → PASS: contiguous `0013` + INDEX row; `verify.mjs` exit 0
  (`OK …, 8 skills, 13 ADRs`).
- `ship-item` → PASS: item moved todo→done, owning ADR → Implemented;
  `verify.mjs` exit 0.
- `bootstrap` → PASS: fresh repo got all 8 required paths; mode-1
  omissions (no LOCKS, no autonomous prompt) correct.

All AC met: AC1 (skill→fixture→assert), AC2 (all three skills), AC3
(runnable on demand; `evals/behavioural.workflow.mjs` for repeatable
runs), AC4 (strict structural assertions). The runner is the subagent
mechanism — no external CLI/key/model.
