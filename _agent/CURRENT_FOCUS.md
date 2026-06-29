# Current Focus

This file is the LIVE SNAPSHOT of any in-flight session. It is short on
purpose — the durable record lives in git (`git log`),
`_agent/WORKLOG.md`, and `plan/done/`. The queued work lives in
`plan/todo/`.

If status files and git disagree, git is authoritative; correct this
file.

> **Released 0.9.3** (tag v0.9.3; `@evolvehq/docflow@0.9.3` on npm) — backlog
> (0016/0017/0018), seed ADR (0029), coordination revisions + G4, numbering
> clarification, multi-target verified (0015 Implemented), new logo/theme.
> main and npm in sync. Catalogue all-Implemented (or Superseded); plan queue empty.

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

**Assessment remediation complete** (plan 0025/0026/0027, commits dab737c /
dd79d06 / 8f87bae): the adversarial review's one FAIL and the PARTIALs are
closed — 0019 topology A/B/C now genuinely differentiated (re-Implemented),
cross-repo resolution operationalised (0021/0022/0028), and the join /
roll-up-filename / artefact-root prose corrected (0020/0023/0024). All
federation ADRs honestly match the skills. **Unreleased** (still 0.9.1 on
npm; a 0.9.2 patch would carry these fixes).

## Next item

**Backlog cleared** (2026-06-23): ADRs **0016** (layered artifact model,
commit 2a837a7), **0017** (configurable artifact root, 5895168), and
**0018** (WIP-stays-out docs, c1c441e) all Implemented. Federation
(0019–0028) Implemented and released in **0.9.2** (main and npm in sync;
post-0.9.2 backlog work is unreleased — a 0.9.3 would carry it).

**One item remains, operator-blocked:**
`plan/todo/0010-multi-target-verification.md` (ADR 0015, still Accepted).
AC5 needs behavioural `bootstrap`+`new-adr` runs on **real Codex, OpenCode,
and Cowork** installs — not runnable from here. A Claude Code smoke-run
(= the Cowork plugin artefact) passed and is logged in the item, with
turnkey operator steps for the three; Codex install verified per ADR 0015
r3. Ships when the three real-agent runs are recorded.

The coordination tier (0025–0027) is now **behaviourally verified** too
(2026-06-29): a two-repo smoke test exercised per-repo plan ownership, the
derived aggregate-status column ("1 of 2 repos"), and convention-drift
detection — all passed. No soft verification caveats remain on the
federation; only the multi-target item (0010) stays operator-blocked.
