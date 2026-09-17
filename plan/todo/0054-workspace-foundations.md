# Workspace foundations — W1/W2

Owning decisions: adr/0051-portable-workspace-memory-contract.md and
adr/0052-workspace-authority-and-attempt-records.md.

## Status

- **Claimed by:** Codex, Orca task task_bdc6fa916a05, 2026-09-15,
  branch `kmox83/docflow-v1-workspace-foundations`.
- **Blockers:** None for bounded implementation; native host, Clarity and
  full V1 qualification are separate later work. Final-main review and the
  actual completion event remain pending; this item is integration-ready.
- **Stopped:**

## Scope

Record the approved contract and supply a portable skeleton, registry, five
record templates, role/profile/source/recommendation fields, brief/receipt
forms, deterministic validator and representative producer fixtures.
Own new foundation files, necessary packaging/docs/gate wiring and this
native governance record only. Keep the existing nine skills compatible.
Use signed commits and a draft PR against `kmox83/docflow-v1-integration`;
the coordinator owns serial integration. No main push, merge or release.

## Implementation defaults

- Templates remain flat `workspace-*` files in bootstrap's template home.
- Runtime-free schema/validator/fixtures live in `plugins/docflow/workspace/`
  and are included explicitly in npm packaging; executable skills stay forbidden.
- Schema 1 uses a strict JSON-compatible YAML subset with duplicate-key
  rejection, UTC times and explicit typed references; no new dependency.
- Preserve document 09's work/idea/run state vocabulary where document 14
  does not override it; grants and member observations remain separate.
- Default shared ownership is a source-bound native claim or an explicit
  owner-confirmed serial assignment. Missing confirmation blocks dispatch.
- Deterministic checks validate supplied facts; actual host access, live
  authentication and independently witnessed evidence remain out of scope.

## Exit criteria

1. Both Accepted decisions' numbered foundation criteria have a file/test mapping.
2. Real validator positive/adverse controls exercise malformed fields,
   schema/state/transition errors, identity collisions, paths, cycles,
   authority/claims/resources, interruption/reassignment and partial completion.
3. `node scripts/verify.mjs` and `node evals/run.mjs` pass before every push;
   added gates only tighten, and any combined gate/repair commit names that exception.
4. Distributed assets and Clarity consumer handoff have exact source SHA,
   paths and reproducible commands; all versions stay synchronised at 0.9.4.
5. A signed review-ready task PR targets the integration branch, with current
   required verify CI, commands/output/exit codes and explicit remaining limits.
   Main integration remains pending; keep this item todo and decisions Accepted
   while final-main review or any foundation criterion lacks evidence.

## Status at a glance

- **This run:** Signed ownership `8d9770e` preceded PR #8 and implementation
  `42ba9322e7b46e603f2a79d3185afbfee5327327`; static gate exit 0,
  deterministic evals 7 passed/0 failed/6 skipped exit 0, 63 targeted tests
  passed exit 0 and 15 mutation controls rejected exit 0. Required verify CI
  passed on that source. Full outputs and acceptance mapping are in
  DocflowHQ/.docflow_workspace/local/archive/member-audits/docflow/2026-09-15-workspace-foundations.md and its JSON receipt.
- **Overall:** verified — integration-ready foundations, not shipped to main.
- **Yet to do:** Current-head report CI and coordinator inspection/serial
  integration through https://github.com/EvolveHQ/docflow/pull/8; operator
  main review and actual completion event. Keep this item todo and owning
  decisions Accepted. Later W3/W4/Clarity/full V1 qualification stays separate.
