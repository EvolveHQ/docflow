---
adr: 0019
title: Multirepo topology for a single product
status: Accepted
date: 2026-06-22
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0001", "0016"]
tags: [conventions, multirepo, topology, bootstrap]
---

# ADR 0019 — Multirepo topology for a single product

## Context

docflow is single-repo by construction: each target repo gets its own
`adr/` catalogue, `plan/` queue, `_agent/` coordination, and `INDEX.md`.
The concurrency and reconciliation decisions
(adr/0010-worktree-conflict-reconciliation.md,
adr/0014-concurrency-guardrails.md) coordinate **worktrees of one repo**;
adr/0017-configurable-artifact-root.md relocates artefacts **within** a
repo. Nothing today describes a single product whose decisions span
several repos (frontend, backend, infrastructure).

The load-bearing question for that scenario is **where cross-repo,
product-wide decisions physically live**. Every downstream concern —
numbering, references, the catalogue, plan ownership — resolves
differently depending on the answer, so the topology must be decided
first.

## Capability statement

docflow supports a **configurable multirepo topology** for one product
spread across many repos, chosen when the federation is established:

- **A — Central decisions repo**: a dedicated repo holds all product-wide
  ADRs; code repos reference, never duplicate.
- **B — Distributed + federation**: each repo owns the ADRs for its own
  decisions; a roll-up aggregates them.
- **C — Home repo + local** *(recommended default)*: one repo is the home
  for product-wide decisions; each repo also keeps purely-local ADRs.

A standalone repo that is not part of a multi-repo product behaves
exactly as today; the topology question is never asked.

## User stories / scenarios

- As a maintainer of a product split across repos, I choose a topology
  once and every repo agrees on where product-wide decisions live.
- As a developer, I record a decision local to my service without it
  leaking into the product-wide catalogue (topology C).
- As a lifecycle skill, I read the recorded topology and resolve where to
  write or look for a product-wide ADR.

## Acceptance criteria

1. When the operator declares a repo part of a multi-repo product,
   bootstrap offers topologies A, B, and C, with **C as the default**.
2. The chosen topology is recorded in a federation-readable location and
   every lifecycle skill resolves behaviour against it.
3. Under topology C exactly one repo is the home repo; product-wide ADRs
   live there and purely-local ADRs stay in each member repo.
4. A repo declared standalone is unaffected: no topology question, no
   federation artefacts, single-repo behaviour unchanged.
5. The topology is chosen once at federation establishment and is **not**
   re-asked when other repos join (see
   adr/0020-federation-bootstrap-establish-join.md).
6. Topologies A, B, and C are all implemented and selectable in v1; C is
   the default, not the only supported mode.

## Out of scope

- ADR identity/numbering across repos —
  adr/0021-cross-repo-identity-numbering.md.
- The reference scheme and the config artefacts —
  adr/0022-cross-repo-reference-scheme.md,
  adr/0023-federation-config-membership-index.md.
- Migrating an already-bootstrapped repo's existing ADRs into the
  federation (v1 keeps local ADRs local).

## Open questions

- None. (Resolved on acceptance: all three topologies ship in v1; C is the
  default.)

## References / cross-links

- adr/0001-adr-driven-workflow.md
- adr/0016-layered-artifact-model.md
- adr/0017-configurable-artifact-root.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-22 | r1 | Eugenio Minardi | Initial draft. Configurable multirepo topology (A/B/C) for one product across many repos; C the recommended default. |
| 2026-06-22 | r2 | Eugenio Minardi | Accepted. Resolved open question: all three topologies ship in v1 (AC6); C remains the default. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-06-22 | — |
