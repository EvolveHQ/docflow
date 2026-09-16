# Operator pilot preparation — docflow V1 adoption and recovery

Owning decisions: adr/0053-portable-workspace-operating-skills.md and
adr/0055-source-bound-repository-producer-fixtures.md.
Plan item: plan/todo/0063-operator-workspace-adoption-and-recovery.md.

This document prepares the operator's existing-repository V1 journey and
freezes the package it must run against. **No native journey was executed
for this preparation.** Every step below is unrun; the operator supplies the
actual result and this item must not be reported as shipped or accepted.
The item stays in `plan/todo` and its decisions stay `Accepted`.

## Pinned candidate

The freeze receipt is
[`package-freeze.json`](2026-09-16-operator-pilot/package-freeze.json).

| Field | Value |
|-------|-------|
| Docflow version | `0.9.4` (all three manifests agree) |
| Source revision | `10fc139b6c2144c363d44cccef942225e529e16d` (`kmox83/docflow-v1-integration` after PRs #12 and #13) |
| Package file | `evolvehq-docflow-0.9.4.tgz` |
| Tarball SHA-256 | `c0dac1dbd9bea0442525ca050d05fb9aaad6d4caa07710e2e7d713723fd3676f` |
| npm integrity | `sha512-Dy4Xm1iqxpGCWkejSM1nWvqYUa+LRaNeIHx3BgR5WyPS6hmyJD0nAmtdZ4i5Fga/IH3x5ydM7+jqz/JwhrCaJg==` |
| Packed files | 332 |
| Content digest (stable identity) | `cf4cdc2bee3354a626f01d0661d0d52e6ce2c1f9abd9735985a2eaa524a3cfef` |

The content digest is SHA-256 over case-sensitive POSIX relative paths
sorted, each path, NUL, raw file bytes, NUL. It is the stable identity for
the journey; the tarball hash is recorded for the exact artifact but gzip
repacking can change it without changing any file. Per-file SHA-256 values
are in the receipt.

**Upgrade input (revision one).** The journey also installs the historical
`0.9.3` package: source `a60cfcdf05188845620d3a28f21e3ccc188fb83d`, plugin
digest `cbe3433f05ce6d7fb7f97c3b8a97da631a16350bd7a989af62faac50d5ff097b`,
frozen in
`audits/2026-09-15-host-qualification/upgrade-0.9.3-freeze.json`. That file
is historical input, not the current candidate. Together the two revisions
satisfy exit criterion 1's two-pinned-revisions requirement.

## Reproduce the freeze

```text
npm pack --pack-destination <fresh-directory>
# extract, then compute the sorted path+bytes digest over package/ contents
```

Expect 332 files and content digest
`cf4cdc2bee3354a626f01d0661d0d52e6ce2c1f9abd9735985a2eaa524a3cfef`.
A mismatch stops the journey; do not proceed on changed bytes.

## Operator journey (execute, then report)

Run each step in the operator's chosen existing repository and record the
actual command, output and exit code. Expected observations are guidance,
not results. Do not retrofit missing measurements.

1. **Install.** Install the pinned `0.9.4` package on the operator's host.
   *Expect:* the host discovers five package targets or thirteen skills in
   the package mode used.
2. **Setup.** Use `workspace-setup` to create or adopt the workspace home and
   registry in the existing repository.
   *Expect:* registry, `.docflow_workspace/` kinds and templates written;
   no member repository modified.
3. **Orient.** Use `workspace-orient` in a fresh session.
   *Expect:* priorities, owners, current authority, blockers and next
   actions recovered from current native state — not a fabricated completion.
4. **Plan.** Use `workspace-plan` to record one outcome and its deliveries.
   *Expect:* selection and agreement recorded with no execution authority
   implied.
5. **Coordinate.** Use `workspace-coordinate` to hand off one bounded brief
   and reconcile the returned receipt.
   *Expect:* a readiness report is not stored as `runs.receipt`; only a real
   returned receipt with evidence supports "done".
6. **Clarity resume.** Have Clarity read and prepare the handoff, then resume
   the workspace on the operator host.
   *Expect:* Clarity views/copies leave canonical bytes unchanged;
   authorised host edits appear only after refresh.
7. **Upgrade and removal.** Install `0.9.3`, then apply the frozen `0.9.4`
   package, then remove the plugin.
   *Expect:* canonical workspace records, templates, member repositories and
   native methods preserved through both steps.
8. **Reference-only boundary.** Confirm the consumer surface never wrote
   canonical records or member files.

Record before/after digests of the canonical workspace and member roots so
preservation is proved by bytes, not by a success message.

## Result capture

Fill `operator_result_template` in the freeze receipt and return it with raw
command outputs. An unknown stays unknown with its reason; a skipped check
gets a null exit. The operator's reported result — not an agent summary — is
the acceptance evidence for exit criterion 1.

## Retained limits

- The journey is **unrun**. No host, Clarity or operator result is claimed.
- Combined Clarity pairing and the final main completion event remain
  separately authorised.
- No release, tag, publication or version bump is part of this preparation.

## Status at a glance

- **This run:** prepared the operator journey and froze the current combined
  candidate (`10fc139`, 332 files, digest `cf4cdc2b…`) with a machine
  receipt and result template; no native execution.
- **Overall:** preparation only — the operator journey is unrun and
  acceptance is not established.
- **Yet to do:** operator execution and result, combined Clarity pairing,
  final main completion.
