---
adr: 0012
title: Behavioural and end-to-end evaluation of skill outcomes
status: Implemented
date: 2026-06-01
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0001", "0011"]
tags: [testing, quality, evals]
---

# ADR 0012 — Behavioural and end-to-end evaluation of skill outcomes

## Context

Static validation (adr/0011-static-skill-validation.md) proves a skill is
well-formed, not that it *does the right thing*. A skill is a set of
instructions to a coding agent, so its real behaviour is only observable
by running it and inspecting the result. This is the "e2e test" tier:
run a skill against a controlled fixture repository and assert the
outcome. It is heavier and model-in-the-loop, so it is flakier and
slower than the static tier and need not gate every commit.

## Capability statement

docflow evaluates skill behaviour end-to-end by executing a skill against
a **fixture repository** and asserting the resulting state. Representative
evals:

- `/bootstrap` a scratch repo with a fixed set of assessment answers,
  then assert the expected file tree exists (`AGENTS.md`,
  `CONVENTIONS.md`, `adr/0000-template.md`, `plan/`, `_agent/`) and key
  conventions are present.
- `/new-adr` against a bootstrapped fixture, then assert the next
  contiguous number was chosen and `INDEX.md` regenerated to match.
- `/ship-item` against a fixture with a queued item, then assert the
  `todo`→`done` move and the owning ADR's `Accepted`→`Implemented`
  advance.

The eval harness reuses the fixtures and assertion helpers from the
static tier where possible. It runs as a release-gating suite rather than
on every push.

**Runner.** Use the host's own subagent mechanism where available, a real
vendor CLI in an independent disposable Docker container, or native Cowork
desktop with a disposable attached target. These routes execute the installed
skills with scripted operator answers. A
separate deterministic process judges the resulting files, git history,
gate result and final report. Never replace a vendor host with another
host and call it a portability pass. Record source commit and content
digest, host version, model, discovery path, permissions and limitations.

Containers use read-only plugin snapshots and disposable fixture repos;
credentials stay out of images, source trees and reports. Local fixture
remotes and unsigned synthetic commits do not prove GitHub or signing
permissions. A desktop login, VM blocker, timeout or skipped case remains
pending or failed. Model process exit zero alone never proves a pass.
Subagent worktrees see committed refs. A read-only snapshot may test local
edits, but must identify its digest and cannot claim to test a later commit.
Native desktop runs record their platform, installed source and actual target
separately from container isolation. A visible UI or open folder picker alone
does not prove attachment, model execution or target Git access.

## User stories / scenarios

- As a maintainer, I want to confirm a skill still produces the right
  repository state after an edit, so behavioural regressions are caught.
- As a release manager, I want an e2e suite green before publishing, so a
  broken skill never ships to users.

## Acceptance criteria

1. An eval harness can run a named skill against a fixture repo with
   scripted inputs and assert the resulting file tree / content.
2. At least `bootstrap`, `new-adr`, and `ship-item` have a behavioural
   eval.
3. The suite is runnable on demand and designated as a release gate
   (distinct from the per-push static gate).
4. Flaky, model-dependent assertions are tolerant of incidental wording
   while strict on structural outcomes (file existence, numbering, status
   transitions).

## Out of scope

- Structural well-formedness of the skills themselves — covered by
  adr/0011-static-skill-validation.md.

## Open questions

- ~~Which runner executes the agent in CI headlessly, and whether evals
  run against a pinned model?~~ Resolved in r4: native subagents and isolated real vendor hosts are
  supported; report the exact host and model used. Demonstrated by running `new-adr` through
  a worktree subagent and verifying with the static gate. See Capability
  statement §Runner.

## References

- adr/0011-static-skill-validation.md
- adr/0007-lifecycle-skills.md
- `evals/hosts/README.md` (explicit six-case plus wave mapping)
- `audits/2026-09-13-host-verification.md` (results, original failures and limits)
- `audits/2026-09-13-pi-qwen-continuation.md` (native Pi repair/retry and temporal assertion controls)
- `audits/2026-09-14-cowork-continuation.md` (native target lifecycle, signed concurrent wave, seed-reference regression and retained permission failures)

