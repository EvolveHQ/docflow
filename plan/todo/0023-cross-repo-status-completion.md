# 0023 — Cross-repo status and completion

Owning ADR: adr/0026-cross-repo-status-completion.md

## Scope

Define and surface aggregate status for a decision implemented across
repos, derived (no cross-repo writes).

- A cross-repo decision is `Implemented` only when **every** owning
  per-repo plan item has shipped under its own repo's completion event.
- **Partial implementation** ("2 of 3 repos shipped") is representable and
  visible.
- Aggregate status is a **derived column in the roll-up**, computed from
  each owning per-repo plan item's state — not hand-written into the home
  ADR.
- Extend the roll-up skill to compute and show the aggregate status column.

## Exit criteria

Maps to adr/0026-cross-repo-status-completion.md acceptance criteria:

1. Status model accommodates a decision across multiple repos. → AC1
2. `Implemented` only when every owning plan item has shipped. → AC2
3. Partial implementation is representable and visible. → AC3
4. Each repo's completion event stays its own. → AC4
5. The roll-up reflects aggregate status. → AC5
6. Aggregate status is a derived roll-up column; no cross-repo writes.
   → AC6
7. `node scripts/verify.mjs` stays green.

## Dependencies

Depends on 0022 (cross-repo plan ownership) and the roll-up (0020). Builds
on the roll-up skill rather than adding a new one.
