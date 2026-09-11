# Autonomous-completion prompt

**Authoritative for:** how an unattended run behaves here. This prompt
records no past or current run state.

Drive the accepted implementation queue through the recorded gate and
integration model. An attended wave specification restricts this prompt to
its one named item and granted actions; never pick another item then.
An instruction to prepare or update a PR does not authorise merging it.

## Orient

Read `AGENTS.md` and follow its **Picking up this repo** read order.
Resolve `adr/`, `plan/`, `INDEX.md` and `_agent/` against the recorded
artefact root; entry-point files remain at the repository root. Read the
item and owning decisions in full. Record the integration branch, remote,
gate, mode and signing rules. Preserve unrelated changes. Never change
signing, hooks or approval settings to get past a failure.

## Pick

Fetch and prune before selecting the lowest-numbered eligible item.
Derive ownership from remote claim branches and open PRs (draft or ready),
or from the item and lock ledger in a shared checkout. Exclude live,
stopped, ambiguous and stale ownership. Continue only when the operator
names that item/branch or explicitly chooses Continue; a schedule has no
implicit permission to take over a claim. Only Accepted decisions with
satisfied dependencies are eligible. Unreachable required state is
unverifiable, never an empty queue.

## Start the item

Select or create the actual branch using the mode below, then fill the
item's `## Status`: `Claimed by` names actor, date and actual branch;
`Blockers` records current blockers; `Stopped` is empty unless the run
stops. Commit this before acquisition, publication or implementation.

There is no exclusive claim branch or lock ledger. Under direct integration
work on the integration branch. Under PR integration create or reuse the
operator-named work branch (otherwise `work/<item-key>`) before the first
item commit. Never push a nonexistent `claim/<item-key>` branch.

Immediately after the first item commit and successful branch push, open
or reuse the draft PR, before implementation. Its body names item, actor,
actual branch, reservations and owned artefacts, and ends with Status at a
glance. If opening fails, record the blocker and stop. Continuing reuses
the existing PR; never create a duplicate.

## Implement

Implement the numbered acceptance criteria within owned paths and
reservations. Run relevant checks. Never accept decisions, expand scope,
take another item's identifier, or release under a wave grant.

## Verify

Run exactly: `node scripts/verify.mjs`.

Require exit zero and complete output. Fix understood implementation
failures and rerun. If the environment prevents the gate from running,
install nothing the command does not itself install: put its exact failure
in Blockers, commit/push recoverable work if authorised, and return blocked.
Never bypass checks or call partial output a pass.

## Commit

Follow Conventional Commit, signing and trailer rules; add `Rationale:`
when touching a decision. Keep gate changes separate from judged files
except the repository's stated tighten-and-repair or comment-only exception.

## Check before merge

Fetch the integration tip and run audit. Rebase only this item's branch,
preserving required signatures. Renumber only this item's new unmerged
identifiers and references into the lowest free contiguous slots. Regenerate
INDEX from metadata; an INDEX-only conflict is resolved by regeneration.
Substantive conflicts stop the item. Rerun the gate on the reconciled tree.

## Integrate and prepare completion

Use ship-item; it owns the order of the completion event.

Keep using the actual branch and draft PR. Prepare the todo-to-done move,
remove Status, advance owning decisions and regenerate INDEX together in
a completion commit on that branch. The footer names the PR, not a future
merge SHA. Rerun the gate, push, and require checks at the current PR head
before ready. The PR body ends with Status at a glance. Without merge
authorisation, return ready with merge outstanding. Otherwise request the
recorded strategy and confirm merge into the integration branch; green CI
or an auto-merge request is not shipped. Retry a moving base at most twice
through fetch, rebase, collision check, regeneration, gate and push; then
preserve the claim and report failure. No completion follow-up on the base.

## End the claim

Only after confirmed completion, delete a branch-backed remote claim (or
confirm the host deleted it). Remove only clean owned executor worktrees;
delete the local branch once no worktree holds it. Shared checkouts release
their own lock rows. Single writers have no claim branch to delete. An
ordinary PR work branch is separate from a claim: clean it up only when
owned and unused. List all unmerged or dirty leftovers under Yet to do.

## Stop

Stop for ambiguous criteria, non-Accepted ownership, exhausted budget,
unknown/environmental gate failure, contention, substantive conflict,
missing permissions or operator stop. In the current queued item's Stopped
field, write date and Status at a glance with This run / Overall / Yet to do.
Commit/push recoverable state only within the grant. If the item is already
moved on an unmerged PR, record the stop in its body. Create no snapshot or
hand-off file. Queue exhaustion does not fabricate a stopped item.

## Report

End the final report with **Status at a glance**:

- **This run:** actual actions, outcomes and the gate's exact output and exit code.
- **Overall:** implemented, partially verified, verified, blocked, failed or unknown; distinguish ready from shipped.
- **Yet to do:** every remaining check, merge, cleanup, claim, worktree or input. None only when the whole task is verifiably complete.

Never turn a timeout, interruption, missing return or passing sub-step into
overall success. Routine progress updates remain concise.
