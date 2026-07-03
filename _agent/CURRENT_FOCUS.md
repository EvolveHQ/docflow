# Current Focus

This file is the LIVE SNAPSHOT of any in-flight session. It is short on
purpose — the durable record lives in git (`git log`),
`_agent/WORKLOG.md`, and `plan/done/`. The queued work lives in
`plan/todo/`.

If status files and git disagree, git is authoritative; correct this
file.

> **Released 0.9.3** (tag v0.9.3; `@evolvehq/docflow@0.9.3` on npm).
> main is **ahead of the release** with unreleased work: the 2026-07-02
> consistency pass, static-gate extension, gate-integrity convention,
> and — user-facing — the **bootstrap depth tiers** (plan 0033,
> fc158bc). **A 0.9.4 release is now meaningful** (bootstrap behaviour
> changed). Catalogue: 0031 **Accepted** (AC7 pending), rest
> Implemented (or Superseded); queue holds only 0034 (lifecycle
> adoption — feedback-gated).

## Active state

- **Branch:** main
- **Active item:** none — no work in flight.
- **Blockers:** none.
- **Uncommitted work:** none.

## Last shipped

**Plan 0033 — bootstrap depth tiers** (2026-07-03, fc158bc): the
assessment opens with an express / guided / full selector; express
scaffolds the fixed minimal profile (core only under `.docflow/`,
layers off, direct-to-main, single writer, seed on, standalone),
guided asks only plan folder + coordination + integration model;
mid-flight switching; chosen depth recorded in the scaffolded
CONVENTIONS as the next run's recommendation. Templates gained
omitted-layer variants (Q5=None, Q4a=skip, gateless integration,
seed-without-plan). Express behavioural eval PASS via worktree
subagent against the pushed skill — an earlier stale-worktree run
usefully validated the spec alone and surfaced the template gaps.
ADR 0032 → Implemented (r4); ADR 0031 stays Accepted (AC7 pending).
Earlier the same week: static-gate extension, gate-integrity
convention, full-repo consistency pass.

## Next item

**`plan/todo/0034-lifecycle-tier-adoption.md`** — propagate the depth
selector to the eight lifecycle skills (completes ADR 0031 AC7).
**Feedback-gated by design:** do not start it just because it is next —
first confirm the tier design survived real express/guided bootstrap
runs by non-technical users, or revise ADR 0031 if it did not.

Also sensible before/alongside: **release 0.9.4** (bootstrap behaviour
changed; main is well ahead of npm) — and write the /release skill
while performing it.

Candidate decisions still unqueued from the 2026-07-02 review:

1. **Prose-drift detection** — derive shared facts (target list, skill
   inventory) from the manifests and check prose surfaces against them
   (new ADR).
2. **Executable acceptance criteria** — bind ADR criterion N to eval
   assertion N so "Implemented" means "asserted" (new ADR, the big
   one).
3. Deferred: plain-language assessment wording (awaits bootstrap-tier
   feedback); provenance in WORKLOG.
