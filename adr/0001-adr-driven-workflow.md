---
adr: 0001
title: Documentation-led, ADR-driven workflow as the product
status: Implemented
date: 2026-05-21
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: []
tags: [core, workflow]
---

# ADR 0001 — Documentation-led, ADR-driven workflow as the product

## Context

Documentation-led projects rot when conventions live in someone's head:
a fresh contributor (human or coding agent) has no canonical place to
learn how the repo is meant to be driven. docflow exists to make those
conventions explicit, machine-readable, and uniformly applied. This ADR
records the foundational decision the whole tool is built around.

## Capability statement

docflow installs a small set of canonical files that together form the
control surface of a repository: an **Architecture Decision Record (ADR)
catalogue** as the source of truth for decisions, a **`plan/` queue**
(`todo/` + `done/`) as the actionable work list, an **`AGENTS.md`**
hard-rules entry point (with a `CLAUDE.md` re-export), a
**`CONVENTIONS.md`** authoring spec, a generated **`INDEX.md`**, and an
**`_agent/`** coordination directory. A repo carrying these files can be
picked up and driven by both humans and agents with no oral handover.

## User stories / scenarios

- As a maintainer, I want decisions recorded as numbered ADRs, so that
  the "why" behind the system is durable and discoverable.
- As a coding agent, I want a single hard-rules entry point
  (`AGENTS.md`), so that I can act correctly without guessing local
  conventions.
- As a contributor, I want a `plan/` queue that mirrors decisions, so
  that I know what to do next and when it is done.

## Acceptance criteria

1. The scaffold writes `AGENTS.md`, `CLAUDE.md`, `CONVENTIONS.md`,
   `INDEX.md`, `adr/0000-template.md`, `plan/` (with `todo/` + `done/`),
   and `_agent/` into the target repo.
2. ADRs are the source of truth: one decision per ADR, contiguous
   zero-padded numbering, status lifecycle drives `plan/` placement.
3. `git mv plan/todo/X plan/done/<date>-X` is the completion event and
   advances the owning ADR(s) from `Accepted` to `Implemented`.
4. `INDEX.md` is treated as generated from ADR metadata, not
   hand-edited.

## Out of scope

- The specific assessment questions (see adr/0002-assessment-driven-bootstrap.md).
- The lifecycle skills that operate the loop (see adr/0007-lifecycle-skills.md).

## Open questions

- None.

## References / cross-links

- adr/0002-assessment-driven-bootstrap.md
- adr/0007-lifecycle-skills.md
- `CONVENTIONS.md`, `AGENTS.md`

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-05-21 | r1 | Eugenio Minardi | Backfilled from commit 17286a3 (initial project-bootstrap plugin). |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-05-21 | — |
