---
adr: 0004
title: ADRs are internal artefacts, never user-visible
status: Implemented
date: 2026-05-21
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0001"]
tags: [policy, privacy]
---

# ADR 0004 — ADRs are internal artefacts, never user-visible

## Context

The ADR catalogue (adr/0001-adr-driven-workflow.md) is a builder's tool.
When a coding agent implements behaviour, there is a real risk it leaks
internal identifiers — ADR numbers, ADR titles, "per the ADR catalogue" —
into strings that reach end users: UI copy, API responses, error
messages, customer logs, release notes. That couples a product surface to
an internal bookkeeping scheme and confuses users. The policy must be
explicit because the failure mode is easy and silent.

## Capability statement

ADR numbers, ADR titles, and the existence of the ADR catalogue must
never appear in any string the product emits to users. The convention
enumerates the **forbidden surfaces** (UI copy, API response bodies,
error messages, customer-visible logs, public docs, release notes,
marketing, support comms) and the **allowed locations** (code/template
comments, commit messages, PR descriptions, internal docs, `AGENTS.md`,
`CONVENTIONS.md`, `INDEX.md`, `plan/`). Both the bootstrap-installed
`AGENTS.md`/`CONVENTIONS.md` and the lifecycle skills enforce this, and
`/audit` checks for leaks.

## User stories / scenarios

- As a user of a product built with docflow, I never see internal ADR
  identifiers in the interface or error messages.
- As a coding agent, I have an explicit rule about where ADR references
  may and may not appear, so I do not leak them.

## Acceptance criteria

1. `AGENTS.md` and `CONVENTIONS.md` both state the privacy rule with the
   forbidden/allowed surface lists.
2. The "rule of thumb" (if a non-builder could read the string, the ADR
   reference comes out) is present.
3. `/audit` includes an ADR-privacy leak check over user-visible code
   paths.

## Out of scope

- Defining which specific files in a given target repo are user-visible
  (project-specific; recorded in that repo's `CONVENTIONS.md`).

## Open questions

- None.

## References / cross-links

- adr/0001-adr-driven-workflow.md
- adr/0007-lifecycle-skills.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-05-21 | r1 | Eugenio Minardi | Backfilled from commit d8c523e (forbid ADR references in user-visible product surfaces). |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-05-21 | — |
