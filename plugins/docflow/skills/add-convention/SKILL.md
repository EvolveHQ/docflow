---
name: add-convention
description: Assess and add a CONVENTION (a reusable rule, practice, or naming/process standard) to a documentation-led repo — decides FIRST whether it is worth codifying at all, then routes it to the right home (AGENTS.md hard rule, CONVENTIONS.md guidance, GLOSSARY term, or to /new-adr if it is really a one-off decision). Pushes back on premature or duplicate conventions. Use when the user says "add a convention", "make this a rule", "document this practice", "we should always X", or invokes /add-convention. NOT for recording a single architectural/product decision (use /new-adr) and NOT for queueing work (use /new-plan).
---

# add-convention

Add a convention — but only after assessing whether it should exist and
where it belongs. This skill is a gatekeeper and a router, not a
stenographer.

## Step 0 — Preconditions and context

1. Confirm the repo is bootstrapped.
2. Read `CONVENTIONS.md` and `AGENTS.md` in full so you can detect
   overlap with existing rules and judge fit.

## Step 0.5 — Assessment (run first)

Run the shared assessment protocol; the triage (Step 1) and routing
(Step 2) questions are asked under it:

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

- Ask questions **one at a time**, each with a **recommended option** and
  a one-line reason; wait for each answer.
- Use **structured selection** (single- or multiple-choice). If the host
  exposes a structured single-/multi-select question tool, use it and
  mark the recommended option; otherwise list options A/B/C in plain text
  and name the recommended one. Use **free text only** where an
  enumerable set is impossible (e.g. the exact wording).
- **The operator decides.** Never proceed past a question without an
  answer, and never guess scope when invoked with no context.

Questions (skip any the request already answers):
1. **Worth codifying?** — yes (recurring, stable, testable) or no
   (one-off, duplicate, churn-prone, vague). *Recommended: per the Step 1
   triage; this question gates the rest.* *(High-impact — asked in
   guided.)*
2. **Home** — `AGENTS.md` hard rule / `CONVENTIONS.md` guidance /
   `GLOSSARY.md` term / `CONSTRAINTS.md` boundary (decision-gated) /
   actually a decision (hand off to the **new-adr**
   skill). *Recommended: per the rule's nature (see Step 2).*
   *(High-impact — asked in guided: the wrong home is churn to move.)*
3. **Enforce in the verify gate?** — yes / no. *Recommended: no, unless
   the rule is mechanically checkable.*
4. **Wording** — free text (the rule statement itself; asked at every
   depth).

## Step 1 — Assess: is this worth codifying?

Apply triage. Recommend **against** adding when:
- It is already covered (explicitly or implicitly) by an existing
  convention — point to it instead of duplicating.
- It is a one-off, not a recurring decision — codifying it adds noise.
- It is likely to churn — premature rules become stale cruft.
- It is too vague to be testable or actionable as written.

Recommend **for** adding when it is a recurring decision whose ambiguity
causes rework, it is stable, and it can be stated so an agent can follow
it without further interpretation. State your recommendation and the
reason before doing anything.

## Step 2 — Route: where does it belong?

Decide the home, and explain the choice:
- **Hard rule agents must obey** → a bullet in `AGENTS.md` §Hard rules,
  with the substance in `CONVENTIONS.md`. Use for non-negotiable
  process rules.
- **A boundary that must never be violated** → an entry in
  `CONSTRAINTS.md` (create it on first use — enabling the constraints
  layer — at the recorded artefact root, format per `CONVENTIONS.md`
  §Constraints). **Decision-gated:** a constraint entry needs a
  human-accepted decision record authorising it — if none exists,
  draft one via the ADR skill first; never write an ungated entry.
  Distinguish carefully from a hard rule: a hard rule says how agents
  work; a constraint says what must never be true of the product or
  repo, whoever acts.
- **Authoring / process guidance** → a section in `CONVENTIONS.md`.
  Use for "how we do things" that informs but doesn't gate.
- **Shared term / definition** → `GLOSSARY.md` (create it if absent —
  adding the first term enables the glossary layer; place it at the
  recorded artefact root).
- **It is actually a decision, not a convention** (an architectural,
  product, or technology choice with alternatives and consequences) →
  this is an ADR. Stop and offer the **new-adr** skill; do not bury a
  decision in
  CONVENTIONS.

If a convention is a triage/process rule (e.g. how incoming work is
triaged), prefer `CONVENTIONS.md` with a hard-rule bullet in AGENTS.md
only for the parts that are non-negotiable.

## Step 3 — Draft and confirm

Draft the exact wording for its home file. Keep it tight, testable, and
in the repo's language. Show the diff. Confirm before writing.

## Step 4 — Write and commit

Apply the edit(s). If a convention rises to a hard rule, ensure
`AGENTS.md` and `CONVENTIONS.md` stay consistent. Conventional Commit
(`docs: ...`); no ADR touched means no `Rationale:` footer is required,
but add one if the repo's contract asks for it on convention changes.
