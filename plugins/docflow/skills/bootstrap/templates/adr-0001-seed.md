---
adr: 0001
title: Record architecture decisions as ADRs
status: Implemented
date: <YYYY-MM-DD>
owner: <agent-id or human>
supersedes:
superseded-by:
depends-on: []
tags: [process, conventions]
---

# ADR 0001 — Record architecture decisions as ADRs

<!-- Bootstrap writes this as the seed ADR (adr/0001) by default. It records
the *decision* to adopt the method; the operative rules live in
CONVENTIONS.md. Keep it generic — do not reference another project's ADR
numbers. For a split-shape repo, adapt to the technology-ADR shape. -->

## Context

<Project> needs its significant decisions to be **discoverable, traceable,
and durable** — not held in chat logs, pull-request threads, or one
person's memory. The lightweight Architecture Decision Record practice
(Michael Nygard, 2011; the markdown-ADR convention) records each decision
as one small, numbered, immutable file stored beside the code, so the
reasons behind the system are part of the repository.

## Capability statement

This repository is **documentation-led and ADR-driven**: every significant
decision is recorded as a numbered ADR under `adr/`; the catalogue is the
**source of truth** the running system is expected to match; and a status
lifecycle drives a `plan/` work queue. The authoring rules — ADR shape,
status lifecycle, numbering, audit trail, and git contract — live in
`CONVENTIONS.md`. This ADR records the **decision to adopt the practice**,
not the rules themselves.

## User stories / scenarios

- As a contributor, I find the reasons behind this system in the catalogue,
  not by asking someone.
- As a maintainer, each decision, the work that implements it, and the
  commit that ships it are linked through one stable identifier.
- As a new reader, the first ADR explains why this repository uses ADRs and
  points me at where the rules live.

## Acceptance criteria

1. Significant decisions are recorded as numbered ADRs under `adr/`,
   following `CONVENTIONS.md`.
2. The catalogue is the source of truth; code is expected to match the
   decisions it records.
3. ADR authoring, the status lifecycle, and the `plan/` queue follow
   `CONVENTIONS.md`.

## Out of scope

- The detailed authoring rules (ADR shape, lifecycle, numbering, git
  contract) — these live in `CONVENTIONS.md`, not here.

## Open questions

- None.

## References / cross-links

- CONVENTIONS.md (the operative authoring rules)
- Michael Nygard, "Documenting Architecture Decisions" — https://adr.github.io

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| <YYYY-MM-DD> | r1 | <owner> | Adopted the documentation-led, ADR-driven method (seeded at bootstrap). |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| <role> | <name> | <YYYY-MM-DD> | — |
