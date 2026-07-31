---
adr: 0041
title: Goals layer — the top of the traceability chain
status: Accepted
date: 2026-07-31
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0016", "0034", "0035", "0038", "0040"]
serves: ["G-aligned-autonomy"]
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

**The goals layer is opt-in** (recorded as `goals` in the capability
manifest `layers:`), never part of the core scaffold and never
enabled by the express profile. **Goals are slug-identified files** —
one per goal, `goals/G-<kebab-slug>.md` at the artefact root, the
same record shape as the rest of the catalogue: properties in front
matter, an index section, one file per record.

**Per goal file:**

- front matter: **`id:`** equal to the filename stem
  (`G-<kebab-slug>` — immutable, never reused; the cross-reference
  key), **`title:`**, **`state:`** (`Active | Achieved | Retired`),
  **`horizon:`**, **`review-by:`**, and **`date:`**.
- body: a `## Statement` (the outcome sought, one or two sentences)
  and a `## Measure` (how the world looks different if the goal is
  met — a goal that cannot name one can never be validated).

A finished or abandoned goal keeps its file under a terminal state —
removal is by state, never deletion, so historical `serves:` edges
always resolve. **Only the Active set is loaded before a task**, so
terminal goals cost no context. `INDEX.md` gains a **Goals section**
(id, title, state, horizon, review-by), regenerated like the ADR
table. The layer guides **3–7 Active goals**; the cap is a signal,
not a gate — the audit reports growth past it; nothing blocks.
(Chosen over a single always-in-view `GOALS.md` for catalogue
uniformity and unbounded terminal history at zero context cost; the
price is a handful of small reads instead of one.)

**`serves:` edges connect the chain.** Any AC-bearing record — a
capability ADR or a capability spec alike; the traceability target is
"AC-bearing record", not "spec" — may carry `serves:` front matter
listing the goal ids it advances. Every listed id must resolve to a
`goals/` file. Plan items already trace to records and criteria;
evidence already binds to criteria — with `serves:` in place the full
chain goal → record → criterion → plan → evidence is mechanically
walkable.

**`COVERAGE.md` is the generated view of that walk** — one section per
goal: the records serving it, their criteria's evidence state, the
plan items in flight. Derived like `INDEX.md`, never hand-edited,
regenerated when goals or serving records change.

**`brainstorm` is the goal writer.** Its classifier already emits the
outcome class; an outcome-class candidate becomes a `goals/` file
(copied from the repo's goal template) only on operator approval.
There is no separate goal-authoring skill — a goal is discovered in
decomposition, not dictated by category first.

**The audit closes the loop** with goal-traceability checks, all
reported and never auto-edited: an Active goal no record serves (an
aspiration, not a goal); an Active goal without a measure (it can
never be validated); a `serves:` id that resolves to nothing; more
Active goals than the cap.

## User stories / scenarios

- As an operator, I want the repo's 3–7 active goals as small
  catalogue records with an index row each, so every session — mine
  or an agent's — starts from the same "why" without terminal
  history in view.
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
   manifest `layers:`; goals live one-per-file under `goals/` at the
   artefact root; the layer is absent from the core scaffold and from
   the express profile.
   Verify: manual
2. Each goal file's front matter carries `id:` equal to the filename
   stem (`G-<kebab-slug>`, immutable, never reused), `title:`,
   `state:` (`Active | Achieved | Retired`), `horizon:`,
   `review-by:`, and `date:`, with Statement and Measure sections in
   the body; a terminal goal keeps its file under its terminal state;
   `INDEX.md` carries a Goals section in sync with the files; this
   repo's own `goals/` parses against that shape.
   Verify: gate-check
3. AC-bearing records (capability ADRs and specs alike) may carry
   `serves:` front matter; every listed goal id resolves to a
   `goals/` file, and this repo carries at least one record with a
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
6. `brainstorm` writes a `goals/` file from an approved outcome-class
   candidate — only on operator approval, and only when the layer is
   enabled (absent layer: it refuses cleanly and offers to enable it
   via bootstrap); no separate goal-authoring skill exists.
   Verify: manual
7. `bootstrap` offers the layer at fresh runs and re-runs (arriving
   together with its conventions section) and ships a per-goal
   template.
   Verify: node -e "const f=require('fs'); process.exit(f.existsSync('plugins/docflow/skills/bootstrap/templates/goal.md') && f.readFileSync('plugins/docflow/skills/bootstrap/SKILL.md','utf8').includes('goals/') ? 0 : 1)"

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
| 2026-07-31 | r3 | Eugenio Minardi | Pre-evidence design revision, operator-directed at the attestation gate: single-file `GOALS.md` → per-file `goals/G-<slug>.md` records with front-matter properties and an INDEX Goals section — catalogue uniformity, terminal goals at zero context cost; the always-in-view discipline now applies to the Active set. Capability statement + AC1–AC3, AC6–AC7 reworded; no evidence bound to the earlier text. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-07-31 | — |
