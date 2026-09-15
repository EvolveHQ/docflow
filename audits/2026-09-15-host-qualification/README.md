# Source-bound native qualification — in progress

Plans 0061 and 0062 remain in todo. This evidence ledger records required
assertions and their receipts; it is not another work queue. Task
`task_856c97a5b36d`, dispatch `ctx_fc206cf7e4a8`, sole writer on
`kmox83/docflow-v1-host-qualification`; draft PR
<https://github.com/EvolveHQ/docflow/pull/11> targets review integration.
No main integration, released V1, operator acceptance or release is asserted.

## Candidate and provenance

- Docflow source: `f47f4c52313163f1ffe55a97d9c8029602d7c5b4`.
- Development version: **0.9.4**, unchanged in all manifests.
- Plugin digest: `1f76befdd23ca9cceccbf2993e8d88448e1ca162f2437d1f10402ed5def7a3f8`.
- Actual npm archive SHA-256:
  `d51ca82a22ace02683a29dc25bffb1534390127540a3f30634d6cc207b00142d`.
- [Source freeze](source-freeze.json): 338 exported files, including the
  declared package preview; all bytes came from raw Git blobs, not checkout
  or archive line-ending conversion. The initial 337-file export omitted
  that preview and was superseded before packaging; product bytes agree.
- [Npm receipt](npm-package.json): all 332 archive files match the export.
- Installed skills/workspace read-back: 329 files match on each completed
  Claude Code, Codex and OpenCode setup. The first independent installed
  read-back occurred **after** setup and before subsequent phases; the
  source mount was read-only. Do not imply an earlier observation timestamp.
- Clarity pairing: pending the controller's integrated candidate/artifact.
  Independent C12 `366a73a3b254ce6c6ab38c3e327eb6f1cb246c68` is preparation
  only; no combined view/copy/handoff acceptance has run.

Digest algorithm: case-sensitive POSIX relative plugin paths, sorted;
each path, NUL, raw file bytes, NUL, accumulated into SHA-256. Per-file
SHA-256 and Git blob IDs are retained. Reproduce export using
`evals/hosts/freeze-candidate.py` with a **new** destination and this SHA.

## Demonstrated scope

| Native route | Actual outcome | Limit |
|---|---|---|
| Claude Code 2.1.269, Linux container, `claude-opus-5[1m]` | Native init advertises all 13 skills; new workspace setup passes independent file/validator checks; actual workspace planning creates selected/agreed/planned records without grants or runs. | Manual tool allowlist is requested; native init reports permissionMode `default`. Planning return uses a nonconforming Overall phrase. Guided no-grant adherence is distinct from the fresh recovery probe. |
| Codex CLI 0.154.0, Linux container | Native `skills/list` advertises all 13 enabled plugin skills; workspace setup passes. Full bootstrap/new-adr produces committed local-main state, valid seed reference and unchanged gate. | Historical bootstrap checker exits 1 on its integration-wording regex: output says “direct into local main, fast-forward only”. Preserve this failure; no check was weakened. Setup's report block precedes later detail rather than closing the report. |
| OpenCode 1.18.30, Linux container, requested `opencode/big-pickle` | Native debug inventory lists all 13 copied skills; workspace setup and full bootstrap/new-adr independent checks pass. | First debug output captured through a pipe stopped at 65,536 bytes; native file redirection produced the complete inventory. Native `--auto` mode is not a deny-all permission boundary. |
| Pi 0.85.1, Windows, local `llama-server/qwen3.8-27b-coding`, native high | Actual provider/model are present in native events; 14 tools completed in the first attempt. | First setup reached the 900-second bound, exit 124, with no workspace files; recovery uses the same model/high and a longer bound. No initial success is claimed. |
| Cowork, existing Windows desktop | A new task composer and folder picker were observed. | Picker keyboard focus targets the underlying composer; no task was submitted. Own draft was cleared and picker cancelled. Desktop transferred to controller; manual folder selection pending. |
| DeepSeek Harness 0.1.1-rc.2 web profile | Actual local web server and UI observed using a dedicated headless Chrome profile. | Native UI asks for an API key. No key entered, configuration saved or inference attempted; guide receipt blocked. Headless browser work did not take desktop ownership. |

[Assertion ledger](assertion-ledger.json) retains all five targets,
eighteen workspace scenarios and six guides. A partial/read-only/guided case
does not pass a complete scenario. [Cases](cases.json) binds exact process
outcomes, assertions and private transcript hashes. Native process exit zero
is not itself a behavioural verdict. Synthetic producer records and imported
historical owner labels remain labelled synthetic; actual native file/Git
observations are distinct. Fixture commits use explicitly selected unsigned
local histories; task evidence commits are signed.

## Recovery and remaining boundaries

The isolated mixed-method fixture preserves a source-rendered Docflow
stopped item, a manual issue member and a reference-only member. Planning
and guided orientation preserve the member methods and report the imported
owner/branch conflict. The copied setup README retains an old home/member
description: this is a **fixture preparation mismatch**, not a product
setup failure. The native participant correctly reported it and left it
unchanged. Fresh continuation must infer applicability from current records
without receiving the expected policy answer in its prompt.

Private scratch:
`C:/Users/eugen/AppData/Local/Temp/docflowhq-v1-20260915/qualification-ctx-fc206cf7e4a8`.
Raw model events may include reasoning; they are not published. Do not
archive the entire scratch root: its isolated Pi provider extension and
temporary browser profile are not public evidence. Only exact scoped
credential files were supplied to disposable homes; no credential values
are in this audit. [Cowork input projections](cowork-input-receipts.json)
retain the precise focus failure and recovery; the referenced screenshot
stays private because it includes unrelated sidebar labels.

## Status at a glance

- **This run:** Frozen development package; three native discovery/setup
  observations and two bootstrap/new-adr runs; workspace planning and guided
  no-grant behaviour; Pi timeout and desktop/web access blockers retained.
  Initial gates: `verify: OK (version 0.9.4, 13 skills, 56 ADRs, 67 shipped plan items)`,
  exit 0; deterministic suite `10 passed, 0 failed, 6 skipped`, exit 0.
- **Overall:** Partially verified. Required native and combined scenarios
  remain incomplete; draft PR is not ready or shipped. Six deterministic
  skips remain unexecuted by that command.
- **Yet to do:** Complete native lifecycle/denial/recovery/retention coverage;
  finish Pi recovery and all six guide smokes; eighteen full scenarios and
  two-host continuation; resolve desktop/provider access and reporting
  findings; receive paired Clarity artifact and test actual views/handoffs;
  preserve final receipts, clean up owned runtimes, run final local gates and
  current-head CI, obtain review and the operator's actual pilot result.
