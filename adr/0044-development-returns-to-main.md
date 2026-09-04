---
adr: 0044
title: Development returns to main — candidate branches archived unmerged
status: Implemented
date: 2026-09-04
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0001", "0006", "0009"]
tags: [workflow, git, release, governance]
---

# ADR 0044 — Development returns to main — candidate branches archived unmerged

## Context

On 2026-08-04 the operator froze `main` at the v0.9.4 release commit
and moved experimental development to **candidate branches**, each
pursuing one approach: `v1/aligned-autonomy` first, then
`v1/agent-loop-graph`, cut clean from the release tag on 2026-08-05.
Each candidate recorded that model in its own catalogue —
`adr/0043-candidate-branch-development.md` on the first,
`adr/0034-candidate-branch-development.md` on the second — with the
rules that `main` advances only by promoting one candidate, that
candidates never merge, and that the others are archived. Because
catalogues never merge, that decision was never recorded on `main`,
whose own conventions continued to describe direct-to-main,
fast-forward-only development.

Neither candidate was promoted. On 2026-09-04 a review session
resumed development on `main` directly, recording ten decisions and
queuing ten work items, without sight of the candidate model. When
the discrepancy surfaced, the operator chose to keep `main` as the
development line rather than rebase the work onto a candidate. This
ADR records that choice on the line that continues, so the catalogue
on `main` explains its own history.

## Capability statement

**`main` is the development line**, under the git contract this
catalogue has always recorded: direct-to-main, fast-forward only,
verify gate green before push; the completion event for queued work
is "fast-forwarded to `main` and pushed"
(adr/0006-integration-model.md).

**The release line is the tag series, not the branch.** `main` may run
ahead of the latest release tag, and an install from the default
branch may include unreleased work. A release remains an explicit,
tagged, version-bumped event
(adr/0009-distribution-marketplace-npm.md); the published npm version
and the tag are what users are promised.

**The candidate branches are archived unmerged.** They stay on the
remote as history, receive no further commits, and are never merged
into `main`. A decision recorded on a candidate that is wanted on
`main` is re-recorded here as a new ADR by content, citing the
candidate's record in its references, never by merge — the two
catalogues share numbers above 0033 and cannot be joined.

Nothing on `main` is superseded by this decision, because the
candidate model was never recorded on `main`. This ADR is the record
of its end for this line.

## User stories / scenarios

- As the operator, I develop on `main` again with the discipline the
  catalogue already records, and the ten decisions of 2026-09-04 keep
  their numbers.
- As a reader of this catalogue, I learn from one record why two
  candidate branches exist on the remote and why they will never
  merge.
- As a maintainer who wants an idea from a candidate, I re-record it
  as a new decision here and cite the candidate's ADR, rather than
  cherry-picking a catalogue that shares numbers with this one.
- As a user installing from a release tag or the npm version, I get
  exactly what was released; installing from the default branch, I
  accept unreleased work.

## Acceptance criteria

1. `main` advances with development commits under the recorded
   contract: fast-forward only, no merge commits, verify gate green
   before every push.
2. `CONVENTIONS.md` and `AGENTS.md` on `main` describe direct-to-main
   development and mention no candidate model.
3. The candidate branches `v1/aligned-autonomy` and
   `v1/agent-loop-graph` remain on the remote, unmerged, and receive
   no further commits; `main` contains no commit from either.
4. A decision taken from a candidate reaches `main` only as a new ADR
   citing the candidate's record; no commit is cherry-picked or merged
   from a candidate.
5. Releases remain explicit tagged, version-bumped events; the
   default branch is not presented as a release.

## Out of scope

- Whether any decision on `v1/aligned-autonomy` is re-recorded on
  `main`; each is a separate future decision.
- Deleting the archived branches; they are kept.
- The integration model itself — adr/0006-integration-model.md — and
  the release mechanics — adr/0009-distribution-marketplace-npm.md —
  are unchanged.

## Open questions

- None.

## References

- adr/0001-adr-driven-workflow.md
- adr/0006-integration-model.md
- adr/0009-distribution-marketplace-npm.md
- `v1/agent-loop-graph:adr/0034-candidate-branch-development.md`
  (the candidate model, second candidate)
- `v1/aligned-autonomy:adr/0043-candidate-branch-development.md`
  (the candidate model, first candidate)

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-09-04 | r1 | Eugenio Minardi | Recorded on the operator's decision of the same day, in force from this commit: `main` is the development line again; the release line is the tag series; the candidate branches are archived unmerged. Authored at Implemented because the decision is effective on being taken; the matching `plan/done` entry names this commit. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-09-04 | — |
