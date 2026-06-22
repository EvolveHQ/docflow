---
adr: 0025
title: Cross-repo plan ownership
status: Proposed
date: 2026-06-22
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0021"]
tags: [multirepo, plan]
---

# ADR 0025 — Cross-repo plan ownership

## Context

A product-wide decision is often implemented across several repos. The
`plan/` queue is per-repo, with "lower numbers run first" ordering local
to one repo. A federation needs to answer: does one decision get one plan
item or one per repo, where do those items live, and how do they trace
back to a (possibly home-repo) ADR.

## Capability statement

Work for a cross-repo decision is tracked as **per-repo plan items** that
each trace to the owning ADR via its federation identity
(adr/0021-cross-repo-identity-numbering.md). Each item lives in the repo
whose code it changes, and per-repo queue ordering is unchanged.

## User stories / scenarios

- As a developer, I pick up the plan item in my own repo for a
  product-wide decision and it names the owning ADR.
- As a maintainer, I can list every repo's plan item for one decision.
- As a queue owner, my repo's "lower numbers first" ordering keeps working
  unchanged.

## Acceptance criteria

1. A cross-repo decision may have one plan item **per affected repo**,
   each naming the owning ADR by its federation identity.
2. Each plan item lives in the repo whose code it changes.
3. Per-repo plan ordering remains meaningful within each repo.
4. A plan item may reference an ADR in another (home) repo via the
   cross-repo reference scheme
   (adr/0022-cross-repo-reference-scheme.md).
5. The full set of plan items for one decision is discoverable from the
   owning ADR.

## Out of scope

- When the decision counts as Implemented across repos —
  adr/0026-cross-repo-status-completion.md.

## Open questions

- Whether a decision-level umbrella record is needed in the home repo to
  group the per-repo items, or the owning ADR alone suffices.

## References / cross-links

- adr/0021-cross-repo-identity-numbering.md
- adr/0022-cross-repo-reference-scheme.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-22 | r1 | Eugenio Minardi | Initial draft. Per-repo plan items tracing to the owning ADR; items live in the repo they change; local ordering preserved. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
