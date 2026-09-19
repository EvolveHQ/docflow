---
name: workspace-scope
description: "Record a WORKSPACE outcome and its authority: ideas, decisions, work, deliveries, criteria, grants and recommendations, accepting a decision or recording a grant from a committed mandate note. Use for workspace-scope on cross-repository outcomes. NOT for a native repository plan/todo item (use new-plan), dispatching, syncing, setup or a read-only briefing."
---

# workspace-scope

Turn a shared outcome into inspectable workspace records and native delivery references.

## Operating contract

**Inputs:** outcome/scope/exclusions, canonical home, owner, supplied choices, linked ideas/agreements, native delivery homes, criteria and priorities.
**Effects:** authorised canonical planning edits only; acceptance/grant revisions require their actual source mandate. No launch, member implementation, claim acquisition or automatic tool setup.
**Native claims / dependencies / resources:** inspect existing native work/claims and shared resources before proposing assignments; native queue creation remains a separately authorised native action.
**Stopping point:** validated planning records with explicit next action and missing authority/dependencies.
**Receipt:** exact created/edited full references, decisions/choices reused, native source revisions, checks, blockers and what requires subsequent authority.

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

1. Orient from current files. Reuse supplied choices; if outcome or ownership
   is materially ambiguous, ask that one question and continue independent
   reads. Trace existing records before creating another one.
2. Use bootstrap's five record forms and the schema exactly. Mint a UUIDv4
   for each new record, keep its home/full identity, use a readable slug plus
   12 UUID hex characters, extend by four on collision before publication.
   Never overwrite a published path or change identity because a title changes.
   JSON-compatible YAML front matter is one strict JSON object.
3. Select ideas only to set priority. Record agreement acceptance only with
   the actual actor/time/mandate; otherwise leave proposed. Preserve append-only
   history and reciprocal supersession links. Do not expand a prior agreement
   silently or mark workspace decisions implemented.
4. Define work outcome, scope/exclusions, criteria, owner, blockers and
   next_action. Link each required native delivery by repository, exact path,
   source revision, scope revision and declared native completion event.
   Preserve native identifiers, methods, instruction paths and integration
   rules. Planned work may have no grant and unknown delivery observations.
5. Check dependency cycles and shared exclusive resources. Record unmet
   dependencies explicitly. A reference-only member is evidence input, not
   an implementation target; a remote-only reference resolves by identity
   only. Knowledge may cite a content-addressed external source, and a
   derived documentation set is registered in `sources.yaml` rather than
   vendored into the workspace. Do not assign over an unknown or live claim.
6. Read `<assets>/guides/recommendations.md`. Record contextual reference,
   enable or use recommendations with exact source revision, fit, scope,
   availability, authority or null, setup dependency, fallback and success
   check. Compare documentation, React and Svelte/Tauri needs separately.
   Offer add nothing; retain declined/deferred choices until relevant context
   changes. Selection never installs, enables, launches or grants permission.
7. Record an existing compatible grant only from its actual mandate with
   exact actor/delivery/actions/effects, conditions, validity and stopping
   point. Absent or conflicting authority stays absent/blocked; no fabricated
   signature. Actor/scope change requires a suspended predecessor or new
   grant; append revisions and retain old ones. Delegation still belongs to
   workspace-dispatch after current checks.
8. Validate at actual UTC time and compare with the prior validated snapshot
   when available. Inspect the diff; refresh the derived INDEX with time,
   source references and diagnostics under existing write authority. Commit
   under native workspace rules only when authorised. Return the receipt.

## Recovery and unknown outcomes

Keep incomplete work planned with its owner, blockers and precise next_action.
If a write failed, inspect which records actually changed before retrying an
allowed action. Preserve the prior grant and history; expired authority never
becomes valid by copying it into a new brief. Mark unknown observations
honestly and leave unsupported native transitions to that member's owner.

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
