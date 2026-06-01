---
adr: 0012
title: Behavioural and end-to-end evaluation of skill outcomes
status: Accepted
date: 2026-06-01
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0001", "0011"]
tags: [testing, quality, evals]
---

# ADR 0012 — Behavioural and end-to-end evaluation of skill outcomes

## Context

Static validation (adr/0011-static-skill-validation.md) proves a skill is
well-formed, not that it *does the right thing*. A skill is a set of
instructions to a coding agent, so its real behaviour is only observable
by running it and inspecting the result. This is the "e2e test" tier:
run a skill against a controlled fixture repository and assert the
outcome. It is heavier and model-in-the-loop, so it is flakier and
slower than the static tier and need not gate every commit.

## Capability statement

docflow evaluates skill behaviour end-to-end by executing a skill against
a **fixture repository** and asserting the resulting state. Representative
evals:

- `/bootstrap` a scratch repo with a fixed set of assessment answers,
  then assert the expected file tree exists (`AGENTS.md`,
  `CONVENTIONS.md`, `adr/0000-template.md`, `plan/`, `_agent/`) and key
  conventions are present.
- `/new-adr` against a bootstrapped fixture, then assert the next
  contiguous number was chosen and `INDEX.md` regenerated to match.
- `/ship-item` against a fixture with a queued item, then assert the
  `todo`→`done` move and the owning ADR's `Accepted`→`Implemented`
  advance.

The eval harness reuses the fixtures and assertion helpers from the
static tier where possible, and may build on the existing skill-creator
eval/benchmarking tooling. It runs as a release-gating suite rather than
on every push.

## User stories / scenarios

- As a maintainer, I want to confirm a skill still produces the right
  repository state after an edit, so behavioural regressions are caught.
- As a release manager, I want an e2e suite green before publishing, so a
  broken skill never ships to users.

## Acceptance criteria

1. An eval harness can run a named skill against a fixture repo with
   scripted inputs and assert the resulting file tree / content.
2. At least `bootstrap`, `new-adr`, and `ship-item` have a behavioural
   eval.
3. The suite is runnable on demand and designated as a release gate
   (distinct from the per-push static gate).
4. Flaky, model-dependent assertions are tolerant of incidental wording
   while strict on structural outcomes (file existence, numbering, status
   transitions).

## Out of scope

- Structural well-formedness of the skills themselves — covered by
  adr/0011-static-skill-validation.md.

## Open questions

- Which runner executes the agent in CI headlessly, and whether evals run
  against a pinned model — resolve during implementation.

## References / cross-links

- adr/0011-static-skill-validation.md
- adr/0007-lifecycle-skills.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-01 | r1 | Eugenio Minardi | Initial decision. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-06-01 | — |
