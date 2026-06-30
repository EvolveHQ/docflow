---
adr: 0003
title: Backfill — retrofit existing repos and capture undocumented developments
status: Accepted
date: 2026-05-21
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0001", "0002"]
tags: [bootstrap, retrofit]
---

# ADR 0003 — Backfill — retrofit existing repos and capture undocumented developments

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

The same mechanism is also a **re-runnable, scoped capture path**. When a
substantial development lands in an already-docflow repo **without** an
owning ADR or plan item — a large feature built ahead of the process — it is
captured the same way: reconstruct the decision(s) it embodies as ADR(s)
drafted at `Implemented` (Revision History citing the implementing commits
and noting they were recorded after the fact), plus matching `plan/done`
entries, rather than leaving the work only in git history. A large
development is never *outside* the model — it is an ADR not yet written.
`audit` surfaces substantial undocumented work so such escapes are noticed,
not silently accumulated.

## User stories / scenarios

- As a maintainer of an existing repo, I want decisions inferred from my
  history, so that I do not have to author the whole catalogue by hand.
- As a reviewer, I want every inferred ADR presented as a draft, so that
  I remain the authority on whether a decision is real.

## Acceptance criteria

1. Backfill is offered on existing repos after the scaffold commit, **and
   is re-runnable at any time** to capture a development that landed
   without an ADR/plan — scoped to that development.
2. It runs as discrete passes, each producing reviewable drafts before
   any commit.
3. Inferred ADRs for shipped behaviour are drafted as `Implemented` with
   a Revision History row citing the implementing commit(s) and noting they
   were recorded after the fact.
4. Speculative rationale is flagged; sparse history stops the pass rather
   than producing invented records.
5. A substantial development that landed with **no owning ADR/plan** is
   captured the same way: reconstruct the decision(s) as `Implemented`
   ADR(s) plus matching `plan/done` entries, then regenerate `INDEX.md`
   and the worklog.
6. `audit` flags substantial behaviour/areas with **no owning ADR** (a
   coverage nudge — heuristic, since the audit is doc-centric) so an
   undocumented development is surfaced for capture, not silently kept.

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
| 2026-06-30 | r2 | Eugenio Minardi | Reopened to generalise backfill into a **re-runnable retroactive-capture** path for a large development that landed with no ADR/plan (new AC1 wording, AC5), plus an `audit` coverage nudge that surfaces undocumented work (AC6). Title broadened. Status Implemented→Accepted pending implementation. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-05-21 | — |
