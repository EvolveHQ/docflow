---
adr: 0028
title: Cross-repo audit
status: Implemented
date: 2026-06-22
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0022", "0023", "0024"]
tags: [multirepo, audit]
---

# ADR 0028 — Cross-repo audit

## Context

The audit capability checks one repo: contiguous numbering, INDEX sync,
plan coverage, cross-reference resolution, cross-worktree collisions. A
federation introduces failure modes that span repos — a member listed in
the index with no back-pointer, an identity collision, a dangling
cross-repo reference, a stale roll-up. Audit must reach across the
federation to catch them. The membership check is **bidirectional** by
design: the member index and the per-repo back-pointers must agree.

## Capability statement

The audit capability gains **cross-repo checks**: bidirectional membership
consistency (member index ↔ back-pointer configs), cross-repo identity
collisions, dangling cross-repo references, and roll-up drift — reported on
the same punch-list, with mechanical fixes offered where safe.

## User stories / scenarios

- As a maintainer, audit tells me a repo is in the member index but never
  bootstrapped to point back home.
- As a maintainer, audit tells me a repo points at this home but is missing
  from the index.
- As an auditor, I catch a cross-repo identity collision or a dangling
  cross-repo reference before it misleads a reader.

## Acceptance criteria

1. Audit flags any repo listed in the home member index that lacks a
   back-pointer to that home.
2. Audit flags any repo whose back-pointer names a home that does not list
   it in the index.
3. Audit detects cross-repo identity collisions
   (adr/0021-cross-repo-identity-numbering.md).
4. Audit detects dangling cross-repo references — a target ADR that does
   not exist (adr/0022-cross-repo-reference-scheme.md).
5. Audit detects roll-up drift — the roll-up out of sync with member
   `INDEX.md` metadata (adr/0024-federated-rollup-catalogue.md).
6. Audit reaches sibling repos via the **local checkouts** named in the
   member index, **tolerant** of members not available: an unreachable
   member is reported as **unverified this run** (so its checks are not
   silently passed), not a hard failure — consistent with the roll-up
   skill (adr/0024-federated-rollup-catalogue.md).

## Out of scope

- Automatically repairing drift beyond the existing mechanical-fix offer.

## Open questions

- None. (Resolved on acceptance: audit reaches siblings via local checkouts
  named in the member index, tolerant of unavailable members — see AC6,
  consistent with the roll-up skill.)

## References / cross-links

- adr/0022-cross-repo-reference-scheme.md
- adr/0023-federation-config-membership-index.md
- adr/0024-federated-rollup-catalogue.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-22 | r1 | Eugenio Minardi | Initial draft. Cross-repo audit checks: bidirectional membership, identity collisions, dangling references, roll-up drift. |
| 2026-06-23 | r2 | Eugenio Minardi | Accepted. Resolved open question: audit reaches siblings via local checkouts named in the member index, tolerant of unavailable members reported as "unverified this run" (AC6), consistent with 0024. |
| 2026-06-23 | r3 | Eugenio Minardi | Implemented (commit 5884a5f): audit check 12 — bidirectional membership, identity collisions, dangling cross-repo references, roll-up drift, tolerant reach. Closes the deferred dangling-ref detection from 0022. Verified structurally (no member repos in the dogfood repo). |
| 2026-06-23 | r4 | Eugenio Minardi | Resolution hardening (plan 0026): made check 12 executable after an assessment found AC3/AC4 goal-stated only — identity-collision check now targets a duplicate `repo-id`; dangling-reference check resolves along `repo-id → Pointer → adr/NNNN-*.md` before the existence test. Stays Implemented. |
| 2026-06-23 | r5 | Eugenio Minardi | Consistency fix: check 12 now runs from the index-holding repo (`central`\|`home`\|`coordinator`), not only `home`, and the membership check is role-agnostic — required by the topology A/B/C differentiation (0019). Stays Implemented. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-06-23 | — |
