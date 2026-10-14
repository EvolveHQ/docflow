---
title: Start new repositories with a workspace
permalink: /workflows/new-repositories/
section: Guides
---

# Start new repositories with a workspace

Use this for a product with several new repositories. Create the workspace and members as separate Git homes, with explicit owners and working rules.

<p class="root-note"><strong>Open in your agent:</strong> The chosen workspace home first; then each new member root for its own setup.</p>

## Before you start

Choose the home identity, purpose and owner. Decide which work is shared and which decisions stay within a member. A future repository is not yet a local delivery source.

{% include host-picker.html %}

## Prompt

{% include prompt.html skill="workspace-setup" text="to propose an empty workspace home at &lt;home path&gt; for the new API and web repositories. Show the setup plan and wait for approval. Keep repository creation and member bootstrap as separate operations. Do not register nonexistent paths. After approval, show empty-home validation at current UTC and the next member-specific setup choices." %}

## Expected result

After approval, a valid empty home with no implied member, grant or completed work. Each new repository is then created separately through its normal host and Git process.

## Check it

For a member choosing Docflow, open its root and follow [guided single-repository setup]({{ '/workflows/single-repository/' | relative_url }}), selecting its queue, integration model and real verify gate. Other members may use their own conventions.

Return to the workspace to register each real checkout, stable identity, actual instruction paths and role. Validate after each registry change. Keep independent histories and native queues; no submodule or copied queue is required.

Use `workspace-scope` for the first shared outcome and its native deliveries. Keep observations unknown until evidence exists. Dispatch needs compatible current authority and a native claim; sync checks actual integration and required checks.


## Next step

[Plan and check daily work →]({{ '/workflows/day-to-day/' | relative_url }})
