---
adr: 0022
title: Cross-repo reference scheme
status: Proposed
date: 2026-06-22
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0021"]
tags: [conventions, multirepo, references]
---

# ADR 0022 — Cross-repo reference scheme

## Context

`CONVENTIONS.md` links ADRs by relative path (`adr/NNNN-*.md`). That path
resolves only within one repo; across a federation it breaks. Supersede
and deprecate edges may also need to cross repo boundaries (a home-repo
ADR superseding a member-local one). References need a stable form that
survives the repo boundary while leaving same-repo links untouched.

## Capability statement

Cross-repo references use a **stable, repo-qualified identifier** built on
the federation identity (adr/0021-cross-repo-identity-numbering.md);
**same-repo references stay relative paths**, unchanged. `supersedes:` and
`superseded-by:` linkage may point across repos.

## User stories / scenarios

- As an author, I cross-link an ADR in another repo and the link stays
  valid regardless of where each repo is checked out.
- As a maintainer, I supersede a member-local ADR from the home repo and
  both ends of the link are well-formed.
- As an auditor, I can detect a cross-repo reference whose target no
  longer exists.

## Acceptance criteria

1. A reference to an ADR in another repo resolves via a stable
   repo-qualified identifier, not a bare relative path.
2. Same-repo references remain relative paths and are unchanged.
3. `supersedes:` / `superseded-by:` metadata may point across repos.
4. The reference form survives a target repo move/rename via the
   configured identity, or the limitation is documented.
5. The scheme exposes enough information for audit
   (adr/0028-cross-repo-audit.md) to flag a dangling cross-repo
   reference.

## Out of scope

- How identities are minted — adr/0021-cross-repo-identity-numbering.md.
- Generating the aggregated index —
  adr/0024-federated-rollup-catalogue.md.

## Open questions

- Whether the reference is a resolvable URL or a logical id resolved
  against the member index, and how it resolves when the target repo is
  not checked out locally.

## References / cross-links

- adr/0021-cross-repo-identity-numbering.md
- CONVENTIONS.md (relative-path cross-reference rule, revised for
  cross-repo edges)

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-22 | r1 | Eugenio Minardi | Initial draft. Repo-qualified cross-repo references; local links stay relative; cross-repo supersede/deprecate. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
