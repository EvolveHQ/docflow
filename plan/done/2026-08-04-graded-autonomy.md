# 0047 — Graded autonomy: ladder in the conventions, manifest, skills

Owning ADR: adr/0044-graded-autonomy.md (Accepted 2026-08-04).

## Scope

- **Conventions** (AC2, own + scaffold template): §Autonomy — the
  six-level ladder with scopes and prerequisites, the eight
  escalation triggers, the L3+ manual-evidence restriction; the
  §Project manifest paragraph drops the reserved wording.
- **Manifest surfaces** (AC1, AC6): template `docflow.yml` comment
  documents `autonomy: L0–L5`; this repo records `autonomy: L3`
  (with the gate commit ordered first — the current gate still
  rejects the field).
- **Bootstrap** (AC4): full-depth autonomy question (default L2,
  express/guided take it silently), manifest write in item 12b,
  sign-off cross-checks (L2+ without a gate; L4+ without the
  constraints layer).
- **Autonomous prompt template** (AC3): reads the recorded grant,
  names the level's scope, carries the escalation triggers as stop
  conditions.
- **Authoring skills** (AC5): new-adr + new-spec state the L3+
  restriction — unattended criteria carry executable methods; a
  `manual` method is an escalation.
- **Audit** (AC7): check 22 — recorded level, missing prerequisites,
  N/A without the field; reported, never gated.
- **Gate** (AC1): legality check replaces the reserved-field
  rejection (`L0`–`L5` or absent). **Ships alone** — a check whose
  meaning flips, authorised by the accepted record.
- **Evals**: the reserved-autonomy mutation flips to an
  illegal-level mutation. **Ships alone.**
- **Docs**: USAGE question table; methodology §4.17.

## Exit criteria

1. AC1–AC7 evidenced per their `Verify:` methods. → review
2. Gate and eval changes each ship alone, named. → gate-check
3. The recorded level (L3) matches actual unattended practice —
   confirmed by the operator at attestation. → review

## Dependencies

adr/0041-goals-layer.md and adr/0042-validation-loop.md Implemented
(both are).

---

**Shipped at HEAD `33632a9`** (chain ccb4106 propose → a66d607 accept
→ 2e48451 implement → cd893e6 gate (alone — legality replaces the
reservation) → 342fe53 dogfood L3 → 33632a9 evals (alone) + this ship
commit). Owning ADR Implemented on seven bound evidence records
(1 gate-check, 5 command, 1 manual attested incl. the
L3-matches-practice confirmation; all attended). All four level
decisions were taken by the operator before authoring.
