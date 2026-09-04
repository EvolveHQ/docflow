---
adr: 0045
title: The wave specification is the contract between the orchestrator and the executor
status: Proposed
date: 2026-09-04
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0010", "0014", "0034", "0035", "0038", "0039", "0041", "0043"]
tags: [agent-wave, coordination, contract, reporting]
---

# ADR 0045 — The wave specification is the contract between the orchestrator and the executor

## Context

agent-wave hands each subagent a brief that is one sentence — the
item, the run prompt to follow, and "report back a structured result"
— with no shape for the result and no rules for what an executor may
and may not do. Results are therefore not comparable across runs or
hosts, a missing report reads as a shrug rather than as an unknown,
and every coordination and reporting decision since has added a clause
to the brief without a place to put it: the claim
(adr/0038-in-flight-state-derived-from-branches-and-pull-requests.md),
the status section
(adr/0039-plan-item-carries-its-own-status.md), and the closing block
(adr/0043-persisted-reports-carry-status-at-a-glance.md).

Hosts differ in what they can enforce. One can force a schema-shaped
result and isolate each executor; another can only run a prompt and
read prose. If the brief and the result are fixed once, in one place,
every execution mechanism consumes the same contract, the orchestrator
normalises results honestly, and nothing shipped has to encode a host.

## Capability statement

Before executing, the orchestrator fills a **wave specification** with
fixed fields, and every execution mechanism consumes it unchanged:

- **Integration branch and base.** The branch the completion event
  names, and its remote tip after a fetch, quoted in every brief.