- `audits/2026-09-14-release-verification.md` (operator continuation: exact Git-byte installs, claim/denial regressions, native release cases and isolated existing-repository pilot)

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-01 | r1 | Eugenio Minardi | Initial decision. |
| 2026-06-02 | r2 | Eugenio Minardi | Resolved runner open question: host subagent mechanism (worktree Agent/Workflow), no external CLI/pinned model. Noted committed-state worktree consequence. Demonstrated via a new-adr subagent eval. |
| 2026-06-02 | r3 | Eugenio Minardi | Implemented (plan item 0002): evals/ deterministic layer + behavioural.workflow.mjs; all three subagent evals (new-adr, ship-item, bootstrap) PASS against HEAD. Status Accepted → Implemented. |
| 2026-09-11 | r4 | Eugenio Minardi | Reopen for the approved wave regressions and independent Docker host harness. Operator explicitly authorised real vendor CLI/desktop runs; observable outcomes, not model self-report, determine pass. |
| 2026-09-13 | r5 | Codex, operator-authorised | Execute all six core model cases plus wave through the documented real-host route with independent target/report checks. Repair malformed legacy fixture sections, incidental Markdown assertions, real ship/migration history, historical identity audit and native-session dispatch. Preserve failed runs, overwritten-receipt limitations and reporting-only recovery. Deterministic six skips remain skips; the custom Workflow suite itself was not run. Keep Accepted while the owning five-host release work remains blocked. |
| 2026-09-14 | r6 | Codex, operator-authorised | Preserve native Pi provider/model/thinking defaults and add completed-event claim/integration checks, including batched output and arbitrary push source refs. Retain original failures, bounded off repair/retry passes, off positive contract failure, high positive repetition and the inconclusive recovered interruption. The corrective high run passes stop-flow/acquisition checks but its published initial claim omits the branch name. Bound installed bytes to the tested Windows export, with Git-blob equality only after line-ending normalisation. Six deterministic skips remain skips; full Pi/Cowork acceptance remains incomplete. |
| 2026-09-14 | r7 | Codex, operator-authorised | Distinguish native Windows Cowork fixtures from CLI containers. Independently verify actual-target signing, bootstrap/new-adr and an opted-in concurrent Workflow wave with preserved blocked work and held claim. Original child events verify acquisition ordering; retain the manifest timestamp correction and unavailable parent failure receipt. A stricter seed-reference check exposes the original generic footer; 14 regressions and a fresh native bootstrap on repaired eff3130 pass. Preserve initial unlink denial, supported recovery in existing Skip approvals mode and the separate post-wave export boundary violation. Six deterministic skips remain skips; full release acceptance remains incomplete. |
| 2026-09-14 | r8 | Codex, operator-authorised | Execute the four-task release continuation on exact Git blobs from bef25d8. Strengthen initial published claim and completed-event checks; add a focused native Cowork export-denial regression and preserve broader permission failures. Verify fresh native release cases and an attended isolated Clarity completion/stop pilot with unchanged history and Docker-only gates. Record separate incidental Markdown checker repairs, original failures and the Docker Desktop interruption. The current audit/receipt bounds every result; deterministic six skips remain skips and Accepted status remains until full release evidence is complete. |
| 2026-09-14 | r9 | Codex, operator-authorised | Verify all six mapped model cases and the five-host release requirement on exact bef25d8 Git bytes. Fresh native-high Pi bootstrap, normal completion and bootstrap-derived blocked execution pass initial publication, completed-event ordering, signed-state, persisted-report and fresh-clone checks. Preserve staged OpenCode reporting correction, native/controller failures and evidence limits. Prepare Implemented with 0051 on PR #7; effective only on its authorised checked merge. The deterministic six skips remain skips; the separate native-host route supplies their execution. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-06-01 | — |
| Maintainer | Eugenio Minardi | 2026-09-11 | Approved in operator session; PR #5 expansion |
| Operator | Eugenio Minardi | 2026-09-13 | Explicit 0051 continuation includes independent behavioural release checks and necessary repairs |
| Operator | Eugenio Minardi | 2026-09-13 | Local-provider Pi continuation and necessary runner/assertion repairs authorised; full five-host exit criteria retained |
| Operator | Eugenio Minardi | 2026-09-14 | Unlocked/visible native Cowork continuation and necessary evidence updates authorised; no support or exit-criteria reduction |
| Operator | Eugenio Minardi | 2026-09-14 | Explicit new-worktree handoff authorises all four verification/fix tasks and a new draft PR; no merge, release, paid service or support reduction |
| Operator | Eugenio Minardi | 2026-09-14 | Existing four-task authorisation applied to independently verified criteria; completion prepared for PR #7, no merge or release approval |
