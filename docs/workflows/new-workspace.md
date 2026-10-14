---
title: Create a shared workspace
permalink: /workflows/new-workspace/
section: Guides
---

<span id="create-a-workspace" class="anchor-alias"></span>

# Create a shared workspace

Use this when work spans several repositories and there is no canonical workspace yet. The home is its own Git repository; project repositories remain independent members.

<p class="root-note"><strong>Open in your agent:</strong> The deliberately chosen workspace home, not a surrounding folder of unrelated projects.</p>

## Before you start

[Install Docflow]({{ "/start/#install" | relative_url }}). Choose a dedicated path, home identifier, owner and purpose. Ask the agent to check Node.js 22+ and matching workspace assets in its actual environment. [Resume instead]({{ "/workflows/existing-workspace/" | relative_url }}) if a home already exists.

{% include host-picker.html %}

## Prompt

{% include prompt.html skill="workspace-setup" text="to create the Acme workspace at &lt;workspace path&gt;, with home ID acme/workspace, owned by &lt;owner&gt;, for coordinating API and mobile work. Use this host. Show the exact setup plan before writing, then wait for my approval. Limit changes to that home. Start with no members. If Git initialisation is needed, include it in the plan using my branch rules. Validate with the matching installed assets at the actual UTC time and show the result." %}

Replace the example identity and placeholders with your own values.

## Expected result {#create-the-real-home}

After approval: a README, agent instructions and `.docflow_workspace/` containing the registry, conventions, overview and empty record folders. The result should name the real target path, changed files, package revision and validator outcome. Missing assets or access should be reported explicitly.

## Check it

Confirm the home identity and empty member list. No members were cloned or bootstrapped. A successful empty setup creates no execution grants or completed deliveries. Inspect the diff and any Git initialisation under your chosen rules.

### Check it yourself {#try-an-empty-workspace-in-scratch}

The agent can run the validator. If you want to inspect the mechanics, use [manual scratch assembly]({{ '/reference/manual-assembly/' | relative_url }}). That disposable example does not create a ready Git-backed product workspace.

### Register real members {#example-registry-for-real-members}

Register existing checkouts only after checking their identities, paths and actual native instructions. See the [registry example]({{ '/reference/workspace-format/#example-registry-for-real-members' | relative_url }}). Setting up the home does not bootstrap members.


## Next step

[Adopt the existing repositories →]({{ '/workflows/existing-repositories/' | relative_url }})
