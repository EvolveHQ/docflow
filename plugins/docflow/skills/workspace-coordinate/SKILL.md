---
name: workspace-coordinate
description: Coordinate an already planned WORKSPACE outcome through current grants, native claims, bounded assignment briefs and source-bound receipt reconciliation. Use for workspace-coordinate, resuming an authorised assignment or reconciling its return. NOT for a native repository agent wave, planning new scope, setup or read-only orientation.
---

# workspace-coordinate

Prepare, hand off and reconcile bounded native assignments under current authority.

## Operating contract

**Inputs:** full work/delivery reference, actor/host, exact grant revision, workspace/member revisions, native instructions/claim, dependencies/resources, checks, stopping point and return path.
**Effects:** only current-grant actions, plus authorised canonical coordination/reconciliation writes. Native host commands are chosen explicitly from the installed guide; no new scheduler or automatic cross-host launch.
**Native claims / dependencies / resources:** require source-bound native ownership or owner-confirmed-serial evidence, completed dependencies and available reserved resources before assignment and each dependent action.
**Stopping point:** the brief's boundary, revoked/expired/denied authority, missing ownership/dependency evidence, or a reconciled terminal receipt.
**Receipt:** exact source revisions, commands, exits/output, actions, evidence, selected/used assets, blockers, actor/host, reconciliation identity/time and next action. Unknown results remain unknown.

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

Before each dependent action, recheck the source mandate and current grant:
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
   links only after the predecessor has a reconciled terminal receipt.
   Preserve its history. The same actor may reuse a still-compatible grant;
   another actor/scope requires fresh compatible authority. Recheck claims,
   dependencies and resources before the successor starts.

## Reconcile and close the assignment

9. The authorised coordinator inspects the exact returned brief binding,
   source revision, changed paths, native checks and ownership evidence.
   A receipt label/hash/location alone proves neither truth nor authority.
   Preserve the returned receipt verbatim; record reconciliation actor/time
   and source-bound observations in the run. Mismatched, missing, failed,
   skipped or stale evidence cannot satisfy completion.
10. Record exact commands, nullable exits for unknown/skipped checks, full
    relevant output, outcome, evidence, used assets, blockers and next action.
    Distinguish a successful assignment from native delivery integration.
    Update work observations only from checked native completion evidence.
    Keep partial delivery and unmet combined criteria visible.
11. Work can become done only when all required native deliveries and every
    work criterion have matching passed evidence at their declared revisions.
    A prepared PR or file move alone is not shipped integration. Leave its
    still-current agreement accepted. Cancelled work records partial-work
    disposition in next_action.
12. Validate updated records, preserving immutable briefs and append-only
    history, and refresh INDEX under canonical-write authority. Return the
    receipt even when reconciliation cannot finish; list the exact missing
    evidence and owner. Do not delete member branches/worktrees or release
    resources without their native rules and positive completion evidence.

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

