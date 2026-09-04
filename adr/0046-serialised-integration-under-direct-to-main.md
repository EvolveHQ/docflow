---
adr: 0046
title: Orchestrated waves integrate serially in queue order under direct-to-main
status: Proposed
date: 2026-09-04
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0006", "0007", "0014", "0037", "0038", "0039", "0045"]
tags: [agent-wave, integration, ship-item, git]
---

# ADR 0046 — Orchestrated waves integrate serially in queue order under direct-to-main

## Context

Under direct-to-main integration (adr/0006-integration-model.md) the
run prompt pushes to the integration branch itself. With several
executors in flight, every push races; the remote rejects each loser,
which then rebases and re-runs the gate in its own checkout, so N
executors contend and the gate can run N² times. Nothing in the tool
or the skill serialises the race today, and "repeated merge
conflicts" becomes the likeliest stop.

Two further facts, measured in scratch repositories on this host,
shape the answer. Git refuses to check out, force-move, or delete a
branch that another worktree holds, but permits a detached checkout of
its tip, a rebase of that head, a fast-forward push of the result, and
deletion of the remote branch while the worktree still exists. And the
generated index is a guaranteed shared write: two branches that each
append a row conflict on rebase, adjacent status flips conflict, other
shapes merge clean — so the conflict is certain whenever two items
author records.

ship-item today gates the current checkout, fast-forwards a branch or
finds the work already on the integration branch, pushes, moves the
item, advances the record, regenerates the index, and commits — but
never pushes the completion commit and never gates it. Under
serialised integration that gap would leave the next item rebasing
onto a stale base.

## Capability statement

This decision applies to separate-worktrees mode under direct-to-main
integration. A wave's briefs are **implement-only**: they stop after
pushing the claim branch and return ready. The orchestrator integrates
**one claim branch at a time, in queue order**, by invoking ship-item's
**integrating mode** from an **integration worktree** — a detached
checkout of the remote tip of the integration branch, created after
the operator has confirmed the wave's parameters, at a path outside
the working tree or under a directory the repository ignores, reused
or removed when one is left over from an earlier run, and removed
after the last item. Every integration command runs there; the
integration branch advances only on the remote, by a push of the
worktree's head, whose fast-forward rule is the serialisation lock.
The operator's checkout and every executor's worktree are left alone.

Per ready item, with BASE the remote tip after a fetch:

0. Fetch and prune. The source is the pushed tip of `claim/<item-key>`.
   A local branch of that name whose tip is not an ancestor of the
   remote tip means unpushed commits: outcome unknown, item skipped.
1. Detach at the source tip and rebase onto BASE — a forced rebase
   where the git contract requires signed commits and the orchestrator
   is the signer, so that what lands carries its signature. A conflict
   confined to the index is cleared by rewriting the table from the
   record files on the tree and continuing; any other conflict aborts
   the rebase, returns to BASE, and yields failed "conflicts with
   <files>" with the claim left in place.
2. Only when the conventions carry the concurrency-guardrails section:
   run the numbering and duplicate-plan-ownership checks on the
   rebased tree; a duplicate or a gap involving the branch's own new
   numbers is repaired by renumbering the branch's own files to the
   lowest number that restores contiguity within their sequence — file
   name, record field, index row, and every reference authored on the
   branch — in one commit with the Rationale footer.
3. Run the recorded gate; on failure return to BASE and yield failed
   "gate: <line>" with the claim left in place.
4. Confirm the item is still queued on the rebased tree, else yield
   failed "item already moved". Make the completion on the same head:
   move the item with the footer "Shipped at HEAD `<rebased tip>` from
   `claim/<item-key>`", remove its status section, advance the owning
   record(s), regenerate the index, one completion commit naming item
   and record(s); run the gate again.
5. Push the head to the integration branch. A non-fast-forward
   rejection means an out-of-band landing: fetch, take the new tip as
   BASE, and repeat from step 1 — rewriting the footer — at most twice,
   then failed "integration branch moved". On success the outcome is
   shipped and BASE is the new tip.
6. End the claim: delete the remote branch; remove the executor's
   worktree when it is clean and delete the local branch with a forced
   delete, since a rebased branch is never "fully merged" in git's
   terms; a dirty worktree is never force-removed and is named under
   Yet to do.

The generated index is **exempt from the single-writer rule**: on a
claim branch it is written only by an item that authors a record and
only for that record's rows, which the branch's own gate requires; the
completion regeneration happens only in this serialised step, or in
the pull request's final commit under pull-request integration
(adr/0037-shipped-record-is-git-and-plan-done.md, revised). An
index-only conflict is mechanical and never a stop condition.

