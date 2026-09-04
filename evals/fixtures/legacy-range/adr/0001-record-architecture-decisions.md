---
adr: 0001
title: Record architecture decisions
status: Implemented
date: 2026-01-12
owner: eval-bot
supersedes:
superseded-by:
depends-on: []
tags: [fixture]
---

# ADR 0001 — Record architecture decisions

## Context

This repository had no written record of why it is built the way it is.
Decisions lived in review threads and in people's heads.

## Decision

Adopt the documentation-led, ADR-driven method: one decision per record,
a contiguous catalogue under `adr/`, a queue under `plan/`, and the
authoring rules in `CONVENTIONS.md`.

## Rationale

Alternatives considered: a wiki (rejected — it drifts from the code and
has no review gate); long-form design docs per project (rejected — no
stable identity to cite, and no status lifecycle); comments in code
(rejected — they record what, never why, and they die with the file).

This record is technology-shaped but numbered `0001`, inside the
capability range, because the adoption of the method has to be the first
entry in the catalogue it creates. `CONVENTIONS.md` records the
exception.

## Consequences

Every subsequent decision is written down before it is built. The
catalogue becomes a review surface, and the number becomes the citable
identity.

## Acceptance criteria

1. `CONVENTIONS.md` records the authoring rules.
2. `adr/` holds one file per decision, numbered contiguously.
3. `INDEX.md` is regenerated from ADR metadata.

## Out of scope

- Backfilling decisions predating this record.

## References

- `CONVENTIONS.md`

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-01-12 | r1 | eval-bot | Initial record of the adopted method. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | eval-bot | 2026-01-12 | — |
