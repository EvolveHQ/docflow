# 0050 — agent-wave behavioural case at the sequential rung

Owning ADR: adr/0012-skill-behavioural-evals.md (r4 — reopened
Implemented → Accepted on landing, → Implemented on ship; AC2's list
extends to agent-wave)

## Scope

1. **Fixture.** In its own commit with the reason named per the
   gate-integrity convention: `evals/behavioural.workflow.mjs` gains
   case `agent-wave`, plus assertion helpers in `evals/assertions.mjs`.
   The runner's worktree subagent builds a scratch repo in a temp
   subdirectory with a local bare `file://` remote and
   `commit.gpgsign=false` locally; commits a self-contained scratch
   gate (node built-ins only, runnable from a fresh worktree and from
   a detached integration worktree) and records it as the Q8 command;
   bootstraps at full depth with scripted answers — separate
   worktrees, direct-to-main, the cross-check confirmed — authors two
   Accepted ADRs and two plan items carrying Status sections (plan
   numbers independent of ADR numbers), pushes to the scratch remote
   only; then runs agent-wave at express depth "treating this host as
   having no subagent facility": width 2 requested, budget two items,
   supervision continuous, so the rung-3 wave at effective width 1
   ships both items without a question and reports "requested 2,
   effective 1, reason: rung 3".
2. **PASS criterion.** After the wave, on the scratch repo and its
   remote: no `claim/*` branch survives; the integration branch's
   first-parent history carries, for each item, a claim commit naming
   the branch and reserved block ("none" when it authored nothing)
   followed by a completion commit naming item and ADR; both items sit
   in plan/done with footers naming a SHA on the integration branch's
   first-parent history and the claim branch, and carry no Status
   section; both ADRs read Implemented with the index agreeing under
   the scratch gate's fidelity check; numbering contiguous; the scratch
   gate passes on the remote's tip; `git worktree list` shows only the
   primary checkout; the report carries two per-item blocks, one wave
   block, and the closing block via the verdict field plan 0044 adds.
3. **Second case.** A pre-pushed `claim/<third-item-key>` carrying a
   claim commit; assert that item is not attempted and appears under
   Yet to do as an excluded live claim.
4. **Recorded limits.** The blocked-at-verify path (a gate needing an
   install step) is not exercised here — docflow's gate is
   self-contained — and is recorded as untested; rungs 1 and 2 stay
   manually verified in plan 0051. `evals/README.md` status updated.

Out of scope:
- Any change to skills or templates (plans 0047–0049).

## Exit criteria

Maps to adr/0012-skill-behavioural-evals.md acceptance criteria as
extended by r4:

1. The agent-wave case exists with the fixture, parameters, and PASS
   criterion above; the second case asserts exclusion. → AC2 (extended)
2. The case runs green on committed skills through the workflow
   runner. → AC3 / AC4 as recorded
3. Fixture commit separate, reason named; verify gate green.

When this ships, ADR 0012 returns to Implemented (r4).

## Dependencies

- Plan 0044 (verdict field) and plan 0049 (the skill under test) —
  sequential.
