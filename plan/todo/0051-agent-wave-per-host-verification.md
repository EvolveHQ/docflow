# 0051 — Verify agent-wave per host; record observed rungs

Owning ADR: adr/0015-multi-target-portability.md (r5 — reopened
Implemented → Accepted on landing, → Implemented on ship; AC5's
"bootstrap plus one lifecycle skill" extends to agent-wave)

## Scope

Operator-authorised independent Docker runs of the real vendor hosts,
plus interactive checks where the host requires them. Record failures and
unperformed checks honestly; do not replace a missing observation with an
assumption. The operator expanded PR #5 to fix findings these runs expose.

1. **On Claude Cowork, pi, Codex, OpenCode.** Install per README;
   bootstrap a throwaway repo in separate-worktrees mode with a gate
   that passes the initial fresh-checkout probe but needs an unavailable
   dependency after implementation, to exercise blocked-at-verify; queue two items; run agent-wave at express depth.
   Record: the selection mechanism used (structured tool or A/B/C);
   the rung derived and whether the host in fact exposes a subagent or
   orchestration facility; whether the executor could sign and push
   the claim commit under that host's permissions; whether the
   pull-request CLI exists; the branches and blocks produced; whether
   non-SKILL files in skill directories are tolerated on the npm path
   and the symlinked discovery.
2. **On Claude Code.** One rung-1 run under a real opt-in and one
   rung-2 run with the subagent tool's worktree isolation, in a session
   without bypassed permissions, recording whether executors could
   commit and push without per-agent prompts.
3. **README.** Replace every "assumed, verify" row with the observed
   row; 0015 records the runs.

Fixes exposed by these runs are included in the operator-authorised PR #5
scope. Unperformed host capabilities remain pending rather than inferred.

## Exit criteria

1. Four host rows observed and recorded; the Claude Code rung-1 and
   rung-2 runs recorded. → AC5 (extended)
2. README rows carry no "assumed, verify" marker.
3. ADR 0015 r5 row present; INDEX regenerated; verify gate green.

When its full criteria are verified, append the next substantive revision
and return ADR 0015 to Implemented.

## Dependencies

- Plan 0049 (the skill under test) — sequential; plan 0050 may run in
  parallel with the host runs.

## Status

- **Claimed by:** Codex, 2026-09-11, `kmox83/0040-claim-by-branch` (PR #5; operator-authorised expanded scope).
- **Blockers:** pi/GitHub Copilot GPT-4.1 failed the supplied bootstrap choices twice; Cowork's cloud connector denied target .git writes. Signed remote pushes and delegated rungs are not yet observed.
- **Stopped:**

## Remaining release evidence

Also retains ADR 0012 in Accepted until the outstanding full behavioural
release matrix is executed. Independent Docker receipts cover scoped runs;
the deterministic runner's skipped cases are not a release pass.

## Observed and pending

Bootstrap/new-adr: Claude Code, Codex and OpenCode passed independent file/Git
checks. Cowork passed target files/gate and its exported bundle matched all
14 tracked target files, but the connector denied target .git writes. pi's
Copilot GPT-4.1 configuration failed twice; saved Anthropic and OpenAI logins
could not refresh, and other advertised Copilot models were unavailable.

Claude Code rung 3 passed the final wave, including independent plan/ADR
numbers and held-claim exclusion. Codex passed nested-root migration and the
whole-wave environment-stop case. OpenCode's original stop case failed; its
rerun was rejected by the provider (HTTP 400 prompt_cache_key) before acting.

Next: refresh pi's supported provider login and rerun; recheck OpenCode's
stop path once its provider accepts requests; verify a Cowork runtime with
target Git capability; then execute signed-push and delegated-rung checks
and the full release matrix. None of these is inferred from install parity.
