# 0053 — Adopt checked pull-request integration

Owning ADR: adr/0050-repository-changes-integrate-through-checked-pull-requests.md.

## Scope

Align repository conventions and the autonomous prompt; add static and
deterministic CI; configure main and merge methods after checks are observed
passing. Keep signed commits and gate changes separate. Update PR #5 only;
merging and release are not authorised by this item.

## Exit criteria

1. The documented workflow and GitHub settings satisfy the owning criteria.
2. Required CI checks pass at the PR head and the local gate passes.
3. The PR body reports prepared work, remaining host checks and no release.

Shipped at HEAD `576851598dd533740501d39ac2d6ecbe1f03350a` via [PR #5](https://github.com/EvolveHQ/docflow/pull/5). Prepared on the PR branch; effective only on the required-checks-passing merge into main.
