---
adr: 0061
title: V1 workspace host guide set — seven native guides
status: Accepted
date: 2026-09-19
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0053", "0059"]
tags: [workspace, guides, v1]
---

# ADR 0061 — V1 workspace host guide set — seven native guides

## Context

The six native workspace guides shipped by adr/0053-portable-workspace-operating-skills.md
(Orca, Cursor, Claude Code, DeepSeek Harness, ZCode, Codex App) named a host
set that the operator mandate of 2026-09-19 replaced. ZCode is removed; Herdr
and VS Code agent mode are added. The guide set is documentation of existing
host commands and UI, not a launcher or scheduler, and it is deliberately
distinct from the eight package installation targets. adr/0053 is already
superseded by adr/0059-five-workspace-commands-and-mandate-note.md; this ADR
replaces the guide list itself and leaves the five-command decision of adr/0059
in force.

## Capability statement

Seven versioned native guides accompany the workspace commands: **Claude
Code**, **Codex App**, **Cursor**, **DeepSeek harness**, **Herdr**, **VS Code
agent mode** and **Orca**. Each records installed-tool or official
primary-source evidence for its entry points and a bounded brief/receipt
smoke procedure whose native execution is tracked separately. The Herdr guide
maps `workspace-dispatch`/`workspace-sync` onto `herdr agent prompt/read/wait`,
one agent per tab named `<repo>-<goal>`, and `herdr pane move --new-tab`. The
VS Code agent mode guide records the Copilot instruction and skill discovery
paths and the explicit brief-as-context handoff. ZCode is removed.

## User stories / scenarios

- As a Herdr user, I want to dispatch a brief to an agent in another tab and
  reconcile its receipt without leaving Herdr.
- As a VS Code agent-mode user, I want the workspace brief opened as explicit
  context with the member's own instructions preserved.
- As an operator, I want the guide set to name only hosts I actually use, and
  to know which guide has been smoked and which is unrun.

## Acceptance criteria

1. The V1 workspace host guide set is exactly Claude Code, Codex App, Cursor,
   DeepSeek harness, Herdr, VS Code agent mode and Orca; ZCode is removed and
   Herdr and VS Code agent mode are present.
2. Each guide names entry-point evidence and a bounded brief/receipt smoke
   procedure, and marks its native smoke run or unrun honestly.
3. The Herdr guide maps `workspace-dispatch`/`workspace-sync` onto
   `herdr agent prompt/read/wait`, uses one agent per tab named
   `<repo>-<goal>`, and documents `herdr pane move --new-tab`.
4. The VS Code agent mode guide records the instruction/skill discovery paths
   and the explicit brief-as-context handoff.
5. `README.md`, `USAGE.md`, `docs/` and the workspace asset README name seven
   guides as distinct from the eight package installation targets.
6. Native smoke execution for the new guides is tracked separately and is not
   claimed by this ADR.

## Out of scope

- Native smoke runs for Herdr and VS Code agent mode; they belong to the
  separate final qualification round.
- Any change to the five workspace commands, the workspace contract or the
  native member methods.

## Open questions

None.

## References

- adr/0053-portable-workspace-operating-skills.md (superseded; original six-guide set)
- adr/0059-five-workspace-commands-and-mandate-note.md (five-command decision, unchanged)
- Operator mandate note,
  `.docflow_workspace/mandates/2026-09-19-v1-targets-guides-and-docs.md`
  at revision `9cb44c413f8b3e2818e8890e8546d5e8029f2e06`.
- Workspace decision `v1-targets-and-host-guides--4e62199cc541`.

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-09-19 | r1 | Eugenio Minardi | Initial decision: the seven-guide V1 host set; ZCode removed, Herdr and VS Code agent mode added; the five-command decision of adr/0059 is unchanged. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Operator | Eugenio Minardi | 2026-09-19 | operator mandate note 9cb44c4 |
