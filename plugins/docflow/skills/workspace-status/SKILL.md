---
name: workspace-orient
description: Read a Docflow WORKSPACE to identify priorities, agreements, owners, delivery progress, blockers and next actions, including fresh-session recovery. Use for workspace-orient or understanding a workspace. NOT for creating records, planning changes or dispatching work.
---

# workspace-orient

Give a source-backed view of what matters and what can happen next.

## Operating contract

**Inputs:** canonical workspace root and optional focus/full record reference, actor/host and permitted reading scope.
**Effects:** read and report only; no canonical edit, claim, grant, index write, install or dispatch.
**Native claims / dependencies / resources:** observe their current native sources for relevant work; missing access means unknown rather than free ownership.
**Stopping point:** a dated orientation with source paths/revisions and explicit gaps.
**Receipt:** actual reads/checks and output, owner/branch/blocker/next action for focused work, latest grant applicability and observed native integration state.

## Resolve inputs and current authority

Reuse applicable choices already supplied, including host, actor, paths,
scope, depth and stopping point. Summarise the resolved choices; ask only
for a material missing or conflicting choice. A recorded preference alone
does not supply authority. Selection sets priority; accepted agreement,
role, profile, registry membership and a copied brief grant no execution.

Locate the installed sibling bootstrap skill (resolve symlinks first).
Its `templates/workspace-assets.json` lists the packaged asset locations:
`../../workspace` in a plugin or `../../docflow-workspace` in a detached
copy, relative to bootstrap. An explicit asset root is valid. Read that
root's `CONTRACT.md`, `schema.json` and `README.md`; all templates are
in bootstrap's `templates/`. If missing, report the exact missing asset
and stop dependent writes. Never assume a source checkout or install/fetch
dependencies implicitly. The external validator requires Node.js 22+.

Read the workspace entry point, registry and conventions, then the current
canonical records and declared native member instructions. Resolve canonical
home/full UUID and contained paths, including symlinks; a missing member
stays registered with diagnostics. Search only authorised roots. Copied
context and search indexes are discovery aids: read current authority,
claims and critical constraints directly.

Before each dependent action, recheck the actual operator mandate for actor,
scope, effects, conditions and stopping point. Initial authorised setup,
scoped reads and authorised canonical planning use that mandate; they do
not require or justify inventing a work record or execution grant.
For grant-bound native execution, additionally recheck the current grant:
actor, scope revision, delivery, action/effects, conditions, start, expiry,
revocation/suspension, exact grant revision and stopping point. Reuse an
existing compatible grant; request only missing or changed authority.
Check native ownership, dependencies and shared resources separately.
Reference-only members permit only scoped non-mutating actions. A denied
tool/action stops that action across alternate tools, routes and delegates.
Contact loss is not worker exit and never permits reassignment.

Validate with `node <assets>/validate.mjs <workspace> --at <current-UTC>`;
supply the actual UTC time and retain complete output/exit. Validation checks
record consistency, not permission, live ownership or proof of execution.
Unknown, stale, skipped, missing and failed evidence remain distinct.

## Procedure

1. Read README, AGENTS, registry and conventions; validate the workspace.
   If malformed, report diagnostics alongside readable unaffected records.
   Open the five canonical folders directly; INDEX is a dated derivative.
   An empty search result is not evidence of an empty queue or free claim.
2. Identify selected ideas, current accepted decisions and linked work.
   Keep agreement, priority, grants and delivery progress separate. Show
   superseded/rejected history without reviving it. A native member's
   legitimate Implemented state is not a workspace decision state.
3. For each relevant work record report full identity, priority, owner,
   blockers, dependencies, next_action and latest runs. Distinguish a
   grant-bound attempt from an imported/backfilled run: imported history is
   read-only and carries no workspace grant, so it never proves current
   authority. For native references
   read exact paths/revisions and current Status, branch and checks where
   authorised. Use the member's own discovery and queue conventions; do not
   create a competing queue or force a migration.
4. For a stopped/blocked item, name its existing owner, actual branch,
   blocker, last reconciled attempt and next step. Distinguish a stopped
   actor from an unknown/disconnected one. A terminal still existing does not
   prove its agent is active; silence does not prove exit. Report stale
   observations and ask for missing evidence only when needed for a next action.
5. Explain current authority without granting it. Read latest grant actor,
   scope/revision, expiry and revocation, native claims and resource
   reservations. Explicitly distinguish an executable assignment from a
   planned item without a grant; blocked dependencies remain visible.
6. A file in native plan/done on an unmerged branch is prepared completion.
   Only checked integration evidence under the member's actual completion
   event supports shipped status. One passed run or delivery does not close
   parent work. Completed work leaves the current agreement accepted.
7. Optionally identify already available relevant roles/profiles and sources
   through `<assets>/guides/recommendations.md`; distinguish reference,
   enable and use. Retain unchanged declined choices; add nothing when
   existing file tools suffice. Return a concise dated view and source links.

## Recovery and unknown outcomes

A fresh session repeats source reads, not the previous questionnaire.
Retain valid supplied focus and host choices; flag revisions that changed.
Do not refresh INDEX or repair malformed records during this read-only skill:
name the scoped workspace-plan or workspace-coordinate action needed.
No run or canonical receipt is invented for read-only orientation.

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
