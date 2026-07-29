---
adr: 0036
title: Constraints as an enumerated, decision-gated artefact
status: Implemented
date: 2026-07-29
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0016", "0034", "0035"]
tags: [core, constraints, boundaries, layers]
---

# ADR 0036 — Constraints as an enumerated, decision-gated artefact

## Context

The rules this repo must never break exist, but as prose scattered
across `AGENTS.md` hard rules, `CONVENTIONS.md` sections, and
individual decision records: the ADR-privacy rule, the version-sync
invariant, gate integrity, multi-target parity, the language mandate,
the no-drafts rule. Scattered prose has three costs. An agent cannot
*enumerate* the boundaries it must not cross — it can only hope to have
read them all. Nothing distinguishes a **boundary** (must never be
violated) from **guidance** (how we prefer to work), so both erode the
same way. And a boundary can be weakened by an ordinary prose edit that
no decision authorised.

An autonomous agent needs the boundary set to be small, complete,
always loadable, and changeable only deliberately. That is an
enumerated artefact with an identity scheme and a change discipline —
not a reading comprehension exercise.

## Capability statement

A repo's inviolable boundaries live in **`CONSTRAINTS.md`** at the
artefact root — one enumerated entry per constraint, each with a stable
id (`CON-<n>`), a monotonic revision (`r<n>`), a provenance
(`source: chosen | imposed | learned`), a statement, and a check hint.
Constraints are **absolute**: there is no severity — a rule that may
sometimes bend is a convention and lives there instead. A constraint
has exactly two states, `Active` and `Removed`, and **every transition
— including creation, every scope revision, and removal — is authorised
by a human-accepted decision record**; a constraint's proposal phase
*is* its authorising ADR, and reintroduction after removal is a new
entry under a fresh decision. The file is small enough to load in full
at every step — the value of a boundary is that it is always in view.

## User stories / scenarios

- As a coding agent, I want the complete boundary set in one small
  file, so that I load it before every task instead of hoping I read
  the right prose.
- As a maintainer, I want every constraint change gated by an accepted
  decision, so that boundaries cannot erode through casual edits.
- As an auditor, I want stable ids with pinned revisions, so that
  historical references still mean what they meant when written.
- As a future validation loop, I want a `learned` provenance, so that
  boundaries born of observed harm are distinguishable from predicted
  ones — and harder to remove.
- As an adopter, I want constraints as an opt-in layer, so that a
  minimal repo carries no empty scaffolding.

## Acceptance criteria

1. **Format defined.** `CONSTRAINTS.md` entry format documented in this
   repo's conventions and the scaffolded template: `## CON-<n> r<n> —
   <title>` header per entry, with `source:` (`chosen` — a decision we
   made; `imposed` — law, licence, or vendor terms, where the ADR
   records the chosen *response*; `learned` — born of observed harm),
   `state:` (`Active` | `Removed`), `authorised-by:` (the accepting
   decision record), `statement:`, and `check:` (how violations
   surface).
   Verify: manual
2. **Decision-gated, absolute.** The conventions record: every
   constraint transition — creation, scope revision (`r<n>`
   increments), removal — requires a human-accepted decision record; no
   severity field exists (a soft rule is a convention); a removed
   constraint stays removed — reintroduction is a new id under a fresh
   decision; agents never alter `CONSTRAINTS.md` without one (an
   `AGENTS.md` hard rule).
   Verify: manual
3. **The six extracted.** This repo's `CONSTRAINTS.md` enumerates its
   existing prose boundaries — ADR privacy, work-in-progress stays out
   of the catalogue, the version-sync invariant, gate integrity,
   multi-target parity, and the language mandate — each naming its
   authorising decision (the original record where one exists; this
   decision for boundaries promoted from convention prose).
   Verify: manual
4. **`add-convention` is the writer.** Its routing gains the boundary
   home: a rule that must never be violated routes to `CONSTRAINTS.md`,
   creating the file on first use (the glossary pattern), and the skill
   requires the authorising decision — drafting it via the ADR skill
   when none exists — rather than writing an ungated entry.
   Verify: manual
5. **Opt-in layer.** Bootstrap offers constraints among the optional
   artefacts, ships a `CONSTRAINTS.md` template, and the capability
   manifest's `layers` list admits `constraints`; lifecycle skills
   treat an absent file as a valid state.
   Verify: manual
6. **Gate validation.** The static gate validates `CONSTRAINTS.md` when
   present — parseable entries, unique ids, positive monotonic
   revisions, legal `source`/`state` values, `authorised-by` naming an
   existing record — and accepts `constraints` as a manifest layer.
   Gate changes land as their own commits.
   Verify: gate-check
7. **Audit discipline.** The audit checks that every `CONSTRAINTS.md`
   entry names an authorising decision record that exists and is
   accepted, and flags any commit-level divergence it can detect
   between constraint entries and their authorising records.
   Verify: manual
8. **Dogfood.** This repo's manifest lists the `constraints` layer and
   this decision's criteria receive bound evidence records at ship.
   Verify: gate-check

## Out of scope

- Goals, outcome validation, and the harm-finding path that *produces*
  `learned` constraints — later decisions; the provenance value is
  defined now so records need no later migration.
- The `challenge` elicitation skill that interviews boundaries out of
  the operator — a later decision; `add-convention` is the writer
  either way.
- Product-metric constraints (latency budgets, cost ceilings) as
  first-class checks — entries may state them, but no runtime measures
  them; `check:` records how a human or gate would notice.
- Any severity, waiver, or exception scheme — deliberately rejected.

## Open questions

- None.

## References

- adr/0034-record-contract.md
- adr/0035-per-criterion-evidence.md
- adr/0016-layered-artifact-model.md
- adr/0004-adr-privacy.md
- adr/0018-wip-stays-out-of-catalogue.md
- adr/0015-multi-target-portability.md
- Source analysis and cross-review ledger: `../docflow-workflow-analysis/`
  (unversioned sibling folder, r10)

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-07-29 | r1 | Eugenio Minardi | Initial draft — first ADR authored under the evidence regime (methods named per criterion at drafting time). |
| 2026-07-29 | r2 | Eugenio Minardi | Accepted — approvals populated, implementation queued as plan 0038. |
| 2026-07-29 | r3 | Eugenio Minardi | Implemented (commits 5b12610, 31cadf4, 3a3573b, 28fb43d, ac868b5): format + discipline documented, six boundaries extracted, add-convention writer, opt-in layer, gate check H (mutation-tested), layer dogfooded. Eight evidence records — six operator-attested, two gate-checked. AC1–AC8 met. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-07-29 | — |
