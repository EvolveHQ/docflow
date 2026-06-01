# 0001 — Skill & manifest static validator

Owning ADR: adr/0011-static-skill-validation.md

## Scope

Build the static validator that becomes the verify gate. Extends
`scripts/verify.mjs` (or a sibling `scripts/lint-skills.mjs` it calls)
to walk `skills/*/SKILL.md` and the manifests.

## Exit criteria

Maps to adr/0011-static-skill-validation.md acceptance criteria:

1. One command validates every `SKILL.md` frontmatter (name +
   description present) and required sections; non-zero exit on any
   failure. → AC1
2. Flags agent-specific invocation syntax (`/name`, `/skill:name`) in
   skill bodies. → AC2
3. Flags ADR-number/title leakage in `skills/`, `templates/`, `README`,
   `USAGE`, `docs/`. → AC2
4. Subsumes the existing manifest-parse + version-sync checks. → AC3
5. No network, no model call. → AC4
6. Wired as `npm run verify`.

## Dependencies

None (folds in existing `scripts/verify.mjs`). Do first.
