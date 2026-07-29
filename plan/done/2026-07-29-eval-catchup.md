# 0040 — Eval catch-up: cover the record-contract, evidence, constraints, abandonment tiers

Owning ADR: adr/0012-skill-behavioural-evals.md (harness), covering the
behaviour shipped by adr/0034-record-contract.md,
adr/0035-per-criterion-evidence.md, adr/0036-enumerated-constraints.md,
adr/0037-recorded-abandonment.md.

## Scope

Bring the eval suite up to the shipped state (the flagged debt from the
2026-07-29 consolidation):

1. **Assertion helpers** — manifest parsing/validation, evidence-backed
   record check (digest recomputation), constraints-entry validation,
   file-lacks helper.
2. **Mutation layer** — a fixture helper that cuts a pristine copy of
   HEAD (`git archive`), applies a mutation, runs the static gate in
   the copy, and asserts the expected FAIL. Encodes, permanently, the
   by-hand mutation tests run at each slice's ship: evidence digest
   drift, illegal manifest model, reserved autonomy set, illegal
   constraint source, duplicate constraint id, malformed dropped file,
   orphan evidence directory — plus positive cases (baseline green;
   Withdrawn accepted end-to-end).
3. **Deterministic self-checks** — this repo as fixture: manifest
   shape, trust-posture sections, §Verification Evidence + Verify:
   template rule + "where practical" gone, evidence-backed 0035–0037,
   CON-1..6 valid, abandonment documented, gate knows the states.
4. **Behavioural cases** — update bootstrap/express (manifest written,
   constraints off in express) and ship-item (Verify: methods,
   evidence records, aggregate-gated Implemented); add
   supersession-timing, withdrawn-proposal, gated-boundary routing,
   and full-audit cases.
5. **README** — evals/README.md status brought current.

Out of scope: running the behavioural workflow suite (release-gate,
opt-in via the Workflow tool); the methodology page spec extension.

## Exit criteria

1. `npm run evals` green: all deterministic cases PASS (self-checks +
   mutation layer), behavioural cases SKIP with pointer. → gate-check
2. Every by-hand mutation test from the S0–S3 ships exists as a
   repeatable case. → review
3. Behavioural prompts assert the evidence/constraints/abandonment
   behaviour, ready for the release-gate run. → review

No ADR status change — the owning ADRs are already Implemented; this
completes their eval coverage (the D9 release-gate debt).

## Dependencies

Slices S0–S3 shipped; consolidation pass (evidence executor) done.

---

Shipped at HEAD `6914ac1` on 2026-07-29, two commits: `e1d44a9` plan
item, `6914ac1` eval suite (alone, per gate integrity — tighten-only).
15/15 deterministic PASS: 6 self-checks (manifest, trust posture,
evidence-backed 0035–0037 with independent digest recomputation,
CON-1..6, abandonment, Verify: rule) + 9 mutation cases (7 negative,
2 positive) via the new git-archive fixture layer. Behavioural
prompts updated + 5 new cases; full-suite green run remains the
release gate per the README. No ADR status change — owning ADRs
already Implemented; this clears their eval-coverage debt.
