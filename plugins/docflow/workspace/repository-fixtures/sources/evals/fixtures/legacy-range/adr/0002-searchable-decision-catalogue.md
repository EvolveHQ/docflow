---
adr: 0002
title: A searchable decision catalogue
status: Implemented
date: 2026-01-19
owner: eval-bot
supersedes:
superseded-by:
depends-on: ["0001"]
tags: [fixture]
---

# ADR 0002 — A searchable decision catalogue

## Context

A reader needs to find the decision governing an area without reading
every file in `adr/`.

## Capability statement

The catalogue is searchable by number, title and status from a single
generated index, and every record is reachable by a stable relative path.

## User stories / scenarios

- As a reviewer, I open `INDEX.md` and find the record governing an area
  by title.
- As an author, I cite a decision by its relative path and the link
  resolves from anywhere in the repository.

## Acceptance criteria

1. `INDEX.md` lists every record with number, title, status and date.
2. Every index row links to an existing file.
3. Cross-references between records use relative paths.

## Out of scope

- Full-text search over record bodies.

## Open questions

- None.

## References

- adr/0001-record-architecture-decisions.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-01-19 | r1 | eval-bot | Initial draft. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | eval-bot | 2026-01-19 | — |
