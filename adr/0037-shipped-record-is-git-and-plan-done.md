---
adr: 0037
title: The shipped-work record is git history and plan/done
status: Proposed
date: 2026-09-04
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0036", "0001", "0007"]
tags: [coordination, worklog, history, plan]
---

# ADR 0037 — The shipped-work record is git history and plan/done

## Context

The worklog was meant to be an append-only ship log: one row per
commit, newest at the bottom, the tail of which a fresh agent reads to
confirm what landed. In practice every row is the fourth copy of the
same fact. A shipped item is already recorded by the completion
commit itself, by the `plan/done/` file whose shipped footer names the
HEAD SHA and release, and by the owning ADR's revision-history row.
The worklog row restates all three, in prose long enough that the file
is the largest thing in `_agent/` after thirty items and would be
unreadable after three hundred. Nothing bounds it, nothing prunes it,
and nothing reads it except the hand-off's instruction to tail its
last thirty lines.

The mechanics built around it exist only because it is a hand-written
duplicate. The `merge=union` attribute in separate-worktree mode is
there so concurrent appends do not conflict; the row must carry the
commit SHA because union-merge order is not commit order; a per-agent
split is mentioned once in the assessment and implemented nowhere; and
the writer instructions disagree with the template on the columns.
Backfill is told to "regenerate the worklog" — the one place the
product admits the file is derivable.

adr/0036-coordination-directory-holds-only-what-git-cannot-tell-you.md
retires derived state from `_agent/`. This decision names where the
shipped record lives instead.

## Capability statement

The record of what shipped is **git history and `plan/done/`**, and
nothing else is written:

- The completion commit is the event. Its message names the plan item
  and the ADR(s) it advances, as the git contract already requires.
- The `plan/done/` file is the chronological, one-per-item record; its
  shipped footer names the HEAD SHA and any release tag or package
  version, as the plan convention already requires.
- The first-parent history of the integration branch is the ordered
  log. "What landed recently" is the newest entries in `plan/done/`
  together with `git log --first-parent`; the read order in
  `AGENTS.md` says exactly that.

No worklog file is written, appended, or regenerated in any mode; the
`merge=union` attribute and the per-agent split disappear with it. A
repository without the `plan/` layer has git history alone as its
record, which is what it had before. Backfill reconstructs `plan/done/`
entries and regenerates nothing else.

Alternatives considered: a **bounded** worklog (keep the last N rows,
archive the rest) — rejected, because bounding a duplicate keeps the
duplicate and adds an archive to maintain; a **generated** worklog in
the manner of `INDEX.md` — rejected, because `INDEX.md` assembles
metadata scattered across many files into a view git cannot produce,
whereas a generated worklog would list what `git log` already lists.

## User stories / scenarios

- As a fresh agent, I learn what landed from the newest `plan/done/`
  files and one git command, and the answer is never stale because it
  is not a copy.
- As a maintainer shipping an item, the completion commit and the
  `plan/done/` move are the whole record; I append nothing.
- As a team on separate worktrees, I no longer need a union-merge
  attribute for a file nobody reads.
- As a maintainer running backfill, I reconstruct `plan/done/` entries
  and nothing pretends to be a log of commits that were never logged.

## Acceptance criteria

1. `ship-item`'s record step appends nothing; the completion commit
   message names the plan item and the owning ADR(s), and the
   `plan/done/` footer names the HEAD SHA and any release identifier.
2. The "Picking up this repo" read order names the newest `plan/done/`
   entries and a first-parent `git log` command as the shipped record;
   no template, skill, or run prompt refers to a worklog or its tail.
3. Bootstrap writes no worklog and no `.gitattributes` union entry in
   any mode; the per-agent worklog split is removed from the
   assessment text.
4. The run prompt's record step and `agent-wave`'s stop path record
   outcomes in the completion commit, the report, and — for a stop —
   the plan item's status section, never in a worklog.
5. Backfill's wording reconstructs `plan/done/` entries only; the
   phrase "regenerate the worklog" appears nowhere.
6. Audit reports a `_agent/WORKLOG.md` or `_agent/worklog/` as legacy
   derived state and hands it to the migration finding of
   adr/0040-coordination-directory-migration.md.
7. `README.md`, `USAGE.md`, and `docs/` describe the shipped record as
   git history and `plan/done/`, with no worklog in any layout listing.

## Out of scope

- Migration and clean-up of existing worklogs —
  adr/0040-coordination-directory-migration.md.
- The commit-message format — each repo's git contract.
- The in-flight view — adr/0038-in-flight-state-derived-from-branches-and-pull-requests.md.

## Open questions

- None.

## References

- adr/0036-coordination-directory-holds-only-what-git-cannot-tell-you.md
- adr/0001-adr-driven-workflow.md (the completion event and `plan/done/`)
- adr/0007-lifecycle-skills.md (`ship-item`'s record step)
- adr/0003-backfill-retrofit.md (backfill wording)
- adr/0040-coordination-directory-migration.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-09-04 | r1 | Eugenio Minardi | Initial draft (Proposed), from the approved brainstorm: worklog retired; the completion commit, the `plan/done/` footer, and first-parent git history are the shipped record; union-merge attribute and per-agent split removed. Bounded and generated worklogs considered and rejected. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
