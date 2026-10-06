---
adr: 0060
title: V1 package target set — eight coding agents
status: Accepted
date: 2026-09-19
owner: Eugenio Minardi
supersedes: ["0015"]
superseded-by:
depends-on: ["0009"]
tags: [packaging, portability, targets, v1]
---

# ADR 0060 — V1 package target set — eight coding agents

## Context

adr/0015-multi-target-portability.md fixed docflow's package targets at five
coding agents (Claude Code, Claude Cowork, pi, Codex, OpenCode) and the
portability model behind them: one `plugins/docflow/skills/` tree, per-host
packaging, agent-neutral prose. The operator mandate of 2026-09-19 retired
Claude Cowork as a target and set the V1 package target set to eight agents:
Claude Code, pi, Codex, OpenCode, **Grok**, **Cursor**, **omp** (oh-my-pi)
and **Copilot**. The portability principles and the per-host packaging model of
adr/0015 are unchanged; only the target list moves. This ADR therefore
supersedes adr/0015 as far as the target set goes.

## Capability statement

One skill source (`plugins/docflow/skills/`) serves eight package targets,
each through its native discovery path. The output surface (`AGENTS.md`, the
ADR catalogue, `plan/`, `_agent/`) remains agent-agnostic Markdown.

| Target | Packaging | Load path |
|---|---|---|
| Claude Code | `.claude-plugin/plugin.json` + `.claude-plugin/marketplace.json` | plugin marketplace |
| pi | `package.json` `pi.skills` | npm / git install |
| Codex | `.codex-plugin/plugin.json` + `.agents/plugins/marketplace.json` | `codex plugin marketplace` |
| OpenCode | none | auto-discovers `.claude`/`.agents`/`.opencode` skills |
| Grok | `.grok-plugin/plugin.json` + `.grok-plugin/marketplace.json` | `grok plugin marketplace` |
| Cursor | `.cursor-plugin/plugin.json` + `.cursor-plugin/marketplace.json` | `cursor-agent --plugin-dir` / repository marketplace |
| omp (oh-my-pi) | `.omp-plugin/plugin.json` + `.omp-plugin/marketplace.json` and the pi manifest | `omp plugin install` / `omp plugin marketplace` |
| Copilot | the Claude-compatible `.claude-plugin/` packaging | `copilot plugin marketplace` / `copilot --plugin-dir` |

Claude Cowork is retired: it is removed from every manifest, marketplace,
guide, document and unaffected eval and from the verify gate's target
expectations. No target-specific skill prose is added; host-specific
invocation forms stay in `README.md`.

## User stories / scenarios

- As a Grok user, I want to install docflow from a Grok marketplace and run
  the same skills through Grok's slash menu.
- As a Cursor user, I want to point `cursor-agent` at a local plugin directory
  and get the skills without an account marketplace step.
- As an omp or Copilot user, I want docflow installed through my host's own
  plugin facility from the same one skill source.
- As the maintainer, I want the version-sync and target-parity checks to cover
  every manifest, so adding or retiring a target cannot silently drift.

## Acceptance criteria

1. The V1 package target set is exactly Claude Code, pi, Codex, OpenCode,
   Grok, Cursor, omp and Copilot; Claude Cowork is not a target.
2. Each target resolves the one `plugins/docflow/skills/` tree: Grok, Cursor
   and omp ship native plugin/marketplace manifests; Copilot loads the
   Claude-compatible plugin; OpenCode auto-discovers; pi and omp load the pi
   package manifest. Skill prose stays agent-neutral.
3. Claude Cowork is removed from the manifests, marketplaces, `README.md`,
   `USAGE.md`, `docs/`, the workspace guides and the affected evals, and from
   the verify gate's target expectations.
4. `scripts/verify.mjs` version-syncs every plugin manifest
   (`package.json`, `.claude-plugin`, `.codex-plugin`, `.grok-plugin`,
   `.cursor-plugin`, `.omp-plugin`) and checks that every target's packaging
   files exist and that every marketplace lists the plugin.
5. Package-level load proof is recorded for each new target: Grok manifest
   validation and marketplace listing, Cursor plugin-directory load, omp
   install/marketplace resolution, and Copilot plugin and skill loading.
6. adr/0015 is superseded with reciprocal metadata and `INDEX.md` is
   regenerated.

## Out of scope

- Native behavioural qualification on the eight-target package; the final
  qualification round is a separate brief on these bytes.
- Any release, tag or version bump: the version stays 0.9.4.

## Open questions

None.

## References

- adr/0015-multi-target-portability.md (superseded as far as the target set goes)
- adr/0009-distribution-marketplace-npm.md (distribution channels)
- Operator mandate note,
  `.docflow_workspace/mandates/2026-09-19-v1-targets-guides-and-docs.md`
  at revision `9cb44c413f8b3e2818e8890e8546d5e8029f2e06`.
- Workspace decision `v1-targets-and-host-guides--4e62199cc541`.

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-09-19 | r1 | Eugenio Minardi | Initial decision: retire Cowork and set the eight-target V1 package set; supersedes adr/0015 as far as the target set goes. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Operator | Eugenio Minardi | 2026-09-19 | operator mandate note 9cb44c4 |
