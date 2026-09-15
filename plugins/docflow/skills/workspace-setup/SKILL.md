---
name: workspace-setup
description: Create or deliberately adopt a multi-repository Docflow WORKSPACE with a registry and portable memory. Use for workspace-setup or establishing a workspace home. NOT for bootstrapping a member repository, orientation, planning an outcome or executing assignments.
---

# workspace-setup

Establish the operator-selected canonical workspace home.

## Operating contract

**Inputs:** selected destination, new/adopt choice, purpose, canonical home, member identities/paths, owner, native host and write scope.
**Effects:** create or merge only the agreed workspace files and ignores; initialise its Git history only when authorised. Cloning/registering members is a separate named effect. Never implicitly convert a parent container.
**Native claims / dependencies / resources:** confirm ownership of the destination and any shared configuration; require explicit member access before registration validation. No member execution is assigned.
**Stopping point:** a validated, inspectable workspace with a dated overview, or a concrete missing-input/asset/ownership blocker.
**Receipt:** paths created/merged, preserved files, package revision, actual validation command/output/exit, unresolved members, host availability and next action. Do not create a fictitious run for setup without a work/grant.

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

## Procedure

1. Inspect the selected destination and existing Git/ignore/instruction files.
   For adoption, describe the exact preservation/merge plan using supplied
   approval. Never replace existing content or initialise the surrounding
   container. Recheck permission for each write.
2. Follow the asset README's assembly mapping: workspace README and AGENTS
   at the root, registry/conventions/index under `.docflow_workspace/`.
   Create the five record folders plus agents, profiles, integrations and
   ignored local state. Ignore `/repos/` and `/.docflow_workspace/local/`
   without dropping existing ignore rules. Members retain independent Git
   histories, never submodules or copied governance.
3. Replace synthetic home/owner/paths with actual choices. Start with empty
   records and `{"schema":1,"sources":[]}`; register only supplied member
   identities, aliases, paths, role and native instructions. No remote fetch
   or clone follows merely from registry membership.
4. Copy the five workspace record forms to the adopter's
   `.docflow_workspace/templates/`, outside canonical record folders.
   Offer the four `workspace-role-*.md` starter forms, profile examples and
   source catalogue from bootstrap. Adopt only chosen entries, pin actual
   installed revisions and owner, and preserve existing configuration.
   Empty recommendations and no extra role/tool are valid choices.
5. Read `<assets>/guides/README.md` and the chosen native guide.
   Record availability separately from configuration and authority. Default
   search is ordinary files; optional retrieval remains experimental.
6. Validate and inspect the resulting diff. Derive INDEX from canonical
   records, with observation time and unresolved diagnostics. For a new empty
   home it lists no fabricated decisions, grants, runs or completion.
   Commit/publish only under the workspace's native Git rules and existing
   authority. Return the receipt; the next activity is workspace-orient or
   workspace-plan, not automatic dispatch.

## Recovery and unknown outcomes

Resume by inspecting actual files and Git state against the intended mapping;
do not rerun setup blindly. Preserve partial files and list the next missing
step. Missing access or a denied write blocks that effect, while safe reads
can explain the state. A validation timeout is unknown, never a completed
setup. Upgrade and removal use the asset README and preserve canonical
memory, independent members and native rules.

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

