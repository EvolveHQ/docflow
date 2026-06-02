# 0005 — Assessment protocol in the authoring skills

Owning ADR: adr/0013-interactive-assessment-protocol.md

## Scope

Embed the shared assessment protocol (agent-neutral prose) into the four
authoring skills: `new-adr`, `new-plan`, `add-convention`, `brainstorm`.
Each gets an opt-out gate, one-at-a-time structured-select questions with
recommended options, free text only where unavoidable, operator-decides,
and the plain-text fallback.

## Exit criteria

Maps to adr/0013-interactive-assessment-protocol.md acceptance criteria:

1. Each of the four skills opens with the opt-out gate question (run /
   skip), recommended default flipping on context. → AC1, AC5
2. Skill-specific clarifying questions are listed one-at-a-time with a
   recommended option each. → AC2
3. Questions are structured single-/multi-select; free text only where an
   enumerable set is impossible (e.g. ADR title). → AC3
4. Operator selection is authoritative; no proceeding without input;
   mandatory when no context. → AC4, AC5
5. Plain-text A/B/C fallback documented for hosts without a
   structured-select tool. → AC6
6. `node scripts/verify.mjs` stays green (skills well-formed,
   agent-neutral, no ADR leakage).

## Dependencies

Independent of 0006. Parallelisable (disjoint skill files).

---

**Shipped** at HEAD `pending` (2026-06-02). Added a "Step 0.5 —
Assessment" block (opt-out gate · one-at-a-time · recommended option ·
structured single-/multi-select with A/B/C fallback · operator decides ·
mandatory when no context) plus a skill-specific question list to
`new-adr`, `new-plan`, `add-convention`, and `brainstorm`. verify green.
Owning ADR 0013 stays Accepted until 0006 also ships.
