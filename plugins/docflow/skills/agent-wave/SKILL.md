---
name: agent-wave
description: Run a bounded wave over the plan/todo queue in a documentation-led repo, using available parallel agents or sequential execution. Establishes width, budget and supervision; isolates work and collects verified outcomes. Use for "spawn a wave of agents", "run the queue in parallel", "fan out the work", or "agent wave", not for authoring a decision or queuing a new item.
---

# agent-wave

Run a declared batch of accepted queue items using the capabilities this
host actually exposes. Budgets count items or waves. An optional hours cap
stops new waves, never a running item. Long-lived automation uses the host's
scheduling facility (see README); this session does not promise to outlive itself.

## Preconditions and host capability

Before asking parameters, read the repository's entry point, conventions,
queue and autonomous prompt. Resolve all artefact paths, including `_agent/`,
against the recorded root. Require a real gate and the queue it walks.

| Recorded mode | Execution |
|---|---|
| Single writer | Stop and direct the operator to the sequential autonomous prompt, at every requested width. |
| Shared checkout, direct integration | One executor at a time in that checkout, using item status and lock rows. No claim branch or integration worktree. |
| Shared checkout, PR integration | Stop before claiming; require separate worktrees for PR waves. |
| Separate worktrees | Each executor uses its own worktree; integration follows the recorded model. |

Fetch/prune the recorded remote and require its integration branch. Print
the fetched base SHA. Compare the local integration ref: report unpushed
commits or divergence before proceeding, never silently discard them. A
behind, clean checkout may be fast-forwarded when it is safe; otherwise
leave it alone. The wave's state and probe come from the fetched base,
not uncommitted files in the operator's checkout. If the remote queue is
empty but the local queue differs, explain that difference.

Derive whether the host can delegate, isolate checkouts, run concurrently,
use an orchestration facility **already enabled by the operator**, and
require shaped results. Choose the highest available rung:

1. Enabled orchestration facility: one fan-out for this wave only. Keep
   wave loops, clock checks and questions in the orchestrator.
2. Plain subagents: parallel if available, sequential otherwise. Use host
   worktree isolation only if its starting head equals the declared base;
   otherwise explicitly create each worktree at that base.
3. The orchestrator executes one item at a time, in its own worktree or
   the shared checkout as the recorded mode permits.

Report `Execution: rung N — reason`. The operator can lower this choice;
never raise it beyond observed capability or solicit enablement. A skill
mentioning a facility is not operator opt-in. The same canonical brief
below is used at every rung. Without a proved concurrency ceiling, use one.

## Assessment and declaration

Reuse answers already given. Otherwise ask one question at a time with a
recommended answer and reason, using a structured selector if available.
Offer express (defaults), guided (budget/supervision) or full depth, with
the recorded depth preselected. Honour defaults-from-here or go-deeper.

1. Requested width: recommend min(eligible queue depth, 3, host ceiling).
2. Budget: items or waves; recommend one wave. Optionally a soft hours cap.
3. Supervision: checkpoint after each wave (recommended), or continuous.
4. Integration: use the repository profile unless explicitly overridden.
   Direct integration is legitimate with recorded concurrency guardrails;
   its integration is serial. An override cannot make an unsupported mode valid.

Declare and confirm the resulting specification before execution (explicit
invocation parameters already constitute confirmation). Include:

- Wave name, date, remote, integration branch and fetched base SHA.
- Requested/effective width, rung/reason, host ceiling and any token limit.
- Budget, supervision and soft cap; never convert token limits to item counts.
- Each item's key, owning decisions, dependencies, claim variant, exact
  owned artefacts, reserved identifiers with their sequences, and Continue flag.
- Isolation and integration profile; integration/merge actions actually granted.
- Grant: "Attended wave: the operator confirmed these parameters and this
  item on <date>; implement only the named item, never pick another."

Reserve only identifiers an item will create, in finite disjoint blocks.
Include existing live reservations; continued items keep their original
ones. Never assign two writers the same decision or plan body. INDEX is
derived: an executor changes only its own rows, and integration regenerates
the whole table. Exhausted reservations stop the item; no stealing slots.

After confirmation, create a detached integration/probe worktree at the
base for separate-worktree mode, outside the operator's tree. Reuse a
leftover only after proving it clean and owned. Probe the exact gate there
with tracked files and existing environment only. On environmental failure,
stop before dispatch and report the command, output and exit; do not install
missing dependencies or imply that selecting rung three repairs the gate.
Report effective hooks path and the origin of the signing setting.

## Collect before every wave

Fetch/prune again; read item status, claim tips, worktrees and PR state.
Use this precedence, resolving each item at the base and claim tip:

| Class | Evidence and action |
|---|---|
| Unverifiable | Required remote/PR evidence unavailable or contradictory: stop the run. |
| Shipped | Done entry on the integration branch with reachable footer commit or confirmed merged PR. Exclude. |
| Merged but unshipped | Work/PR merged but item still queued on the base. Exclude and request reconciliation. |
| Stopped | Stopped field on the base or claim tip. Exclude unless explicitly continued. |
| Live | Unmerged remote claim or draft/ready PR, or current shared-checkout owner/locks. Exclude unless explicitly continued. |
| Stale | Branch-backed local ownership after confirmed remote-ref disappearance. Report cleanup; do not reassign uncertain leftovers. |
| Eligible | Accepted ownership, satisfied dependencies, no claim/stop/stale conflict. Select in queue order. |

