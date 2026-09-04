---
adr: 0049
title: Skill directories carry SKILL.md plus declarative host interface files only
status: Proposed
date: 2026-09-04
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0004", "0011", "0013", "0015"]
tags: [skills, multi-target, gate, packaging]
---

# ADR 0049 — Skill directories carry SKILL.md plus declarative host interface files only

## Context

Every skill directory already holds a second file beside SKILL.md: a
Codex interface file, `agents/openai.yaml`, present in all nine
directories, mentioned nowhere but the worklog, absent from the
README's layout tree, and contradicting the rule that lifecycle skills
have no files of their own. Those files ship on every packaging path
— the npm package, the Codex plugin, the OpenCode symlink — and are
user-visible, yet the static gate's leak scan never walks the skill
directories, although it already lists their file type as a text
surface. agent-wave's copy still advertises "parallel worktree
subagents".

The question of shipping an orchestration script for agent-wave
sharpened the point. A script that a host's workflow runner executes
would be a Claude-Code-only executable delivered to every install,
pinned to an unversioned host API the gate cannot validate, admissible
only by rewriting the parity rule. The one in-repo precedent for such
a script, the evals workflow, lives outside the plugin for exactly
that reason.

The gate's neutrality check has a matching blind spot: it matches only
slash-invocation forms of docflow's own skill names, so a host tool
name, an isolation flag, a scheduler command, or an opt-in keyword in
a skill body passes. Three such occurrences exist today, two in
agent-wave and one in bootstrap.

## Capability statement

The skill surface is **SKILL.md, which alone must suffice on every
target**, plus **declarative, non-executable host interface files**
that a host reads to register or describe the skill. Such a sidecar
ships unchanged on every packaging path; is a user-visible surface the
gate leak-scans; carries no ADR identifier and no agent-specific form
beyond what the host format itself requires; and describes the skill
in agreement with the SKILL.md frontmatter. **No executable
orchestration script ships in the plugin.** A host script for a wave
is authored at run time from the wave specification; the only place a
host-script shape lives is the evals, outside the plugin.

The static gate enforces both halves. Its leak scan walks the whole
skills tree, sidecars included. Its neutrality check gains a
**host-token denylist** on skill bodies — the host's question tool
name, the isolation flag, the scheduler command, the workflow tool
call, the opt-in keyword, and the dollar-prefixed invocation form —
applied to bodies only, since descriptions stay exempt. The three
occurrences present today are repaired in the same tightening commit,
as the gate-integrity convention allows. README's layout tree and the
skill-authoring conventions document the sidecar class.

## User stories / scenarios

- As a maintainer, I know what may sit beside SKILL.md and what may
  not, and the gate tells me when I get it wrong.
- As a user on any host, the skill directory I install contains
  nothing that works on one host and rots on the others.
- As an author, a host tool name in a skill body fails the gate before
  it ships, and README is where it belongs.
- As a reader of the Codex interface file, its description matches the
  skill it describes.

## Acceptance criteria

1. README's layout tree lists the Codex interface file under each
   skill, and the skill-authoring conventions define the sidecar
   class: declarative, non-executable, shipped on every path,
   leak-scanned, free of ADR identifiers, in agreement with the
   frontmatter.
2. No executable script exists under the plugin's skills tree, and the
   gate fails when one is added.
3. The gate's leak scan walks every file under the skills tree,
   sidecars included, and a planted ADR reference in a sidecar fails
   it.
4. The gate fails on any listed host token in a skill body, and a
   planted token fails it; the three occurrences present today are
   repaired in the tightening commit.
5. Each sidecar's description agrees with its SKILL.md frontmatter
   description; agent-wave's is reworded.
6. The stricter checks and their repairs ship in one commit with the
   reason named, per the gate-integrity convention.

## Out of scope

- The content of agent-wave itself —
  adr/0047-agent-wave-adapts-to-host-orchestration-capability.md.
- Whether every host tolerates non-SKILL files in a skill directory —
  observed for Codex, recorded for the others by the per-host
  verification revision of adr/0015-multi-target-portability.md.

## Open questions

- Whether the npm packaging path and the OpenCode symlinked discovery
  tolerate non-SKILL files as the Codex install does. Recorded by the
  per-host verification.

## References

- adr/0004-adr-privacy.md
- adr/0011-static-skill-validation.md
- adr/0013-interactive-assessment-protocol.md
- adr/0015-multi-target-portability.md
- adr/0047-agent-wave-adapts-to-host-orchestration-capability.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-09-04 | r1 | Eugenio Minardi | Initial draft (Proposed), from the approved two-round brainstorm: the sidecar class regularised, no shipped orchestration script, the gate extended to scan sidecars and to reject host tokens in skill bodies with today's three occurrences repaired. A shipped workflow script, a runner subdirectory, undocumented sidecars, and a shared code module considered and rejected. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
