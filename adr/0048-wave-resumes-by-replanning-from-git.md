---
adr: 0048
title: A wave resumes by re-planning from git
status: Implemented
date: 2026-09-04
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0013", "0031", "0037", "0038", "0039", "0045", "0046"]
tags: [agent-wave, resume, claims, audit]
---

# ADR 0048 — A wave resumes by re-planning from git

## Context

A wave dies half-way for ordinary reasons: a session ends, a host
limit is reached, an executor stops on a condition. What remains is
in git — claim branches, pushed commits, status sections, completed
entries — and nowhere else, because the coordination directory holds
no derived state
(adr/0036-coordination-directory-holds-only-what-git-cannot-tell-you.md).
agent-wave today picks the lowest-numbered items regardless of any
claim on them, so a re-run after a failure would assign an item that
another executor or a scheduled run of the run prompt already holds.
Two waves, or a wave beside a scheduled run, need the same protection.
Git can tell a claim that exists from one that is gone, and a tip
that has landed from one that has not, but it cannot tell an
interrupted wave's claim from another operator's; only the operator
can.

## Capability statement

The orchestrator holds no state a re-plan cannot recompute. A
**collect step** runs before every wave, not only at invocation, and
classifies queue and completion entries after a fetch. Apply precedence
in this order: unverifiable, shipped, merged but unshipped, stopped, live,
stale, eligible. Conflicting evidence is unverifiable. PR merge state and
the item move establish completion when squash/rebase changes ancestry:


- **shipped** — under `plan/done/` with a footer naming a commit
  reachable from the integration branch, or a named PR confirmed merged
  into it;
- **merged but unshipped** — a claim branch for a still-queued item
  whose tip is an ancestor of the integration branch; listed for a
  human, never re-assigned, deleted at the next ship;
- **live** — a `claim/<item-key>` branch, or its draft pull request
  where integration is pull-request based, whose tip is not such an
  ancestor; both draft and ready unmerged PRs remain live; a confirmed merge
  changes its class even if squash/rebase removed source ancestry;
- **stopped** — a Stopped entry on the integration branch or at the
  claim tip;
- **stale** — a local worktree, or a Claimed-by field, backed by a branch whose remote
  ref is confirmed absent; shared-checkout claims use locks and owner fields; a detached worktree, the wave's own
  integration worktree included, is neither a claim nor stale;
- **eligible** — still queued, owning decisions Accepted, dependencies
  satisfied, no live/stopped/stale or ambiguous ownership;
- **unverifiable** — the remote cannot be fetched; no parallel wave
  starts, and the run stops with that word, never a green check.

In a shared checkout the view is the lock ledger plus the Claimed-by
fields; no branch is consulted. Live, stopped, merged-but-unshipped,
and unverifiable items are excluded from the wave. A claim is orphaned only if the item is absent at both the integration
base and claim tip and no linked PR explains its move into plan/done.
Stale ownership is reported for reconciliation rather than reassigned.

The one structured question — **continue on this branch?** — is
high-impact and is asked at guided and full depth only when at least
one live claim exists. At express it takes its default: every live
claim is excluded and listed under Yet to do as "live claim excluded:
<branch> (<item>) — re-run at guided or full to continue it, or name
the branch in the invocation". An invocation that names a claim
branch or its item is the operator's answer at any depth. Continuing
means no new claim and no new reservation: the executor detaches at
the remote claim tip — never checks the branch out, since a leftover
worktree may hold it — pushes its head back to the claim branch, and
updates Claimed by to the continuing actor in its first commit; a
leftover worktree still holding the branch is reported.

Ship ends a claim by deletion — the remote branch, then the local one
once no worktree holds it — in every integration model. A claim tip
that is an ancestor of the integration branch is not live even while
the branch exists, which is the state after a no-op integration; the
record survives in the footer naming the branch and, under
direct-to-main, in the claim commit on the integration branch's
first-parent history.