A ready PR may have moved the item to done on its own branch. Resolve that
move through the linked PR/history; it is still live, not an orphan. Check
confirmed PR merges when squash/rebase makes source ancestry inconclusive.
Shared claims are evaluated from item/locks, never remote claim absence.
Detached worktrees are neither claims nor stale. An ahead local claim ref
means unpushed work: return unknown and preserve it.

At guided/full depth, offer Continue only for an existing live/stopped
claim; default to excluding it. Express excludes and lists how to continue.
An invocation naming the claim or item is the explicit answer. Continuing
does not create a new claim or reservation; report any leftover worktree.
After selection, recheck owned-path overlap and dependencies.

## Canonical executor brief

Pass this complete brief with the item's specification, unchanged at all rungs:

1. **Open and orient.** Verify base ancestry and the named item. A continued
   checkout must equal the fetched claim tip; a linked ready PR's completion
   move is valid context. Read the entry point and autonomous prompt. A
   mismatch is blocked, never permission to work another item.
2. **Claim.** Fetch again. For a new separate-worktree item create
   `claim/<item-key>` from the base; commit Claimed by with actor/date/branch
   and put wave, reservations and owned artefacts in its first commit message.
   Validate the key with `git check-ref-format --branch`; never use a literal
   placeholder. Acquire with
   `git push --porcelain --force-with-lease=refs/heads/claim/<item-key>: origin HEAD:refs/heads/claim/<item-key>`.
   Require exit zero and the porcelain `*` new-ref result for that destination.
   Existing refs, including same-tip/up-to-date results, grant no ownership.
   A signing/push failure stops before implementation; preserve unknown
   outcomes. Never overwrite another claim. Set upstream after acquisition.
   For PR mode, immediately open/reuse the draft PR with item, actor, branch,
   reservations, owned paths and closing block; failure blocks implementation.
   Continue by detaching at the existing remote tip, retaining reservations
   and updating Claimed by in the first commit, then push back to that ref.
   Shared checkout: claim through item status and lock rows before each edit,
   including new records; never create or switch a claim branch.
3. **Implement.** Follow the autonomous prompt for this one item. Do not
   accept/supersede decisions, insert or renumber existing queue items,
   exceed reservations, version-bump, tag, publish or ask the operator.
   Return a blocker when the brief cannot be honoured.
4. **Verify and commit.** Run the recorded gate exactly. Repair understood
   implementation failures and rerun. If the gate cannot run, install
   nothing it does not install itself: record the exact error in Blockers,
   commit/push recoverable work within the grant and return blocked, never
   verified or shipped. Follow signing, Rationale and gate-integrity rules.
5. **Integrate per profile.** Separate-worktree direct integration: push
   the verified claim and return ready; the orchestrator invokes ship-item's
   integrating mode. Shared checkout: invoke ship-item in the active tree.
   PR mode: invoke ship-item on the actual PR, including rebase, collision
   checks, own-number repair, both gates and completion commit. Keep its
   body/report current; ready requires checks at the current head. Merge
   only within the grant and report shipped only after confirmed landing.
   Retry a moved base at most twice; preserve unresolved claims on failure.
6. **Stop and report.** Put date/reason and the three reporting labels in
   the queued item's Stopped field, or the PR body if already moved there.
   Commit/push only within the grant. Return the fields below and the final
   block. Never create a coordination snapshot or silently delete dirty work.

## Execute, integrate and collect results

Dispatch the declared wave with the derived mechanism. Effective width is
one at rung three and for shared checkouts. At rung three finish and
integrate each item before starting the next. For parallel direct work,
invoke ship-item's integrating mode for ready claims in queue order, using
the detached integration worktree. Integration mechanics live in ship-item,
not in a second procedure here. PR hosts serialise authorised PR merges.

Normalise each return to: item key; outcome (shipped, ready, failed,
blocked, stopped, unknown); claim/actual branch; integration SHA or PR;
identifiers used/renumbered; blocker; conflict files; final block verbatim.
No return means unknown. Outcome is separate from Overall's vocabulary.
Report each item and a wave summary with Status at a glance; any unknown
caps the wave at partially verified. Include excluded/withdrawn claims,
effective width, rung, gate results, hooks/signing origins and remaining work.

Checkpoint asks before another wave. Continuous mode recollects from git
and proceeds within the confirmed budget. Read the shell clock at first
dispatch and after each wave; if unavailable report the soft cap as not
enforced. Stop starting waves past the cap; never cut off an in-flight item.

## Stop and cleanup

Stop on budget/queue exhaustion, operator stop, host limit, unknown/systemic
gate failure, non-Accepted ownership, ambiguous criteria, repeated substantive
conflicts, or more than half a wave failed/stopped/unknown. INDEX-only
conflicts do not count as substantive failures. A gate-environment blocker
ends the run. List unreported work as unknown, never silently completed.

Remove only clean owned scratch worktrees after their results are known;
preserve unmerged claims and dirty work. After the last item remove the clean
integration worktree; fast-forward the operator's checkout only if clean
and already on the integration branch. Report all leftover branches,
worktrees, stopped items and missing verification. No dashboard, reservation
file, replay journal or committed resume marker is created. A host replay
facility is optional only when the specification is unchanged.

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
