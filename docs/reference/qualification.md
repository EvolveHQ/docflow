---
title: Host guides and qualification
permalink: /reference/qualification/
section: Reference
---

# Host guides and qualification

The **eight package installation targets** and **seven workspace host guides** are different sets. An app, CLI and editor can expose different files and handoff surfaces. Choose the actual host, not just a model name.

## Seven workspace host guides

These guides cover context and bounded brief/receipt handoffs, not package installation. All seven native guide smokes remain **unrun** in the released guide inventory.

| Host guide | Surface and scope | Native smoke |
|---|---|---|
| [Claude Code](https://github.com/EvolveHQ/docflow/blob/main/plugins/docflow/workspace/guides/claude-code.md) | CLI context and handoff | Unrun |
| [Codex App](https://github.com/EvolveHQ/docflow/blob/main/plugins/docflow/workspace/guides/codex-app.md) | App context; distinct from CLI installation | Unrun |
| [Cursor](https://github.com/EvolveHQ/docflow/blob/main/plugins/docflow/workspace/guides/cursor.md) | Editor context; distinct from Agent CLI | Unrun; recorded editor CLI access blocked |
| [DeepSeek Harness](https://github.com/EvolveHQ/docflow/blob/main/plugins/docflow/workspace/guides/deepseek-harness.md) | Its actual harness; not pi with a DeepSeek model | Unrun |
| [Herdr](https://github.com/EvolveHQ/docflow/blob/main/plugins/docflow/workspace/guides/herdr.md) | Advanced terminal handoff and return | Unrun |
| [VS Code agent mode](https://github.com/EvolveHQ/docflow/blob/main/plugins/docflow/workspace/guides/vscode-agent-mode.md) | Editor context; distinct from Copilot CLI | Unrun |
| [Orca](https://github.com/EvolveHQ/docflow/blob/main/plugins/docflow/workspace/guides/orca.md) | Advanced native task handoff | Unrun |

## What has and has not been established

Version 0.10.0 supplies portable records, fourteen skills and deterministic package checks. The guide entry points have source/help evidence; this does not establish installation or model-driven execution. Full native qualification of the combined eight-target package remains pending.

The [guide inventory](https://github.com/EvolveHQ/docflow/blob/main/plugins/docflow/workspace/guides/README.md) retains per-host source dates and limits. The [release notes]({{ '/release-notes/' | relative_url }}) describe the released scope. Ordinary-file reading remains available without a companion app.

## Maintainer checks

The source repository’s `node scripts/verify.mjs` and `node evals/run.mjs` are maintainer gates, not adopter setup commands. Fixture assembly, host smoke procedures and manifests belong to this reference layer. A local Pages build or passing hostless evaluation does not qualify a native host or grant publication authority.
