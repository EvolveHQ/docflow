# 0041 — Capability specs: class machinery, dormant

Owning ADR: adr/0038-capability-spec-records.md

## Scope

Build the spec class end to end, exposing nothing (programme slice S4,
first half):

1. **Docs + templates.** Template CONVENTIONS gains a layer-gated
   §Capability Specs section (slug identity + immutability-once-Agreed,
   in-place revision, living lifecycle with back-edges and
   `retired-from:`, evidence binding, INDEX Specs section format).
   New `templates/spec.md`. Manifest template's `model` comment gains
   `decisions+specs | decisions-only`. USAGE output-files row.
2. **Skills.** New `new-spec` (tenth skill): slug rules, Draft
   authoring, human-gated Agreed walk (≥1 criterion, each with a
   method), INDEX regen, clean refusal off-model, disjoint triggers.
   `ship-item` speaks "record" (spec Agreed→Implemented under the same
   evidence aggregate). `new-plan` traces to spec criterion ids where
   specs exist. `audit` extends status/coverage/declared-vs-computed
   to specs.
3. **Gate (own commit).** `verify.mjs`: models `decisions+specs` /
   `decisions-only` legal; new check — `spec/` front matter (id =
   slug, legal status), Agreed+ requires ≥1 criterion each with
   `Verify:`, `decided-by`/`constrained-by` resolve, INDEX Specs-row
   fidelity; evidence check accepts spec slugs (same digests).
4. **Evals (own commit).** Mutation cases via fixture-written specs:
   valid Draft spec green; illegal status FAIL; Agreed missing a
   `Verify:` FAIL; Implemented spec with digest-mismatched evidence
   FAIL.
5. **Ship.** Evidence records for AC1–AC9 (attestation for manual
   ones); plan mv; ADR 0038 → Implemented; INDEX; WORKLOG; snapshot.

Out of scope: bootstrap record-model question (next ADR), goals
edges, spec domain grouping, converting this repo.

## Exit criteria

Maps to adr/0038-capability-spec-records.md acceptance criteria:

1. Class documented (template CONVENTIONS, layer-gated). → AC1
2. `templates/spec.md` shipped. → AC2
3. `new-spec` authored, refusal + human gate + disjoint triggers. → AC3
4. Models legal in the gate + documented. → AC4
5. Gate validates specs; own commit. → AC5
6. ship-item/new-plan/audit generalised to records. → AC6
7. Nothing exposed; this repo unchanged (capability-first). → AC7
8. Eval fixture cases green (`npm run evals`). → AC8
9. Evidence written at ship. → AC9

When this ships, ADR 0038 advances Accepted → Implemented.

## Dependencies

Slices S0–S3 + eval catch-up (all shipped).

---

Shipped at HEAD `5815f21` on 2026-07-29, four implementation commits
+ ship: `031f890` templates (layer-gated conventions section, spec.md,
manifest models), `21d0dcd` skills (new-spec tenth skill; ship-item/
new-plan/audit speak record; audit check 19), `4f975bd` gate alone
(check C2 + G spec extension, smoke-tested), `5815f21` eval fixture
cases alone (18/18). Dormant: nothing exposed, this repo stays
capability-first. Nine evidence records — five operator-attested
(batch), three gate-checked, one command transcript (npm run evals,
exit 0; the catalogue's first command-method record). Executor gained
command support in the ship commit. ADR 0038 → Implemented (r3).
AC1–AC9 met.
