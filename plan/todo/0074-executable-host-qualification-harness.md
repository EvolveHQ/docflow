# 0074 — Executable native host qualification harness

Owning decisions: adr/0062-executable-host-qualification-rounds.md (new).

## Status

- **Claimed by:** pi, docflow qualification harness, 2026-09-21, branch
  `kmox83/docflow-v1-qualification-r5`.
- **Blockers:** the model-driven skill cases have no non-interactive launcher
  wired yet, so they report `unrun`; Cursor reports `blocked` (authentication).
  Neither is a pass.
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

Generated, not hand-written. Provenance: `evals/hosts/results/qualify-2026-09-21.json`
and its rendered receipt `evals/hosts/results/qualify-2026-09-21.md` at branch
commit for source revision `f78d8f53ff658d359ce6c2a0a5906a73254c7aae`.

| Host | Pass | Fail | Blocked | Unrun | Total |
|------|------|------|---------|-------|-------|
| product | 8 | 0 | 0 | 0 | 8 |
| claude | 2 | 0 | 0 | 11 | 13 |
| pi | 2 | 0 | 0 | 11 | 13 |
| codex | 2 | 0 | 0 | 11 | 13 |
| opencode | 2 | 0 | 0 | 11 | 13 |
| grok | 2 | 0 | 0 | 11 | 13 |
| omp | 2 | 0 | 0 | 11 | 13 |
| copilot | 2 | 0 | 0 | 11 | 13 |
| cursor | 0 | 0 | 13 | 0 | 13 |

Totals: **22 pass, 0 fail, 13 blocked, 77 unrun**. Every host-interface case
(discovery of all fourteen skills, install byte-match against the branch) and
every product case (authority current/missing/expired/conflicting, mandate
valid/adverse, recovery read-only, scope/new-plan disjointness) passed on every
adapter that could run, except Cursor which has no disposable credential.
Retired behavioural evals: bootstrap full, bootstrap express, new-adr,
ship-item, audit coordination migration and audit range migration.

## Status at a glance

- **This run:** shipped the executable harness, adapters and case catalogue;
  generated results and receipt; retired the six skipped behavioural evals;
  static gate green.
- **Overall:** partially verified — 22 cases pass with no failures, but the
  model-driven skill cases are 77 unrun and 13 blocked, which are not passes.
- **Yet to do:** wire non-interactive launchers for the skill cases, provide a
  disposable Cursor credential, then rerun and advance the owning decision when
  every host is qualified.
