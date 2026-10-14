---
title: Resume an existing workspace
permalink: /workflows/existing-workspace/
section: Guides
---

<span id="adopt-or-resume-an-existing-workspace" class="anchor-alias"></span>

# Resume an existing workspace

Use this when a workspace already has shared records, or when you need to establish whether an ordinary folder is a workspace at all.

<p class="root-note"><strong>Open in your agent:</strong> The existing workspace root for status; the ordinary parent folder only for read-only inspection.</p>

## Before you start

Locate `.docflow_workspace/workspace.yaml`. Preserve the existing home identity, record IDs, aliases, grants and Git histories. Check the actual host paths and matching assets; a dated INDEX is an aid, not the current authority.

{% include host-picker.html %}

## Prompt {#an-existing-docflow_workspace-memory}

{% include prompt.html skill="workspace-status" text="in &lt;workspace path&gt;. Treat the existing .docflow_workspace as canonical. Read current records and registered member instructions. Tell me what is underway, what is blocked and the next permitted action, with source paths and revisions. Preserve the existing home identity and record history. Make no edits." %}

## Expected result

A dated briefing covering owners, native claims and branches, current grants, dependencies, receipts, integration evidence and unknowns. No duplicate home, new grant or dispatch is created. Unavailable members remain visible.

## Check it

Compare the briefing with current Git state and canonical records. Yesterday's valid snapshot does not authorise today's action. Keep full home/record identities. Missing returns and inaccessible evidence stay unknown.

For incomplete setup, ask `workspace-setup` to **propose** a scoped merge of missing home files from matching assets. Review the diff before authorising writes; preserve `.gitignore`, instructions, records and selected configuration. Validate at current UTC after approved repairs.

## An ordinary existing folder of repositories

A folder containing `api/` and `web/` without `.docflow_workspace/workspace.yaml` is a container, not a canonical workspace. Inspect its Git boundaries read-only. Choose a separate home, such as `acme-workspace/`, or explicitly select an existing Git directory to adopt. Do not initialise or convert the container silently.

Follow [adopt existing repositories]({{ '/workflows/existing-repositories/' | relative_url }}) from that chosen home. Paths such as `../api` must actually resolve there.


## Next step

[Plan and check daily work →]({{ '/workflows/day-to-day/' | relative_url }})
