---
adr: 0006
title: Configurable integration model (direct-to-main vs PR-based)
status: Implemented
date: 2026-05-21
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0001", "0005"]
tags: [integration, git]
---

# ADR 0006 — Configurable integration model (direct-to-main vs PR-based)

## Context

How work lands on `main` shapes the completion event, the verify gate's
location (local vs CI), and the autonomous-completion prompt. A solo,
single-agent repo is best served by trunk-based direct-to-main; multi
-agent worktree work needs pull requests with required CI. The right
default depends on the coordination mode chosen in
adr/0005-multi-agent-coordination.md, so the two decisions interlock.

## Capability statement

The bootstrap offers two integration models and tailors the scaffold to
the choice:

- **Direct-to-main, fast-forward only** — verify gate runs locally;
  completion event is "fast-forwarded to `main` + pushed"; the autonomous
  prompt uses `git merge --ff-only`. Recommended for single-agent repos.
- **PR-based, required CI green** — verify gate runs in CI on the PR;
  completion event is "PR merged with CI green"; the autonomous prompt
  opens a draft PR, waits for green, marks ready, merges (with a chosen
  merge strategy). Recommended for multi-agent modes.

A cross-check warns on unusual pairings (e.g. worktrees with
direct-to-main).

## User stories / scenarios

- As a solo maintainer, I want trunk-based direct-to-main with a local
  gate, so I ship without PR overhead.
- As a team, I want PR-based integration with required CI, so parallel
  work integrates safely.

## Acceptance criteria

1. The chosen model determines the completion-event wording in
   `CONVENTIONS.md`/`AGENTS.md` and the integration block of the
   autonomous prompt.
2. Only the matching autonomous-prompt variant is written; the other is
   dropped.
3. A cross-check surfaces the worktree + direct-to-main pairing for
   confirmation.

## Out of scope

- The verify-gate command itself (project-specific, set during
  assessment).

## Open questions

- None.

## References / cross-links

- adr/0005-multi-agent-coordination.md
- adr/0001-adr-driven-workflow.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-05-21 | r1 | Eugenio Minardi | Backfilled from commit 5e202bb (PR-vs-direct-to-main integration model in Q4). |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-05-21 | — |
