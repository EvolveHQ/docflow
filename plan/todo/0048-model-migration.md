# 0048 — Model migration: bootstrap path, mapping contract, rebinding support

Owning ADR: adr/0045-model-migration.md (Accepted 2026-08-04).

## Scope

- **Bootstrap** (AC1, AC2): the Migration path section — explicit
  invocation, per-record classification (decision-stays / reclassify
  / split / terminal) as the operator's approval checklist, mechanics
  per class (`migrated-from:`, one revision row, "reclassification is
  not supersession"), `MIGRATION.md` write, INDEX + manifest flip,
  wave discipline; the re-run bullet points at it.
- **Conventions** (AC3, AC4; own + scaffold template): the mapping
  contract in §ADR Files (gaps legal only where `MIGRATION.md`
  accounts, contiguity → no-duplicates there) and the rebinding rule
  in §Verification Evidence (`migrated-from:` resolution; evidence
  never edited/moved; post-move evidence binds anew).
- **Spec template**: optional `migrated-from:` front-matter key.
- **Audit**: checks 1/7/19 gain mapping-awareness (accounted gaps
  pass; cross-refs resolve via the mapping; spec lineage resolves).
- **Gate** (AC4): dormant support — MIGRATION.md-accounted gaps in
  the contiguity check; evidence resolution follows a spec's
  `migrated-from:` to the old slug's directory. **Ships alone.**
- **Evals** (AC6): corpus routes migration utterances to bootstrap.
  **Ships alone.**
- **Docs**: USAGE migration note; methodology §4.18.

## Exit criteria

1. AC1–AC6 evidenced per their `Verify:` methods. → review
2. Gate and eval changes each ship alone, named. → gate-check
3. The machinery ships dormant — no migration runs here; docflow's
   own migration stays sequenced behind external use. → review

## Dependencies

adr/0038-capability-spec-records.md and
adr/0039-record-model-choice.md Implemented (both are).
