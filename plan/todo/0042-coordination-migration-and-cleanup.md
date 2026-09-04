# 0042 — Coordination migration and clean-up; consistency repairs

Owning ADR: adr/0040-coordination-directory-migration.md
Also repairs: adr/0017-configurable-artifact-root.md (`_agent/` paths
never resolved against the artefact root — defect, revision row, no
reopen)

## Scope

1. **Recognition.** Audit detects the legacy coordination layout
   (worklog file/dir, dashboard, snapshot, hand-off, mode-3 lock
   ledger, union-merge attribute, snapshot gitignore entry) and
   reports one non-failing "migration available" finding; legacy
   hygiene checks keep applying until migrated.
2. **Clean-up offer (independent of migration).** Audit lists stale
   content with evidence — dashboard rows without a live branch/PR/
   worktree, lock claims without a pending change, snapshot statements
   git contradicts — and removes only what is confirmed.
3. **Migration procedure** (audit fix step + bootstrap existing-repo
   path): dry-run listing → confirmation → remove worklog, dashboard,
   snapshot, hand-off; remove union attribute and gitignore entry;
   remove ROLES in single-writer mode and LOCKS in worktree mode; add
   the status section to open queue items, carrying over any live
   claim or blocker; write the AGENTS "Picking up this repo" section;
   rewrite the coordination sections of AGENTS and CONVENTIONS;
   regenerate the run prompt from recorded answers; one commit listing
   every file removed/moved and where its content now lives; post-
   migration audit clean.
4. **Artefact-root repair (ADR 0017).** Every `_agent/` path in the
   templates, `ship-item`, `audit`, `agent-wave`, and `new-adr`
   resolves against the recorded artefact root, like `adr/`, `plan/`,
   and `INDEX.md`; ship-item's Step 0 lists `_agent/` among the
   resolved paths. ADR 0017 gets a revision row naming the repair.
5. **Remaining doc drift.** `docs/methodology.md` artefacts table
   marks `_agent/` and `plan/` optional; `docs/examples.md` tree and
   mode-3 paragraph match the new per-mode set; `USAGE.md` Q5 row
   vocabulary matches the assessment; `README.md` structure list
   matches `templates/AGENTS.md`.
6. **Eval.** A fixture built from a legacy layout (mode-3 shape: a
   worklog with rows, a dashboard with one stale and one live row, a
   snapshot contradicting git, a hand-off, union attribute, gitignore
   entry) exercises recognition, the clean-up offer, the migration,
   and the post-migration audit. **Ships in its own commit** before
   the dogfood migration below, per the gate-integrity rule.
7. **Dogfood.** This repository migrates through the offered
   procedure: `_agent/WORKLOG.md`, `_agent/CURRENT_FOCUS.md`,
   `_agent/HANDOFF.md`, `_agent/ROLES.md` removed (single writer with
   a gate keeps `_agent/prompts/autonomous.md` only); open items gain
   the status section; `AGENTS.md` gains the read-order section and
   its coordination section is rewritten; the prompt regenerated; one
   commit naming where each file's content lives.

Out of scope:
- Federation-wide propagation (ADR 0027 applies unchanged).

## Exit criteria

Maps to adr/0040-coordination-directory-migration.md acceptance
criteria:

1. Legacy layout recognised from any marker; one non-failing finding.
   → AC1
2. Legacy hygiene checks apply until migrated. → AC2
3. Clean-up offered independently, evidence per item, confirmation
   per removal. → AC3
4. Audit fix step and bootstrap both offer migration with a dry-run
   listing and confirmation. → AC4
5. Migration removes the listed files, attribute, entry, and
   mode-inappropriate ROLES/LOCKS. → AC5
6. Status sections added; live claims and blockers carried over. → AC6
7. AGENTS section written; AGENTS/CONVENTIONS rewritten; prompt
   regenerated. → AC7
8. One migration commit listing every removal/move and destination.
   → AC8
9. Post-migration audit clean with no manual edit. → AC9
10. Eval fixture covers recognition, clean-up, migration, post-audit.
    → AC10
11. `_agent/` paths resolve against the artefact root everywhere; ADR
    0017 revision row present.
12. This repository migrated (item 7); verify gate green.

When this ships, ADR 0040 advances Accepted → Implemented.

## Dependencies

- Plans 0038–0041 (the target state this migrates to). Items 5 and 6
  (doc drift, eval fixture) may proceed alongside plan 0041; item 7
  only after 0041 ships.
