# 0051 — Pi continuation and remaining host blockers, 2026-09-13/14 UTC

Two native failures led to targeted product repairs: bootstrap now records the
exact gate command in CONVENTIONS, and sequential waves claim only the current
item. The runner also preserves Pi's configured provider, model and thinking
level. **Full acceptance remains unmet**; [PR #6](https://github.com/EvolveHQ/docflow/pull/6)
stays draft, 0051 stays todo and ADRs 0012/0015 stay Accepted.

The [sanitised receipt](../evals/hosts/results/2026-09-13-pi-qwen.json) holds exact
commands, exits, source/file hashes, target assertions, native provenance,
corrections and cleanup hashes. Original failures remain separate. Earlier
Claude Code rungs 1/2, Codex/OpenCode and six core model-case observations remain
in the [earlier audit](2026-09-13-host-verification.md); those expensive runs were
not repeated without a relevant source change.

## Native Pi findings

| Phase | Process | Independently observed outcome |
|---|---|---|
| Smoke, thinking off | 0; 88.5 s | Exact 11-byte target and native tools verified. |
| Bootstrap/new-adr, off | 0; 1788.1 s | 22/23 bootstrap checks pass; exact CONVENTIONS gate command missing. New-adr, signatures and report shape pass. |
| Separate native bootstrap repair, off | 0; 436.4 s | All 23 bootstrap and seven preservation checks pass; only CONVENTIONS changed. Original failed history preserved. |
| Original blocked wave, off | 0; 1138.2 s | Failed: beta preclaimed, then integrated after alpha's environment failure. |
| Fresh blocked retry after clarification, off | 0; 708.1 s | Pass within this configuration: 13 signed target, five temporal and five fresh-clone gate/preservation checks; report agrees. |
| Positive wave, off | 143; 1495.8 s | Failed claim/completion rules; controller interrupted a repeated read-only loop. No final report. |
| Positive wave, native high | 143; 1133.3 s | Exact 848-word cycle repeated four times without another tool action; controller interrupted before probe/claim/work. |
| First blocked wave, native high | 143; 592.6 s | Inconclusive: native retry recovered after timeout and completed 13 read-only calls before controller interruption. |
| Corrective blocked wave, native high | 0; 2082.5 s | Natural settlement: 13 target, five temporal, five fresh-clone gate and three acquisition-order checks pass; report agrees. Published initial claim metadata fails. |

The off positive control put outputs in initial claim commits, recorded `.txt`
instead of `.md` Owned plan paths, squashed/deleted claims, omitted completion
moves/footers and corrupted INDEX. Retained claim objects prove the ownership
failures. All six reachable signatures are `G`; the unchanged checker's
minimum-eight-history requirement failed, not cryptographic verification.
The high corrective run's published initial claim `c7d8301` contains no output
and correct Owned paths, but omits the actual claim branch from its message.
Its five reachable signatures are `G`; the metadata failure remains separate.

The original runs forced thinking off in both runner and isolated defaults,
while the operator's native setting is high. They do not prove that full
configuration. Corrected controls use native high, independently confirmed by
RPC get_state; only counts/repetition metrics are published, never thinking text.

The first high blocked run's request timeout was followed by successful built-in
retry. A separate `/health` HTTP503 did not establish route unavailability.
Original stop rationale and correction remain separate; eight checks prove
unchanged target/gate and two valid fixture signatures, not a stop-flow pass.
Controller interruptions were neither natural settlement nor runner timeouts.
A wrong-profile bootstrap assertion was a collector mapping error; it remains
recorded separately from the genuine missing-command defect.

## Scope and validation

All 32 installed files and nine sidecars matched the frozen Windows export of
`13ea0c20616d9fbcf3f519bce7e15343e73c98ce`. Git blobs and the current checkout
match that export only after CRLF-to-LF normalisation; raw Git-blob equality is
not claimed. The receipt records both digests and earlier Windows-sort limits.
Bootstrap repair was tested separately; only agent-wave changed afterwards.

Pi 0.84.4 used `llama-server/qwen3.8-27b-coding` (response `qwen3.8-27b`), native
`--approve`, independent tmpfs homes and only its provider extension. Off runs
observed rung 3/width 1 and reused explicit inputs; no delegation or interactive
selector was exercised. Signed local bare-remote transport and available `gh`
are bounded evidence, not hosted GitHub permissions. Global settings and server
were unchanged.

Local commands passed: `node scripts/verify.mjs` (version 0.9.4, 9 skills,
50 ADRs, 64 shipped items), `node scripts/verify-mutations.mjs` (15 rejected),
`node evals/run.mjs` (**6 passed, 0 failed, 6 skipped**), six runner controls
and eight temporal controls. Each exit was 0; both Python controls now run in
required verify CI. Product/gate changes are separate signed commits. The custom
Workflow suite itself was not run; earlier native case mapping remains bounded.

## Cowork and retained evidence

The coordinator observed signed-in Desktop 1.52386.3.0, 100% usage and a displayed
23:20 UTC reset. Interactive readiness remains unverified: black captures and
`window_not_focused` persisted through one supported restore retry. The operator
was asked to unlock Windows and bring Claude Desktop forward. No new plugin
install, verified attachment, prompt or target Git action occurred.

The offline plugin ZIP matches source. A Windows LF-to-CRLF marker preparation
error was corrected with explicit bytes and read-back hashes; original bytes and
metadata remain archived. This was a fixture defect, not a Cowork finding.
Historical cloud mirrors/bundles still do not establish actual target Git access.

All five continuation containers were archived and removed after review.
Archives retain only workspaces, Git objects and separately exported synthetic
public keys, excluding home/provider/private-key material. Detailed private
locations and hashes are in the receipt; other projects and source remain intact.

## Status at a glance

- **This run:** two instruction repairs and native configuration preservation;
  bounded passes, failures and corrected interruption evidence retained. Local
  gates pass and owned cleanup is complete; PR #6 tracks required current-head CI.
- **Overall:** partially verified; full five-host acceptance remains unmet.
- **Yet to do:** successful native-high Pi complete-contract evidence;
  operator Cowork foreground action then real installation/target Git/lifecycle/wave
  checks. Complete the atomic plan/ADR
  transition only when all acceptance criteria pass; no merge is authorised.
