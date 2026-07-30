---
adr: 0039
title: The record model is a bootstrap choice — capability-first stays the default
status: Implemented
date: 2026-07-29
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0002", "0032", "0038"]
tags: [core, record-model, bootstrap]
---

# ADR 0039 — The record model is a bootstrap choice — capability-first stays the default

## Context

The spec class exists but is exposed nowhere: a repo can hand-opt into
`model: decisions+specs`, yet the assessment never offers it, and the
old shape question ("single vs capability-vs-technology split") no
longer describes the real choice — which is *where capability content
lives*, not how many templates the catalogue carries.

The choice is scale-dependent, and honestly so. For a small repo with
a handful of long-lived capabilities, the capability-first record is a
legitimate lightweight trade-off: one folder, one lifecycle, rare
churn. For a product repo with many living requirements, the same
model produces chronic lifecycle churn — re-opening implemented
records to grow them — and the decisions+specs split wins. The
recommendation should state that scale rule instead of pretending one
answer fits every repo. The installed base must feel nothing: every
existing repo keeps its model untouched, and the default for new
scaffolds does not move.

## Capability statement

The bootstrap assessment's shape question becomes the **record-model
question**: **capability-first** (capability records in the ADR
catalogue — the default, unchanged), **two-shape** (capability +
technology shapes — the current split, unchanged), **decisions+specs**
(pure decision ADRs plus living `spec/` records — recommended for
product repos by the scale rule), or **decisions-only** (pure decision
ADRs; capability content managed outside the repo, chosen only when a
real external system owns it). The choice lands in the capability
manifest's `model:` field and drives the outputs: the decision-led
models scaffold the decision-shaped ADR template as `adr/0000`, and
`decisions+specs` additionally enables the spec machinery — the
conventions section, the spec template, and an empty `spec/`. The
**express profile is untouched** (capability-first, no new question),
and a re-run on an existing repo **never converts the model** —
migration is its own later decision.

## User stories / scenarios

- As a new product repo, I want the split offered with a scale-based
  recommendation, so that I start on the model that fits instead of
  migrating later.
- As a small repo, I want capability-first to remain the default, so
  that the light path stays light and express asks nothing new.
- As an existing repo, I want re-runs to leave my model alone, so that
  upgrading the plugin never restructures my catalogue.
- As a repo whose requirements live in an external tracker, I want
  decisions-only as an honest option, so that the catalogue holds what
  the repo actually owns.

## Acceptance criteria

1. **The question reworked.** The bootstrap assessment asks the
   record-model question with the four options, capability-first
   marked as the default and the recommendation stating the **scale
   rule**: capability-first for a small repo with few long-lived
   capabilities; decisions+specs for a product repo with many living
   requirements. Asked at full depth; guided and express take the
   default unchanged.
   Verify: manual
2. **Decision-shaped template for the decision-led models.** On
   `decisions+specs` and `decisions-only`, `adr/0000-template.md` is
   the decision shape (Context → Decision → Rationale → Consequences →
   Acceptance criteria …); the conventions' shape section names it.
   Capability-first and two-shape outputs are byte-identical to
   today's.
   Verify: manual
3. **Spec machinery enabled on `decisions+specs` only:** the
   conventions' Capability Specs section uncommented, the spec
   template copied to the artefact root, an empty `spec/` created, and
   the manifest's `model:` set accordingly. `decisions-only` writes no
   spec artefacts and records its model.
   Verify: manual
4. **Cross-checks.** The sign-off cross-check flags: `decisions-only`
   with the plan folder enabled (exit criteria must then cite the
   external system — confirm, don't block); any model other than
   `decisions+specs` combined with a request for spec artefacts
   (contradiction — pick one).
   Verify: manual
5. **Re-runs never convert.** The already-docflow situation reads the
   recorded model from the manifest and offers only absent layers —
   never a model change; the skill says migration is a separate,
   deliberate path.
   Verify: manual
6. **Documented.** README and USAGE describe the four models and the
   scale rule in the record-model row of the assessment table.
   Verify: manual
7. **Eval coverage.** The behavioural bootstrap prompts assert the
   recorded model; a deterministic case asserts the express profile
   still scaffolds capability-first with no spec artefacts.
   Verify: npm run evals
8. **Evidenced at ship.**
   Verify: gate-check

## Out of scope

- Migration between models for existing repos — decided and sequenced
  later in the programme (a bootstrap re-run path, never forced).
- Goals, validation, autonomy — later slices.
- Retiring the two-shape model — it remains a supported choice for its
  installed base.

## Open questions

- None.

## References

- adr/0038-capability-spec-records.md
- adr/0002-assessment-driven-bootstrap.md
- adr/0032-bootstrap-depth-profiles.md
- Source analysis and cross-review ledger: `../docflow-workflow-analysis/`
  (unversioned sibling folder, r11)

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-07-29 | r1 | Eugenio Minardi | Initial draft. |
| 2026-07-29 | r2 | Eugenio Minardi | Accepted — approvals populated, implementation queued as plan 0042. |
| 2026-07-29 | r3 | Eugenio Minardi | Implemented (commits cdfb6ef, 57f3e53, 064754a): Q2 record-model question + per-model outputs + cross-checks + never-convert re-runs + docs; gate template exclusion alone; eval coverage alone (18/18). Eight evidence records — six operator-attested, one command transcript, one gate-checked. AC1–AC8 met. Slice S4 complete. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-07-29 | — |
