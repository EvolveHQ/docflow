# 0007 — Pre-wire concurrency guardrails (conditional) + enforcement

Owning ADR: adr/0014-concurrency-guardrails.md

## Scope

Make `bootstrap` conditionally pre-wire the concurrency guardrails, and
wire the G2 pre-merge check + G3 audit enforcement.

- `templates/CONVENTIONS.md` — a "Concurrency guardrails" block (G1
  recommended; G2 check-before-merge; G3 gate backstop), written only for
  multi-agent (mode 2/3) **or** PR-based repos. Wording adapts to the
  integration model (PR merge / ff-push / shared-checkout commit).
- `templates/AGENTS.md` — a hard-rule bullet carrying the enforced part
  (G2/G3); G1 stays guidance in CONVENTIONS.
- `bootstrap/SKILL.md` Step 5 — conditional-write instruction for the
  block (condition: mode 2/3 OR PR-based).
- `templates/_agent-prompts-autonomous.md` + `agent-wave/SKILL.md` —
  add the **G2 pre-merge sync-and-check** to the integration step.
- `audit/SKILL.md` — frame check 11 as the duplicate-number enforcement
  G2 runs pre-merge and G3 backstops; cover duplicate `plan/todo` numbers
  too, not just ADR numbers.

## Exit criteria

Maps to adr/0014-concurrency-guardrails.md acceptance criteria:

1. Bootstrap writes the block iff multi-agent or PR-based; omitted
   otherwise. → AC1
2. Block states G1 (recommended) / G2 / G3; AGENTS bullet carries G2/G3.
   → AC2
3. Autonomous prompt + agent-wave perform the G2 pre-merge check. → AC3
4. Audit covers duplicate ADR and plan numbers across branches. → AC4
5. No numbering-identity change; `node scripts/verify.mjs` stays green.
   → AC6

## Dependencies

Independent of 0008 (docs). Touches templates + skills.

---

**Shipped** at HEAD `0548d6c` (2026-06-02). Added a conditional
"Concurrency Guardrails" section to `templates/CONVENTIONS.md` + a
hard-rule bullet to `templates/AGENTS.md` (G1 recommended / G2 / G3),
written by `bootstrap` only for mode 2/3 or PR-based repos; `bootstrap`
Step 5 carries the condition. G2 pre-merge check added to
`templates/_agent-prompts-autonomous.md` and `agent-wave` Step 3; `audit`
check 11 now covers duplicate ADR **and** plan/todo numbers. verify green.
ADR 0014 stays Accepted until 0008 ships.
