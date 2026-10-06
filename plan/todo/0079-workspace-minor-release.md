# 0079 — Workspace minor release candidate 0.10.0

Owning decisions: adr/0009-distribution-marketplace-npm.md,
adr/0051-portable-workspace-memory-contract.md,
adr/0058-workspace-contract-r2.md,
adr/0059-five-workspace-commands-and-mandate-note.md,
adr/0060-v1-package-target-set.md and adr/0061-v1-workspace-host-guides.md.

## Status

- **Claimed by:** docflow-release-writer, 2026-10-06, branch `feat/workspace-minor-release`; sole member writer under the operator's release mandate.
- **Blockers:** Full native host qualification, Clarity and public integration/publication are outside this candidate. Controller review required before push or PR; explicit operator instruction overrides the usual early draft PR step.
- **Stopped:**

## Scope

Consolidate applicable unintegrated work into a reviewable portable workspace
minor release. Inventory all branch deltas; preserve future work and existing
native acceptance limits. Correct product/documentation inconsistencies, add
complete accessible adoption guides and examples for existing repositories and
workspaces, mixed members and new workspaces/repositories, link them from
README/USAGE and Pages, bump all six manifests to 0.10.0, and prepare release
notes and package evidence. No host configuration, paid execution, Clarity,
push, PR, merge, tag or publication. Historical implementation-stage version
constraints describe those stages; this release advances their package version
without claiming full-family acceptance.

## Exit criteria

1. Every non-ancestor branch delta is classified as incorporated, superseded or deferred with a reason in the external handoff.
2. Guides use current commands/assets and distinguish native completion, workspace observation and execution authority; local navigation and links work.
3. Six version manifests agree on 0.10.0; a packed installation contains fourteen skills and complete workspace assets and passes scratch asset resolution/validation.
4. `node scripts/verify.mjs`, `node evals/run.mjs` and relevant deterministic/package/guide checks report exact exits; skipped native execution is explicit.
5. Candidate is clean and signed; external writer-result names exact HEAD, package digest, commands/exits, scope, remaining checks and controller integration/release actions.
6. Pending full-native/Clarity/future items stay pending; this reservation stays todo until checked integration, with no invented PR footer or shipped claim.
