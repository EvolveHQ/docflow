---
name: ship-item
description: Ship a plan/todo item in a documentation-led repo — run the verify gate, integrate per the repo's model (fast-forward or PR), git mv todo→done with a shipped footer, advance the owning ADR(s) to Implemented, and regenerate INDEX. Use when the user says "ship this", "complete the plan item", "mark done", or "close out the queue item".
---

# ship-item

Complete one queue item in the order required by the repository. Prepared
completion on an unmerged PR is ready, not shipped. Never infer merge
authorisation from a request to prepare or update the PR.

## Context and selection

Read AGENTS and CONVENTIONS for integration branch/remote, gate, coordination
mode, signing, trailers and guardrails. Resolve `adr/`, `plan/`, `INDEX.md`
and `_agent/` against the recorded root. Select the named item, otherwise
the lowest eligible one, and read its owning decisions and criteria in full.
Require Accepted ownership before preparing completion. If a linked PR
already contains the completion move, verify that prepared state instead
of repeating the move or rejecting its prepared Implemented status.

Inspect worktree cleanliness and item ownership. Preserve unrelated edits.
Only finish the named item; never repair unrelated decisions or accept
Proposed ones to make the gate pass. A literal branch named `claim`, an
invalid item key, or a source with no matching item is not a valid claim.
Validate branch names with `git check-ref-format --branch`.

## Choose the mode

- **Integrating mode:** a named `claim/<item-key>` under separate-worktree
  direct integration. Read the item from its fetched remote tip. Use the
  detached integration procedure below, never an executor or operator tree.
- **Default direct mode:** verified work already on the integration branch,
  or an ordinary work branch that can safely fast-forward into its clean
  integration checkout. Shared-checkout work stays sequential in that tree.
- **PR mode:** use the actual PR branch. A single writer uses an ordinary
  work branch, not an invented claim ref. Shared-checkout ordinary PR work
  serialises the whole checkout; shared-checkout PR waves are unsupported.

## Default direct completion

1. Fetch/prune and confirm the integration base and source. Run the gate
   and require exit zero. If needed, fast-forward the verified work branch
   into the clean integration checkout without moving a branch held by
   another worktree. Do not push yet. If safe integration is unavailable,
   stop with the precise blocker rather than changing another checkout.
2. Where guardrails are recorded, run audit/collision checks. Reconcile
   only the item's new unmerged numbers and references; regenerate INDEX.
3. Prepare the atomic completion as described below. Run the gate again
   after the completion commit. Push the integration branch normally.
4. Confirm the intended tip is on the remote. Only then report shipped and
   perform applicable cleanup. A rejected or uncertain push is not shipped;
   preserve local commits and report the remote state.

## Detached integration of a pushed claim

The orchestrator invokes this once per ready item in queue order. Reuse a
caller-supplied clean owned detached integration worktree, or create one
outside the operator tree and remove it afterwards. A leftover is reused
or removed only after proving ownership and cleanliness. Never check out,
force-move or delete a branch another worktree holds.

0. Fetch/prune. Record BASE (remote integration tip) and SOURCE (remote
   claim tip). Refuse an unpushed source. A local claim tip not ancestral to
   SOURCE means unpushed/divergent work: outcome unknown, skip and preserve.
   Confirm the claim still owns the named item and has no competing writer.
1. Detach the integration worktree at SOURCE and rebase onto BASE. Preserve
   the signing contract; when the integrator must sign rewritten commits,
   use a forced signed rebase. Signing/hooks failures block, never bypass.
   Resolve INDEX-only conflicts by rebuilding the table from metadata and
   continuing. On any other conflict abort, return the clean integration
   worktree to BASE and report failed with conflict paths; keep the claim.
2. If guardrails are recorded, check duplicate identifiers and plan
   ownership. Renumber only SOURCE's new unmerged files into the lowest
   free slots that restore contiguity in each sequence; update filename,
   metadata, own references and INDEX in one Rationale-bearing commit.
   Never renumber a merged identifier or another writer's reservation.
3. Run the recorded gate and require complete output plus exit zero. On
   failure keep SOURCE, restore the integration worktree to BASE and return
   failed with the exact command/output/exit. Install nothing the gate does
   not itself install; an environment failure is blocked and systemic.
4. Confirm the item is still queued in this rebased tree. Prepare completion
   here with footer `Shipped at HEAD <rebased implementation tip> from
   claim/<item-key>`. Record the tip before the completion commit, never the
   completion commit itself. Run the gate again after committing completion.
