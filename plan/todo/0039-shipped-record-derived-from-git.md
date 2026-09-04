# 0039 — Shipped record derived: retire the worklog

Owning ADR: adr/0037-shipped-record-is-git-and-plan-done.md

## Scope

1. **ship-item.** Step 6 "Record" no longer appends a worklog row;
   Step 7's atomic commit groups the move, status advance, and INDEX;
   the commit message names the plan item and owning ADR(s). The
   `_agent/` presence gate on Step 6 goes with it.
2. **Run prompt template.** Step 8 "Record" drops the worklog line;
   the orient list (now the AGENTS "Picking up this repo" section)
   names the newest `plan/done/` entries and
   `git log --first-parent` instead of a worklog tail.
3. **agent-wave.** Stop path records outcomes in the report and the
   commit, not "the WORKLOG".
4. **bootstrap.** No `_agent-WORKLOG.md` template, no `.gitattributes`
   union entry in mode 3, Q5 text loses "WORKLOG layout" and the
   `_agent/worklog/<agent-id>.md` split; backfill Step 6 wording
   reconstructs `plan/done/` only (ADR 0003's "and the worklog" is a
   consequence — note in its next revision, no reopen).
5. **Audit.** A worklog file or directory is reported as legacy derived
   state, handed to the migration finding (plan 0042).
6. **Docs.** `README.md`, `USAGE.md` (output table, ship description),
   `docs/index.md`, `docs/methodology.md`, `docs/examples.md`.

Out of scope:
- Removing this repository's own `_agent/WORKLOG.md` — plan 0042
  migrates this repo through the offered procedure.

## Exit criteria

Maps to adr/0037-shipped-record-is-git-and-plan-done.md acceptance
criteria:

1. ship-item appends nothing; completion commit names item and
   ADR(s); done footer names the SHA. → AC1
2. Read order names `plan/done/` and first-parent log; no worklog
   reference in any template, skill, or prompt. → AC2
3. Bootstrap writes no worklog or union entry; split option removed.
   → AC3
4. Prompt and agent-wave record in commit, report, and the item's
   status section. → AC4
5. Backfill wording reconstructs `plan/done/` only. → AC5
6. Audit reports a worklog as legacy derived state. → AC6
7. Docs updated. → AC7
8. Verify gate green; skill parity across the five targets preserved.

When this ships, ADR 0037 advances Accepted → Implemented.

## Dependencies

- Plan 0038 (the per-mode file set this removal assumes).
- Shares `ship-item/SKILL.md`, `_agent-prompts-autonomous.md`, and
  `bootstrap/SKILL.md` with plans 0040 and 0041 — sequential.
