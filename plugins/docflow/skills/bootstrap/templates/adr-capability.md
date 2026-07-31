---
adr: NNNN
title: <Title in sentence case>
status: Proposed
date: YYYY-MM-DD
owner: <agent-id or human>
supersedes:
superseded-by:
depends-on: []
serves: []
tags: []
---

# ADR NNNN — <Title>

## Context

<Why this decision exists. Forces at play. What problem are we solving
and what constraints shape the answer.>

## Capability statement

<One paragraph. What the system must do. Stated as capability, not
implementation.>

## User stories / scenarios

- As a <role>, I want <capability>, so that <outcome>.
- As a <role>, I want <capability>, so that <outcome>.

## Acceptance criteria

<Each criterion is testable and observable, and ends with a `Verify:`
line naming how it is checked: an inline command, `gate-check` (the
repo's static gate covers it), or `manual` (a named human attests —
see CONVENTIONS §Verification Evidence).>

1. <Testable, observable criterion.>
   Verify: <command | gate-check | manual>
2. <Testable, observable criterion.>
   Verify: <command | gate-check | manual>
3. ...

## Out of scope

- <Explicit non-goals — what this ADR does not cover.>

## Open questions

- <Unresolved items. Empty when ADR transitions to Accepted.>

## References

- adr/NNNN-<other>.md
- <External links, specs, prior art.>

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| YYYY-MM-DD | r1 | <id> | Initial draft. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
