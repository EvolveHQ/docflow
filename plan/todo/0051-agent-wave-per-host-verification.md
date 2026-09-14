# 0051 — Verify agent-wave per host; record observed rungs

Owning ADR: adr/0015-multi-target-portability.md (r5 — reopened
Implemented → Accepted on landing, → Implemented on ship; AC5's
"bootstrap plus one lifecycle skill" extends to agent-wave)

Also affected by the native continuation: adr/0029-seed-adr-recording-the-method.md
and adr/0037-shipped-record-is-git-and-plan-done.md, for a precise bootstrap-only
introduction-commit reference that avoids a future/self SHA while retaining
Implemented-on-creation, atomic scaffolding and the ordinary verified-work footer.

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
The native bootstrap exposed a hashless seed completion footer not covered by
the existing assertions. Preserve that result, add a focused resolver check,
clarify the skill/templates and owning decisions, then obtain targeted native
evidence on the changed snapshot. Do not exempt ordinary shipped items or make
an arbitrary supplied gate pass on an incomplete intermediate scaffold.

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

- **Claimed by:** Codex, 2026-09-14, `kmox83/docflow-release-verification`; operator-requested new worktree continuation after PR #6 merged as `d4f65bf02b836889bc1662c8627ccf9aa3ae7136`.
- **Blockers:**
- **Stopped:**

## Operator continuation, 2026-09-14

The new handoff expressly resumes Pi on the existing local Qwen route with
native high thinking and authorises necessary fixes, release verification,
an isolated existing-repository pilot, and a new draft PR. Earlier no-rerun,
stopped and draft-PR-6 statements below are historical. Preserve their receipts.
No merge, release, version bump, paid external service or support reduction is
authorised. Verify fresh normal and blocked runs, committed/publication metadata,
completed-event ordering, signed local transport, held claims, fresh-clone gates
and truthful reports. Keep this item todo and ADRs 0012/0015 Accepted until their
real exit criteria pass. Workspace documentation has a separate derived change
record outside this product plan.

## Cowork continuation, 2026-09-14

The previous dispatch stopped at `fcc8e2a` with bounded Pi evidence, five
reviewed continuation containers removed, and Pi/Cowork acceptance incomplete.
Its failed observations and source/export line-ending boundary remain in the
linked historical receipts. The operator has now confirmed Windows is unlocked
and Claude Desktop visible. At 08:15 UTC the coordinator observed screenshots
and the native folder picker; the 08:19 receipt still shows a marker-only actual
target with no `.git` or probe response. The coordinator operates the GUI and
verifies native target actions; this worker prepares fixtures/assertions and
writes evidence, without initialising the actual target or inferring success.
At 08:28 UTC the operator confirmed attachment; the active dispatch continues
for the coordinator's native execution and independent actual-target observations.
The original probe then passed seven independent file/Git assertions; staging
initially failed because the session could not unlink Git locks. A separately
authorised native deletion grant scoped to the disposable target recovered it,
with seven staging assertions independently passing. All 32 loaded plugin files
and nine sidecars match the frozen export. A later host-autosaved report appeared
under `Claude outputs`; preserve it with the native fixture-local exclude rather
than treating the model's contrary self-report as proof. Native signing passed
eleven independent checks; original bootstrap/new-ADR passed 23 existing checks
and six ancestry/release checks. A further focused check rejects the preserved
seed footer's generic wording. Separate gate and product commits add a precise
seed-only introduction reference; a fresh native bootstrap on loaded `eff3130`
passes 25 independent checks. Its resolver identifies signed full-scaffold
commit `48dcf4ed70db152bb5b375a5ea9d59f512996bb0`; 14 reference regressions pass.
The opted-in native Workflow ran two executors with signed local claims/work;
main and the held claim survived the environmental gate failure. A separate
post-wave export violated its tool's Git-path boundary and is not a wave pass.
Forty-seven wave assertions and four actual recovery/output checks pass.
Original child tool events establish acquisition before each output write,
with both writes beginning before alpha's failure. The native manifest's beta
timestamp was wrong and is corrected without changing the original; the exact
parent first-failure receipt remains unavailable. Original lifecycle/wave used
the `13ea0c2` export, while only the repaired bootstrap ran on `eff3130`.
See the
[current audit](../../audits/2026-09-14-cowork-continuation.md) and its receipt.

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

At that earlier checkpoint, exit 1 remained partially verified because Pi's
full contract was unverified; Cowork had scoped native observations with
explicit source/permission limits. Exit 2 was verified: README had observed
rows and no assumed marker. Exit 3 retained the required r5 history and
regenerated metadata INDEX; local gates passed. Neither this item nor ADRs
0012/0015 was marked complete at that checkpoint.

## Current operator run — 14 September 2026

See [the release audit](../../audits/2026-09-14-release-verification.md) and its
separate sanitised receipt. Product and gate changes are signed separately;
all fresh installed plugin files are exact Git bytes from bef25d8. The original
receipts above remain historical. New observations include a complete native-high
Pi normal pass, fresh CLI release cases and native isolation, a scoped Cowork
denial pass with broader failures retained, actual-target lifecycle recovery,
and a controlled existing Clarity clone pilot. An infrastructure interruption
and later failed attempts remain preserved. Fresh Pi bootstrap/new-decision
settles naturally at 2,935.8 seconds, exit 0; its actual history supplies the
fresh blocked wave, which settles at 2,209.1 seconds, exit 0. All 13 state,
11 initial-claim/order, five temporal and 15 fresh-clone/stop assertions pass,
with three final reports and complete persisted stopped labels. The final
bootstrap and blocked run are serial on the existing local Qwen/high route.
All owned CLI runtimes are archived and stopped; the private signers are
discarded while public keys and recoverable histories remain.

The final assessment maps all six core cases and five hosts to actual execution
and independent assertions on bef25d8. OpenCode's successful stopped state has
a separate native Status-only reporting correction; this staged result and
earlier failures remain explicit. Cowork retains its permission/transport
limits. Pi's full published-claim and stop contracts are verified; incidental
report abbreviations and unsupported hosted-PR inferences are corrected in the
independent report review. No support or acceptance criterion is reduced.

## Status at a glance

- **This run:** Source-pinned repairs and fresh independent native observations
  are consolidated for draft PR #7. Pi normal and blocked contracts pass;
  fresh main gates return `verify: OK (wave fixture)`, exit 0, while the blocked
  alpha reproduces `ERR_MODULE_NOT_FOUND`, exit 1. Original failures remain
  preserved and owned runtimes are stopped.
- **Overall:** verified within the existing scope; completion preparation pending.
- **Yet to do:** Run the verified work-head gate, prepare this item's completion
  and decisions 0012/0015 atomically, then final-head checks and PR CI. Keep the
  worktree for review; generated Python cache cleanup was rejected by automatic
  approval review. A checked PR merge and release each need separate authorisation.
