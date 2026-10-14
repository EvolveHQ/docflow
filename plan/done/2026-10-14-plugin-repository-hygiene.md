# 0081 — Plugin repository hygiene

Owning ADRs: adr/0009-distribution-marketplace-npm.md (AC1–2), adr/0060-v1-package-target-set.md (AC2–4), adr/0062-executable-host-qualification-rounds.md (AC1–3), adr/0057-bounded-verification-evidence.md (AC1–4).

## Scope

Routine repository hygiene: synthetic test credentials, verified workflow action pins, npm lockfile and reproducible CI installs, compatible marketplace and publisher metadata, dependency updates, plugin licence/readme/ignore boundaries, and truthful handling of historical host receipts and current harness permissions. Keep manifests at 0.10.0 and preserve runtime skills/workspace assets. No merge, release, tag or publication; Clarity remains parked.

## Exit criteria

1. All workflow actions use verified full commit pins; npm CI uses the committed lockfile.
2. Marketplace and plugin metadata validate against current official host schemas; plugin includes MIT licence, install/docs README and runtime-preserving ignore rules.
3. Synthetic fixture values retain test purpose; investigate actual permission defaults and preserve historical evidence externally by hash without masking unsafe behaviour.
4. Private baseline/final scanner reports are retained; final score >=80 with zero high findings and each finding disposition recorded externally.
5. Static verify, all 13 deterministic evals, package/source match and Pages build pass. Compare npm pack paths and bytes, with only intended changes.
6. Signed commits separate gate and product edits; ready PR to main carries concise honest evidence, completion prepared only for verified criteria.

## Dependencies

None for this operator-authorised bounded maintenance task. Existing qualification and evidence-cleanup items retain their independent scope and status.

## Verification receipt

Verified work HEAD: `2f9a9d2559fdf7962523fbf6f005280efd3c0e55`.

- `npm ci`, `node scripts/verify.mjs`, `node scripts/verify-mutations.mjs`, `node evals/run.mjs`: exit 0; 13 passed, 0 failed, 0 skipped.
- Existing host-runner/Pi/claims, permission/seed/isolation, release-handoff and extraction tests; actionlint; `claude plugin validate .` and `claude plugin validate ./plugins/docflow`: exit 0.
- `jekyll build --source docs --destination /tmp/hq-qa/docflow-hygiene-pages`, `npm pack --json --pack-destination /tmp/hq-qa`, external package/source and payload checks: exit 0. Four intended README/licence/security additions; package.json files metadata only; other 379 existing payload files byte-identical, no removals, lockfile excluded. Archive SHA-256 `c7799196e75dd623deb3fda4cbc23d80c5d374db9e77579ec78d85b4c0f29f58`.
- Private validation reports and historical receipt archives remain external; immutable pre-removal blob links and hashes preserve public recovery. No fresh native behavioural qualification, dedicated security inbox, SLA or ignore-rule host enforcement is claimed.
- Broader owning ADR criteria retain their existing states and queue items. This maintenance item completes no whole outstanding target/qualification/evidence-cleanup decision; INDEX metadata is unchanged.

## Shipped footer (prepared for checked merge)

Shipped on checked merge of [PR #29](https://github.com/EvolveHQ/docflow/pull/29); verified work HEAD `2f9a9d2559fdf7962523fbf6f005280efd3c0e55`.
This is prepared completion on `chore/plugin-repository-hygiene`, effective only on checked merge into main. No merge, release or publication is asserted.

## Status at a glance

- **This run:** plan 0081 implemented and completion prepared on actual ready PR #29; listed local checks exit 0 (`verify: OK (version 0.10.0, 14 skills, 63 ADRs, 70 shipped plan items)` before this completion move).
- **Overall:** locally verified maintenance on an unmerged PR; not shipped.
- **Yet to do:** final-head checks/push and current-head required CI tracked in PR; maintainer review and separately authorised merge. Branch/worktree retained for controller-owned cleanup.
