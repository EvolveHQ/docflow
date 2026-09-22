# 0074 — Executable native host qualification harness

Owning decisions: adr/0062-executable-host-qualification-rounds.md (new).

## Status

- **Claimed by:** Codex, Bugbot round 2 review, 2026-09-22, branch
  `kmox83/docflow-v1-qualification-r5`; operator reassignment for local
  fixes and both gates only, with no push or PR changes.
- **Blockers:** six genuine model-driven failures remain on codex
  (`bootstrap-full`, `ship-item`, `dispatch-brief`) and opencode
  (`audit-coordination`, `dispatch-brief`, `sync-reconcile`); the model did not
  finish or produced an invalid record. Cursor is fully blocked
  (authentication) and copilot's skill cases are blocked (OS keyring
  credential); neither is a pass.
- **Stopped:**

## Scope

Extend `evals/hosts/` into one executable runner that drives each V1 package
target non-interactively through the qualification case set under hard
isolation, writes machine-readable results, and emits the plan-item receipt
from those results. Wire it into `evals/run.mjs` as an opt-in tier and retire
the behavioural evals that previously reported SKIPPED. Reuse the existing
`evals/hosts` fixtures and checkers; build no parallel harness. Keep the static
`verify` gate fast and hostless.

## Exit criteria

1. `evals/hosts/qualify.mjs` runs `--hosts`, `--cases` and `--out` end to end,
   bounds every case at 900 s, and aborts any case whose cwd escapes the
   scratch root. (adr/0062 AC1, AC3)
2. `evals/hosts/host-adapters.mjs` declares all eight targets with launch,
   disposable config-home env, install and discovery; each declares the cases
   it cannot run and why. (AC2)
3. `evals/hosts/qualification-cases.mjs` is data and asserts observable facts
   for discovery, install byte-match, the authority matrix, mandate-note valid
   and adverse, fresh-session recovery, scope/new-plan disjointness, dispatch
   and sync, and the bootstrap/new-plan/ship regressions. (AC4)
4. Each run writes per-host/per-case results JSON with status, cause, exit
   code, duration, hashes and source revision, and the harness emits the
   receipt. (AC5)
5. `node evals/run.mjs` exposes `--qualify`; the deterministic suite reports
   `12 passed, 0 failed, 0 skipped` (including hostless harness regressions)
   and the six retired cases are owned by the
   harness. (AC6)
6. `node scripts/verify.mjs` and `node evals/run.mjs` exit 0. (AC7)
7. The harness has been run on the installed hosts and its receipt committed.
   (AC7)

## Receipt

Round 2 review scope: assess all five findings before changing code; repair
confirmed discovery evidence, model-host selection, workspace case gates,
range migration assertions and release-checker compatibility. Each repair
requires a failing-before/passing-after deterministic regression under
`/tmp/hq-qa/`. Commit locally and require both gates on the final head; no
paid host turns or new native qualification claims are authorised by this run.
The receipt below is historical: the corrected discovery adapters now report
blocked until native resolved-skill listing is wired. The original discovery
passes do not qualify the repaired harness; no new receipt was generated.

Generated from `evals/hosts/results/qualify-2026-09-21.json`; the rendered
receipt is `evals/hosts/results/qualify-2026-09-21.md`. One full-matrix run on
the clean committed head `f98187e9547c9d4233808a4f13a1e81069fa10bf`; the
receipt generator refuses to emit when the tree is dirty or the source
revision differs from HEAD.

| Host | Pass | Fail | Blocked | Unrun | Total |
|------|------|------|---------|-------|-------|
| product | 8 | 0 | 0 | 0 | 8 |
| claude | 13 | 0 | 0 | 0 | 13 |
| pi | 13 | 0 | 0 | 0 | 13 |
| codex | 10 | 3 | 0 | 0 | 13 |
| opencode | 10 | 3 | 0 | 0 | 13 |
| grok | 13 | 0 | 0 | 0 | 13 |
| omp | 13 | 0 | 0 | 0 | 13 |
| copilot | 2 | 0 | 11 | 0 | 13 |
| cursor | 0 | 0 | 13 | 0 | 13 |

Totals: **82 pass, 6 fail, 24 blocked, 0 unrun**. The six failures are genuine
model-completeness defects, not harness wiring: codex `bootstrap-full`,
`ship-item` and `dispatch-brief`; opencode `audit-coordination`,
`dispatch-brief` and `sync-reconcile`. The dispatch-brief fixture now carries a
current unrevoked grant and passes on claude, pi, grok and omp; refusal stays
covered by dispatch-refusal. Retired behavioural evals: bootstrap full,
bootstrap express, new-adr, ship-item, audit coordination migration and audit
range migration.

## Status at a glance

- **This run:** wired non-interactive launchers for all hosts, fixed the
  opencode PWD escape, the codex discovery parse and cache scope, omp
  `models.yml` provisioning, and ship-item fixture idempotency; generated
  results and receipt on the final head; static gates green.
- **Overall:** the harness runs end to end on eight targets: 82 pass, 6 fail,
  24 blocked, 0 unrun, on the clean committed head `f98187e`. Blocked and
  failing cases are not passes.
- **Yet to do:** close the six codex/opencode model-completeness failures and
  provide disposable Cursor and Copilot credentials before advancing the owning
  decision.
