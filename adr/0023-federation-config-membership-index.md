---
adr: 0023
title: Federation config and membership index
status: Proposed
date: 2026-06-22
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0017", "0019", "0020"]
tags: [conventions, multirepo, bootstrap, footprint]
---

# ADR 0023 — Federation config and membership index

## Context

A federation needs to be described on disk so lifecycle skills can answer
two questions: *"what is my home?"* (from any member) and *"which repos
are in this product?"* (from the home). Because bootstrap cannot reach
across repos and auto-discovery needs an org/host API, membership is
**declared**, not derived.

A settled design point: the per-repo config is a **back-pointer**, not the
enumeration — nothing can derive the full member set without already
knowing it, so the authoritative enumeration must live in the home repo.
This extends adr/0017-configurable-artifact-root.md for path resolution.

## Capability statement

A federation is described by two artefacts:

- **Per-repo back-pointer config** — a small committed file in each member
  repo naming the product and the home/federation pointer.
- **Home-repo member index** — an authoritative file in the home repo
  enumerating the member repos.

The member index is **hand-maintained**: adding a member is a deliberate
edit in the home repo. Per-repo configs are written only by that repo's
own bootstrap. No lifecycle skill writes across repos to update either.

## User stories / scenarios

- As a member repo's lifecycle skill, I read the back-pointer to find my
  home.
- As a home-repo skill, I read the member index to enumerate the product's
  repos.
- As a maintainer adding a repo, I make one deliberate edit to the member
  index rather than relying on a silent cross-repo write.

## Acceptance criteria

1. Each member repo commits a small config file declaring the product and
   the home/federation pointer.
2. The home repo holds an authoritative member index enumerating the
   member repos.
3. The member index is hand-maintained; no lifecycle skill writes across
   repos to update it (adding a member is an explicit home-repo edit).
4. The config file location honours the configured artefact root
   (adr/0017-configurable-artifact-root.md).
5. Together the two artefacts answer "what is my home?" from any member
   and "which repos are in this product?" from the home.

## Out of scope

- The bidirectional consistency check between the two artefacts —
  adr/0028-cross-repo-audit.md.
- Auto-discovery of sibling repos — explicitly **not** in v1.

## Open questions

- The file format (small YAML/JSON/Markdown) and the exact field names.

## References / cross-links

- adr/0017-configurable-artifact-root.md
- adr/0019-multirepo-topology.md
- adr/0020-federation-bootstrap-establish-join.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-22 | r1 | Eugenio Minardi | Initial draft. Per-repo back-pointer config plus hand-maintained authoritative member index in the home repo; no cross-repo writes. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
