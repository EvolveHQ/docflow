---
adr: 0032
title: Bootstrap express and guided profiles
status: Implemented
date: 2026-07-03
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0016", "0017", "0020", "0029", "0030", "0031"]
tags: [bootstrap, assessment, ux]
---

# ADR 0032 — Bootstrap express and guided profiles

## Context

adr/0031-tiered-assessment-depth.md gives the shared assessment
protocol a depth selector (express / guided / full) but deliberately
leaves the bootstrap-specific policy undecided: which of bootstrap's
questions are high-impact enough for the guided tier, and what an
express run scaffolds when nobody answers anything. Without that
policy the tiers are a mechanism with no content — and the wrong
defaults would be worse than the questions, because bootstrap writes
files into someone's repository.

## Capability statement

Bootstrap gives the depth tiers concrete meaning:

**Express default profile.** An express bootstrap scaffolds the
recommended-default choice for every question:

- minimal core per the layered artifact model
  (adr/0016-layered-artifact-model.md), optional layers off —
  including domains (adr/0030-domain-grouping.md);
- default artefact root (adr/0017-configurable-artifact-root.md);
- direct-to-main, fast-forward-only integration;
- single-agent coordination;
- seed ADR recording the adopted method **on**
  (adr/0029-seed-adr-recording-the-method.md);
- **standalone** — never part of a federation.

**Federation guard.** Express and guided runs never establish or join
a federation (adr/0020-federation-bootstrap-establish-join.md);
federation questions appear in the full tier only. Joining a
multi-repo product is an outward-facing commitment no default may
make.

**Guided question subset.** Guided asks only the hard-to-reverse
choices — integration model, multi-agent coordination mode, and
whether to keep a plan queue — and takes the recommended default for
everything else.

**Retrofit safety.** On an existing repository, every tier keeps
bootstrap's preserve-and-merge behaviour. Depth changes how many
questions are asked, never how destructive the run is.

**Backfill offer.** The retroactive-capture offer at the end of
bootstrap is asked normally in full, asked as a single brief question
in guided, and deferred in express with a pointer that undocumented
history can be captured later.

## User stories / scenarios

- As a non-technical user, I want an express bootstrap to hand me a
  working, conservatively-configured setup, so my first contact with
  the conventions is one question, not ten.
- As a team lead running guided, I want to decide only integration
  model, coordination mode, and the plan queue, so I control what is
  hard to undo and delegate the rest.
- As a maintainer of an existing repo, I want express to merge and
  preserve exactly as full does, so choosing the quick path never
  costs me content.
- As a member of a multi-repo product, I want federation to be
  impossible to enter by default, so no quick bootstrap silently
  binds a repo to the product.

## Acceptance criteria

1. An express bootstrap scaffolds exactly the profile above: minimal
   core, optional layers (including domains) off, default artefact
   root, direct-to-main fast-forward, single-agent, seed ADR on,
   standalone.
2. Express and guided runs cannot establish or join a federation;
   federation questions are asked in the full tier only.
3. A guided bootstrap asks exactly three questions — integration
   model, multi-agent coordination mode, plan queue — and defaults
   every other choice.
4. On an existing repository, express and guided preserve and merge
   existing content identically to a full run.
5. The backfill offer is asked in full, asked briefly in guided, and
   deferred with a pointer in express.
6. A behavioural eval runs an express bootstrap against a scratch
   repository and asserts the resulting tree matches the express
   profile.

## Out of scope

- The tier mechanism itself — selector, mid-flight switching, recorded
  depth preference — decided in adr/0031-tiered-assessment-depth.md.
- Tier adoption by the lifecycle skills — staged separately under
  adr/0031-tiered-assessment-depth.md.
- Plain-language question wording — deferred, see the same ADR.

## Open questions

- None.

## References

- adr/0031-tiered-assessment-depth.md
- adr/0016-layered-artifact-model.md
- adr/0017-configurable-artifact-root.md
- adr/0020-federation-bootstrap-establish-join.md
- adr/0029-seed-adr-recording-the-method.md
- adr/0030-domain-grouping.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-07-03 | r1 | Eugenio Minardi | Initial draft (Proposed), from the approved 2026-07-03 brainstorm: express profile, federation guard, guided three-question subset, retrofit safety, backfill deferral. |
| 2026-07-03 | r2 | Eugenio Minardi | Status Proposed → Accepted (profile confirmed as drafted after spec review; the mechanism fixes landed in adr/0031-tiered-assessment-depth.md r2). |
| 2026-07-03 | r3 | Eugenio Minardi | Implementation clarification (plan 0033): where per-question recommended defaults (plan/ on, single-agent `_agent/` on) diverge from the express profile, the **profile governs** — for bootstrap, the "recommended default" express takes (adr/0031-tiered-assessment-depth.md AC2) is this fixed profile. "Direct-to-main" and "single writer" are recorded as conventions text; the optional folders stay off. |
| 2026-07-03 | r4 | Eugenio Minardi | Implemented (plan 0033, commits 6e7f8a5/4d9df46/f225e70/fc158bc): depth selector + express/guided profiles live in bootstrap; templates gained the omitted-layer variants the express path needs; AC1–5 met by the skill text, AC6 by the express behavioural eval (PASS, worktree subagent against the pushed skill). Status Accepted → Implemented. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-07-03 | — |
