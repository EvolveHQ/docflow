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

A product repository commits **at most one concise receipt per plan item**.
The receipt is the Status at a glance block plus the exact command(s) run,
each exit code, content hashes (source revision, package or artifact digests)
and links. Committing raw run transcripts, logs, JSON dumps, archives,
screenshots or long verification narratives is forbidden. Raw evidence lives
outside the repository and is referenced by content hash and location; when it
is unavailable, the receipt states that explicitly. Pre-existing committed
audits are removed only by a separate bounded item that resolves every
reference first.

## User stories / scenarios

- As a maintainer, I want each plan item's committed evidence to fit on one
  screen, so a diff stays reviewable.
- As an adopter, I want the product repository to contain only product and
  method files, never another team's run output.
- As an auditor, I want raw evidence referenced by hash, so I can tell what
  was verified without carrying the transcript in the repository.

## Acceptance criteria

1. A plan item's committed evidence is a single receipt containing the Status
   at a glance block plus the exact command(s), exit code(s), content hashes
   and links; it contains no pasted transcript and no second evidence file.
2. The receipt adds no raw run transcript, log, JSON dump, archive, screenshot
   or long verification narrative, and no new file under an audit directory.
3. Raw evidence is retained outside the repository and referenced by content
   hash and location; when raw evidence is unavailable, the receipt says so.
4. `CONVENTIONS.md` states the same bound, listing the forbidden artifact
   kinds, consistently with this ADR.
5. Removing a pre-existing committed audit is a separate bounded item that
   enumerates and resolves every reference before deletion; it is never a bulk
   delete inside an unrelated change.

## Out of scope

- Relocating or removing the audits already committed before this decision.
- Automatic enforcement in the verify gate; a static check is a later,
  separately decided change.
- Rewriting history to strip artifacts from earlier commits.
- Non-product repositories, which may hold their own evidence by local rule.

## Open questions

None.

## References

- adr/0011-static-skill-validation.md
- adr/0012-skill-behavioural-evals.md
- adr/0041-status-at-a-glance-reporting-convention.md
- adr/0043-persisted-reports-carry-status-at-a-glance.md
- adr/0050-repository-changes-integrate-through-checked-pull-requests.md
- plan/todo/0068-bound-verification-evidence.md
- Operator policy update, 2026-09-16.

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-09-16 | r1 | pi | Record the operator's evidence-bounding policy before implementation. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Development mandate | Operator policy recorded by pi | 2026-09-16 | Bounded committed evidence authorised; pre-existing audit relocation and automatic enforcement remain separate. |
