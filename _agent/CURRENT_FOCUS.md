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

Multi-repo federation, foundation → audit backstop **Implemented**: ADRs
**0019/0020/0023** (69fca8b — topology, establish/join, config + member
index), **0021/0022** (e01cd96 — identity + cross-repo references),
**0024** (f6d07db — new `rollup` skill), and **0028** (5884a5f — audit
check 12, cross-repo federation checks). 9 skills total. Earlier: ADRs
0010–0014 Implemented; 0015 Accepted (multi-target portability —
verification pending). 0002/0008 Superseded. **Released 0.9.1** (tag
v0.9.1; published `@evolvehq/docflow@0.9.1` to npm — 0.9.0 + a docs
refresh for federation/rollup/five-agent surfaces).

## Next item

Remaining multi-repo coordination tier, all **Proposed**: 0025 (cross-repo
plan ownership), 0026 (cross-repo status + completion), 0027 (convention &
template propagation) — each still carries an open question. Still open:
`plan/todo/0010-multi-target-verification.md` (ADR 0015) — bootstrap
behavioural run on Codex, plus OpenCode/Cowork.
