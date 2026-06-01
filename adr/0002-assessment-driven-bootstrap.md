---
adr: 0002
title: Interactive assessment-driven bootstrap
status: Implemented
date: 2026-05-21
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0001"]
tags: [bootstrap, ux]
---

# ADR 0002 — Interactive assessment-driven bootstrap

## Context

The convention set from adr/0001-adr-driven-workflow.md is not
one-size-fits-all: ADR shape, status lifecycle, multi-agent mode,
integration model, and optional artefacts differ per project. A bootstrap
that hard-coded one shape would be wrong for most repos; one that dumped
all choices at once would overwhelm. The decision is *how* the bootstrap
elicits the project's profile.

## Capability statement

The bootstrap conducts a structured assessment of ten questions, asked
**one at a time**, each presenting a **recommended option** with a one
-line justification that the user can accept, override, or replace with a
custom answer. After all answers are in, the bootstrap summarises the
resulting plan and requires explicit sign-off before writing any files.
Question order respects cross-question dependencies (e.g. the integration
recommendation depends on the multi-agent mode chosen first).

## User stories / scenarios

- As a maintainer, I want a recommended default per question, so that I
  can bootstrap quickly without research.
- As a maintainer, I want to review a plan summary before any file is
  written, so that nothing lands without my approval.

## Acceptance criteria

1. The bootstrap asks exactly the ten assessment questions, sequentially,
   not as a batch.
2. Each question states a recommended option (except the
   project-specific ones) with a short reason.
3. A cross-check pass surfaces contradictory answers before the plan
   summary.
4. No file is written until the user signs off on the summarised plan.

## Out of scope

- Backfilling existing repos after the scaffold lands (see
  adr/0003-backfill-retrofit.md).

## Open questions

- None.

## References / cross-links

- adr/0001-adr-driven-workflow.md
- adr/0003-backfill-retrofit.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-05-21 | r1 | Eugenio Minardi | Backfilled from commits 17286a3, 49f0b47 (one-at-a-time questions with recommended option). |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-05-21 | — |
