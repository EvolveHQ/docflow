---
adr: 0041
title: Goals layer — the top of the traceability chain
status: Accepted
date: 2026-07-31
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0016", "0034", "0035", "0038", "0040"]
tags: [workflow, goals, traceability, alignment]
---

# ADR 0041 — Goals layer — the top of the traceability chain

## Context

The verified tier gave the catalogue a floor: constraints bound what
must never happen (adr/0036-enumerated-constraints.md), evidence proves
what was done (adr/0035-per-criterion-evidence.md). Nothing yet records
**why** any of it is being done. An autonomous agent with no goal
cannot answer "why am I doing this", so it cannot make a judgement
call and must escalate every ambiguity; an audit with no goals can
check that work traces to decisions but never whether the decisions
serve anything. The traceability chain — goal → record → criterion →
plan → evidence — exists today from the second link down. This
decision adds the top link.

Goals have a well-known failure mode: stale OKR theatre — a file of
aspirations nobody reads and nothing checks. The design below is
shaped against that failure: goals are few, always loadable in full,
mechanically connected to the records that serve them, and reported on
by the audit. A goal nothing serves is flagged as an aspiration; a
goal with no measure is flagged as unvalidatable. (Acting on the
measure — outcome records and validation cycles — is the next
decision, not this one.)

## Capability statement

**`GOALS.md` is an opt-in layer** (recorded as `goals` in the
capability manifest `layers:`), a **single file at the artefact root**
— small enough to load into an agent's context in full, at every
step. It is never part of the core scaffold and never enabled by the
express profile. A directory of goal files defeats the point: the
value of a goal, like a constraint, is that it is *always* in view.

**One entry per goal:**

- a **stable id** `G-<kebab-slug>` — immutable, never reused; the id
  is the cross-reference key.
- a one-or-two-sentence **statement** of the outcome sought.
- a **measure** — how the world looks different if the goal is met; a
  goal that cannot name one can never be validated.
- a **horizon** and a **`review-by:`** date — when the goal expects to
  be re-examined.
- a **state**: `Active | Achieved | Retired`. Terminal entries keep
  their id and stay in the file as history; removal is by state, never
  by deletion.

The file guides **3–7 Active goals**. The cap is a signal, not a gate:
the audit reports growth past it; nothing blocks.

**`serves:` edges connect the chain.** Any AC-bearing record — a
capability ADR or a capability spec alike; the traceability target is
"AC-bearing record", not "spec" — may carry `serves:` front matter
listing the goal ids it advances. Every listed id must resolve to an
entry in `GOALS.md`. Plan items already trace to records and criteria;
evidence already binds to criteria — with `serves:` in place the full
chain goal → record → criterion → plan → evidence is mechanically
walkable.

**`COVERAGE.md` is the generated view of that walk** — one section per
goal: the records serving it, their criteria's evidence state, the
plan items in flight. Derived like `INDEX.md`, never hand-edited,
regenerated when goals or serving records change.

**`brainstorm` is the goal writer.** Its classifier already emits the
outcome class; an outcome-class candidate becomes a `GOALS.md` entry
only on operator approval. There is no separate goal-authoring skill —
a goal is discovered in decomposition, not dictated by category first.

**The audit closes the loop** with goal-traceability checks, all
reported and never auto-edited: an Active goal no record serves (an
aspiration, not a goal); an Active goal without a measure (it can
never be validated); a `serves:` id that resolves to nothing; more
Active goals than the cap.

## User stories / scenarios

- As an operator, I want the repo's 3–7 active goals in one small
  file, so every session — mine or an agent's — starts from the same
  "why".
- As a coding agent, I want the record I am implementing to name the
  goal it serves, so an ambiguous choice can be resolved toward the
  goal instead of escalated.
- As an operator running a brainstorm, I want the fuzzy outcome I
  typed to become a recorded goal when I approve it, so the top of the
  chain is captured at the moment it surfaces instead of lost in a
  transcript.
- As an auditor (human or skill), I want aspirations, unmeasurable
  goals, and dangling `serves:` edges flagged, so the goals file stays
  a working instrument instead of decoration.
- As a maintainer, I want a generated coverage view from goal down to
  evidence, so "what is actually being done about G-x?" is one read,
  not an archaeology session.

## Acceptance criteria

1. The goals layer is opt-in: enabled repos record `goals` in the
   manifest `layers:`; `GOALS.md` is a single file at the artefact
   root; the layer is absent from the core scaffold and from the
   express profile.
   Verify: manual
2. Each goal entry carries the stable id (`G-<kebab-slug>`, immutable,
   never reused), statement, measure, horizon, `review-by:` date, and
   state (`Active | Achieved | Retired`); terminal entries keep their
   id and remain in the file; this repo's own `GOALS.md` parses
   against that shape.
   Verify: gate-check
3. AC-bearing records (capability ADRs and specs alike) may carry
   `serves:` front matter; every listed goal id resolves to an entry
   in `GOALS.md`, and this repo carries at least one record with a
   resolving `serves:` edge.
   Verify: gate-check
4. The audit reports goal-traceability findings: an Active goal with
   no serving record, an Active goal without a measure, an
   unresolvable `serves:` id, and more Active goals than the cap — all
   reported, never auto-edited.
   Verify: manual
5. `COVERAGE.md` at the artefact root is generated, never hand-edited:
   one section per goal walking record → criteria evidence state →
   plan items; it stays in sync with the catalogue the same way
   `INDEX.md` does.
   Verify: gate-check
6. `brainstorm` writes a `GOALS.md` entry from an approved
   outcome-class candidate — only on operator approval, and only when
   the layer is enabled (absent layer: it refuses cleanly and offers
   to enable it via bootstrap); no separate goal-authoring skill
   exists.
   Verify: manual
7. `bootstrap` offers the layer at fresh runs and re-runs (arriving
   together with its conventions section) and ships a `GOALS.md`
   template.
   Verify: node -e "const f=require('fs'); process.exit(f.existsSync('plugins/docflow/skills/bootstrap/templates/GOALS.md') && f.readFileSync('plugins/docflow/skills/bootstrap/SKILL.md','utf8').includes('GOALS.md') ? 0 : 1)"

## Out of scope

- **Outcome records, validation cycles, and verdicts** — acting on a
  goal's measure and `review-by:` date is the validation decision (the
  next slice), not this one. Until then a past-due `review-by:` is
  visible in the file but enforced by nothing.
- **Standing direction** — vision, tone, canon. A direction is not
  achievable and never completes; it is a different artefact class
  (the deferred creative surface), and forcing it into `GOALS.md`
  would recreate the misfiling this programme already corrected once.
- **Autonomy consumption** — graded autonomy reading goals as its
  compass is the autonomy decision.
- **Federation-level goal roll-up** — goals stay per-repo until a
  real multi-repo need shows up.

## Open questions

- None.

## References

- adr/0016-layered-artifact-model.md
- adr/0034-record-contract.md
- adr/0035-per-criterion-evidence.md
- adr/0038-capability-spec-records.md
- adr/0040-challenge-and-router.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-07-31 | r1 | Eugenio Minardi | Initial draft (Proposed), from the approved programme: single-file goals layer, serves: edges over AC-bearing records, generated coverage view, brainstorm as the goal writer, audit traceability checks. Authored on pilot-gate closure. |
| 2026-07-31 | r2 | Eugenio Minardi | Status Proposed → Accepted by the operator; implementation authorised (plan 0045). |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-07-31 | — |
