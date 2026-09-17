# 0063 — W5 — Verify operator adoption and recovery

Owning decisions: adr/0053-portable-workspace-operating-skills.md and adr/0055-source-bound-repository-producer-fixtures.md.

## Status

- **Claimed by:** pi, docflow-v1 delivery, 2026-09-16, branch
  `kmox83/docflow-v1-operator-pilot-prep`.
- **Blockers:** The journey itself and the acceptance result are operator
  actions; combined Clarity pairing is separate. D4/W4 evidence is integrated
  on the review branch, but items 0061/0062 keep their own open status.
- **Stopped:**

## Dependencies

D4 and W4 passing on the exact combined candidate; paired Clarity release preparation and operator-selected existing repository.

## Scope

Prepare and run the operator's installation/setup/Clarity-resume journey on the pinned package. Verify upgrades and removal preserve canonical workspace records, templates, member repositories and native methods. Include reference-only data boundaries and source-bound receipt reconciliation. The operator supplies his final acceptance result; agents do not invent signatures or independent adoption.

## Exit criteria

1. Operator reports the actual agreed journey result; two product revisions, package/artifact hashes, host evidence and recovery checks are pinned. Final-main completion, D5/family freeze and publication remain separately authorised.
2. Record exact source, host version/platform/mode, commands/output/exits, native versus simulated scope and outstanding cases.
3. Follow single-writer ownership, signed commits, native acceptance and checked PR integration. No implicit release/version-bump authority.

## Receipt (2026-09-16)

Preparation only. The operator journey is **unrun**; no native, Clarity or
operator result is claimed. Item stays todo; decisions 0053/0055 stay Accepted.

- Pinned candidate `10fc139b6c2144c363d44cccef942225e529e16d`, version 0.9.4.
- `npm pack` exit 0: 332 files, content digest
  `cf4cdc2bee3354a626f01d0661d0d52e6ce2c1f9abd9735985a2eaa524a3cfef`,
  tarball SHA-256 `c0dac1dbd9bea0442525ca050d05fb9aaad6d4caa07710e2e7d713723fd3676f`.
- Upgrade input revision one `a60cfcdf05188845620d3a28f21e3ccc188fb83d` (0.9.3);
  its raw freeze was relocated out of the repository under ADR 0057.
- `node scripts/verify.mjs` exit 0; `node evals/run.mjs` exit 0 (10 passed,
  0 failed, 6 skipped). No audit, log or raw-artifact files committed.
- Journey steps and result capture: see the task PR body.

## Status at a glance

- **This run:** pinned the combined candidate and the operator journey steps on
  a signed commit.
- **Overall:** partially verified — preparation only. **Unrun:** the full
  operator journey, Clarity resume and every native host step.
- **Yet to do:** operator journey result, combined Clarity pairing, final-main
  completion.

