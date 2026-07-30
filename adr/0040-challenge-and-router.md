---
adr: 0040
title: A convergent challenge skill; brainstorm becomes the router
status: Proposed
date: 2026-07-29
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0007", "0013", "0036", "0038"]
tags: [skills, elicitation, routing]
---

# ADR 0040 — A convergent challenge skill; brainstorm becomes the router

## Context

Every authoring skill diverges or records; nothing *interrogates*. The
appetite exists but is scattered inline — the ADR skill rejects
"simpler/idiomatic" rationale, the convention skill triages before
writing — and the one capability that cannot be a variant of any of
them is **elicitation**: nobody volunteers "we can't ship AGPL" until
asked, and you don't *decompose* your way to a boundary. The
brainstorm skill's own intake probes for constraints and then discards
the answers.

Meanwhile the record classes have multiplied — decisions, capability
records, conventions, boundaries, work items — and the operator
shouldn't need to know which writer to call. Brainstorm already
decomposes and hands off; what it lacks is explicit classification.

One decision covers both: **add the convergent mode as its own skill,
and make brainstorm the front door that classifies and routes.**

## Capability statement

**`challenge`** is the convergent lifecycle skill: it interrogates and
**writes nothing** — advisory only, gating no lifecycle transition.
Two targets, one stance (do not accept vague answers; name what is
missing; never invent): **elicit from the human** — an inline category
checklist (licence/IP, privacy and data, cost ceilings,
latency/performance, vendor and dependency, security,
regulatory/compliance, operational limits) that surfaces unstated
boundaries and routes each to the constraint path, decision-gated,
never written directly; and **critique a draft** — a rubric over any
record draft: criterion testability and method presence, rationale
that names real alternatives, scope held to one decision, and a scan
against the repo's enumerated boundaries. It must be able — and seen
— to return *"this is solid, nothing to add."* **`brainstorm` becomes
the router**: each candidate it produces is classified — *a choice → a
decision record · a behaviour → a capability record (a spec on that
model, a capability ADR otherwise) · a rule → a convention · a
boundary → a constraint, decision-gated · a job → a plan item* — and
routed on approval to the writers that exist; classes that do not
exist yet are named as future routes, not guessed at. Trigger
boundaries across all eleven skills stay disjoint, and disjointness is
**tested by a labelled utterance corpus**, not asserted.

## User stories / scenarios

- As an operator, I want my unstated boundaries interrogated out of
  me, so that the constraints file reflects what I know, not what I
  remembered to say.
- As a reviewer, I want a draft pressure-tested by rubric before
  acceptance, so that weak criteria and hollow rationale surface
  early.
- As an operator with a fuzzy idea, I want one front door that
  classifies the pieces, so that I never have to know which of five
  writers to call.
- As a skill author, I want trigger collisions measured by a corpus,
  so that "what are we missing?" reliably reaches the right skill.

## Acceptance criteria

1. **The skill exists, advisory.** `challenge` is the eleventh
   lifecycle skill: it writes no repo artefact, gates nothing, hands
   findings to the owning writers, and its instructions require it to
   return "solid — nothing to add" when that is the finding rather
   than manufacturing objections.
   Verify: manual
2. **Elicitation inline.** The category checklist lives in the skill
   body (only the scaffolding skill carries templates); each elicited
   boundary is routed to the constraint path with its authorising
   decision, never written directly by this skill.
   Verify: manual
3. **Critique rubric.** The draft mode checks: criteria testable, each
   naming its verification method; rationale naming real alternatives
   with specific rejection reasons; one decision per record; and a
   scan against the enumerated boundaries where the repo carries them
   — consistent with the authoring skills' own inline gates.
   Verify: manual
4. **Brainstorm classifies and routes.** Every candidate carries its
   class using the routing phrasing; approved candidates hand off to
   the writers that exist on the repo's record model (behaviour → the
   spec skill on the specs model, the ADR skill otherwise; boundary →
   the convention skill's constraint home); classes with no writer yet
   are surfaced as future routes, never silently dropped.
   Verify: manual
5. **Disjoint triggers.** The eleven descriptions carry mutually
   consistent NOT-for boundaries — the challenge/brainstorm/audit
   demarcation stated on all three: fuzzy-and-generate → brainstorm;
   interrogate-a-human-or-draft → challenge; check-the-written-record
   → audit.
   Verify: manual
6. **Corpus, not assertion.** A labelled utterance corpus covering the
   ambiguous phrasings ships in the eval tier: a deterministic case
   validates the corpus file; a behavioural case routes every
   utterance against the live descriptions and reports collisions and
   abstentions.
   Verify: npm run evals
7. **First blood is its own.** At this decision's ship, a challenge
   pass runs against this ADR's own draft and its findings (or its
   "nothing to add") are recorded in the shipping plan item — the
   skill's first recorded run critiques its own authorising decision.
   Verify: manual
8. **Evidenced at ship.**
   Verify: gate-check

## Out of scope

- Goal emission from the router — goals do not exist yet; the route is
  named as future, and arrives with the goals decision.
- The creative-elicitation checklist — cut, blocked with the creative
  surface on its dogfood question.
- Any gating power for `challenge` — a decision cannot require a
  challenge pass; advisory is a settled boundary.
- The `validate` skill — a later slice; eleven skills after this
  decision, twelve at programme end.

## Open questions

- None.

## References

- adr/0007-lifecycle-skills.md
- adr/0013-interactive-assessment-protocol.md
- adr/0036-enumerated-constraints.md
- adr/0038-capability-spec-records.md
- Source analysis and cross-review ledger: `../docflow-workflow-analysis/`
  (unversioned sibling folder, r11, §9.2)

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-07-29 | r1 | Eugenio Minardi | Initial draft. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
