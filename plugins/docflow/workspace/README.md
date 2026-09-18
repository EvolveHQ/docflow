# Portable workspace foundations

Read [CONTRACT.md](CONTRACT.md) for the canonical format and
[fixtures/README.md](fixtures/README.md) for producer/consumer examples.
Use workspace-setup to establish an adopter home, workspace-status to read
current state, workspace-scope to record outcomes and workspace-dispatch
to prepare and reconcile authorised native assignments. Read the
[six native guides](guides/README.md); native host/Clarity qualification
remains separate from deterministic package checks.

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

## Match assets and workspace to an execution context

Before setup or validation, identify the native tool's actual filesystem and
path syntax. Check that the same execution context can read the selected
workspace (or its parent before creation) and asset root, and run Node.js 22+.
A cloud tool, device VM and desktop shell can expose different filesystems;
a path supplied to one does not establish access from another.

Record native skill discovery separately from the assets used for validation.
An already accessible, permitted copy of the same pinned package may be an
explicit asset root: verify its source bytes and record both locations before
using it. That copy does not establish native plugin discovery. Reuse the
current mandate only when it covers that read/test route; a stricter brief or
denied action still stops the operation across tools and routes.

If no authorised context can access both locations, report the exact missing
path and stop dependent writes. Do not search unrelated roots, install or copy
assets implicitly, place tools in canonical records, or validate a reconstructed
workspace and report it as the original. Preserve the actual command and exit.

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

## External returns

First distinguish a readiness check from an assigned attempt. If current
authority, ownership, dependencies or resources prevent an attempt starting,
return a readiness report with the actual blocker, source and next required
evidence. Do not create a running or terminal record solely to fit that report
into a receipt. Readiness reports are not values for `runs.receipt`.

For an actual assigned attempt, use bootstrap's `workspace-receipt.json` as the
shape of the canonical payload. Replace every synthetic value with observed
facts; do not copy example timestamps, hashes, commands or outcomes. The payload
has `returned_at`, `head_revision`, `checks`, `evidence`, `blockers`, `next_action`
and `used_assets`. Unknown/skipped checks have a null exit and a truthful string
output description; an unexecuted check has no successful evidence.

Return a JSON transport envelope with the canonical payload in `receipt` and
the actual run reference, immutable brief binding, native host/session identity
and action observations in `context`. This envelope is external transport, not
a new canonical record type. Its context is not imported into `runs.receipt`;
the coordinator checks it against the existing run and records permitted context
in the run's existing fields or inert extensions. An unavailable session ID
stays unknown with its reason, never an invented identifier.

Before recording evidence, read the actual UTC clock, recheck current authority
and observe the source. Capture the observation's clock time in that same native
operation, and capture command output and exit before running another command.
Capture return time when writing the return. If an earlier observation was not
timed, reobserve the source under current authority and record that new event,
or omit unmeasured optional evidence and report the gap as a blocker. A timestamp
from a different event cannot fill the missing observation.

Every evidence reference names a real file contained in its declared repository,
at the reported revision. A directory, `.`, an absolute path or a parent traversal
is not a native evidence file. Repository-wide observations can cite the relevant
native task/instruction file and describe the actual Git command and result.

With the returned envelope saved at an agreed noncanonical path, this command
uses the installed validator's existing API without writing canonical files:

```text
node --input-type=module -e "import {readFileSync} from 'node:fs'; import {resolve} from 'node:path'; import {pathToFileURL} from 'node:url'; const {checkShape}=await import(pathToFileURL(resolve(process.argv[1],'validate.mjs')).href); const value=JSON.parse(readFileSync(process.argv[2],'utf8')); const errors=checkShape(value.receipt,'receipt'); console.log(JSON.stringify({valid:errors.length===0,errors},null,2)); process.exitCode=errors.length?1:0;" "<installed-workspace-assets>" "<external-return.json>"
```

Retain the complete output and exit. This checks the canonical payload's shape
only: independently check native file references, exact brief/grant binding,
actual command results and clock evidence. If authorised context is available,
the ordinary workspace validator can also read the current records without
canonical writes; it does not evaluate an unimported return. The coordinator
preserves the original external return, checks its evidence before canonical
reconciliation, and validates the resulting records. A missing or invalid
return never becomes completed work through a model's success statement.

## Upgrade and removal

Keep skills and workspace assets pinned to the same package revision. Review
changes in a scratch copy first, including schema compatibility and native
host discovery. Replace only installed product assets after confirming their
ownership; never overwrite adopter templates, canonical records, ignored
local state or member repositories as part of a plugin update. Existing
records require no migration or renumbering simply because the package changes.

For detached installations, copy all fourteen skill directories and the full
workspace directory from the same package. Preserve bootstrap/templates and
all declarative sidecars; copy workspace to docflow-workspace beside skills.
No executable belongs in a skill folder. An unavailable Node.js 22+ or missing
assets blocks validation-dependent writes, with no automatic installation.

Uninstall through the host's documented plugin/skill removal interface or
remove only the owned installed copies after checking resolved paths. Leave
README, AGENTS, .docflow_workspace and independent members in the adopter
workspace intact. Remove an optional retrieval collection only under its
explicit owner/scope; canonical memory is not an index or plugin cache.

## Status at a glance


- **This run:** Supplies portable installation and operating instructions.
- **Overall:** partially verified â€” deterministic asset tests are separate from native qualification.
- **Yet to do:** Author actual scoped records, verify current native authority
  and complete native host and consumer qualification.
