---
adr: 0036
title: The coordination directory holds only what git cannot tell you
status: Implemented
date: 2026-09-04
owner: Eugenio Minardi
supersedes: ["0005"]
superseded-by:
depends-on: ["0001", "0005", "0006", "0016"]
tags: [coordination, agents, footprint, conventions]
---

# ADR 0036 — The coordination directory holds only what git cannot tell you

## Context

adr/0005-multi-agent-coordination.md chose the coordination mode by
the number of **writers** (single writer, shared checkout, separate
worktrees) and gave each mode a set of files under `_agent/`: a roles
list, a lock ledger, an append-only worklog, a live snapshot, a
fresh-agent hand-off, a cross-worktree dashboard, and the autonomous
run prompt. Dogfooding this repository and running the set in a
separate-worktree, pull-request repository exposed a category error in
that file set.

The files fall into two classes. **Contracts** — the roles list, the
lock ledger, the run prompt — are written once and rarely change.
**Derived state** — the worklog, the dashboard, and the "last shipped"
and "next item" sections of the snapshot — are hand-maintained copies
of what git history, pull requests, and the `plan/` folder already
record. Every derived file carries a clause saying that git wins when
the two disagree. That clause is an admission that the file is a
cache. A cache with no invalidation goes stale; an append-only cache
grows without bound; and maintaining either costs commits of its own.
In this repository each shipped item is recorded in four places that
all name the same commit, seven of the first 169 commits exist only to
update coordination files, and the snapshot is stale at the time of
writing. In the worktree repository the dashboard row is added on the
work branch, reaches `main` only when the implementation pull request
merges, and is removed by a second pull request — so on `main` it is
invisible while the work is in flight and present only after the work
has landed. A whole pull request there exists solely to perform that
close-out.

The spec had drifted as well: the member lists of `_agent/` disagree
across the layout tree, the README, the scaffolded `AGENTS.md`, and
the docs; the worklog and dashboard templates disagree with every
writer instruction on their columns; nothing reads the hand-off or the
roles list; the hand-off hardcodes paths that the artefact-root and
optional-layer decisions made variable; and choosing no coordination
directory together with a real verify gate still writes a run prompt
that reads and writes files that do not exist — as does recording a
gate without the plan queue that prompt is written to walk.

The remedy is a principle, not another file: `_agent/` is the **agent
operating contract** — who writes what, the one real mutex, and how an
unattended run behaves. What is happening lives in branches and pull
requests. What happened lives in git history and `plan/done/`. What a
task is waiting on lives in that task's own plan item.

## Capability statement

`_agent/` holds only what git cannot tell you. It contains contracts
and never derived state. The coordination mode is still chosen by the
number of writers, and each mode prescribes exactly these files.

The run prompt has two prerequisites, not one: it is written only when
a verify gate is recorded **and** the `plan/todo/` queue it walks
exists. The prompt's loop is "take the next queue item, do it, run the
gate", so failing either prerequisite leaves it naming a command or a
directory that is not there; fail either and no prompt is written.

- **Single writer** — `_agent/prompts/autonomous.md` when a verify
  gate is recorded and the plan queue exists; otherwise no `_agent/`
  directory at all. This one answer replaces both the former "none" and
  "single agent" answers, which now produce the same result.
- **Shared checkout** — `ROLES.md`, `LOCKS.md` as the filesystem
  mutex, and the run prompt when a gate is recorded and the plan queue
  exists.
- **Separate worktrees / pull requests** — `ROLES.md` and the run
  prompt when a gate is recorded and the plan queue exists. No lock
  ledger: the pushed branch and the draft pull request are the lock,
  and an advisory ledger whose own header says not to rely on it is
  noise.

No mode writes a worklog, a dashboard, a snapshot, or a hand-off file.
The hand-off's read order becomes a short "Picking up this repo"
section of `AGENTS.md`, the core file every agent reads first,
generated from the recorded artefact root, layers, and mode so it never
names an absent file. The hand-off's stop conditions live in the run
prompt, the only consumer they ever had. Where the retired information
lives instead is decided in adr/0037-shipped-record-is-git-and-plan-done.md,
adr/0038-in-flight-state-derived-from-branches-and-pull-requests.md, and
adr/0039-plan-item-carries-its-own-status.md.

Each remaining file opens with a header naming what it is
authoritative for. `_agent/` remains an optional layer
(adr/0016-layered-artifact-model.md): it is present exactly when the
mode or the gate calls for it, and its absence is a valid state.

## User stories / scenarios

- As a maintainer, I know what `_agent/` is for from its one-line
  purpose, and every file in it is one I would have to write by hand
  because git cannot produce it.
- As an agent picking up a repo, I read `AGENTS.md` and it tells me
  the read order for this repo's actual layout, without a second entry
  point that duplicates it.
- As a solo maintainer with both a verify gate and a plan queue, I get
  a run prompt and nothing else; missing either one, I get no
  coordination directory at all.
- As a team on separate worktrees, I stop maintaining a dashboard that
  could never be current on `main` and a lock ledger nobody trusted.
