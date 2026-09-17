# Native external receipt usability diagnosis

> Raw run artifacts referenced in this receipt were relocated out of the repository under adr/0057-bounded-verification-evidence.md; the outcomes, hashes and limits below are retained.

Source: `f47f4c52313163f1ffe55a97d9c8029602d7c5b4`, development 0.9.4.
Owning decisions: ADR 0052 and ADR 0053. No pinned product bytes changed when this diagnosis was recorded. The controller later approved bounded native item 0065; its new package is qualified separately.

## Finding

The real external assignment returned a receipt whose shape passed but whose
native evidence included two directory paths (`.`), which canonical validation
rejects. A report-only native amendment repaired the paths but substituted one
measured check time for several unknown observation times. Those substitutions
remain unverified; the coordinator's separate observations cannot retrospectively
attest the executor's reads. This is a demonstrated native handoff usability
failure, with instruction compliance and supporting product guidance both relevant.

The two later native stops have a different meaning. Cross-workspace ownership
and shared-resource checks blocked **before an A attempt was created**. Their
external readiness reports preserve the reason and native sources, but they are
not canonical attempt receipts. Testing those objects against the receipt schema
shows why importing them as `runs.receipt` would fail; it does not invalidate the
independently demonstrated pre-dispatch stop or imply an A attempt ran.

## Reproduction and exact limits

Run the read-only diagnostic against the frozen installed asset root:

```text
node evals/hosts/inspect-native-receipts.mjs <frozen-package>/plugins/docflow/workspace <original-return.json>...
```

The actual diagnostic output uses the
product's exported `checkShape` function on each unchanged native return. It
also lists native path syntax separately. The command exited **1**, as expected
for retained failing inputs. No native model was rerun and no return was repaired.

| Original return | Installed receipt shape | Additional finding |
| --- | --- | --- |
| External assignment, nested `receipt` | Pass | Two `.` native paths fail canonical validation; several exact observation times lack clock evidence. |
| Assisted amendment, nested `receipt` | Pass | File paths repaired; declared time stand-ins still do not establish actual observation times. |
| Unknown-owner readiness | Fail | Missing `head_revision`, extra envelope fields and invalid `used_assets`; no A attempt existed. |
| Shared-resource readiness | Fail | Missing `head_revision`/`evidence`, extra envelope fields, null check output and invalid `used_assets`; no A attempt existed. |

The original assignment's canonical rejection and the later independent
reconciliation are preserved in original reconciliation
and reconciliation revision 2. Passing
shape checks cannot establish path resolution, grant/brief binding, truthful
times or actual execution. The shared-resource native process also created two
temporary validator-summary files; its claim to have written only its report is
too broad. The independent assertions retain
that limit while establishing unchanged canonical/member/product roots.

## What the installed product already provides

- `validate.mjs` exports `checkShape(value, definition)`. Standalone **shape**
  validation is possible without canonical writes; claiming no API exists would
  be incorrect.
- Its CLI accepts a workspace root, `--at`, and optional `--previous`. It has no
  documented external-return/brief input. The installed operating skill only
  demonstrates the workspace CLI.
- `workspace-receipt.json` is a seven-field canonical receipt payload with
  clearly labelled synthetic example values. It is not an external transport
  envelope or a pre-dispatch readiness report.
- The guide requires actual host/session identity and external receipt return;
  the operating skill requires exact action times, forbids invented schema fields,
  and correctly distinguishes validation from permission or execution evidence.
- Native path resolution, chronology, grant consistency and attempt reconciliation
  are checked inside workspace validation. The exported shape function alone
  cannot catch the original directory-reference error.

These instructions do not demonstrate how an external executor should package
identity metadata alongside the strict receipt, check it without changing the
canonical run, or return a pre-dispatch stop without inventing a run. That is the
small, reproducible guidance gap. The evidence does **not** establish that the
schema cannot represent a truthful receipt or that an unknown timestamp should
be allowed to satisfy a required observation.

## Smallest proposed correction, not implemented

1. Document a clear external envelope: immutable brief/run binding and native
   session metadata outside an unchanged canonical `receipt` payload. Explain
   that a readiness stop without an attempt is a separate report, not a fabricated
   terminal run or an object ready for `runs.receipt`.
2. Give the external executor a supported, read-only validation command or
   documented API recipe. Start with the existing `checkShape`; include native
   file-path requirements and a coordinator-side in-memory receipt preview against
   the exact brief/workspace context before canonical import. Return diagnostics
   without creating a run, altering a grant or weakening any existing check.
3. Show clock capture immediately around actual observations/checks and at return.
   Never fill missing historic times from an example or a different measured
   event. Omit unmeasured optional evidence or report the missing measurement as
   a blocker; let a new observation carry its own actor and actual time.
4. Add one actual external read-only executor case and one pre-dispatch readiness
   case against the revised instructions, retaining original failures. Verify
   receipt validity, source binding, no canonical writes and measured times
   independently. Only rerun affected qualification after the controller resets
   the source freeze.

This proposal needs a bounded native item before implementation and a controller
source-freeze reset before changing skill, template, contract or asset bytes.
No schema loosening, invented timestamps or retroactive pass is proposed.

## Status at a glance

- **This run:** Replayed original returns through the installed shape API and
  separated actual handoff defects from pre-dispatch readiness reports.
- **Overall:** Demonstrated receipt usability finding; correction proposed only.
- **Yet to do:** Controller decision, bounded native repair item and freeze reset
  if selected, followed by source-bound adverse and successful native reruns.
