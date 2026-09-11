---
adr: 0038
title: In-flight state is derived from branches and pull requests
status: Implemented
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
  item, `claim/<item-key>`, where the item key is the queue file name
  without its extension (`plan/todo/0007-rate-limit.md` gives
  `claim/0007-rate-limit`), together with a draft pull request opened
  immediately after acquisition and before implementation where integration
  is pull-request based. The prefix is
  **fixed, not the actor's**: every claim is then greppable without
  knowing the actor set, and — because one item maps to exactly one ref
  — **an atomic create-only push is the exclusion**. Use an explicit empty
  expected value for the full destination ref with force-with-lease and
  inspect porcelain output: only a new-ref (`*`) result acquires the claim.
  Ordinary successful, fast-forward and up-to-date pushes do not acquire it.
  Any other result leaves the item unclaimed by this executor. The claiming
  commit exists **before** the branch is pushed, so a claim ref never
  appears empty; a remote claim branch whose tip is at or behind the
  integration branch carries no work and **is not a claim**. A merged
  or deleted branch is no longer a claim.
- **The claim takes the form its coordination mode allows.** In
  **separate worktrees** it is the branch above, plus the draft pull
  request where integration is pull-request based. In a **shared
  checkout** there is one working tree and no branch per item, so the
  claim is the item's own `Claimed by`
  (adr/0039-plan-item-carries-its-own-status.md) together with the
  `_agent/LOCKS.md` rows serialising the files it edits. Under **a
  single writer** there is no claim to make: nothing else can take the
  item.
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
  reserved block is handed to each agent in its wave specification and
  stated by the agent in its pull-request description or first commit;
  nothing is written to a committed file, so there is nothing to clean
  up when the wave ends, and an unused reservation expires with the
  wave. Collision detection remains the safety, as it always was.
- A branch-backed claim is **stale** when its worktree or `Claimed by`
  outlives a remote claim branch confirmed absent after a successful fetch.
  Shared-checkout claims have no remote branch; evaluate their owner and
  lock rows, never remote absence. Audit names it and offers to prune the worktree. A
  **detached** worktree — one sitting on no claim branch at all — is
  neither a claim nor stale, and is reported as neither.

Alternatives considered: a dashboard written **only by the
orchestrator on `main`** before spawning — rejected, because it works
only for orchestrated waves under direct-to-main integration, has the
same visibility problem under pull requests, and is stale the moment
the wave ends; a **claim commit to `main`** before branching —
rejected wherever there is a branch to carry the claim, because under
pull-request integration nothing reaches `main` without a pull request
and under direct-to-main the pushed branch already carries the same
information. The shared checkout is the one carve-out: it has no branch
per item, so its claim is committed on the item itself and the
objection does not apply.

## User stories / scenarios

- As an agent about to pick an item, I list the remote branches and
  draft pull requests and see every claim, including claims made ten
  seconds ago on another machine.
- As an agent claiming an item, I commit, push `claim/<item-key>`, and
  open a draft pull request; if someone beat me to that item my push is
  rejected and I learn it before I have done the work. I edit no shared
  file and remove nothing when I finish.
- As an orchestrator, I hand each agent its reserved block in the
  brief and read the wave's state from the branches it pushed.
- As an auditor, I flag two branches claiming one item, a claim for an
  item that is not in the queue, and a worktree whose branch is gone,
  from git alone.
- As a maintainer without a remote, I am told the in-flight view is
  unverifiable rather than shown a green check.

## Acceptance criteria

1. The scaffolded `CONVENTIONS.md` and `AGENTS.md` state the claim
   convention — a pushed branch `claim/<item-key>` for the item, the
   item key being the queue file name without its extension, plus a
   draft pull request where integration is pull-request based, and the
   shared-checkout and single-writer forms of the same claim — as the
   G4 mechanism; their work-partition sentence reads that named actors
   answer for areas and work is assigned by claim, not that work is
   partitioned across writers; and `USAGE.md` documents it.
