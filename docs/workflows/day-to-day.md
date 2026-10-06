---
title: Day-to-day workspace work
permalink: /workflows/day-to-day/
---

# Day-to-day workspace work

Start in the selected workspace root for the shared view. Switch to the member root for native repository work. The current operator mandate defines permitted effects; a workspace grant is additionally required for grant-bound execution.

1. **Morning orientation:** “Run `workspace-status` for `<workspace-root>`. Read current records, relevant member instructions and native claim sources. Report selected priorities, exact owners and branches, grant validity, blockers, dependencies, delivery progress and next actions with source paths/revisions. Make no edits.”
2. **Shape the outcome:** “Use `workspace-scope` to define `<outcome>`, exclusions, owner, required member deliveries and testable criteria. Reuse existing identities. Keep any agreement proposed and grant absent until their actual committed mandate exists. Validate and show the diff.”
3. **Prepare native work:** In each member, follow its own instructions. A Docflow member may use `new-adr` and `new-plan`; another member may use its issue/PR process. Record the exact native task path, source revision, claim and completion event for the workspace delivery.
4. **Dispatch only when ready:** “For work `{home, id}` and delivery `<name>`, run `workspace-dispatch` for actor `<actor>` in host `<host>`. Check the current grant revision and expiry, native claim, all linked workspaces, dependencies and reserved resources. Bind exact source revisions, allowed actions, checks, stopping point and external return path. If readiness fails, report it without creating a running record.”
5. **Review the return:** The executor returns actual action/command outcomes and a source-bound receipt; a read-only executor can write an external return envelope. `workspace-sync` checks the brief binding, native files at cited revisions, observation times, command exits and current authority before storing permitted receipt data. It can also observe independent native work.
6. **Close only from native evidence:** “Run `workspace-sync` on `<return-or-member-state>`. Check merged PR state, required checks on the exact integrated revision and the member's declared completion event. Refresh INDEX and report unresolved diagnostics. Keep prepared/unmerged work and unknown evidence open.”

The validator command is `node <installed-assets>/validate.mjs <workspace-root> --at <actual-UTC-time>`. It checks format and consistency, not host permission, approver identity or whether an external action happened. An accepted shared decision can remain accepted after work completes; member decisions follow their own native lifecycle.

Continue with [daily work](https://evolvehq.github.io/docflow/workflows/day-to-day/),
[recovery](https://evolvehq.github.io/docflow/workflows/recovery/) or the
[worked example](https://evolvehq.github.io/docflow/workflows/worked-example/);
return to the [workflow hub](https://evolvehq.github.io/docflow/workflows/).

