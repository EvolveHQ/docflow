---
adr: 0027
title: Convention and template propagation across the federation
status: Proposed
date: 2026-06-22
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0019", "0023"]
tags: [multirepo, conventions, propagation]
---

# ADR 0027 — Convention and template propagation across the federation

## Context

A product spread across repos wants consistent conventions: shared
`CONVENTIONS.md` rules, ADR templates, and `AGENTS.md` hard rules. Copied
into each repo at bootstrap, those copies drift as the source evolves. The
federation needs a single source and a defined way to keep members in sync
— without a member's bootstrap writing into another repo.

## Capability statement

Shared conventions and templates have a **single authoritative source** in
the federation (the home repo) and a **defined propagation mechanism** to
members — active sync or copy-then-audit-drift — so the fleet stays
consistent while members may still hold local-only conventions.

## User stories / scenarios

- As a maintainer, I update a shared rule once and have a defined path to
  bring every member repo into line.
- As a member-repo owner, my local-only conventions are not clobbered by
  propagation.
- As an auditor, I can tell when a member's copy has drifted from the
  source.

## Acceptance criteria

1. Shared conventions/templates have one authoritative source in the
   federation.
2. A defined mechanism propagates updates from the source to member repos.
3. Drift between a member's copy and the source is detectable
   (handed to adr/0028-cross-repo-audit.md).
4. Members may hold local-only conventions that propagation does not
   overwrite.
5. Propagation never requires a member's bootstrap to write to another
   repo.

## Out of scope

- The membership index mechanics —
  adr/0023-federation-config-membership-index.md.
- The audit checks themselves — adr/0028-cross-repo-audit.md.

## Open questions

- Active sync vs copy-then-audit-drift; and whether shared rules are
  **enforced** down into each repo or merely **referenceable** from the
  home.

## References / cross-links

- adr/0019-multirepo-topology.md
- adr/0023-federation-config-membership-index.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-22 | r1 | Eugenio Minardi | Initial draft. Single source for shared conventions/templates with a defined propagation mechanism; local-only conventions preserved; no cross-repo writes. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