2. Bootstrap writes no in-flight dashboard in any mode.
3. Audit's coordination-hygiene check derives the in-flight set from
   worktrees, remote branches matching the convention, and draft pull
   requests; it fails on duplicate ownership and a claim with no matching item at
   the integration base or claim tip. A ready PR may have moved the item to
   `plan/done/`; its linked PR and move establish ownership. It flags a
   branch-backed worktree whose
   branch no longer exists as stale and offers to prune it, and
   reports the view as unverifiable — never as passing — when no
   remote is reachable.
4. Audit's cross-worktree collision check reports duplicate numbers,
   duplicate plan ownership, and an ADR edited on two unmerged
   branches as failures, aligning the skill with
   adr/0010-worktree-conflict-reconciliation.md; the cross-check
   against a dashboard file is removed.
5. `agent-wave` hands each agent its reserved identifier block in the
   wave specification, requires the agent to state the block and its owned
   artefacts in the pull-request description or first commit message,
   and has no dashboard write or cleanup step in any phase, including
   the stop path.
6. `ship-item` and the run prompt remove no dashboard row; the merge
   ends the claim, and shipping deletes the remote claim branch and
   deletes the local branch once no worktree holds it. This cleanup applies
   only to branches actually created by the selected mode; shared checkouts
   release their locks and single writers have no claim branch.
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

- ~~The branch prefix: the actor id, or a fixed prefix that makes
  claims greppable without knowing the actor set.~~ Resolved (r3): a
  fixed `claim/` prefix over the item key, so one item maps to one ref
  and the push is the exclusion. "Who" is answered by the branch's
  author and its pull request, which the actor prefix only duplicated.

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
| 2026-09-07 | r2 | Eugenio Minardi | Status Proposed → Accepted; acceptance delegated to the session by the operator. Plan 0040 authorised. The open question on the branch prefix is left open here and is resolved by the ADR 0038 r3 amendment that lands with plan 0040, which replaces the actor-prefixed claim branch with the fixed `claim/<item-key>` form so that the push itself is the exclusion. |
| 2026-09-07 | r3 | Eugenio Minardi | Claim branch fixed at `claim/<item-key>` (the queue file name without its extension), replacing `<actor>/NNNN-<slug>`, so one item maps to one ref and the push is the exclusion; the open question is resolved. The claim commit exists before the push, and a remote claim at or behind the integration branch is not a claim. The claim is stated per coordination mode (branch in separate worktrees; `Claimed by` plus lock rows in a shared checkout; none under a single writer). Stale redefined as a worktree or `Claimed by` whose remote claim branch is gone, a detached worktree being neither. AC1 and AC5 reworded; AC6 gains remote and local branch deletion at ship. The rejected claim-commit alternative is carved out for the shared checkout; "spawn brief" reads "wave specification"; the templates' work-partition sentence becomes named actors answering for areas with work assigned by claim. |
| 2026-09-07 | r4 | Eugenio Minardi | Status Accepted → Implemented. Plan 0040 shipped via PR #5: the scaffolded conventions, AGENTS hard rules and read order, USAGE and the docs state the `claim/<item-key>` claim and derive the in-flight view; bootstrap writes no dashboard in any mode and keeps the run prompt's Claim step per coordination mode; agent-wave hands out the reserved block in the wave specification and requires it in each pull request, with no dashboard write or cleanup on any path; ship-item and the run prompt remove no row and end the claim by deleting the branch; audit derives the in-flight set and fails on duplicate claims, claims without an item, reporting stale worktrees with a prune offer and the view as unverifiable without a remote, with check 11's collisions at FAIL. ADR 0010 r3 and ADR 0014 r4 landed with it. AC1–AC8 met. |
| 2026-09-11 | r5 | Eugenio Minardi | Repair audit R1–R5: exclusive create-only acquisition, early draft PRs, ready-PR item lookup and mode-specific stale/cleanup rules. Historical completion in r4 was prepared on PR #5; the PR was still open at this review. Existing live claims require explicit continuation. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-09-07 | — (delegated) |
| Maintainer | Eugenio Minardi | 2026-09-07 | — (delegated) |
| Maintainer | Eugenio Minardi | 2026-09-11 | Approved in operator session; PR #5 expansion |
