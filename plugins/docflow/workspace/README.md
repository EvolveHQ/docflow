# Portable workspace foundations

Read [CONTRACT.md](CONTRACT.md) for the canonical format and
[fixtures/README.md](fixtures/README.md) for producer/consumer examples.
These files provide the W1/W2 foundation. The four workspace operating skills
and native host/Clarity qualification are separate delivery work.

## Install the complete assets

Plugin bundles contain `skills/` and the sibling `workspace/` directory.
The npm package includes both under `plugins/docflow/`. Copy the complete
plugin directory for marketplace/local-plugin use and Cowork ZIP uploads.
Keep the two directories together when unpacking an npm package.

For a standalone skill **copy**, also copy `workspace/` from that same
package/revision to `docflow-workspace/` beside the host's `skills/` directory:

| Discovery directory | Portable asset directory |
|---|---|
| `~/.claude/skills/` | `~/.claude/docflow-workspace/` |
| `~/.agents/skills/` | `~/.agents/docflow-workspace/` |
| `~/.config/opencode/skills/` | `~/.config/opencode/docflow-workspace/` |

This includes Codex/OpenCode shared-skill copies. Symlinked skills resolve
their real directory first and find the original plugin's sibling assets.
An explicit asset root is also valid. Do not claim a skill-only copy includes
the validator. The locator in bootstrap's `templates/workspace-assets.json`
is declarative; no executable file is added to skill discovery directories.

From the installed assets, check the actual bootstrap skill path:

```text
node resolve-assets.mjs <bootstrap-skill-directory> [explicit-workspace-assets]
node validate.mjs <adopter-workspace> --at 2026-09-15T13:00:00Z
```

The deterministic installation test uses copies of the distributed files,
including detached Codex/OpenCode layouts. It does not establish native host
discovery or behaviour. No source checkout is required after asset installation.

## Assemble a new empty workspace

Within the operator-selected new workspace only:

1. Copy bootstrap's `workspace-README.md` to `README.md`,
   `workspace-AGENTS.md` to `AGENTS.md`, `workspace-registry.yaml` to
   `.docflow_workspace/workspace.yaml`, `workspace-CONVENTIONS.md` to
   `.docflow_workspace/CONVENTIONS.md`, and `workspace-INDEX.md` to
   `.docflow_workspace/INDEX.md`. Supply the actual home and purpose.
2. Create the five record folders plus `agents/`, `profiles/`,
   `integrations/` and ignored `local/` inside `.docflow_workspace/`.
   Start `integrations/sources.yaml` with `{"schema":1,"sources":[]}`.
3. Ignore `/repos/` and `/.docflow_workspace/local/`. Obtain independent
   member checkouts separately under existing authority. Register their
   identity, aliases, actual local root and native instruction paths.
4. Store the five `workspace-{ideas,decisions,work,knowledge,runs}.md` forms
   in `.docflow_workspace/templates/`, outside the canonical kind folders.
   They start at each kind's initial state, with synthetic field examples,
   not records to publish unchanged. The work form has no grants or claimed
   completion. Create only the kinds needed for the work. Mint a
   UUIDv4, derive a collision-checked filename, replace synthetic facts and
   keep planning state free of invented authority or results.
5. Use the role/profile/source, recommendation, grant, brief and receipt forms
   only as needed. Briefs and receipts are nested in run front matter;
   grants remain in work. A source or role is not execution authority.
6. Run the validator with the actual evaluation time. Preserve diagnostics
   for missing members or evidence. A valid empty/planned workspace grants
   no actions; choose the native host and recheck authority before dispatch.

An existing container needs an explicit adoption decision and preservation
plan. These assets do not initialise Git, clone members or modify a host.
The overview is a dated derivative of validated records; regenerate it after
record changes and present diagnostics beside it when validation fails.

## Status at a glance

- **This run:** Supplies portable installation and manual assembly instructions.
- **Overall:** partially verified — deterministic asset tests are separate from native qualification.
- **Yet to do:** Author actual scoped records, verify current native authority
  and complete the later operating-skill and consumer qualification.
