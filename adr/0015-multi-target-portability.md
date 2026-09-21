---
adr: 0015
title: Multi-target portability — one skill source, many coding agents
status: Superseded
date: 2026-06-03
owner: Eugenio Minardi
supersedes: ["0008"]
superseded-by: ["0060"]
depends-on: ["0001", "0007", "0009"]
tags: [packaging, portability, distribution]
---

# ADR 0015 — Multi-target portability — one skill source, many coding agents

## Context

adr/0008-dual-target-packaging.md ships docflow's skills to two coding
agents (Claude Code and pi) from one `skills/` tree. The `SKILL.md`
format (`name` + `description` frontmatter, agent-neutral Markdown body)
has since converged across several agents, and the scaffolded output is
plain Markdown read natively by anything that consumes `AGENTS.md`. So the
dual-target decision is too narrow: docflow can support **Claude Code,
Claude Cowork, pi, Codex, and OpenCode** from the same source with no
porting. This ADR generalises 0008 and therefore supersedes it.

## Capability statement

docflow has **two portability surfaces**, supported across all target
agents from one source:

- **Output surface** — `AGENTS.md`, the ADR catalogue, `plan/`, `_agent/`
  — is plain Markdown, **agent-agnostic**. Read natively by any agent
  that consumes `AGENTS.md` (Claude Code, Cowork, pi, Codex, OpenCode,
  and others). Free everywhere.
- **Skill surface** — the `skills/*/SKILL.md` files — ships per host via
  that host's discovery path. The format is shared, the prose is
  agent-neutral (adr/0008-dual-target-packaging.md's rule, enforced by
  the verify gate), and skill names satisfy the strictest constraint
  (`^[a-z0-9]+(-[a-z0-9]+)*$`), so one tree serves every target.

Per-target packaging / install:

| Agent | Output | Skills install | Invocation |
|---|---|---|---|
| Claude Code | native | `/plugin marketplace add EvolveHQ/docflow` → install (`.claude-plugin/`) | `/bootstrap` |
| Claude Cowork | native | **same Claude Code plugin** (Cowork shares the plugin/marketplace system) | `/bootstrap` |
| pi | native | `pi install npm:@evolvehq/docflow` (`package.json` `pi.skills`) | `/skill:bootstrap` |
| Codex | native | **native plugin** — `codex plugin marketplace add EvolveHQ/docflow` → `codex plugin add docflow@evolvehq` (`.codex-plugin/` + `.agents/plugins/marketplace.json`) | `$bootstrap` / `/skills` |
| OpenCode | native | reads `.claude/skills` · `.agents/skills` · `.opencode/skills` — auto-discovers a Claude Code / Codex install, or copy into `.opencode/skills/` | auto-load by description |

Note: `~/.agents/skills/` is read by **both** Codex and OpenCode, and
`~/.claude/skills/` by **both** Claude Code and OpenCode — so a single
install often serves two agents. Cowork needs no extra packaging — it
installs the existing Claude Code plugin.

## User stories / scenarios

- As a Codex user, I want to install docflow's skills into a path Codex
  scans, then drive the same ADR workflow.
- As an OpenCode user, I want docflow's skills auto-discovered with no
  per-skill setup.
- As a Cowork user, I want to install docflow from the plugin marketplace
  exactly like Claude Code.
- As the maintainer, I want one `skills/` tree to serve all of them.

## Acceptance criteria

1. README + site document install **and** invocation for Claude Code,
   Cowork, pi, Codex, and OpenCode, with a support matrix.
2. The single `skills/` tree serves all targets unchanged: skill names
   match `^[a-z0-9]+(-[a-z0-9]+)*$` and bodies stay agent-neutral (verify
   gate enforces).
3. Cowork is documented as covered by the existing Claude Code plugin
   packaging (no separate manifest).
4. Codex ships a **native plugin** (`.codex-plugin/plugin.json` +
   `.agents/plugins/marketplace.json`) installable via `codex plugin
   marketplace add`; OpenCode install (auto-discovery / symlink) is
   documented. The verify gate version-syncs all three plugin manifests.
