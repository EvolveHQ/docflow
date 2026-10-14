---
title: Workspace format and validation
permalink: /reference/workspace-format/
section: Reference
---

# Workspace format and validation

A workspace is ordinary Git-backed files. It records shared planning and observed delivery while each member keeps its own instructions, identities, method and completion event.

## Contents

- [Files and records](#files-and-records)
- [Registry example](#example-registry-for-real-members)
- [Validation](#validation)
- [Schemas and boundaries](#schemas-and-boundaries)

## Files and records

The root has `README.md`, `AGENTS.md` and `.gitignore`. Under `.docflow_workspace/`, `workspace.yaml` is the registry, `CONVENTIONS.md` holds home rules and `INDEX.md` is a dated derived overview. `ideas/`, `decisions/`, `work/`, `knowledge/` and `runs/` hold canonical records; `mandates/` holds committed operator instructions used as authority evidence.

`templates/` holds blank forms, not live records. `agents/`, `profiles/` and `integrations/` hold selected configuration. Ignore `/repos/` and `/.docflow_workspace/local/`; local caches are disposable. Member checkouts need not live under `repos/`.

Keep full home and record IDs stable. Selecting an idea sets priority; accepting a decision records agreement. Neither authorises execution. A work item tracks delivery separately from the agreement. [Lifecycles and diagrams]({{ '/workspace/' | relative_url }}).

## Example registry for real members


After independently obtaining the two checkouts, a registry can look like
this. Replace all identities, paths and instruction filenames with your actual
values. This is a registry example, not a grant or a command to clone anything:

```json
{
  "schema": 1,
  "home": "acme/workspace",
  "purpose": "Coordinate the API and mobile product.",
  "repositories": [
    {"id": "acme/api", "aliases": [], "path": "../api", "role": "delivery", "instructions": ["AGENTS.md"]},
    {"id": "acme/mobile", "aliases": [], "path": "../mobile", "role": "delivery", "instructions": ["README.md"]},
    {"id": "acme/reference", "aliases": [], "remote": "https://github.com/example/reference.git", "role": "reference"}
  ],
  "external_homes": [],
  "resources": []
}
```

Relative paths resolve from the selected workspace root. The API and mobile
instruction files must really exist; the reference entry has no checkout or
native file evidence. A missing local member stays visible with diagnostics.
Run validation after the registry change, then read each member's native rules.
If the selected home is new and not yet a Git repository, initialise it
separately under the operator's explicit Git authority and chosen branch rules;
workspace setup does not implicitly initialise a parent container.


## Validation

The agent can run this in the environment that can read the home and matching assets. First set and display the **real absolute paths** for these variables. Use the actual UTC clock for real workspaces.

**In your terminal** (Bash):

```bash
DOCFLOW_ASSETS="/absolute/path/to/matching/workspace"
WORKSPACE_ROOT="/absolute/path/to/your/workspace-home"
printf '%s\n' "$DOCFLOW_ASSETS" "$WORKSPACE_ROOT"
node "$DOCFLOW_ASSETS/validate.mjs" "$WORKSPACE_ROOT" --at "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
```

**Expected result:** keep the actual output and exit code. A valid empty home reports no canonical work; nonzero exits need their diagnostics resolved before dependent writes. A missing member remains registered and visible.

## Schemas and boundaries

The format uses strict JSON-compatible YAML mappings, including in Markdown front matter; arbitrary YAML syntax is not supported. The complete installed assets are the authority for the matching schema and validator. Read the [contract](https://github.com/EvolveHQ/docflow/blob/main/plugins/docflow/workspace/CONTRACT.md), [asset directory](https://github.com/EvolveHQ/docflow/tree/main/plugins/docflow/workspace) and [asset README](https://github.com/EvolveHQ/docflow/blob/main/plugins/docflow/workspace/README.md).

Validation checks format, references and consistency. It does not authenticate an approver, grant permission, launch a worker or prove that external work happened. A prepared PR is not the member’s integration event. [Dispatch and evidence checks]({{ '/workflows/day-to-day/' | relative_url }}).
