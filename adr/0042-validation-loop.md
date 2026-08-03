---
adr: 0042
title: Validation loop — outcome records, four verdicts, harm findings
status: Implemented
date: 2026-07-31
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0036", "0040", "0041"]
serves: ["G-aligned-autonomy"]
tags: [workflow, validation, goals, feedback]
---

# ADR 0042 — Validation loop — outcome records, four verdicts, harm findings

## Context

Verification is synchronous with a change: the gate runs in minutes
and proves the work matches its criteria. Validation is not: whether
the **goal's measure moved** is knowable only weeks later, which is
why it cannot be a step inside the shipping flow and needs its own
trigger, its own record, and its own human gate. Without it the loop
has no feedback edge — a repo can be perfectly aligned to a boundary
that is quietly wrong, and nothing in it will ever say so.

The goals layer (adr/0041-goals-layer.md) provides the hook: every
Active goal carries a measure and a `review-by:` date. This decision
adds what acts on them. It is deliberately **not an experimentation
platform**: attribution windows, population cuts, and
guardrail-metric batteries belong to an analytics stack; this records
the verdict and its basis, not the statistics. Validation is also the
phase most likely to be skipped — slow, often ambiguous, and nothing
breaks without it — so the design makes skipping **visible** rather
than impossible: the audit reports it and the number is the argument.

## Capability statement

**`validate` is the twelfth skill** and the loop's third human gate.
The audit *surfaces* what is due (goals past `review-by:`);
`validate` *performs* it: gathers the measure's current reading
against the goal's stated measure, presents the evidence, and records
the **operator's verdict — the verdict is always human**; the skill
gathers and drafts, never decides. Demarcation: **verify** asks "does
the change match its criteria?" (the gate); **validate** asks "did
the goal's measure move?" (the world); **audit** asks "does the
record match the conventions?" (the repo).

**Outcome records live in the goal file** — an append-only
`## Outcomes` section, one `### Cycle <n> — <date>` entry per
validation, carrying: the verdict, the measure before and after, the
basis (what was read, where), any **harm finding** (or `none`), the
**disposition** when harm is present, and the human who gave the
verdict. **Cycles are per-goal and date-anchored**: each goal counts
its own ordinals, and staleness is judged by date against the goal's
current `review-by:` arming — one old outcome can never satisfy the
check forever. Entries are never edited; a correction is a new entry
naming what it corrects.

**Four verdicts, each with a defined goal transition:**

| Verdict | Goal transition | Consequence |
|---|---|---|
| `achieved` | → `Achieved` | achievement retires the goal, not the records serving it — they stand if they serve other goals or describe enduring behaviour |
| `not-achieved-execution` | stays `Active` | the work fell short — respecify and requeue |
| `not-achieved-hypothesis` | → `Retired` | the goal was wrong — reason recorded in the outcome entry |
| `inconclusive` | stays `Active` | `review-by:` re-armed to a new date; the inconclusive is recorded, so repetition becomes visible |

`Retired` is the single not-achieved terminal; the outcome entry
distinguishes hypothesis-wrong from a deliberate drop.

**Harm is not a verdict.** It is an orthogonal finding attachable to
*any* verdict — a goal can be achieved and harmful, unachieved and
harmful. A harm finding demands a **recorded human disposition**:
rolled back, remediated, respecified, accepted as a trade-off, or —
the durable form — a **constraint proposed through the
decision-gated path**. The validate skill never writes
`CONSTRAINTS.md`; the boundary tightens because of something that
happened, through the same human-accepted decision record as every
other constraint.

**The audit closes visibility**: goals past `review-by:` with no
outcome dated after the current arming; repeated inconclusives on one
goal; and the shipped-versus-validated picture — all reported, never
gated.

## User stories / scenarios

- As an operator, I want the audit to tell me which goals are due a
  verdict and the validate skill to bring me the measure's reading,
  so validation costs me a judgement, not an investigation.
- As an operator giving a verdict, I want "the work fell short" and
  "the goal was wrong" to be different outcomes, so a bad hypothesis
  retires cleanly instead of spawning respecification theatre.
- As an operator seeing harm, I want to record a disposition on the
  spot — including proposing a constraint through the normal decision
  gate — so the observation becomes durable prevention, not a
  transcript memory.
