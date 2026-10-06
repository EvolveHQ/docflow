---
title: Create a workspace
permalink: /workflows/new-workspace/
---

# Create a workspace

Use this path when there is no canonical workspace yet. The home is its own adopter-owned Git repository. Choose its name, purpose, owner and actual path first. Setup creates or merges only that selected home; it does not initialise a surrounding container, clone a member, install a host or bootstrap a member repository implicitly.

## Try an empty workspace in scratch

This example assembles a disposable **empty** home from the installed package's actual bootstrap templates and workspace assets. It does not touch a member repository. Run in a shell that can read the package and execute Node.js 22+. Set `DOCFLOW_BOOTSTRAP` to the installed `bootstrap` skill directory and `DOCFLOW_ASSETS` to the matching installed `workspace` assets directory; use real absolute paths. The example uses `mktemp` for an isolated root and the shell's actual UTC clock for validation.

```bash
DOCFLOW_BOOTSTRAP="/absolute/path/to/installed/skills/bootstrap"
DOCFLOW_ASSETS="/absolute/path/to/matching/workspace"
node "$DOCFLOW_ASSETS/resolve-assets.mjs" "$DOCFLOW_BOOTSTRAP" "$DOCFLOW_ASSETS"
SCRATCH_WORKSPACE="$(mktemp -d)"
mkdir -p "$SCRATCH_WORKSPACE/.docflow_workspace"/{ideas,decisions,work,knowledge,runs,agents,profiles,integrations,templates,local}
cp "$DOCFLOW_BOOTSTRAP/templates/workspace-README.md" "$SCRATCH_WORKSPACE/README.md"
cp "$DOCFLOW_BOOTSTRAP/templates/workspace-AGENTS.md" "$SCRATCH_WORKSPACE/AGENTS.md"
cp "$DOCFLOW_BOOTSTRAP/templates/workspace-registry.yaml" "$SCRATCH_WORKSPACE/.docflow_workspace/workspace.yaml"
cp "$DOCFLOW_BOOTSTRAP/templates/workspace-CONVENTIONS.md" "$SCRATCH_WORKSPACE/.docflow_workspace/CONVENTIONS.md"
cp "$DOCFLOW_BOOTSTRAP/templates/workspace-INDEX.md" "$SCRATCH_WORKSPACE/.docflow_workspace/INDEX.md"
for kind in ideas decisions work knowledge runs; do
  cp "$DOCFLOW_BOOTSTRAP/templates/workspace-$kind.md" "$SCRATCH_WORKSPACE/.docflow_workspace/templates/"
done
printf '{"schema":1,"sources":[]}\n' > "$SCRATCH_WORKSPACE/.docflow_workspace/integrations/sources.yaml"
printf '/repos/\n/.docflow_workspace/local/\n' > "$SCRATCH_WORKSPACE/.gitignore"
node - "$SCRATCH_WORKSPACE" <<'NODE'
const fs = require('node:fs');
const path = require('node:path');
const root = process.argv[2];
const registryPath = path.join(root, '.docflow_workspace/workspace.yaml');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
registry.home = 'scratch/workspace';
registry.purpose = 'Explore a new multi-repository product in scratch.';
fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'README.md'), '# Scratch workspace\n\nPurpose: Explore a new multi-repository product in scratch.\n\nRead AGENTS.md and .docflow_workspace/workspace.yaml.\n');
NODE
UTC_NOW="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
node "$DOCFLOW_ASSETS/validate.mjs" "$SCRATCH_WORKSPACE" --at "$UTC_NOW"
```

The resolver should identify the supplied matching assets. The validator should exit 0 for the empty home and report no canonical work. Keep the command's actual output and exit code; do not report this scratch check as a native host or member test. The copied forms in `templates/` are examples, not live records. The sample registry has no members, no authority and no execution. Adapt `home` and `purpose` to your real project only when deliberately setting up its selected home. In an existing home, preserve and merge `.gitignore` instead of replacing it.

## Create the real home

1. Ask your chosen host to run `workspace-setup` with the selected **workspace root**, canonical home ID, owner, purpose, member list if known, write scope and native host. Example prompt: “Use `workspace-setup` to create `/work/products/acme-workspace` as home `acme/workspace` for the Acme product. Set up the empty registry and all required folders/templates. Do not clone or edit members. Show the diff and the validator's actual UTC command, output and exit.”
2. Confirm that `workspace.yaml` records the immutable home identity and only supplied member identities. Its JSON-compatible content can live in the `.yaml` file; general YAML syntax is not accepted by this format. `INDEX.md` is a dated overview derived from actual records.
3. Register accessible independent checkouts with each member's immutable `id`, retained `aliases`, actual absolute or relative `path`, `role` and relative native `instructions`. Register a remote-only reference with `role: reference` and `remote`, without path or instructions. Do not infer a checkout from a remote URL.
4. Validate using the installed assets and current UTC: `node <assets>/validate.mjs <workspace-root> --at <current-UTC>`. Read any diagnostics. A valid planned workspace gives no execution grant.
5. Run `workspace-status` to orient, then `workspace-scope` for the first genuinely shared outcome. Native repository setup is a separate step in each member that needs it.

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


Continue with [daily work]({{ '/workflows/day-to-day/' | relative_url }}),
[recovery]({{ '/workflows/recovery/' | relative_url }}) or the
[worked example]({{ '/workflows/worked-example/' | relative_url }});
return to the [workflow hub]({{ '/workflows/' | relative_url }}).

