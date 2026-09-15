# 0060 — Keep native history inspection local and source-bound

Owning decisions: adr/0051-portable-workspace-memory-contract.md and
adr/0052-workspace-authority-and-attempt-records.md.

## Status

- **Claimed by:** Codex, task_b2132a3cb8c3 / ctx_06d7b40b0d52, 2026-09-15,
  branch `kmox83/docflow-v1-workspace-skills`.
- **Blockers:** None for the bounded correction; coordinator owns Clarity pairing.
- **Stopped:**

## Scope

Coordinator finding msg_bfec5b9bf4b4: the reviewed historical fallback can
lazy-fetch promisor objects, inherit Git repository/config redirects and
conflate case-distinct roots on Linux. Correct only local historical native
file inspection. Preserve schema, historical todo-to-done success and the
no-network/no-hook contract. Unsupported Git or absent objects remain unavailable.

## Dependencies

Reviewed W1/W2 and coordinator's paired Clarity notification to ctx_93e578505af6.

## Exit criteria

1. Disable lazy fetch, replacement objects and optional locks; isolate inherited
   repository/config redirects and compare canonical roots with platform semantics.
2. Require exact revision, path, regular-file mode and available local blob.
3. Genuine redirected-environment and missing-promisor controls reject unsafe
   fallback without network or remote-helper execution; normal history resolves.
4. Separate gate/control and product commits, passing required checks, exact
   corrected validator source/hash sent through coordinator; no schema change.

Keep todo pending final-main completion; the correction is review-ready only
after current-head CI and source-bound evidence.
