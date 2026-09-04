# 0041 — Plan-item status section: retire the snapshot

Owning ADR: adr/0039-plan-item-carries-its-own-status.md

## Scope

1. **Plan convention.** `templates/plan-README.md` and this repo's
   `plan/README.md` define the `## Status` section (Claimed by,
   Blockers, Stopped) on every queued item; `new-plan` Step 3 writes
   it empty; `ship-item` Step 5 removes it on the move to `plan/done/`.
2. **Run prompt template.** Step 3 "Claim" fills Claimed by; the stop
   path writes Stopped (date, reason), commits, surfaces — replacing
   "record the reason in `_agent/CURRENT_FOCUS.md`". Step 8 drops the
   snapshot update. `agent-wave`'s brief says the same.
3. **bootstrap.** No `_agent-CURRENT_FOCUS.md` template; no mode-3
   `.gitignore` entry; Q5 text loses "CURRENT_FOCUS handling"; the
   AGENTS "Picking up this repo" section answers active item (status
   section with a live claim, else lowest number), uncommitted work
   (`git status`), last shipped (`plan/done/`), next item (queue
   order).
4. **Audit.** Flag a Claimed by whose branch is gone as stale; list
   every todo item with a Stopped entry under "needs a human".
5. **Docs.** `USAGE.md` states where unqueued candidates live
   (brainstorm conversation → new-adr / new-plan; never a status
   file); `README.md`, `docs/methodology.md`, `docs/examples.md` drop
   the snapshot from every listing.

Out of scope:
- Adding the section to this repo's existing open items and removing
  this repo's snapshot — plan 0042 migrates this repo.

## Exit criteria

Maps to adr/0039-plan-item-carries-its-own-status.md acceptance
criteria:

1. new-plan writes the section; plan README(s) document it. → AC1
2. Prompt fills Claimed by on start and Stopped on a stop; agent-wave
   brief matches. → AC2
3. ship-item removes the section on move. → AC3
4. Bootstrap writes no snapshot or gitignore entry; AGENTS read order
   answers the four former snapshot fields. → AC4
5. Audit flags stale claims and lists stopped items. → AC5
6. No scaffolded file holds unqueued candidates; USAGE says where they
   live. → AC6
7. Docs updated. → AC7
8. Verify gate green; skill parity preserved.

When this ships, ADR 0039 advances Accepted → Implemented.

## Dependencies

- Plans 0038, 0039, 0040 (shared edits to ship-item, the prompt
  template, bootstrap, and audit) — sequential.
