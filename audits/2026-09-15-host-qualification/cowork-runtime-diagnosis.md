# Cowork cloud/device asset boundary

Candidate: `f47f4c52313163f1ffe55a97d9c8029602d7c5b4`, development 0.9.4.
The original [external result](cowork-current-external-result.json) distinguishes
captured process phases from model-transcribed host metadata and interpretation.
The [independent assessment](cowork-current-independent-result.json) and
[restoration](cowork-restoration-verification.json) remain separate evidence.

## Actual execution locations

| Context | Actual observation | Result |
|---|---|---|
| Cowork cloud session | Linux 6.18.44, Node 22.22.2; registered plugin under `/root/.claude/plugins/synced/…/docflow` | Native 13-skill discovery and asset reads succeeded. |
| Cowork device VM | Linux 6.8.0, Node 22.23.2; selected Windows folder mounted at `/sessions/rcw-01ytaalx181dvvz53wubgeiv/mnt/cowork-session` | Created 12 workspace files; registered cloud asset path was unavailable here. |
| Windows controller after return | Same actual selected folder, raw frozen validator | Independent validator exit 0; this does not turn the Cowork failure into a native pass. |

Both native validator calls ran **in the cloud context**. At 05:03:07Z it ran
`node "$A/validate.mjs" "C:/Users/eugen/AppData/Local/Temp/docflowhq-v1-20260915/qualification-ctx-fc206cf7e4a8/cowork-session/current-workspace" --at "$AT"`.
Exit 1 reported `lstat '/home/claude/C:'`: a Windows path was interpreted by
Linux in a different filesystem. At 05:03:08Z it tried the device VM's
`/sessions/rcw-01ytaalx181dvvz53wubgeiv/mnt/cowork-session/current-workspace`
with the same cloud validator, again exit 1, this time `lstat '/sessions'`.
The original receipt retains the full commands, output hashes and outputs.

The native device preflight also searched root/home for asset filenames after
testing the known registered path. That broad search does not demonstrate a
strict authorised-root boundary; it was unnecessary to establish that the known
cloud path was inaccessible. No such broad search is recommended here.

## Existing attached package and guidance

The device preflight listed `docflow-package` in the selected folder and its
preservation capture read all 331 file hashes. That copy still exactly matches
the frozen package, includes `workspace/validate.mjs` and `schema.json`, and sits
beside the actual workspace in the same device mount. A device-local command
using `docflow-package/workspace/validate.mjs` was technically available in that
layout without copying assets into canonical records or installing anything.
It was **not executed**, so its native outcome remains unrun.

The brief forbade substituting the attached package for **native discovery**;
that requirement had already been satisfied independently. It also repeatedly
requested the "installed" validator, which the executor interpreted as requiring
the registered cloud path. The skill and asset README already allow an explicit
asset root, but do not explain how to distinguish native plugin discovery from
a verified same-revision asset copy in another execution context. The failure
therefore combines a cross-filesystem path error with an overly narrow reading
of the brief; no lack of Node or missing package bytes is demonstrated.

A minimal prospective clarification in the asset README can require checking
that the chosen execution context can read both the target and assets before
setup, and recording a permitted same-revision explicit asset root separately
from native discovery. It must preserve scope/denial rules and require a blocker
when no currently authorised route exists. No additional Cowork run, plugin
change, asset copy or product edit has been performed for this diagnosis.

## Status at a glance

- **This run:** Preserved both native exit-1 commands and actual cloud/device
  contexts; independently confirmed the local workspace and original restoration.
- **Overall:** Native validation blocked; controller stop deadline failed during
  the usage-limit interruption. The attached-copy native validation route is unrun.
- **Yet to do:** Controller disposition of the concrete minimal guidance proposal,
  any separately authorised new source freeze and affected native qualification;
  no retroactive native pass or timing attestation.