- As a maintainer, I want repeated inconclusives visible per goal, so
  an unmeasurable-in-practice goal gets fixed or retired instead of
  rolling forward forever.
- As a coding agent, I want validation to stay out of the shipping
  flow, so the fast loop never blocks on the slow one.

## Acceptance criteria

1. `validate` is the twelfth skill: it identifies due goals (past
   `review-by:`, or the one named), gathers the current measure
   reading against the goal's stated measure, and records the
   operator's verdict — the verdict is always human; the skill never
   invents one. Its description stays disjoint from verify and audit.
   Verify: node -e "const f=require('fs'); const s='plugins/docflow/skills/validate/SKILL.md'; process.exit(f.existsSync(s) && f.readFileSync(s,'utf8').includes('verdict') ? 0 : 1)"
2. Outcome records are append-only `### Cycle <n> — <date>` entries
   under a goal file's `## Outcomes` section carrying verdict (one of
   the four), measure before/after, basis, `harm:` (`none` or the
   finding), a disposition when harm is present, and `verdict-by:
   human:<name>`; per-goal ordinals increment; existing entries are
   never edited; this repo's goal files parse against the shape (the
   section is optional until a goal's first outcome).
   Verify: gate-check
3. The four verdicts drive the defined transitions: `achieved` →
   `Achieved`; `not-achieved-execution` → stays `Active` for
   respecification; `not-achieved-hypothesis` → `Retired` with the
   reason in the outcome entry; `inconclusive` → stays `Active` with
   `review-by:` re-armed.
   Verify: manual
4. Harm is orthogonal to the verdict and demands a recorded human
   disposition (rolled back | remediated | respecified | accepted
   trade-off | constraint proposed via a decision record); the
   validate skill never writes `CONSTRAINTS.md`.
   Verify: manual
5. The audit surfaces validation state — goals past `review-by:` with
   no outcome dated after the current arming, repeated inconclusives
   on one goal, and shipped-versus-validated visibility — reported,
   never gated.
   Verify: manual
6. The goal template recommends `baseline`, `threshold`, and `source`
   under Measure, so a verdict has something to compare against; the
   conventions state that a goal without a measure can never be
   validated.
   Verify: node -e "const t=require('fs').readFileSync('plugins/docflow/skills/bootstrap/templates/goal.md','utf8'); process.exit(t.includes('baseline') && t.includes('threshold') && t.includes('source') ? 0 : 1)"
7. The trigger corpus demarcates the three interrogations: "did it
   work / has the goal been achieved" utterances route to `validate`,
   with verify and audit expectations unchanged and disjoint.
   Verify: npm run evals

## Out of scope

- **Experimentation machinery** — attribution windows, population
  cuts, guardrail-metric batteries, statistical significance. A repo
  needing them has an analytics stack; this records verdicts and
  their basis.
- **Automatic scheduling** — nothing fires on a clock; the audit
  surfaces due goals when it runs, and the operator decides when to
  validate. A wake-up mechanism would be a separate decision.
- **Validating specs or decisions** — this validates goals. Whether a
  spec still describes reality is the audit's coverage question.
- **Autonomy consumption** — agents acting on verdicts unattended is
  the autonomy decision.

## Open questions

- None.

## References

- adr/0036-enumerated-constraints.md
- adr/0040-challenge-and-router.md
- adr/0041-goals-layer.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-07-31 | r1 | Eugenio Minardi | Initial draft (Proposed), to the operator-decided design: outcomes append to the goal file; per-goal date-anchored cycles; four verdicts with defined transitions; harm as orthogonal finding with human disposition; validate as the twelfth skill. |
| 2026-08-03 | r2 | Eugenio Minardi | Status Proposed → Accepted by the operator; implementation authorised (plan 0046). |
| 2026-08-03 | r3 | Eugenio Minardi | Implemented (plan 0046): AC2 gate-evidenced (outcome-entry checks, two mutations prove them), AC1/AC6/AC7 command-evidenced (evals 24/24), AC3/AC4/AC5 operator-attested — seven bound records, attended. Twelfth skill live; no goal due before 2026-10-31, so the machinery ships ahead of its first live verdict. Status Accepted → Implemented. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-08-03 | — |
