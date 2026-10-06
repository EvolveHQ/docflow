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

## Receipt

- `node scripts/verify.mjs`: `verify: OK (version 0.10.0, 14 skills, 63 ADRs, 68 shipped plan items)`, exit 0.
- `node evals/run.mjs`: `13 passed, 0 failed, 0 skipped`, exit 0; hostless suite, no native acceptance asserted.
- `node --test evals/workspace*.test.mjs evals/repository-producer.test.mjs`: 133 passed, exit 0; CI consumer/permission/seed/isolation tests: 104 passed, exit 0; verify mutations: 15 rejected, exit 0.
- `npm pack --json --pack-destination /tmp/hq-qa/docflow-release-tools` and offline scratch `npm install --ignore-scripts --no-audit --no-fund --offline`: exit 0. Package SHA-256 `040db60b14ed6dae6197f4d51cda443f41ef2f35d33964111dbb0c4b2c8da978`; 364 files, 2,857,619 unpacked bytes. Packed byte comparison, detached resolution and valid/empty fixture commands: exit 0; adverse validation: expected exit 1 with schema diagnostic.
- Scratch Jekyll 3.10.0 safe build: exit 0; rendered check: 16 HTML pages, 316 local links/assets, zero failures. Isolated Chromium: four processed Mermaid diagrams, no parse error, exit 0.
- Raw logs, scripts and branch inventory are external in the operator-selected release handoff. Exact frozen HEAD and command receipts are supplied there; no native run, deployment or publication performed.

## Status at a glance

- **This run:** Consolidated applicable work already present in the isolated base; preserved two archived alternatives, integrated complete guides/examples, corrected Pages routes and versioned package/docs, verified scratch installation and render.
- **Overall:** Locally verified 0.10.0 portable-package candidate; ready for controller exact-head review, not shipped. All broad native/Clarity items remain pending.
- **Yet to do:** Controller review, authorised PR and required CI, checked standard merge and completion bookkeeping, tag/GitHub release/Pages deployment; npm publication requires operator authentication. Native qualification and parked Clarity remain separate future work.
