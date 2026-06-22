# 0022 — Cross-repo plan ownership

Owning ADR: adr/0025-cross-repo-plan-ownership.md

## Scope

Codify how a cross-repo decision's work is tracked, in the federation
conventions and the plan/new-plan guidance.

- A cross-repo decision has **one plan item per affected repo**, each
  living in the repo whose code it changes and naming the owning ADR by
  its federation identity.
- Per-repo "lower numbers first" ordering is unchanged.
- The owning ADR is the **single grouping point** — its per-repo plan
  items are discoverable from it; **no umbrella record**.
- new-plan guidance: when an owning ADR lives in another repo, reference
  it via the logical identity.

## Exit criteria

Maps to adr/0025-cross-repo-plan-ownership.md acceptance criteria:

1. One plan item per affected repo, naming the owning ADR by federation
   identity. → AC1
2. Each item lives in the repo it changes. → AC2
3. Per-repo ordering preserved. → AC3
4. A plan item may reference a home-repo ADR via the cross-repo reference
   scheme. → AC4
5. The set of plan items is discoverable from the owning ADR. → AC5
6. No umbrella record; the owning ADR is the grouping point. → AC6
7. `node scripts/verify.mjs` stays green.

## Dependencies

Depends on the shipped identity (0018) and references (0019). Status of a
cross-repo decision is out of scope here — owned by
adr/0026-cross-repo-status-completion.md.
