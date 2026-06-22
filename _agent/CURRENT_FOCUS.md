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

Multi-repo federation, foundation + identity tier **Implemented**: ADRs
**0019/0020/0023** (commit 69fca8b — topology, establish/join, config +
member index) and **0021/0022** (commit e01cd96 — federated identity
scheme + cross-repo references). Earlier: ADRs 0010–0014 Implemented; 0015
Accepted (multi-target portability — verification pending). 0002/0008
Superseded.

## Next item

Multi-repo follow-on, all **Proposed**: 0024 roll-up catalogue (both deps
now Implemented — the natural next accept), then 0025/0026 plan+status,
0027 propagation, 0028 cross-repo audit (also carries the deferred
unreachable-reference detection). Still open:
`plan/todo/0010-multi-target-verification.md` (ADR 0015) — bootstrap
behavioural run on Codex, plus OpenCode/Cowork.
