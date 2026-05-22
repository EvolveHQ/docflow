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
  constraints.
- **Authoring / process guidance** → a section in `CONVENTIONS.md`.
  Use for "how we do things" that informs but doesn't gate.
- **Shared term / definition** → `GLOSSARY.md` (if the repo has one).
- **It is actually a decision, not a convention** (an architectural,
  product, or technology choice with alternatives and consequences) →
  this is an ADR. Stop and offer `/new-adr`; do not bury a decision in
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
