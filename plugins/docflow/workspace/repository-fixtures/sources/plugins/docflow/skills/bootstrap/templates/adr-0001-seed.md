---
adr: 0001
title: Record architecture decisions as ADRs
status: Implemented
date: <YYYY-MM-DD>
owner: <agent-id or human>
# shape: technology    # Two-shape repos only — see the note below. Delete
#                      # this line in a repo with a single ADR shape.
supersedes:
superseded-by:
depends-on: []
tags: [process, conventions]
---

# ADR 0001 — Record architecture decisions as ADRs

<!-- Bootstrap writes this as the seed ADR (adr/0001) by default. It records
the *decision* to adopt the method; the operative rules live in
CONVENTIONS.md. Keep it generic — do not reference another project's ADR
numbers. In a repo that declares two ADR shapes, uncomment
`shape: technology` above, delete the Capability statement and User
stories / scenarios sections, and uncomment the Decision / Rationale /
Consequences block. Do not recast the capability sections — they have
no Decision, Rationale, or Consequences content. The number stays 0001:
the shape is declared in the metadata, so no exception clause is needed
anywhere. Adopting the method is a decision about how the repo is built. -->

## Context

<Project> needs its significant decisions to be **discoverable, traceable,
and durable** — not held in chat logs, pull-request threads, or one
person's memory. The lightweight Architecture Decision Record practice
(Michael Nygard, 2011; the markdown-ADR convention) records each decision
as one small, numbered, immutable file stored beside the code, so the
reasons behind the system are part of the repository.

## Capability statement

<!-- If the plan/ layer was skipped (Q4a), drop the plan-queue clause
here and in acceptance criterion 3. -->
This repository is **documentation-led and ADR-driven**: every significant
decision is recorded as a numbered ADR under `adr/`; the catalogue is the
**source of truth** the running system is expected to match; and a status
lifecycle drives a `plan/` work queue. The authoring rules — ADR shape,
status lifecycle, numbering, audit trail, and git contract — live in
`CONVENTIONS.md`. This ADR records the **decision to adopt the practice**,
not the rules themselves.

## User stories / scenarios

- As a contributor, I find the reasons behind this system in the catalogue,
  not by asking someone.
- As a maintainer, each decision, the work that implements it, and the
  commit that ships it are linked through one stable identifier.
- As a new reader, the first ADR explains why this repository uses ADRs and
  points me at where the rules live.

<!-- Two-shape only. Uncomment this block; delete Capability statement
and User stories / scenarios. Single-shape: leave commented and delete
the `shape:` line above. If the plan/ layer was skipped (Q4a), drop the
plan-queue clause from Decision and from acceptance criterion 3. -->
<!--
## Decision

This repository adopts the **documentation-led, ADR-driven** method: every
significant decision is recorded as a numbered ADR under `adr/`; the
catalogue is the **source of truth** the running system is expected to
match; and a status lifecycle drives a `plan/` work queue. The authoring
rules — ADR shape, status lifecycle, numbering, audit trail, and git
contract — live in `CONVENTIONS.md`. This ADR records the **decision to
adopt the practice**, not the rules themselves.

## Rationale

A dated, numbered record beside the code is the only form that stays
discoverable as the system changes. Alternatives considered:

- Leaving decisions in chat logs and pull-request threads — rejected
  because those records are not numbered, are not a catalogue a new
  reader can walk, and disappear when the thread is archived.
- A wiki or document store outside the repository — rejected because it
  is not versioned with the code it describes and drifts without a
  merge-time check.
- One living design document that accumulates every choice — rejected
  because a single file cannot be superseded decision-by-decision and
  has no status lifecycle that can drive a work queue.

## Consequences

- Positive: the catalogue is self-describing from the first entry;
  contributors find the reasons behind the system in the repo; each
  decision, the work that implements it, and the commit that ships it
  share one stable identifier.
- Negative: every later decision pays the cost of writing an ADR and
  keeping the index (and the plan queue, when present) in sync.
- Follow-up work implied by this decision: subsequent ADRs use the
  matching `0000` template; `CONVENTIONS.md` remains the source of the
  rules.
-->

## Acceptance criteria

1. Significant decisions are recorded as numbered ADRs under `adr/`,
   following `CONVENTIONS.md`.
2. The catalogue is the source of truth; code is expected to match the
   decisions it records.
3. ADR authoring, the status lifecycle, and the `plan/` queue follow
   `CONVENTIONS.md`.

## Out of scope

- The detailed authoring rules (ADR shape, lifecycle, numbering, git
  contract) — these live in `CONVENTIONS.md`, not here.

## Open questions

- None.

## References

- CONVENTIONS.md (the operative authoring rules)
- Michael Nygard, "Documenting Architecture Decisions" — https://adr.github.io

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| <YYYY-MM-DD> | r1 | <owner> | Adopted the documentation-led, ADR-driven method (seeded at bootstrap). |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| <role> | <name> | <YYYY-MM-DD> | — |
