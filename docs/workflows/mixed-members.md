---
title: Coordinate mixed members
permalink: /workflows/mixed-members/
---

# Coordinate mixed members

A single workspace can contain **already governed** repositories (including Docflow members with a decision catalogue and plan queue), **not-yet-governed** repositories with their own native rules, **existing** checkouts and **newly created** checkouts. These are two independent choices. Do not bootstrap an existing member just to make it look like another member. A planned repository with no checkout cannot be treated as a validated local delivery source.

| Example member | Exists now? | Governing method | What the workspace does |
|---|---|---|---|
| `api/` with Docflow decisions and plan queue | Yes | Existing Docflow rules | Register and reference its native task and completion event. |
| `mobile/` with `AGENTS.md` and issue/PR workflow | Yes | Existing non-Docflow rules | Register and preserve that workflow; no forced bootstrap. |
| `web/` newly created with Docflow | After separate creation | Bootstrap inside `web/` | Register only after its paths and instructions exist. |
| `ops/` newly created with its own rules | After separate creation | Its own native setup | Register real instructions and completion event, without Docflow repository bootstrap. |

1. From the **workspace root**, run `workspace-status` or `workspace-setup` as appropriate. List each member's real state, stable ID, aliases, role, local path and instruction path. From **each existing member root**, read its own instructions and native work/claim source. Keep existing Docflow and non-Docflow methods as they are.
2. For **planned new** members, record the intended identity and dependency in shared planning but do not declare a local path or native instruction file until the independent checkout and files exist. A remote-only entry is appropriate only for an actual `role: reference` member with a supplied remote, never as a stand-in for a future writable delivery.
3. From the **workspace root**, use `workspace-scope` to define one shared outcome with distinct native deliveries and testable criteria. Example: API contract in `api/`, UI integration in future `web/`, mobile review in `mobile/`. Mark unavailable sources blocked or unknown. A selected idea and accepted agreement do not assign an executor.
4. Create a new repository under its own owner and Git rules. From **that new member root**, run `bootstrap` only if Docflow governance is chosen; otherwise establish its actual native instructions. Create its native task/claim under that member's method.
5. Return to the **workspace root** to register the now-real checkout, instructions and completion event. Validate at current UTC; inspect current mandate/grant and native claims before dispatch. `workspace-sync` observes each member's completion independently. Parent work remains open until every required delivery and criterion has passed evidence.

Prompt: “In `<workspace-root>`, scope an outcome spanning existing Docflow `api/`, existing issue-led `mobile/` and a future `web/`. Read both existing members' instructions and preserve their queues. Keep `web/` blocked until its own repository and instructions exist. After `web/` is created, run its chosen native setup from `web/`, then register it from the workspace. Show each delivery's native completion rule and the current authority check before any dispatch.”

Continue with [daily work]({{ '/workflows/day-to-day/' | relative_url }}),
[recovery]({{ '/workflows/recovery/' | relative_url }}) or the
[worked example]({{ '/workflows/worked-example/' | relative_url }});
return to the [workflow hub]({{ '/workflows/' | relative_url }}).

