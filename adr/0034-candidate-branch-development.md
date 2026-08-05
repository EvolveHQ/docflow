---
adr: 0034
title: Candidate-branch development — main is the released line
status: Implemented
date: 2026-08-05
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0001"]
tags: [workflow, git, release, governance]
---

# ADR 0034 — Candidate-branch development — main is the released line

## Context

The operator split the repository's development from its released
line: `main` was force-reset to the v0.9.4 release commit (ffd0b4e)
on 2026-08-04, and experimental 1.0 development moved to dedicated
**candidate branches**, each pursuing one approach. The first
candidate is `v1/aligned-autonomy`. This branch —
`v1/agent-loop-graph`, cut clean from the v0.9.4 tag on 2026-08-05 —
is the **second candidate**, focused on **agent loop/graph
management**. Each candidate records this shared branching decision
in its own catalogue, because catalogues never merge across
candidates; this is that record for this line.

## Capability statement

**`main` is the released line.** Its HEAD always equals the latest
release tag's commit; it advances only with a release — normally by
**promoting** one candidate (fast-forward), exceptionally by a tagged
hotfix. No unreleased development lands on it.

**Development happens on a v1 candidate branch** — `v1/<approach>`;
this one is `v1/agent-loop-graph` — under exactly the discipline
`main` had: changes fast-forward onto the candidate, no merge
commits, verify gate green before push. The completion event for
queued work is "fast-forwarded to the active candidate + pushed".

**Candidates are alternatives and never merge with one another.**
Each carries its own continuation of the catalogue from the shared
0.9.4 base (numbers above 0033 will repeat across candidates — they
never meet on one line, so no collision can occur). Exactly **one**
candidate is promoted to `main`; the others are archived unmerged.
**Promotion is an operator decision, recorded when taken** on the
winning candidate.

**Nothing on a candidate is released.** No tags, no version bumps,
no npm publication, no outward-facing artefacts — internal testing
only, until the operator's explicit release instruction.

## User stories / scenarios

- As the operator, I want `main` to always be the thing users
  actually got, so an install from the default branch never picks up
  experimental work from either candidate.
- As the operator, I want this branch to pursue the agent
  loop/graph-management approach from a clean released base, so the
  two candidates can be compared honestly at promotion time.
- As a coding agent on this branch, I want the completion event to
  name this candidate, so the shipping discipline is unchanged in
  everything but the target.

## Acceptance criteria

1. `main`'s HEAD is exactly a release-tagged commit; no unreleased
   development sits on the released line.
2. This branch exists as `v1/agent-loop-graph`, cut from the v0.9.4
   tag, and the tag is its ancestor.
3. `CONVENTIONS.md` §Git Contract and `AGENTS.md` record the model on
   this branch: candidate development, promotion-only released line,
   the never-merge rule, and the no-release / internal-testing-only
   rule.
4. Exactly one candidate is promoted; alternatives are archived
   unmerged; promotion is an operator decision recorded on the
   winning candidate when taken.

## Out of scope

- **The loop/graph-management design itself** — this record creates
  the line it will be decided on; the approach's decisions follow as
  their own ADRs.
- **The promotion criteria** — decided and recorded at promotion
  time.
- **Anything outward** — releases, tags, publication.

## Open questions

- None.

## References

- adr/0001-workflow-as-product.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-08-05 | r1 | Eugenio Minardi | Recorded after the fact (reconstruction): the operator directed the candidate-branch split on 2026-08-04 (main reset to ffd0b4e) and the creation of this second candidate on 2026-08-05, cut from v0.9.4, focused on agent loop/graph management. Authored at Implemented with the contract amendments in the same commit. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-08-05 | — |
