---
adr: 0013
title: Standard interactive assessment protocol for skills
status: Implemented
date: 2026-06-02
owner: Eugenio Minardi
supersedes: ["0002"]
superseded-by:
depends-on: ["0006", "0007"]
tags: [skills, ux, assessment]
---

# ADR 0013 — Standard interactive assessment protocol for skills

## Context

adr/0002-assessment-driven-bootstrap.md established a good interaction
pattern for `bootstrap`: questions asked one at a time, each with a
recommended default, the operator deciding, and sign-off before anything
is written. The other interactive skills
(adr/0007-lifecycle-skills.md) did not share that contract — when invoked
with little or no context they could guess scope or act with too few
inputs. The pattern should be promoted from a bootstrap-only behaviour to
a **shared protocol** all interactive skills follow, so the operator is
always in control and the interaction is consistent and predictable. This
ADR generalises 0002 and therefore supersedes it.

## Capability statement

The interactive skills — `new-adr`, `new-plan`, `add-convention`,
`brainstorm`, `agent-wave`, and `bootstrap` — run a shared **assessment
protocol** before acting:

- An **opt-out gate** is the first question: *run the assessment, or skip
  it?* The recommended default depends on context — recommend **run**
  when the invocation carries little/no context, **skip** when the
  request is already fully specified.
- Assessment questions are asked **one at a time**, each with a clearly
  labelled **recommended option** and a one-line reason.
- Questions use **structured selection** — single- or multi-select as the
  question warrants ("scroll to select"). **Free-text answers are used
  only where an enumerable set is impossible** (e.g. an ADR title).
- The **operator's selection is authoritative**; a skill never proceeds
  past a question without input, and never silently guesses when invoked
  with no context.
- Where the host coding agent exposes no structured-selection tool, the
  skill **falls back to enumerated plain-text options (A/B/C)** — the
  protocol is preserved on every target (parity, adr/0008-dual-target-packaging.md).

`agent-wave` additionally asks **parallelism** (wave width) and **merge /
integration strategy** — defaulting to the repo's recorded integration
model (adr/0006-integration-model.md), with options to override (local
fast-forward, PR-based, or other).

## User stories / scenarios

- As an operator, I want every interactive skill to confirm scope with me
  before acting, so a vague request never produces the wrong artefact.
- As an operator, I want a recommended option on each question, so I can
  move quickly while keeping the final say.
- As an operator on a context-rich invocation, I want to skip the
  assessment in one step, so the protocol never becomes friction.

## Acceptance criteria

1. On invocation, each listed skill first presents an **opt-out gate**
   question ("run assessment / skip?") with a recommended default that
   flips on how much context the invocation carried.
2. Assessment questions are presented **one at a time**, each with a
   labelled recommended option.
3. Questions use **structured single- or multi-select**; free text is
   used only where an enumerable option set is impossible.
4. The operator's selection is authoritative — the skill does not proceed
   past a question without input.
5. When invoked with **no context**, the assessment is **mandatory** (the
   skill must not guess).
6. Where the host exposes no structured-selection tool, the skill falls
   back to enumerated plain-text options, preserving the protocol.
7. `agent-wave` additionally asks **parallelism** and **merge/integration
   strategy**, defaulting to the repo's integration model
   (adr/0006-integration-model.md) and allowing override.

## Out of scope

- The specific question set of any individual skill (decided per skill at
  implementation time, within this protocol).
- A shared code module for the protocol — skill files are standalone, so
  each embeds the protocol in agent-neutral prose.

## Open questions

- None.

## References / cross-links

- adr/0002-assessment-driven-bootstrap.md (superseded by this ADR)
- adr/0006-integration-model.md
- adr/0007-lifecycle-skills.md
- adr/0008-dual-target-packaging.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-02 | r1 | Eugenio Minardi | Initial decision. Generalises and supersedes ADR 0002 (bootstrap assessment) into a shared protocol for all interactive skills. |
| 2026-06-02 | r2 | Eugenio Minardi | Implemented (plan items 0005, 0006): Step 0.5 assessment in new-adr/new-plan/add-convention/brainstorm/agent-wave, plus agent-wave parallelism + merge-strategy questions. Status Accepted → Implemented. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-06-02 | — |
