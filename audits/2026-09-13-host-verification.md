# 0051 — independent host verification, 2026-09-13

The core behavioural cases and native Claude Code, Codex and OpenCode
observations have reviewable evidence. **0051 is not complete:** pi needs a
usable supported provider login and Cowork needs a usable session with actual
target Git capability. ADRs 0012 and 0015 remain Accepted; the item stays in
todo. No merge, release, tag, publication or support reduction is authorised.

New draft PR: <https://github.com/EvolveHQ/docflow/pull/6>, branch
`kmox83/0051-host-verification-astra`. Fetched `origin/main` remains
`9eead9978070d29fe7066c9a640e2d85d7616bc1`; PR #5 is merged and its branch was
not updated. This is the sole product-writing worktree. The original archived
checkout, other projects and the separate concept-work agent were untouched.

## Evidence and source boundaries

The machine-readable receipt is
[`evals/hosts/results/2026-09-13.json`](../evals/hosts/results/2026-09-13.json).
It contains 24 scenario/phase records, six explicit core-case checker results,
source revisions/digests, image identities, permission modes, exact assertion
commands/exits, target refs/signatures, read-only hashes and native provenance.
Failures are retained separately from later checks and recovery phases.

The final tested product snapshot is
`3e98a00e62ae0ed28aa66459628d1ab71cda6953`, plugin SHA-256
`9f3c47ef1aa5bb2305f76dfed0ac5fe5d68345f797bdb95065eab085cf828c8c`.
The receipt lists earlier frozen snapshots and exactly which plugin files
differ from this one. Snapshot hashes cover sorted snapshot-relative plugin
paths, NUL, file bytes, NUL, exported with `git archive`. Current documentation
and test-wrapper edits do not alter those product bytes. The final PR head
and its required CI result are recorded in the PR body and terminal completion
report, avoiding a self-referential commit hash in this tracked report.

Each real host had an independent container/home/configuration and a frozen
source. Homes were tmpfs, uid/gid 1000, mode 0700; containers had two CPUs and
4 GiB RAM. Existing credential-free vendor images supplied the installed CLIs.
Normal authorised logins were streamed to their supported tmpfs paths, never
to images, Git, command arguments or receipts. All target work used disposable
repositories and local bare remotes. Raw transcripts, Workflow journal, native
session records and synthetic fixture archives remain in the private scratch
directory `C:/Users/eugen/AppData/Local/Temp/docflow-0051-host-tests-20260913`.
Screenshots and credentials are excluded from the published evidence.

Native discovery was checked against actual installed files: 32 plugin files
for Claude Code, Codex and pi, and 30 skill-tree files through OpenCode's nine
symlinks. Every comparison passed and all nine `agents/openai.yaml` sidecars
were present. This is scoped install evidence; pi's package was installed from
the local npm-compatible package path, not newly downloaded from the registry.
There is no new Cowork installation or current-source runtime proof.

## Host observations

| Host and model | Selection, facilities and actual rung | Signing, transport and result |
|---|---|---|
| Claude Code 2.1.269, Opus 5 | Explicit supplied choices reused. Native Workflow rung 1 with ultracode opt-in and allowed Workflow; native Agent rung 2 with `isolation: worktree`. Both requested width 2. | Ordinary manual allowlist, no bypass. Workers signed/pushed without per-agent user prompts. Rung 2 completed both items; rung 1 stopped all integration after alpha's environment failure and preserved concurrent beta plus held claim. |
| Codex 0.154.0, GPT-6 Astra | Explicit supplied choices; native `spawn_agent`, two child threads. Rung 2 after enabling ordinary native session storage on tmpfs. Workers were directed into explicit Git worktrees; initial child cwd was the parent checkout, so isolation was not host-enforced. | Both workers signed/pushed recovery work. Main/held unchanged; alpha and concurrent beta preserved. Earlier ephemeral dispatch failed before either claim with a missing parent thread; that remains a separate failed observation. |
| OpenCode 1.18.30, `opencode/big-pickle` | Explicit supplied choices; two native `task` calls using general subagents and explicitly assigned Git worktrees, rung 2/width 2. Sequential rung 3 was also checked. | Native `--auto` permissions; signed claims/work/local pushes without per-agent prompts. Whole-wave stop and preservation passed. Original native final report failed; a separate read-only reporting repair passed on the clarified instructions. |
| pi 0.84.4, GitHub Copilot probe | Native package discovery succeeded; supplied `gpt-5-mini` route returned HTTP 400 `model_not_supported` before actions. No actual successful wave/rung observation. | Host exit 0 was not success. Copilot auth was ready; saved OpenAI Codex/Anthropic auth checks returned `invalid_state`. Successful bootstrap/lifecycle, workers, signed transport and blocked flow remain pending. `gh` exists but no authenticated operation was tested. |
| Cowork, installed Windows 1.52386.3.0 | Current desktop yielded a loading screen, not a usable attached-target session. No current selection/rung/facility observation. | Historical 1.52386.0 cloud execution produced correct target files but the connector denied target `.git` writes. Its bundle proved only the mirror. Current target signing/push, PR CLI, branches, discovery and lifecycle remain unverified. |

