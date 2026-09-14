# 0051 — Verify agent-wave per host; record observed rungs

Owning ADR: adr/0015-multi-target-portability.md (r5 — reopened
Implemented → Accepted on landing, → Implemented on ship; AC5's
"bootstrap plus one lifecycle skill" extends to agent-wave)

## Scope

Operator-authorised independent Docker runs of the real vendor hosts,
plus interactive checks where the host requires them. Record failures and
unperformed checks honestly; do not replace a missing observation with an
assumption. PR #5 merged on 2026-09-13. The operator explicitly resumed this
item in a new dedicated worktree and authorised necessary fixes and PR #6.

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

Fixes exposed by these runs are included in the operator-authorised scope
of PR #6. Unperformed host capabilities remain pending rather than inferred.

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

- **Claimed by:** Codex (Orca worker, dispatch `ctx_92a3bae7230f`), 2026-09-13, `kmox83/0051-host-verification-astra` ([PR #6](https://github.com/EvolveHQ/docflow/pull/6); resumed for the operator's pi provider correction).
- **Blockers:** Full native-high Pi wave acceptance remains unmet: the positive control repeated generation before work; the corrective blocked run passed stop-flow checks but omitted the actual claim branch from its initial commit. Cowork needs the operator to unlock Windows and bring Claude Desktop forward: supported input returned `window_not_focused`, no new prompt ran, and the displayed usage reset does not establish runtime readiness. Actual target Git, installation/discovery, bootstrap/lifecycle and wave checks remain unverified; the earlier cloud connector denied target .git writes. Pi's local route needs no cloud login.
- **Stopped:** 2026-09-14 UTC — bounded continuation evidence prepared on PR #6; Pi complete-contract and Cowork foreground/actual-target acceptance remain unmet. All owned continuation containers archived and removed after independent review; no further native attempt authorised in this continuation.

## Remaining release evidence

Also retains ADR 0012 in Accepted until the outstanding full behavioural
release matrix is executed. Independent Docker receipts cover scoped runs;
the deterministic runner's skipped cases are not a release pass.

## Historical failures retained

Bootstrap/new-adr: Claude Code, Codex and OpenCode passed independent file/Git
checks. Cowork passed target files/gate and its exported bundle matched all
14 tracked target files, but the connector denied target .git writes. pi's
Copilot GPT-4.1 configuration failed twice; saved Anthropic and OpenAI logins
could not refresh, and other advertised Copilot models were unavailable.

Claude Code rung 3 passed the final wave, including independent plan/ADR
numbers and held-claim exclusion. Codex passed nested-root migration and the
whole-wave environment-stop case. OpenCode's original stop case failed; its
rerun was rejected by the provider (HTTP 400 prompt_cache_key) before acting.

These are the earlier 2026-09-11 observations, not the current outcomes.

## Current evidence — 2026-09-13

See `audits/2026-09-13-host-verification.md` and
`evals/hosts/results/2026-09-13.json` for exact source hashes, commands,
assertion exits, native calls/child threads, original failures and repairs.

- Claude Code: real opted-in Workflow rung 1 and worktree Agent rung 2;
  ordinary manual permissions, signed claims/work/local pushes. Rung 1
  preserved concurrent work after the systemic gate failure; rung 2 completed
  both items with held-claim exclusion.
- Codex: successful separate-worktree bootstrap/new-adr and native rung 2
  on its actual bootstrap history; both signed concurrent claims preserved.
  Ephemeral native dispatch failed before claims; ordinary tmpfs session
  storage succeeded. Child-thread headers independently prove native workers;
  explicit Git worktree directions are not host-enforced isolation.
- OpenCode: successful repaired bootstrap/new-adr, sequential whole-wave stop
  and native Task rung 2 with signed concurrent claims. The first native wave
  passed target checks but failed reporting; a separate read-only reporting
  phase passed on the clarified source. It is not a new native execution.
- Six core model cases have independent target assertions through the
  documented vendor-host route, plus the wave case. Migrations preserve
  completed history/live ownership; positive and wrong-file negative history
  audits were checked read-only. `node evals/run.mjs` still reports six skips.
- Native package/plugin bytes and nine sidecars were compared with frozen
  sources for Claude Code, Codex, pi and OpenCode. This is not Cowork runtime
  evidence. Local bare remotes are not hosted GitHub workflows.

The later [Pi continuation](../../audits/2026-09-13-pi-qwen-continuation.md)
and `evals/hosts/results/2026-09-13-pi-qwen.json` supersede Pi's cloud blocker.
The configured local Qwen route with thinking off passed native bootstrap
repair/new-adr and a fresh rung 3 wave after the claim clarification. Original bootstrap and wave
failures remain recorded; signed local pushes, unchanged main/held history,
unstarted beta, completed-event ordering and fresh-clone gate checks passed.

The subsequent Pi positive control implemented alpha before acquiring its
remote claim and named the wrong owned plan path. These remain contract
failures even if final-state checks pass; the full Pi wave contract is not
verified. It also failed completion/INDEX checks and was interrupted by the
controller after repeated read-only inspection; no final report exists. The
runner now preserves the operator's native high thinking. The high positive
control repeated an exact 848-word cycle four times before claim/work and was
interrupted. The first high blocked control recovered after a request timeout,
then was interrupted by the controller; it is inconclusive, not a provider
unavailability finding. The corrective control settled naturally (exit 0,
2082.5 s), passing 13 target, five temporal, five fresh-clone gate and three
acquisition-order checks. Its published initial claim omits the actual branch
name; this metadata failure remains separate from the passing stop flow.
All installations matched frozen Windows export bytes; Git blobs match only
after CRLF-to-LF normalisation, as the receipt explicitly records.

Exit 1 remains partially verified because Pi/Cowork cannot yet satisfy AC5.
Exit 2 is verified: README has observed rows and no assumed marker. Exit 3
retains the required r5 history and regenerated metadata INDEX; local gates
pass. Neither this item nor ADRs 0012/0015 is marked complete.

## Status at a glance

- **This run:** prepared independently checked native-host evidence and fixes
  on PR #6; local verify, mutation and deterministic eval commands passed,
  pushed code CI passed, and all five continuation containers were cleaned up
  after review. Required current-head CI is recorded on the draft PR.
- **Overall:** partially verified — the five-host requirement remains blocked.
- **Yet to do:** successful native-high Pi complete-contract evidence;
  operator Cowork foreground action and actual target Git,
  installation/discovery and remaining behavioural evidence. Keep
  this item in todo and both owning decisions Accepted until all criteria pass.
