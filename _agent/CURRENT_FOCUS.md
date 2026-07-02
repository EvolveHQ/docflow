# Current Focus

This file is the LIVE SNAPSHOT of any in-flight session. It is short on
purpose — the durable record lives in git (`git log`),
`_agent/WORKLOG.md`, and `plan/done/`. The queued work lives in
`plan/todo/`.

If status files and git disagree, git is authoritative; correct this
file.

> **Released 0.9.3** (tag v0.9.3; `@evolvehq/docflow@0.9.3` on npm).
> main is **ahead of the release** with unreleased maintenance: the
> 2026-07-02 full-repo consistency pass (2602a04) and the static-gate
> extension (plan 0032, 77cf25b). A 0.9.4 patch would carry these.
> Catalogue all-Implemented (or Superseded); plan queue empty.

## Active state

- **Branch:** main
- **Active item:** none — no work in flight.
- **Blockers:** none.
- **Uncommitted work:** none.

## Last shipped

**Plan 0032 — static gate extension** (2026-07-02, 77cf25b): five new
deterministic checks in `scripts/verify.mjs` — ADR section order,
numbered acceptance criteria, depends-on resolution, INDEX row fidelity
(status/date/depends-on, not just row presence), and plan/done HEAD-SHA
footers. Each mutation-tested. ADR 0011 reopened (r3) → re-Implemented
(r4). Preceded the same day by a full-repo consistency pass (2602a04):
dual-target → multi-target prose in CONVENTIONS/AGENTS/prompts,
`References / cross-links` → `References` header standardisation across
the catalogue and shipped templates, pi install docs npm-first, plus
small ADR/plan-footer repairs — every one of which the extended gate
now catches automatically.

## Next item

Queue is empty. Candidate next decisions from the 2026-07-02 review
discussion (not yet queued — need /new-adr or /add-convention first):

1. **Prose-drift detection** — derive shared facts (target list, skill
   inventory) from the manifests and check the prose surfaces against
   them (new ADR).
2. **Gate-integrity convention** — gate changes (`scripts/verify.mjs`,
   `evals/`) ship in their own commit, never bundled with product
   changes (add-convention).
3. **Executable acceptance criteria** — bind ADR criterion N to eval
   assertion N so "Implemented" means "asserted" (new ADR, the big
   one).
4. Deferred: provenance in WORKLOG; a /release skill (write it while
   performing the next release).
