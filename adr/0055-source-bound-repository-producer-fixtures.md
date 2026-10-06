---
adr: 0055
title: Source-bound repository producer fixtures
status: Accepted
date: 2026-09-15
owner: Codex, dispatched single Docflow writer
supersedes:
superseded-by:
depends-on: ["0033","0034","0035","0039","0054"]
tags: [v1, d3]
---

# ADR 0055 — Source-bound repository producer fixtures

## Context

Clarity C2 needs the exact supported repository formats, independently of the workspace format. Parent document 14 D3 and section 5 request producer-origin fixtures for discovery, shapes, optional layers, native Status and completion history. Fictional consumer-oriented layouts cannot demonstrate producer compatibility.

## Capability statement

Distribute a versioned repository fixture collection generated from exact bootstrap/authoring templates and retained legacy producer files. A documented deterministic renderer preserves source bytes outside explicit substitutions and emits per-file origins, hashes and expected observations. Include valid roots and lifecycle variants plus genuine invalid-pointer, duplicate and unknown diagnostics. Distinguish synthetic rendered records and simulated integration metadata from observed native execution, and hand the exact source revision to the Clarity owner through the coordinator.

## User stories / scenarios

- A consumer opens a custom nested pointer root using the producer's actual conventions.
- Historical two-shape files remain readable without forced migration or renumbering.
- A done file prepared on a branch remains integration-unverified.

## Acceptance criteria

1. Versioned cases cover default .docflow, root dot, docs and custom nested pointers, no-manifest legacy, explicit and legacy two-shape layouts and optional layers.
2. Native claimed/blocked/stopped/resumed, prepared versus integrated completion, moves/history and federation cases preserve identifiers and historic done bytes.
3. Each produced file records exact template or retained-file origin and substitutions; per-file SHA-256 and exact producing Git revision are published in a reproducible manifest.
4. Independent controls assert discovery/shape/status semantics and invalid-pointer/duplicate/unknown diagnostics without silently migrating files; actual renders and mutations are exercised.
5. The coordinator receives a source-bound C2/C12 handoff; no Clarity files are written, and unrun native/app cases remain queued.
6. Static, deterministic and fixture controls pass with gate changes in separate commits and all versions remaining 0.9.4.

## Out of scope

Consumer implementation, native full host/application qualification, forced legacy migration, public publication, main integration or version bump.

## Open questions

None blocking the bounded implementation; qualification remains separately queued.

## References

- adr/0033-artefact-root-discovery.md
- adr/0034-adr-shape-as-declared-metadata.md
- adr/0035-range-numbered-catalogue-migration.md
- adr/0039-plan-item-carries-its-own-status.md
- Parent DocflowHQ docs/14-docflow-clarity-v1-delivery-plan.md, revision 0.15.
- Operator dispatch task_b2132a3cb8c3 / ctx_06d7b40b0d52, 2026-09-15.
- plan/todo/0059-repository-producer-compatibility.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-09-15 | r1 | Codex | Record authorised D3 scope and bounded defaults before implementation. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Development mandate | Operator instruction recorded by Codex | 2026-09-15 | Current dispatch authorises agreed V1 implementation and signed task PR; no human signature, merge or release attestation asserted. |

