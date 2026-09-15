# W3, D2 and D3 implementation receipt

Task: task_b2132a3cb8c3 / ctx_06d7b40b0d52. Single writer: Codex.
Branch: `kmox83/docflow-v1-workspace-skills`.
PR: https://github.com/EvolveHQ/docflow/pull/9, targeting
`kmox83/docflow-v1-integration`; no self-merge or main publication.

## Verified sources

- Reviewed base: `9f748b806e9ab8eb8985e05d437f5c5f356dd248`.
- Verified work HEAD: `abdfba27284ad73c573af50690029fdcb8ebaed5`.
- Initial source/control baseline: `62363be5ca62610ab1cfa80df1540e84e2057a16`.
- W3 product: `193fb01`; D2 product: `4da3699` and `f0c2581`.
- Review clarification: `abdfba2` distinguishes operator-authorised setup,
  scoped reads and canonical planning from grant-bound native execution;
  new setup reads only existing entry-point files. The repository map is current.
- Historical lookup correction: `016d80d` and `4fcd917`.
- D3 producing source: `c57f91738158ce5db719f80412ff7e77b837bf60`;
  corpus commit: `9b63e7a`.
- Required source CI passed on the initial source/control baseline:
  https://github.com/EvolveHQ/docflow/actions/runs/34912990477/job/104204406346.
  The final receipt commit must also pass the current-head required check
  before the PR is marked ready; the PR records that final head/check.

Exact outputs, source/packed hashes, signature/gate separation and command
probes are under [the evidence directory](2026-09-15-workspace-skills/).
`source-receipt.json` hashes 345 files as exact raw Git bytes and proves all
nine original trigger blocks unchanged. Six assessment bodies changed;
audit, rollup and ship-item retain their existing workflows.

Coordinator review caught an incorrect serialization claim in the first
receipt. Git archive applied local `core.autocrlf=true`: all 342 original
file hashes described CRLF archive bytes. `source-hash-correction.json`
preserves every old value, corresponding raw blob hash and exact diagnosis.
The corrected receipt uses binary `git cat-file --batch` payloads with
declared byte lengths. Reproduce with
`node audits/2026-09-15-workspace-skills/verify-source-receipt.mjs`:
345 raw hashes, nine unchanged triggers, six before/after pairs, 186 corpus
files and 35 source snapshots pass. Fixture contents and their internal
hashes were already correct; this repairs receipt labels and source hashes.

## Outcomes and acceptance mapping

| Native package | Result and evidence |
|---|---|
| 0057 / ADR 0053 criteria 1–2 | Four portable operating skills declare inputs/effects/current authority/claims/dependencies/resources/stopping/receipt/unknown outcomes. External executors can return receipts without canonical write access. Workspace controls retain selection/grant separation, denial, unknown ownership and accepted agreement after completed work. |
| 0057 criteria 3–4 | Four starter roles, four example profiles, source-aware reference/enable/use guidance, add-nothing behaviour, ordinary files and experimental retrieval. Six native guides have installed-help or primary-doc syntax evidence; no guide smoke is claimed. |
| 0057 criteria 5–6 | Thirteen skills in all appropriate package layouts; actual npm archive and detached copies resolve assets without source checkout. Static gate, package tests and source CI passed; versions remain 0.9.4. |
| 0058 / ADR 0054 criteria 1–2 | Narrow supplied-answer fixes resolve the always-show selector contradiction and new-plan's repeated owning-decision question; emitted conventions/USAGE agree. Original trigger hashes are preserved. |
| 0058 criteria 3–5 | Current-grant/expiry/conflict controls and static supplied-choice contracts pass. Fresh-session guidance reads native owner/branch/blocker/next action and distinguishes prepared completion. Actual native question/response qualification remains queued in 0061. |
| 0059 / ADR 0055 criteria 1–3 | 22 versioned repository cases, 186 files and 35 exact producing-source snapshots; manifest records every origin/rendering/hash and full producing revision. Core/decision/Status forms render actual templates; minimal plan/INDEX/glossary/domain output is explicitly authored from cited skill rules. |
| 0059 criteria 4–6 | 27 controls pass for supported roots/shapes/layers/Status/history, genuine invalid pointers/duplicates/unknowns and real local Git prepared-versus-merged completion. Source-bound corpus sent through coordinator for Clarity C2/C12; app/native-host qualification is separate. |
| 0060 / existing ADRs 0051–0052 | Offline historical lookup ignores inherited Git redirects and replacements, preserves platform root identity and checks exact regular entry/local object. Real partial clones keep missing tree/blob objects unavailable; SHA-1 and SHA-256 commit/tree cases pass. Schema unchanged; corrected source/hash relayed to C12. |

## D2 evidence and limits

PR7's retained receipt is
`evals/hosts/results/2026-09-14-release-verification.json`, producer
`bef25d8d8a9ccc0a3ac15b678a2d619ed55c6216`. Its
`cowork_denial_receipt.report` records a real denied .git write and a stop;
the per-host plan retains the OpenCode reporting-only follow-up and native
stopped-run histories. These findings justify preserving denied-action
stops, honest outcome reporting and durable recovery. They do not establish
a repeated-question native-host failure or general permission qualification.

