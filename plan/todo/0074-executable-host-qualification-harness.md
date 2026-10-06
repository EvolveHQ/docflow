# 0074 — Executable native host qualification harness

Owning decision: adr/0062-executable-host-qualification-rounds.md (Accepted).

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

## Remaining implementation and dependencies (reviewed 2026-09-22)

PR #25, including both Bugbot repair rounds, is integrated at `119509e`.
Reviewed gap 2 in
`../../.docflow_workspace/local/handoffs/workspace-gaps-review.md` requires
executable follow-through, not another replacement harness or receipt-only
item. Design document 14 §4 D4/W4 and §7 supplies the final qualification
obligation; items 0061/0062 retain native package and paired-journey acceptance.

- Wire native resolved-skill discovery for the repaired adapters and assert
  installed source/byte evidence; the pre-repair discovery passes are stale.
- Reproduce and diagnose Codex `bootstrap-full`, `ship-item`, `dispatch-brief`
  and OpenCode `audit-coordination`, `dispatch-brief`, `sync-reconcile` under
  isolation. Repair demonstrated adapter/fixture/checker defects here; route
  demonstrated skill/validator defects to their owning product items. Genuine
  model failures remain failures until observable output passes a fresh run.
- Add direct setup/status/scope native cases where the current harness lacks
  them, retaining the earlier 0062 native evidence as historical. Do not relabel
  hostless validator controls as native skill execution.
- Obtain controller-supplied permitted disposable Cursor authentication and
  Copilot keyring access for reruns. No login, credential provisioning, paid
  model turns or real configuration changes are granted by this plan revision.
- Keep gate behaviour and judged product changes in separate commits unless
  a named tighten-and-repair exception applies; never weaken a failing checker
  merely to finish qualification. Bind reruns to the selected integrated source.

The historic matrix is **82 pass, 6 fail, 24 blocked, 0 unrun** at `f98187e`.
It is not a result on the post-Bugbot harness and must not be promoted to one.
This item can establish the runner's ACs while reporting blocked cells honestly;
full V1 native acceptance belongs to 0061/0062 and cannot close with them.

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
8. Native discovery and added setup/status/scope assertions reject synthetic
   listings, missing output and prohibited writes; focused regressions prove
   each repaired mechanism. Fresh machine-readable results record the six
   failure reruns and formerly blocked cases with exact source, exit and cause.
   Any unresolved failure/block remains explicit in 0061/0062. (AC2–5/7)

## Size estimate

M/L — 3–5 focused harness/fixture implementation and regression days, excluding
target access and native model execution; no duplicate qualification queue item.

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
