---
title: Adopt or resume an existing workspace
permalink: /workflows/existing-workspace/
---

# Adopt or resume an existing workspace

First inspect the selected folder. Two starting states need different handling:

### An ordinary existing folder of repositories

Example: `/work/acme/` contains independent `api/` and `web/` Git repositories, but no `.docflow_workspace/workspace.yaml`. It is a useful container, not yet a canonical workspace. Do not silently turn `/work/acme/` into a Git repository or assume a home identity.

1. From `/work/acme/`, inspect the folder, each repository's `AGENTS.md` or declared instructions, and Git boundaries. Decide whether the operator wants a new separate home such as `/work/acme/acme-workspace/`, or wants to adopt a specifically selected existing Git directory as the home. Record the preservation plan first.
2. From the **selected home directory**, run `workspace-setup` with the explicit `new` or `adopt` choice, canonical home identity, purpose, owner and allowed file scope. Register `../api` and `../web` only if those relative paths resolve to the real permitted checkouts from the chosen home. Absolute paths also work. Keep the two member `.git/` histories intact.
3. Validate the new memory from a context that can read both assets and home. Run `workspace-status`, then `workspace-scope` for shared outcomes. Existing member issues, ADRs or plan items remain native; do not copy them into workspace `work/` as if they were the same record.

Prompt: “Inspect `/work/acme/` as an ordinary container with `api/` and `web/`. Do not initialise or convert the container. Propose a separate canonical workspace home and a file-by-file preservation plan. After the chosen home is confirmed, run `workspace-setup` there, register the actual member paths, and validate at the current UTC time.”

### An existing `.docflow_workspace/` memory

Example: `/work/acme/acme-workspace/.docflow_workspace/workspace.yaml` already declares home `acme/workspace`, and canonical records exist. Reopen that **same** home; do not mint a second identity or duplicate records.

1. From the **existing workspace root**, read `README.md`, `AGENTS.md`, registry, conventions, the five record folders, `INDEX.md` and selected `agents/`, `profiles/`, `integrations/` entries. Inspect Git state and the actual operator mandate. Treat INDEX as a dated aid; live records and native sources take precedence.
2. Read each relevant registered member's native instructions. Resolve local paths from this execution context, including symlinks. If a checkout is unavailable, keep its registry entry and report the diagnostic. Do not fetch or delete it merely to make validation green.
3. Run `workspace-status` for a dated read-only briefing. Compare current grants, owners, claims, dependencies, resources, branches, receipts and member completion evidence with the last overview. A valid older snapshot does not authorise today's action. Keep full `{home, id}` identities and all existing grant history.
4. If the format is incomplete, ask `workspace-setup` for a **scoped adoption/merge** of missing home files from the matching pinned assets. Preserve `.gitignore`, instructions, records, aliases, identity and selected configuration. Validate with actual UTC and inspect the diff before recording changes under the home's own Git rules.
5. Continue with `workspace-scope` for planning, `workspace-dispatch` only under current compatible authority and native claims, and `workspace-sync` for returned or observed native evidence. Do not recreate records because a session was lost.

Prompt: “Treat `/work/acme/acme-workspace` and its existing `.docflow_workspace/` as the canonical home. Read current records and registered native instructions, validate with matching installed assets at the current UTC time, and give a source-backed `workspace-status`. Preserve home identity, record IDs, mandate/grant history and member Git histories. Propose exact merge repairs only for missing setup files.”

Continue with [daily work](https://evolvehq.github.io/docflow/workflows/day-to-day/),
[recovery](https://evolvehq.github.io/docflow/workflows/recovery/) or the
[worked example](https://evolvehq.github.io/docflow/workflows/worked-example/);
return to the [workflow hub](https://evolvehq.github.io/docflow/workflows/).

