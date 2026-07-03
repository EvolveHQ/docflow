---
adr: 0031
title: Tiered assessment depth — express, guided, full
status: Proposed
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

The choice is re-tunable in both directions and at both timescales:

- **Mid-flight** — at any question the operator can drop to
  "use defaults from here" or escalate to the fuller tier.
- **Durably** — the chosen depth is recorded in the target repo's
  `CONVENTIONS.md` as the default for future assessments, and can be
  changed later like any other convention.

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
2. Express asks no further questions; every remaining choice takes its
   recommended default, and the defaults are summarised to the operator
   before any file is written.
3. Guided asks only the questions the skill marks high-impact; all
   other choices take their recommended defaults.
4. At any question the operator can drop to "defaults from here" or
   escalate to the fuller tier, and the skill honours the switch
   immediately.
5. The chosen depth is recorded in the target repo's `CONVENTIONS.md`
   as the default for future assessments, and a later change to that
   record takes effect on the next assessment.
6. The bootstrap skill implements the selector.
7. All eight lifecycle skills implement the selector.

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

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
