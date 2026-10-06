---
name: workspace-sync
description: Reconcile returned WORKSPACE receipts and maintain delivery observations from checked native evidence, observing member pull requests, merges, required checks, plan todo-to-done moves and branch heads, then refreshing INDEX. Use for workspace-sync or updating a workspace after native work, whether or not this workspace dispatched it. NOT for dispatching an assignment, scoping new work, setup or a read-only briefing. Never marks a delivery complete from a prepared pull request or an unmerged plan/done file.
---

# workspace-sync

Reconcile native returns and keep delivery state honest against checked evidence.

## Operating contract

**Inputs:** canonical workspace root, member roots or remotes, the returned receipt or member state to check, the actor/host permitted to write canonical records, and the scope of the update.
**Effects:** canonical writes to run reconciliation, delivery observations, work criteria evidence, the receipt record and INDEX. It grants no authority, dispatches nothing and never edits a member repository.
**Native claims / dependencies / resources:** observe them at their current native sources; this skill reconciles what already happened, it does not reserve or claim work.
**Stopping point:** a source-bound reconciliation with each changed observation naming the exact revision checked.
**Receipt:** actual reads/checks, the returned or observed evidence, what was updated, what remained unknown, and the refreshed INDEX.

## Resolve inputs and current authority

Reuse supplied choices; ask only for a materially missing root, host or scope. A
recorded preference is not authority: writing canonical observations needs the
current operator mandate or a compatible accepted agreement, and a chat message
alone is not evidence. Recheck the exact grant revision, its scope revision,
expiry and revocation before accepting a return; a denied action stops across
alternate tools and routes. Completed work leaves its still-current agreement
accepted. Read the registry, conventions, the current records and
the member instructions before writing. Locate the packaged assets as the other
workspace skills do; never assume a source checkout.

## Reconcile returned receipts

Read the exact returned brief binding, native session/host, actions, checks and
receipt before changing anything. Accept a receipt only when its evidence
resolves to real native sources at the cited revision. A readiness report for
which no attempt started is not a receipt and is never stored as one. Record
reconciliation with who checked it, when and against which evidence. Preserve
distinct outcomes: passed, failed, skipped, stale and unknown stay distinct;
only passed evidence supports completion.

## Observe member state read-only

This skill works whether or not the workspace dispatched the member work.
Inspect, read-only and at pinned revisions:

- the member's pull requests and their merge state, never a branch head alone;
- required checks on the exact merged head;
- plan `todo` to `done` moves, treating a file on an unmerged branch as
  prepared, not shipped;
- current branch heads and the delivery's declared native completion event.

**A prepared pull request or an unmerged plan/done file never marks a delivery
complete.** Completion needs the member's own checked completion event and
passed evidence at the exact revision, matching the delivery's declared native
completion. One passed run does not close parent work, and completed work leaves its still-current agreement accepted.

## Maintain and refresh

Update delivery observations and work criteria evidence only from the checked
native evidence above, in the canonical records, under the current mandate.
Then regenerate the derived INDEX and state its observation time and any
unresolved diagnostics. Leave superseded and rejected history intact. A
malformed or missing member stays registered with diagnostics; do not invent
state, and keep dependent dispatch blocked.

## Unknown outcomes

A missing, failed, skipped, stale or mismatched observation remains unknown or
blocked, never success. Contact loss is not worker exit. Do not refresh or
repair records outside the authorised scope: name the scoped action required
instead.

<!-- docflow:closing-report -->
## Closing report

End every run, including blocked, failed and stopped runs, with a section
headed exactly **Status at a glance**, containing these three labels:

- **This run:** only actions actually attempted and their outcomes; quote each verify gate's exact output and exit code, including timeouts or interruptions.
- **Overall:** implemented, partially verified, verified, blocked, failed or unknown. A passing sub-step is not an overall pass; incomplete or missing evidence never becomes success.
- **Yet to do:** every remaining action, unresolved finding, verification, cleanup or required input. Write None only when the whole task is verifiably complete; never omit work because a budget ended.

Routine progress messages need no block. Keep final results brief and
distinguish work prepared on a PR from work confirmed shipped.
<!-- /docflow:closing-report -->
