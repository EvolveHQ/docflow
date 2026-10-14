---
title: Start here
permalink: /start/
section: Start here
---

# Start here

Docflow is a plugin for your coding agent. It helps you keep decisions, plans and working rules in ordinary files. Start small: one repository is enough.

- **Plugin:** the installed bundle of skills and supporting files.
- **Skill:** instructions your agent follows for a named task.
- **Host:** the coding agent or app where you use those skills.
- **Repository:** a project with its own Git history.

You give prompts to your agent; there is no Docflow terminal CLI. Install once for your host, then use the right guide in your chosen project.

## Choose your situation

<ul class="route-list"><li><a href="#one-repository">One repository →</a><p>Record decisions and plan work within a single project.</p></li><li><a href="#several-repositories">Several repositories →</a><p>Coordinate shared work while each project keeps its own rules.</p></li></ul>

## Install for your agent {#install}

Choose the coding agent you actually use. Commands labelled **In your terminal** run in a shell; those labelled **In your agent** run inside that agent. These instructions describe the released setup paths; help checks are not proof of native installation or execution.

{% include host-picker.html %}

<ul class="host-links"><li><a href="#host-claude">Claude Code</a></li><li><a href="#host-pi">pi</a></li><li><a href="#host-codex">Codex</a></li><li><a href="#host-opencode">OpenCode</a></li><li><a href="#host-grok">Grok</a></li><li><a href="#host-cursor">Cursor</a></li><li><a href="#host-omp">omp</a></li><li><a href="#host-copilot">Copilot CLI</a></li></ul>

<section id="host-claude" class="host-panel" markdown="1">
### Claude Code

**In your agent:** register the marketplace, then install the plugin.

```text
/plugin marketplace add EvolveHQ/docflow
/plugin install docflow@evolvehq
```

**Check:** find `bootstrap` in the skill menu. Invoke `/bootstrap`, or `/docflow:bootstrap` when the host exposes the plugin-qualified name.
</section>

<section id="host-pi" class="host-panel" markdown="1">
### pi

**In your terminal:** install the package.

```bash
pi install npm:@evolvehq/docflow
```

**Check:** in pi, invoke `/skill:bootstrap`. pi needs explicit skill invocation; do not rely on automatic triggering.
</section>

<section id="host-codex" class="host-panel" markdown="1">
### Codex

**In your terminal:** register the marketplace, then install the plugin. Both commands are needed.

```bash
codex plugin marketplace add EvolveHQ/docflow
codex plugin add docflow@evolvehq
```

**Check:** open the intended project in Codex, find `bootstrap` through `/skills`, then invoke `$bootstrap` with your task. Codex App context and handoff guidance is [separate]({{ '/reference/qualification/' | relative_url }}).
</section>

<section id="host-opencode" class="host-panel" markdown="1">
### OpenCode

OpenCode discovers existing shared skill directories. A marketplace install in another agent does not necessarily create one. If Docflow is already discovered, use that installation.

Otherwise, **in your terminal** on POSIX systems, use this only when `~/.docflow-src` and the destination skill names are unused:

```bash
git clone https://github.com/EvolveHQ/docflow ~/.docflow-src
mkdir -p ~/.config/opencode/skills
ln -s ~/.docflow-src/plugins/docflow/skills/* ~/.config/opencode/skills/
```

**Check:** find `bootstrap` by name in OpenCode. Keep the clone: the symlinks resolve to its skills and matching workspace assets. For detached copies or Windows, follow [installation details]({{ '/reference/installation/' | relative_url }}).
</section>

<section id="host-grok" class="host-panel" markdown="1">
### Grok

The package includes Grok plugin and marketplace manifests, but the documented bare-name install selector is **unverified**. Installed Grok help does not establish that `docflow` resolves after marketplace registration. Do not treat this as a tested installation path.

Read the [Grok command evidence and limit]({{ '/reference/installation/#grok-command-evidence' | relative_url }}) before installing. If the plugin is already installed, check the discovered `bootstrap` skill in the slash menu. No substitute install command is assumed here.
</section>

<section id="host-cursor" class="host-panel" markdown="1">
### Cursor Agent CLI

Use an existing complete Docflow checkout. Replace the path with its actual absolute location.

**In your terminal:** load that checkout's plugin directory.

```bash
cursor-agent --plugin-dir <path-to-this-repo>/plugins/docflow
```

**Check:** find `bootstrap` in the discovered slash skills. This is the Agent CLI; the [Cursor editor guide]({{ '/reference/qualification/' | relative_url }}) covers a different host surface.
</section>

<section id="host-omp" class="host-panel" markdown="1">
### omp (oh-my-pi)

**In your terminal:** install using the shared pi package manifest.

```bash
omp plugin install npm:@evolvehq/docflow
```

**Check:** in omp, invoke `/skill:bootstrap` explicitly. CLI help exposes this install command; package acceptance and native behaviour are not established by that help check.
</section>

<section id="host-copilot" class="host-panel" markdown="1">
### GitHub Copilot CLI

**In your terminal:** register the marketplace and install the Claude-compatible plugin.

```bash
copilot plugin marketplace add EvolveHQ/docflow
copilot plugin install docflow@evolvehq
```

**Check:** `copilot skill list` should include `bootstrap`; choose the discovered skill in the agent. VS Code agent mode has [its own guide]({{ '/reference/qualification/' | relative_url }}).
</section>

## One repository

An **ADR (Architecture Decision Record)** is a short record of one decision, why it was made and how success will be checked. A **plan item** is a bounded piece of work linked to a decision. **Conventions** are the repository's agreed working rules.

Open the repository root in your agent. Use guided setup and explicitly include a plan queue; the express profile leaves that queue out. Existing files and Git rules should be preserved.

[Set up one repository →]({{ '/workflows/single-repository/' | relative_url }})

## Several repositories

A **workspace home** is a separate Git home that records shared work. A **member** is an independent repository listed there, with its own rules. The **registry** lists members and their paths. **INDEX** is a dated overview derived from the records.

Do you already have a Docflow workspace?

<ul class="route-list"><li><a href="{{ '/workflows/existing-workspace/' | relative_url }}">Yes — resume the existing home →</a><p>Start with a read-only status check. Keep its identity and records.</p></li><li><a href="{{ '/workflows/existing-repositories/' | relative_url }}">No — adopt existing repositories →</a><p>Also use this for an ordinary parent folder containing independent repositories.</p></li><li><a href="{{ '/workflows/new-repositories/' | relative_url }}">No — start new repositories →</a><p>Create the home, then set up and register each real member separately.</p></li><li><a href="{{ '/workflows/mixed-members/' | relative_url }}">A mix of methods or future members →</a><p>Preserve Docflow and non-Docflow workflows side by side.</p></li></ul>

Workspace validation needs **Node.js 22+** in the agent's execution environment. Checking cited historical member files needs **Git 2.45+**. Ask the agent to report missing prerequisites and inaccessible paths before it writes. A companion app is not required.

[Browse all guides →]({{ '/workflows/' | relative_url }}) · [Frequently asked questions]({{ '/faq/' | relative_url }})
