# 0006 — Assessment protocol in agent-wave (parallelism + merge strategy)

Owning ADR: adr/0013-interactive-assessment-protocol.md

## Scope

Embed the assessment protocol into `agent-wave`, and add its two
skill-specific questions: **parallelism** (wave width) and **merge /
integration strategy** (default = the repo's recorded integration model
per adr/0006-integration-model.md; override options: local fast-forward,
PR-based, other).

## Exit criteria

Maps to adr/0013-interactive-assessment-protocol.md acceptance criteria:

1. `agent-wave` opens with the opt-out gate + the standard protocol
   (one-at-a-time, recommended option, structured select, operator
   decides, fallback). → AC1–AC6
2. Adds a **parallelism** (wave width) question, structured select with a
   recommended default. → AC7
3. Adds a **merge/integration strategy** question whose default is read
   from the repo's integration model (ADR 0006), with override options
   (local fast-forward / PR-based / other). → AC7
4. `node scripts/verify.mjs` stays green.

## Dependencies

Independent of 0005. Reads adr/0006-integration-model.md for the merge
default.

---

**Shipped** at HEAD `e50d7b6` (2026-06-02). Added the Step 0.5 assessment
block to `agent-wave` and a 4th Step 1 parameter — **merge / integration
strategy** (default = the repo's integration model per ADR 0006; override
local fast-forward / PR-based / other). With 0005, this completes ADR
0013, which advances Accepted → Implemented. verify green.
