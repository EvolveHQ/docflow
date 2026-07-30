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
- **Active item:** none — **PHASE 1 (S0–S5) COMPLETE** (2026-07-29).
  ADR 0040 challenge + router Implemented: eleventh skill (advisory
  interrogator, elicitation checklist + critique rubric, "solid"
  normative), brainstorm classifies and routes per record model,
  trigger corpus in evals (19/19 deterministic). First challenge run
  critiqued its own ADR — three findings, no blockers. The programme
  is **parked at the ⛔ pilot gate**: S6 goals, S7 validation, S8
  autonomy, S9 migration, and 1.0 all wait on an **external
  multi-agent pilot repo** running the S0–S5 stack (exit criteria:
  full loop unattended once, trigger corpus passes, no breaking
  contract change). Analysis and decision register:
  `../docflow-workflow-analysis/` (r11).
- **Since Phase-1 completion (2026-07-30):** the **behavioural suite
  ran FULL GREEN — 11/11** (D9's internal-eval condition met; one
  trigger-clause hardening applied); all documentation and pages caught
  up (README/USAGE eleven-skill surface, site verified-tier summary,
  five worked use cases, methodology §§4.10–4.14 + INV-11..15 — all
  marked in-development, nothing published); **internal test is LIVE**
  — the local marketplace serves the working tree (cache pinned to
  HEAD), and the first live re-run invocation enabled the glossary
  layer and surfaced + fixed a skill-prose finding (technology
  template wrongly offered as a re-run layer).
- **PILOT: clarity.docflowhq.com — RETROFIT COMPLETE (2026-07-31).**
  Correction to the recon record: clarity is **two-shape** (capability
  0001–0099, technology 0100+), not capability-first — the "numbering
  gaps" note was a misread of the two-range split. The retrofit ran in
  clarity as an 11-commit chain (d3a8b6f..d05e3c5), every gate held by
  the operator: manifest (schema 1, two-shape, layers
  plan/agent/glossary/constraints, evidence-adopted-at fa32986), its
  adoption ADR Implemented with the repo's first four evidence
  records, CON-1..CON-8 live (one entry declined on the record), four
  elicitation categories asked-and-empty, three enforcement items
  queued there. **Fourteen pilot findings relayed** — triaged into
  plan 0044 here. **Two gate criteria remain:** an unattended
  full-loop run in clarity (its queued items are ready-made
  candidates) and the trigger-corpus check from clarity's side.
- **Blockers:** none for plan 0044 (findings wave). The pilot gate
  needs the two remaining criteria, run in clarity.
- **Uncommitted work:** none once this snapshot commit lands.

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
