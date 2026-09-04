---
adr: 0043
title: Persisted reports carry Status at a glance — pull-request bodies, wave summaries, stop entries
status: Proposed
date: 2026-09-04
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0041", "0006", "0038", "0039"]
tags: [reporting, integration, agent-wave, plan]
---

# ADR 0043 — Persisted reports carry Status at a glance — pull-request bodies, wave summaries, stop entries

## Context

A report given in conversation is gone when the conversation ends.
Three artefacts outlive it and are read by exactly the people the
reporting convention
(adr/0041-status-at-a-glance-reporting-convention.md) serves. Under
pull-request integration (adr/0006-integration-model.md) the
pull-request body is what a reviewer reads before merging, and since
claims are pull requests
(adr/0038-in-flight-state-derived-from-branches-and-pull-requests.md)
it is also the visible unit of in-flight work. An orchestrated wave
returns a summary that the operator reads at a checkpoint, often long
after the subagents' own messages scrolled away. A plan item's stop
entry (adr/0039-plan-item-carries-its-own-status.md) is what the human
who resumes an unattended run reads first. Today none of these has a
required shape, so the achieved-and-missing signal lives only in the
chat transcript, where the returning human cannot see it.

## Capability statement

Where a report outlives the conversation, it carries the block:

- **Pull-request bodies.** In a pull-request-based repository the
  autonomous run prompt writes the pull-request body from its report,
  ending with the block, and marks the request ready for review only
  when the block is present. Reviewers read achieved and missing
  before they merge.
- **Wave summaries.** `agent-wave` requires the block from every
  subagent's final report and returns one block per item plus one
  block for the wave; checkpoint mode presents that summary, and
  continuous mode includes it in the run's report.
- **Stop entries.** The Stopped field of a plan item's status section
  uses the three labels in miniature, so the reason a run stopped is
  read as what was done, what state the item is in, and what is
  missing, next to the acceptance criteria it was working against.

Audit checks the persisted forms it can reach: in a pull-request-based
repository with a reachable pull-request host, an open pull request
from a claim branch without the block is flagged as drift, and the
view is reported as unverifiable, never as passing, when the host is
unreachable; a Stopped entry without the three labels is flagged in
any repository with a plan folder. Direct-to-main repositories have no
pull-request body; their completion commit follows the git contract
unchanged.

Alternative considered: requiring the block in conversation only.
Rejected, because the conversation is gone when the human returns, and
the persisted artefacts are where "what is missing" matters most.

## User stories / scenarios

- As a reviewer, I open a pull request and its last section tells me
  what the run achieved, its verified state, and what it left undone.
- As an operator at a wave checkpoint, I see one block per item and
  one for the wave, and decide whether to launch the next wave from
  that alone.
- As a human resuming a stopped item, the Stopped entry reads as a
  status at a glance, not as a bare reason.
- As an auditor, I flag the open pull request and the stop entry that
  lack the block, and I say "unverifiable" when I cannot reach the
  host.

## Acceptance criteria

1. The autonomous run prompt's pull-request integration step writes
   the pull-request body from the run's report, ending with the block,
   and marks the request ready only when the block is present.
2. `agent-wave`'s spawn brief requires the block from each subagent's
   final report, and its collection step returns one block per item
   plus one wave-level block; checkpoint mode presents that summary.
3. The Stopped field of a plan item's status section carries the three
   labels, and `plan/README.md` documents that shape.
4. Audit flags an open pull request from a claim branch that lacks the
   block as drift when the pull-request host is reachable, reports the
   check as unverifiable when it is not, and flags a Stopped entry
   without the three labels.
5. `USAGE.md` and `docs/` document the three persisted forms and the
   direct-to-main case.

## Out of scope

- The convention and its scaffold placement —
  adr/0041-status-at-a-glance-reporting-convention.md.
- Skills' own closing messages —
  adr/0042-skills-end-every-run-with-status-at-a-glance.md.
- Commit-message format — each repository's git contract.
- Squash-merge commit bodies; whether a host copies the pull-request
  body into the merge commit is the host's behaviour.

## Open questions

- None.

## References

- adr/0041-status-at-a-glance-reporting-convention.md
- adr/0006-integration-model.md
- adr/0038-in-flight-state-derived-from-branches-and-pull-requests.md
- adr/0039-plan-item-carries-its-own-status.md
- adr/0042-skills-end-every-run-with-status-at-a-glance.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-09-04 | r1 | Eugenio Minardi | Initial draft (Proposed), from the approved brainstorm: pull-request bodies, wave summaries, and plan-item stop entries carry the block; audit checks the reachable forms and reports unverifiable otherwise. Conversation-only reporting considered and rejected. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