`gh --version` returned 2.23.0 in all four CLI containers. That proves only
binary availability. **No fixture established a hosted GitHub PR workflow or
host-managed GitHub authentication.** The actual source PR was pushed through
the authorised worker environment, which is different evidence.

The Claude Workflow journal is `wf_9821ceb7-f3a`. Its native worktree guard
denied one compound Git commit command because it could not verify the
boundary; separate permitted Git commands then succeeded. This was a real
permission boundary and recovery, not a bypass or per-agent user approval.
The Agent run records two native calls with worktree isolation.

Codex's saved parent session records two `spawn_agent` calls. Child threads
`01a09c6e-b627-7aa1-8d33-fd6fc4388288` and
`01a09c6e-f9c2-7621-a1da-96e1fa9b9f63` identify parent
`01a09c6d-d46a-7a71-85cb-6f421b692131`, depth 1, paths `/root/alpha` and
`/root/beta`. The receipt includes sanitised session headers; the coordinator
independently inspected them and the signed target refs.

## Observable acceptance

| Requirement | Result and limit |
|---|---|
| Four non-Claude-Code rows plus Claude native rungs | **Partially verified.** All rows describe actual observations, but pi/Cowork do not meet ADR 0015 AC5 successful lifecycle/wave requirements. Claude rungs 1/2 are directly observed. |
| Separate-worktree bootstrap followed by two eligible items and a later environment gate failure | **Verified on Codex/OpenCode.** Fresh fixture clones retain each host's actual successful signed bootstrap history; preparation adds accepted test decisions and the trap before the fresh-checkout probe. Two eligible items and one held claim are present. Pi/Cowork remain blocked. |
| Whole-wave stop and concurrent preservation | **Verified on Claude Workflow, Codex and OpenCode.** Base gate passed, alpha later failed with `ERR_MODULE_NOT_FOUND`, no main integration followed, concurrent beta and unrelated held work survived. Sequential Codex/OpenCode controls kept beta unstarted. |
| Signed worker commits/pushes | **Verified to local bare remotes** on the three successful CLI hosts. Independent `%G?=G` checks, branch/ref comparisons and actual native tool/session evidence; no hosted inference. |
| Installation/discovery including sidecars | **Verified on four CLI paths**, with exact byte comparisons and all nine sidecars. Current Cowork remains pending. Structured interactive selection controls were not exercised; approved inputs were reused. |
| README observed rows, no assumed marker | **Verified.** Historical failed observations and limits remain explicit. |
| INDEX/revision/gates | **Verified locally.** INDEX regenerated from 50 metadata blocks with no content change; r5 retained and new evidence revisions appended. Version remains 0.9.4 in all manifests. |
| Full five-host release acceptance | **Blocked.** Six core cases plus wave have mapped native evidence; successful current pi/Cowork cases remain outstanding. No todo-to-done or Accepted-to-Implemented completion is prepared. |

## Core release cases and defects

The supported independent-host route is documented in
[`evals/hosts/README.md`](../evals/hosts/README.md). Each named case was mapped
to real execution and independent assertions; the six core checker exits are
all 0. The additional Workflow wave case has its own native/state/report
evidence. The custom `behavioural.workflow.mjs` itself was not executed as a
full suite: its injected globals and top-level return are not plain Node.

| Core case | Evidence |
|---|---|
| Full bootstrap | Claude Code/Codex target file tree, unchanged gate, tracked files, clean signed commits and report checks. |
| Express bootstrap | OpenCode fixed minimal profile, no queue/coordination, target commits and report. Five checker controls accept plain/code/bold express and reject guided/full. |
| New decision | Repaired separate-worktree bootstraps on all three successful hosts: exactly one Implemented seed plus one Proposed decision, contiguous numbering and linked INDEX metadata. |
| Ship item | Claude Code actual integration of verified claim `0007-alpha`; signed main `3f4337c8dd5292ddcb01980b7f7678069bd74efc`, work footer `06c49407775c4e6c744cd2aa5182ecd65ac0ccbb`, remote equality and unchanged beta/held/INDEX statuses. |
| Range migration | Fresh Codex dry run independently hash/HEAD checked before approval, then exact map `0101→0004`, `0102→0005`, unchanged seed/other numbers; sections, active links, INDEX and complete done-file bytes checked. Repaired post-audit passes current catalogue checks. |
| Coordination migration | Claude Code nested-root migration preserves the live owner/blocker/ref and custom note, removes only obsolete files/rules, keeps the exact gate and passes all 12 additional checks. |

Original failures were not erased:

- OpenCode's baseline INDEX rows omitted links. Bootstrap/new-adr now explicitly
  require links to actual files and metadata comparison; fresh repaired runs
  pass on Claude Code, Codex and OpenCode.
