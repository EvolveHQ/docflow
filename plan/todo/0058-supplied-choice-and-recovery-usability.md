# 0058 — Reuse supplied choices and current authority (D2)

Owning decision: adr/0054-reuse-supplied-choices-and-current-authority.md.

## Status

- **Claimed by:** Codex, task_b2132a3cb8c3 / ctx_06d7b40b0d52, 2026-09-15, branch `kmox83/docflow-v1-workspace-skills`.
- **Blockers:** None for bounded implementation. Final-main completion remains outside this dispatch.
- **Stopped:**

## Scope

Treat applicable supplied answers as answers, including assessment depth; when every material choice is supplied, proceed after summarising it. When depth or material choices are missing, retain the existing selector and recommended defaults protocol. This narrows the always-show-selector rule for already answered requests only; a repository preference alone is not a supplied current answer. Existing compatible grants are checked and reused; absent, expired, conflicting or denied authority blocks the dependent action. Fresh sessions derive owner, branch, blockers and next action from native state and distinguish prepared completion from checked integration.

Own this package's product files, native records and necessary separate gate commits. The coordinator owns integration into `kmox83/docflow-v1-integration`; no self-merge, main, tag, public publication or version bump. Preserve prior evidence and single-writer ownership.

## Dependencies

Reviewed W1/W2 integration `9f748b806e9ab8eb8985e05d437f5c5f356dd248`; PR7 receipts and current-source probes.

## Exit criteria

1. Owning decision criterion 1: Current-source probes and PR7 evidence paths document the reason and scope of every changed existing skill; unchanged workflows and trigger descriptions are preserved.
2. Owning decision criterion 2: The six assessment-bearing skills reuse supplied depth and choices while preserving questions for material missing/conflicting input.
3. Owning decision criterion 3: Positive fully supplied/current-grant and negative missing/expired/conflicting cases have explicit expected actions and evidence limits; deterministic checks are not described as host qualification.
4. Owning decision criterion 4: Orientation recovers native owner/branch/blocker/next action and reports prepared/ready/integrated states without claiming shipped-main from an unmerged branch.
5. Owning decision criterion 5: Static and deterministic gates pass, exact product source and deferred native behavioural cases are recorded.

Keep the item todo and decision Accepted pending the actual main completion event. A review-ready task PR against the review integration branch is not shipped main. Record verified source, PR and exact results in the package receipt before settlement.

