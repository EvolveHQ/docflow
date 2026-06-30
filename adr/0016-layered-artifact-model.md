---
adr: 0016
title: Layered artifact model — minimal core, opt-in layers
status: Accepted
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

Optional layers are also **enableable after bootstrap**, not only
deferrable at it. Re-running `bootstrap` on an already-docflow repo detects
the recorded setup, skips the settled questions, and offers only the
optional layers still **absent** — adding the chosen ones by merge, without
disturbing existing content. Two common cases also have organic entry
points: `add-convention` **creates `GLOSSARY.md`** on the first term, and
`new-adr` **offers to create a `domains/<slug>/` grouping** when an ADR is
assigned to a domain that does not yet exist.

## User stories / scenarios

- As a maintainer who wants "just ADRs", I bootstrap the core only and
  get a catalogue as light as adr-tools, no `plan/` or `_agent/` noise.
- As a team, I opt into `plan/` and `_agent/` and get the full workflow.
- As a skill, I behave predictably when an optional layer is absent.
- As a maintainer who deferred `GLOSSARY.md`/`domains/`, I enable them
  later — by re-running `bootstrap`, or as a side effect of adding the
  first glossary term / domain-scoped ADR — without re-scaffolding.

## Acceptance criteria

1. Bootstrap always writes the **core** (`AGENTS.md`, `CLAUDE.md`,
   `CONVENTIONS.md`, `adr/0000-template.md`, `INDEX.md`).
2. `plan/`, `_agent/`, `GLOSSARY.md`, and `domains/` are **opt-in** via
   bootstrap questions; omitting any leaves a valid repo.
3. A lifecycle skill invoked against a missing layer refuses cleanly and
   names what is missing (does not error obscurely or half-create it).
4. The tiering (core vs optional) is documented in `README.md`/`USAGE.md`.
5. An opted-out optional layer can be **enabled after bootstrap**:
   re-running `bootstrap` on an existing docflow repo offers the absent
   layers and adds the chosen ones by merge (never overwriting);
   `add-convention` creates `GLOSSARY.md` if absent, and `new-adr` offers to
   create a `domains/<slug>/` grouping when an ADR is assigned to a new
   domain.

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
| 2026-06-30 | r3 | Eugenio Minardi | Reopened to add the **opt-in-later** capability (new AC5): a deferred optional layer can be enabled after bootstrap — an additive `bootstrap` re-run, `add-convention` creating `GLOSSARY.md`, and `new-adr` creating a domain on assign. Status Implemented→Accepted pending implementation. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-06-17 | — |
