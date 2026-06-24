# 0027 — Federation prose corrections

Owning ADRs: adr/0020-federation-bootstrap-establish-join.md,
adr/0023-federation-config-membership-index.md,
adr/0024-federated-rollup-catalogue.md

## Scope

Three focused corrections from the assessment, to already-Implemented
ADRs (commit + Revision History row each; status stays Implemented).

- **0020 — join contradiction.** In bootstrap, the operator **supplies**
  topology + identity scheme at join; the skill records them into the
  local `federation.md`. Delete the contradictory "read them from the
  home" wording (a joining repo performs no cross-repo read).
- **0024 — pin the roll-up filename.** In the `rollup` skill, fix the
  output to **`ROLLUP.md` at the configured artefact root** (drop the
  "e.g."), so re-runs are idempotent.
- **0023 — artefact-root.** In bootstrap, resolve `federation.md`,
  `federation-index.md`, and `ROLLUP.md` paths against the configured
  artefact root, and reflect it in the Step 2 layout note.

## Exit criteria

1. Join obtains topology/identity by operator input, recorded locally; no
   "read from home" wording remains. → 0020 AC5/AC6
2. Roll-up output is a fixed `ROLLUP.md` at the artefact root. → 0024 AC3/AC4
3. Federation file paths resolve against the configured artefact root. → 0023 AC4
4. Revision History rows on 0020/0023/0024. → audit-trail policy
5. `node scripts/verify.mjs` stays green.

## Dependencies

Independent of 0025/0026. Trivial prose; smallest of the three.
