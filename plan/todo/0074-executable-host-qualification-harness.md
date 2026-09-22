# 0074 — Executable native host qualification harness

Owning decisions: adr/0062-executable-host-qualification-rounds.md (new).

## Status

- **Claimed by:** pi, docflow qualification harness, 2026-09-21, branch
  `kmox83/docflow-v1-qualification-r5`.
- **Blockers:** remaining model-driven cases fail for genuine reasons —
  `dispatch-brief` uniformly (the two-repository fixture's active work carries
  an unresolved revocation, so a correct skill declines to write), and
  `audit-range`/`ship-item` on some hosts where the model did not finish.
  Cursor is fully blocked (authentication) and copilot's skill cases are
  blocked (OS keyring credential); neither is a pass.
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
   `11 passed, 0 failed, 0 skipped` and the six retired cases are owned by the
   harness. (AC6)
6. `node scripts/verify.mjs` and `node evals/run.mjs` exit 0. (AC7)
7. The harness has been run on the installed hosts and its receipt committed.
   (AC7)

## Receipt

Generated from `evals/hosts/results/qualify-2026-09-21.json`; the rendered
receipt is `evals/hosts/results/qualify-2026-09-21.md`. Sharded host runs plus
two targeted re-runs (codex host-interface after the cache-scope fix;
codex/opencode `ship-item` and `sync-reconcile` after the idempotency fix)
compose the one revision `831d09b6e47b9eb23e9ba617541dd8df661d8fa4`.

| Host | Pass | Fail | Blocked | Unrun | Total |
|------|------|------|---------|-------|-------|
| product | 8 | 0 | 0 | 0 | 8 |
| claude | 12 | 1 | 0 | 0 | 13 |
| pi | 12 | 1 | 0 | 0 | 13 |
| codex | 9 | 4 | 0 | 0 | 13 |
| opencode | 9 | 4 | 0 | 0 | 13 |
| grok | 10 | 3 | 0 | 0 | 13 |
| omp | 12 | 1 | 0 | 0 | 13 |
| copilot | 2 | 0 | 11 | 0 | 13 |
| cursor | 0 | 0 | 13 | 0 | 13 |

Totals: **74 pass, 14 fail, 24 blocked, 0 unrun**. `dispatch-brief` fails on
every runnable host because the two-repository fixture's active work carries an
unresolved revocation, so the skill declines to write — a fixture gap, not a
host fault. `audit-range` and `ship-item` fail on codex, grok and opencode where
the model did not finish the migration/ship. Bootstrap full and new-plan fail
on individual hosts. Retired behavioural evals: bootstrap full, bootstrap
express, new-adr, ship-item, audit coordination migration and audit range
migration.

## Status at a glance

- **This run:** wired non-interactive launchers for all hosts, fixed the
  opencode PWD escape, the codex discovery parse and cache scope, omp
  `models.yml` provisioning, and ship-item fixture idempotency; generated
  results and receipt on the final head; static gates green.
- **Overall:** the harness runs end to end on eight targets: 74 pass, 14 fail,
  24 blocked, 0 unrun. Blocked and failing cases are not passes.
- **Yet to do:** make the dispatch-brief fixture dispatchable, close the
  remaining model-completeness failures, and provide disposable Cursor and
  Copilot credentials before advancing the owning decision.
