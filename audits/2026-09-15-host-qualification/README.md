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
| Cowork, Windows desktop 1.52386.6.0, Opus 5 Max | Dedicated session cse_01TdFRnf8hhsie51VbtN5gve was positively stopped through native UI after the bounded run. No workspace or receipt was created; all 331 attached files stayed unchanged. | The first task used attached candidate files while the registered copy still had nine skills. After controller-approved replacement, the native registry lists thirteen skills and the supported current export matches all 331 frozen candidate files. The fresh actual setup is running; original restoration is pending. Cloud mock driver activity is not native setup evidence. |
| DeepSeek Harness 0.1.1-rc.2, native web | Dedicated headless Chrome observes the isolated local Qwen/High profile and Workspace Write mode. First native turn fails before tools with `PI_AI_ERROR: No API key for provider: llama-server`; all fixture bytes remain unchanged. | The 900-second recovery stopped after 908 seconds including teardown, with 13 read/list calls and no check/receipt. Native progress continued until 0.4 seconds before stop. The fresh 1800-second supplied-path attempt passed the native check but stopped after 1795 seconds before returning a receipt. Its empty returns directory was created; pre-existing fixture/member/product file bytes stayed intact. No desktop-app session or remote credential is claimed. |

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

## Fresh combined-candidate external return and readiness (v3)

Under the combined 70bae90 runtime/receipt guidance candidate (frozen by the
[raw-blob freeze](package-runtime-receipt-freeze.json)), a fresh actual native
Claude Code executor returned an unamended external receipt and a separate
native readiness stop produced a readiness report, both on byte-exact disposable
fixtures prepared under the continuation dispatch.

The [assigned process](fresh-v3-assigned-process.json) ran the installed
`docflow:workspace-coordinate` skill in the actual executor runtime after the
[338-file installed-source preflight](fresh-v3-assigned-preparation.json)
matched the freeze. The executor verified the member Git blobs byte-for-byte,
ran `node check.mjs` (exit 0, `fresh-receipt-native-check: OK`), and wrote the
single permitted file once. The original tmpfs artifact was lost when the
container stopped; its [recovered bytes](fresh-v3-assigned-external-return.json)
match the captured Write input and the in-container shape check that returned
valid, exit 0. Independent controller
[assertions](fresh-v3-assigned-assertions.json) re-verify the shape on the frozen
assets (valid, exit 0), all 104 canonical hashes, clean Git states, native
session binding and the envelope contents. The two-harness
[reconciliation](fresh-v3-assigned-reconciliation.json) (native Claude Code
returned; the Orca continuation controller session reconciled) imports the
original receipt into the fixture run record unamended, records the boundary
stop with its truthful blockers, completes the delivery observation, closes the
grant and validates the whole fixture with exit 0.

The [readiness process](fresh-v3-readiness-process.json) ran the same installed
skill with no grant. The native executor stopped before any attempt: its
[readiness report](fresh-v3-readiness-report.json) records the exact missing
execution grant and run brief, executes no check and creates no attempt or
canonical record. Independent [assertions](fresh-v3-readiness-assertions.json)
prove all 97 fixture files unchanged, the runs directory still empty, a single
permitted write and native session binding. This is the separate native
readiness stop plan 0065 requires; it is not imported into `runs.receipt`.

## Native package removal and version upgrade

[OpenCode removal](opencode-native-retention.json) uses its native detached-copy
discovery mode: remove the dedicated installed directories, observe no Docflow
skills, and restore. [Version upgrade](opencode-native-upgrade.json) first
installs the separately [pinned historical 0.9.3 bytes](upgrade-0.9.3-freeze.json)
from `a60cfcdf05188845620d3a28f21e3ccc188fb83d`, observes nine native skills, then
applies the frozen 0.9.4 package and observes thirteen. All 329 current product
files match, and workspace files and native Git histories stay identical
through both steps. These are actual native inventory/data-retention checks
without model inference, not plugin-manager commands or another host result.

## Further native authority checks

- [Codex denial](codex-denial-assertions.json): a native edit failed against a
  read-only Docker bind. Subsequent commands only inspected Git state; no
  alternate write or delegate occurred. Fixture and installed bytes match.
- [Expired grant](claude-expired-assertions.json): fresh Claude coordination
  read the actual clock after the grant expired and stopped the dependent
  check. Current native ownership did not substitute for execution authority.
