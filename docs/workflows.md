---
title: Guides
permalink: /workflows/
section: Guides
---

<span id="workspace-workflows" class="anchor-alias"></span>

# Guides

Choose the task that matches what exists now. Each guide gives you a prompt, the result to expect and a check before moving on. New to Docflow? [Start here]({{ '/start/' | relative_url }}) explains the terms and installation.

## Set up

<ul class="route-list">
<li><a href="{{ '/workflows/single-repository/' | relative_url }}">Set up one repository →</a><p>Guided setup, a plan queue and your first decision.</p></li>
<li><a href="{{ '/workflows/existing-repositories/' | relative_url }}">Adopt existing repositories →</a><p>Make a shared home without changing member methods or Git histories.</p></li>
<li><a href="{{ '/workflows/new-repositories/' | relative_url }}">Start new repositories →</a><p>Create the home and members as separate operations.</p></li>
<li><a href="{{ '/workflows/mixed-members/' | relative_url }}">Coordinate mixed members →</a><p>Docflow, issue-led and future members in one shared plan.</p></li>
<li><a href="{{ '/workflows/new-workspace/' | relative_url }}">Create a workspace home →</a><p>The shared setup step when there is no canonical home yet.</p></li>
</ul>

<span id="the-common-cycle" class="anchor-alias"></span>

## Daily work

- [Plan, dispatch and check shared work]({{ '/workflows/day-to-day/' | relative_url }}).
- [Inspect a worked example]({{ '/workflows/worked-example/' | relative_url }}) with one complete and one interrupted delivery.

## Resume or repair

- [Resume an existing workspace]({{ '/workflows/existing-workspace/' | relative_url }}) — or distinguish one from an ordinary folder.
- [Recover after an interruption or host change]({{ '/workflows/recovery/' | relative_url }}).

## Before you start

Open the **member root** for repository skills, or the **workspace home** for workspace skills. Install Docflow for the actual agent and make sure it can read that root and its matching assets. Read current instructions before writes.

### Invoke the skills

[Choose your agent]({{ '/start/#install' | relative_url }}) to see its installation and invocation form. Prompts below can reuse that choice. pi and omp need `/skill:name`; Codex uses `$name`; Claude Code uses `/name` or its plugin-qualified form.

### What to expect

Repository setup and workspace setup are separate. A workspace home has a README, agent instructions and `.docflow_workspace/` for registry, conventions and shared records. Members retain their native work queues, claims and completion rules. See the [workspace format]({{ '/reference/workspace-format/' | relative_url }}).

## Qualification limits

The package has deterministic checks; full native qualification remains pending. The seven workspace host guides are distinct from the eight installation targets. [Read the exact limits]({{ '/reference/qualification/' | relative_url }}).
