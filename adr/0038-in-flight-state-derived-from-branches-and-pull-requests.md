---
adr: 0038
title: In-flight state is derived from branches and pull requests
status: Proposed
date: 2026-09-04
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0036", "0006", "0010", "0014"]
tags: [coordination, worktrees, concurrency, audit]
---

# ADR 0038 — In-flight state is derived from branches and pull requests

## Context

The committed dashboard was the separate-worktree mode's answer to
"what is happening right now": one row per active worktree, added by
the owning agent when it opens and removed when it closes, carrying
the reserved identifier block and the artefacts the worktree is the
single writer of. adr/0010-worktree-conflict-reconciliation.md made it
the ownership record; adr/0014-concurrency-guardrails.md named it as a
way to claim an item.

Under pull-request integration the row cannot do its job. It is added
on the work branch, so it reaches `main` only when the implementation
pull request merges; it is then removed by a second pull request. On
`main` the row is therefore invisible for the whole time the work is
in flight and present only after the work has landed. Other worktrees
would have to read one another's branches to see a live row, and no
instruction tells them to. Under direct-to-main integration a
worktree could push its row first, but nothing says so either. The
product text around the file had also drifted: its removal trigger is
stated four different ways, the templates disagree on its columns,
the orchestrator's stop path never cleans it, its cleanup step runs in
a mode that has no such file, and an unused reservation is never
released.

Meanwhile the true in-flight state was always visible in git: the
worktrees on this machine, the branches on the remote, and the draft
pull requests. The dashboard was a hand-written index over them, and
the pull request was already declared the authoritative lock.

## Capability statement

What is in flight is **derived from branches and pull requests**,
never stored in a file:

- **The claim** on a queue item is a pushed work branch named for that
  item, `<actor>/NNNN-<slug>` where `NNNN` is the plan number and the
  actor is an agent id or a human handle, together with a draft pull
  request opened from it where integration is pull-request based. A
  merged or deleted branch is no longer a claim.
- **The in-flight view** is computed on demand from `git worktree
  list`, the remote branches matching the naming convention, and the
  draft pull requests when a remote and a pull-request host are
  reachable. Audit renders it and checks it; the "Picking up this
  repo" read order names the commands.
- **Ownership** of ADRs and plan items by a worktree, as required by
  adr/0010-worktree-conflict-reconciliation.md, is recorded in the
  claiming branch and pull request: the branch name carries the item,
  and the pull-request description (or, direct-to-main, the branch's
  first commit message) lists the reserved identifier block and the
  artefacts the worktree is the single writer of.
- **Reservation** for an orchestrated wave is orchestrator state: the
  reserved block is handed to each agent in its spawn brief and stated
  by the agent in its pull-request description or first commit;
  nothing is written to a committed file, so there is nothing to clean
  up when the wave ends, and an unused reservation expires with the
  wave. Collision detection remains the safety, as it always was.
- A **stale** claim is one whose branch, pull request, or worktree no
  longer exists; audit names it and offers to prune the worktree.

Alternatives considered: a dashboard written **only by the
orchestrator on `main`** before spawning — rejected, because it works
only for orchestrated waves under direct-to-main integration, has the
same visibility problem under pull requests, and is stale the moment
the wave ends; a **claim commit to `main`** before branching —
rejected, because under pull-request integration nothing reaches
`main` without a pull request, and under direct-to-main the pushed
branch already carries the same information.

## User stories / scenarios

- As an agent about to pick an item, I list the remote branches and
  draft pull requests and see every claim, including claims made ten
  seconds ago on another machine.
- As an agent claiming an item, I push a branch named for it and open
  a draft pull request; I edit no shared file and remove nothing when
  I finish.
- As an orchestrator, I hand each agent its reserved block in the
  brief and read the wave's state from the branches it pushed.
- As an auditor, I flag two branches claiming one item, a claim for an
  item that is not in the queue, and a worktree whose branch is gone,
  from git alone.
- As a maintainer without a remote, I am told the in-flight view is
  unverifiable rather than shown a green check.

## Acceptance criteria

1. The scaffolded `CONVENTIONS.md` and `AGENTS.md` state the claim
   convention — a pushed branch named `<actor>/NNNN-<slug>` for the
   item, plus a draft pull request where integration is pull-request
   based — as the G4 mechanism, and `USAGE.md` documents it.
2. Bootstrap writes no in-flight dashboard in any mode.
3. Audit's coordination-hygiene check derives the in-flight set from
   worktrees, remote branches matching the convention, and draft pull
   requests; it fails on an item claimed by two branches and on a
   claim whose item is not in `plan/todo/`, flags a worktree whose
   branch no longer exists as stale and offers to prune it, and
   reports the view as unverifiable — never as passing — when no
   remote is reachable.
4. Audit's cross-worktree collision check reports duplicate numbers,
   duplicate plan ownership, and an ADR edited on two unmerged
   branches as failures, aligning the skill with
   adr/0010-worktree-conflict-reconciliation.md; the cross-check
   against a dashboard file is removed.
5. `agent-wave` hands each agent its reserved identifier block in the
   spawn brief, requires the agent to state the block and its owned
   artefacts in the pull-request description or first commit message,
   and has no dashboard write or cleanup step in any phase, including
   the stop path.
6. `ship-item` and the run prompt remove no dashboard row; the merge
   and branch deletion end the claim.
7. adr/0010-worktree-conflict-reconciliation.md carries a revision
   naming the claiming branch and pull request as the ownership
   record, and adr/0014-concurrency-guardrails.md carries a revision
   naming them as the G4 claim; both stay Implemented.
8. `README.md`, `USAGE.md`, and `docs/` describe the in-flight view as
   derived, with no dashboard in any layout listing.

## Out of scope

- The reservation algorithm and the single-writer rule themselves —
  adr/0010-worktree-conflict-reconciliation.md.
- Guardrails G1 to G3 — adr/0014-concurrency-guardrails.md.
- The integration model — adr/0006-integration-model.md.
- A task's own blockers and stop reason —
  adr/0039-plan-item-carries-its-own-status.md.
- Migration and clean-up of existing dashboards —
  adr/0040-coordination-directory-migration.md.

## Open questions

- The branch prefix: the actor id, or a fixed `plan/` prefix that
  makes claims greppable without knowing the actor set. Draft
  position: the actor id, because it also answers "who" in the
  in-flight view.

## References

- adr/0036-coordination-directory-holds-only-what-git-cannot-tell-you.md
- adr/0006-integration-model.md
- adr/0010-worktree-conflict-reconciliation.md
- adr/0014-concurrency-guardrails.md
- adr/0039-plan-item-carries-its-own-status.md
- adr/0040-coordination-directory-migration.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-09-04 | r1 | Eugenio Minardi | Initial draft (Proposed), from the approved brainstorm: dashboard retired; the claim is a pushed branch named for the item plus a draft pull request; the in-flight view is computed from worktrees, branches, and pull requests; reservation is orchestrator state carried in the brief and the pull request. Orchestrator-only dashboard and claim commits considered and rejected. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
