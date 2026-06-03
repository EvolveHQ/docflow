---
adr: 0015
title: Multi-target portability — one skill source, many coding agents
status: Accepted
date: 2026-06-03
owner: Eugenio Minardi
supersedes: ["0008"]
superseded-by:
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
   successfully on Codex, OpenCode, and Cowork, with the result recorded.
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

## References / cross-links

- adr/0008-dual-target-packaging.md (superseded by this ADR)
- adr/0009-distribution-marketplace-npm.md (the Claude Code / npm channels)
- adr/0007-lifecycle-skills.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-03 | r1 | Eugenio Minardi | Initial decision. Generalises and supersedes ADR 0008 (dual-target) to multi-target: Claude Code, Cowork, pi, Codex, OpenCode from one skill source. |
| 2026-06-03 | r2 | Eugenio Minardi | Codex has a native plugin marketplace (initial r1 wrongly scoped a one-command Codex installer out). Add a native Codex plugin (`.codex-plugin/` + `.agents/plugins/marketplace.json`); verify gate version-syncs three manifests; AC4 + Out-of-scope revised. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-06-03 | — |
