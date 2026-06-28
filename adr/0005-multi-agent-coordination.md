---
adr: 0005
title: Configurable multi-agent coordination modes
status: Implemented
date: 2026-05-21
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0001"]
tags: [coordination, agents]
---

# ADR 0005 — Configurable multi-agent coordination modes

## Context

Repositories differ in how many agents touch them and how those agents
serialise. A solo "one human + one agent" repo needs no locking ceremony;
several agents through one working tree need a filesystem mutex;
worktree/PR-branch fan-out needs union-merged logs and a committed
dashboard instead of file locks. Picking the wrong shape adds dead
ceremony or causes lost writes, and switching later is not free.

The axis that actually matters is the number of **writers** (integration
concurrency), not the number of *agents*: a team of several developers —
even with one agent each — is multi-writer and needs the worktree/PR shape,
not the single-agent one. Choosing by "how many agents" misroutes a
multi-developer team into mode 1.

## Capability statement

The bootstrap offers three multi-agent coordination modes, each
selecting a different `_agent/` file shape:

1. **Single agent** — `default-agent` in `ROLES`; no `LOCKS`; plain
   `WORKLOG` / `CURRENT_FOCUS`.
2. **Multi-agent, shared checkout** — named agents; `LOCKS.md` as a
   filesystem mutex; single append-on-commit `WORKLOG`.
3. **Multi-agent, separate worktrees** — named agents; advisory `LOCKS`
   (draft PRs are the real lock); `WORKLOG merge=union` via
   `.gitattributes`; gitignored `CURRENT_FOCUS` plus a committed
   `IN_FLIGHT.md` dashboard.

The choice is recorded so the lifecycle skills honour it. It keys on
**writers, not agents**: a single human+agent is mode 1; any set of
concurrent writers integrating via branches/PRs is mode 3 (or mode 2 for a
shared checkout), even when each writer runs a single agent.

## User stories / scenarios

- As a solo maintainer, I want no locking ceremony, so the overhead
  matches the team size.
- As a team running parallel worktrees, I want union-merged logs and a
  dashboard, so concurrent appends do not conflict.

## Acceptance criteria

1. The bootstrap writes exactly the `_agent/` files the chosen mode
   requires (e.g. no `LOCKS.md` in mode 1; `.gitattributes` +
   `IN_FLIGHT.md` in mode 3).
2. `CONVENTIONS.md` and `AGENTS.md` describe the coordination rules of
   the chosen mode only.
3. The mode is discoverable so lifecycle skills behave consistently.
4. The bootstrap coordination question is framed by the number of
   **writers** (integration concurrency); a multi-developer team is guided
   to mode 3 (separate worktrees / PR branches) even when each developer
   runs a single agent.

## Out of scope

- The integration model (direct-to-main vs PR) — see
  adr/0006-integration-model.md.

## Open questions

- None.

## References / cross-links

- adr/0001-adr-driven-workflow.md
- adr/0006-integration-model.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-05-21 | r1 | Eugenio Minardi | Backfilled from commit 8d9e3a0 (three-option multi-agent mode: single / shared / worktree). |
| 2026-06-28 | r2 | Eugenio Minardi | Clarified the selection axis is *writers* (integration concurrency), not agents — a multi-developer team uses mode 3 even with one agent each (new AC4); reframed bootstrap Q5 prose. No mode change; framing/guidance. Stays Implemented. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-05-21 | — |