- [Shared ownership](claude-cross-assertions.json): two real Git workspaces
  point to one sibling member. Claude preserved injected unknown prior-owner
  history, skipped the check with null exit, and wrote only an external
  [blocked-readiness record](claude-cross-return.json). This is native handling
  of synthetic conflict input, not a second actual live worker or a canonical
  receipt-format pass. Complete overlap/resource/consumer variants remain.

The [DeepSeek recovery diagnosis](dsh-bounded-diagnosis.json) preserves actual
read sizes and progress. Its timeout proves incomplete execution within that
bound, not unsupported guide behavior or a stalled provider. The later attempt
used fresh authority and exact navigation paths, so it does not test discovery.
Its [timing diagnosis](dsh-long-diagnosis.json) records 950.157 seconds before
the check, 1.570 seconds in the check tool and 843.276 seconds afterward; all
native tools together occupied 6.008 seconds. Fifteen reads were distinct.
There was no receipt-file write attempt. The isolated Git environment caused
one recoverable parse error. The required validator/schema steps were not
demonstrated. The check wrapper used a fixed temporary stderr file whose prior
existence is unknown; no zero-external-effects claim is made.
[Controller reconciliation](dsh-long-reconciliation.json) validates: run stopped,
check passed, external receipt missing, work active, delivery unknown. This
controller observation is not an executor return. A later controller-authorised helper preparation was
[rejected before launch](dsh-helper-launch-rejection.json) by automatic approval
review, which returned only `blocked by policy`. It was not split or rerouted.
The [controller cancellation](dsh-helper-cancellation.json) closes the grant
and withdraws prospective ownership; no runtime, executor receipt or process
exit is claimed. No new DSH setup/launch is permitted without explicit operator
direction.
A [watcher correction](dsh-long-watcher-correction.json) binds the already-created
fresh native session file without restarting the model or extending the deadline.

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
  resources, remaining cross-workspace variants and contextual recommendations remain
  explicitly incomplete in the ledger.
- Cursor, ZCode and Codex App native guide sessions are unrun. CLI or installed
  package observations do not establish a desktop app session. Desktop
  ownership transferred back for the dedicated Cowork task. Its native installed
  nine-skill copy differs from the attached current candidate; a supported scoped
  replacement registered thirteen skills and exact current bytes. Original restoration remains required. Clarity pairing
  and the operator's pilot remain pending.

Raw model events stay private because they may include reasoning. Scratch is
`C:/Users/eugen/AppData/Local/Temp/docflowhq-v1-20260915/qualification-ctx-fc206cf7e4a8`.
Do not archive that entire directory: it includes narrowly scoped provider
configuration and temporary browser state. Only selected source-bound receipts
and prompts belong in this audit. Fixture Git histories are explicitly
unsigned local test data; task evidence commits are signed.

## Cowork plugin restore evidence

The [native current-version export](cowork-native-plugin-export.json) is byte-identical
to the original local restore archive: SHA-256
`0cafc65f97bb870f53bd2df1086e486e0e1de9a59ee5d637808299c10808b675`,
32 files and nine skills. The UI supports ZIP upload and retains earlier uploaded
versions; the subsequent current-candidate receipt records same-name replacement,
while original restoration remains pending.
The [stopped session](cowork-native-session.json) and [independent attached-folder
snapshot](cowork-native-after-stop.json) establish no completed workspace setup.

The [current installed-candidate task](cowork-current-session.json) is a separate
native session with verified native thirteen-skill discovery and exact current
export bytes. It created 12 files after the controller stop deadline was missed
during a usage-limit interruption; both native validator attempts failed at the
cloud/device filesystem boundary. A separate Windows controller check passes.
The [original restoration](cowork-restoration-verification.json) is now verified:
32 exact files, nine skills, enabled state and unrelated inventory preserved,
with an additional host-generated category label recorded. Desktop is released.
The [runtime diagnosis](cowork-runtime-diagnosis.md) preserves the native failure
and the unrun attached-copy route; no new Cowork attempt is authorised.

## Shared exclusive resource guard

The [native resource case](claude-resource-assertions.json) reuses a current
A grant and native claim for a distinct Git member, reads the shared reservation
source and linked B workspace, and stops before the check. All five fixture
roots and the frozen package remain unchanged. B reservation history is injected
scenario input. The original external readiness report is not a canonical
attempt receipt; schema and clock limits remain explicit.

