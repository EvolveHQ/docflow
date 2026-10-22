---
title: FAQ
permalink: /faq/
section: Reference
---

# Frequently asked questions

Choose a topic, then open a question. For a guided first task, [Start here]({{ '/start/' | relative_url }}).

<nav class="faq-topics" aria-label="FAQ topics">
  <a href="#getting-started">Getting started</a>
  <a href="#federation-and-workspaces">Federation and workspaces</a>
  <a href="#everyday-work">Everyday work and authority</a>
  <a href="#installation-and-support">Installation and support</a>
</nav>

## Getting started

<details class="faq-question" markdown="1">
<summary>What do I actually install?</summary>

Docflow is a plugin: a bundle of skills and supporting files for your coding agent. A skill is a set of instructions that the agent follows. You give the agent a prompt in your project; there is no separate Docflow terminal CLI. Use the [installation instructions for your agent]({{ '/start/#install' | relative_url }}).
</details>

<details class="faq-question" markdown="1">
<summary>Can I start with just one repository?</summary>

Yes. Start with decisions, conventions and a plan queue in that repository. You do not need federation, a workspace home or a companion app. The [single-repository guide]({{ '/workflows/single-repository/' | relative_url }}) uses guided setup and explicitly includes a plan queue; the express profile leaves the queue out.
</details>

<details class="faq-question" markdown="1">
<summary>Can I use Docflow on an existing project?</summary>

Yes. Bootstrap can retrofit the conventions. Ask the agent to inspect the repository first and preserve its existing files, instructions and Git rules. For several existing repositories, [adopt them into a workspace]({{ '/workflows/existing-repositories/' | relative_url }}) while retaining their native methods.
</details>

## Federation and workspaces

<details class="faq-question" markdown="1">
<summary>What is the difference between federation and a portable workspace?</summary>

Federation connects the decision catalogues of repositories forming one product: where decisions live, how repositories reference them and how their catalogues are rolled up. A portable workspace records shared ideas, agreements, work and evidence across independent members. See the [visual comparison]({{ '/methodology/#federation-vs-workspace' | relative_url }}).
</details>

<details class="faq-question" markdown="1">
<summary>Do I need both? Can they work together?</summary>

Neither requires the other. Use federation for a product's connected decision catalogues; use a workspace for shared coordination. They can coexist: the workspace links native decisions and deliveries while the federation retains its own identifiers, plans and completion rules. A single repository can begin with neither.
</details>

<details class="faq-question" markdown="1">
<summary>Is a parent folder of repositories already a workspace?</summary>

Not by itself. A portable workspace has an adopter-owned Git home with a registry, conventions and canonical records. The registry points to independent member checkouts; a checkout's location does not make its files part of the workspace history. Follow the [ordinary-folder adoption path]({{ '/workflows/existing-repositories/' | relative_url }}), or [resume an existing workspace]({{ '/workflows/existing-workspace/' | relative_url }}) if the home already exists.
</details>

<details class="faq-question" markdown="1">
<summary>Must every member use Docflow or be checked out locally?</summary>

No. Delivery members may use Docflow or another native method. Remote-only reference members provide context and remain non-mutating. A planned repository is a future delivery, not an invented checkout or active member; register it once it exists. The [mixed-member guide]({{ '/workflows/mixed-members/' | relative_url }}) explains these distinctions.
</details>

## Everyday work

<details class="faq-question" markdown="1">
<summary>Where should I run a skill?</summary>

Run repository skills in the repository they concern. Run the five workspace skills from the workspace home. A handoff then sends bounded work to the chosen native member context; it does not turn the workspace into a remote writer. The [skill catalogue]({{ '/reference/skills/' | relative_url }}) lists the correct root for every skill.
</details>

<details class="faq-question" markdown="1">
<summary>Does selecting an idea or accepting an agreement start work?</summary>

No. Selection sets priority; acceptance records agreement. Native execution needs a current grant, a native claim and an explicit brief, with dependencies and resources checked before dispatch. See [authority terms before dispatch]({{ '/workflows/day-to-day/#before-you-start' | relative_url }}).
</details>

<details class="faq-question" markdown="1">
<summary>When does work count as completed?</summary>

Use the member's recorded completion rules and checked native evidence. A plan, a readiness report or a handoff is not a delivery receipt. An unmerged pull request is not shipped where that repository requires a merge. Workspace sync reconciles returned evidence; accepting an agreement does not mark its delivery complete. Follow the [day-to-day loop]({{ '/workflows/day-to-day/' | relative_url }}).
</details>

<details class="faq-question" markdown="1">
<summary>How do I resume in a fresh agent session?</summary>

Open the existing workspace home and ask for a read-only status briefing. Check current records, native claims and returned evidence before selecting the next bounded action. Do not create a second home or infer progress from an old conversation. Use [resume an existing workspace]({{ '/workflows/existing-workspace/' | relative_url }}) or [recovery]({{ '/workflows/recovery/' | relative_url }}) when evidence is missing or contradictory.
</details>

## Installation and support

<details class="faq-question" markdown="1">
<summary>Why are there eight package targets but seven host guides?</summary>

They describe different things. Package targets describe installation and discovery of the shared skills. Host guides describe context and brief/receipt handoffs on particular app, CLI or editor surfaces. A model name does not identify the host. See [the two sets and their qualification limits]({{ '/reference/qualification/' | relative_url }}).
</details>

<details class="faq-question" markdown="1">
<summary>Is every installation path fully tested, including Grok?</summary>

No. Packaged assets, source/help evidence and deterministic checks do not establish native installation or model-driven execution. Full native qualification remains pending, and the seven guide smokes are unrun in the released inventory. Grok's bare-name install selector is explicitly unverified; there is no assumed replacement command. Read the [Grok evidence]({{ '/reference/installation/#grok-command-evidence' | relative_url }}) and [qualification record]({{ '/reference/qualification/' | relative_url }}).
</details>

<details class="faq-question" markdown="1">
<summary>Do I need Clarity or a background service?</summary>

No. The workspace is ordinary files in Git, readable without a companion app. Docflow's workspace validator checks files; it is not a scheduler, authentication layer or live ownership service. See the [workspace model]({{ '/workspace/' | relative_url }}) and [format reference]({{ '/reference/workspace-format/' | relative_url }}).
</details>

Next: [choose a guide]({{ '/workflows/' | relative_url }}) for a prompt, expected result and checks, or read the [methodology]({{ '/methodology/' | relative_url }}) for the full method.