- The old legacy fixture lacked required technology sections. A stricter
  assertion reproduced the failure; fixture-only repairs added those sections
  and current reporting/status scaffolding. The original migrated target still
  fails the stronger section-order checker. Its older weaker exit-0 receipt is
  labelled separately.
- The original range dry-run receipt was overwritten by a mistaken check after
  authorised apply. The later failed check is labelled **post-apply recheck**,
  not dry-run mutation. The original durable receipt is unavailable; acceptance
  relies on the fresh v2 dry-run proof collected before its apply phase.
- Audit initially rejected required preserved historical done references and
  scoped Overall to a passing migration despite unrelated failed checks.
  Guidance now resolves full historical file identity through commit/tree
  evidence and aggregates the requested audit. Positive post-audits left
  bytes/HEAD/status unchanged. A fresh negative owner path
  `0101-unrelated-missing-file.md` was correctly rejected for link and coverage
  despite sharing a mapped number; this negative audit was also read-only.
- OpenCode's native wave final response used `Overall: ready` and a prefixed
  wave heading. State assertions passed, report assertions failed. Clarified
  ready/outcome mapping and exact headings passed a separate read-only report
  phase; the first native execution remains a report failure.
- A broad beta-output checker mistook an unregistered diagnostic copy for
  attempted work. A separate gate-only commit narrowed it to registered Git
  worktrees; regression controls still reject actual beta work. Existing
  completion history is compared by Git tree on main and preserved claims,
  with a negative history-rewrite control.
- Ephemeral Codex dispatch could not find its parent thread. A fresh fixture
  with native session storage succeeded under the same permissions.
- Workflow ship/range fixtures no longer prohibit the very commits needed for
  completion and migration-map evidence. Their wrapper syntax passes, but no
  execution of that full wrapper is claimed.

Optional hygiene and unrelated synthetic fixture limitations remain visible:
range history has placeholder shipping hashes and an unsigned initial commit
against a signing convention; coordination lacks a Reporting convention.
These are not migration-state passes for the entire repository. Both corrected
post-audits report the remaining scope honestly.

## Validation, review and cleanup

- `node scripts/verify.mjs`: exit 0,
  `verify: OK (version 0.9.4, 9 skills, 50 ADRs, 64 shipped plan items)`.
- `node scripts/verify-mutations.mjs`: exit 0,
  `verify mutations: OK (15 rejected mutations)`.
- `node evals/run.mjs`: exit 0, **6 passed, 0 failed, 6 skipped**. Those six
  skips are unexecuted by that command; mapped native receipts are separate.
- `python -B evals/hosts/test_check_wave.py`: exit 0, two tests covering nine
  regression scenarios, `Ran 2 tests in 17.927s`, `OK`.
- `test-host-assertions.py`: exit 0, eight positive/negative controls pass.
- `test-release-assertions.mjs`: exit 0, five depth/Markdown controls pass.
- Custom Workflow body syntax: exit 0 after replacing only its exported meta
  declaration for an async-function parser check; no native execution claimed.

Gate behaviour edits and product edits were separated into signed Conventional
Commits. Broadened checks have named reasons in standalone gate commits;
negative controls preserve their intended detection. ADR edits carry a
Rationale footer. No Co-Authored-By trailers or revision tags were added.

Cleanup completed for exactly `docflow-0051-claude`, `docflow-0051-codex`,
`docflow-0051-opencode` and `docflow-0051-pi`, after checking their ownership
labels and preserving sanitised receipts, private fixture archives and
synthetic public signing keys. Their tmpfs authentication/session/private-key
material was discarded. Homes were not archived; selected native test-session
evidence was preserved separately. No unrelated container or image was
removed. The source worktree remains available. Archive hashes are in the
receipt. Required CI on the pushed PR head is recorded in the final PR report.

## Remaining operator input

1. In the supported pi UI, complete `/login` → OpenAI Codex through its browser
   flow. Reuse that refreshed local login securely, verify the advertised route
   works, then run the missing bootstrap/lifecycle and wave cases. Do not send
   credentials in text. The coordinator's existing question remains pending.
2. Provide a usable supported Cowork session with the disposable target folder
   and actual target Git capability. Recheck installation, bootstrap/lifecycle,
   selection/rung/facilities and signed claim/push/blocked flow against that
   target. Do not substitute Claude CLI, a cloud mirror or a bundle for it.
3. Complete acceptance evidence, then prepare the atomic todo/ADR/INDEX move on
   the PR branch and seek review. A ready unmerged PR is still live; merging or
   releasing requires separate authorisation.

## Status at a glance

- **This run:** prepared PR #6 fixes and bounded exact-source host evidence;
  the listed local gates and independent core case checks passed. Original
  failures, reporting recovery and unavailable evidence remain explicit.
- **Overall:** partially verified — 0051 and the complete five-host release
  requirement remain blocked on pi and Cowork.
- **Yet to do:** the operator/runtime steps above and their real-host checks;
  required CI on the pushed PR head. No item completion, merge or release is
  claimed here.
