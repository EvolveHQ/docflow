---
title: Manual scratch assembly
permalink: /reference/manual-assembly/
section: Reference
---

# Manual scratch assembly

These optional recipes expose the file mechanics for technical inspection. For ordinary setup, use the [prompt-first workspace guide]({{ '/workflows/new-workspace/' | relative_url }}). Scratch validation is not a native host smoke or proof of member execution.

## Contents

- [Assemble an empty workspace](#try-an-empty-workspace-in-scratch)
- [Inspect the packaged example](#inspect-and-validate-the-packaged-example)
- [Try an expected rejection](#try-a-rejected-state-in-scratch)

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



## Inspect and validate the packaged example


Run from any authorised shell that can read your installed assets:

```bash
DOCFLOW_ASSETS="/absolute/path/to/installed/workspace"
node "$DOCFLOW_ASSETS/validate.mjs" "$DOCFLOW_ASSETS/fixtures/two-repository" --at 2026-09-15T13:00:00Z
```

The historical time is intentional for this frozen synthetic example. Expect
exit 0 and an active shared work item, an accepted agreement, a complete API
delivery and an incomplete mobile delivery. For your actual workspace,
validate at the actual current UTC time. A valid example is not a grant to act.

Read these files under `fixtures/two-repository/.docflow_workspace/`:

| File | What to inspect |
|---|---|
| `workspace.yaml` | API uses `AGENTS.md`; mobile uses `README.md`. Their paths and native methods remain distinct. |
| `ideas/reliable-exports--123456781111.md` | A selected priority, without execution authority. |
| `decisions/preserve-legacy-response--234567892222.md` | Accepted shared agreement; delivery is tracked separately. |
| `knowledge/legacy-client-observation--456789014444.md` | The sourced reason compatibility matters. |
| `work/deliver-compatible-exports--345678903333.md` | Required deliveries, criterion, grant revisions and separate observations. |
| `runs/api-interrupted--567890125555.md` | A stopped attempt, retained in history. |
| `runs/api-reassigned--678901236666.md` | A later successful return linked to reconciled predecessor evidence. |
| `runs/mobile-revoked--789012347777.md` | A stopped attempt after authority revocation; mobile remains incomplete. |

The API member's native decision can be `Implemented` while the shared work
stays `active`. The successful API run does not satisfy the missing mobile
delivery or prove combined validation. Completing work would require checked
native completion and passed evidence for **every** required delivery and
criterion; the still-current agreement would remain accepted.



## Try a rejected state in scratch


This copies the fixture and applies one supplied adverse recipe. It writes
only the new scratch destination and never runs native member commands:

```bash
EXAMPLE_SCRATCH="$(mktemp -d)"
node "$DOCFLOW_ASSETS/fixtures/materialise.mjs" invalid-agreement-state "$EXAMPLE_SCRATCH/invalid"
node "$DOCFLOW_ASSETS/validate.mjs" "$EXAMPLE_SCRATCH/invalid" --at 2026-09-15T13:00:00Z
```

Expect materialisation exit 0 and validation exit 1 with a schema diagnostic.
Read the diagnostic and unchanged sibling records. A failing workspace stays
readable, while dependent writes stop. This rejection is an expected learning
result, not a package test failure.


[Return to the worked example →]({{ '/workflows/worked-example/' | relative_url }})
