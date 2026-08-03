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
- **Active item:** none — **PHASE 1 (S0–S5) COMPLETE** (2026-07-29)
  and the **✅ PILOT GATE CLOSED (2026-07-31, operator-attested).**
  All three exit criteria passed in/around clarity: the unattended
  full-loop run, the trigger-corpus check, and no breaking contract
  change (wave-1 refinements merged additively on both sides). Run
  identifiers from the clarity side are not yet recorded here — append
  the clarity SHAs and corpus tally to this bullet when relayed. The
  programme is **UNBLOCKED**: next is S6 goals, then S7 validation,
  S8 autonomy, S9 migration machinery, S10 own migration, S11 1.0
  (publish only on explicit instruction). Pre-decisions worth taking
  early: S7 validation-cycle identity; S9 external migration
  candidate. Analysis and decision register:
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
  queued there. **Fourteen pilot findings relayed and PROCESSED —
  plan 0044 SHIPPED (2026-07-31, chain 9e3a71c..d1922d1 + ship):**
  F1 was our own brief error (owned + corrected); F2–F14 landed
  across skills/templates/conventions/methodology; F4 (selector skip
  exception, r5 on the owning ADR) and F11 (attended verifier form)
  operator-accepted. Side effect worth remembering: the tiered-depth
  record became the **first pre-adoption record re-evidenced on
  edit** — Verify methods + 7 bound records (5 manual
  batch-attested, 2 command attended). **Both remaining gate criteria
  subsequently PASSED in clarity (operator-attested 2026-07-31)** —
  see the active-state bullet above.
- **S6 GOALS SHIPPED (2026-07-31, plan 0045):** per-file
  `goals/G-<slug>.md` records + INDEX Goals section + `serves:`
  edges + COVERAGE generator + brainstorm-as-goal-writer + audit
  check 20 + gate check I. Notable: the operator **challenged the
  accepted single-file design at the attestation gate** (context
  accumulation of terminal entries); revised to per-file by r3
  before any evidence bound — the gate working as designed. Three
  Active goals live: G-aligned-autonomy, G-external-adoption,
  G-one-zero. Seven evidence records, all attended.
- **S7 VALIDATION SHIPPED (2026-08-03, plan 0046):** validate is the
  twelfth skill and third human gate — four verdicts with defined
  goal transitions, append-only `### Cycle` outcome entries in the
  goal file (per-goal date-anchored ordinals; both design points
  operator-decided BEFORE authoring, per the S6 lesson), harm as an
  orthogonal finding with recorded disposition, audit check 21, gate
  outcome checks (alone, mutation-proven), corpus abstains flipped
  (24/24). **The full development loop — goals through validation —
  is now expressible in docflow artefacts.** No goal is due before
  2026-10-31; the first live verdict will be the machinery's real
  test.
- **Blockers:** none. Queue: S8 autonomy (L0–L5 — the most
  decision-heavy slice; level semantics are the operator's call) →
  S9 migration machinery (needs an external candidate) → S10 own
  migration → 1.0 (explicit instruction only). S8 starts on the
  operator's go.
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
