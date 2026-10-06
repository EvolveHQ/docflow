---
title: Start new repositories with a workspace
permalink: /workflows/new-repositories/
---

# Start new repositories with a workspace

Use this path for a product that will have multiple new repositories. The workspace and members are separate Git homes from the start. Decide which shared outcomes belong above the members and which decisions remain local to each repository.

1. Choose the workspace home and member names/owners. Use the [new workspace guide](https://evolvehq.github.io/docflow/workflows/new-workspace/) to create and validate an empty home. No source repository or grant is implied by the home.
2. Create each new repository through its normal host and Git process. Inside a member that should use Docflow, run repository `bootstrap` with its chosen artefact root, assessment depth, decision shape, queue, integration mode, coordination mode and real verify gate. Review its output. Other members may use their own native conventions. The repository's `bootstrap` is distinct from `workspace-setup`.
3. Once a member exists, read its actual `AGENTS.md` or declared instruction path, record its immutable member ID, aliases, local path and role in `workspace.yaml`, then validate. Keep independent Git histories; avoid submodules and copied native queues.
4. Run `workspace-scope` for the first shared idea, accepted agreement when genuinely authorised, and cross-repository work with required deliveries and criteria. Use each member's native planning flow for its own implementation items.
5. When a compatible grant and native claim exist, dispatch a bounded assignment. After native integration, use `workspace-sync` to observe exact revisions, required checks and completion events. Refresh the dated INDEX.

Prompt: “Create a workspace home for the new API and web repositories, then treat their repository bootstraps as separate operations. Do not register nonexistent local paths. Show the empty-home validation first, followed by the member-specific setup choices and registry update after each checkout exists.”

Continue with [daily work](https://evolvehq.github.io/docflow/workflows/day-to-day/),
[recovery](https://evolvehq.github.io/docflow/workflows/recovery/) or the
[worked example](https://evolvehq.github.io/docflow/workflows/worked-example/);
return to the [workflow hub](https://evolvehq.github.io/docflow/workflows/).

