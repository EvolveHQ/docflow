---
adr: 0052
title: Workspace authority and attempt records
status: Accepted
date: 2026-09-15
owner: Codex, dispatched Docflow foundations writer
supersedes:
superseded-by:
depends-on: ["0051"]
tags: [workspace, authority, evidence]
---

# ADR 0052 — Workspace authority and attempt records

## Context

The approved W1/W2 scope separates priority, agreement, authority, native
ownership and evidence. A selected idea, accepted agreement, named role or
successful attempt cannot authorise a delivery or close a parent outcome.
Document 14 revision 0.15 and the 15 September development instruction
authorise this record and its deterministic foundation, without changing
the native member controls or creating a scheduler.

## Capability statement

A work record owns versioned delivery scopes and grants. Each grant binds
actor, delivery, scope revision, actions/effects, approver's durable mandate,
conditions, start/expiry and stopping point. Revision history distinguishes
active, suspended, revoked and closed authority. Current authority is
rechecked at action boundaries and cannot be inferred from a copied brief.
Existing exact authority is recorded and reused without a repeated ceremony.

A run owns a bounded brief, native claim observations, actions and a separate
receipt. It binds workspace/member source revisions, exact grant revision,
dependencies and resources. No native claim mechanism means owner-confirmed
serial execution, evidenced in the member's shared home; an unconfirmed
assignment stops. Neither expiry nor silence proves a previous actor stopped.
Reassignment requires a reconciled predecessor and fresh compatible authority.
Revocation prevents subsequent actions, preserves prior results, and leaves
in-flight/unknown outcomes visible. Grants are cooperative records, not
authentication, credentials or host permission enforcement.

Routine defaults implement document 09's proposed grant/work/run states,
UTC timestamped histories, half-open execution/resource intervals, exact
source-bound evidence and explicit dependency checks. Read-only reference
members cannot receive mutating assignments. Done requires every required
delivery's native completion evidence and every work criterion; one run's
success is insufficient. Static checks establish consistency of supplied
records, never independent proof that their claims actually happened.

## User stories / scenarios

- A coordinator reuses a current grant when the same actor resumes.
- A replacement waits for reconciliation when a worker's outcome is unknown.
- A completed provider and blocked consumer remain partial delivery.

## Acceptance criteria

1. Templates and schema keep grants, briefs, native claims, receipts,
   evidence, resource reservations and predecessor/successor links distinct.
2. Valid two-repository fixtures represent selection, grant, dispatch,
   interruption, reconciliation/reassignment, revocation and partial completion.
3. Adverse controls reject absent/stale/revoked/expired authority, changed
   actor/scope, unsupported actions, missing/conflicting claims and unresolved
   predecessor ownership; no authority follows from role or selection.
4. Overlapping repository ownership or shared exclusive resources, unmet
   dependencies and invalid transition history fail deterministic validation.
5. Missing, failed, skipped, stale or mismatched evidence cannot prove required
   completion; a valid completed workspace work item keeps its agreement accepted.
6. Reporting and handoff instructions state the limits of deterministic
   checks and identify native host/Clarity/full V1 qualification as outstanding.

## Out of scope

- Authenticating approvers, instantaneous revocation, a distributed lock,
  scheduling, automatic dispatch, native launch or independent attestation.
- Implementing W3/W4, changing native member rules or merging this task.

## Open questions

- None blocking the bounded foundation; native environments remain for later qualification.

## References

- adr/0051-portable-workspace-memory-contract.md
- Parent DocflowHQ docs/09-docflow-workspace-concept-and-design.md, sections 5–8.
- Parent DocflowHQ docs/14-docflow-clarity-v1-delivery-plan.md, revision 0.15, W1/W2.
- Operator development instruction, 2026-09-15; Orca task task_bdc6fa916a05.
- plan/todo/0054-workspace-foundations.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-09-15 | r1 | Codex | Record the approved separation of authority, ownership and evidence with routine scoped validation defaults; implementation pending. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Operator | Eugenio Minardi | 2026-09-15 | Recorded prior choices and current bounded development instruction; no invented signature, independent review or merge/release approval. |
