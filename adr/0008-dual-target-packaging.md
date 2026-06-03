---
adr: 0008
title: Dual-target packaging from one skill source
status: Superseded
date: 2026-05-22
owner: Eugenio Minardi
supersedes:
superseded-by: ["0015"]
depends-on: ["0001", "0007"]
tags: [packaging, portability]
---

# ADR 0008 — Dual-target packaging from one skill source

## Context

docflow's skills are useful on more than one coding agent. Maintaining a
separate copy per agent would double the authoring cost and let the two
copies drift. The skills themselves are plain Markdown with no
agent-specific logic; only the packaging manifests and the invocation
syntax differ between agents. The decision is to ship both targets from a
single source of truth.

## Capability statement

docflow ships for two coding agents — Claude Code and the pi coding agent
— from the **same** `skills/` directory. Only the manifests differ:
`.claude-plugin/plugin.json` (+ `marketplace.json`) for Claude Code, and
`package.json` (`pi.skills → ./skills`) for pi. Skill prose stays
**agent-neutral**; agent-specific invocation forms (`/name` vs
`/skill:name`) live in `README.md`, not in skill bodies. The scaffolded
output is plain Markdown read natively by both agents. Because the
version now lives in two manifests, they must be kept in sync (a
consequence captured as the version-sync convention in `CONVENTIONS.md`).

## User stories / scenarios

- As a pi user, I want to install docflow and get the same skills a
  Claude Code user gets, from one maintained source.
- As the maintainer, I want to author each skill once, so the two targets
  cannot drift.

## Acceptance criteria

1. Both `.claude-plugin/plugin.json` and `package.json` (`pi.skills`)
   resolve the same `skills/` directory.
2. No skill body contains agent-specific invocation syntax; those forms
   live in `README.md`.
3. `package.json` and `.claude-plugin/plugin.json` carry the same
   version; divergence is caught by the verify gate.

## Out of scope

- The distribution channels the package is published through (see
  adr/0009-distribution-marketplace-npm.md).

## Open questions

- None.

## References / cross-links

- adr/0007-lifecycle-skills.md
- adr/0009-distribution-marketplace-npm.md
- `CONVENTIONS.md` §Version-Sync Invariant

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-05-22 | r1 | Eugenio Minardi | Backfilled from commits 042786e (dual-target packaging), 65193f0 (rename to docflow), 034f52c (agent-neutral inter-skill references), 990de2a (acknowledge pi). |
| 2026-06-03 | r2 | Eugenio Minardi | Superseded by ADR 0015 (generalised dual-target → multi-target: + Cowork, Codex, OpenCode). The agent-neutral-prose rule it set still holds. Status Implemented → Superseded. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-05-22 | — |
