---
adr: 0063
title: Machine-local checkout resolution
status: Proposed
date: 2026-09-22
owner: Codex, workspace gap authoring
supersedes:
superseded-by:
depends-on: ["0051", "0052", "0058"]
tags: [workspace, registry, portability]
---

# ADR 0063 — Machine-local checkout resolution

## Context

Design document 09, *docflow workspace: concept and proposed design*, §4
Repository registry, explicitly places machine overrides in ignored local
configuration and requires repository identities to survive different folder
names and workspaces. Document 14, *Docflow and Clarity V1 delivery plan*,
§4 W2 and §5 WV05/WV09/WV17, requires independent checkouts, shared ownership
and preservation of reference-only members. Both source documents are retained
under `../../.docflow_workspace/local/handoffs/design-docs/`.

The reviewed gap list, *Workspace gaps: second review* (2026-09-22), final
gap 5, finds that the existing registry resolves only shared paths. The
portable memory contract does not decide override precedence or validation.
An adopter currently has to edit shared metadata to use a different checkout
location. Docflow and Clarity need the same resolution contract; otherwise a
handoff can refer to different local files despite naming the same repository.

This decision adds location resolution only. Cross-checkout claim identity is
already required by adr/0051-portable-workspace-memory-contract.md and
adr/0052-workspace-authority-and-attempt-records.md; its defect needs a repair,
not a replacement decision. Authoring is authorised by the 22 September
handoff; acceptance and implementation of this proposal remain pending.

## Capability statement

A workspace consumer resolves a registered repository through an optional,
ignored `.docflow_workspace/local/checkouts.yaml` in that workspace home.
The proposed version-1 document contains `schema`, the exact canonical `home`,
and `repositories`, a list of `{id, path}` mappings keyed by canonical member
ID. It uses the workspace's strict JSON-compatible YAML subset. Only location
may be overridden; IDs, aliases, roles, remotes, instructions, grants and
evidence remain canonical. No environment-wide override or ambient discovery
participates in precedence.

An explicit valid mapping takes precedence over `workspace.yaml`'s member
path. Without a mapping, existing shared-path or remote-only behaviour
applies. A present invalid override fails explicitly and never falls back to
a different checkout. Each explicitly loaded external home resolves only its
own local mappings; a mapping for one home cannot redirect another home.

An absolute path can select an independent checkout outside the workspace.
A relative path resolves from the workspace root and must remain within it
after real-path resolution; use an explicit absolute path for an external
checkout. The selected directory becomes the member's containment boundary:
instruction and evidence paths must remain inside it, including through
symlinks. Neither the selected root nor its descendants may overlap any
loaded home's canonical workspace records. Two distinct member identities
cannot resolve to the same directory. Resolving a location never proves
repository identity, source revision, authority or exclusive ownership.

## User stories / scenarios

- An adopter relocates a checkout without changing shared registry bytes or
  breaking existing canonical references.
- Two collaborators resolve the same member to different local roots while
  sharing identity, native ownership and source-bound handoff checks.
- A Clarity user sees the same member or the same explicit resolution failure
  as the Docflow validator without the application editing canonical files.

## Acceptance criteria

1. With no local file or no entry for a member, all existing shared-path and
   remote-only fixtures retain their results. A valid entry overrides only
   that member's location; relocation leaves the shared registry, IDs, aliases,
   roles, grants and historical references byte-identical.
2. Duplicate entries, alias keys in place of canonical IDs, unknown members,
   mismatched homes, unknown fields, unsupported schemas and malformed files
   fail with actionable diagnostics. No invalid override silently falls back.
3. Absolute external roots and contained workspace-relative roots resolve
   deterministically. Missing/non-directory roots, relative traversal or
   symlink escape, workspace-record overlap and two identities selecting one
   directory fail. Referenced member files retain real-path containment.
4. The same canonical identity at separate roots still participates in the
   existing cross-home ownership checks. An override cannot bypass a native
   claim, grant, source revision check or reference-only restriction; adding a
   local path to a remote-only reference member confers no mutation authority.
5. Each external home uses its own home-bound local configuration. A copied
   override naming the wrong home fails; inaccessible required locations stay
   unresolved. Consumers do not clone, fetch, scan for or rewrite checkouts.
6. Versioned producer fixtures cover precedence, relocation, absent and invalid
   mappings, identities/aliases, external homes and containment. On paired
   sources, Docflow and Clarity agree on effective member roots and failure
   categories; Clarity viewing and refresh preserve canonical bytes.
7. Setup/adoption guidance explains the ignored file, precedence, external-root
   choice and diagnostics across the declared package targets. An isolated
   adoption test confirms local paths are absent from shared records, exported
   portable examples and committed workspace state.

## Out of scope

- Moving, cloning or fetching checkouts; generating native host configuration.
- Inferring identity from URL spelling or directories; replacing native claims
  with locks, a scheduler or a second ownership ledger.
- Overriding external-home registration, authority, source revisions or member
  governance; writing Clarity code in this repository.
- Release, publication or implementation before operator acceptance.

## Open questions

- Operator review must accept the proposed file shape and the rule that
  out-of-workspace locations use explicit absolute paths before implementation.

## References

- adr/0051-portable-workspace-memory-contract.md
- adr/0052-workspace-authority-and-attempt-records.md
- adr/0058-workspace-contract-r2.md
- plan/todo/0076-machine-local-checkout-resolution.md
- ../../.docflow_workspace/local/handoffs/workspace-gaps-review.md, final gap 5.
- ../../.docflow_workspace/local/handoffs/workspace-gaps-run2-write.md.
- ../../.docflow_workspace/local/handoffs/design-docs/09-docflow-workspace-concept-and-design.md, §4 Repository registry.
- ../../.docflow_workspace/local/handoffs/design-docs/14-docflow-clarity-v1-delivery-plan.md, §4 W2 and §5 WV05/WV09/WV17.

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-09-22 | r1 | Codex | Initial draft from the reviewed V1 location-resolution gap; operator acceptance pending. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
