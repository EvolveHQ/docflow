# Current Focus

This file is the LIVE SNAPSHOT of any in-flight session. It is short on
purpose — the durable record lives in git (`git log`),
`_agent/WORKLOG.md`, and `plan/done/`. The queued work lives in
`plan/todo/`.

If status files and git disagree, git is authoritative; correct this
file.

> **Released 0.9.4** (tag v0.9.4; `@evolvehq/docflow@0.9.4` on npm).
> `main` is the development line again (ADR 0044): the candidate
> branches `v1/aligned-autonomy` and `v1/agent-loop-graph` are archived
> unmerged. `main` is pushed and tracks `origin/main`; the 2026-09-04
> session recorded sixteen ADRs (0034–0049) and fifteen queued items,
> and the queue is now being developed one item at a time through
> reviewed PRs. This file is retired by plan 0042 when it ships; until
> then it is kept current.

## Active state

- **Branch:** main, tracking `origin/main` (PRs #1 to #3 merged).
- **Active item:** plan 0039 (shipped record derived: retire the worklog) — dispatched to a Codex worker in an Orca child worktree; closes with a PR.
- **Blockers:** none.
- **Uncommitted work:** none.

## Last shipped

- **2026-09-05 — plan 0038, coordination contracts** (PR #3, merge d6df7df): ADR 0036 → Implemented.
- **2026-09-05 — plan 0037, legacy range migration** (PR #2, merge ce41a34): ADR 0035 → Implemented.
- **2026-09-04 — plan 0036, shape by field** (PR #1, merge 35a933c): ADR 0034 → Implemented.
- **2026-09-04 — plan 0046, return to main** (acd3eed / a1b0813):
  ADR 0044 recorded at Implemented. Same day, without a ship: ADRs
  0034–0043 and 0045–0049 authored (Proposed), the new-plan numbering
  defect fixed (00daf05), ADR 0005 superseded by 0036.
- **2026-07-03 — plans 0033, 0035, 0034** (fc158bc, 37a1798, 3f1611e):
  depth tiers, artefact-root discovery, lifecycle tier adoption; then
  release 0.9.4 (ffd0b4e).

## Next item

1. **Per item:** accept the owning ADR (delegated), dispatch an Opus 5
   worker in an Orca child worktree from `main`, review its PR, ship on
   merge. ADRs 0034–0036 Implemented, 0037 Accepted; 0038–0043
   and 0045–0049 still Proposed, accepted as their items come up.
2. **Merges** have used GitHub's merge button (a merge commit on `main`);
   the recorded contract is fast-forward only — reconcile by decision.
3. **Ship the queue in order**, 0039 → 0051 (0036–0038 shipped): shape-by-field (0036,
   0037), coordination directory (0038–0042), Status at a glance
   (0043–0045), agent-wave (0047–0051). Every item edits shared files;
   none of it runs as a wave.

Unqueued ideas from the 2026-07-02 review (prose-drift detection;
executable acceptance criteria) remain in this file's git history.
