# 0051 — Verify agent-wave per host; record observed rungs

Owning ADR: adr/0015-multi-target-portability.md (r6 — reopened
Implemented → Accepted on landing, → Implemented on ship; AC5's
"bootstrap plus one lifecycle skill" extends to agent-wave)

## Scope

Operator-run, as the earlier multi-target verification was; it cannot
run from a single host session.

1. **On Claude Cowork, pi, Codex, OpenCode.** Install per README;
   bootstrap a throwaway repo in separate-worktrees mode with a gate
   that needs an install step, to exercise the blocked-at-verify path
   the eval cannot; queue two items; run agent-wave at express depth.
   Record: the selection mechanism used (structured tool or A/B/C);
   the rung derived and whether the host in fact exposes a subagent or
   orchestration facility; whether the executor could sign and push
   the claim commit under that host's permissions; whether the
   pull-request CLI exists; the branches and blocks produced; whether
   non-SKILL files in skill directories are tolerated on the npm path
   and the symlinked discovery.
2. **On Claude Code.** One rung-1 run under a real opt-in and one
   rung-2 run with the subagent tool's worktree isolation, in a session
   without bypassed permissions, recording whether executors could
   commit and push without per-agent prompts.
3. **README.** Replace every "assumed, verify" row with the observed
   row; 0015 r6 records the runs.

Out of scope:
- Fixing what the runs find; each finding becomes its own item.

## Exit criteria

1. Four host rows observed and recorded; the Claude Code rung-1 and
   rung-2 runs recorded. → AC5 (extended)
2. README rows carry no "assumed, verify" marker.
3. ADR 0015 r6 row present; INDEX regenerated; verify gate green.

When this ships, ADR 0015 returns to Implemented (r6).

## Dependencies

- Plan 0049 (the skill under test) — sequential; plan 0050 may run in
  parallel with the host runs.