- As an auditor, I flag any `_agent/` file that holds derived state,
  because the principle is checkable.

## Acceptance criteria

1. Bootstrap writes exactly the files the chosen mode prescribes and
   nothing else under `_agent/`; the run prompt is written only where a
   verify gate is recorded **and** the `plan/todo/` queue exists, and a
   single-writer repo without a recorded gate, or without a plan queue,
   has no `_agent/` directory.
2. The coordination question offers three answers keyed on writers —
   single writer, shared checkout, separate worktrees — and "single
   writer" replaces the former "none" and "single agent" answers; the
   express and guided profiles record single writer.
3. The scaffolded `AGENTS.md` carries a "Picking up this repo" section
   listing the read order for the repo's recorded root, layers, and
   mode, naming no absent file; no hand-off file is written; the run
   prompt's orient step points at that section instead of restating
   it; stop conditions appear only in the run prompt.
4. `LOCKS.md` is written in shared-checkout mode only; `ROLES.md` in
   shared-checkout and separate-worktree modes only; no mode writes a
   worklog, dashboard, snapshot, or `.gitattributes` union entry.
5. Every `_agent/` file opens with a header naming its purpose and what
   it is authoritative for; no `_agent/` file instructs the reader to
   prefer git over its own content.
6. Every listing of `_agent/` members — the bootstrap layout tree, the
   scaffolded `AGENTS.md` and `CONVENTIONS.md`, `README.md`,
   `USAGE.md`, and `docs/` — states the same one-line purpose and the
   same per-mode members.
7. No lifecycle skill step and no run-prompt step writes a worklog,
   dashboard, or snapshot; `agent-wave`'s stop and cleanup steps name
   no file the recorded mode does not prescribe.
8. Audit's coordination-hygiene check fails when a file exists under
   `_agent/` that the recorded mode does not prescribe, or when any
   `_agent/` file carries derived state (a shipped-item log, an
   in-flight table, or a snapshot of branch or queue state).

## Out of scope

- Where the shipped record, the in-flight view, and a task's live
  status live instead — adr/0037-shipped-record-is-git-and-plan-done.md,
  adr/0038-in-flight-state-derived-from-branches-and-pull-requests.md,
  adr/0039-plan-item-carries-its-own-status.md.
- Migration and clean-up of repositories that carry the former file
  set — adr/0040-coordination-directory-migration.md.
- Identifier reservation and single-writer-per-artefact semantics —
  adr/0010-worktree-conflict-reconciliation.md — and the concurrency
  guardrails — adr/0014-concurrency-guardrails.md. Both stand; the
  file they named as the ownership record is retired by
  adr/0038-in-flight-state-derived-from-branches-and-pull-requests.md.
- The integration model — adr/0006-integration-model.md.

## Open questions

- None.

## References

- adr/0001-adr-driven-workflow.md
- adr/0005-multi-agent-coordination.md (superseded by this decision)
- adr/0006-integration-model.md
- adr/0016-layered-artifact-model.md
- adr/0037-shipped-record-is-git-and-plan-done.md
- adr/0038-in-flight-state-derived-from-branches-and-pull-requests.md
- adr/0039-plan-item-carries-its-own-status.md
- adr/0040-coordination-directory-migration.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-09-04 | r1 | Eugenio Minardi | Initial draft (Proposed), from the approved brainstorm: `_agent/` holds contracts only, never derived state; per-mode file set redefined (single writer / shared checkout / separate worktrees); hand-off folded into `AGENTS.md` and the run prompt; supersedes 0005's file shapes while keeping its writer-keyed modes. |
| 2026-09-05 | r2 | Eugenio Minardi | Status Proposed → Accepted; acceptance delegated to the session by the operator. Open question resolved as drafted: `ROLES.md` stays; roles and domains are different axes. Plan 0038 authorised. |
| 2026-09-05 | r3 | Eugenio Minardi | The run prompt now requires the `plan/todo/` queue as well as a recorded verify gate: capability statement (a new prerequisite paragraph and all three mode bullets), the Context drift sentence, the solo-maintainer scenario and AC1 restated accordingly. Triggered by review of pull request #3 (plan 0038): the implementation had added the queue prerequisite to stop a gate-present, queue-less repo getting a prompt that walks a queue which does not exist, and the specification is brought back into agreement with it. Status unchanged. |
| 2026-09-05 | r4 | Eugenio Minardi | Implemented (plan 0038, PR #3, merge d6df7df): writer-keyed coordination answers with the per-mode file set; hand-off retired into the scaffolded AGENTS read order and the run prompt; roles and locks headers; agent-wave, ship-item, new-adr name only prescribed files; audit hygiene fails on unprescribed or derived-state files and reports a legacy layout without offering removal; docs and eval assertions aligned; the four derived-state templates deleted. AC1–8 met. Status Accepted → Implemented. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-09-05 | — (delegated) |
| Maintainer | Eugenio Minardi | 2026-09-05 | — (delegated) |
