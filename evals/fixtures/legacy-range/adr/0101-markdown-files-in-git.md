---
adr: 0101
title: Markdown files in git as the store
status: Implemented
date: 2026-01-19
owner: eval-bot
supersedes:
superseded-by:
depends-on: ["0002"]
tags: [fixture]
---

# ADR 0101 — Markdown files in git as the store

## Context

The catalogue promised by adr/0002-searchable-decision-catalogue.md needs
somewhere to live.

## Decision

Store every record as a Markdown file in the repository, versioned by git.
No database, no external service.

## Rationale

Alternatives considered: a hosted wiki (rejected — the records would not
move with a branch, so a decision and the code implementing it could not
be reviewed together); a database behind a small service (rejected — it
adds an availability dependency to reading a decision, and diffs stop
being reviewable); an issue tracker (rejected — issues close, decisions
do not, and the tracker has no stable ordering).

## Consequences

Records are reviewed like code and branch with it. The trade-off is that
renaming a file is a real refactor: every relative link has to follow.

## Acceptance criteria

1. Each record is one Markdown file under `adr/`.
2. Records are versioned with the code, in the same repository.
3. Relative links between records resolve from a plain checkout.

## Out of scope

- Rendering the catalogue as a site.

## References

- adr/0002-searchable-decision-catalogue.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-01-19 | r1 | eval-bot | Initial draft. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | eval-bot | 2026-01-19 | — |
