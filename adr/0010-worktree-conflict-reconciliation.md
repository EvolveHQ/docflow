---
adr: 0010
title: Content-level conflict reconciliation across worktrees
status: Implemented
date: 2026-06-01
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0005", "0007"]
tags: [coordination, agents, conflicts]
---

# ADR 0010 — Content-level conflict reconciliation across worktrees

## Context

adr/0005-multi-agent-coordination.md decided which `_agent/` files exist
per mode and handles the **mechanical** merge layer for worktree mode:
`_agent/WORKLOG.md` uses `merge=union`, `CURRENT_FOCUS.md` is local-only,
and `_agent/IN_FLIGHT.md` is the committed dashboard — a file since
retired by
adr/0038-in-flight-state-derived-from-branches-and-pull-requests.md,
which moves the ownership record onto the claiming branch and its pull
request. That solves
line-level git conflicts on the coordination files. It does **not**
address **semantic** conflicts in the documentation artefacts themselves
when several worktrees run in parallel (e.g. under
adr/0007-lifecycle-skills.md `agent-wave`):

- Two worktrees independently pick the same next ADR number, breaking the
  contiguous-numbering invariant.
- Two worktrees author `plan/todo/` items that own the same ADR or target
  the same files.
- Two worktrees edit the *same* ADR body in contradictory ways — a
  union-merge would silently concatenate both, producing an incoherent
  document that still "merges clean".

Ordinary git merge resolution cannot detect these because the artefacts
are content, not code, and the invariants are docflow's, not git's.

## Capability statement

docflow defines how parallel worktrees **reserve identifiers** and
**reconcile contradictory edits** to shared documentation artefacts,
beyond git's line-level merge:

- **Identifier reservation.** Before fan-out, the orchestrator
  (`agent-wave`) pre-allocates the ADR numbers and `plan/todo/` slots
  each worktree may use, so no two worktrees claim the same number.
- **Single-writer-per-artefact.** An ADR body (or a given `plan/` item)
  is owned by at most one active worktree at a time; ownership is
  declared by the branch that claims the item — `claim/<item-key>`,
  pushed for it — and by its pull request, whose description (or, under
  direct-to-main, the branch's first commit message) lists the reserved
  identifier block and the artefacts that worktree is the single writer
  of. Two worktrees never edit the same ADR concurrently.
- **Collision detection at integration.** `/audit` gains checks that
  fail on duplicate ADR numbers, two `plan/todo/` items owning the same
  ADR, or an ADR edited in two unmerged branches, so a semantic conflict
  is caught before it lands rather than after.

## User stories / scenarios

- As an orchestrator fanning out a wave, I want each worktree handed a
  disjoint set of ADR numbers and plan slots, so the contiguous-numbering
  invariant survives parallelism.
- As a maintainer merging worktree results, I want `/audit` to flag two
  worktrees that touched the same ADR, so contradictory edits do not
  merge silently.

## Acceptance criteria

1. `agent-wave` reserves and assigns disjoint ADR numbers and
   `plan/todo/` slots to each worktree before spawning them.
2. Ownership of an ADR / plan item by an active worktree is recorded by
   the claim branch pushed for the item and its pull request — the
   branch name carries the item, the pull-request description (or the
   branch's first commit message under direct-to-main) carries the
   reserved block and the owned artefacts — and the convention forbids a
   second worktree from editing an owned artefact.
3. `/audit` fails on: duplicate ADR numbers, multiple `plan/todo/` items
   owning the same ADR, and the same ADR modified on two unmerged
   branches.
4. The mechanism is documented in `CONVENTIONS.md` §Multi-Agent Rules for
   worktree mode.

## Out of scope

- Ordinary code (non-artefact) merge conflicts — those are resolved by
  git as usual.
- The mechanical `_agent/` file merge strategy — already decided in
  adr/0005-multi-agent-coordination.md.

## Open questions

- ~~Should reservation be a committed registry file or computed by the
  orchestrator at spawn time?~~ Resolved: orchestrator-computed at spawn
  time, handed to each agent in the wave specification and restated by
  it in its pull request. Nothing is committed for it — no registry
  file, and (since r3) no dashboard either; the reservation is
  orchestrator state that expires with the wave.

## References

- adr/0005-multi-agent-coordination.md
- adr/0007-lifecycle-skills.md
- adr/0038-in-flight-state-derived-from-branches-and-pull-requests.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-01 | r1 | Eugenio Minardi | Initial decision. |
| 2026-06-01 | r2 | Eugenio Minardi | Implemented (plan items 0003, 0004): agent-wave reservation + single-writer, IN_FLIGHT columns, audit check 11, CONVENTIONS template. Open question resolved (orchestrator-computed). Status Accepted → Implemented. |
| 2026-09-07 | r3 | Eugenio Minardi | The ownership record moves off the retired dashboard onto the claim: AC2 and the single-writer-per-artefact rule now name the `claim/<item-key>` branch pushed for the item and its pull request, whose description (or first commit message under direct-to-main) carries the reserved block and the owned artefacts. The open-question resolution drops the registry-versus-dashboard framing — reservation is orchestrator state handed out in the wave specification and committed nowhere. Context notes the dashboard's retirement. Stays Implemented. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-06-01 | — |
| Maintainer | Eugenio Minardi | 2026-09-07 | — (delegated) |
