---
adr: 0041
title: Status at a glance — every report says what was achieved and what is missing
status: Proposed
date: 2026-09-04
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0001", "0007"]
tags: [conventions, reporting, agents, bootstrap]
---

# ADR 0041 — Status at a glance — every report says what was achieved and what is missing

## Context

docflow scaffolds a control surface whose purpose is that a repository
can be picked up and driven with no oral handover
(adr/0001-adr-driven-workflow.md). It says nothing, however, about how
a run **reports**. No template mentions reporting, the autonomous run
prompt has no report step, and each lifecycle skill closes
differently: a verdict line and punch list, a count of members, a list
of shipped and failed items, or nothing beyond the commit.

Unstructured reports fail in predictable ways. They narrate activity
and let the reader infer success. A passing sub-step — an inner test,
a green gate, an exit code of zero from one process — gets read as the
whole task passing. A timeout, an interruption, or missing evidence
gets rounded up to "done". Remaining work is dropped because the run
hit a time or iteration limit. The human who returns after an
unattended run cannot tell what was achieved from what is missing,
which is the one thing they need to know.

The remedy is a convention every writer follows, human or agent, so a
report is comparable across runs and the missing part is never
implicit. The convention is deliberately generic: rules that belong to
one repository's verification harness — wrappers, receipts, reviewer
verdicts — are that repository's domain rules, added on top.

## Capability statement

Every progress, verification, or hand-off report ends with a section
headed exactly **Status at a glance**, carrying three labelled bullets:

- **This run** — only what was actually attempted in the current run,
  with exact outcomes: commands, exit codes, timeouts, interruptions.
  When a verify gate ran, its exact output line and exit code are
  quoted. Success is never inferred from partial output.
- **Overall** — the verified condition of the complete task, from a
  closed vocabulary: implemented, partially verified, verified,
  blocked, failed, unknown.
- **Yet to do** — every remaining action, unresolved finding,
  incomplete verification, pending decision, or required user input.
  It reads `None` only when the complete task, including cleanup, has
  verifiably finished.

Four honesty rules govern the content. Exact process outcomes are
reported, and a timeout, interruption, or unknown outcome is never
translated into success. A passing sub-step is not an overall pass;
overall success is reported only when the whole task has verifiably
finished. Interrupted execution or incomplete evidence is reported as
unknown, inconclusive, or failed, never as passed. Remaining work is
never omitted because the run reached a limit. The principle behind
them: a report gives a sense of what was achieved and what is missing,
and never lets an unverified outcome read as a pass.

The scaffold places the convention once. `CONVENTIONS.md` carries the
full statement under a Reporting section with one worked example.
`AGENTS.md` carries a short pointer hard rule — the heading text, the
three labels, and a reference to the section — never a second copy of
the rules. The autonomous run prompt ends with a Report step that
requires the block. The convention is written at every assessment
depth, including express; at full depth the sign-off summary offers an
opt-out, in which case none of the three placements is written.
Repository-specific reporting rules, gathered by the domain-rules
question, extend the section's numbered rules rather than opening a
second section. This repository adopts the convention in its own
conventions.

## User stories / scenarios

- As a maintainer returning after an unattended run, I read the last
  section of its report and know what landed, what state the task is
  in, and what is still missing.
- As a reviewer, I see a timeout reported as unknown rather than as a
  pass, because the convention forbids the rounding-up.
- As an agent, I know the exact heading and labels to produce, so my
  report is comparable with every other report in the repository.
- As an operator bootstrapping a repo, I get the convention by default
  and can decline it at sign-off if my team has its own.
- As a maintainer with a verification harness, I add my harness rules
  under the same section instead of writing a competing one.

## Acceptance criteria

1. The scaffolded `CONVENTIONS.md` carries a Reporting section stating
   the exact heading text, the three labels and their meanings, the
   Overall vocabulary, the `None` rule for Yet to do, the four honesty
   rules, the principle, and one worked example.
2. The scaffolded `AGENTS.md` carries a Reporting hard rule of a few
   lines naming the heading text and the three labels and pointing at
   the section; it repeats neither the rules nor the example.
3. The autonomous run prompt template ends with a Report step that
   requires the block and quotes the verify gate's exact output line
   and exit code under This run whenever a gate ran.
4. Bootstrap writes the three placements at every depth, including the
   express profile; at full depth the sign-off summary offers an
   opt-out, and an opted-out repository has none of the three.
5. The domain-rules question states that repository-specific reporting
   rules are appended to the section's numbered rules; the template
   carries the insertion point.
6. Audit flags, as drift, an `AGENTS.md` pointer whose heading or
   labels the `CONVENTIONS.md` section does not define, and either
   placement present without the other.
7. This repository's own `CONVENTIONS.md` and `AGENTS.md` carry the
   convention, and its run prompt ends with the Report step.
8. `README.md`, `USAGE.md`, and `docs/` document the convention: what
   the block is, where the scaffold puts it, and the opt-out.

## Out of scope

- docflow's own skills ending their runs with the block —
  adr/0042-skills-end-every-run-with-status-at-a-glance.md.
- Persisted reports: pull-request bodies, wave summaries, and plan-item
  stop entries —
  adr/0043-persisted-reports-carry-status-at-a-glance.md.
- Repository-specific honesty rules for a given verification harness;
  they extend the section per repository.

## Open questions

- The final wording of the Overall vocabulary. Draft: implemented,
  partially verified, verified, blocked, failed, unknown.

## References

- adr/0001-adr-driven-workflow.md
- adr/0007-lifecycle-skills.md
- adr/0042-skills-end-every-run-with-status-at-a-glance.md
- adr/0043-persisted-reports-carry-status-at-a-glance.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-09-04 | r1 | Eugenio Minardi | Initial draft (Proposed), from the approved brainstorm: the Status at a glance block (This run / Overall / Yet to do), four generic honesty rules and the achieved-and-missing principle; one full statement in CONVENTIONS.md, a pointer rule in AGENTS.md, a Report step in the run prompt; default at every depth with a full-depth opt-out; repository-specific rules extend the section. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
