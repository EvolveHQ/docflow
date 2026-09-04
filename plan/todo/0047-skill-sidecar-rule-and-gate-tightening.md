# 0047 — Skill-directory sidecar rule; gate scans sidecars and host tokens

Owning ADR: adr/0049-skill-directories-carry-declarative-host-interface-files-only.md
Also revises: adr/0011-static-skill-validation.md (r5, reopened
Implemented → Accepted on landing, → Implemented on ship),
adr/0015-multi-target-portability.md (r5)

## Scope

Two commits, per the gate-integrity convention.

1. **Judged files only.** README layout tree lists `agents/openai.yaml`
   under each skill; the "no templates of their own" rule becomes "no
   templates of their own; declarative host interface files only".
   `CONVENTIONS.md` §Skill Authoring gains the sidecar bullet (SKILL.md
   sufficiency on every target; ships on every path; leak-scanned; no
   ADR identifiers; agrees with the frontmatter; never executable).
   `AGENTS.md` structure bullet mentions them. ADR 0011 r5 and 0015 r5
   rows with Rationale footers; INDEX regenerated.
2. **Tighten and repair**, reason named in the message: `scripts/verify.mjs`
   section D walks `plugins/docflow/skills` (sidecars included) beside
   the existing SKILL.md and template scans; section B adds the
   host-token denylist on skill bodies (`AskUserQuestion`,
   `isolation: worktree`, `/schedule`, `Workflow(`, `ultracode`,
   `$<skill-name>` forms), descriptions exempt; a check that no
   executable script sits under the skills tree. The three true
   positives repaired in the same commit: agent-wave's scheduler
   pointer → "the host's scheduling facility (see the README)", its
   isolation flag → "in its own isolated checkout (a git worktree)",
   bootstrap's question-tool name → "a structured single-select
   question tool"; README/USAGE keep the concrete names.
   `plugins/docflow/skills/agent-wave/agents/openai.yaml` reworded to
   match the frontmatter.

Out of scope:
- Any agent-wave semantics (plan 0049).

## Exit criteria

Maps to adr/0049-skill-directories-carry-declarative-host-interface-files-only.md
acceptance criteria:

1. README tree and CONVENTIONS define the sidecar class. → AC1
2. Executable under the skills tree fails the gate; mutation-tested.
   → AC2
3. Leak scan walks sidecars; a planted reference fails; mutation-
   tested. → AC3
4. Host-token denylist fails on a planted token; the three occurrences
   repaired. → AC4
5. Sidecar descriptions agree with frontmatter; agent-wave's reworded.
   → AC5
6. Stricter checks and repairs in one commit, reason named. → AC6
7. Gate green; five-target parity preserved.

When this ships, ADR 0049 advances Accepted → Implemented; ADR 0011
returns to Implemented (r5).

## Dependencies

None on the chain. Queue order after plan 0045; its one-line repairs
touch `bootstrap/SKILL.md` and `agent-wave/SKILL.md`, which plans
0036–0045 also edit, so it runs after them rather than ahead.
