# PR #5 wave metadata follow-up — 2026-09-13

Finding: [Cursor comment 3999224590](https://github.com/EvolveHQ/docflow/pull/5#discussion_r3999224590),
on `evals/hosts/check-wave.py` at baseline `8981a0d`.
Verified work HEAD: `07076810290c6573597ba3a3cb543f52f155fac6`.

The finding is valid. The checker required literal `Reserved` and `Owned`
substrings, while the executor brief permits reservation/owned-artefact
wording without prescribing capitalisation. This conflicts with
adr/0012-skill-behavioural-evals.md AC4's tolerance of incidental wording.
Plan 0056 was written and signed before implementation; no decision changed.

The matcher now recognises reserved/reservation/reservations and owned as
case-insensitive words. Actual claim identity remains case-sensitive and
both metadata categories remain required. All other wave checks are unchanged.
The gate-only commit explicitly states why the presentation restriction was
relaxed and contains no judged product/plan/ADR files.

`python -B evals/hosts/test_check_wave.py` drives the actual checker over
temporary local Git repositories built with the existing wave fixture.
Five valid forms cover Title Case, lowercase, reservations, mixed case and
ordinary prose. Four invalid forms omit the branch, omit reservations, omit
owned-artefact metadata or alter branch-name case. Every case also requires
all unrelated wave assertions to pass. This is synthetic checker coverage,
not a vendor-host or skill-execution result.

Baseline: `Ran 2 tests in 372.041s`, `FAILED (failures=4)`, exit 1. All four
failures were valid wording rejected by alpha/beta claim metadata checks;
the Title Case and missing-metadata expectations passed. Repaired tree:
`Ran 2 tests in 244.767s`, `OK`, exit 0 (nine subcases across the two tests).

All existing gates passed on the work tree recorded at the verified HEAD:

- `verify: OK (version 0.9.4, 9 skills, 50 ADRs, 63 shipped plan items)`, exit 0.
- `verify mutations: OK (15 rejected mutations)`, exit 0.
- `6 passed, 0 failed, 6 skipped`, exit 0; the six model cases were not run.

Completion adds one prepared record. Final-head gate/CI evidence is recorded
on [PR #5](https://github.com/EvolveHQ/docflow/pull/5). The existing Node 24
actions, Node 22 tests, product files, versions and historical host receipts
remain unchanged. Plan 0051 stays open; ADR 0012 stays Accepted because its
broader host/release matrix is still incomplete.

## Status at a glance

- **This run:** reproduced four false rejections, repaired the wording matcher and passed all nine synthetic scenarios plus the existing gates above. Gate changes are isolated from completion metadata in signed commits.
- **Overall:** verified for this checker repair at the named work HEAD; completion is prepared, effective only on the operator's checked merge. Overall host/release verification remains partial.
- **Yet to do:** final-head verify and Cursor follow-up recorded on PR #5; plan 0051's host/release checks; operator review and merge. No merge or release was performed.
