---
adr: 0014
title: Concurrency guardrails for ADR and plan creation
status: Implemented
date: 2026-06-02
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0001", "0006", "0010", "0013"]
tags: [workflow, concurrency, numbering]
---

# ADR 0014 — Concurrency guardrails for ADR and plan creation

## Context

Contiguous, zero-padded ADR numbering (adr/0001-adr-driven-workflow.md)
treats "the next number" as a globally-shared mutable counter chosen at
**authoring time**. Two parallel actors (worktrees, branches, independent
PRs, two humans) each compute `max+1` against their own view and pick the
same number — a collision surfaces at merge.
adr/0010-worktree-conflict-reconciliation.md reserves number blocks for an
orchestrated `agent-wave` run, but unorchestrated concurrency is still
exposed.

We considered changing the **identity mechanism** instead — making a
kebab slug the cross-reference key, or a short opaque id, or assigning the
number by a merge-time rewrite. Each was **rejected**: a mutable slug as
the key just moves the instability from creation (number collision) to
mutation (renaming a slug breaks every reference); opaque ids and
merge-time rewrites add machinery and reduce readability. The contiguous
number is the right identity — short, ordered, immutable once assigned.
The collision is a **coordination** problem, so we solve it with process
guardrails and keep the numbering scheme unchanged.

A sibling hazard is **duplicate effort**: an unclaimed `plan/todo` item on
`main` — which G1 deliberately places there — can be picked up by two
writers at once. That is a work-assignment race, not a numbering one, but
the same coordination discipline (a visible claim) addresses it (G4).

## Capability statement

docflow protects contiguous ADR/plan numbering under concurrent authoring
with **process guardrails**, not a numbering-mechanism change. Two
guardrails:

- **G1 — decide before do (recommended, not enforced).** Prefer to merge
  an ADR and its plan items to `main` before implementation work begins,
  so implementation branches start from a `main` that already carries the
  numbered ADR. This is guidance — G2 and G3 are the actual safety, so
  authoring an ADR and implementing it in one change stays allowed.
- **G2 — check before merge.** Before integrating, the agent syncs
  (fetch / rebase) onto the current `main` and runs the collision check
  (`audit`). If its ADR number or plan slot now clashes with what has
  landed on `main`, it **renumbers locally, before merging** — resolving
  the conflict proactively instead of discovering it at the gate. This is
  the primary defence.
- **G3 — gate backstop.** The integration point (fast-forward or PR merge
  — adr/0006-integration-model.md) is single-threaded; it **rejects** a
  duplicate number as the last line of defence, and the later author
  renumbers (a local, trivial change — a new ADR references its own number
  only in its file and the INDEX row).
- **G4 — claim before do.** Before implementing a queued item, **claim it**
  — a draft PR referencing it (the authoritative lock in PR/worktree
  repos), or an `owner` / `_agent/IN_FLIGHT.md` entry — so two writers do
  not build the same thing. G1–G3 protect the *number*; G4 protects the
  *work assignment*. `audit`'s duplicate-plan-ownership check (check 11) is
  the backstop.

The guardrails are **pre-wired conditionally**: `bootstrap` writes them
into a repo's `CONVENTIONS.md` (and an `AGENTS.md` hard-rule bullet) only
when the repo is multi-agent (mode 2/3) **or** PR-based; single-agent
direct-to-main repos, which have no race by construction, omit them. The
concurrency consideration is documented for all repos. `audit`'s
duplicate-number check across branches/worktrees is what G2 runs before
merging and G3 enforces at the gate.

## User stories / scenarios

- As a maintainer of a multi-agent repo, I want ADR numbers to never
  collide across parallel branches, without adopting ugly identifiers.
- As a single-agent maintainer, I want none of this ceremony — my repo
  has no race.
- As a reader, I want ADR numbers to stay short, ordered, and stable.

## Acceptance criteria

1. `bootstrap` conditionally writes a "Concurrency guardrails" block to
   `CONVENTIONS.md` + an `AGENTS.md` hard-rule bullet **iff** the repo is
   multi-agent (mode 2/3) or PR-based; it is omitted otherwise.
2. The block states **G1** (recommended: ADR + plan items merge to `main`
   before implementation work — guidance, in `CONVENTIONS.md`), **G2**
   (before integrating, sync onto `main` and run the collision check;
   renumber locally before merging), and **G3** (the merge gate rejects a
   duplicate as the backstop). G2/G3 are the enforced part (the
   `AGENTS.md` hard-rule bullet); G1 is guidance.
3. The integration step (autonomous prompt / `agent-wave`) performs the G2
   pre-merge sync-and-check before integrating.
4. `audit`'s duplicate-ADR-number check across branches/worktrees is what
   G2 runs pre-merge and G3 enforces at the gate (extends check 11).
5. `USAGE.md` documents the concurrency consideration and the guardrails
   for all repos.
6. The numbering **identity is unchanged** — the contiguous number remains
   the stable cross-reference key; no slug/opaque-id mechanism is
   introduced.
7. The guardrails block includes **G4 (claim before do)**: claim a queued
   item (draft PR / `IN_FLIGHT` / `owner`) before implementing it, so two
   writers do not duplicate effort on an unclaimed `plan/todo` item;
   `audit`'s duplicate-plan-ownership check is the backstop.

## Out of scope

- Any numbering-mechanism change (slug-as-identity, opaque ids,
  merge-time number rewrite) — considered and rejected (see Context).
- Plan-slot reservation and single-writer rules for worktrees — already
  decided in adr/0010-worktree-conflict-reconciliation.md.

## Open questions

- None.

## References / cross-links

- adr/0001-adr-driven-workflow.md (numbering this protects)
- adr/0006-integration-model.md (the merge gate that confirms the number)
- adr/0010-worktree-conflict-reconciliation.md (orchestrated instance of the same idea)
- adr/0013-interactive-assessment-protocol.md (bootstrap offers it via assessment)

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-02 | r1 | Eugenio Minardi | Initial decision. Process guardrails for concurrent ADR/plan numbering; mechanism alternatives (slug/opaque-id/merge-rewrite) considered and rejected. |
| 2026-06-02 | r2 | Eugenio Minardi | Implemented (plan items 0007, 0008): conditional guardrails in templates + bootstrap/agent-wave/audit, docs in USAGE + site. Status Accepted → Implemented. |
| 2026-06-28 | r3 | Eugenio Minardi | Added G4 (claim before do): claim a queued item before implementing so two writers don't duplicate effort on an unclaimed plan/todo item; added to the §Concurrency Guardrails block + AGENTS hard-rule bullet. Extends scope from numbering to work-assignment. Stays Implemented. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-06-02 | — |
