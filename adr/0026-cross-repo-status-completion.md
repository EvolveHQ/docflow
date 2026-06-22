---
adr: 0026
title: Cross-repo status and completion
status: Proposed
date: 2026-06-22
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0025"]
tags: [multirepo, lifecycle, status]
---

# ADR 0026 — Cross-repo status and completion

## Context

The status lifecycle (`Proposed → Accepted → Implemented → …`) assumes one
repo with one `main` and one completion event. A decision spanning repos
has several mains and may be done in some repos but not others. The
federation needs a defined meaning for "Implemented" and a way to show
partial progress, without requiring cross-repo writes.

## Capability statement

A cross-repo decision's status reflects **per-repo implementation
progress**. It reaches `Implemented` only when **every** owning per-repo
plan item (adr/0025-cross-repo-plan-ownership.md) has shipped under its own
repo's completion event; partial implementation (some repos done) is
representable and visible.

## User stories / scenarios

- As a maintainer, I see that a product-wide decision is "2 of 3 repos
  shipped" rather than a misleading binary.
- As a release manager, I rely on a decision being `Implemented` only when
  all affected repos have actually shipped.
- As a reader of the roll-up, aggregate status is visible in one place.

## Acceptance criteria

1. The status model accommodates a decision implemented across multiple
   repos.
2. A decision is `Implemented` only when every owning per-repo plan item
   has shipped, each per its own repo's completion event
   (adr/0006-integration-model.md).
3. Partial implementation (some repos done, others not) is representable
   and visible.
4. Each repo's completion event remains defined by that repo's integration
   model.
5. The roll-up catalogue (adr/0024-federated-rollup-catalogue.md) reflects
   aggregate status.

## Out of scope

- Each repo's own integration model — adr/0006-integration-model.md.

## Open questions

- Where aggregate status physically lives (the home ADR vs the roll-up)
  and how it updates without cross-repo writes.

## References / cross-links

- adr/0025-cross-repo-plan-ownership.md
- adr/0024-federated-rollup-catalogue.md
- adr/0006-integration-model.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-22 | r1 | Eugenio Minardi | Initial draft. Aggregate status from per-repo progress; Implemented only when all owning plan items ship; partial implementation visible. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
