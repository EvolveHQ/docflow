---
adr: 0027
title: Convention and template propagation across the federation
status: Implemented
date: 2026-06-22
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0019", "0023", "0028"]
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
the federation (the home repo). Members receive them by **copy at
bootstrap**; drift from the source is **detected by audit**, not actively
pushed. Shared rules are **referenceable** from the home, not force-pushed
into members, which may still hold local-only conventions. No member's
bootstrap writes into another repo.

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
6. The mechanism is **copy-at-bootstrap + audit-detected drift**, not
   active sync; shared rules are **referenceable** from the home, not
   force-enforced into members.

## Out of scope

- The membership index mechanics —
  adr/0023-federation-config-membership-index.md.
- The audit checks themselves — adr/0028-cross-repo-audit.md.

## Open questions

- None. (Resolved on acceptance: copy-at-bootstrap + audit-detected drift,
  referenceable not enforced — see AC6.)

## References / cross-links

- adr/0019-multirepo-topology.md
- adr/0023-federation-config-membership-index.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-22 | r1 | Eugenio Minardi | Initial draft. Single source for shared conventions/templates with a defined propagation mechanism; local-only conventions preserved; no cross-repo writes. |
| 2026-06-23 | r2 | Eugenio Minardi | Accepted. Resolved open question: copy-at-bootstrap + audit-detected drift, referenceable not enforced (AC6). Added depends-on 0028. |
| 2026-06-23 | r3 | Eugenio Minardi | Implemented (commit eeb7e6b): §Federation propagation rule (shared conventions sourced from the index-holder, copied at bootstrap, referenceable not enforced) + a convention-drift check in audit check 12. Structural verification only. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-06-23 | — |