5. **Behavioural verification:** `bootstrap` plus one lifecycle skill run
   successfully on all five named hosts, and agent-wave is exercised with
   observed host rungs and blocked-at-verify behaviour. Results identify the
   source revision, host/model, permissions and limitations. Unperformed
   checks remain pending and cannot satisfy this criterion.
6. ADR 0008 is superseded by this ADR.

## Out of scope

- A native one-command installer for **OpenCode** — it has no marketplace
  command for `SKILL.md` skills (its plugin system is npm JS plugins), so
  it installs by auto-discovery of a shared skills directory or a symlink.
  (**Codex** *does* have a plugin marketplace, so docflow ships a Codex
  plugin — see r2 below.)
- Targets beyond the five named (Cursor, Gemini CLI, Aider, …) — their
  output surface likely works via `AGENTS.md`, but skill support is
  per-host and out of scope here.

## Open questions

- None.

## References

- adr/0008-dual-target-packaging.md (superseded by this ADR)
- adr/0009-distribution-marketplace-npm.md (the Claude Code / npm channels)
- adr/0007-lifecycle-skills.md
- `DocflowHQ/.docflow_workspace/local/archive/member-audits/docflow/2026-09-13-host-verification.md` and `evals/hosts/results/2026-09-13.json`
  (earlier bounded observations, including retained pi/Cowork blockers)
- `DocflowHQ/.docflow_workspace/local/archive/member-audits/docflow/2026-09-13-pi-qwen-continuation.md` and `evals/hosts/results/2026-09-13-pi-qwen.json`
  (Pi local-provider continuation; full Pi/Cowork acceptance remains outstanding)
- `DocflowHQ/.docflow_workspace/local/archive/member-audits/docflow/2026-09-14-cowork-continuation.md` and `evals/hosts/results/2026-09-14-cowork.json`
  (native Windows actual-target signing/lifecycle/Workflow wave, repaired seed bootstrap and retained permission/source limitations)

