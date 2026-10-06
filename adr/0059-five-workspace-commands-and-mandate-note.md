---
adr: 0059
title: Five workspace commands and a committed operator mandate note
status: Accepted
date: 2026-09-18
owner: pi, docflow-v1 delivery
supersedes: ["0053"]
superseded-by:
depends-on: ["0051", "0052", "0054"]
tags: [workspace, skills, authority]
---

# ADR 0059 — Five workspace commands and a committed operator mandate note

## Context

Adopting the portable workspace exposed a command set that was hard to read and
did too much per command. `workspace-orient` mixed reading with recovery;
`workspace-plan` shared a name with the repository `new-plan` skill and its
scope; `workspace-coordinate` both dispatched and reconciled; and there was no
command that maintained delivery state from checked native evidence. There was
also no workspace-home form for the operator mandate that authorises a decision
acceptance or a grant, so authority was cited from chat rather than a committed
record. The operator accepted this restructuring up front so Docflow and its
Clarity consumer can move together. This decision supersedes the skill set and
coordinate split recorded in adr/0053; its unchanged authority and
never-writes rules are carried forward verbatim below.

## Capability statement

The workspace ships **five** commands, named by their directories:
`workspace-setup` (create or adopt a home, unchanged), `workspace-status`
(read-only briefing and fresh-session recovery, formerly orient, never writes),
`workspace-scope` (ideas, decisions, work outcomes, deliveries, criteria,
grants and recommendations, formerly plan; disjoint from `new-plan`), and the
split `workspace-dispatch` (check the current grant, native claim, dependencies
and resources, write a bounded brief, hand off) and `workspace-sync` (reconcile
returned receipts, observe member state read-only, update delivery observations
and criteria evidence only from checked native evidence, and refresh INDEX;
works whether or not the workspace dispatched the work). A new workspace-home
form, the **operator mandate note**, is committed at
`.docflow_workspace/mandates/<YYYY-MM-DD>-<slug>.md`, recording who, when, the
exact scope and what is authorised or accepted; decision acceptances and grants
cite it as source-bound evidence by home path and revision. A chat message
alone never counts. A prepared pull request or an unmerged plan/done file never
marks a delivery complete.

## User stories / scenarios

- As an adopter, I want five plainly-named commands, so reading, scoping,
  dispatching and syncing are each obvious.
- As an operator, I want my mandate committed as a dated note, so authority is
  evidence, not a chat message.
- As a maintainer, I want delivery state maintained from checked native
  evidence even when another workspace dispatched the work.
- As an auditor, I want a prepared pull request never mistaken for a shipped
  delivery.

## Acceptance criteria

1. Exactly five workspace skill directories exist with the invocation names
   `workspace-setup`, `workspace-status`, `workspace-scope`,
   `workspace-dispatch` and `workspace-sync`; the names `workspace-orient`,
   `workspace-plan` and `workspace-coordinate` are gone.
2. `workspace-status` never writes; `workspace-scope` records decision
   acceptance and grants from a committed mandate note and its trigger is
   disjoint from `new-plan`; `workspace-dispatch` checks grant, claim,
   dependencies and resources before writing a brief; `workspace-sync`
   reconciles returns and maintenance and never completes a delivery from a
   prepared pull request or an unmerged plan/done file.
3. A mandate note at `.docflow_workspace/mandates/<date>-<slug>.md` validates;
   `decisions.acceptance.mandate` and grants cite it as source-bound evidence
   (home, path, revision); a chat message alone fails as unsourced.
4. Both marketplaces, the three manifests, the declarative sidecars,
   `README.md`, `USAGE.md`, `docs/`, the workspace guides, `CONTRACT.md`, the
   asset README and the templates advertise fourteen skills and the five-name
   workspace set; versions stay 0.9.4 and five-target parity holds.
5. Static and deterministic gates pass, including skill parity,
   trigger-disjointness and the new sync and mandate controls.
6. adr/0053 is superseded with reciprocal metadata and INDEX is regenerated.

## Out of scope

- Re-running the PR #20 native qualification; that runs later on these bytes.
- Clarity's Rust reader mirroring the mandate note; tracked separately.
- Changing native repository plan/todo semantics or the lifecycle skills.
- Any release, tag or version bump.

## Open questions

None.

## References

- adr/0051-portable-workspace-memory-contract.md
- adr/0052-workspace-authority-and-attempt-records.md
- adr/0053-portable-workspace-operating-skills.md (superseded)
- adr/0054-reuse-supplied-choices-and-current-authority.md
- plan/todo/0071-workspace-commands-and-mandate-note.md
- Operator decision, 2026-09-18, accepted up front via the workspace controller.

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-09-18 | r1 | pi | Record the operator's up-front acceptance of the five-command restructure and the committed mandate note before implementation. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Development mandate | Eugenio Minardi | 2026-09-18 | accepted up front via the workspace controller |
