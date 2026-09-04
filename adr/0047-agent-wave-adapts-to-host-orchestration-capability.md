---
adr: 0047
title: agent-wave adapts to the orchestration capability the host exposes
status: Proposed
date: 2026-09-04
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0006", "0007", "0013", "0014", "0015", "0031", "0036", "0038", "0044", "0045"]
tags: [agent-wave, multi-target, orchestration, skills]
---

# ADR 0047 — agent-wave adapts to the orchestration capability the host exposes

## Context

agent-wave describes how it spawns in one host-flavoured sentence —
subagents "each in an isolated worktree" with a named isolation flag —
and points long runs at a host scheduling command. Both are Claude
Code forms in a body that the parity rule
(adr/0015-multi-target-portability.md) requires to stay
agent-neutral; the static gate does not catch them because it matches
only invocation forms of docflow's own skills. No fallback exists for
a host without subagents, worktrees, or a scheduler, and the repo
documents no such facility for any host but Claude Code.

Meanwhile the Claude Code host has grown an orchestration facility:
a workflow tool that fans out subagents, isolates each in a worktree,
forces schema-shaped results, meters a token budget, and resumes a run
from a journal. The main-loop agent sees it; subagents spawned inside
it do not. Its own rule is that the user must have opted in — through
a keyword, a session mode, their own words, or a skill whose
instructions call for it. A skill that names the tool would work on
one host, break parity on four, and rot as the tool's API moves. A
skill that ignores it leaves the best mechanism unused on the host
most operators run.

The skill's mode gating also contradicts itself: it admits the
shared-checkout mode and then gives every subagent a worktree, and it
checks nothing about the remote or the base before spawning.

## Capability statement

agent-wave keeps one agent-neutral body and executes the wave
specification (adr/0045-wave-specification-contract.md) on a
**capability ladder** it derives before executing. In capability
vocabulary only, the skill establishes whether the host can delegate
an item to a subagent; run it in an isolated checkout; run several at
once; expose an orchestration facility that the operator has
**already enabled** through the host's own signal; and force a shaped
result. The rungs:

1. **The enabled facility** — one fan-out per wave; no wave loop, clock
   check, or operator question inside it, because a host script has
   none and subagents inside it cannot start the next wave.
2. **Plain subagents** — parallel where the host allows, otherwise one
   after another; each creates its own worktree from the base, and
   host-provided isolation is used only when the session's head equals
   the base.
3. **The orchestrator itself**, one item at a time — in a worktree cut
   from the base in separate-worktrees mode; in the shared tree under
   the lock ledger in shared-checkout mode.

The skill's prose never instructs a call to a host facility, so the
host's "a skill told me to" opt-in is never triggered by docflow; the
signals that count are the operator's, and README and USAGE name
them for each host. The rung is a **derived, downgrade-only line** in
the pre-execution confirmation — "Execution: rung N — reason" — which
the operator may lower and never raise; the skill never asks for a
facility to be enabled; at express depth the derived rung applies.

**Mode mapping**, keyed on writers: a **single-writer** repository is
refused at every width, including one, because a delegate writing in a
second checkout is a second writer and a one-checkout wave is the run
prompt. A **shared checkout** runs width one, sequentially, in the
shared tree under the lock ledger, with the item's Claimed-by field as
the claim and no branch created or switched; a shared checkout with
pull-request integration is refused with the reason that no claim
form exists for that pairing. **Separate worktrees** admits the
parallel rungs.

**Preconditions**, checked before any parameter question: the
repository is bootstrapped with a queue and a run prompt; a remote is
reachable and carries the integration branch; the local integration
branch is compared with its remote — ahead is reported with the offer
to push first or run at rung three in this checkout, behind and clean
is fast-forwarded; the base is the remote tip after a fetch and is
printed, so an empty remote queue is explained. After the operator has
confirmed the parameters, in separate-worktrees mode the detached
integration worktree
(adr/0046-serialised-integration-under-direct-to-main.md) is created,
and its first gate run is the **probe** that the recorded gate runs
from a fresh checkout of the base — tracked files only, secrets from
the environment. A failed probe stops the run before anything is
spawned and offers to make the gate self-contained or to run at rung
three; bootstrap's gate question states the fresh-clone requirement.
In separate-worktrees mode the operator's checkout is never read for
wave state, never used to run the gate, and never modified, except
that a clean checkout on the integration branch is fast-forwarded
after the wave.