- `DocflowHQ/.docflow_workspace/local/archive/member-audits/docflow/2026-09-14-release-verification.md` and `evals/hosts/results/2026-09-14-release-verification.json`
  (fresh exact-Git-byte installations and scoped native outcomes; original failures and infrastructure interruption retained)

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-03 | r1 | Eugenio Minardi | Initial decision. Generalises and supersedes ADR 0008 (dual-target) to multi-target: Claude Code, Cowork, pi, Codex, OpenCode from one skill source. |
| 2026-06-03 | r2 | Eugenio Minardi | Codex has a native plugin marketplace (initial r1 wrongly scoped a one-command Codex installer out). Add a native Codex plugin (`.codex-plugin/` + `.agents/plugins/marketplace.json`); verify gate version-syncs three manifests; AC4 + Out-of-scope revised. |
| 2026-06-04 | r3 | Eugenio Minardi | Codex requires the plugin (incl. its skills) in a subdirectory — root `source: "."`/`"./"` does not resolve. Restructure to `plugins/docflow/` holding the skills + all three plugin manifests; both marketplaces point to `./plugins/docflow`; `package.json` (`pi.skills`/`files`) + `verify.mjs` repointed. **Verified on real Codex** (`marketplace add` → `plugin add docflow@evolvehq` → all 8 skills installed). |
| 2026-06-29 | r4 | Eugenio Minardi | Implemented. AC5 met: maintainer confirms `bootstrap` + lifecycle skills run on **Codex, OpenCode, and Cowork** via real usage (also pi, and mimocode beyond the documented five). plan 0010 → done. |
| 2026-09-11 | r5 | Eugenio Minardi | Reopen AC5 for the current coordination changes: verify bootstrap, a lifecycle action, and wave execution on each named host. Record observed capability rungs, authentication, signing/push and desktop limitations; historical usage is not current-revision evidence. |
| 2026-09-13 | r6 | Codex, operator-authorised | Record dedicated PR #6 evidence: Claude Code native Workflow/Agent rungs and signed local transport; Codex/OpenCode native workers with explicit Git worktrees and preserved concurrent blocked work; exact-source bootstrap/lifecycle and sidecar checks. Preserve original failures and targeted report repairs. AC5 remains unmet on pi and Cowork; support scope unchanged, status remains Accepted. |
| 2026-09-14 | r7 | Codex, operator-authorised | Honour Pi's local Qwen route; record separate bootstrap repair/new-adr and sequential blocked-wave passes with thinking off, retaining original gate-command and stop failures. The runner now preserves native high: its positive control repeated generation, the first blocked run was interrupted after recovery, and the corrective blocked run passes stop-flow checks but fails published claim metadata. Installed bytes match the tested Windows export; Git blobs match only after line-ending normalisation. Signed transport remains local-only. Cowork awaits operator foreground and actual target-Git checks; AC5 and Accepted status are unchanged. |
| 2026-09-14 | r8 | Codex, operator-authorised | Observe native Windows Desktop 1.52386.6 / Opus 5 Max on the actual attached target: signed bootstrap/new-adr and opted-in Workflow rung 1 preserve concurrent signed local claims/work after the gate failure. Initial unlink denial recovers through supported target-scoped permission in existing Skip approvals mode; native gh is absent. Verify all 32 loaded export files and nine sidecars for original 13ea0c2 and repaired eff3130; the latter receives only a targeted fresh bootstrap pass after the seed-reference defect. Preserve the post-wave export denial violation, corrected native timestamp and CRLF/Git source boundary. Pi full-contract evidence and release review remain incomplete; AC5 and Accepted status are unchanged. |
| 2026-09-14 | r9 | Codex, operator-authorised | Continue all five targets on the unchanged 32-file bef25d8 plugin snapshot, including nine sidecars, with no line-ending normalisation. Native-high Pi normal execution now passes initial branch metadata, Status-only publication, acquisition ordering, completion and fresh-clone gates. Fresh CLI bootstrap/lifecycle/migration and native delegation cases, Cowork actual-target lifecycle plus focused export-denial stop, and retained failed attempts are recorded in the current audit. Docker Desktop loss interrupts a separate Pi bootstrap; local Qwen/high remains selected. Keep AC5 and Accepted status pending remaining complete-contract observations; support scope is unchanged. |
| 2026-09-14 | r10 | Codex, operator-authorised | Verify AC5 on all five named hosts from the unchanged 32-file bef25d8 snapshot. Fresh local Qwen/high Pi bootstrap/new-decision and normal/blocked waves pass independently; Claude Code native Workflow/isolated Agent, Codex/OpenCode native workers and Cowork actual-target Workflow evidence retain their permission and transport limits. OpenCode uses a distinct native reporting correction; original failures remain. Prepare Implemented and 0051 completion on PR #7, effective only on its authorised checked merge; support scope unchanged. |
| 2026-09-19 | r11 | Eugenio Minardi | Superseded as far as the target set goes by adr/0060-v1-package-target-set.md: the operator mandate of 2026-09-19 retires Cowork and sets the eight-target V1 package set. The portability model and per-host packaging in this ADR carry forward unchanged. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-06-03 | — |
| Maintainer | Eugenio Minardi | 2026-09-11 | Approved in operator session; PR #5 expansion |
| Operator | Eugenio Minardi | 2026-09-13 | Explicit dedicated-worktree continuation and necessary fixes authorised for 0051; no merge or release approval |
| Operator | Eugenio Minardi | 2026-09-13 | Pi continuation explicitly selects the existing local Qwen provider; necessary repairs and PR #6 update authorised, Cowork acceptance still required |
| Operator | Eugenio Minardi | 2026-09-14 | Native Cowork continuation after desktop unlock/foreground confirmation authorised; actual target evidence still required |
| Operator | Eugenio Minardi | 2026-09-14 | Explicit four-task continuation in a new worktree, existing local Qwen/high route, native fixtures and new draft PR authorised; no merge/release or reduced acceptance |
| Operator | Eugenio Minardi | 2026-09-14 | Existing four-task authorisation applied to independently verified criteria; completion prepared for PR #7, no merge or release approval |
