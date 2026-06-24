---
adr: 0016
title: Layered artifact model — minimal core, opt-in layers
status: Implemented
date: 2026-06-17
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0001"]
tags: [conventions, bootstrap, footprint]
---

# ADR 0016 — Layered artifact model — minimal core, opt-in layers

## Context

The lightweight-ADR tradition (Nygard, Fowler, Fandom Engineering) prizes
a *small* footprint: one decision per file, a flat numbered folder, a
five-field template, stored close to the code. docflow has accreted many
artefacts beyond that — `plan/`, `_agent/` coordination, prompts,
GLOSSARY, domains — which are valuable but, taken together, risk a heavy
footprint that contradicts the ethos. The artefacts should be **tiered**
so a repo can adopt only what it needs and a minimal docflow repo stays
as light as a classic ADR catalogue.

## Capability statement

docflow's artefacts are organised in two tiers:

- **Core (always created):** `AGENTS.md`, `CLAUDE.md`, `CONVENTIONS.md`,
  `adr/0000-template.md`, and `INDEX.md`. A repo with only these is a
  valid, lightweight docflow repo — essentially a classic ADR catalogue
  with conventions.
- **Optional layers (opt-in at bootstrap):** the `plan/` work queue, the
  `_agent/` coordination set (incl. `prompts/`), `GLOSSARY.md`, and
  `domains/` groupings. Each is added only when chosen; its absence is a
  valid state, not an error.

Lifecycle skills that need an absent layer (e.g. `new-plan` with no
`plan/`) refuse gracefully and explain, rather than assuming it exists.
`_agent/` becomes optional too: a single human with no coordination need
can omit it.

## User stories / scenarios

- As a maintainer who wants "just ADRs", I bootstrap the core only and
  get a catalogue as light as adr-tools, no `plan/` or `_agent/` noise.
- As a team, I opt into `plan/` and `_agent/` and get the full workflow.
- As a skill, I behave predictably when an optional layer is absent.

## Acceptance criteria

1. Bootstrap always writes the **core** (`AGENTS.md`, `CLAUDE.md`,
   `CONVENTIONS.md`, `adr/0000-template.md`, `INDEX.md`).
2. `plan/`, `_agent/`, `GLOSSARY.md`, and `domains/` are **opt-in** via
   bootstrap questions; omitting any leaves a valid repo.
3. A lifecycle skill invoked against a missing layer refuses cleanly and
   names what is missing (does not error obscurely or half-create it).
4. The tiering (core vs optional) is documented in `README.md`/`USAGE.md`.

## Out of scope

- *Where* the artefacts are placed (root vs `docs/` vs `.docflow/`) —
  decided in adr/0017-configurable-artifact-root.md.
- Draft/WIP handling — decided in adr/0018-wip-stays-out-of-catalogue.md.

## Open questions

- None.

## References / cross-links

- adr/0001-adr-driven-workflow.md
- adr/0017-configurable-artifact-root.md
- adr/0018-wip-stays-out-of-catalogue.md
- https://martinfowler.com/bliki/ArchitectureDecisionRecord.html

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-17 | r1 | Eugenio Minardi | Initial decision. Tier artefacts into a minimal always-on core and opt-in layers (incl. making `_agent/` optional), to keep a minimal docflow repo lightweight. |
| 2026-06-23 | r2 | Eugenio Minardi | Implemented (commit 2a837a7): core declared always-on; `_agent/` opt-in via Q5 "None"; ship-item/audit gate on `_agent/` presence; README split into Core vs Optional layers. AC1-4 met. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-06-17 | — |
