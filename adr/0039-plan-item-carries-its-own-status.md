---
adr: 0039
title: A plan item carries its own live status; the snapshot file is retired
status: Proposed
date: 2026-09-04
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0036", "0001"]
tags: [coordination, plan, status]
---

# ADR 0039 — A plan item carries its own live status; the snapshot file is retired

## Context

The live snapshot was meant to be short: the active branch, the active
queue item, blockers, uncommitted work. Its template also gave it a
"last shipped" and a "next item" section, and in this repository it
grew a release-status preamble and a backlog of unqueued candidate
decisions. It is stale at the time of writing — it says the queue is
empty and names a release that has since shipped — after twenty-four
commits spent updating it. In separate-worktree mode it is gitignored
and local, and the one in the field disagrees with the dashboard
beside it. Nothing audits it against git, although two places declare
git authoritative over it.

Of the fields it holds, almost none need a file. Uncommitted work is
what `git status` says. The active branch is what `git branch` says.
Last shipped is the newest `plan/done/` entry
(adr/0037-shipped-record-is-git-and-plan-done.md). Next item is the
lowest-numbered file in `plan/todo/`. Unqueued candidates are either a
brainstorm conversation or a queued item
(adr/0018-wip-stays-out-of-catalogue.md); a status file is not a third
place for them. What remains — who has claimed a task, what blocks it,
and why an unattended run stopped on it — is real, small, and about
one task. It belongs with that task.

## Capability statement

A `plan/todo/` item carries its own live status and no snapshot file
exists in any mode. Each queued item has a `## Status` section with
three fields, empty at creation:

- **Claimed by** — the actor and the claiming branch
  (adr/0038-in-flight-state-derived-from-branches-and-pull-requests.md),
  filled when work starts.
- **Blockers** — what the item is waiting on, filled and cleared by
  whoever holds the claim.
- **Stopped** — the date and the reason an unattended run stopped on
  this item, filled by the run prompt when a stop condition fires so
  the human who resumes finds the reason with the work.

The section travels with the item: it is committed with the work,
visible on the claiming branch and pull request, and removed when
`ship-item` moves the file to `plan/done/`, where the shipped footer
is the record. Everything the snapshot used to hold that git or the
plan folder already answers is answered there, and the "Picking up
this repo" read order says how. A repository without the `plan/`
layer has no live state to record. No scaffolded file holds a backlog
of unqueued candidates.

Alternative considered: keep a snapshot file, bounded and audited
against git — rejected, because every field that could be audited
against git is one git already answers, and the remaining fields are
per task.

## User stories / scenarios

- As a human resuming after an unattended run stopped, I open the
  queue item and read why it stopped, next to the acceptance criteria
  it was working against.
- As an agent claiming an item, I fill one section in the file I am
  already editing and touch no shared status file.
- As a fresh agent, I find the active item by looking for the status
  section that names a live claim, or by taking the lowest number if
  none does.
- As a maintainer, no file in the repo asserts a state that git
  contradicts.

## Acceptance criteria

1. `new-plan` writes a `## Status` section with the three fields,
   empty, into every new queue item; `plan/README.md` and the
   scaffolded plan convention document the section.
2. The run prompt fills **Claimed by** when it starts an item and, on
   a stop condition, writes **Stopped** with the date and reason,
   commits, and surfaces; `agent-wave`'s brief instructs the same.
3. `ship-item` removes the section when it moves the item to
   `plan/done/`; the shipped footer is the record.
4. Bootstrap writes no snapshot file and no `.gitignore` entry for
   one in any mode; the scaffolded `AGENTS.md` and `CONVENTIONS.md`
   name none; the "Picking up this repo" read order names the status
   section, `git status`, and the queue order as the answers the
   snapshot used to give.
5. Audit flags a **Claimed by** whose branch no longer exists as
   stale, and surfaces every item in `plan/todo/` with a **Stopped**
   entry as needing a human in its report.
6. No scaffolded file holds unqueued candidate decisions; `USAGE.md`
   says where candidates live until they are queued.
7. `README.md`, `USAGE.md`, and `docs/` describe live status as part
   of the plan item, with no snapshot file in any layout listing.

## Out of scope

- The claim convention and the cross-worktree in-flight view —
  adr/0038-in-flight-state-derived-from-branches-and-pull-requests.md.
- The shipped record — adr/0037-shipped-record-is-git-and-plan-done.md.
- Migration of existing snapshot files —
  adr/0040-coordination-directory-migration.md.
- Queue items whose repository has no `plan/` layer — there is no
  item to carry a status.

## Open questions

- None.

## References

- adr/0036-coordination-directory-holds-only-what-git-cannot-tell-you.md
- adr/0001-adr-driven-workflow.md (the plan queue)
- adr/0018-wip-stays-out-of-catalogue.md (where candidates live)
- adr/0037-shipped-record-is-git-and-plan-done.md
- adr/0038-in-flight-state-derived-from-branches-and-pull-requests.md
- adr/0040-coordination-directory-migration.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-09-04 | r1 | Eugenio Minardi | Initial draft (Proposed), from the approved brainstorm: snapshot file retired; queue items carry a Status section (Claimed by, Blockers, Stopped) that travels with the work and is dropped at ship; derivable fields answered by git and the plan folder. Bounded-and-audited snapshot considered and rejected. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
