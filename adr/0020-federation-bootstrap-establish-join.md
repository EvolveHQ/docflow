---
adr: 0020
title: Federation bootstrap — establish vs join
status: Proposed
date: 2026-06-22
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0019", "0013", "0003"]
tags: [bootstrap, multirepo, assessment]
---

# ADR 0020 — Federation bootstrap — establish vs join

## Context

Bootstrap runs **per repo** and cannot see the other repos in a product.
A naive "ask the topology every time" flow lets several repos each decide
they are the home repo, corrupting the federation. The flow must
distinguish the repo that **establishes** a federation from every later
repo that **joins** an existing one.

This extends the assessment-driven flow
(adr/0013-interactive-assessment-protocol.md) and the retrofit path
(adr/0003-backfill-retrofit.md) with a federation branch. A settled
constraint from design: a joining repo's bootstrap must **never write to
another repo** — it touches only itself.

## Capability statement

Bootstrap's assessment gains a federation branch: *"Is this repo part of
a product that spans multiple repos?"* → *"Establishing a new federation,
or joining an existing one?"*

- **Establish**: asks the topology (adr/0019-multirepo-topology.md),
  designates this repo as the federation root/home where applicable, and
  creates the authoritative member index
  (adr/0023-federation-config-membership-index.md).
- **Join**: asks for the home/federation pointer, writes **only** this
  repo's own back-pointer config, and inherits the federation's recorded
  topology without re-asking it.

## User stories / scenarios

- As the first maintainer, I establish the federation and pick the
  topology once.
- As a maintainer adding the third repo, I join the existing federation
  and am not asked to re-choose the topology.
- As a security-conscious operator, I know bootstrap never needs write
  access to a second repo.

## Acceptance criteria

1. Bootstrap asks whether the repo spans multiple repos; answering "no"
   leaves single-repo behaviour unchanged.
2. Answering "yes" prompts **establish vs join**.
3. **Establish** prompts the topology, marks this repo as home (for
   topologies that have one), and creates the member index.
4. **Join** prompts for the home/federation pointer and writes a
   back-pointer config in **this repo only**, performing no writes to any
   other repo.
5. **Join** does not re-ask the topology; it reads the topology recorded
   for the federation.

## Out of scope

- The on-disk format of the back-pointer config and member index —
  adr/0023-federation-config-membership-index.md.
- Reconciling index ↔ back-pointer consistency —
  adr/0028-cross-repo-audit.md.
- Migrating a joining repo's pre-existing ADRs into the federation (v1
  keeps them local).

## Open questions

- How the join step validates the home pointer without cross-repo read
  access — manual confirmation only, or an optional org/host API check.

## References / cross-links

- adr/0019-multirepo-topology.md
- adr/0013-interactive-assessment-protocol.md
- adr/0003-backfill-retrofit.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-22 | r1 | Eugenio Minardi | Initial draft. Establish-vs-join bootstrap branch; joining repos write only their own back-pointer, never cross-repo. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
