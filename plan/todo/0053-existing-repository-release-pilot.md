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

## Status

- **Claimed by:** Codex, 2026-09-14, `kmox83/docflow-release-verification`.
- **Blockers:** Pilot execution and applicable criterion review pending.
- **Stopped:**