5. Confirm the remote claim has not changed since SOURCE. Push detached
   HEAD to the integration branch with a normal fast-forward push. On a
   non-fast-forward rejection only, fetch the new BASE and repeat from
   SOURCE, rebuilding the completion/footer; allow at most two retries.
   After that return failed "integration branch moved". A transport failure
   is unknown until remote evidence confirms the intended tip landed; never
   count a mere push attempt as completion.
6. Confirm remote integration contains the intended tip, then end the claim
   and report shipped. Keep the result even if cleanup fails, but list every
   leftover and do not claim the whole operation fully verified.

Only this serial integration step regenerates the full completion INDEX.
An executor may update its own rows before that so its own gate can run;
INDEX is exempt from exclusive ownership, unlike decision and item bodies.

## PR preparation and completion

1. Identify the actual work branch and existing PR. If ordinary single-writer
   work is still on the base, create an owned work branch before pushing.
   Require separate-worktree claims to have been acquired explicitly; a
   successful ordinary push is not a new claim. Reuse the draft opened at
   item start. For older work with no PR, push this actual branch and open
   a draft now, naming owner, item, reservations and owned artefacts. This
   recovery does not make delayed PR creation correct for future work.
2. Fetch and rebase onto the current integration tip, preserving signatures.
   Run audit and repair only this item's unmerged identifier collisions;
   regenerate INDEX and resolve INDEX-only conflicts mechanically.
   Substantive conflicts block. Run the gate before completion edits.
3. Prepare atomic completion on the PR branch, with a footer naming the PR
   and any actual artefact identifiers, never a future merge SHA. If already
   prepared, inspect the move/status/index instead of making a second move.
4. Run the gate after the completion commit and push. For an owned rebased
   branch use an explicit lease against its last observed remote tip; never
   overwrite a changed claim. Keep the PR description current with the
   complete scope and Status at a glance. Require all repository checks at
   the current head before ready; skipped, absent, pending or neutral checks
   do not stand in for a required passing check.
5. Without merge authorisation return ready, with merge outstanding. With
   authorisation request the repository's recorded strategy and wait for
   confirmation that this PR merged into the integration branch. A queued
   auto-merge is pending, not shipped. On a moving base retry fetch/rebase,
   collision checks, regeneration, both applicable gates and push at most
   twice; keep the claim and return failure if unresolved. Make no
   completion follow-up commit on the integration branch.

## Atomic completion edits

Perform these together in one Conventional Commit with a Rationale footer:

- `git mv` the resolved `plan/todo/NNNN-<slug>.md` to
  `plan/done/<YYYY-MM-DD>-<slug>.md`, retaining its numbered title.
- Add the direct integration implementation-tip/claim footer or the PR
  footer. Never invent a release, deployment identifier or future SHA.
- Remove the whole live `## Status` section, retaining other item content.
- Advance only owning decisions whose criteria this item actually completes
  from Accepted to Implemented; add revision/approval evidence. If another
  owning item remains, keep the decision Accepted and explain partial work.
- Regenerate INDEX from metadata. The plan move, applicable status advances
  and index are one event, effective on confirmed push/merge, not locally.

Write no separate worklog, dashboard or snapshot. For an unmigrated legacy
repo, honour its recorded additional steps and identify that legacy layout;
never introduce such files into a modern layout.

## Cleanup and report

After confirmed completion, delete the branch-backed remote claim or
confirm host deletion. Remove clean owned executor worktrees; leave dirty
ones and report them. Delete the local claim only when no worktree holds
it and there are no unpushed changes. For a rebased claim, forced local
branch deletion is permissible only after these proofs and confirmed
integration; ordinary merged branches use normal deletion.

Shared checkouts release only their own lock rows; single writers have no
claim branch. Clean ordinary PR work branches only when owned and unused.
Remove an owned clean integration worktree when this invocation created it;
the wave caller removes its reused worktree after the last item. Fast-forward
a clean operator checkout only if already on the integration branch.

Report both gate outputs/exits, implementation and completion references,
push/merge evidence, identifiers repaired and cleanup performed. On failure
update Blockers/Stopped on the queued item, or the PR body if already moved,
with date/reason and This run / Overall / Yet to do. Preserve recoverable
work within the existing grant. A failed final gate never advances the remote.

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
