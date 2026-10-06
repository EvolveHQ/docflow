---
adr: 0003
title: Queue-driven implementation
status: Accepted
date: 2026-02-02
owner: eval-bot
supersedes:
superseded-by:
depends-on: ["0002", "0101"]
tags: [fixture]
---

# ADR 0003 — Queue-driven implementation

## Context

Accepted decisions need a visible unit of work, or they sit unbuilt.

## Capability statement

Every accepted decision has one queued work item naming it as owner, and
the move from `plan/todo/` to `plan/done/` is the completion event that
advances the owning record to `Implemented`.

## User stories / scenarios

- As a maintainer, I see what is queued and what shipped without reading
  the git log.
- As an agent, I take the lowest-numbered item in `plan/todo/` and build
  exactly its scope.

## Acceptance criteria

1. Every `Accepted` record has a `plan/todo/` item naming it.
2. Every `Implemented` record has a `plan/done/` entry.
3. A shipped entry names the shipping commit.

## Out of scope

- Estimating or scheduling queued items.

## Open questions

- None.

## References

- adr/0002-searchable-decision-catalogue.md
- adr/0101-markdown-files-in-git.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-02-02 | r1 | eval-bot | Initial draft. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | eval-bot | 2026-02-02 | — |
