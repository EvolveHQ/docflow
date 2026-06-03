---
name: brainstorm
description: Decompose a problem, feature, or goal into candidate ADRs and plan items for a documentation-led repo — one decision per ADR, dependency edges, suggested ordering. Proposes drafts for review and writes nothing until approved. Use when the user says "brainstorm ADRs", "break this down into decisions", "what ADRs do we need for X", "plan out the work", or invokes /brainstorm.
---

# brainstorm

Turn a fuzzy problem into a structured set of candidate ADRs and plan
items. This skill is **generative and read/propose-only** — it never
writes ADRs or plan files directly. On approval it hands each candidate
to the **new-adr** and **new-plan** skills.

## Step 0 — Preconditions and context

1. Confirm the repo is bootstrapped (or note that the output can seed a
   fresh run of the **bootstrap** skill).
2. Read `CONVENTIONS.md` for ADR shape and lifecycle, and skim
   `INDEX.md` + existing ADRs so candidates don't duplicate or
   contradict what already exists, and so dependencies point at real
   ADRs.

## Step 0.5 — Assessment (run first)

Run the shared assessment protocol before decomposing:

- **Opt-out gate first.** Ask whether to run the assessment or go
  straight to decomposing. Recommend **running** it when the request
  arrived with little or no context; recommend **skipping** when the goal
  and scope are already clear.
- Ask the questions below **one at a time**, each with a **recommended
  option** and a one-line reason; wait for each answer.
- Use **structured selection** (single- or multiple-choice). If the host
  exposes a structured single-/multi-select question tool, use it and
  mark the recommended option; otherwise list options A/B/C in plain text
  and name the recommended one. Use **free text only** where an
  enumerable set is impossible (e.g. the goal statement).
- **The operator decides.** Never proceed past a question without an
  answer, and never guess scope when invoked with no context.

Questions (skip any the request already answers):
1. **Goal / problem** — free text (the unavoidable open answer) if not
   already given.
2. **Output** — candidate ADRs only, or ADRs + plan items.
   *Recommended: ADRs + plan items.*
3. **Depth** — quick (top candidates) or thorough (full decomposition).
   *Recommended: quick first, expand on request.*

This skill still **writes nothing** until you approve the outline.

## Step 1 — Understand the problem

Ask for the goal/feature/problem if not given. Probe for scope
boundaries, constraints, and the regulatory/quality concerns that
matter for this repo. Do not start decomposing until the goal is clear.

## Step 2 — Decompose

Produce a candidate list. For each candidate ADR:
- Proposed number (next available, contiguous), working title, shape
  (capability vs. technology if the repo splits).
- One-line scope — the single decision it captures.
- Dependencies on other candidates or existing ADRs.

**One decision per ADR.** If a candidate bundles several decisions,
split it and say why. If a candidate is really an existing ADR needing
revision, say that instead of proposing a new number.

## Step 3 — Order the work

Propose a plan ordering (which `plan/todo/` items, in what sequence)
respecting the dependency edges. Note where work can parallelise (useful
input for the **agent-wave** skill).

## Step 4 — Review and hand off

Present the full set as a reviewable outline (candidates + dependencies
+ ordering). Take edits. **Write nothing yet.** Once the user approves,
create them by invoking the **new-adr** skill per candidate and the
**new-plan** skill per
queued item — or hand the approved outline to those skills.

Guardrail: if the problem is too vague to decompose without inventing
requirements, say so and ask for more, rather than producing
speculative ADRs.
