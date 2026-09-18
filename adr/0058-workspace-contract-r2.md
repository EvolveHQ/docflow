---
adr: 0058
title: Workspace contract revision 2 — external sources, remote members, revision existence, derived documents and imported history
status: Accepted
date: 2026-09-18
owner: pi, docflow-v1 delivery
supersedes:
superseded-by:
depends-on: ["0051", "0052", "0053"]
tags: [workspace, contract, schema]
---

# ADR 0058 — Workspace contract revision 2 — external sources, remote members, revision existence, derived documents and imported history

## Context

Adopting workspace format 1 exposed six contract gaps. A knowledge item
cannot cite a document that lives outside Git and outside the machine; a
repository that exists only as a remote cannot be registered because a local
`path` and an instructions file are mandatory; the validator checks that a
native file exists but not that the cited revision ever contained it; a derived
documentation set has no input kind separate from canonical memory; execution
history that happened under a native mandate cannot be recorded because runs
bind a current grant and claim; and nothing groups work into a product-wide
backlog. The operator accepted this revision up front so Docflow and its
Clarity consumer can move together. Format 1 remains readable: every change is
additive or a documented tightening.

## Capability statement

Format 1 gains five additive rules and one explicit boundary. A knowledge
source may be a **content-addressed external source** — locator, `sha256`
digest, observer and UTC observation time — validated without any local Git
root, alongside the existing native evidence. A registry member may be a
**remote-only reference**: identity, aliases, a remote URL and
`role: reference`, with no local path or instructions; native references to it
are identity-only and its actions stay non-mutating. Where a member has a local
Git object store, a cited native revision must **contain the exact regular
file** at that revision, and the check fails closed when it does not; a member
without a local Git object store remains existence-only and never claims
revision verification. `sources.yaml` may register a **derived documentation
set** as an external content-addressed input that is never vendored into
canonical memory. A run may be an **imported-evidence record** that backfills
execution history without a workspace grant and that can never satisfy a
grant-bound dispatch, claim or completion check. **Backlog grouping is out of
the contract**: it is a consumer/product concern, with no schema or validator
change.

## User stories / scenarios

- As an adopter, I want to cite an external specification by digest, so a
  document outside Git is first-class knowledge.
- As an adopter, I want to register a repository I only consume remotely, so I
  can reference it without inventing a local checkout.
- As an auditor, I want a cited revision proved to contain the file, so a
  revision that never held it cannot pass as evidence.
- As an adopter, I want to register a derived documentation set as an input
  without copying it into canonical memory.
- As an adopter, I want to backfill real execution history read-only, so
  historic native mandates are recorded without fabricating workspace
  authority.
- As a consumer, I want backlog grouping left to me, so the portable contract
  stays about records, not product roadmaps.

## Acceptance criteria

1. `knowledge.sources` accepts either the existing native evidence or a
   content-addressed external source with `locator`, `sha256` `digest`,
   `observer` and `observed_at`, validated without a local Git root; a bad or
   missing digest is rejected.
2. A registry member with `role: reference` and a remote URL but no `path` or
   `instructions` validates; native references to it are identity-only; a
   mutating grant action against it is rejected; a remote-only entry with
   `role: delivery` is rejected.
3. For a member with a local Git object store, a cited native revision that does
   not contain the exact regular file at that revision produces a diagnostic and
   fails the workspace; a revision that contains it passes; a member without a
   local Git object store stays existence-only.
4. `sources.yaml` accepts a derived-documentation registration with an external
   locator and digest, never vendored; a locator resolving inside the workspace
   is rejected as a vendored input.
5. A run with an imported-evidence form validates without a workspace brief or
   grant; an imported run can never satisfy a grant-bound dispatch, an active
   work-state check or a claim/resource overlap; a run with both a brief and an
   import is rejected.
6. Backlog grouping is stated as out of the contract, with no schema or
   validator change.
7. The three shipped product descriptions advertise all thirteen skills, and all
   manifests keep version 0.9.4.
8. Deterministic valid and adverse controls cover every new rule; the static
   gate and deterministic evals pass with gate changes separate from judged
   files.

## Out of scope

- Clarity's Rust reader, which mirrors this contract in its own repository.
- Backlog/roadmap grouping, left to the consumer.
- Native host qualification and the operator pilot.
- Changing the existing native evidence, grant, claim or asset contracts beyond
  the additive rules above.

## Open questions

None.

## References

- adr/0051-portable-workspace-memory-contract.md
- adr/0052-workspace-authority-and-attempt-records.md
- adr/0053-portable-workspace-operating-skills.md
- plan/todo/0070-workspace-contract-r2.md
- DocflowHQ idea `review-the-portable-workspace-contract` (adopter findings,
  selected 2026-09-18).

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-09-18 | r1 | pi | Record the operator's up-front acceptance of workspace contract revision 2 before implementation. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Development mandate | Eugenio Minardi | 2026-09-18 | accepted up front via the workspace controller session |
