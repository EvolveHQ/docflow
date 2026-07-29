# 0037 — Per-criterion evidence: methods, bound records, executor, audit

Owning ADR: adr/0035-per-criterion-evidence.md

## Scope

Implement bound per-criterion verification (programme slice S1):

1. **Method on every criterion.** `templates/adr-capability.md` AC
   guidance gains the verification-method line (inline command |
   `gate-check` | `manual`). The "tests map back where practical"
   phrasing in the bootstrap conventions (Step 3) and
   `templates/AGENTS.md` is replaced by the method rule. This repo's
   own `CONVENTIONS.md`/`AGENTS.md` adopt the same rule for records
   created or edited after adoption.
2. **Evidence format.** Document the bound-record format (own +
   template CONVENTIONS, new §Verification Evidence): append-only
   `evidence/<record-slug>/AC<n>-<seq>.md` with criterion ref +
   content digest (SHA-256, normalised text), method/command, source
   commit, exit code, output digest, verifier, date, `supersedes:` for
   corrections.
3. **Executor.** `ship-item` runs each pending criterion's method for
   the owning record, writes the evidence records, advances the record
   to `Implemented` only when every current criterion digest has valid
   evidence; otherwise names the unevidenced criteria and leaves the
   status. Plan items complete on their own exit criteria regardless.
4. **Manual attestation.** `manual` evidence requires verifier ≠
   implementer with name/date/scope; documented in the evidence format.
5. **Audit checks.** `audit` gains: declared-vs-computed (post-adoption
   records claiming `Implemented` without full valid evidence);
   evidence re-runs (cheap in full, expensive sampled; divergence is a
   finding, at the record's source commit for record checks, HEAD for
   current satisfaction); manual-verification ratio.
6. **Adoption field.** Own `docflow.yml` gains
   `evidence-adopted-at: <ship commit>`; `templates/docflow.yml`
   documents the optional field (schema 1). `new-adr` gathers a method
   per criterion when authoring.
7. **Gate (separate commits).** `verify.mjs`: evidence-record
   well-formedness; declared-vs-computed for post-adoption records;
   `evidence-adopted-at` names a commit. Each gate change lands alone
   per gate integrity.
8. **Self-hosting.** At ship, ADR 0035's own criteria receive bound
   evidence records — the slice's proof is its own machinery.

Out of scope:
- Spec class, constraints, goals/validation, autonomy (later slices).
- CI-side authorship enforcement (cooperative posture governs).
- Retroactive evidence for pre-adoption records.

## Exit criteria

Maps to adr/0035-per-criterion-evidence.md acceptance criteria:

1. Method rule in template + own conventions; "where practical"
   removed. → AC1
2. Bound-record format documented and dogfooded. → AC2
3. `ship-item` executes, writes, and gates `Implemented` on the full
   aggregate; partial plans integrate. → AC3
4. Manual attested (≠ implementer) and counted. → AC4
5. Audit: declared-vs-computed + re-runs + manual ratio. → AC5
6. `evidence-adopted-at` set here, documented in the template. → AC6
7. Temporal rules documented with the audit checks. → AC7
8. `evidence/0035-per-criterion-evidence/` holds valid records for
   every AC of ADR 0035 at ship. → AC8
9. Gate changes landed as their own commits; verify green. → AC9

When this ships, ADR 0035 advances Accepted → Implemented.

## Dependencies

Slice S0 (shipped 2026-07-25): trust posture, manifest, gate check F.

---

Shipped at HEAD `e8be8cd` on 2026-07-29, five implementation commits
+ ship: `801b9ec` method rule, `d7c8e61` evidence contract,
`f22f0d7` executor + audit checks 15–17, `04aa335` adoption field,
`e8be8cd` gate check G (alone, per gate integrity). Nine bound
evidence records under `evidence/0035-per-criterion-evidence/` —
seven attested by the operator (AC1–5, 7, 9), two gate-checked
(AC6, AC8). Digest binding mutation-tested live at ship (AC edit →
FAIL, restore → green). ADR 0035 → Implemented (r3). AC1–AC9 met.
