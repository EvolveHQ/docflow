# 0073 — V1 workspace documentation and site

Owning decisions: adr/0059-five-workspace-commands-and-mandate-note.md,
adr/0051-portable-workspace-memory-contract.md and
adr/0061-v1-workspace-host-guides.md where the guide set is named.

## Status

- **Claimed by:** pi, docflow-v1 delivery, 2026-09-19, branch
  `kmox83/docflow-v1-targets-docs`.
- **Blockers:** None for the documentation change. Local Jekyll is not
  installed; graph rendering is checked against the pinned Mermaid build and
  the layout wiring, not a local Jekyll build.
- **Stopped:**

## Scope

Document the portable workspace on the user-visible surfaces: what a workspace
is, when to use it and how it relates to member repositories; the six kinds of
item and their lifecycle graphs; the five commands that move them; the three
member kinds with a topology graph; and four step-by-step use cases
(greenfield, retrofit, single-repository migration, other cases). Add Mermaid
rendering to the site layout, loaded only on pages that opt in. Update
`README.md`, `USAGE.md`, `docs/index.md`, `docs/methodology.md` and
`docs/examples.md` for the eight targets, seven guides and five workspace
commands. No ADR numbers or titles on any user-visible page.

## Exit criteria

1. `docs/workspace.md` covers the workspace explanation, item kinds and
   workflows with lifecycle graphs, member repositories with a topology graph,
   and the four use cases with step-by-step setup.
2. Mermaid renders on GitHub Pages: `docs/_layouts/default.html` loads a pinned
   Mermaid build only when a page sets `mermaid: true`, and `docs/workspace.md`
   opts in.
3. `README.md`, `USAGE.md`, `docs/index.md`, `docs/methodology.md` and
   `docs/examples.md` state the eight package targets, seven native guides and
   five workspace commands consistently.
4. No real ADR identifier appears in any user-visible file; the verify gate's
   privacy scan stays green.
5. `node scripts/verify.mjs` exits 0 and `node evals/run.mjs` exits 0.

## Receipt

- `node scripts/verify.mjs`: `verify: OK (version 0.9.4, 14 skills, 61 ADRs, 67 shipped plan items)`, exit 0.
- `node evals/run.mjs`: `11 passed, 0 failed, 6 skipped`, exit 0.
- New page: `docs/workspace.md` (three Mermaid graphs, four use cases).
- Jekyll not installed locally: rendering checked by layout wiring and pinned
  Mermaid version, not a local build.

## Status at a glance

- **This run:** wrote the workspace page and updated the user-visible surfaces
  for eight targets, seven guides and five commands; gates green.
- **Overall:** verified documentation, not shipped; local Jekyll preview
  unavailable so rendering is checked structurally.
- **Yet to do:** coordinator review and integration, required CI on the PR
  head, and an optional local Jekyll preview.
