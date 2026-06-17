# 0013 — Configurable artifact root (bootstrap question + path resolution)

Owning ADR: adr/0017-configurable-artifact-root.md

## Scope

Let bootstrap place the non-entry artefacts under a chosen root, and make
the lifecycle skills resolve paths against it.

- `bootstrap/SKILL.md`: add an **artifact-placement** assessment question
  (`docs/` default · root · `.docflow/`); always write AGENTS.md +
  CLAUDE.md to the repo root; place adr/, plan/, _agent/, INDEX.md,
  CONVENTIONS.md under the chosen root.
- Record the chosen root in `CONVENTIONS.md` (a documented key skills
  read).
- `new-adr`, `new-plan`, `ship-item`, `audit`: resolve `adr/`, `plan/`,
  `INDEX.md` relative to the configured root (read it from CONVENTIONS).
- Offer a documented migration path for existing repos; do not force it.
- Update `README.md`/`USAGE.md` and the bootstrap templates' cross-paths.

## Exit criteria

Maps to adr/0017-configurable-artifact-root.md acceptance criteria:

1. Bootstrap asks the placement question (docs/ default). → AC1
2. AGENTS.md/CLAUDE.md always at repo root. → AC2
3. Chosen root recorded in CONVENTIONS; skills resolve paths against it.
   → AC3
4. INDEX cross-refs + verify/audit honour the root. → AC4
5. Existing repos not force-migrated; migration documented. → AC5
6. `node scripts/verify.mjs` stays green.

## Dependencies

Depends on 0012 (layered model). Touches the most skills — schedule after
0012.
