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

**Blocked / remaining for AC1:** the `runAgent()` seam in
`evals/harness.mjs` throws `RunnerNotConfigured`. Implementing it needs
the **headless agent runner** decision — ADR 0012's open question (which
non-interactive runner drives a skill, and whether evals pin a model).
Once decided: implement `runAgent`, add per-case `setup()` fixtures + real
`inputs`, flip cases SKIPPED → PASS/FAIL, then ship (ADR 0012 →
Implemented).
