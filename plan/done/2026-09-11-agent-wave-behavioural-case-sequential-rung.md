# 0050 — agent-wave behavioural case at the sequential rung

Owning ADR: adr/0012-skill-behavioural-evals.md (r5). This item verifies
the sequential wave; the broader release matrix remains under plan 0051.

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
extended by r5:

1. The agent-wave case exists with the fixture, parameters, and PASS
   criterion above; the second case asserts exclusion. → AC2 (extended)
2. The case runs green on a source-pinned snapshot through an actual
   vendor host or the opt-in workflow runner. → AC3 / AC4 as recorded
3. Fixture commit separate, reason named; verify gate green.

ADR 0012 remains Accepted pending plan 0051's remaining release evidence.

## Dependencies

- Plan 0044 (verdict field) and plan 0049 (the skill under test) —
  sequential.

## Verification method

The approved vendor-host alternative exercises the sequential wave and live
third-claim exclusion together in `evals/hosts/wave-fixture.py`. Independent
file/Git assertions and three final report blocks determine the verdict.
Unsigned local fixture commits are isolated from this repo's signed contract.
Delegation rungs and the wider release matrix remain under plan 0051.

## Recorded evidence

The latest actual Claude Code Docker run passed the shared fixture with
plan items 0007/0008 owning ADRs 0001/0002; the live 0009 claim was excluded
and preserved. External assertions verified claim metadata, completion
footers, INDEX/ADR status, outputs, remote state and cleanup. Three exact
report blocks passed independently. The same fixture is now exposed by the
opt-in workflow. Its wrapper syntax was checked; execution of that native
driver remains unobserved and belongs to the host matrix in plan 0051.

The operator-approved vendor-host method replaces model-authored fixture
setup with a deterministic fixture, combines the success and held-claim
scenarios, and verifies fidelity outside the model. Historical failures
remain in the receipts. ADR 0012 remains Accepted because the wider
behavioural release matrix is still pending under plan 0051.

Shipped at HEAD `576851598dd533740501d39ac2d6ecbe1f03350a` via [PR #5](https://github.com/EvolveHQ/docflow/pull/5). Prepared on the PR branch; effective only on the required-checks-passing merge into main.
