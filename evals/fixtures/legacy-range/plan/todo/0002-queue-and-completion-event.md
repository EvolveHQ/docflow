# 0002 — Queue and completion event

Owning ADR: adr/0003-queue-driven-implementation.md

## Scope

Create `plan/todo/` and `plan/done/`, document the completion event, and
make the status advance part of the same commit.

## Exit criteria

Maps to adr/0003-queue-driven-implementation.md acceptance criteria:

1. Every Accepted record has a todo item. -> AC1
2. Every Implemented record has a done entry. -> AC2
3. Shipped entries name the shipping commit. -> AC3

## Dependencies

None.
