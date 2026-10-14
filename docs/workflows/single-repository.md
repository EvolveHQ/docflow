---
title: Set up one repository
permalink: /workflows/single-repository/
section: Guides
---

# Set up one repository

Use this when you want decisions, plans and working rules in one new or existing project. You do not need a workspace.

<p class="root-note"><strong>Open in your agent:</strong> The member repository root. Stay in this repository for every step below.</p>

## Before you start

[Install Docflow for your agent]({{ "/start/#install" | relative_url }}). Read existing project instructions. An ADR records one decision and its success checks; a plan item records the work to carry it out. Choose **guided** setup with a **plan queue** for this journey.

{% include host-picker.html %}

## Prompt

{% include prompt.html skill="bootstrap" text="here in guided mode, including a plan queue. Read existing instructions and preserve our current Git rules. Show the setup plan and stop for my review before writing." %}

## Expected result

A fresh/existing assessment, proposed artefact location, files to add or merge, optional layers and commit/integration rules. Review these before approving writes. After approval, expect agent instructions, conventions, an ADR template and index, plus the selected plan queue.

## Check it

Inspect the diff. Existing instructions and Git rules should be preserved, with only the approved merges. Confirm the plan queue is present. The express profile omits the queue and verify gate and defaults to direct-to-main; it is not the setup used here. The autonomous operating prompt requires both a queue and a recorded verify gate.

## Explore your first decision

{% include prompt.html skill="brainstorm" text="to explore adding passwordless sign-in. Explain the decisions and work items we would need. Keep the proposal in conversation for review." %}

**You should see:** candidate decisions and bounded work, with no numbered files yet. Replace the example feature with your own. After approving a candidate, ask `new-adr` to record that decision, then `new-plan` to queue the bounded work linked to it. Review each result; creating the record does not approve implementation automatically.

When the work is authorised and implemented, use `ship-item` to check it against the repository's verify gate and completion rule. A prepared PR is still open work until that repository's integration event is confirmed. Use `audit` for a read-only conventions check.


## Next step

[Read the repository skill catalogue →]({{ '/reference/skills/' | relative_url }})
