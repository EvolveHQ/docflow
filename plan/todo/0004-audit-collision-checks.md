# 0004 — Audit checks for cross-worktree semantic collisions

Owning ADR: adr/0010-worktree-conflict-reconciliation.md

## Scope

Extend `/audit` with the collision/contradiction checks that catch a
semantic conflict before it lands.

## Exit criteria

Maps to adr/0010-worktree-conflict-reconciliation.md acceptance
criteria:

1. `/audit` fails on duplicate ADR numbers. → AC3
2. `/audit` fails on multiple `plan/todo/` items owning the same ADR.
   → AC3
3. `/audit` fails on the same ADR modified on two unmerged branches.
   → AC3

## Dependencies

Pairs with item 0003 (same owning ADR). Can be done after or alongside
0003; the duplicate-number and duplicate-owner checks are independent of
the reservation mechanism.
