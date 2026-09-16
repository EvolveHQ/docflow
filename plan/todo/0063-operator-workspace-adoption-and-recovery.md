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

## Latest checkpoint (2026-09-16)

The largest unblocked portion is prepared: the operator journey and a
source-bound freeze of the current combined candidate. Preparation source is
`10fc139b6c2144c363d44cccef942225e529e16d`; the packed `0.9.4` artifact has
332 files and content digest
`cf4cdc2bee3354a626f01d0661d0d52e6ce2c1f9abd9735985a2eaa524a3cfef`, with the
historical `0.9.3` input pinned separately. Exit criterion 2 is partially met
(prepared commands and boundaries recorded) and exit criterion 1's journey is
**unrun** — the operator supplies the result. No native or Clarity execution is
claimed.

## Verification receipt

- Preparation document:
  [`audits/2026-09-16-operator-pilot-preparation.md`](../../audits/2026-09-16-operator-pilot-preparation.md).
- Machine freeze and result template:
  [`audits/2026-09-16-operator-pilot/package-freeze.json`](../../audits/2026-09-16-operator-pilot/package-freeze.json).
- `npm pack` at the preparation source: exit 0, 332 files, digest above.
- `node scripts/verify.mjs` and `node evals/run.mjs`: see the task PR.

## Status at a glance

- **This run:** prepared the operator journey and froze the combined candidate
  (`10fc139`, 332 files); no native execution and no operator result.
- **Overall:** partially advanced — preparation only; item stays todo and
  decisions 0053/0055 stay Accepted.
- **Yet to do:** the operator's actual journey result, combined Clarity
  pairing, final-main completion and the checked integration event.

