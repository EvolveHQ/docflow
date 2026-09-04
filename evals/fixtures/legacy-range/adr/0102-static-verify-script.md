---
adr: 0102
title: A static verify script as the gate
status: Accepted
date: 2026-02-09
owner: eval-bot
supersedes:
superseded-by:
depends-on: ["0002", "0101"]
tags: [fixture]
---

# ADR 0102 — A static verify script as the gate

## Context

Conventions that nothing checks drift. The catalogue in
adr/0101-markdown-files-in-git.md is plain files, so the checks can be
plain file checks.

## Decision

Ship a single dependency-free script that validates numbering, index
fidelity, status values and section order, and run it before every push.

## Rationale

Alternatives considered: review discipline alone (rejected — it fails
silently and unevenly); a linter plugin per editor (rejected — it does
not run in CI and cannot gate a push); a hosted service (rejected — a
network dependency for a check over local files).

## Consequences

Every convention worth having has to be expressible as a check over
files, which keeps the conventions concrete.

## Acceptance criteria

1. The script exits non-zero on any violation and names the file.
2. It needs no network access and no installed dependencies.
3. It runs before every push.

## Out of scope

- Behavioural checks that need an agent in the loop.

## References

- adr/0002-searchable-decision-catalogue.md
- adr/0101-markdown-files-in-git.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-02-09 | r1 | eval-bot | Initial draft. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | eval-bot | 2026-02-09 | — |
