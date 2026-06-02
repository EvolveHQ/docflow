# Current Focus

This file is the LIVE SNAPSHOT of any in-flight session. It is short on
purpose — the durable record lives in git (`git log`),
`_agent/WORKLOG.md`, and `plan/done/`. The queued work lives in
`plan/todo/`.

If status files and git disagree, git is authoritative; correct this
file.

## Active state

- **Branch:** main
- **Active item:** none — no work in flight.
- **Blockers:** none.
- **Uncommitted work:** none.

## Last shipped

ADRs 0010–0013 all Implemented (0013 supersedes 0002); plan items
0001–0006 shipped to `plan/done/`. **Queue empty** — no work in flight.

## Next item

`plan/todo/` is empty. The next hand-authored ADR or new plan item runs
next. The interactive skills now run a Step 0.5 assessment (ADR 0013).
Gates: `npm run verify` (static); `Workflow evals/behavioural.workflow.mjs`
(subagent behavioural evals).
