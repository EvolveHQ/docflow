# 0036 — Record contract foundations: trust posture, manifest, precedence

Owning ADR: adr/0034-record-contract.md

## Scope

Implement the record-contract foundations (programme slice S0):

1. **Trust posture section.** Add a §Trust Posture section to this
   repo's `CONVENTIONS.md` and to the scaffolded
   `templates/CONVENTIONS.md`: the gate catches honest mistakes and
   structural drift; it does not authenticate authorship; status lines
   are projections and computed state wins on disagreement. Sweep
   user-visible surfaces for any stronger ("hard") guarantee wording.
2. **Enforcement recipe.** Document in USAGE.md (or docs/): CI-executed
   verify gate, branch protection, and the protected-path set covering
   every input the gate reads (decision records; constraint, capability,
   and evidence files where present; verification methods; gate code).
3. **Capability manifest.** Define `docflow.yml` at the artefact root
   (`schema`, `model`, `layers`; `autonomy` reserved). Bootstrap writes
   it on new scaffolds at every depth tier; the additive re-run offers
   it to existing repos. Discovery (per the artefact-root contract) is
   untouched — the manifest sits inside the resolved root.
4. **Version-skew + precedence rules.** Document: unknown newer
   `schema` → tools refuse writes and say so; absent manifest →
   pre-contract repo, current behaviour unchanged; manifest wins over
   `CONVENTIONS.md` prose, divergence is an audit finding.
5. **Transition-precedence rule.** Record in the conventions (own +
   template): deliberate terminal transitions beat automatic progress
   transitions; residual ambiguity is reported for a human, never
   auto-resolved.
6. **Gate validation (separate commit).** `verify.mjs` validates the
   manifest (well-formed, known `schema`, legal `model`/`layers`
   values). Ships as its own commit per gate integrity.
7. **Dogfood.** This repo carries its own `docflow.yml` (`root: .`
   layout; model capability-first; layers as currently enabled).

Out of scope:
- Evidence records, `verify:` methods, and proof-of-work (next slice,
  its own ADR).
- Constraints file, abandonment states, spec class, goals, validation,
  autonomy semantics (later slices).
- Any runtime enforcement — the recipe is documentation only.

## Exit criteria

Maps to adr/0034-record-contract.md acceptance criteria:

1. Trust posture section in own + template CONVENTIONS; no "hard"
   guarantee wording on user-visible surfaces. → AC1
2. Enforcement recipe in user-facing docs with the full protected-path
   set. → AC2
3. `docflow.yml` defined and written/offered by bootstrap; discovery
   unchanged. → AC3, AC6
4. Version-skew and manifest-wins behaviour documented. → AC4, AC5
5. `autonomy` reserved: documented, unread, unwritten. → AC7
6. Transition-precedence rule recorded in conventions. → AC8
7. Manifest validation in `verify.mjs`, landed as its own commit. → AC9
8. This repo carries a valid `docflow.yml`; verify gate green; all five
   targets unaffected (skill prose stays agent-neutral).

When this ships, ADR 0034 advances Accepted → Implemented.

## Dependencies

None — first item of the programme; the queue is otherwise empty.

---

Shipped at HEAD `0475c6b` on 2026-07-25, in three commits per the
slice's own rules: `c2581df` trust posture (own + template CONVENTIONS,
USAGE §5b hardening recipe, two overclaims softened in methodology and
the audit skill), `2ee2333` capability manifest (templates/docflow.yml,
bootstrap writes at every tier + additive re-run offer, docs, dogfood
manifest schema 1 / capability-first / [plan, agent]), `0475c6b` gate
check F alone per gate integrity (mutation-tested). ADR 0034 →
Implemented (r3). AC1–AC9 met; verify green.
