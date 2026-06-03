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

ADRs 0010–0014 Implemented; **0015 Accepted** (multi-target portability —
docs shipped, verification pending). 0002/0008 Superseded. Plan items
0001–0009 shipped.

## Next item

`plan/todo/0010-multi-target-verification.md` (ADR 0015) — run `bootstrap`
+ a lifecycle skill on Codex, OpenCode, and Cowork and record the result.
**Blocked** on access to those installs (operator-run; not runnable from a
Claude Code session). When it ships, ADR 0015 → Implemented.
