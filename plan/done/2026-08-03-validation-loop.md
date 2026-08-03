# 0046 — Validation loop: validate skill, outcome records, audit surfacing

Owning ADR: adr/0042-validation-loop.md (Accepted 2026-08-03).

## Scope

- **validate skill** (AC1): the twelfth skill — due-goal
  identification, measure gathering, human verdict (structured
  four-way select), harm question, outcome-entry write, goal
  transition, INDEX Goals + COVERAGE regeneration. Refuses cleanly
  without the goals layer; never writes CONSTRAINTS.md (harm →
  constraint routes through the convention skill's decision-gated
  path). Description disjoint from verify and audit.
- **Goal template** (AC6): Measure section gains recommended
  `baseline` / `threshold` / `source` sub-fields (product template +
  this repo's `goals/G-template.md`).
- **Conventions** (AC2, own + scaffold template §Goals): the outcome
  entry format (`### Cycle <n> — <date>` under `## Outcomes`:
  verdict, measure before/after, basis, harm, disposition when harm,
  `verdict-by: human:<name>`), append-only discipline, the four
  transitions.
- **audit** (AC5): validation-state surfacing — due goals (outcome
  date vs current `review-by:` arming), repeated inconclusives,
  shipped-vs-validated visibility; reported, never gated.
- **Gate** (AC2): check I extension — Outcomes-section shape when
  present (header format, ordinals from 1, legal verdict, harm line,
  disposition-on-harm, human verdict-by). **Ships alone.**
- **Evals + corpus** (AC7): "did it work / has the goal been
  achieved" abstains flip to `validate`; an outcome-entry mutation
  proves the gate bites. **Ships alone.**
- **Docs**: README / USAGE (twelve-skill surface) / methodology
  §4.16, marked in development.
- **Dogfood note**: no docflow goal is due before 2026-10-31, so this
  cycle ships the machinery without a first real verdict; the audit's
  "none due" reading is the current true state.

## Exit criteria

1. AC1–AC7 evidenced per their `Verify:` methods (gate live, commands
   green, manual attested). → review
2. Gate and eval changes each ship alone, named. → gate-check
3. Skill parity across the five targets holds (structure gate). →
   gate-check

## Dependencies

adr/0041-goals-layer.md Implemented (it is).

---

**Shipped at HEAD `634bd97`** (chain 06755f8 propose → 5c92dd1 accept
→ 995ac46 implement → 23a813b gate (alone) → 634bd97 evals (alone) +
this ship commit). Owning ADR Implemented on seven bound evidence
records (1 gate-check, 3 command incl. the full deterministic suite,
3 manual batch-attested; all attended). Design decisions asked before
authoring (outcome storage in-goal; per-goal date-anchored cycles).
No docflow goal is due before 2026-10-31 — the machinery ships ahead
of its first live verdict, and the audit's none-due reading is the
current true state.
