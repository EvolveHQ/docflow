---
adr: 0007
title: Lifecycle skills for the ADR and plan loop
status: Implemented
date: 2026-05-22
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0001"]
tags: [skills, lifecycle]
---

# ADR 0007 — Lifecycle skills for the ADR and plan loop

## Context

Bootstrapping a repo (adr/0001-adr-driven-workflow.md) creates the
canonical files, but operating them by hand — picking the next ADR
number, keeping `INDEX.md` in sync, advancing status, moving `plan/`
items, appending the worklog — is error-prone. The repetitive lifecycle
operations should be skills so they are performed consistently. Because
these skills auto-trigger from their descriptions on some agents, their
trigger boundaries must be disjoint or the wrong skill fires.

## Capability statement

docflow ships seven lifecycle skills that operate on an already
-bootstrapped repo, each reading `CONVENTIONS.md` first and honouring the
recorded choices:

- **new-adr** — author one ADR (next number, right shape, INDEX + domain
  wiring, supersede linkage).
- **new-plan** — queue a unit of work tracing to its owning ADR(s).
- **ship-item** — run the completion event (verify → integrate →
  todo→done → ADR Accepted→Implemented → INDEX/WORKLOG).
- **add-convention** — assess whether a convention is worth codifying and
  route it to the right home.
- **audit** — lint the repo against its own conventions.
- **brainstorm** — decompose a problem into candidate ADRs + plan items.
- **agent-wave** — orchestrate parallel worktree subagents over the queue.

The skills refuse to run on an un-bootstrapped repo and point at
`/bootstrap`.

## User stories / scenarios

- As a maintainer, I want one command to author an ADR with numbering and
  INDEX handled, so the catalogue stays consistent.
- As a maintainer, I want shipping an item to be a single guarded
  operation, so status and queue never drift from git.

## Acceptance criteria

1. All seven skills are present and each reads `CONVENTIONS.md` before
   acting.
2. Each skill refuses to run on an un-bootstrapped repo and points at
   `/bootstrap`.
3. Skill descriptions have disjoint trigger boundaries so auto-trigger
   does not fire the wrong skill (the authoring skills explicitly
   delimit new-adr vs new-plan vs add-convention).

## Out of scope

- Dual-target packaging of these skills (see
  adr/0008-dual-target-packaging.md).

## Open questions

- None.

## References / cross-links

- adr/0001-adr-driven-workflow.md
- adr/0008-dual-target-packaging.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-05-22 | r1 | Eugenio Minardi | Backfilled from commits 00efffd (seven lifecycle skills) and fc4df0b (disjoint auto-trigger descriptions). |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-05-22 | — |