- **Items.** Each with its **item key** — the queue file name without
  extension — the **claim variant of the recorded mode** (a branch
  `claim/<item-key>` in separate-worktrees mode; the Claimed-by field
  plus lock rows in a shared checkout), the **reserved block** with the
  sequence each number belongs to (the algorithm is
  adr/0010-worktree-conflict-reconciliation.md's), the **owned
  artefacts**, and a **continue** flag. A brief carrying the other
  mode's claim variant is malformed and the wave does not start.
- **Isolation.** Its own checkout per executor in separate-worktrees
  mode; the shared tree otherwise.
- **Integration profile.** The recorded model, or the override the
  operator confirmed.
- **Grant line.** "Attended wave: the operator confirmed these
  parameters and this item on <date>; implement only the named item,
  never pick another." It overrides the run prompt's pick step.
- **The canonical brief.** *Open*: confirm the base is an ancestor of
  the checkout and the item file exists there, else return blocked
  "base mismatch"; a continued item instead confirms the checkout tip
  equals the remote claim tip. *Orient* per the run prompt. *Claim*:
  fetch; an existing claim branch for the item whose tip is not an
  ancestor of the integration branch means blocked "claimed by
  <branch>"; otherwise create `claim/<item-key>` from the base, fill
  Claimed by, make the claim commit — which states the reserved block,
  the owned artefacts, and the wave's name — and only then push with
  upstream tracking. A branch is never pushed before its claim commit
  exists, so a second push to the same name with divergent history is
  rejected by the remote and the claim is git-exclusive; a signing or
  push failure surfaces here, before any implementation is spent. In a
  shared checkout: a lock row for every file the item edits and for
  every record it will create, and Claimed by committed with the work.
  *Implement*. *Verify*: run the recorded gate exactly as written; fix
  and re-run on failure; if the gate cannot run in this checkout,
  install nothing the command does not install itself, never bypass,
  commit and push the work, fill Blockers with the exact failure line,
  and return blocked — never verified, never shipped. *Commit* with a
  Conventional Commit and the Rationale footer where an ADR is
  touched. *Integrate per profile*: under direct-to-main, stop after
  the push and return ready — the orchestrator integrates
  (adr/0046-serialised-integration-under-direct-to-main.md); under
  pull-request integration, sync onto the integration branch, run the
  collision check, renumber own files only, commit the completion
  changes on the branch — the plan move with a footer naming the pull
  request, the status section removed, the owning record advanced,
  the index regenerated — write the pull-request body from the report
  ending with the block, mark ready only when the block is present,
  request the merge and wait for it to land; on a conflict or
  rejection repeat fetch, rebase, regenerate the index, collision
  check, gate, push at most twice, then return failed "integration
  branch moved"; return shipped only after the merge is confirmed.
  *Never* ask the operator; *never* renumber or insert ahead of an
  existing queue item or another executor's reserved slot; *never*
  version-bump, tag, or publish; *never* accept or supersede a
  decision record. On a stop condition, write Stopped in the three
  labels, commit, push, return stopped. End every report with the
  Status at a glance block. Run-prompt steps are referenced by title,
  never by number.
- **Result fields.** An **outcome** from a closed vocabulary —
  shipped, ready, failed, blocked, stopped, unknown — which is distinct
  from the block's Overall
  (adr/0041-status-at-a-glance-reporting-convention.md); the claim
  branch; the integration reference; identifiers used and any
  renumbering; the blocker; conflict files; the final block verbatim.
  No return means unknown. Any unknown caps the wave's Overall at
  partially verified.
- **Budget.** Items or waves. The soft hours cap is read from the
  shell clock when the first wave starts and after each wave returns:
  no wave starts past it, a wave in progress is never cut short, and
  "not enforced" is reported where no clock is available. The host's
  token budget and concurrency ceiling are reported and never
  converted into items or waves.
- **Stop conditions.** The existing list, plus: the host's budget or
  ceiling reached (every unreported item is unknown); a
  gate-environment blocker, which is systemic and ends the run; an
  owning record that is not Accepted. Stopped and unknown outcomes
  count toward the failure threshold. A conflict confined to the
  generated index never counts toward "repeated merge conflicts".

Where the host forces a shaped result, the result fields are the
schema. Where it does not, executors end with labelled lines and the
orchestrator parses them. No coordination file is written in any
phase. The wave block's shape is
adr/0043-persisted-reports-carry-status-at-a-glance.md's.

## User stories / scenarios

- As an orchestrator, I fill one specification and hand it to
  whatever runs the wave; the results come back in one shape whether a
  host forced it or an executor typed it.
- As an executor, my brief tells me exactly what I may do, what I
  must never do, and what to return when I cannot finish.
- As an operator, a missing report shows as unknown and caps the
  wave's verdict; nothing rounds up.
- As a second claimant, my push is rejected before I implement
  anything, because the claim commit was pushed first.
- As a reviewer of a pull-request repository, the completion changes
  are in the pull request I merge, not in a commit that has no route
  to the integration branch.

## Acceptance criteria

1. agent-wave's declare step lists every field above, and a wave does
   not start with a missing field or a claim variant that does not
   match the recorded mode.
2. The canonical brief is stated once, in agent-wave, and every
   execution mechanism receives it unchanged.
3. The claim step commits Claimed by before any push, treats an
   existing claim branch whose tip is not an ancestor of the
   integration branch as live, and relies on the remote's rejection
   of divergent pushes as the exclusion.
4. The verify step never bypasses the recorded gate; when the gate
   cannot run, the work is committed and pushed and the outcome is
   blocked with the exact failure line.
5. Direct-to-main briefs return ready after the push; pull-request
   briefs carry the completion changes in the pull request, mark
   ready only with the block present, retry at most twice on a
   conflict, and return shipped only after the merge is confirmed.
6. Results are normalised as stated: no return is unknown, any
   unknown caps the wave's Overall at partially verified, and the
   outcome vocabulary is distinct from Overall.
7. The hours cap is checked between waves only and reported as not
   enforced where no clock exists; host limits are reported, never
   converted.
8. The brief forbids renumbering or inserting ahead of queue items,
   version bumps, tags, publication, and accepting or superseding a
   decision record.
9. Briefs reference run-prompt steps by title, and the run-prompt
   template carries a comment listing the titles a brief may name.

## Out of scope

- The reservation algorithm and the single-writer rule —
  adr/0010-worktree-conflict-reconciliation.md.
- How the orchestrator integrates under direct-to-main —
  adr/0046-serialised-integration-under-direct-to-main.md.
- Which mechanism executes the specification —
  adr/0047-agent-wave-adapts-to-host-orchestration-capability.md.
- Classification and resume — adr/0048-wave-resumes-by-replanning-from-git.md.
- The wave block's shape and the Overall vocabulary —
  adr/0043-persisted-reports-carry-status-at-a-glance.md and
  adr/0041-status-at-a-glance-reporting-convention.md.

## Open questions

- Whether queue items should declare how many records they will
  author. Draft position: no; the default is one number per kind per
  authoring item, and a declared count is a later refinement.

## References

- adr/0010-worktree-conflict-reconciliation.md
- adr/0014-concurrency-guardrails.md
- adr/0034-adr-shape-as-declared-metadata.md
- adr/0035-range-numbered-catalogue-migration.md
- adr/0038-in-flight-state-derived-from-branches-and-pull-requests.md
- adr/0039-plan-item-carries-its-own-status.md
- adr/0041-status-at-a-glance-reporting-convention.md
- adr/0043-persisted-reports-carry-status-at-a-glance.md
- adr/0046-serialised-integration-under-direct-to-main.md
- adr/0047-agent-wave-adapts-to-host-orchestration-capability.md
- adr/0048-wave-resumes-by-replanning-from-git.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-09-04 | r1 | Eugenio Minardi | Initial draft (Proposed), from the approved two-round brainstorm: fixed specification fields, the canonical brief with its claim-before-push invariant and gate-cannot-run rule, per-profile integration including the pull-request retry loop, normalised result fields with an outcome vocabulary distinct from Overall, budget and stop rules. Unshaped results, shipped schemas, in-primitive wave loops, and budget conversion considered and rejected. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
