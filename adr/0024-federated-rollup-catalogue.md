---
adr: 0024
title: Federated roll-up catalogue
status: Accepted
date: 2026-06-22
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0021", "0022", "0023"]
tags: [multirepo, index]
---

# ADR 0024 — Federated roll-up catalogue

## Context

Each repo regenerates its own `INDEX.md` from ADR metadata. A product
spread across repos needs a product-wide view without surrendering each
repo's local index. The aggregate must be **derived**, mirroring how
`INDEX.md` is regenerated rather than hand-edited, so it cannot drift
silently from the per-repo sources.

## Capability statement

A **roll-up catalogue** aggregates per-repo ADR metadata across the
federation into one product-wide view, generated from the member index
(adr/0023-federation-config-membership-index.md). Each member repo's
`INDEX.md` remains authoritative for that repo; the roll-up is a derived,
read-only aggregate that records each ADR's owning repo and
federation-unique identity.

## User stories / scenarios

- As a maintainer, I see every product-wide and member-local decision in
  one place.
- As a member-repo owner, my own `INDEX.md` stays the source of truth for
  my repo.
- As a reader, each roll-up row tells me which repo owns the ADR and its
  federation identity.

## Acceptance criteria

1. Each member repo keeps its own `INDEX.md` as today.
2. A roll-up view aggregates ADR metadata across member repos.
3. The roll-up is generated from the member index, not hand-maintained.
4. The roll-up is derived/read-only; each member `INDEX.md` remains the
   authority for its repo.
5. Each roll-up entry records the owning repo and the ADR's
   federation-unique identity
   (adr/0021-cross-repo-identity-numbering.md).
6. The generator is an **agent-run lifecycle skill** (not CI), mirroring
   how `INDEX.md` is regenerated. It reads each member's `INDEX.md` from
   the local checkouts named by the member index.
7. The generator is **tolerant**: a member that is not checked out
   locally is listed in the roll-up as "not aggregated this run" rather
   than failing or being silently dropped.

## Out of scope

- The cross-repo reference syntax —
  adr/0022-cross-repo-reference-scheme.md.
- Aggregate status reporting — adr/0026-cross-repo-status-completion.md.

## Open questions

- None. (Resolved on acceptance: an agent-run lifecycle skill, tolerant of
  members not checked out locally — see AC6, AC7.)

## References / cross-links

- adr/0021-cross-repo-identity-numbering.md
- adr/0022-cross-repo-reference-scheme.md
- adr/0023-federation-config-membership-index.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-22 | r1 | Eugenio Minardi | Initial draft. Derived, read-only roll-up catalogue generated from the member index; per-repo INDEX stays authoritative. |
| 2026-06-23 | r2 | Eugenio Minardi | Accepted. Resolved open question: generator is an agent-run lifecycle skill (not CI), tolerant of members not checked out locally (AC6/AC7). |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-06-23 | — |
