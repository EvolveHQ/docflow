---
adr: 0018
title: Work-in-progress stays out of the ADR catalogue
status: Accepted
date: 2026-06-17
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0001", "0013", "0014"]
tags: [conventions, adr-lifecycle]
---

# ADR 0018 — Work-in-progress stays out of the ADR catalogue

## Context

A natural request is a "Draft" ADR status or a `brainstorming/` folder for
work-in-progress decisions. The lightweight-ADR sources argue against it:
ADRs record **the final consensus deemed implementable** — "no ADR
without team communication" — and "once approved it cannot be modified,
only the status" (Fandom Engineering). ADRs capture *outcomes*, not the
decision-making process. docflow already embodies this: the `brainstorm`
skill proposes candidates **in conversation and writes nothing** until
approved. Persisting drafts in the repo would add noise and, by
allocating numbers early, work against the concurrency guardrails
(adr/0014-concurrency-guardrails.md). The decision is to make this
explicit and keep WIP out of the catalogue.

## Capability statement

In-progress and draft decisions are **not persisted in the ADR
catalogue**:

- The status lifecycle has **no `Draft` state**; an ADR's first persisted
  status is `Proposed` (adr/0013 / CONVENTIONS lifecycle unchanged).
- `brainstorm` proposes candidates interactively and **writes nothing**
  until the operator approves; only then does `new-adr` create a numbered,
  `Proposed` ADR.
- **No `brainstorming/`/`drafts/` folder** is created — WIP lives in the
  conversation, not the repo.
- `README.md` documents this choice and its rationale so users understand
  why there is no draft state.

## User stories / scenarios

- As a reader, the ADR catalogue contains only real decisions — no
  half-formed drafts to wade through.
- As an author, I explore freely in `brainstorm` and nothing lands until I
  approve it.
- As a maintainer, the numbering stays clean because numbers are only
  assigned to decisions that are actually recorded.

## Acceptance criteria

1. The status lifecycle defines no `Draft` state; the first persisted
   status is `Proposed`.
2. `brainstorm` writes nothing until approval (reaffirmed); no
   `brainstorming/`/`drafts/` folder is part of the scaffold.
3. `README.md` documents the WIP-stays-out choice and its rationale
   (ADRs record outcomes; discussion happens before the record).

## Out of scope

- Capturing raw inputs — references/links belong in an ADR's *References*
  or are folded into the brainstorm conversation, not a standing folder.

## Open questions

- None.

## References / cross-links

- adr/0001-adr-driven-workflow.md
- adr/0013-interactive-assessment-protocol.md
- adr/0014-concurrency-guardrails.md
- https://medium.com/fandom-engineering/keep-programmers-decisions-documentation-up-to-date-and-simple-with-architecture-decision-records-8ef5f1761ba

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-17 | r1 | Eugenio Minardi | Initial decision. Keep WIP/drafts out of the catalogue: no Draft status, no brainstorming/ folder; brainstorm stays chat-only; document the choice in README. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-06-17 | — |
