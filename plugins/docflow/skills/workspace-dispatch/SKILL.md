---
name: workspace-dispatch
description: Dispatch an already scoped WORKSPACE outcome: check current grants, native claims, dependencies and resources, write a bounded brief and hand it to a native host. Use for workspace-dispatch or handing off an authorised assignment. NOT for reconciling a return, maintenance observation, planning scope, native agent waves, setup or read-only briefing.
---

# workspace-dispatch

Prepare and hand off a bounded native assignment under current authority.

## Operating contract

**Inputs:** full work/delivery reference, actor/host, exact grant revision, workspace/member revisions, native instructions/claim, dependencies/resources, checks, stopping point and return path.
**Effects:** only current-grant actions and the authorised brief/dispatch record.
Reconciling a return or writing delivery observations belongs only to workspace-sync. Native host commands are chosen explicitly from the installed guide; no new scheduler or automatic cross-host launch.
**Native claims / dependencies / resources:** require source-bound native ownership or owner-confirmed-serial evidence, completed dependencies and available reserved resources before assignment and each dependent action.
**Stopping point:** the brief's boundary, revoked/expired/denied authority, or missing ownership/dependency evidence. Reconciling a returned receipt belongs to workspace-sync.
**Receipt:** exact source revisions, commands, exits/output, actions, evidence, selected/used assets, blockers, actor/host, handoff status and next action. Reconciliation identity/time belongs to workspace-sync. Unknown results remain unknown.

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
Reference-only members permit only scoped non-mutating actions; a
remote-only reference resolves by identity only. An imported/backfilled run
is read-only history and never satisfies a dispatch, claim or completion
check. A denied
tool/action stops that action across alternate tools, routes and delegates.
Contact loss is not worker exit and never permits reassignment.

Validate with `node <assets>/validate.mjs <workspace> --at <current-UTC>`;
supply the actual UTC time and retain complete output/exit. Validation checks
record consistency, not permission, live ownership or proof of execution.
Unknown, stale, skipped, missing and failed evidence remain distinct.

For external returns, follow the installed asset README's **External returns**
procedure. A readiness stop before assignment is a report, not an attempt
receipt: do not invent a run to accommodate it. For an assigned attempt, copy
only the receipt form's structure, bind the actual run in the external context,
and keep native session/action metadata outside the strict receipt payload.
Capture actual UTC when observing evidence and returning the result. Never
substitute a different event's time or an example value for a missing measurement.
Use real contained file paths for evidence, not a repository directory or `.`.
Run the documented read-only shape check before returning; a shape pass does
not establish source resolution, current authority or truth.

## Prepare and hand off

1. Orient and reread current work, latest grant and native instructions.
   Validate at current UTC time. A valid planned record alone is not
   executable. Before every action apply the authority checks above; do not
   re-ask a current compatible grant. Expired, revoked, suspended, conflicting
   or scope/actor-changed authority blocks the dependent action.
2. Observe the native claim at its shared source. If none exists, obtain
   source-bound owner-confirmed-serial evidence under the native rules.
   Check overlapping runs across all explicitly linked workspaces and
   repositories, dependencies and shared exclusive resource reservations.
   An unavailable required home/claim is unknown, not a free slot.
3. Use bootstrap's brief/run forms. Bind exact workspace/member base
   revisions, work/delivery/scope and grant revision, actor/host, claims,
   dependencies, resources, checks, exclusions, stopping point and return
   path. Create a running record only for an authorised attempt about to
   start; do not fabricate an already performed action.
4. Read the chosen installed `<assets>/guides/<host>.md`. Use its native
   session/task interface only under the supplied execution mandate.
   Explicitly carry member instructions and the minimal permitted context.
   A manual copy/handoff is valid; an unavailable native command is a blocker
   for that route. Clarity may view/copy/prepare the handoff, never mutate
   canonical records or grant execution.
5. An executor outside the workspace can receive an immutable brief snapshot
   and return a separate receipt at the agreed accessible location. It need
   not have canonical write access. Bind snapshot/source revisions and
   obtain current authority/ownership evidence through the authorised
   coordinator before dependent actions; an old snapshot alone is insufficient.
   Never copy private member data, credentials or unrelated home directories.

## Execute and recover

6. Track actual action names/times and command effects. Recheck authority
   and claims at each boundary, especially after host/actor/source changes.
   Use only available compatible selected assets under the current grant.
   Record selected and actually used sources separately; failed setup does
   not justify an undeclared installer or network route.
7. On explicit denial stop that action across tools/routes/delegates.
   On contact loss retain the attempt and ownership as unknown. Do not
   mark stopped or reassign merely because a timeout, expiry or missing
   heartbeat occurred. Ask the native owner for exit/return evidence.
8. Resume/reassign through a new run identity with reciprocal predecessor
   links only after the predecessor has a terminal receipt that workspace-sync has independently reconciled.
   Preserve its history. The same actor may reuse a still-compatible grant;
   another actor/scope requires fresh compatible authority. Recheck claims,
   dependencies and resources before the successor starts.

## Unknown outcomes

If no receipt returns, record only observed facts and keep the result unknown.
A read-only executor returns its receipt externally; it must not work around
denied canonical writes. If the contract cannot represent a required fact,
stop the dependent edit, preserve the source evidence and request a bounded
contract correction from its owner; never invent schema fields.

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
