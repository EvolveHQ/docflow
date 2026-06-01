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