The [receipt usability diagnosis](native-receipt-usability.md) and
[concrete proposed patch](receipt-guidance-proposal.patch) preserve the actual
handoff failures. The [approved repair](receipt-guidance-repair.md) is committed
and separately frozen at `eed722c8398b1e85d14ed57fa6dc53d5f5655bd0`; the original
f47 bytes remain unchanged. Fresh affected-guidance native acceptance is pending.

The [initial read-scope diagnosis](native-read-scope-diagnosis.md) retains the
independent scenario worker's concrete native failures separately from its
functional successes. The sanitised WV13/WV15/WV18 evidence is now imported:
the [scenario collection](scenarios-ctx_59ed70a00d5e/report.md) (nine native
turns, 234 passing assertions, two failed read-boundary assertions) is published
under `scenarios-ctx_59ed70a00d5e/` with its
[import receipt](scenarios-ctx_59ed70a00d5e/import-receipt.json); every
imported file matches the archive manifest. Raw transcripts, fixture trees and
archives stay private with retained hashes. The two read-scope failures
(F1 WV13 `grep -rl` beyond authorised roots; F2 WV18 restricted-byte hashing
with a false permission claim) remain failures, and the F3 reporting error
(YAML sidecar miscounted as a fourteenth skill) is retained.

## Native Claude Code bootstrap and Proposed decision

A fresh bounded native run on the combined 70bae90 candidate exercised
full-depth bootstrap plus new-adr in one session: 221 seconds, host exit 0,
within the operator's 900-second cap. The [independent
assertions](claude-bootstrap-assertions.json) prove the seed gate preserved
byte-for-byte (`5de554f5b4d975117d03d8bd9bf27420e486dfcbd883b02e7bc0db20e46904cc`)
and passing (`verify: OK (fixture gate)`, exit 0), the thirteen native skills,
both skill invocations, a clean committed repository with no remote, Proposed
decision 0002 with exactly three acceptance criteria, an updated INDEX and
the full bootstrap layout (AGENTS/CLAUDE/CONVENTIONS, plan queue,
`_agent/prompts/autonomous.md`). The disposable fixture is preserved with its
[own receipt](claude-bootstrap-fixture-preservation.json) and the container
was positively stopped and removed.

## Operator decisions, 2026-09-15

By operator instruction (hard stop 19:55 UTC, 900-second cap per native run):
Cowork is a **best-effort, unqualified target for V1** — no new sessions,
desktop control or plugin changes, existing evidence stays as historical
record, and open Cowork cases are labelled *not required for V1*, not passed
or failed. Only the **Claude Code and Orca** workspace guides require
qualification evidence; the ZCode, Codex App, Cursor and DeepSeek Harness
guides are *unverified documentation by operator decision*. Pi local-Qwen
runs are *deferred: exceeds the timebox* (never substituted with another
model). The decision record, AGENTS/CONVENTIONS five-target rule and README
support-table changes are queued by the coordinator separately; this section
only records the decision's effect on qualification evidence.

## Status at a glance

- **This run:** Native host inventories/setup results, bounded resource/lifecycle,
  denial, fresh recovery, removal/reinstall and external handoff evidence are
  recorded with actual failures and limits. Prior local gates returned
  `verify: OK (version 0.9.4, 13 skills, 56 ADRs, 67 shipped plan items)`, exit 0,
  and `10 passed, 0 failed, 6 skipped`, exit 0. CI passed on evidence head
  `26a1a7c343a344ef7077d276ecc14a8d1c5964a5`; subsequent evidence needs current-head CI.
- **Overall:** partially verified. Plans 0061/0062/0065/0066 remain in todo.
  PR 11 merged into the review integration as 52887c7 (verified on
  `origin/kmox83/docflow-v1-integration`); follow-up evidence ships in a new PR;
  the development candidate is not released V1.
- **Yet to do:** Cowork is not required for V1 (best-effort target by operator
  decision 2026-09-15); ZCode/Codex App/Cursor/DeepSeek Harness guides are
  unverified documentation by operator decision and Pi local-Qwen runs are
  deferred beyond the timebox. Claude Code denied-action/upgrade-removal
  retention, Codex lifecycle/recovery/upgrade retention and OpenCode
  stopped-fresh recovery remain unrun within this dispatch's timebox; the
  imported WV13/15/18 read-scope failures await writer disposition; combined
  Clarity acceptance waits for the controller-supplied integrated
  source/artifact; the operator pilot acceptance is supplied only by the
  operator.
