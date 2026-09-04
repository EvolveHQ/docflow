---
adr: 0040
title: Compatibility, clean-up, and migration of existing coordination directories
status: Proposed
date: 2026-09-04
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0036", "0037", "0038", "0039", "0033", "0035"]
tags: [coordination, migration, audit, bootstrap]
---

# ADR 0040 — Compatibility, clean-up, and migration of existing coordination directories

## Context

Repositories bootstrapped before
adr/0036-coordination-directory-holds-only-what-git-cannot-tell-you.md
carry the former file set: a worklog, a snapshot, a hand-off, and — in
separate-worktree mode — a dashboard, an advisory lock ledger, a
`.gitattributes` union entry, and a `.gitignore` entry for the
snapshot. This repository is one of them; a security-programme
repository in the field is another. Their `AGENTS.md`, `CONVENTIONS.md`,
and run prompts instruct agents to keep those files current, so an
agent following the recorded conventions will keep producing the
staleness and growth the new decisions remove.

docflow's standing posture on already-scaffolded repositories is that
a change of convention is **offered, never forced**
(adr/0033-artefact-root-discovery.md,
adr/0035-range-numbered-catalogue-migration.md). Two things are
different here. First, the retired files are not merely an older
encoding of the same information; they are caches that are stale or
growing now, so the offer must include a complete clean-up, and a
repository that declines migration still deserves a way to prune what
is stale. Second, nothing is lost by deleting them: every row of a
worklog and every dashboard entry is in git history, and the only
live content — a current claim or blocker — has a new home in the
plan item's status section.

## Capability statement

A repository carrying the former coordination file set keeps working
and is offered two things, separately: a **clean-up** of stale content
and a **migration** to the new file set. Neither runs without
confirmation, and both show what they will change first.

- **Recognition.** Audit recognises the legacy layout from any of: a
  worklog file or directory, a dashboard, a snapshot, a hand-off, a
  lock ledger in separate-worktree mode, a union-merge attribute for
  the worklog, or a `.gitignore` entry for the snapshot. While the
  legacy layout is in place, the legacy hygiene checks continue to
  apply, and audit reports one non-failing "migration available"
  finding.
- **Clean-up (offered even when migration is declined).** Audit lists
  stale content — dashboard rows with no live branch, pull request, or
  worktree; lock claims with no pending change; snapshot statements
  that git contradicts — and offers to remove it, row by row, with
  confirmation.
- **Migration (audit's fix step and the bootstrap existing-repo
  path).** After a dry-run listing and confirmation: remove the
  worklog, dashboard, snapshot, and hand-off from the tree (history
  keeps them); remove the union-merge attribute and the `.gitignore`
  entry; remove `ROLES.md` in single-writer mode and `LOCKS.md` in
  separate-worktree mode; add the status section to every open queue
  item, carrying over any current claim or blocker found in the
  snapshot or dashboard; write the "Picking up this repo" section into
  `AGENTS.md`; rewrite the coordination sections of `AGENTS.md` and
  `CONVENTIONS.md` to the new conventions; regenerate the run prompt
  from the recorded answers; and land it as one commit whose message
  lists every file removed or moved and where its content now lives.
- **Verification.** After migration the repository passes the
  coordination checks of the new decisions with no manual edit.

## User stories / scenarios

- As a maintainer of a repository bootstrapped last month, my audit
  stays green and tells me, in one finding, that a migration is
  available and what it would remove.
- As that maintainer, I accept and get one commit that deletes the
  caches, moves my one open blocker into its plan item, and rewrites
  my conventions; my history still holds every old worklog row.
- As a maintainer who declines, I still get an offer to drop the three
  dashboard rows whose branches were merged weeks ago.
- As a reviewer, the migration commit tells me where each removed
  file's content now lives.
- As an operator re-running bootstrap on a legacy repository, I am
  offered the same migration in the existing-content step.

## Acceptance criteria

1. Audit recognises the legacy layout from any of the listed markers
   and reports it as one finding of severity "migration available",
   not as a failure.
2. While the legacy layout is in place, the legacy hygiene checks —
   stale lock claims, dashboard rows against live worktrees — apply
   exactly as before, so a passing repository keeps passing.
3. Audit offers the stale-content clean-up independently of migration,
   listing each stale row, claim, or statement with the evidence that
   makes it stale, and removes only what the operator confirms.
4. Audit's fix step and the bootstrap existing-repository path both
   offer the migration, show the dry-run listing of every removal,
   move, and rewrite, and write nothing without confirmation.
5. The migration removes the worklog, dashboard, snapshot, and
   hand-off files, the union-merge attribute, the snapshot
   `.gitignore` entry, `ROLES.md` in single-writer mode, and `LOCKS.md`
   in separate-worktree mode.
6. The migration adds the status section to every open queue item and
   carries over any current claim or blocker found in the snapshot or
   dashboard; nothing live is lost.
7. The migration writes the "Picking up this repo" section into
   `AGENTS.md`, rewrites the coordination sections of `AGENTS.md` and
   `CONVENTIONS.md`, and regenerates the run prompt from the recorded
   assessment answers.
8. The migration lands as one commit whose message lists every file
   removed or moved and where its content now lives.
9. After migration the repository passes the coordination checks of
   adr/0036-coordination-directory-holds-only-what-git-cannot-tell-you.md,
   adr/0037-shipped-record-is-git-and-plan-done.md,
   adr/0038-in-flight-state-derived-from-branches-and-pull-requests.md,
   and adr/0039-plan-item-carries-its-own-status.md with no manual
   edit.
10. An eval fixture built from a legacy layout exercises recognition,
    the clean-up offer, the migration, and the post-migration audit.

## Out of scope

- The new file set and where the retired information lives —
  adr/0036-coordination-directory-holds-only-what-git-cannot-tell-you.md
  through adr/0039-plan-item-carries-its-own-status.md.
- Rewriting git history or tags.
- Federation-wide propagation of the new coordination conventions —
  adr/0027-convention-template-propagation.md applies unchanged.

## Open questions

- None.

## References

- adr/0036-coordination-directory-holds-only-what-git-cannot-tell-you.md
- adr/0037-shipped-record-is-git-and-plan-done.md
- adr/0038-in-flight-state-derived-from-branches-and-pull-requests.md
- adr/0039-plan-item-carries-its-own-status.md
- adr/0033-artefact-root-discovery.md (offered-never-forced precedent)
- adr/0035-range-numbered-catalogue-migration.md (migration pattern)
- adr/0027-convention-template-propagation.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-09-04 | r1 | Eugenio Minardi | Initial draft (Proposed), from the approved brainstorm with the operator's addition: legacy coordination layouts stay recognised; a stale-content clean-up is offered even when migration is declined; the migration removes the caches, carries live claims and blockers into plan items, rewrites the conventions, and lands as one commit naming where every removed file's content lives. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
