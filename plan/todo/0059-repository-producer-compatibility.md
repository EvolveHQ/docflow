# 0059 — Source-bound repository producer fixtures (D3)

Owning decision: adr/0055-source-bound-repository-producer-fixtures.md.

## Status

- **Claimed by:** Codex, task_b2132a3cb8c3 / ctx_06d7b40b0d52, 2026-09-15, branch `kmox83/docflow-v1-workspace-skills`.
- **Blockers:** None for bounded implementation. Final-main completion remains outside this dispatch.
- **Stopped:**

## Scope

Distribute a versioned repository fixture collection generated from exact bootstrap/authoring templates and retained legacy producer files. A documented deterministic renderer preserves source bytes outside explicit substitutions and emits per-file origins, hashes and expected observations. Include valid roots and lifecycle variants plus genuine invalid-pointer, duplicate and unknown diagnostics. Distinguish synthetic rendered records and simulated integration metadata from observed native execution, and hand the exact source revision to the Clarity owner through the coordinator.

Own this package's product files, native records and necessary separate gate commits. The coordinator owns integration into `kmox83/docflow-v1-integration`; no self-merge, main, tag, public publication or version bump. Preserve prior evidence and single-writer ownership.

## Dependencies

Reviewed W1/W2 integration `9f748b806e9ab8eb8985e05d437f5c5f356dd248`; settled D2 product source before fixture production.

## Exit criteria

1. Owning decision criterion 1: Versioned cases cover default .docflow, root dot, docs and custom nested pointers, no-manifest legacy, explicit and legacy two-shape layouts and optional layers.
2. Owning decision criterion 2: Native claimed/blocked/stopped/resumed, prepared versus integrated completion, moves/history and federation cases preserve identifiers and historic done bytes.
3. Owning decision criterion 3: Each produced file records exact template or retained-file origin and substitutions; per-file SHA-256 and exact producing Git revision are published in a reproducible manifest.
4. Owning decision criterion 4: Independent controls assert discovery/shape/status semantics and invalid-pointer/duplicate/unknown diagnostics without silently migrating files; actual renders and mutations are exercised.
5. Owning decision criterion 5: The coordinator receives a source-bound C2/C12 handoff; no Clarity files are written, and unrun native/app cases remain queued.
6. Owning decision criterion 6: Static, deterministic and fixture controls pass with gate changes in separate commits and all versions remaining 0.9.4.

Keep the item todo and decision Accepted pending the actual main completion event. A review-ready task PR against the review integration branch is not shipped main. Record verified source, PR and exact results in the package receipt before settlement.

## Verification receipt

Verified work HEAD: `abdfba27284ad73c573af50690029fdcb8ebaed5`.
PR: https://github.com/EvolveHQ/docflow/pull/9, against the review integration
branch. Exact outputs, hashes, acceptance mapping and qualification limits:
[`audits/2026-09-15-workspace-skills.md`](../../audits/2026-09-15-workspace-skills.md).
The PR records the final receipt head and its required CI result.

## Status at a glance

- **This run:** Bounded implementation complete; verify OK, evals 10 passed /
  0 failed / 6 skipped, 15 rejected mutations and 106 targeted controls passed,
  all exit 0; actual package/copy checks and source CI passed.
- **Overall:** Verified source development, pending final receipt-head CI and
  coordinator review; not shipped to main.
- **Yet to do:** Coordinator review/integration; D5 and frozen-source D4/W4/W5
  qualifications in separate dispatches; eventual checked main completion.
