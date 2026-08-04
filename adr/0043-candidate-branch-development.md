---
adr: 0043
title: Candidate-branch development — main is the released line
status: Implemented
date: 2026-08-04
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0001"]
serves: ["G-one-zero"]
tags: [workflow, git, release, governance]
---

# ADR 0043 — Candidate-branch development — main is the released line

## Context

Between the 0.9.4 release and this decision, 88 commits of
experimental tier development accumulated directly on `main` — the
integration model was direct-to-main, and the development line and
the released line were the same branch. That conflates two different
promises: what `main` *is* (the last thing released) and what is
being *tried* (an experimental 1.0 candidate that may yet be beaten
by an alternative). The operator directed the split: development
moves to a dedicated candidate branch, `main` returns to the release
tag, alternatives get sibling branches, and exactly one candidate is
eventually promoted.

## Capability statement

**`main` is the released line.** Its HEAD always equals the latest
release tag's commit; it advances only with a release — normally by
**promoting** one candidate (fast-forward), exceptionally by a tagged
hotfix. No unreleased development lands on it.

**Development happens on a v1 candidate branch** — `v1/<approach>`,
currently `v1/aligned-autonomy`, which carries the full post-0.9.4
line — under exactly the discipline `main` had: changes fast-forward
onto the candidate, no merge commits, verify gate green before push.
The completion event for queued work is "fast-forwarded to the
active candidate + pushed".

**Alternatives are parallel candidate branches.** Each carries its
own continuation of the catalogue from the shared 0.9.4 base, and
candidates **never merge with one another** — exactly **one** is
promoted to `main`; the others are archived unmerged. Because
unpromoted lines never meet the promoted one, cross-candidate ADR
numbering collisions never share a branch; the audit's cross-branch
checks cover accidental cross-pollination during development.

**Promotion is an operator decision, recorded when taken** — a
decision record on the winning candidate naming what was compared and
why, after which `main` fast-forwards to it and the release is
tagged.

## User stories / scenarios

- As the operator, I want `main` to always be the thing users
  actually got, so an install from the default branch never picks up
  experimental tier work.
- As the operator, I want to develop competing 1.0 approaches on
  sibling branches without them contaminating each other, so the
  promotion choice stays real.
- As a coding agent, I want the completion event to name the branch I
  integrate to, so the shipping discipline is unchanged in everything
  but the target.

## Acceptance criteria

1. `main`'s HEAD is exactly a release-tagged commit — no unreleased
   development sits on the released line.
   Verify: git describe --tags --exact-match main
2. The active candidate branch exists and contains the full
   post-release line (the release tag is its ancestor).
   Verify: git merge-base --is-ancestor v0.9.4 v1/aligned-autonomy
3. The recorded contract states the model: `CONVENTIONS.md` §Git
   Contract and `AGENTS.md` both name candidate-branch development,
   the promotion-only released line, and the never-merge rule for
   alternatives.
   Verify: node -e "const f=require('fs'); const c=f.readFileSync('CONVENTIONS.md','utf8'), a=f.readFileSync('AGENTS.md','utf8'); process.exit(c.includes('candidate') && c.includes('promotion') && a.includes('candidate') && a.includes('promoted') ? 0 : 1)"
4. Exactly one candidate is promoted; alternatives are archived
   unmerged; promotion is an operator decision recorded on the
   winning candidate when taken.
   Verify: manual

## Out of scope

- **The promotion criteria themselves** — what makes a candidate win
  is decided at promotion time and recorded then, not predicted here.
- **Hotfix mechanics on the released line** — permitted (tagged), but
  the process is defined if and when one is needed.
- **Deleting alternative branches** — archived means kept.

## Open questions

- None.

## References

- adr/0001-workflow-as-product.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-08-04 | r1 | Eugenio Minardi | Recorded after the fact (reconstruction path): the operator directed the split on 2026-08-04; the surgery moved the 88 post-0.9.4 commits to `v1/aligned-autonomy` and force-reset `main` to the v0.9.4 commit (ffd0b4e) in the same session this record ships in. Authored at Implemented with the contract amendments. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-08-04 | — |
