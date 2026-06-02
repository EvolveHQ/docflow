---
name: agent-wave
description: Orchestrate a wave of parallel agents over the plan/todo queue in a documentation-led repo — asks how many agents, the budget (items/waves, with hours as a soft cap), and whether to checkpoint after each wave or run continuously. Spawns isolated worktree subagents, assigns one queue item each, collects results. Use when the user says "spawn a wave of agents", "run the queue in parallel", "fan out the work", "agent wave", or invokes /agent-wave.
---

# agent-wave

Drive the implementation queue with parallel subagents, in waves.

## Honest scope (read first)

In-session subagents are bounded by **this session**, not by wall-clock
hours. So this skill measures budget reliably in **items and waves**,
with hours as a *soft cap* (stop starting new waves once elapsed time
passes it). For a true multi-hour unsupervised fleet that outlives a
session, use remote agents or a scheduled run of
`_agent/prompts/autonomous.md` (`/schedule`) instead — this skill points
you there rather than pretending to be it.

## Step 0 — Preconditions and context

1. Confirm the repo is bootstrapped with a `plan/` queue and that
   `_agent/prompts/autonomous.md` exists (a real verify gate is
   required — see the **bootstrap** skill, Q8).
2. Read `CONVENTIONS.md` for the **multi-agent mode** and **integration
   model**.
   - **Mode 1 (single agent):** refuse. Parallel agents in one checkout
     clobber each other. Tell the user to re-bootstrap as mode 2/3, or
     run the autonomous prompt sequentially instead.
   - **Mode 2 (shared checkout):** allowed but warn — file contention is
     real; LOCKS must be respected and wave width kept low.
   - **Mode 3 (worktrees):** the intended mode. Each subagent works in
     its own isolated worktree.

## Step 0.5 — Assessment (run first)

Run the shared assessment protocol before spawning anything:

- **Opt-out gate first.** Ask whether to run the assessment or proceed on
  recommended defaults. Recommend **running** it when the request arrived
  with little or no context (e.g. a bare "fan out the queue"); recommend
  **skipping** when width, budget, supervision, and merge strategy were
  all specified.
- The Step 1 parameters **are** the assessment questions: ask them **one
  at a time**, each with a **recommended option** and a one-line reason;
  wait for each answer.
- Use **structured selection** (single- or multiple-choice). If the host
  exposes a structured single-/multi-select question tool, use it and
  mark the recommended option; otherwise list options A/B/C in plain text
  and name the recommended one. Use free text only where unavoidable.
- **The operator decides.** Never spawn a wave without confirmed
  parameters, and never guess when invoked with no context.

## Step 1 — Ask the wave parameters (one at a time, recommend)

1. **Wave width N** — how many agents per wave.
   *Recommended: min(queue depth, 3)* — modest, keeps review tractable.
2. **Budget** — total items (or waves) to attempt this run.
   *Recommended: one wave, then reassess.* Optionally a soft hours cap.
3. **Supervision** — **checkpoint** (review after each wave, then
   continue) or **continuous** (run wave after wave until budget/queue
   exhausted).
   *Recommended: checkpoint* for the first run on a repo.
4. **Merge / integration strategy** — how each shipped item lands.
   *Recommended: follow the repo's integration model* (read it from
   `CONVENTIONS.md`). Override options: **local fast-forward**,
   **PR-based**, or **other**. This sets how each subagent integrates in
   Step 3 and what "shipped" means for the wave.

Cross-check: **continuous + direct-to-main** is risky — nothing gates
each merge. If the repo is direct-to-main, recommend either switching
this run to checkpoint, or that the repo move to PR-based so CI gates
every merge.

## Step 2 — Plan the wave

- Read `plan/todo/`; take the lowest-numbered N items with no unmet
  dependencies. Two agents must never get the same item or items that
  edit the same files — partition by item and, in mode 2, by LOCKS.
- **Reserve identifiers before spawning.** Parallel worktrees that each
  author an ADR or a `plan/` item will otherwise collide on the same
  next number — each worktree computes "next" against its own checkout,
  so two will pick the same one and break the contiguous-numbering
  invariant at merge. Before the wave:
  - Compute the current highest ADR number and `plan/todo` slot.
  - Hand each agent a **disjoint reserved block** — e.g. agent A may
    create ADRs `0042+` and plan slots `0007+`, agent B `0043+` /
    `0008+`, interleaved so no two blocks overlap. Most queue items
    implement an existing ADR and need none — reserve only for items
    that will author new ADRs/plans.
  - An agent uses only its reserved identifiers; if it needs more than
    reserved, it stops and reports rather than guessing.
- **Single writer per artefact.** An ADR body (or a given `plan/` item)
  is edited by at most one worktree per wave. Never put two items that
  both edit the same ADR in one wave — a `merge=union` would silently
  concatenate contradictory edits into an incoherent document.
- Record the assignment in `_agent/IN_FLIGHT.md` (mode 3) so the wave is
  visible — including each agent's reserved identifier block.

## Step 3 — Spawn the wave

Spawn N subagents in parallel, each in an isolated worktree
(`isolation: worktree`). Brief each with: its assigned queue item, the
instruction to follow `_agent/prompts/autonomous.md` end-to-end for that
one item (orient → implement → verify → integrate per the repo's model →
ship), and to report back a structured result (item, pass/fail, HEAD or
PR link, any blocker).

## Step 4 — Collect and checkpoint

When the wave returns, summarise: shipped, failed, blocked, with links.
Update `_agent/IN_FLIGHT.md` (remove finished rows). Then:
- **Checkpoint mode:** present the summary and ask whether to launch the
  next wave.
- **Continuous mode:** launch the next wave with the next N items,
  unless a stop condition fired.

## Stop conditions

Stop the run (do not start another wave) when any holds:
- Queue empty, or budget (items/waves) reached, or soft hours cap passed.
- Failure rate exceeds a sane threshold (e.g. >½ the wave failed) —
  something systemic is wrong; surface it.
- Repeated merge conflicts on the same files — the queue partition is
  wrong; re-plan.
- An item's ADR is not `Accepted`, or its acceptance criteria are
  ambiguous.

On stop, leave every worktree in a committed or cleanly-abandoned state,
record the outcome in the WORKLOG, and report.
