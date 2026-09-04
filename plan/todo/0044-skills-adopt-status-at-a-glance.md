# 0044 — Skills adopt Status at a glance; gate and eval enforcement

Owning ADR: adr/0042-skills-end-every-run-with-status-at-a-glance.md

## Scope

1. **Nine closing steps.** `bootstrap`, `new-adr`, `new-plan`,
   `ship-item`, `add-convention`, `audit`, `brainstorm`, `agent-wave`,
   `rollup`: the final step of each carries one canonical instruction
   (identical wording) to end the final message with the block, plus
   the per-skill bullet contents: This run (files written/moved/
   committed, gate line and exit code, skipped or refused steps with
   reason), Overall (vocabulary; audit's verdict line feeds it), Yet to
   do (Proposed ADR awaiting acceptance, unauthorised item, unpushed
   commit, migration offered not taken, eval not run). Agent-neutral,
   no ADR identifiers.
2. **Static gate.** `scripts/verify.mjs` section B fails when a
   SKILL.md lacks the canonical instruction or carries a variant. Ships
   with the nine repairs it surfaces in one commit, reason named
   (gate-integrity exception: stricter check plus its repairs).
3. **Behavioural evals.** `evals/behavioural.workflow.mjs` VERDICT gains
   a required field for the block's presence in the subagent's final
   report; each case prompt requires the block; a report without it
   fails. Own commit, reason named.
4. **Docs.** `USAGE.md` states every skill ends with the block and what
   each bullet contains.

Out of scope:
- The convention text and scaffold placement (plan 0043).
- Persisted reports (plan 0045).

## Exit criteria

Maps to adr/0042-skills-end-every-run-with-status-at-a-glance.md
acceptance criteria:

1. Canonical instruction present and identical in all nine skills.
   → AC1
2. Per-skill bullet contents specified; audit's verdict feeds Overall.
   → AC2
3. Reporting instruction agent-neutral, no ADR identifiers (privacy
   scan clean). → AC3
4. verify.mjs fails on a missing or variant instruction; mutation-
   tested. → AC4
5. Eval verdict requires the block; a block-less report fails. → AC5
6. Gate and eval changes in their own commits with the reason named.
   → AC6
7. USAGE updated. → AC7
8. Verify gate green; five-target parity preserved.

When this ships, ADR 0042 advances Accepted → Implemented.

## Dependencies

- Plan 0043 (the convention the skills adopt).
- Edits every SKILL.md; runs after any coordination item still
  touching the same skills.
