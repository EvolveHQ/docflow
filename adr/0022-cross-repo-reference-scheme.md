---
adr: 0022
title: Cross-repo reference scheme
status: Accepted
date: 2026-06-22
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0021", "0023"]
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

Cross-repo references use the **logical federation identity**
(adr/0021-cross-repo-identity-numbering.md) and resolve through the
**member index**, which maps `repo-id → location`. References therefore
**survive a target repo move** (edit one index row, not every link).
**Same-repo references stay relative paths**, unchanged. `supersedes:` and
`superseded-by:` linkage may point across repos. When the target repo is
not checked out, the reference stays well-formed and audit flags it as
unreachable.

## User stories / scenarios

- As an author, I cross-link an ADR in another repo and the link stays
  valid regardless of where each repo is checked out.
- As a maintainer, I supersede a member-local ADR from the home repo and
  both ends of the link are well-formed.
- As an auditor, I can detect a cross-repo reference whose target no
  longer exists.

## Acceptance criteria

1. A reference to an ADR in another repo uses the logical federation
   identity and resolves through the member index (`repo-id → location`),
   not a bare relative path.
2. Same-repo references remain relative paths and are unchanged.
3. `supersedes:` / `superseded-by:` metadata may point across repos.
4. The reference survives a target repo move/rename by updating the
   member-index row, with no edit to the referencing ADRs.
5. When the target repo is not checked out locally, the reference stays
   well-formed and audit (adr/0028-cross-repo-audit.md) flags it
   unreachable rather than treating it as malformed.

## Out of scope

- How identities are minted — adr/0021-cross-repo-identity-numbering.md.
- Generating the aggregated index —
  adr/0024-federated-rollup-catalogue.md.

## Open questions

- None. (Resolved on acceptance: a logical id resolved against the member
  index; an uncheckedout target stays well-formed and audit flags it
  unreachable — see AC1, AC5.)

## References / cross-links

- adr/0021-cross-repo-identity-numbering.md
- adr/0023-federation-config-membership-index.md
- CONVENTIONS.md (relative-path cross-reference rule, revised for
  cross-repo edges)

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-22 | r1 | Eugenio Minardi | Initial draft. Repo-qualified cross-repo references; local links stay relative; cross-repo supersede/deprecate. |
| 2026-06-22 | r2 | Eugenio Minardi | Accepted. Resolved open question: logical id resolved via the member index, surviving repo moves; uncheckedout target flagged unreachable by audit (AC1/AC4/AC5). Added depends-on 0023. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-06-22 | — |
