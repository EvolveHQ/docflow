---
adr: 0030
title: Domain grouping — navigate the catalogue by area
status: Implemented
date: 2026-06-30
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0016"]
tags: [organisation, catalogue]
---

# ADR 0030 — Domain grouping — navigate the catalogue by area

## Context

The catalogue is a single flat, contiguously numbered sequence, indexed
chronologically by number in `INDEX.md`. That is the right **identity**
model, but it is a poor **navigation** model once a repository accumulates
many decisions that span distinct areas (e.g. auth, billing, search): a
reader scanning for "the auth decisions" has only the global list.

docflow already ships an optional `domains/<slug>/README.md` grouping, but
its purpose is **captured only by behaviour**, scattered across the layered
artefact model, the methodology page, the scaffold conventions, and the
usage guide — with no decision record that owns it. It is also lumped with
`GLOSSARY.md` and the technology-ADR template under a single "defer all
three" recommendation, so it reads as a minor afterthought. This ADR makes
the grouping a **first-class (still optional) organisational layer** and
records what it is for.

It is deliberately **not** two adjacent things that were already decided
elsewhere: it is not per-domain **numbering** (rejected — identity stays the
flat contiguous number), and it is not the **federation** (which serves
genuinely independent sequences across separate repositories). Domain
grouping is a navigational *view* over one repository's one catalogue.

## Capability statement

A repository MAY group its ADRs by area using `domains/<slug>/README.md`
files, each a **curated index** of the ADRs belonging to that area, placed
at the configured artefact root. The grouping is **organisational only**: an
ADR keeps its flat contiguous number and its `INDEX.md` row; grouping never
renames, renumbers, or namespaces — the number remains the single identity.

The layer is **optional** but **first-class**: it has its own enable
recommendation in the bootstrap assessment (not bundled), and `new-adr`
maintains it — recording each new ADR under its owning domain's README and
offering to create `domains/<slug>/README.md` when an ADR is filed under a
domain that does not yet exist. Its purpose and "when to enable" are stated
in the user-facing docs and on the methodology page.

## User stories / scenarios

- As a reader of a large catalogue, I browse decisions **by area** instead
  of scanning the whole numbered list.
- As an author, `new-adr` files my ADR under its domain so the area index
  stays current without manual bookkeeping.
- As a maintainer, I enable domains when the flat list gets unwieldy, and
  the assessment tells me when that point is — domains is not buried under a
  blanket "defer".

## Acceptance criteria

1. The `domains/<slug>/README.md` grouping is documented as a first-class
   (if optional) organisational layer: a curated index of the ADRs in one
   area, placed at the configured artefact root.
2. The grouping is **organisational only** — ADRs keep their flat
   contiguous number and their `INDEX.md` row; no per-domain numbering or
   namespacing. The docs state this and distinguish it from the federation
   and from the rejected per-domain-numbering option.
3. `new-adr`, when the domains layer is present, records the ADR's owning
   domain and adds it to that domain's `README.md`, and offers to create
   `domains/<slug>/README.md` when assigning to a new domain.
4. The bootstrap assessment gives domains its **own** enable recommendation
   (trigger: distinct areas / catalogue size), no longer a blanket
   "defer all three".
5. The methodology page has a dedicated "Grouping ADRs by domain" section;
   `examples.md` carries a worked example; `README.md`/`USAGE.md` state the
   purpose and when-to-use.

## Out of scope

- A `domain:` ADR **metadata field**, an `INDEX.md` domain column, and an
  `audit` domain-consistency check — the "first-class data" step. Deferred;
  may be a later ADR if the curated-list form proves to drift.
- Per-domain **numbering / namespacing** of ADR ids — rejected; identity
  stays the flat number.
- Cross-**repository** grouping — that is the federation's job, not this.

## Open questions

- None. (Whether to promote the grouping to a derived metadata field is
  recorded as out of scope above, not open.)

## References / cross-links

- adr/0016-layered-artifact-model.md — domains is one of its optional layers.
- The methodology page's numbering/identity section, which already
  distinguishes grouping from per-domain numbering.

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-30 | r1 | Eugenio Minardi | Initial decision (Proposed). Make the `domains/` grouping a first-class optional organisational layer with its own owner, assessment recommendation, and docs — distinct from per-domain numbering and from federation. |
| 2026-06-30 | r2 | Eugenio Minardi | Accepted. Scope confirmed at C1+C3+C4 (the `domain:` field / INDEX column / audit check stay out of scope as a possible follow-on). |
| 2026-06-30 | r3 | Eugenio Minardi | Implemented (commit e9b03f5): bootstrap Q7 gives domains its own enable recommendation; `new-adr` identifies the owning domain when the layer is present; methodology §4.7, examples §5, README/USAGE elevated. AC1-5 met. → Implemented. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-06-30 | Accepted |
