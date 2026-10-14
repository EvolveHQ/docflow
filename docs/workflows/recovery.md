---
title: Recover a workspace session
permalink: /workflows/recovery/
section: Guides
---

# Recover a workspace session

Use this after interruption, a missing return or a host change. Start from current files and native sources, keeping the same canonical identity.

<p class="root-note"><strong>Open in your agent:</strong> The existing workspace home in the actual host/filesystem where the next action would run.</p>

## Before you start

Confirm the home path, installed package revision and permitted scope. Read current records, registry, conventions and relevant member instructions. Check matching assets and validate at the actual UTC time; keep exact diagnostics.

{% include host-picker.html %}

## Prompt

{% include prompt.html skill="workspace-status" text="to resume &lt;work home and full ID&gt; in &lt;workspace path&gt; from current sources, without edits. Identify the last grant and expiry or revocation, native owner and claim, branch, run and receipt state, and member integration evidence. Name the single permitted next action. Keep unknown outcomes unknown." %}

## Expected result

A source-backed account of the interrupted work and its next permitted action. A missing return stays unknown; an old conversation or INDEX cannot override current sources.

## Check it

- **Interrupted setup:** compare actual files and Git state with the approved mapping. Propose a scoped merge of missing pieces; do not overwrite records or rerun setup blindly.
- **Missing receipt or contact loss:** silence, timeout or an expired grant does not prove the worker exited or permit reassignment. Seek native exit/return evidence. A new run follows only after independently reconciling a terminal receipt and rechecking claims and authority.
- **Returned receipt:** use `workspace-sync` to check the brief, grant, exact source revisions, command outcomes and times. Unknown or failed checks cannot establish success.
- **Prepared PR:** keep the delivery open until the member’s completion event and required checks at the integrated revision are verified. An unmerged `plan/done` file is prepared work.
- **Denied write:** stop that effect across tools and routes. Report partial state and the permission needed. Missing assets, runtime or native sources are concrete blockers; continue only safe reads.

Keep successful sibling deliveries and failed attempts visible. Inaccessible members or external homes mean unknown evidence, not free ownership or absent authority.


## Next step

[Return to the daily cycle →]({{ '/workflows/day-to-day/' | relative_url }})
