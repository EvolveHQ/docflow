---
adr: 0017
title: Configurable artifact root — control the repo footprint
status: Implemented
date: 2026-06-17
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0013", "0016"]
tags: [conventions, bootstrap, footprint]
---

# ADR 0017 — Configurable artifact root — control the repo footprint

## Context

Bootstrapping currently drops the convention set at the **repository
root** (`adr/`, `plan/`, `_agent/`, `INDEX.md`, `CONVENTIONS.md` alongside
`AGENTS.md`/`CLAUDE.md`). That is ~7 root entries — noisier than many
teams want, and at odds with the common ADR convention of storing records
under `doc/adr` (Fowler) or `docs/`. Some repos prefer everything at root
(monorepo, "close to the code"); others want it tucked away. The location
should be the operator's choice, asked at bootstrap.

## Capability statement

The **root under which docflow's non-entry artefacts live is
configurable**, chosen during the bootstrap assessment
(adr/0013-interactive-assessment-protocol.md):

- `docs/` — **recommended default**; aligns with the `doc/adr`/`docs/`
  convention (e.g. `docs/adr/`, `docs/plan/`).
- repository root — flat layout (today's behaviour); good for monorepos
  that want decisions beside the code.
- `.docflow/` — hidden root; quietest footprint.

`AGENTS.md` and `CLAUDE.md` are **always at the repository root** (coding
agents discover them there); only the catalogue, queue, coordination,
and `INDEX.md`/`CONVENTIONS.md` move under the chosen root. The choice is
recorded in `CONVENTIONS.md` so every lifecycle skill resolves paths
against it.

## User stories / scenarios

- As a maintainer who dislikes root clutter, I pick `docs/` and the
  repo root stays clean (just `AGENTS.md`, `CLAUDE.md`, and `docs/`).
- As a monorepo owner, I pick root so decisions sit beside the code.
- As a lifecycle skill, I read the configured root and find `adr/`,
  `plan/`, and `INDEX.md` wherever they were placed.

## Acceptance criteria

1. Bootstrap asks an **artifact-placement** question (`docs/` default ·
   root · `.docflow/`), under the assessment protocol.
2. `AGENTS.md` and `CLAUDE.md` are written to the repository root
   regardless of the choice.
3. The chosen root is recorded in `CONVENTIONS.md`; `new-adr`,
   `new-plan`, `ship-item`, and `audit` resolve `adr/`, `plan/`, and
   `INDEX.md` relative to it.
4. `INDEX.md` cross-references and the verify/audit checks honour the
   configured root.
5. Existing repos are not force-migrated; the choice applies at bootstrap
   and a documented migration path is offered, not imposed.

## Out of scope

- Which artefacts exist at all (core vs optional) —
  adr/0016-layered-artifact-model.md.
- docflow's own repo layout (it may stay at root or migrate later;
  unaffected by this product capability).

## Open questions

- None.

## References / cross-links

- adr/0016-layered-artifact-model.md
- adr/0013-interactive-assessment-protocol.md
- https://martinfowler.com/bliki/ArchitectureDecisionRecord.html (doc/adr convention)

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-17 | r1 | Eugenio Minardi | Initial decision. Make the artefact root configurable at bootstrap (docs/ default, root, or .docflow/), keeping AGENTS.md/CLAUDE.md at repo root. |
| 2026-06-23 | r2 | Eugenio Minardi | Implemented (commit 5895168): bootstrap Q12 placement question + CONVENTIONS "Artifact root" record; new-adr/new-plan/ship-item/audit resolve paths against it; README documents it; migration offered not forced. AC1-5 met. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-06-17 | — |
