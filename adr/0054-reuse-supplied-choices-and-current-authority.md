---
adr: 0054
title: Reuse supplied choices and current authority
status: Accepted
date: 2026-09-15
owner: Codex, dispatched single Docflow writer
supersedes:
superseded-by:
depends-on: ["0013","0031","0039","0042","0052"]
tags: [v1, d2]
---

# ADR 0054 — Reuse supplied choices and current authority

## Context

Parent document 14 D2 requests bounded fixes based on PR7 evidence and current probes. The current assessment selector repeats even a fully supplied depth; new-plan repeats its owning-decision question after assessment. PR7 receipts retain real permission denial, stopped-run recovery and an OpenCode reporting-only follow-up; these establish outcome and recovery limits, not proof of a repeated-question host failure. This decision records the authorised answer-reuse refinement without changing old acceptance criteria or fabricating host results.

## Capability statement

Treat applicable supplied answers as answers, including assessment depth; when every material choice is supplied, proceed after summarising it. When depth or material choices are missing, retain the existing selector and recommended defaults protocol. This narrows the always-show-selector rule for already answered requests only; a repository preference alone is not a supplied current answer. Existing compatible grants are checked and reused; absent, expired, conflicting or denied authority blocks the dependent action. Fresh sessions derive owner, branch, blockers and next action from native state and distinguish prepared completion from checked integration.

## User stories / scenarios

- An operator supplies complete choices and avoids answering them again.
- A session with expired authority reads context but does not execute dependent work.
- A new session recovers the exact owner and branch from a stopped item.

## Acceptance criteria

1. Current-source probes and PR7 evidence paths document the reason and scope of every changed existing skill; unchanged workflows and trigger descriptions are preserved.
2. The six assessment-bearing skills reuse supplied depth and choices while preserving questions for material missing/conflicting input.
3. Positive fully supplied/current-grant and negative missing/expired/conflicting cases have explicit expected actions and evidence limits; deterministic checks are not described as host qualification.
4. Orientation recovers native owner/branch/blocker/next action and reports prepared/ready/integrated states without claiming shipped-main from an unmerged branch.
5. Static and deterministic gates pass, exact product source and deferred native behavioural cases are recorded.

## Out of scope

Broad skill rewrites, automatic approval, native host qualification, altered member completion rules, rewritten historical approvals or test receipts.

## Open questions

None blocking the bounded implementation; qualification remains separately queued.

## References

- adr/0013-interactive-assessment-protocol.md
- adr/0031-tiered-assessment-depth.md
- adr/0039-plan-item-carries-its-own-status.md
- evals/hosts/results/2026-09-14-release-verification.json
- Parent DocflowHQ docs/14-docflow-clarity-v1-delivery-plan.md, revision 0.15.
- Operator dispatch task_b2132a3cb8c3 / ctx_06d7b40b0d52, 2026-09-15.
- plan/todo/0058-supplied-choice-and-recovery-usability.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-09-15 | r1 | Codex | Record authorised D2 scope and bounded defaults before implementation. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Development mandate | Operator instruction recorded by Codex | 2026-09-15 | Current dispatch authorises agreed V1 implementation and signed task PR; no human signature, merge or release attestation asserted. |

