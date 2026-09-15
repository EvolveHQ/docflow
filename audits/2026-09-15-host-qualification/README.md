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

| Native route | Demonstrated result | Material limit |
|---|---|---|
| Claude Code 2.1.269, Linux, `claude-opus-5[1m]` | Thirteen native skills; empty workspace setup; selected/agreed/planned records; fresh no-grant stop with identical filesystem/Git snapshots; scoped external native check and receipt. | First external receipt failed validation. One assisted report correction is retained separately. Some amended observation times remain declared stand-ins and are not verified event times. Requested manual tool permissions appear as `default` in native init. |
| Codex CLI 0.154.0, Linux, `gpt-6-astra` | Thirteen native skills; setup; full bootstrap/new-adr; read-only mixed-method orientation; native plugin removal retains three fixtures and reinstallation restores thirteen skills plus 329 exact product files. | Original bootstrap checker exits 1 on an integration-wording regex; semantic inspection supports the requested local-main behavior. No checker was weakened. Same-version reinstall is not an upgrade. |
| OpenCode 1.18.30, Linux, `opencode/big-pickle` | Thirteen native skills; setup; full bootstrap/new-adr; Proposed-decision queue creation; ship-item blocks on Proposed ownership without changing files/Git; unavailable edit tool stops shell-write/delegate alternatives. | Permission config removes edit from the tool surface; this is not an interactive approval denial. Native startup added a config schema and 3,658 dependency files. The model incorrectly called these pre-existing. |
| Pi 0.85.1, Windows, local `llama-server/qwen3.8-27b-coding`, high | One fresh recovery creates and independently validates the empty workspace after about 1,443 seconds. Native RPC advertises all thirteen Docflow commands. Installed source bytes and supplied choices match. | First 900-second setup timed out, exit 124. Recovery exited 0 before the controller's 1,800-second cap. RPC omits documented path/location fields; path binding comes from separate package/config evidence. |
| Cowork, Windows desktop | Dedicated new composer and folder picker observed. | No task submitted: focus failed. Own draft cleared, picker cancelled, desktop transferred to controller. Operator manual folder selection remains pending. |
| DeepSeek Harness 0.1.1-rc.2, native web | Dedicated headless Chrome observes the isolated local Qwen/High profile and Workspace Write mode. First native turn fails before tools with `PI_AI_ERROR: No API key for provider: llama-server`; all fixture bytes remain unchanged. | Controller authorised one recovery using the existing non-secret local compatibility marker after client-guard diagnosis. Recovery is running under a 900-second cap. No desktop-app session or authenticated remote credential is claimed. |

[Assertion ledger](assertion-ledger.json) retains every required assertion
for five hosts, eighteen scenarios and six guides. [Cases](cases.json)
binds actual process exits, independent assertions and private transcript
hashes. A successful process or narrow case does not pass an entire scenario.

## External handoff and partial delivery

The actual Claude Code executor received an immutable context mount and had
no canonical write access. It ran `node check.mjs` at the declared manual
member revision: exit 0, `qualification-member-check: OK (manual-member)`.
The independent canonical before/after snapshots are identical.

The [original return](external-native-receipt.json) uses invalid `.` evidence
paths and reports unsupported observation times. Its [failed reconciliation
draft](external-orca-reconciliation.json) preserves all validator diagnostics,
including controller-draft time, reconciliation-evidence and completion-state
mistakes. The canonical pending state was restored and validated before the
one report-only correction. These are distinct executor and harness findings.

The [amended return](external-native-receipt-v2.json) preserves the original
receipt hash and explicitly identifies unknown read times. Some required time
fields use declared stand-ins; they are not accepted as independently measured
events. The actual Orca 1.4.201 dispatched coordinator separately checked the
native source, clean Git state, command exit/output and native session IDs.
[Reconciliation](external-orca-reconciliation-v2.json) validates with exit 0:
manual delivery complete, other delivery unknown, parent work active, agreement
accepted. This is bounded two-host continuation; full adverse guide and Clarity
handoff acceptance remain outstanding.

The mixed fixture contains imported synthetic stopped-owner history. That
history is not a live process result or permission to reassign. Its copied
README and index are stale preparation inputs: fresh native participants
correctly report the discrepancy and use current canonical files. Fresh
Claude and Codex snapshots independently prove no writes or native claim moves.

## Findings and retained limits

- Codex setup places its closing status block before later details; Claude
  planning and OpenCode queue creation use unsupported Overall phrases.
  These native instruction-compliance failures remain visible.
- OpenCode's original debug stdout capture truncated at 65,536 bytes.
  Native redirection to a file yielded the complete thirteen-skill inventory
  plus one builtin. Pi's first RPC harness assertion incorrectly required
  path fields; native names and separate installed-byte evidence are retained.
- Six behavioral cases skipped by the deterministic command remain unrun.
  Historical evidence is not reused for the four new skills or changed choice/
  authority behavior. Upgrade, remaining lifecycle/denial variants, shared
  resources, cross-workspace ownership and contextual recommendations remain
  explicitly incomplete in the ledger.
- Cursor, ZCode and Codex App native guide sessions are unrun. CLI or installed
  package observations do not establish a desktop app session. Desktop
  ownership remains with the controller/operator while manual Cowork setup is
  pending. Clarity source/artifact pairing and the operator's pilot are pending.

Raw model events stay private because they may include reasoning. Scratch is
`C:/Users/eugen/AppData/Local/Temp/docflowhq-v1-20260915/qualification-ctx-fc206cf7e4a8`.
Do not archive that entire directory: it includes narrowly scoped provider
configuration and temporary browser state. Only selected source-bound receipts
and prompts belong in this audit. Fixture Git histories are explicitly
unsigned local test data; task evidence commits are signed.

## Status at a glance

- **This run:** Four native host inventories/setup results, bounded lifecycle,
  denial, fresh recovery, removal/reinstall and external handoff evidence are
  recorded with actual failures and limits. Prior local gates returned
  `verify: OK (version 0.9.4, 13 skills, 56 ADRs, 67 shipped plan items)`, exit 0,
  and `10 passed, 0 failed, 6 skipped`, exit 0. CI passed on evidence head
  `b4ee17630dca69daaf06532d6123f61e2b2c060d`; subsequent evidence needs current-head CI.
- **Overall:** partially verified. Plans 0061/0062 remain in todo. Draft PR 11
  is live and has not shipped; the development candidate is not released V1.
- **Yet to do:** Finish the bounded DeepSeek recovery and preserve its actual
  terminal result; complete pending native host/guide/scenario assertions;
  obtain desktop access and paired Clarity artifact; perform actual combined
  views/handoffs; preserve fixtures, clean up owned runtimes, run final gates
  and current-head CI, obtain review and the operator's real pilot acceptance.
