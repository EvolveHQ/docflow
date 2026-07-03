# Current Focus

This file is the LIVE SNAPSHOT of any in-flight session. It is short on
purpose — the durable record lives in git (`git log`),
`_agent/WORKLOG.md`, and `plan/done/`. The queued work lives in
`plan/todo/`.

If status files and git disagree, git is authoritative; correct this
file.

> **Released 0.9.4** (tag v0.9.4; `@evolvehq/docflow@0.9.4` on npm;
> GitHub Releases page backfilled — 19 releases, 0.9.4 Latest). main
> and npm in sync. Catalogue all-Implemented (or Superseded); plan
> queue empty.

## Active state

- **Branch:** main
- **Active item:** none — no work in flight.
- **Blockers:** none.
- **Uncommitted work:** none.

## Last shipped

**2026-07-03, a three-ship day:**
- **Plan 0033 — bootstrap depth tiers** (fc158bc): express / guided /
  full selector, express minimal profile, guided 3-question subset,
  federation guard, recorded depth preference; template variants for
  omitted layers; express behavioural eval PASS (worktree subagent).
  ADR 0032 → Implemented.
- **Plan 0035 — artefact-root discovery** (37a1798): `.docflow`
  marker-dir / pointer-file precedence (the `.git` pattern) so tools
  like **Clarity** resolve any repo's catalogue in one check; audit
  check 14; this repo dogfoods `root: .`. ADR 0033 → Implemented.
- **Plan 0034 — lifecycle tier adoption** (3f1611e): the canonical
  selector in the five assessment-bearing skills with per-skill
  high-impact markers; feedback gate explicitly waived by the
  operator. ADR 0031 → Implemented — the tiers capability is complete.

## Next item

Queue is empty. 0.9.4 released 2026-07-03. The /release skill remains
unwritten (the 0.9.4 ritual ran manually: 3-manifest bump, verify, tag,
push, npm publish via one-shot userconfig, GitHub release) — write it
from that transcript next release.

Candidate decisions still unqueued from the 2026-07-02 review:

1. **Prose-drift detection** — derive shared facts (target list, skill
   inventory) from the manifests and check prose surfaces against them
   (new ADR).
2. **Executable acceptance criteria** — bind ADR criterion N to eval
   assertion N so "Implemented" means "asserted" (new ADR, the big
   one).
3. Deferred: plain-language assessment wording (now awaits tier
   feedback across all skills); provenance in WORKLOG.

For **docflow-clarity**: record the consumer-side discovery decision in
its own catalogue, referencing `docflow/0033-artefact-root-discovery`
via the federation.
