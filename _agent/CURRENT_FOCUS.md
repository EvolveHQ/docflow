# Current Focus

This file is the LIVE SNAPSHOT of any in-flight session. It is short
on purpose — the durable record lives in git (`git log`),
`_agent/WORKLOG.md`, and `plan/done/`. The queued work lives in
`plan/todo/`. If status files and git disagree, git is authoritative;
correct this file.

## Active state

- **Branch:** `v1/aligned-autonomy` — the development line (the first
  v1 candidate). `main` is the released line, frozen at v0.9.4
  (ffd0b4e); it advances only by promoting exactly one candidate;
  alternatives are sibling `v1/<approach>` branches, archived
  unmerged if not chosen.
- **Released:** 0.9.4 (tag + npm). **Repo grant:** `autonomy: L3`.
- **Active item:** none — the plan queue is empty. **The programme's
  build is complete** (S0–S9 + the release ritual): 46 ADRs, 13
  skills, 3 Active goals, all evidence-bound; deterministic evals
  24/24; behavioural suite last full-green at d27b8d1 (pre-S6 —
  rerun due before release).
- **Blockers / waiting on the operator:**
  1. **1.0** — one `/release` invocation away: promotion decision +
     per-step confirmations. Explicit instruction only.
  2. **S10 own migration** — sequenced behind one external migration
     exercising the S9 machinery (`../docflow-workflow-analysis/`
     `migration-triage.md` is the prepared input).
- **First goal due:** G-aligned-autonomy, review-by 2026-10-31 — the
  validate skill's first live verdict.

## Pointers

- Decision register + programme history: `../docflow-workflow-analysis/`.
- Ship-by-ship history: `_agent/WORKLOG.md` (append-only).
- The consistency sweep of 2026-08-05 pruned this file to its
  charter; per-slice narratives live in the worklog from here on.
