---
adr: 0042
title: docflow's own skills end every run with Status at a glance
status: Proposed
date: 2026-09-04
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0041", "0007", "0011", "0012"]
tags: [skills, reporting, evals, gate]
---

# ADR 0042 — docflow's own skills end every run with Status at a glance

## Context

adr/0041-status-at-a-glance-reporting-convention.md scaffolds a
reporting convention into every repository docflow touches. The
skills that do the touching close their runs in nine different ways: a
verdict line and a punch list, a count of aggregated members, a list
of shipped and failed items, an offer of a next step, or nothing past
the commit. A product that scaffolds a convention it does not itself
follow is not credible, and the operator who runs a skill is exactly
the reader the convention serves — they need to know what the skill
achieved and what is still missing, such as an ADR that is still
Proposed or a push that did not happen.

The product already has a pattern for cross-skill canonical text: the
assessment depth selector is one canonical block copied into each
skill with per-skill markers (adr/0031-tiered-assessment-depth.md).
The static gate validates skill structure and parity
(adr/0011-static-skill-validation.md), and the behavioural evals judge
a skill by the report its subagent returns
(adr/0012-skill-behavioural-evals.md) — which is a report in the
convention's sense, and today free-form.

## Capability statement

Every lifecycle skill ends its run with the Status at a glance block.
Each skill's closing step carries one canonical instruction, identical
across the nine skills, to end the final message with the block, and
names what its own three bullets contain:

- **This run** states what the skill did: files written, moved, or
  committed, the gate's exact output line and exit code when it ran,
  and any step skipped or refused, with the reason.
- **Overall** uses the convention's vocabulary; audit's verdict line
  feeds it directly.
- **Yet to do** names what the skill's output still needs: a Proposed
  ADR awaiting acceptance, a queued item not yet authorised, a commit
  not yet pushed, a migration offered but not taken, an eval not yet
  run.

Skill prose stays agent-neutral and free of ADR identifiers, as skill
bodies are user-visible. Two gates enforce the adoption. The static
gate fails when any skill lacks the canonical instruction, so the nine
copies cannot drift. The behavioural evals require the subagent's
final report to end with the block and fail a case whose report lacks
it, so the convention is exercised on every release.

Alternative considered: leaving skill reports free-form and relying on
the scaffolded convention alone. Rejected, because the operator's own
runs are the most frequent reports in a docflow repository, and a
convention the product ignores teaches agents to ignore it.

## User stories / scenarios

- As an operator, every skill I run ends the same way, and the last
  three bullets tell me whether anything is still on me.
- As a maintainer of docflow, a skill whose closing step drifts from
  the canonical wording fails the gate before it ships.
- As a release manager, the behavioural evals prove the block is
  produced, not merely prescribed.
- As a reader of a skill body, I see no ADR numbers and no
  agent-specific invocation forms in the reporting instruction.

## Acceptance criteria

1. Each of the nine lifecycle skills' closing step carries the
   canonical instruction to end the final message with the Status at
   a glance block, in wording identical across skills.
2. Each skill's closing step names what its This run, Overall, and Yet
   to do contain, per the list in the capability statement; audit's
   verdict line feeds Overall.
3. The reporting instruction in every skill is agent-neutral and
   contains no ADR identifier.
4. The static gate fails when any skill's body lacks the canonical
   instruction or carries a variant of it.
5. The behavioural eval verdict requires the subagent's final report to
   end with the block, and a case whose report lacks it fails.
6. Gate changes ship in their own commits, with the stricter static
   check allowed alongside the repairs it surfaces, and the reason
   named in each commit message.
7. `USAGE.md` states that every skill ends its run with the block and
   what to expect in each bullet.

## Out of scope

- The convention itself and its scaffold placement —
  adr/0041-status-at-a-glance-reporting-convention.md.
- Reports that outlive the conversation —
  adr/0043-persisted-reports-carry-status-at-a-glance.md.
- Skill descriptions and trigger boundaries —
  adr/0007-lifecycle-skills.md.

## Open questions

- None.

## References

- adr/0041-status-at-a-glance-reporting-convention.md
- adr/0007-lifecycle-skills.md
- adr/0011-static-skill-validation.md
- adr/0012-skill-behavioural-evals.md
- adr/0031-tiered-assessment-depth.md (the canonical-block precedent)
- adr/0043-persisted-reports-carry-status-at-a-glance.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-09-04 | r1 | Eugenio Minardi | Initial draft (Proposed), from the approved brainstorm: every lifecycle skill ends with the block via one canonical instruction; per-skill bullet contents; static gate parity check and behavioural eval requirement. Free-form skill reports considered and rejected. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
