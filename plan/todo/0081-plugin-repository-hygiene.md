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

## Status

- Claimed by: Codex, 2026-10-14, chore/plugin-repository-hygiene; sole writer, explicit operator grant.
- Blockers:
- Stopped:
