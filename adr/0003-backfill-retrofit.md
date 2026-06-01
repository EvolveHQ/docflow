---
adr: 0003
title: Retrofit existing repos via backfill from code and history
status: Implemented
date: 2026-05-21
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0001", "0002"]
tags: [bootstrap, retrofit]
---

# ADR 0003 — Retrofit existing repos via backfill from code and history

## Context

docflow must work on existing repositories, not only fresh ones. An
existing repo already encodes decisions — in its modules, its
dependencies, and its commit history — that should become ADRs and
`plan/done/` entries rather than being lost. Inventing those records
automatically risks fabricating rationale, so the mechanism must keep the
human as the authority.

## Capability statement

After the scaffolding commit lands on an existing repo, the bootstrap
offers to **backfill** the ADR catalogue, the `plan/done/` queue, and
`CONVENTIONS.md` additions by scanning the existing code and git history.
The backfill runs in passes (scan → propose ADRs → propose plan/done →
propose conventions); every output is a **draft** the user approves in
batches before it is committed. If history is too sparse to support a
decision, the bootstrap says so and stops rather than inventing
rationale.

## User stories / scenarios

- As a maintainer of an existing repo, I want decisions inferred from my
  history, so that I do not have to author the whole catalogue by hand.
- As a reviewer, I want every inferred ADR presented as a draft, so that
  I remain the authority on whether a decision is real.

## Acceptance criteria

1. Backfill is offered only on existing repos, only after the scaffold
   commit.
2. It runs as discrete passes, each producing reviewable drafts before
   any commit.
3. Inferred ADRs for shipped behaviour are drafted as `Implemented` with
   a Revision History row citing the implementing commit(s).
4. Speculative rationale is flagged; sparse history stops the pass rather
   than producing invented records.

## Out of scope

- The non-interactive lifecycle skills (see adr/0007-lifecycle-skills.md).

## Open questions

- None.

## References / cross-links

- adr/0001-adr-driven-workflow.md
- adr/0002-assessment-driven-bootstrap.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-05-21 | r1 | Eugenio Minardi | Backfilled from commit c10fca4 (offer backfill of ADRs/plan/conventions from code and history). |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-05-21 | — |
