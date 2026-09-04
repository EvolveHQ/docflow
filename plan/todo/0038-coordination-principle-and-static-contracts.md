# 0038 — Coordination directory: principle, per-mode file set, static contracts

Owning ADR: adr/0036-coordination-directory-holds-only-what-git-cannot-tell-you.md

## Scope

Make `_agent/` the agent operating contract and nothing else:

1. **Bootstrap.** Q5 becomes three writer-keyed answers — single
   writer (replacing "none" and "single agent"), shared checkout,
   separate worktrees. Step 5 writes per mode: single writer →
   `_agent/prompts/autonomous.md` iff Q8 recorded a gate, else no
   `_agent/`; shared checkout → `ROLES.md`, `LOCKS.md`, prompt iff
   gate; separate worktrees → `ROLES.md`, prompt iff gate. No
   worklog, snapshot, dashboard, hand-off, `.gitattributes` union
   entry, or `.gitignore` entry in any mode. The layout tree, Step 3
   "conventions to install" item 9, the express/guided profiles, and
   the Step 4.5 cross-checks follow (the "no `_agent/` + gate"
   contradiction disappears with the merged answer).
2. **Templates.** `_agent-HANDOFF.md` retired: its read order becomes
   a "Picking up this repo" section in `templates/AGENTS.md`,
   generated from the recorded root, layers, and mode (never naming an
   absent file); its stop conditions move into
   `_agent-prompts-autonomous.md`, whose orient step points at the
   AGENTS section instead of restating the list. `_agent-ROLES.md`
   and `_agent-LOCKS.md` gain a header naming what they are
   authoritative for; the mode-3 advisory LOCKS variant is deleted.
   `templates/AGENTS.md` and `templates/CONVENTIONS.md` coordination
   sections and structure lines rewritten per mode with one shared
   purpose line for `_agent/`.
3. **Skills.** `agent-wave`, `ship-item`, `new-adr` reference only
   files the recorded mode prescribes (the worklog/dashboard/snapshot
   steps are removed by plans 0039–0041; this item removes the
   hand-off and roles references and the unguarded statements).
4. **Audit.** Coordination-hygiene check redefined: fail on any
   `_agent/` file the recorded mode does not prescribe, and on any
   `_agent/` file carrying derived state.
5. **Docs.** `README.md`, `USAGE.md`, `docs/methodology.md`,
   `docs/examples.md`: one purpose line, per-mode members, optional
   status; the Q5 table updated.
6. **Evals.** `evals/cases.mjs` and `evals/behavioural.workflow.mjs`
   assert `_agent/ROLES.md` for a full-depth bootstrap; those
   assertions change to the new per-mode set **in their own commit**,
   reason named, per the gate-integrity rule.

Out of scope:
- Where the shipped record, in-flight view, and task status live
  (plans 0039, 0040, 0041).
- Migration of existing repositories, including this one (plan 0042).

## Exit criteria

Maps to adr/0036-coordination-directory-holds-only-what-git-cannot-tell-you.md
acceptance criteria:

1. Bootstrap writes exactly the per-mode set; single writer without a
   gate has no `_agent/`. → AC1
2. Q5 offers three writer-keyed answers; express and guided record
   single writer. → AC2
3. AGENTS "Picking up this repo" section generated per root/layers/
   mode; no hand-off written; prompt points at it; stop conditions only
   in the prompt. → AC3
4. LOCKS in shared checkout only; ROLES in shared checkout and
   separate worktrees only; no derived file or union attribute in any
   mode. → AC4
5. Every `_agent/` file has a purpose header; no "git wins" clause
   remains. → AC5
6. All listings of `_agent/` members agree. → AC6
7. No skill or prompt step writes derived state; agent-wave's stop and
   cleanup name no unprescribed file. → AC7
8. Audit hygiene check fails on unprescribed files and derived
   content. → AC8
9. Eval assertion changes ship in a separate commit; verify gate and
   the full-depth bootstrap eval green.

When this ships, ADR 0036 advances Accepted → Implemented and ADR 0005
stays Superseded.

## Dependencies

None on the queue. Runs after plans 0036 and 0037 (shape-by-field)
by queue order; both also edit `bootstrap/SKILL.md`, so the three are
sequential, not a wave.
