# 0067 — Document the portable-workspace capability on every user-visible surface

Owning decisions: adr/0051-portable-workspace-memory-contract.md,
adr/0052-workspace-authority-and-attempt-records.md and
adr/0053-portable-workspace-operating-skills.md.

## Status

- **Claimed by:** pi, docflow-v1 delivery, 2026-09-16, branch
  `kmox83/docflow-v1-workspace-docs`.
- **Blockers:** None for the documentation change. Native host/Clarity
  qualification and the operator pilot remain separate items and are not
  claimed here.
- **Stopped:**

## Scope

The four workspace operating skills and the portable workspace assets ship in
this release, and `README.md` already lists them. `USAGE.md`, `docs/index.md`
and `docs/methodology.md` still present the nine-skill product, so a reader of
the public guide or site cannot discover the workspace capability at all.
`README.md` also still claims the foundation assets "do not yet add the four
workspace operating skills", which is false on the current source.

Document the shipped capability across the user-visible surfaces and remove the
stale statement. Cover the four skills and when to use each, the workspace
anatomy (adopter-owned Git home, registry, five memory kinds), installing the
complete assets for detached copies, the authority boundary (selection and
agreement grant no execution), the readiness-versus-receipt distinction, the six
native host guides, and the honest qualification limits. Product behaviour,
skills, templates, manifests, schema, validator and versions are unchanged.

## Exit criteria

1. All four workspace skills are named and described in `USAGE.md` and
   `docs/index.md`, and `USAGE.md` explains when to reach for each.
2. `USAGE.md` documents installing the complete workspace assets (plugin/npm
   plus the `docflow-workspace/` sibling for standalone copies) and points at
   the asset guide.
3. `USAGE.md`, `docs/index.md` and `docs/methodology.md` state that selection
   and agreement grant no execution authority, that a readiness report is not a
   receipt, and that native-host, Clarity and operator qualification remain
   outstanding — without claiming shipped-main or a released V1.
4. The stale `README.md` claim that the foundations "do not yet add the four
   workspace operating skills" is corrected.
5. `node scripts/verify.mjs` exits 0 and `node evals/run.mjs` reports
   10 passed / 0 failed / 6 skipped, exit 0; no real ADR identifier appears in
   any user-visible file, so the privacy scan stays green.
6. All three manifests remain at the matching version 0.9.4 and the five targets
   are untouched.