Current baseline probes found bootstrap's answer-reuse instruction contradicted
by its always-show depth selector; four authoring skills repeated the same
selector; new-plan asked its owner again after assessment. The source receipt
contains exact before/after hashes and diffs. The new guidance reuses fully
supplied choices and applicable grants, asks material missing/conflicting
choices and stops authority-dependent actions when a grant is invalid.
Static text assertions are not native question/response qualification.

## Exact checks

The initial broad controls below ran on `62363be`; exact outputs and exits
are in `source-gates.json`. After the narrow review clarification, verify
and all deterministic eval groups passed again on `abdfba2`, as did the
binary source-receipt reproducer; `followup-gates.json` preserves their
complete outputs and exits. `followup-package-receipt.json` binds the
refreshed actual archive and four successful asset processes to that source.

| Command | Result |
|---|---|
| `node scripts/verify.mjs` | `verify: OK (version 0.9.4, 13 skills, 55 ADRs, 67 shipped plan items)`, exit 0 |
| `node evals/run.mjs` | `10 passed, 0 failed, 6 skipped`, exit 0; six model-dependent cases were not run |
| `node scripts/verify-mutations.mjs` | `verify mutations: OK (15 rejected mutations)`, exit 0 |
| Four targeted workspace/skills/history/producer test files | 106 tests, 106 pass, 0 fail, 0 skip, exit 0 |
| Actual local npm pack, extraction and detached copy | 13 skills; all 221 corpus/source files included; four asset-resolution/validator processes exit 0 |
| Source required GitHub verify | SUCCESS at exact `62363be`; Linux CI includes platform-correct history controls |

The 67 shipped plan items are historical repository entries; this task
shipped none to main. All 18 constituent commits through the verified work
HEAD are signed and gate changes are separate from judged files.

## Producer/consumer handoff

The repository corpus is
`plugins/docflow/workspace/repository-fixtures/`; its manifest SHA-256 is
`7fdd64513df9dc0d14f5a773638e32f23f282b56407ed46eeb3dee24876d93b5`.
The corrected validator SHA-256 is
`c8db90d4925779be8ad11cb0116c161026feb62c454ec5539b191a98b4f6c6cd`.
These are raw Git blob hashes, not archive/checkout hashes.
The refreshed actual npm archive SHA-256 is
`86330a5d07216ccbddac5ba11576d50de654b1bdaef973562348acb0c545c2f6`.
Its receipt records all 332 packed-file hashes and 330 source comparisons
with explicitly normalized line endings; packed hashes preserve actual bytes.
The archive/extraction is retained at the path in `followup-package-receipt.json`.
The earlier `package-receipt.json` and archive remain historical evidence.

Coordinator messages `msg_377cb8a821e5` and `msg_827a4be972e8` report the
W3 milestone and corrected history/D3 pairing to C12 ctx_93e578505af6.
Those initial archive-serialized source pins are superseded by the raw hashes
above; coordinator review identified the discrepancy before settlement.
Clarity files were not edited. Consumer acceptance must pin its own revision
and distinguish commit/tree history from integrated delivery.

## Remaining qualification and recovery

Plans 0061–0063 explicitly queue D4, W4 and W5. Following coordinator direction,
the separately scoped D5 release compatibility work precedes the final source freeze and
native-host qualification. Required work includes all five target behaviours,
six actual guide smokes, eighteen workspace scenarios, two-host continuation,
Clarity platform/hand-off checks and the operator's real adoption/recovery
journey. No native model run, desktop smoke, hosted PR execution pilot,
retrieval installation or operator acceptance is inferred from these controls.

Cursor's local help probe failed with missing out/cli.js. DeepSeek's installed
off-PATH 0.1.1-rc.2 launcher, Claude Code 2.1.271 and Orca 1.4.201 help/version
checks pass; Codex App help passes, while app/UI access remains unqualified.
The first multi-argument PowerShell probe was malformed and retained; corrected
argument-array probes are separately recorded. Automatic review rejected
recursive removal of the first generated fixture render with “blocked by
policy”; a hash-checked in-place refresh preserved all files instead.

Items 0057–0060 remain todo and decisions Accepted pending the actual
final-main completion event. Their source is review-ready after final-head
CI; a merge into the review integration branch is not shipped-main delivery.
The task branch/worktree and local package are retained for review.

## Status at a glance

- **This run:** Implemented W3/D2/D3 and the paired historical lookup correction;
  static/evals/mutations/106 controls and actual package checks pass with
  source CI SUCCESS and exact logs/hashes retained.
- **Overall:** verified for bounded source development; ready for review only
  after the final receipt head's required CI, not shipped to main.
- **Yet to do:** Coordinator review/integration, D5 and frozen-source D4/W4/W5
  native/operator qualification, final-main completion and separately authorised
  release; retain the branch/worktree/package for review.
