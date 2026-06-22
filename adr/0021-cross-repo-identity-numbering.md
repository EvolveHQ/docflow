---
adr: 0021
title: Cross-repo ADR identity and numbering
status: Accepted
date: 2026-06-22
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0019", "0023"]
tags: [conventions, multirepo, numbering]
---

# ADR 0021 — Cross-repo ADR identity and numbering

## Context

`CONVENTIONS.md` mandates **contiguous numbering, no gaps**. Across a
federation that rule collides: two repos independently mint `0019` and
the two ADRs become indistinguishable once decisions are referenced
across repos. A federation needs an identity that is unique across all
member repos while preserving the local readability of small contiguous
numbers.

## Capability statement

ADRs in a federation carry an identity that is **unique across the
federation**. The **scheme is selected at federation establishment**
(bootstrap) and recorded in the federation config; the **default** is the
owning repo's identity plus its local number — a repo-prefixed slug
(`<repo-id>/NNNN-slug`). The "contiguous, no gaps" rule is **relaxed to
per-repo contiguity**: each repo numbers its own ADRs contiguously;
standalone repos keep today's global contiguity.

## User stories / scenarios

- As a reader, I refer to an ADR unambiguously even though two repos both
  have an ADR numbered 0019.
- As an author, I keep minting the next local number in my repo without
  coordinating a global counter.
- As an auditor, I can detect a federation-level identity collision.

## Acceptance criteria

1. Each repo's ADRs remain locally contiguous within that repo.
2. Every ADR is uniquely addressable across the federation via a
   repo-qualified identity.
3. Two repos minting the same local number do not collide at the
   federation level.
4. The numbering convention text states **per-repo** contiguity for
   federated repos; standalone repos retain global contiguity.
5. Home/product-wide ADRs follow the same identity scheme as member-local
   ADRs.
6. The identity scheme is selected at federation establishment (bootstrap)
   and recorded in the federation config; the default is the repo-prefixed
   slug `<repo-id>/NNNN-slug` (repo-id from the federation config).

## Out of scope

- The concrete syntax used when one ADR links another across repos —
  adr/0022-cross-repo-reference-scheme.md.
- The aggregated catalogue — adr/0024-federated-rollup-catalogue.md.

## Open questions

- None. (Resolved on acceptance: the scheme is a bootstrap-establishment
  choice recorded in the federation config; default repo-prefixed slug —
  see AC6.)

## References / cross-links

- adr/0019-multirepo-topology.md
- adr/0023-federation-config-membership-index.md
- CONVENTIONS.md (the contiguous-numbering rule this ADR relaxes)

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-22 | r1 | Eugenio Minardi | Initial draft. Federation-unique ADR identity; relax contiguous numbering to per-repo contiguity. |
| 2026-06-22 | r2 | Eugenio Minardi | Accepted. Resolved open question: identity scheme is a bootstrap-establishment choice recorded in the federation config, default repo-prefixed slug (AC6). Added depends-on 0023. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-06-22 | — |
