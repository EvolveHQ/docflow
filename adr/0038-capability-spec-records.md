---
adr: 0038
title: Capability specs — living, slug-identified records
status: Accepted
date: 2026-07-29
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0016", "0034", "0035", "0036", "0037"]
tags: [core, record-model, specs]
---

# ADR 0038 — Capability specs — living, slug-identified records

## Context

The default record conflates two documents with opposite lifecycles. A
*decision* is frozen once made; changing your mind is a new decision
that supersedes. A *capability* is alive: requirements grow, and the
honest response to "add one criterion" is an edit — yet today it forces
a walk backwards through an immutable record's lifecycle (this
catalogue has done it: reopening an Implemented record to Accepted and
back, twice, to grow its scope). The conflation also taxes identity:
capabilities inherit contiguous numbering, and with it the allocation
race that concurrent writers must guard against.

The record contract, per-criterion evidence, constraints, and the
sharpened lifecycle are all in place — the living-record class can now
be defined on top of them. This decision creates the **class**; whether
and how a repo adopts it is a separate decision (the record-model
choice at bootstrap), so nothing here changes any default.

## Capability statement

A **capability spec** is a living record in `spec/<slug>.md` at the
artefact root: **slug-identified** (no number, no allocation race, the
slug immutable once agreed — renaming means retiring and creating
anew), **edited in place** (growth is an edit with a Revision History
row, never supersession), and carrying the same evidenced acceptance
criteria as any record — each criterion has a `Verify:` method, and
evidence binds to `evidence/<spec-slug>/AC<n>-<seq>.md`. Its lifecycle
is the living one: `Draft → Agreed` (a human gate requiring at least
one criterion, each with its method) `→ Implemented` (a projection,
valid only while every current criterion digest has valid evidence)
with honest back-edges — criterion growth returns `Implemented →
Agreed` automatically in truth; a normative change returns to `Draft`
for re-agreement — and `Retired` terminal, recording `retired-from:` so
never-delivered and delivered-then-removed stay distinguishable. Front
matter traces the record: `decided-by:` names the authorising ADRs,
`constrained-by:` names the constraint ids that bound it. The class
ships **dormant**: templates, skill, gate, and eval support exist, but
no repo gains `spec/` until it opts in.

## User stories / scenarios

- As a maintainer, I want capability growth to be an edit, so that
  adding a criterion is one revision row, not a lifecycle round-trip.
- As a concurrent writer, I want slug identity, so that two branches
  authoring specs never race for a number.
- As an auditor, I want spec criteria evidenced exactly like ADR
  criteria, so that `Implemented` means the same proven thing on both.
- As an agent, I want `constrained-by:` and `decided-by:` on the spec,
  so that the boundaries and decisions governing a capability are one
  hop away.
- As an existing repo, I want the class dormant until chosen, so that
  nothing about my catalogue changes by upgrading.

## Acceptance criteria

1. **Class documented.** The scaffolded conventions template gains a
   layer-gated section defining the spec record: location, slug
   identity and immutability-once-Agreed (rename = retire + new),
   in-place revision with Revision History, the living lifecycle with
   its back-edges and `retired-from:`, and evidence binding identical
   to ADR criteria.
   Verify: manual
2. **Spec template shipped.** A `templates/spec.md` exists with front
   matter (`id`, `status`, `decided-by`, `constrained-by`,
   `retired-from`), a Capability statement, User stories, an
   Acceptance-criteria section whose items end with `Verify:` lines,
   Out of scope, References, and Revision History.
   Verify: manual
3. **`new-spec` skill.** A tenth lifecycle skill authors one spec:
   slug chosen and checked unique, template filled, status `Draft`,
   the `Draft → Agreed` walk is a human gate requiring ≥1 criterion
   each with a method, INDEX regenerated. It refuses cleanly in a repo
   whose record model has no specs, and its trigger description is
   disjoint from the ADR and plan skills.
   Verify: manual
4. **Manifest knows the models.** `decisions+specs` and
   `decisions-only` become legal `model` values (the static gate's
   set), documented in the manifest template; choosing them at
   bootstrap is the next decision's scope, but a hand-opted repo is
   already valid.
   Verify: gate-check
5. **Gate validates specs.** When `spec/` exists: front-matter
   validity (id matches filename slug, legal status), `Agreed`-or-
   beyond requires ≥1 criterion each with a `Verify:` line,
   `decided-by:` resolves to existing ADRs and `constrained-by:` to
   existing constraint ids, INDEX spec rows keep fidelity, and the
   evidence check accepts spec slugs with identical digest semantics.
   Gate changes land as their own commits.
   Verify: gate-check
6. **Lifecycle skills speak "record".** `ship-item` advances an owning
   spec `Agreed → Implemented` under the same evidence aggregate as an
   ADR; `new-plan` traces items to spec criterion ids where specs
   exist; the audit extends declared-vs-computed, status validity, and
   coverage to specs.
   Verify: manual
7. **Dormant by construction.** No bootstrap question, no default, and
   none of this repo's own records change — this repo stays
   capability-first; the machinery is exercised through fixtures, not
   by converting the catalogue.
   Verify: manual
8. **Eval coverage.** The deterministic suite gains spec-machinery
   cases via fixture mutation: a valid fixture spec passes the gate;
   illegal status, a missing `Verify:` line on an Agreed spec, and a
   spec evidence digest mismatch each FAIL it.
   Verify: npm run evals
9. **Evidenced at ship.** This decision's criteria receive bound
   evidence records at its own ship.
   Verify: gate-check

## Out of scope

- The bootstrap record-model question, its recommendation rule, and
  any migration path — the next decision.
- Goals and the `serves:` edge — a later slice; the front matter grows
  compatibly when goals arrive.
- Domain grouping for `spec/` — deferred until there are enough specs
  to navigate.
- Converting this repo's own catalogue — the migration strategy is
  decided and sequenced last in the programme.

## Open questions

- None.

## References

- adr/0034-record-contract.md
- adr/0035-per-criterion-evidence.md
- adr/0036-enumerated-constraints.md
- adr/0037-recorded-abandonment.md
- adr/0016-layered-artifact-model.md
- Source analysis and cross-review ledger: `../docflow-workflow-analysis/`
  (unversioned sibling folder, r11)

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-07-29 | r1 | Eugenio Minardi | Initial draft. |
| 2026-07-29 | r2 | Eugenio Minardi | Accepted — approvals populated, implementation queued as plan 0041. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-07-29 | — |
