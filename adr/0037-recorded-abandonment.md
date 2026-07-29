---
adr: 0037
title: Deliberate abandonment is a recorded terminal state
status: Proposed
date: 2026-07-29
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0001", "0034", "0035"]
tags: [core, lifecycle, audit-trail]
---

# ADR 0037 — Deliberate abandonment is a recorded terminal state

## Context

Two artefact classes currently have no honest way to be abandoned. A
`Proposed` ADR that is turned down has nowhere to go: `Deprecated`
means "was real, world moved on" — it never was; `Superseded` needs a
successor and implies a decision that was in effect. So the file is
deleted, losing the record that an option was considered and
**rejected** — often the most valuable content in a catalogue. A
`plan/todo/` item that is abandoned is likewise deleted, leaving the
audit trail unable to distinguish "never existed" from "deliberately
dropped".

Formalising the state machines also exposed a live defect in the
authoring skill: creating a **`Proposed`** successor immediately flips
the old ADR to `Superseded`. If that successor is then turned down,
the old ADR is stranded in a terminal state for a decision that still
stands. Supersession is an effect of a decision being *made*, not
merely drafted.

One decision covers all of this: **deliberate abandonment is a
recorded terminal state, never a deletion** — applied to the two
classes that lacked one.

## Capability statement

A rejected proposal becomes **`Withdrawn`**: a terminal ADR status
reachable only from `Proposed`, recording that the option was
considered and turned down. The status lifecycle is correspondingly
sharpened: from `Proposed` the only exits are `Accepted` and
`Withdrawn`; `Superseded` and `Deprecated` are reachable from
`Accepted` and `Implemented` — and **supersession takes effect when
the successor is Accepted**, never on its mere proposal. An abandoned
work item becomes **`plan/dropped/<date>-NNNN-<slug>.md`** — the
number kept so references resolve, the reason recorded in a footer —
and a dropped plan **leaves the owning aggregate**: it can neither
block a record's advancement forever nor satisfy coverage, and its
claimed scope is re-queued or explicitly dispositioned in the drop
reason. Nothing deliberate is ever deleted.

## User stories / scenarios

- As a maintainer, I want rejected proposals kept as `Withdrawn`, so
  that "we considered X and said no" survives as searchable history.
- As an agent, I want a dropped work item to keep its number and its
  reason, so that references resolve and the queue's history is
  complete.
- As an auditor, I want dropped items excluded from the owning
  aggregate, so that one abandoned plan neither strands a record at
  `Accepted` forever nor fakes its coverage.
- As an author, I want supersession to fire on acceptance, so that
  drafting a replacement cannot terminate a standing decision.

## Acceptance criteria

1. **Lifecycle sharpened.** The status lifecycle in this repo's
   conventions and the scaffolded template gains `Withdrawn` (terminal,
   reachable only from `Proposed`), and records the narrowing: from
   `Proposed` the only exits are `Accepted` and `Withdrawn`;
   `Superseded`/`Deprecated` are reachable from `Accepted` and
   `Implemented`.
   Verify: manual
2. **INDEX carries it.** A `Withdrawn` ADR keeps its INDEX row with
   status `Withdrawn` — numbering stays contiguous, and the row
   implies nothing about the decision ever being in effect.
   Verify: gate-check
3. **Dropped queue items.** The plan conventions (own + template,
   including the plan README) document
   `plan/dropped/<date>-NNNN-<slug>.md`: the `git mv` keeps the
   number, a `Dropped` footer records date and reason, and deletion is
   never the mechanism.
   Verify: manual
4. **Aggregate semantics.** The conventions record that dropped plans
   leave the owning set — a record's advancement quantifies over
   non-dropped plans only, and a dropped item satisfies no coverage;
   its claimed scope is re-queued or dispositioned in the drop reason.
   Verify: manual
5. **Supersession on acceptance.** The ADR authoring skill records
   supersession intent on the successor at proposal (`supersedes:`)
   but flips the predecessor to `Superseded` only when the successor
   is **Accepted**; a withdrawn successor leaves the predecessor
   untouched.
   Verify: manual
6. **Gate knows the states.** The static gate accepts `Withdrawn` as a
   valid status (INDEX fidelity included) and validates
   `plan/dropped/` files (name pattern with number kept; a footer
   naming the drop reason). Gate changes land as their own commits.
   Verify: gate-check
7. **Audit knows the semantics.** The audit treats `dropped/` as a
   valid terminal location (not a missing item), expects no plan items
   for `Withdrawn` ADRs, and includes `Withdrawn` in status validity
   and supersession-symmetry checks.
   Verify: manual
8. **Evidenced at ship.** This decision's criteria receive bound
   evidence records at its own ship.
   Verify: gate-check

## Out of scope

- Retiring or archiving `Implemented` work — `Superseded` and
  `Deprecated` already cover decided-and-replaced and
  decided-and-lapsed; this decision only covers *never-accepted* and
  *never-done*.
- Any change to `plan/done/` semantics — done still means done.
- Withdrawn-with-successor linkage schemes — a withdrawal may cite a
  reason free-form; formal `superseded-by` stays reserved for real
  supersession.

## Open questions

- None.

## References

- adr/0001-adr-driven-workflow.md
- adr/0034-record-contract.md
- adr/0035-per-criterion-evidence.md
- Source analysis and cross-review ledger: `../docflow-workflow-analysis/`
  (unversioned sibling folder, r10 — the automata that exposed both gaps
  and the supersession defect)

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-07-29 | r1 | Eugenio Minardi | Initial draft. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
