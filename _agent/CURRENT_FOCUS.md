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

ADRs 0010, 0011, 0012 all Implemented; plan items 0001–0004 shipped to
`plan/done/`. **Queue empty** — no work in flight.

## Next item

`plan/todo/` is empty. The next hand-authored ADR or `/new-plan` item
runs next. Behavioural evals: `Workflow evals/behavioural.workflow.mjs`
(subagent runner) as a release gate; `npm run evals` for the deterministic
self-check.
