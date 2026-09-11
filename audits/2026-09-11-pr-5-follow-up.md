# PR #5 audit follow-up — 2026-09-11

Original findings: [frozen audit](2026-09-11-pr-5-and-project.md), against
`a6a1d45`. Product fixes are at `b7d3048`; detailed source/model/image receipts
are in [the Docker results](../evals/hosts/results/2026-09-11.json).

| Finding | Result and reason |
|---|---|
| R1: wrong branch in single/shared PR modes | Fixed: use the actual work branch; shared PR waves are refused. Those modes never created an exclusive claim ref. |
| R2: non-exclusive claims | Fixed: empty expected-tip lease **and** new-ref porcelain proof; leased deletion preserves concurrently advanced work. Real Git race tests cover both. |
| R3/R4: false orphan/stale findings | Fixed: resolve ready-PR completion moves and use each mode's ownership evidence. Remote-ref absence says nothing about shared locks. |
| R5: inconsistent draft timing | Fixed: draft immediately after successful claim publication, before implementation; continuations reuse it. |
| G1: weak behavioural evidence | Added actual vendor-host Docker tests, independent file/Git assertions and report validation. Exit zero alone failed to detect pi's errors. |
| G2: repository drift | Migrated legacy coordination into item status; adopted PR-only integration, required `verify` CI and standard merge commits. History remains in git/done. |
| G3: assumed host capabilities | Added capability-based execution and observed results. Whole-wave environment-stop failure exposed by OpenCode was clarified and verified on Codex. Full host verification remains open. |

Cowork: the signed-in desktop generated the requested target files; the gate
passed. Its cloud connector denied target `.git` writes. The exported bundle
verified and all 14 tracked files matched the target, but this proves no
target-folder Git integration.

Next: plan 0051 retains pi login/retest, OpenCode provider/retest, Cowork target
Git, signed-push/delegation checks and the full behavioural release matrix.
Other queue completion moves are prepared on this PR; none is reported shipped
before merge. No release or merge was performed.

## Status at a glance

- **This run:** static gate passed; `verify mutations: OK (15 rejected mutations)`, exit 0; deterministic evals `5 passed, 0 failed, 6 skipped`, exit 0. Final wave, migration and expected-blocker assertions passed. Sanitised receipts retain earlier failures. All five containers were archived and removed; tmpfs authentication was discarded.
- **Overall:** partially verified — the fixes and checked-PR setup are prepared; host/release evidence remains incomplete.
- **Yet to do:** plan 0051's explicit host checks; review and authorised merge of PR #5.
