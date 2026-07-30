# 0042 — Record-model choice at bootstrap

Owning ADR: adr/0039-record-model-choice.md

## Scope

Expose the record model (programme slice S4, second half):

1. **Q2 rework.** The bootstrap shape question becomes the
   record-model question — capability-first (default) | two-shape |
   decisions+specs (recommended for product repos, scale rule stated)
   | decisions-only — recorded in the manifest `model:`. Express and
   guided take the default unchanged; all Q2-dependent text in the
   skill (outputs, seed, express profile, guided defaults, cross-
   checks, 12b model fill) updated coherently.
2. **Outputs per model.** Decision-led models scaffold the
   decision-shaped template as `adr/0000-template.md`;
   `decisions+specs` additionally uncomments the Capability Specs
   conventions section, writes `spec/0000-template.md` + empty
   `spec/`, and sets the model; `decisions-only` records its model and
   writes no spec artefacts. Capability-first and two-shape outputs
   byte-identical to today's.
3. **Cross-checks + re-run guard.** Sign-off flags decisions-only +
   plan folder (exit criteria cite the external system — confirm) and
   non-decisions+specs + spec artefacts (contradiction). The
   already-docflow re-run reads `model:` from the manifest and never
   converts — migration named as a separate deliberate path.
4. **Docs.** USAGE §3 Q2 row rewritten (four models + scale rule);
   README gains the record-models paragraph.
5. **Gate (own commit).** `spec/0000-template.md` excluded from spec
   validation (mirrors the ADR template exclusion).
6. **Evals (own commit).** Express deterministic case asserts no spec
   artefacts; new behavioural case scaffolds decisions+specs and
   asserts spec/, the template, the conventions section, and the
   manifest model.
7. **Ship.** Evidence for AC1–AC8; plan mv; ADR 0039 → Implemented;
   INDEX; WORKLOG; snapshot.

Out of scope: model migration for existing repos; retiring two-shape.

## Exit criteria

Maps to adr/0039-record-model-choice.md acceptance criteria:

1. Q2 asks the four-model question, scale-rule recommendation, full
   depth only; express/guided default unchanged. → AC1
2. Decision-shaped 0000 on decision-led models; capability-first /
   two-shape byte-identical. → AC2
3. Spec machinery on decisions+specs only; decisions-only records
   model, writes nothing spec. → AC3
4. Cross-checks added. → AC4
5. Re-runs never convert; migration named separate. → AC5
6. README + USAGE describe the models and the scale rule. → AC6
7. Eval coverage (`npm run evals` green; behavioural case authored).
   → AC7
8. Evidence at ship. → AC8

When this ships, ADR 0039 advances Accepted → Implemented and slice
S4 is complete.

## Dependencies

Plan 0041 (spec class, shipped).
