---
title: Adopt existing repositories
permalink: /workflows/existing-repositories/
---

# Adopt existing repositories

Use this path when two or more repositories already cooperate and there is no shared workspace home. Preserve each repository's history, conventions, identifiers, branches, queue and completion rule.

1. Inventory only the repositories in scope. For each, record a stable workspace member ID, aliases, local path or remote-only reference, delivery/reference role, native instruction path (`AGENTS.md` or another declared file), current Git revision and actual work/claim source. Read those instructions. A Docflow member keeps its own decision catalogue and plan queue; a non-Docflow member keeps its existing issue/PR or other method.
2. Choose an adopter-owned workspace Git home outside member histories and run `workspace-setup` there. Give the selected directory, purpose, owner and exact inventory. Obtain independent member checkouts separately under existing access. An ignored `repos/` folder inside the home is optional; sibling or absolute paths are valid when declared and accessible.
3. Inspect `workspace.yaml`. Correct aliases and actual local paths, including paths from the host that will run validation. Missing members remain registered with diagnostics. Do not copy a member's native queue into the workspace.
4. Run `workspace-status` and the validator. Then use `workspace-scope` to record only shared outcomes and the specific native deliveries that contribute to them. Backfill past execution as an imported, read-only run only when its native source evidence is available; it cannot act as a grant for new work.
5. For future native work, arrange the member's own task and claim through its native method. A workspace grant and bounded dispatch follow only after current mandate, claim, dependency and resource checks. Reconcile completed member work through `workspace-sync` at the member's actual integration event.

Prompt: “Read these two repositories and their native instructions without changing either. Establish a separate workspace at `<path>` for shared outcomes. Register their real identities and paths, validate at the actual UTC time, and list missing evidence. Keep each native queue and completion rule.”

Continue with [daily work]({{ '/workflows/day-to-day/' | relative_url }}),
[recovery]({{ '/workflows/recovery/' | relative_url }}) or the
[worked example]({{ '/workflows/worked-example/' | relative_url }});
return to the [workflow hub]({{ '/workflows/' | relative_url }}).

