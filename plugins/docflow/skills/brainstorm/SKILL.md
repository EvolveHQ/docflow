---
name: brainstorm
description: Decompose a problem, feature, or goal into CLASSIFIED candidate records for a documentation-led repo — each candidate labelled (a choice → decision record; a behaviour → capability record; a rule → convention; a boundary → constraint; a job → plan item) with dependency edges and suggested ordering, then routed to the right writer skill on approval. The front door — you never need to know which writer to call. Proposes drafts for review and writes nothing until approved. Use when the user says "brainstorm", "break this down", "what do we need for X", "plan out the work", or invokes /brainstorm. NOT for interrogating a draft or eliciting unstated boundaries (use /challenge — this generates, that interrogates) and NOT for checking the existing record (use /audit).
---

# brainstorm

Turn a fuzzy problem into a **classified** set of candidate records.
This skill is the front door: **generative and read/propose-only** —
it never writes artefacts directly. Every candidate is labelled by the
routing rule — **a choice → a decision record · a behaviour → a
capability record (a spec on the decisions+specs model, a capability
ADR otherwise) · a rule → a convention · a boundary → a constraint
(decision-gated) · a job → a plan item** — and on approval each is
handed to its writer skill. A class whose writer does not exist yet in
this repo is surfaced as a **future route**, never silently dropped.

## Step 0 — Preconditions and context

1. Confirm the repo is bootstrapped (or note that the output can seed a
   fresh run of the **bootstrap** skill).
2. Read the capability manifest (`docflow.yml`) for the **record
   model** — it decides where behaviour-class candidates route — and
   `CONVENTIONS.md` for shapes and lifecycle. Skim `INDEX.md` +
   existing records (and `CONSTRAINTS.md` if present) so candidates
   don't duplicate or contradict what already exists, and so
   dependencies point at real records.

## Step 0.5 — Assessment (run first)

Run the shared assessment protocol before decomposing:

- **Depth selector first.** Ask how deep this assessment should go:
  **express** — every choice takes its recommended default; only
  questions with no derivable default (the free-text essentials) are
  still asked; **guided** — only the questions marked high-impact
  below, plus the free-text essentials; **full** — every question
  below. If the repo's `CONVENTIONS.md` records an `Assessment depth:`,
  pre-select it as the recommended option — the selector always
  appears; a recorded depth is never applied silently. Otherwise
  recommend **full** when the request arrived with little or no
  context and **express** when it is already fully specified. At any
  question the operator may answer "defaults from here" or "go
  deeper"; honour the switch immediately.

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
1. **Goal / problem** — free text (the unavoidable open answer; asked
   at every depth) if not already given.
2. **Output** — decision candidates only, or the full classified set
   (decisions, capabilities, rules, boundaries, plan items).
   *Recommended: the full set — classification costs nothing and the
   operator strikes what they don't want.*
3. **Decomposition depth** — quick (top candidates) or thorough (full
   decomposition). *Recommended: quick first, expand on request.*

No question here is marked high-impact — a guided run behaves like
express for this skill.

This skill still **writes nothing** until you approve the outline.

## Step 1 — Understand the problem

Ask for the goal/feature/problem if not given. Probe for scope
boundaries, constraints, and the regulatory/quality concerns that
matter for this repo — and **keep what surfaces**: a boundary-shaped
answer becomes a boundary candidate (routed through the decision-gated
constraint path), never a discarded intake note. For a deep
interrogation of unstated boundaries, hand the operator to the
**challenge** skill and fold its findings in.

## Step 2 — Decompose and classify

Produce a candidate list. **Every candidate carries its class**, by
the routing rule:

- **a choice** (alternatives existed; one was picked) → decision
  record;
- **a behaviour** (what the system must do) → capability record — a
  spec on the `decisions+specs` model, a capability ADR otherwise;
- **a rule** (how we work, reusable) → convention;
- **a boundary** (must never be violated) → constraint,
  decision-gated;
- **a job** (a unit of work toward any of the above) → plan item.

For each candidate: class, working title, identity (next contiguous
number for decisions; a slug for specs), one-line scope, and
dependencies on other candidates or existing records.

**One decision per record.** If a candidate bundles several, split it
and say why. If a candidate is really an existing record needing
revision, say that instead of proposing a new one. A class with no
writer in this repo yet (e.g. goals, before that layer exists) is
listed as a **future route** with its content preserved in the
outline.

## Step 3 — Order the work

Propose a plan ordering (which `plan/todo/` items, in what sequence)
respecting the dependency edges. Note where work can parallelise (useful
input for the **agent-wave** skill).

## Step 4 — Review and hand off

Present the full set as a reviewable outline (classified candidates +
dependencies + ordering). Take edits. **Write nothing yet.** Once the
user approves, route each candidate to its writer: decisions to the
**new-adr** skill, capability specs to the **new-spec** skill (on that
model), rules and boundaries to the **add-convention** skill (its
constraint path carries the decision gate), queued jobs to the
**new-plan** skill — or hand the approved outline to those skills.

Guardrail: if the problem is too vague to decompose without inventing
requirements, say so and ask for more, rather than producing
speculative ADRs.
