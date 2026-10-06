# 0072 — V1 package targets and workspace host guides

Owning decisions: adr/0060-v1-package-target-set.md (new; supersedes
adr/0015 as far as the target set goes), adr/0061-v1-workspace-host-guides.md
(new), and adr/0059-five-workspace-commands-and-mandate-note.md where the
guide-set wording is updated.

## Status

- **Claimed by:** pi, docflow-v1 delivery, 2026-09-19, branch
  `kmox83/docflow-v1-targets-docs`.
- **Blockers:** None for the package and guide changes. Native smoke runs for
  Herdr and VS Code agent mode belong to the separate final qualification
  round and are not claimed here.
- **Stopped:**

## Scope

Move the package target set to Claude Code, pi, Codex, OpenCode, Grok, Cursor,
omp and Copilot; retire Cowork from the manifests, marketplaces, docs, guides
and affected evals. Add native Grok, Cursor and omp packaging and prove each
loads; keep Copilot on the Claude-compatible plugin and repair the three skill
descriptions that its YAML parser rejected. Move the workspace host guide set
to Claude Code, Codex App, Cursor, DeepSeek harness, Herdr, VS Code agent mode
and Orca; remove ZCode and add the Herdr and VS Code agent mode guides.
Version-sync every manifest in the verify gate and check target parity. Keep
the single skill source, agent-neutral skill prose, versions at 0.9.4, en-GB,
and no ADR identifiers in user-visible surfaces.

## Exit criteria

1. adr/0060 criteria 1–6 and adr/0061 criteria 1–5 are implemented.
2. Grok: `grok plugin validate plugins/docflow` passes and `grok plugin
   marketplace add` lists `docflow` with the fourteen skills.
3. Cursor: `cursor-agent --plugin-dir plugins/docflow` loads without error and
   the `.cursor-plugin/` manifests exist.
4. omp: `omp plugin install <repo>` resolves the pi manifest and `omp plugin
   marketplace add` resolves `docflow@evolvehq`.
5. Copilot: `copilot --plugin-dir plugins/docflow skill list` loads all
   fourteen plugin skills with no parse failures.
6. `node scripts/verify.mjs` exits 0, including version sync across all six
   manifests and the new target-parity check; `node evals/run.mjs` exits 0.
7. The guide set is seven, ZCode is gone, and the Herdr guide documents the
   `herdr agent prompt/read/wait`, one-agent-per-tab `<repo>-<goal>` and
   `herdr pane move --new-tab` mapping.

## Receipt

- `node scripts/verify.mjs`: `verify: OK (version 0.9.4, 14 skills, 61 ADRs, 67 shipped plan items)`, exit 0.
- `node evals/run.mjs`: `11 passed, 0 failed, 6 skipped`, exit 0.
- Grok `grok plugin validate plugins/docflow`: `Plugin manifest is valid`, exit 0.
- Grok `grok plugin list --available --json`: `docflow` under marketplace
  `docflow`, `skill_count 14`, exit 0.
- Cursor `cursor-agent --plugin-dir plugins/docflow --list-models`: exit 0;
  plugin-directory load accepted.
- omp `omp plugin install <repo> --json`: exit 0, manifest `skills`
  `./plugins/docflow/skills`; `omp plugin install docflow@evolvehq --dry-run
  --json`: exit 0.
- Copilot `copilot --plugin-dir plugins/docflow plugin list --json`: `docflow`
  `0.9.4`; `copilot skill list`: fourteen plugin skills, no load failures.

## Status at a glance

- **This run:** implemented the eight-target packaging and seven-guide set;
  new-target load proofs recorded; gates green.
- **Overall:** verified code and package, not shipped; the PR is a draft and
  native Herdr/VS Code smoke runs remain separate.
- **Yet to do:** coordinator review and integration, required CI on the PR
  head, and the separate final qualification round.