Overlap is safe by construction. A claim pushed before a collect is
seen and excluded; one pushed after it is caught by the executor's
own fetch-check immediately before its push; each acquisition uses an atomic create-only push with explicit empty
expected ref and requires the porcelain new-ref result, so an existing
same-tip or descendant push never grants ownership, and that executor returns blocked "claimed by"; audit's
duplicate-claim failure and the check-before-merge remain the
backstop, and the wave block names every claim withdrawn.
Reservations are recomputed from the landed catalogue every wave, so
two overlapping waves collide at most on numbers, which the
check-before-merge repairs and reports.

On a stop the skill writes no coordination file; its closing block's
Yet to do names every unmerged claim branch, leftover checkout, and
stopped item. A host replay facility may be used at rung one only when
the specification is byte-for-byte unchanged, and is never relied
upon.

## User stories / scenarios

- As an operator resuming after a session died, I run the skill
  again; it shows me what is shipped, live, stopped, and stale, and
  asks whether to continue the branch it left.
- As an operator at express depth, nothing live is touched; the
  report tells me how to continue if I want to.
- As a second orchestrator, the claims of the first are excluded from
  my wave, and the one race we can still lose is settled by the
  remote.
- As an auditor, a detached worktree does not show up as a stale
  claim, and a branch that landed as a no-op is not counted as live.

## Acceptance criteria

1. The collect step runs before every wave, fetches first, and
   classifies every queue item into exactly one of the seven classes as
   stated; unverifiable stops the run.
2. Live, stopped, merged-but-unshipped, and unverifiable items are
   excluded from the wave, and a merged-but-unshipped item is listed
   for a human.
3. The continue question is asked at guided and full depth only when a
   live claim exists; express excludes with the pointer; an invocation
   naming the branch or item is the answer at any depth.
4. Continuing creates no new claim and no new reservation; the
   executor detaches at the remote claim tip, pushes back to it, and
   updates Claimed by in its first commit.
5. Ship deletes the remote claim branch, then the local one once no
   worktree holds it, in every integration model; a claim tip that is
   an ancestor of the integration branch is classified as not live.
6. Overlapping waves and scheduled runs never double-assign: the
   fetch-check before push, the remote's rejection, and audit's
   duplicate-claim failure are stated as the mechanism, and the wave
   block names withdrawn claims.
7. No coordination file is written on a stop; Yet to do enumerates
   every unmerged branch, leftover checkout, and stopped item.
8. Audit's stale rule reads: a worktree or Claimed-by field backed by a branch whose
   remote ref is confirmed absent; shared claims use their lock ledger; a detached worktree is
   neither a claim nor stale.

## Out of scope

- The claim convention itself —
  adr/0038-in-flight-state-derived-from-branches-and-pull-requests.md.
- The specification the continued brief follows —
  adr/0045-wave-specification-contract.md.
- Integration mechanics — adr/0046-serialised-integration-under-direct-to-main.md.

## Open questions

- None.

## References

- adr/0013-interactive-assessment-protocol.md
- adr/0031-tiered-assessment-depth.md
- adr/0037-shipped-record-is-git-and-plan-done.md
- adr/0038-in-flight-state-derived-from-branches-and-pull-requests.md
- adr/0039-plan-item-carries-its-own-status.md
- adr/0045-wave-specification-contract.md
- adr/0046-serialised-integration-under-direct-to-main.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-09-04 | r1 | Eugenio Minardi | Initial draft (Proposed), from the approved two-round brainstorm: collect-first classification into six classes, exclusion of live claims by default, the high-impact continue question with its express default and invocation shortcut, claims ended by deletion, overlap settled by the remote. Auto-continue, exclude-with-no-way-back, a committed resume marker, and host replay as the record considered and rejected. |
| 2026-09-11 | r2 | Eugenio Minardi | Proposed → Accepted. Add the missing eligible class and precedence; distinguish ready PRs from orphan claims, recognise confirmed PR merges, restrict remote staleness to branch-backed claims, and use exclusive acquisition. |
| 2026-09-11 | r3 | Eugenio Minardi | Implementation and scoped verification prepared in PR #5; status becomes effective on its checked merge. Independent Docker receipts, deterministic checks and the audit report record evidence and remaining host limits. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-09-11 | Approved in operator session; PR #5 expansion |
