# 0010 — Verify docflow on Codex, OpenCode, and Cowork

Owning ADR: adr/0015-multi-target-portability.md

## Scope

Behavioural verification on the three new targets — turns "compatible by
format" into "verified working." Requires a machine with each agent
installed (cannot be run from a Claude Code session).

For each of Codex, OpenCode, Cowork:
1. Install docflow's skills per the documented path.
2. Run `bootstrap` on a throwaway repo with scripted answers (the
   assessment falls back to plain text where there is no select tool).
3. Run one lifecycle skill (e.g. `new-adr`) and confirm the output
   (contiguous number, INDEX, expected files).
4. Record the result.

## Exit criteria

Maps to adr/0015-multi-target-portability.md acceptance criteria:

1. `bootstrap` + one lifecycle skill run successfully on Codex,
   OpenCode, and Cowork; results recorded. → AC5

When this ships, ADR 0015 advances Accepted → Implemented.

## Dependencies

Independent of 0009. **Blocked** on access to Codex / OpenCode / Cowork
installs (operator-run, not runnable from this environment).
