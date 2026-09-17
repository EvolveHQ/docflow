---
adr: 0057
title: Bounded verification evidence in the product repository
status: Accepted
date: 2026-09-16
owner: pi, docflow-v1 delivery
supersedes:
superseded-by:
depends-on: ["0011", "0012", "0043"]
tags: [process, verification, evidence]
---

# ADR 0057 — Bounded verification evidence in the product repository

## Context

Verification runs produce raw transcripts, logs, JSON dumps, archives and
screenshots. Committing them into the product repository makes the package and
its history carry run artefacts that no adopter needs, grows unreviewable
diffs, and lets a stale dump be mistaken for the current state. The operator
directive of 2026-09-16 bounds what a product repository may commit. Plan
items and the persisted-report convention already require a Status at a glance
close-out; this decision makes that the whole committed evidence.

## Capability statement

A product repository commits **at most one concise receipt per plan item**,
held in the plan item and repeated in its pull-request body. The receipt is the
Status at a glance block plus the exact command(s) run, each exit code, content
hashes (source revision, package or artifact digests) and links. Committing raw
run transcripts, logs, JSON dumps, archives, screenshots or long verification
narratives is forbidden. The product repository commits **no audit directory**:
nothing under `audits/` is added, modified, moved, restored or referenced by
any change. External or historical evidence lives outside the repository in the
workspace archive at `DocflowHQ/.docflow_workspace/local/archive/member-audits/`
and is referenced by content hash; when it is unavailable, the receipt states
that explicitly. The audit material committed before this decision is removed by
plan 0069 and is never repointed to.

## User stories / scenarios

- As a maintainer, I want each plan item's committed evidence to fit on one
  screen, so a diff stays reviewable.
- As an adopter, I want the product repository to contain only product and
  method files, never another team's run output.
- As an auditor, I want raw evidence referenced by hash, so I can tell what
  was verified without carrying the transcript in the repository.

## Acceptance criteria

1. A plan item's committed evidence is a single receipt, inside the plan item
   and repeated in the pull-request body, containing the Status at a glance
   block plus the exact command(s), exit code(s), content hashes and links; it
   contains no pasted transcript and no separate evidence file.
2. No change adds a raw run transcript, log, JSON dump, archive, screenshot or
   long verification narrative.
3. The product repository commits no audit directory: no `audits/` file is
   added, modified, moved, restored or referenced by any change.
4. External or historical evidence is referenced by content hash and the
   workspace archive location
   `DocflowHQ/.docflow_workspace/local/archive/member-audits/`; when raw
   evidence is unavailable, the receipt says so.
5. `CONVENTIONS.md` states the same bound, listing the forbidden artifact
   kinds, consistently with this ADR.
6. The audit material committed before this decision is removed by plan 0069,
   which also clears every reference to it; that removal never rides along in
   an unrelated change.

## Out of scope

- Automatic enforcement in the verify gate; a static check is a later,
  separately decided change.
- Rewriting history to strip artifacts from earlier commits.
- Non-product repositories, which may hold their own evidence by local rule.
- Clarity's own archive layout, beyond the member-audits location above.

## Open questions

None.

## References

- adr/0011-static-skill-validation.md
- adr/0012-skill-behavioural-evals.md
- adr/0041-status-at-a-glance-reporting-convention.md
- adr/0043-persisted-reports-carry-status-at-a-glance.md
- adr/0050-repository-changes-integrate-through-checked-pull-requests.md
- plan/todo/0068-bound-verification-evidence.md
- plan/todo/0069-audit-reference-repair.md
- Operator policy update, 2026-09-16; operator follow-up, 2026-09-16 (zero
  committed audit files; archive at
  `DocflowHQ/.docflow_workspace/local/archive/member-audits/`).

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-09-16 | r1 | pi | Record the operator's evidence-bounding policy before implementation. |
| 2026-09-16 | r2 | pi | Strengthen to zero committed audit files: the receipt lives in the plan item and PR body; nothing under `audits/` is added, modified, moved, restored or referenced; external evidence is referenced by content hash to the workspace archive. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Development mandate | Operator policy recorded by pi | 2026-09-16 | Bounded committed evidence authorised; pre-existing audit relocation and automatic enforcement remain separate. |
| Development mandate | Operator follow-up recorded by pi | 2026-09-16 | Zero committed audit files; the workspace archive is the only home for raw and historical audit material. |
