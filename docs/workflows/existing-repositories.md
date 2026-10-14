---
title: Adopt existing repositories
permalink: /workflows/existing-repositories/
section: Guides
---

# Adopt existing repositories

Use this when several existing repositories cooperate but have no shared Docflow workspace. An ordinary parent folder of repositories fits this path too.

<p class="root-note"><strong>Open in your agent:</strong> Start at the selected parent folder for read-only inventory; switch to the chosen workspace home before setup.</p>

## Before you start

Have the permitted repository paths and their owners ready. [Install Docflow]({{ "/start/#install" | relative_url }}). Preserve each member’s Git history, instructions, identifiers, branches, queues and completion rule.

{% include host-picker.html %}

## Prompt

{% include prompt.html skill="workspace-setup" text="to propose a separate workspace home at &lt;home path&gt; for &lt;shared purpose&gt;, owned by &lt;owner&gt;. First read &lt;member paths&gt; and their native instructions without changing them. Inventory real identities, aliases, paths, roles, revisions and claim sources. Show a file-by-file preservation plan and wait for approval before writing. Do not initialise the surrounding container or clone members. After approval, register the actual checkouts, validate at current UTC and list missing evidence." %}

## Expected result

A proposed home and registry linking the independent repositories. Docflow members keep their decision catalogues and queues; issue-led or other members keep their existing method. After approval, only the selected home changes.

## Check it

- Confirm each path resolves from the execution host, and instruction files really exist. Sibling or absolute paths work; an ignored `repos/` directory is optional.
- Keep unavailable members registered with diagnostics. A remote URL is not proof of a local checkout; remote-only entries are references, not future writable deliveries.
- Inspect Git state and the diff: no member history or native queue was moved into the home.
- Run `workspace-status` for a read-only overview. Use `workspace-scope` only for genuinely shared outcomes, linked to native tasks. Imported past runs need native evidence and cannot authorise future work.

If your folder already has `.docflow_workspace/`, [resume that existing home]({{ '/workflows/existing-workspace/' | relative_url }}) before proposing another identity.


## Next step

[Plan and check daily work →]({{ '/workflows/day-to-day/' | relative_url }})
