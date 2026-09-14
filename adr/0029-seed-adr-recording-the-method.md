---
adr: 0029
title: Seed ADR recording the adopted method
status: Implemented
date: 2026-06-28
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0001", "0003", "0016", "0018"]
tags: [bootstrap, conventions, onboarding]
---

# ADR 0029 — Seed ADR recording the adopted method

## Context

A freshly bootstrapped docflow repo starts with an **empty catalogue** — just
`adr/0000-template.md`. A reader opening `adr/` finds no in-catalogue record
of *why* the repo uses ADRs or *how* they are shaped; that lives only in
`CONVENTIONS.md`/`AGENTS.md`. The lightweight-ADR tradition (Nygard's
"record architecture decisions", MADR's "use markdown ADRs") instead seeds
the catalogue with a first decision that documents the practice itself, so
the catalogue is **self-describing from entry one**.

Adopting an ADR-driven, documentation-led method **is** an architectural
decision — costly to reverse, something every contributor builds against —
and therefore belongs in the catalogue as a dated, immutable,
supersede-able record, not only as authoring rules. This ADR decides that
bootstrap scaffolds that seed.

## Capability statement

Bootstrap **scaffolds, by default, a seed ADR at `adr/0001`** in the target
repo recording the decision to adopt the documentation-led, ADR-driven
method. `adr/0000-template.md` remains the template; the seed is `0001`,
ahead of any subsequent decisions, keeping numbering contiguous.

- The seed is created with status **`Implemented`** — the method is in use
  the moment it is scaffolded.
- It states the **decision and its rationale** and **references
  `CONVENTIONS.md`** for the operative rules rather than duplicating them,
  so there is one source of truth for the rules.
- It is written **generically** — no docflow-internal ADR numbers or titles
  appear in it (adr/0004-adr-privacy.md); it describes the method by its
  product-level behaviour.
- It is **default-on, opt-out** at bootstrap, consistent with the
  layered-artifact model (adr/0016-layered-artifact-model.md): a minimalist
  who wants "just the template" can decline it.
- On a **retrofit/backfill** (adr/0003-backfill-retrofit.md), the seed is
  always ADR `0001`, ahead of the reconstructed decisions.
- The seed uses the repo's ADR shape: the technology shape where the repo
  splits shapes, the single/capability shape otherwise.
- Where the plan layer exists, its adoption record is created atomically with
  the complete scaffold. For direct integration it may name its exact
  repository-relative path with a precise introducing-commit resolver instead
  of an impossible future/self SHA. Resolve one reachable introduction after
  commit and verify the record, Implemented seed, INDEX, complete scaffold and
  required signature. Ordinary work still names an existing verified-work SHA;
  pull-request completion retains its actual PR reference and merge boundary.

## User stories / scenarios

- As a new contributor, the first ADR I read explains why this repo uses
  ADRs and points me at where the rules live.
- As a maintainer, my catalogue is self-describing from entry one, matching
  the convention readers expect from MADR/adr-tools repos.
- As a retrofitter, the backfill is anchored by a dated "we adopted this
  method on `<date>`" record at `0001`.
- As a minimalist, I can opt out and keep only the template.

## Acceptance criteria

1. Bootstrap, by default, writes `adr/0001-<slug>.md` recording the decision
   to adopt the method; the operator may opt out.
2. `adr/0000-template.md` remains the template; the seed is `0001` and
   numbering stays contiguous (no gap, no reuse).
3. The seed's status is `Implemented` on creation.
4. The seed states the decision + rationale and **references**
   `CONVENTIONS.md` for the rules; it does not duplicate the convention
   text.
5. The seed is generic: no docflow-internal ADR numbers/titles appear in it.
6. On retrofit/backfill, the seed is ADR `0001`, ahead of the reconstructed
   decisions.
7. The seed uses the repo's ADR shape (technology where the repo splits,
   single/capability shape otherwise).
8. A direct bootstrap adoption record names an existing verified scaffold SHA
   or its exact path plus `git log --follow --diff-filter=A --format=%H -- <path>`.
   The latter resolves to exactly one reachable introducing commit containing
   the record, Implemented seed, INDEX row and complete verified scaffold,
   with a valid signature where required. Generic labels, wrong paths,
   ambiguous introductions and pre-scaffold references fail verification.

## Out of scope

- The coordination-mode reframing (writers vs agents) and the
  claim-before-do guardrail — separate revisions to
  adr/0005-multi-agent-coordination.md and
  adr/0014-concurrency-guardrails.md.
- Seeding other optional artefacts (GLOSSARY, domains) —
  adr/0016-layered-artifact-model.md governs those.

## Open questions

- None. (Resolved at brainstorm: seed at `0001`; default-on/opt-out;
  `Implemented`; repo's recommended shape; always `0001` on retrofit.)

## References

- adr/0001-adr-driven-workflow.md
- adr/0003-backfill-retrofit.md
- adr/0016-layered-artifact-model.md
- adr/0018-wip-stays-out-of-catalogue.md
- adr/0037-shipped-record-is-git-and-plan-done.md
- `plan/todo/0051-agent-wave-per-host-verification.md` (native footer finding and focused verification)
- https://github.com/adr/adr-log/blob/main/docs/adr/0000-use-markdown-architectural-decision-records.md (MADR seed-ADR prior art)

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-28 | r1 | Eugenio Minardi | Initial draft. Bootstrap scaffolds a default-on seed ADR at adr/0001 recording the adopted method (Implemented, references CONVENTIONS, generic, anchors backfill). |
| 2026-06-28 | r2 | Eugenio Minardi | Accepted. All five brainstorm open questions resolved (seed at 0001; default-on/opt-out; Implemented; repo's recommended shape; always 0001 on retrofit). |
| 2026-06-29 | r3 | Eugenio Minardi | Implemented (commit 188c938): templates/adr-0001-seed.md + bootstrap output item 5b (default-on adr/0001 seed, opt-out at sign-off, conditional plan/done entry, backfill anchor at 0001); README/USAGE document it. AC1-7 met. |
| 2026-09-14 | r4 | Codex, operator-authorised | Native Cowork exposed a generic hashless seed footer that existing bootstrap checks missed. Specify a seed-only exact introduction reference, preserving atomic scaffolding, arbitrary supplied gates and Implemented-on-creation; ordinary completion keeps an existing verified-work SHA. Add AC8 and focused positive/negative checks. Retain historical Implemented status; targeted native verification of this clarification remains pending in 0051, with the original failed observation preserved. |
| 2026-09-14 | r5 | Codex, operator-authorised | Verify the clarification on native Cowork with loaded eff3130 export: 25 independent actual-target checks pass, including the unique reachable signed introduction 48dcf4ed70db152bb5b375a5ea9d59f512996bb0 containing the full tested scaffold. Fourteen deterministic reference regressions pass. Preserve the original generic-footer failure and limit this to the fresh targeted bootstrap; the overall five-host release remains incomplete. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-06-28 | — |
| Operator | Eugenio Minardi | 2026-09-14 | Necessary correction authorised within 0051; exact-source native verification required |
| Operator | Eugenio Minardi | 2026-09-14 | Authorised native corrected-export continuation; independent target verification recorded in the Cowork continuation audit |
