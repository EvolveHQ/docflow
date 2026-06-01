# In Flight

Cross-worktree dashboard. One row per active worktree. Updated by the
agent owning the worktree when it opens, and removed when the worktree
closes (PR merged or abandoned).

Useful when several agents work in separate worktrees / PR branches —
this file replaces the single-checkout `_agent/CURRENT_FOCUS.md` as
the shared "what's happening right now" view. `CURRENT_FOCUS.md` is
gitignored under this mode and stays local to each worktree.

If this file disagrees with reality, reality wins — check
`git worktree list` and the live PRs, then correct here.

The **Reserved IDs** column records the disjoint block of ADR numbers /
`plan/todo` slots an agent may create this wave (assigned by `agent-wave`
before spawning), so two worktrees never claim the same next number. The
**Owns** column names the ADR(s) / plan item(s) that worktree is the
single writer of — no other worktree edits those artefacts until the row
clears.

| Agent | Worktree branch | Queue item | Reserved IDs | Owns | Started (ISO-8601) | PR link |
|-------|-----------------|------------|--------------|------|---------------------|---------|