Width is recommended as the minimum of queue depth, three, and the
host's concurrency ceiling; the effective width is reported with the
reason for any difference; it is one at rung three and in a shared
checkout. The wave block reports the effective hooks path and the
origin of the signing setting, since a claim blocked at its first
commit is usually one of those.

Consequences: the scheduler pointer and the isolation flag leave the
body; README gains a per-host execution table whose Claude Code rows
are written as observed and whose other rows are marked assumed until
verified; nothing shipped encodes a host API; parity is proven at
rung three, the path every host shares.

## User stories / scenarios

- As an operator on Claude Code who has enabled the orchestration
  facility for the session, agent-wave uses it for the fan-out
  without my being asked twice.
- As an operator who has not enabled it, agent-wave uses plain
  subagents and never asks me to switch anything on.
- As an operator on a host with no subagents, agent-wave runs the
  wave itself, one item at a time, with the same briefs and results.
- As a maintainer, the skill body names no tool, flag, or keyword, and
  the gate would fail it if it did.
- As an operator with unpushed work on the integration branch, I am
  told so before a wave computes a base I did not expect.

## Acceptance criteria

1. Step 0 establishes the five capabilities in capability vocabulary
   and derives the rung; the skill body names no host tool, flag,
   command, or opt-in keyword.
2. Rung one is used only when the host's own signal has already
   enabled the facility; one fan-out per wave; the skill never
   solicits enablement; the rung line is downgrade-only; express
   applies the derived rung.
3. The mode mapping is as stated, including the refusal of
   single-writer repositories at every width and of shared checkout
   with pull-request integration.
4. The preconditions are checked before any parameter question: a
   reachable remote with the integration branch, the ahead-or-behind
   report with its offers, and the printed base; the probe runs in the
   integration worktree after confirmation, and a failed probe stops
   the run before anything is spawned.
5. In separate-worktrees mode the operator's checkout is never read,
   gated, or modified beyond the post-wave fast-forward.
6. The width rule and the effective-width report are as stated.
7. README and USAGE carry the per-host execution table with Claude
   Code rows as observed and other rows marked assumed; the skill body
   passes the host-token check of
   adr/0049-skill-directories-carry-declarative-host-interface-files-only.md.
8. The skill directory holds SKILL.md and declared sidecars only, and
   the static gate and five-target parity are unchanged.

## Out of scope

- The specification — adr/0045-wave-specification-contract.md.
- Integration mechanics — adr/0046-serialised-integration-under-direct-to-main.md.
- Classification and resume — adr/0048-wave-resumes-by-replanning-from-git.md.
- Sidecar files and the gate — adr/0049-skill-directories-carry-declarative-host-interface-files-only.md.
- The recorded per-host observations — a revision of
  adr/0015-multi-target-portability.md when the runs are made.

## Open questions

- If an autonomy ladder is ever recorded on this line, the mapping
  would be: checkpoint mode is the named-item level, continuous mode
  the self-serve level, unattended initiation of a wave the top level
  within a recorded budget. Until then the grant line stands alone.

## References

- adr/0006-integration-model.md
- adr/0007-lifecycle-skills.md
- adr/0013-interactive-assessment-protocol.md
- adr/0014-concurrency-guardrails.md
- adr/0015-multi-target-portability.md
- adr/0031-tiered-assessment-depth.md
- adr/0036-coordination-directory-holds-only-what-git-cannot-tell-you.md
- adr/0038-in-flight-state-derived-from-branches-and-pull-requests.md
- adr/0044-development-returns-to-main.md
- adr/0045-wave-specification-contract.md
- adr/0046-serialised-integration-under-direct-to-main.md
- adr/0048-wave-resumes-by-replanning-from-git.md
- adr/0049-skill-directories-carry-declarative-host-interface-files-only.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-09-04 | r1 | Eugenio Minardi | Initial draft (Proposed), from the approved two-round brainstorm: the three-rung capability ladder derived in capability vocabulary, never solicited; writer-keyed mode mapping with the two refusals; remote, base, ahead-or-behind, and probe preconditions; the operator's checkout left alone. A runner question, a planner-only skill, a separate run-wave skill, width-one waves for single writers, a clean-checkout precondition, and coupling to the host tool considered and rejected. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
