---
adr: 0031
title: Tiered assessment depth — express, guided, full
status: Implemented
date: 2026-07-03
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0013"]
tags: [workflow, assessment, ux]
---

# ADR 0031 — Tiered assessment depth — express, guided, full

## Context

The interactive assessment protocol
(adr/0013-interactive-assessment-protocol.md) fronts every skill with an
opt-out gate — run the assessment or skip to acting — and then asks its
questions one at a time with recommended options. User feedback shows
the binary gate is too coarse for non-technical and less advanced
users: the bootstrap assessment in particular (around ten questions,
several naming concepts like integration models and artefact roots)
overwhelms exactly the users most likely to accept every
recommendation anyway. Skipping outright discards the few choices that
genuinely matter; running in full buries them.

## Capability statement

The shared assessment protocol opens with a single **depth selector**
that generalises the run/skip opt-out gate into three tiers:

- **express** — no further questions. Every remaining choice takes its
  recommended default; the operator makes one explicit decision that
  covers all of them. The chosen defaults are summarised before
  anything is written.
- **guided** — only the questions the skill marks **high-impact**
  (hard to reverse, or materially changing what is scaffolded) are
  asked; everything else takes its recommended default.
- **full** — the complete flow as it exists today.

In every tier, questions with no derivable recommended default — the
unavoidable free-text essentials such as a title, goal, or scope
statement — are still asked. A tier can skip a choice only where a
recommendation exists to take.

The choice is re-tunable in both directions and at both timescales:

- **Mid-flight** — at any question the operator can drop to
  "use defaults from here" or escalate to the fuller tier.
- **Durably** — the chosen depth is recorded in the target repo's
  `CONVENTIONS.md` and offered as the **pre-selected recommendation**
  on future depth selectors. The selector still appears every time —
  the record steers the recommendation, it is never applied silently,
  so a different operator is not dropped into someone else's depth
  choice. The record can be changed later like any other convention.
  One narrow exception, learned in external use: when an invocation
  already answers every question the tiers differentiate, the
  selector would be a pure no-op — the skill may skip it, stating in
  one line that it did and why. A skipped selector applies no
  recorded depth; no tiered question remains for one to steer.

All other protocol rules from
adr/0013-interactive-assessment-protocol.md stand unchanged: questions
arrive one at a time with a recommended option, structured selection is
used where the host provides it with a plain-text fallback, and the
operator decides — express is one operator decision, not a guess.

Adoption is staged: the bootstrap skill adopts the selector first
(where the feedback originated); the eight lifecycle skills adopt as a
follow-on, so the mechanism is proven on one skill before it is
propagated to nine.

## User stories / scenarios

- As a non-technical user bootstrapping a repo, I want to answer one
  question ("how deep shall we go?") and get a working setup from
  sensible defaults, so I am not confronted with ten questions I cannot
  evaluate.
- As an experienced operator, I want the full assessment unchanged, so
  tiering costs me nothing.
- As an operator midway through a guided assessment, I want to say
  "defaults from here" when the remaining questions stop mattering to
  me, so depth adapts to my patience rather than the other way round.
- As a returning operator, I want my repo to remember the depth I chose
  and to be able to change it later, so the preference outlives one
  session.

## Acceptance criteria

1. The shared assessment protocol opens with a single depth selector
   offering express, guided, and full, replacing the binary run/skip
   opt-out gate.
   Verify: manual
2. Express asks no further questions beyond unavoidable free-text
   essentials (inputs with no derivable default, such as a title);
   every choice with a recommended default takes it, and the defaults
   are summarised to the operator before any file is written.
   Verify: manual
3. Guided asks only the questions the skill marks high-impact; all
   other choices take their recommended defaults.
   Verify: manual
4. At any question the operator can drop to "defaults from here" or
   escalate to the fuller tier, and the skill honours the switch
   immediately.
   Verify: manual
5. The chosen depth is recorded in the target repo's `CONVENTIONS.md`
   and appears as the pre-selected recommendation on the next
   assessment's depth selector — never applied without the selector
   being shown; a later change to the record changes the
   recommendation. The one exception: an invocation that already
   answers every tier-differentiated question may skip the selector
   with a one-line note saying so — no recorded depth is applied
   there at all.
   Verify: manual
6. The bootstrap skill implements the selector.
   Verify: node -e "const s=require('fs').readFileSync('plugins/docflow/skills/bootstrap/SKILL.md','utf8'); process.exit(s.includes('depth selector') && s.includes('express') && s.includes('guided') ? 0 : 1)"
7. All eight lifecycle skills implement the selector.
   Verify: node -e "const f=require('fs'); const s=['new-adr','new-plan','add-convention','brainstorm','agent-wave']; process.exit(s.every(n=>f.readFileSync('plugins/docflow/skills/'+n+'/SKILL.md','utf8').includes('Depth selector first'))?0:1)"

## Out of scope

- **Plain-language question wording** — deliberately deferred until the
  bootstrap rollout shows which questions actually confuse users; a
  future decision, not this one.
- **Which bootstrap questions are high-impact and what the express
  default profile contains** — the bootstrap-specific policy is the
  next decision (its own ADR), not part of the tier mechanism.
- **Structured-selection mechanics and fallbacks** — unchanged from
  adr/0013-interactive-assessment-protocol.md.

## Open questions

- None.

## References

- adr/0013-interactive-assessment-protocol.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-07-03 | r1 | Eugenio Minardi | Initial draft (Proposed), from the approved 2026-07-03 brainstorm: depth selector generalising the opt-out gate, re-tunable mid-flight and durably, staged adoption bootstrap-first. |
| 2026-07-03 | r2 | Eugenio Minardi | Pre-acceptance spec review fixes: express carve-out for unavoidable free-text essentials (AC2); recorded depth is a pre-selected recommendation, never applied silently (AC5). Status Proposed → Accepted. |
| 2026-07-03 | r3 | Eugenio Minardi | Bootstrap adopted the selector (plan 0033): AC1–6 met in bootstrap, express eval green. AC7 (the eight lifecycle skills) outstanding — ships with plan 0034; status stays Accepted. |
| 2026-07-03 | r4 | Eugenio Minardi | Implemented (plan 0034, commit 3f1611e): the five assessment-bearing lifecycle skills (new-adr, new-plan, add-convention, brainstorm, agent-wave) carry the canonical selector with per-skill high-impact markers. AC7 reading: audit, rollup, and ship-item run no assessment, so the criterion is vacuous for them. The plan's bootstrap-feedback gate was explicitly waived by the operator. Status Accepted → Implemented. |
| 2026-07-31 | r5 | Eugenio Minardi | External-pilot feedback (plan 0044, F4): narrow skip exception when an invocation pre-answers every tier-differentiated question — announced in one line, never silent (capability statement + AC5). First post-adoption edit, so all criteria gained `Verify:` methods and bound evidence per §Verification Evidence. Status unchanged (Implemented). |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-07-03 | — |
| Maintainer | Eugenio Minardi | 2026-07-31 | — |