ship-item gains the integrating mode, selected by naming a claim
branch. It reads the integration branch, the remote, and whether the
guardrails section exists; refuses a branch never pushed or with
unpushed commits; reads the item and its record(s) from the remote
branch; performs steps 1 to 6 in a caller-supplied detached worktree,
or in one it creates and removes when invoked stand-alone; merges
nothing locally; pushes the head with the bounded retry; ends the
claim; fast-forwards a clean current checkout on the integration
branch; and closes with the Status at a glance block naming both gate
lines and exit codes, the push result, and the branch deleted.
ship-item's default mode — work already on the integration branch in
the current checkout — is unchanged. agent-wave invokes the
integrating mode per ready item and carries no integration procedure
of its own; at the sequential rung it integrates each item immediately
after implementing it.

A shared-checkout wave runs the run prompt in the shared tree and
ships through ship-item's default mode; there is no claim branch and
no integration worktree. Under pull-request integration the briefs
self-integrate and the pull-request host serialises. Step 1's "local
fast-forward" override in agent-wave names exactly this serialised
path. The cross-check in bootstrap and agent-wave reads: separate
worktrees with direct-to-main is legitimate when the guardrails
section is recorded — the serialised integration is those guardrails
in practice — and its cost is sequential integration.

## User stories / scenarios

- As an orchestrator, I integrate a wave's branches one at a time from
  a worktree that contends with nothing, and the remote tells me when
  something landed out of band.
- As an executor, I push my claim branch and return; I never race
  another executor to the integration branch.
- As an operator, my checkout is untouched during a wave, and only
  fast-forwarded afterwards if it is clean and on the integration
  branch.
- As a maintainer, ship-item is the one place the completion event
  lives, in both its modes.

## Acceptance criteria

1. ship-item has an integrating mode selected by naming a claim
   branch, operating in a caller-supplied detached worktree, or in
   its own when stand-alone, never in the operator's checkout or an
   executor's worktree.
2. The integrating mode performs steps 0 to 6 as stated, fetching
   first and treating a local tip that is not an ancestor of the
   remote tip as unpushed.
3. An index-only conflict is cleared by rewriting the table from the
   record files; any other conflict fails the item and keeps the
   claim.
4. The check-before-merge runs only when the guardrails section is
   recorded, and renumbers the branch's own files within their
   sequence in one commit.
5. The gate runs before and after the completion commit; the footer
   names the rebased tip and is rewritten on each retry; the item is
   confirmed still queued before the move.
6. The push of the head to the integration branch retries at most
   twice on a non-fast-forward rejection, then fails with
   "integration branch moved".
7. Ship ends the claim: the remote branch is deleted, the local branch
   once no worktree holds it, a dirty worktree is reported and never
   force-removed, and a clean current checkout on the integration
   branch is fast-forwarded.
8. The generated index is exempt from the single-writer rule and, on a
   claim branch, is written only for the branch's own rows.
9. agent-wave invokes the integrating mode per ready item in queue
   order from its integration worktree and carries no integration
   procedure of its own.
10. Item keys are validated as branch names, a branch literally named
    `claim` is refused, and a leftover integration worktree is reused
    or removed before the wave.
11. The cross-check in bootstrap and agent-wave states that the
    pairing is legitimate with recorded guardrails and costs
    sequential integration.

## Out of scope

- Pull-request integration mechanics — the host serialises; the
  completion placement is adr/0037-shipped-record-is-git-and-plan-done.md's
  revision.
- Shared-checkout waves — the run prompt in the shared tree.
- The specification the briefs implement — adr/0045-wave-specification-contract.md.
- The reservation algorithm — adr/0010-worktree-conflict-reconciliation.md.

## Open questions

- None.

## References

- adr/0006-integration-model.md
- adr/0007-lifecycle-skills.md
- adr/0014-concurrency-guardrails.md
- adr/0037-shipped-record-is-git-and-plan-done.md
- adr/0038-in-flight-state-derived-from-branches-and-pull-requests.md
- adr/0039-plan-item-carries-its-own-status.md
- adr/0045-wave-specification-contract.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-09-04 | r1 | Eugenio Minardi | Initial draft (Proposed), from the approved two-round brainstorm with every git behaviour verified in scratch repositories: implement-only briefs, a detached integration worktree, ship-item's integrating mode with the six-step sequence, the index exemption, and the ended claim. By-executor push with retry, integration in the primary checkout, worktree removal before integration, cherry-picking, merge commits, and a separate integrate skill considered and rejected. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
