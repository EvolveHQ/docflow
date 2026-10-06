---
adr: 0051
title: Portable workspace memory contract
status: Accepted
date: 2026-09-15
owner: Codex, dispatched Docflow foundations writer
supersedes:
superseded-by:
depends-on: ["0015", "0016", "0049"]
tags: [workspace, records, compatibility]
---

# ADR 0051 — Portable workspace memory contract

## Context

The operator selected workspace orchestration within Docflow V1, with
Docflow owning records and Clarity providing views and handoffs. These
choices are recorded in parent planning document 14 revision 0.15,
especially its opening decisions and W1/W2. The 15 September development
instruction authorises recording and implementing this bounded foundation.
This records that mandate; it creates no owner signature or independent
attestation. Historical conflicting proposals in document 09 do not apply.

Existing federation conventions remain a separate repository capability.
This workspace contract does not migrate members or change their native
identifiers, lifecycles, queues or completion events.

## Capability statement

Docflow distributes one portable, locally readable workspace contract for
adopters' Git repositories. Five canonical Markdown kinds live at stable
paths under `.docflow_workspace/`: ideas, decisions, work, knowledge and
runs. A text registry references independent checkouts, normally in ignored
`repos/`; ignored local state is disposable. Clarity reads, views, copies
and prepares handoffs; authorised Docflow use in a chosen native host edits
canonical records. No workspace is installed into the DocflowHQ container.

Full UUIDv4 metadata plus canonical home establishes identity. Readable
filenames use the first 12 lowercase UUID hex characters, extended by four
characters before publication on collision. Established paths are stable;
ambiguous short lookups fail, durable links retain home plus full UUID.
Workspace agreements use proposed/accepted/rejected/superseded, with
delivery tracked separately. A completed work item leaves its agreement
accepted. Selection only sets idea priority.

Routine implementation defaults: strict JSON-compatible YAML mappings in
the registry and Markdown front matter; schema version 1; no npm parser
dependency; explicit typed references and append-only transition history;
the proposed work, idea and run states in document 09; no mandatory knowledge
lifecycle. Unknown fields fail except in an explicit non-authoritative
extensions map. A bounded schema and validator ship at
`plugins/docflow/workspace/`, outside the executable-free skills tree.
Flat `workspace-*` templates stay in bootstrap's template home. Package
inclusion exposes the same assets to all five targets; no runtime launches.
Future workspace skill triggers explicitly target workspace operations;
the existing nine repository skills retain their current triggers and bytes.

## User stories / scenarios

- A group assembles a workspace without copying a member's governance.
- A consumer resolves a full identity despite short-prefix collisions.
- A reader sees accepted agreement and incomplete delivery independently.

## Acceptance criteria

1. Distributed skeleton, registry and five templates document ownership,
   stable paths, canonical references, native boundaries and ignored state.
2. The validator rejects malformed/unsupported metadata, duplicate full IDs,
   ambiguous short lookups, path collisions, missing/escaping member paths,
   invalid workspace states and cyclic dependency/successor graphs.
3. Valid fixtures preserve member identifiers and native Implemented states;
   workspace implemented is rejected; title changes preserve identity/path.
4. Collision extension and predecessor/successor references are covered by
   deterministic controls, with the canonical full identity preserved.
5. Schema, validator and valid/adverse producer fixtures are distributed in
   the package, with a concrete Clarity handoff path and source SHA.
6. Static verification and deterministic evals pass with all five packaging
   paths and existing nine skill bytes preserved; versions remain 0.9.4.

## Out of scope

- Four workspace operating skills, native host qualification, Clarity code,
  full V1 acceptance, publication and parent-container conversion.
- Altering existing federation rules or installing optional memory tools.

## Open questions

- None blocking this foundation. Versioned native environment qualification
  belongs to W3/W4 and the shared preparation track, not these controls.

## References

- adr/0015-multi-target-portability.md
- adr/0016-layered-artifact-model.md
- adr/0049-skill-directories-carry-declarative-host-interface-files-only.md
- Parent DocflowHQ docs/09-docflow-workspace-concept-and-design.md, revision 0.7.
- Parent DocflowHQ docs/14-docflow-clarity-v1-delivery-plan.md, revision 0.15.
- Parent DocflowHQ docs/15-release-verification-collection.md.
- Operator development instruction, 2026-09-15; Orca task task_bdc6fa916a05.
- plan/todo/0054-workspace-foundations.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-09-15 | r1 | Codex | Record already approved W1/W2 memory scope and bounded implementation defaults under the current development mandate; implementation pending. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Operator | Eugenio Minardi | 2026-09-15 | Recorded instruction: implement agreed V1 work in Orca worktrees and prepare review branches; document 14 records prior product choices; no signature or release attestation asserted. |
