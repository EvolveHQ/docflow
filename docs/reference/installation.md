---
title: Installation details
permalink: /reference/installation/
section: Reference
---

# Installation details

For the shortest host-specific path, [install from Start here]({{ '/start/#install' | relative_url }}). These details support troubleshooting and local development. The eight targets are Claude Code, pi, Codex, OpenCode, Grok, Cursor, omp and Copilot.

## Complete installed assets

Keep all fourteen `skills/` directories and the complete sibling `workspace/` directory from the **same package revision**. Bootstrap templates remain inside `skills/bootstrap/templates/`.

A symlink to the original skill directory can resolve assets through the retained checkout. A detached **copy** needs the complete matching workspace assets as `docflow-workspace/` beside the host’s `skills/` directory. This also applies to Windows copies; copying only `SKILL.md` is insufficient.

```text
<host configuration>/
├── skills/
│   ├── bootstrap/
│   └── … all fourteen skills
└── docflow-workspace/
    ├── resolve-assets.mjs
    ├── validate.mjs
    └── … complete matching workspace assets
```

Ask the agent to show the actual resolved skill and asset paths before validation. A marketplace installation in one host does not guarantee that another host discovers a shared skills directory. Never overwrite an existing clone or destination skill.

The [packaged asset guide](https://github.com/EvolveHQ/docflow/blob/main/plugins/docflow/workspace/README.md) documents resolution and external returns. Node.js 22+ is required for workspace validation; Git 2.45+ is needed for checking cited historical member files.

## Grok command evidence

The previous documentation supplied this sequence:

```text
grok plugin marketplace add EvolveHQ/docflow
grok plugin install docflow --trust
```

**Unverified installation:** Grok 1.0.46 help describes install sources as URLs, GitHub shorthand or local paths; it does not establish bare `docflow` resolution after registering a marketplace. The sequence is retained as documented evidence, not a tested recipe. No replacement selector is invented here. `--trust` skips trust confirmation; it is not a universal default and must be a deliberate choice.

Before relying on this path, inspect the installed host’s help and establish the actual source resolution in an authorised isolated test. Manifest validation and marketplace listing do not prove installed skill execution.

## Local development

Use a complete existing checkout and replace the path below. These commands are terminal inputs, not instructions to change an installed user configuration.

```bash
claude --plugin-dir <path-to-this-repo>/plugins/docflow
cursor-agent --plugin-dir <path-to-this-repo>/plugins/docflow
copilot --plugin-dir <path-to-this-repo>/plugins/docflow plugin list
```

OpenCode’s clone/symlink path is in [Start here]({{ '/start/#host-opencode' | relative_url }}). pi also documents `pi install git:github.com/EvolveHQ/docflow`. See the [README installation reference](https://github.com/EvolveHQ/docflow#install) for Windows and additional host details.

## Troubleshooting

- **Skill missing:** inspect the host’s discovered source and installed package. Do not assume a marketplace registration also installed the plugin.
- **Assets missing:** restore the complete matching asset directory; report the resolved path and diagnostic. Do not fabricate a fallback schema.
- **Wrong environment:** a desktop app, remote shell and native worktree may see different paths. Validate where the action will run.
- **Unexpected command:** use the installed help and report the mismatch. Help confirms syntax, not a successful native install.

[Host context guides and qualification limits →]({{ '/reference/qualification/' | relative_url }})
