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

`plan/todo/0010-multi-target-verification.md` (ADR 0015). **Codex
packaging verified** (restructured to `plugins/docflow/`; `marketplace
add` → `plugin add docflow@evolvehq` installs all 8 skills — ADR 0015 r3).
Remaining: a behavioural `bootstrap` run on Codex, plus OpenCode and
Cowork verification. When 0010 ships, ADR 0015 → Implemented.
