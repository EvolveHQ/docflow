---
adr: 0029
title: Seed ADR recording the adopted method
status: Proposed
date: 2026-06-28
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0001", "0003", "0016", "0018"]
tags: [bootstrap, conventions, onboarding]
---

# ADR 0029 — Seed ADR recording the adopted method

## Context

A freshly bootstrapped docflow repo starts with an **empty catalogue** — just
`adr/0000-template.md`. A reader opening `adr/` finds no in-catalogue record
of *why* the repo uses ADRs or *how* they are shaped; that lives only in
`CONVENTIONS.md`/`AGENTS.md`. The lightweight-ADR tradition (Nygard's
"record architecture decisions", MADR's "use markdown ADRs") instead seeds
the catalogue with a first decision that documents the practice itself, so
the catalogue is **self-describing from entry one**.

Adopting an ADR-driven, documentation-led method **is** an architectural
decision — costly to reverse, something every contributor builds against —
and therefore belongs in the catalogue as a dated, immutable,
supersede-able record, not only as authoring rules. This ADR decides that
bootstrap scaffolds that seed.

## Capability statement

Bootstrap **scaffolds, by default, a seed ADR at `adr/0001`** in the target
repo recording the decision to adopt the documentation-led, ADR-driven
method. `adr/0000-template.md` remains the template; the seed is `0001`,
ahead of any subsequent decisions, keeping numbering contiguous.

- The seed is created with status **`Implemented`** — the method is in use
  the moment it is scaffolded.
- It states the **decision and its rationale** and **references
  `CONVENTIONS.md`** for the operative rules rather than duplicating them,
  so there is one source of truth for the rules.
- It is written **generically** — no docflow-internal ADR numbers or titles
  appear in it (adr/0004-adr-privacy.md); it describes the method by its
  product-level behaviour.
- It is **default-on, opt-out** at bootstrap, consistent with the
  layered-artifact model (adr/0016-layered-artifact-model.md): a minimalist
  who wants "just the template" can decline it.
- On a **retrofit/backfill** (adr/0003-backfill-retrofit.md), the seed is
  always ADR `0001`, ahead of the reconstructed decisions.
- The seed uses the repo's ADR shape: the technology shape where the repo
  splits shapes, the single/capability shape otherwise.

## User stories / scenarios

- As a new contributor, the first ADR I read explains why this repo uses
  ADRs and points me at where the rules live.
- As a maintainer, my catalogue is self-describing from entry one, matching
  the convention readers expect from MADR/adr-tools repos.
- As a retrofitter, the backfill is anchored by a dated "we adopted this
  method on `<date>`" record at `0001`.
- As a minimalist, I can opt out and keep only the template.

## Acceptance criteria

1. Bootstrap, by default, writes `adr/0001-<slug>.md` recording the decision
   to adopt the method; the operator may opt out.
2. `adr/0000-template.md` remains the template; the seed is `0001` and
   numbering stays contiguous (no gap, no reuse).
3. The seed's status is `Implemented` on creation.
4. The seed states the decision + rationale and **references**
   `CONVENTIONS.md` for the rules; it does not duplicate the convention
   text.
5. The seed is generic: no docflow-internal ADR numbers/titles appear in it.
6. On retrofit/backfill, the seed is ADR `0001`, ahead of the reconstructed
   decisions.
7. The seed uses the repo's ADR shape (technology where the repo splits,
   single/capability shape otherwise).

## Out of scope

- The coordination-mode reframing (writers vs agents) and the
  claim-before-do guardrail — separate revisions to
  adr/0005-multi-agent-coordination.md and
  adr/0014-concurrency-guardrails.md.
- Seeding other optional artefacts (GLOSSARY, domains) —
  adr/0016-layered-artifact-model.md governs those.

## Open questions

- None. (Resolved at brainstorm: seed at `0001`; default-on/opt-out;
  `Implemented`; repo's recommended shape; always `0001` on retrofit.)

## References / cross-links

- adr/0001-adr-driven-workflow.md
- adr/0003-backfill-retrofit.md
- adr/0016-layered-artifact-model.md
- adr/0018-wip-stays-out-of-catalogue.md
- https://github.com/adr/adr-log/blob/main/docs/adr/0000-use-markdown-architectural-decision-records.md (MADR seed-ADR prior art)

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-28 | r1 | Eugenio Minardi | Initial draft. Bootstrap scaffolds a default-on seed ADR at adr/0001 recording the adopted method (Implemented, references CONVENTIONS, generic, anchors backfill). |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
