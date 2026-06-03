# 0009 — Multi-target install docs + support matrix

Owning ADR: adr/0015-multi-target-portability.md

## Scope

Document install + invocation for all five targets and add a support
matrix, in `README.md` (primary), `USAGE.md`, and the site.

- `README.md` §Install — sections for Claude Code, **Claude Cowork**, pi,
  **Codex**, **OpenCode**, plus a support matrix (output / skills /
  install / invocation per agent).
- Note the shared-directory shortcuts (`~/.agents/skills` → Codex +
  OpenCode; `~/.claude/skills` → Claude Code + OpenCode; Cowork = the
  Claude Code plugin).
- `USAGE.md` / site — a short pointer to the matrix.

## Exit criteria

Maps to adr/0015-multi-target-portability.md acceptance criteria:

1. README + site document install + invocation for the five targets with
   a support matrix. → AC1
2. Cowork documented as the existing Claude Code plugin. → AC3
3. Codex (`.agents/skills/`) + OpenCode (`.opencode/skills/` /
   auto-discovery) install paths documented. → AC4
4. `node scripts/verify.mjs` stays green (agent-neutral, en-GB, no
   leakage).

## Dependencies

Independent of 0010 (verification).
