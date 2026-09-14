# 0053 — Verify the release workflow in an isolated existing repository

Owning decisions: adr/0012-skill-behavioural-evals.md,
adr/0003-backfill-retrofit.md and adr/0007-lifecycle-skills.md.

## Scope

Use an isolated Clarity clone outside the DocflowHQ workspace, pinned to a
recorded source. Exercise the installed Docflow skills against real existing
history: a queued change, checked completion and recoverable stop. Preserve
original Clarity worktrees/branches, use local test transport, keep builds
Docker-only and isolate resources from concurrent Clarity integration.
Record installed bytes, commands/exits, independent assertions and evidence
limits. This controlled clone pilot is not human validation or adoption.

## Exit criteria

1. Source/history and exact installed skill bytes are recorded; original
   Clarity worktrees are untouched and no Clarity push occurs.
2. Native execution demonstrates a queued change with checked completion and
   a separate recoverable stop, preserving history and approved scope.
3. Independent checks inspect actual files, Git history, gates and reports.
4. Any required external participant/attestation is identified and remains
   pending unless actually supplied; no release readiness is invented.

## Verification and prepared completion

The attended native Codex controller applied the source-pinned skills in an
isolated Clarity clone at `9a89886341ad20984fdf3dc2910e23858519fec2`, outside
the workspace. It queued two scoped changes before implementation, completed
one through checked local transport and preserved the other after an actual
network-disabled dependency failure. Eighteen independent assertions pass;
all 92 original plan records, owning decision, INDEX, gate and product code
remain unchanged. No original Clarity worktree or remote was mutated.

The unchanged Docker-only baseline, work and completion gates each report
`verify: OK`, exit 0, with 316 unit tests and one integration test. The stop
gate records npm `EAI_AGAIN`, exit 1; signed recoverable work remains on its
local branch. The disposable private signer and four unused pilot volumes
were removed; public verification material and fixture histories remain.

See the [release audit](../../audits/2026-09-14-release-verification.md) and
sanitised receipt for exact commits, commands and evidence limits. No accepted
criterion requires a named external participant. This is controlled existing-
repository verification, not independent human adoption or unattended-host
evidence; proposed v1 human validation remains outside this completed scope.

Shipped footer prepared for checked merge — verified work HEAD: `fd0fe0d9c25653e5c1e78dbe80f6421e4796c319`.
PR: https://github.com/EvolveHQ/docflow/pull/7

## Status at a glance

- **This run:** Verified the isolated pilot and prepared its atomic completion
  move. Completion gates pass, exit 0; the separate stop retains its real exit 1.
- **Overall:** verified within this item's scope; completion is prepared.
- **Yet to do:** Required current-head PR checks and an authorised checked
  merge into main make the completion effective. This is not yet shipped.
