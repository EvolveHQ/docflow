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

Multi-repo federation foundation (commit 69fca8b): ADRs **0019/0020/0023
Implemented** — bootstrap now asks the topology (A/B/C, default C),
branches establish/join, and writes `federation.md` + `federation-index.md`.
Earlier: ADRs 0010–0014 Implemented; 0015 Accepted (multi-target
portability — verification pending). 0002/0008 Superseded.

## Next item

Multi-repo follow-on, all **Proposed**: 0021 cross-repo identity/numbering
and 0022 references are the next tier (they carry the open mechanism
questions); then 0024 roll-up, 0025/0026 plan+status, 0027 propagation,
0028 cross-repo audit. Also still open: `plan/todo/0010-multi-target-verification.md`
(ADR 0015) — bootstrap behavioural run on Codex, plus OpenCode/Cowork.
