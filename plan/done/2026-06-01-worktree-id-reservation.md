# 0003 — Identifier reservation and single-writer rule for worktrees

Owning ADR: adr/0010-worktree-conflict-reconciliation.md

## Scope

Add identifier reservation to `agent-wave` so each spawned worktree
receives a disjoint set of ADR numbers and `plan/todo/` slots, and
record per-artefact ownership in `_agent/IN_FLIGHT.md`. Document the
single-writer-per-artefact rule in `CONVENTIONS.md` §Multi-Agent Rules.

## Exit criteria

Maps to adr/0010-worktree-conflict-reconciliation.md acceptance criteria:

1. `agent-wave` reserves and assigns disjoint ADR numbers and plan slots
   before spawning worktrees. → AC1
2. Active-worktree ownership of an ADR / plan item is recorded in
   `_agent/IN_FLIGHT.md`; convention forbids a second worktree editing an
   owned artefact. → AC2
3. The mechanism is documented in `CONVENTIONS.md` §Multi-Agent Rules
   (worktree mode). → AC4

## Dependencies

Independent of items 0001/0002. Resolve the open question (committed
registry vs orchestrator-computed) during implementation.

---

**Shipped** at HEAD `pending` (2026-06-01). `agent-wave` Step 2 now
reserves disjoint ADR-number / plan-slot blocks per worktree and enforces
single-writer-per-artefact; `_agent-IN_FLIGHT.md` template gains
**Reserved IDs** + **Owns** columns; the mode-3 block of the
`CONVENTIONS.md` template documents reservation + single-writer.
Open question resolved: orchestrator-computed reservation (no committed
registry file), recorded in `_agent/IN_FLIGHT.md`.
