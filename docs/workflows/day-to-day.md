---
title: Day-to-day workspace work
permalink: /workflows/day-to-day/
section: Guides
---

# Day-to-day workspace work

Use this to read progress, shape a shared outcome and check an authorised return. Take each step only within its current permitted scope.

<p class="root-note"><strong>Open in your agent:</strong> The workspace home for shared records; the member root for native implementation.</p>

## Before you start

Read the home and relevant member instructions. Replace all placeholders. A **mandate** is the operator’s actual instruction, committed when used as recorded authority. A **grant** records permission for a bounded assignment. A **claim** is the member’s native ownership record. A **receipt** is evidence of what an attempt actually did. Planning and validation do not authorise execution.

{% include host-picker.html %}

## Prompt: read current status

{% include prompt.html skill="workspace-status" text="in &lt;workspace path&gt;. Read current records and member instructions. Tell me what is underway, what is blocked and the next permitted action. Include owners, branches, claims, grant validity, dependencies and source revisions. Make no edits." %}

## Expected result

A dated, source-backed briefing, with unknowns explicit. No new authority or assignment.

## Check it

Read the cited records and native claim sources. If the next action is planning, use the next prompt. If evidence is missing or stale, follow the recovery guide before dispatching.

## Plan the shared outcome

{% include prompt.html skill="workspace-scope" text="to plan &lt;outcome&gt; with exclusions, owner, required member deliveries and testable criteria. Reuse existing identities. Keep agreements proposed and grants absent until their actual committed mandate exists. Validate and show the diff within my permitted scope." %}

**Expected result / check:** shared records linked to native work. Acceptance and grants must cite a real committed mandate by path and revision. In each member, prepare the native task and claim using its own method: `new-adr` / `new-plan` for Docflow members, or their issue/PR process otherwise. Record the actual native task revision and completion event.

## Hand off approved work

{% include prompt.html skill="workspace-dispatch" text="for &lt;work home and full ID&gt; / &lt;delivery&gt; to &lt;actor&gt; in &lt;host&gt;, using the current grant. Check grant revision and expiry, native ownership, linked workspaces, dependencies and resources. Bind exact source revisions, permitted actions and checks. Stop at &lt;boundary&gt; and return evidence to &lt;path&gt;. Report any failed readiness check." %}

**Expected result / check:** a bounded authorised assignment or a concrete blocker. A submitted prompt is not completion. A failed readiness check before execution is a report, not a run receipt. The executor works in the assigned member context and returns actual commands, exits, observations and revisions.

## Check completed work

{% include prompt.html skill="workspace-sync" text="to check &lt;receipt or member state&gt; against its actual revision and native completion rule. Verify the brief binding, current authority, merged PR state and required checks where applicable. Update only supported observations and refresh INDEX within existing write authority. Keep unmerged or unknown work open." %}

**Expected result / check:** evidence-backed observations for each delivery. Sync can also observe independent native work. A prepared PR or unmerged `plan/done` move does not establish completion. The parent work needs every required delivery and criterion; the shared agreement can remain accepted after completion.

Validation checks record consistency, not permission or proof that an external action happened. [Validator reference]({{ '/reference/workspace-format/#validation' | relative_url }}).


## Next step

[Inspect a worked example →]({{ '/workflows/worked-example/' | relative_url }})
