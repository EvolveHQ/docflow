# 0071 — Five workspace commands and a committed mandate note

Owning decisions: adr/0059-five-workspace-commands-and-mandate-note.md (new;
supersedes adr/0053); adr/0051, adr/0052 and adr/0054 where they are extended.

## Status

- **Claimed by:** pi, docflow-v1 delivery, 2026-09-18, branch
  `kmox83/docflow-v1-workspace-commands`.
- **Blockers:** None for the offline restructure. Clarity mandate-note parity and
  the PR #20 re-run on these bytes are separate.
- **Stopped:**

## Scope

Rename and restructure the workspace commands into five skills; split
`workspace-coordinate` into `workspace-dispatch` and a new `workspace-sync`;
add the committed operator mandate note (schema, validator, template and
CONTRACT); and update every manifest, marketplace, sidecar, guide, doc, template
and eval that names the old set or the skill count. Keep versions at 0.9.4,
five-target parity, en-GB, and no ADR identifiers in user-visible surfaces. No
audit or raw files; one concise receipt.

## Exit criteria

1. ADR 0059 criteria 1–6 are implemented and controlled.
2. Deterministic valid and adverse controls cover the mandate note and the
   dispatch/sync split, including trigger-disjointness and the
   prepared-PR-is-not-shipped rule.
3. `node scripts/verify.mjs` and `node evals/run.mjs` pass before the single
   push; any gate expectation change is named as tighten-and-repair.

## Receipt

- Mandate note schema/validator commit: `2058956396ed74486b7c7473a8ea61962b3f29e9`.
- `node scripts/verify.mjs`: `verify: OK (version 0.9.4, 14 skills, 59 ADRs, 67 shipped plan items)`, exit 0.
- `node evals/run.mjs`: `11 passed, 0 failed, 6 skipped`, exit 0.
- Product hashes: `schema.json` `3251a1c822f7ad028e04a8c24d4d222ee527ae608e6b181a72199a1d6632f873`; `validate.mjs` `b24a06300f456b291c2cf937cd2e3dd63d08f98c1c0a9bbdebce1cbfdbe2cfa9`.
- Rename map: `workspace-orient`→`workspace-status`, `workspace-plan`→`workspace-scope`, `workspace-coordinate`→`workspace-dispatch` + new `workspace-sync`; `workspace-setup` unchanged.

## Status at a glance

- **This run:** implemented the five-command restructure, the dispatch/sync
  split and the committed mandate note with valid/adverse controls; gates green.
- **Overall:** verified code, not shipped; Clarity mandate-note parity and the
  PR #20 re-run on these bytes remain separate.
- **Yet to do:** coordinator review and integration; Clarity parity; re-run the
  native qualification on the final package.
