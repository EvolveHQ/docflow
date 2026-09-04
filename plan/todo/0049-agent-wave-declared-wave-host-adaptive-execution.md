# 0049 — agent-wave: declared wave, host-adaptive execution, resume from git

Owning ADRs: adr/0045-wave-specification-contract.md,
adr/0047-agent-wave-adapts-to-host-orchestration-capability.md,
adr/0048-wave-resumes-by-replanning-from-git.md
Also revises: adr/0010-worktree-conflict-reconciliation.md (r5 —
reservation default: one number per kind per authoring item, queue
order, per sequence and shape-aware in a legacy range catalogue,
"capability range full" stop, plan slots by the never-reuse rule,
"before executing the wave, at every rung"), adr/0013-interactive-assessment-protocol.md
(r3 — cross-reference to the depth selector; AC7: derived downgrade-only
execution line; the continue question as a third high-impact
parameter), adr/0007-lifecycle-skills.md (r2, agent-wave line),
adr/0043-persisted-reports-carry-status-at-a-glance.md (r2 — a
structured field admitted; the wave block's shape: one block per item
plus a wave block reporting base, rung, effective width, probe line,
limits reached, claims withdrawn, renumberings; an orchestrator-written
block with Overall unknown for a missing report), adr/0001-adr-driven-workflow.md
(r2, defect row — plan numbers never reused; the `# NNNN — ` title
survives the move; audit fails a reused or unnumbered queue number)

## Scope

1. **agent-wave rewrite** on the post-0045 text (artefact root per
   plan 0042). Frontmatter description keeps its trigger phrases and
   replaces "Spawns isolated worktree subagents". Honest scope keeps
   the hours cap as ADR 0045 defines it and points at "the host's
   scheduling facility". Step 0: mode mapping (single writer refused at
   every width; shared checkout width 1 in the shared tree with
   Claimed by and lock rows, refused with pull-request integration;
   separate worktrees); remote and integration-branch check;
   ahead/behind report with push-first or rung-3 offer; base printed;
   capability probe in capability vocabulary and the derived rung.
   Step 0.5 unchanged except the third high-impact parameter. Step 1:
   width min(queue depth, 3, ceiling), the downgrade-only "Execution:
   rung N — reason" line, effective width reported; the confirmation
   precedes the integration worktree and the gate probe. Step 2:
   collect-then-plan (six classes; live claims excluded; continue at
   guided/full or invocation-named; first N eligible by item key;
   single writer per artefact with the index exempt; reservation per
   ADR 0010 r5; shape declared or item dropped; the dashboard write
   deleted). Step 3 splits into "Declare the wave" (every field, the
   grant line, the canonical brief, the result fields) and "Execute
   per host capability" (rung paragraphs; the isolation flag removed;
   executors cut their own worktrees from the base). Step 4 normalises
   results, returns per-item blocks plus the wave block, invokes
   ship-item's integrating mode per ready item in queue order from the
   integration worktree, asks (checkpoint) or re-collects and re-plans
   in the orchestrator's own turn (continuous) with the clock read
   between waves; stop conditions extended; the stop path names no
   file and lists everything under Yet to do; the closing step carries
   plan 0044's instruction verbatim; the brief's prohibitions stated.
2. **audit.** Check 3 gains the plan-number reuse and unnumbered-title
   checks; the stale rule reads as ADR 0048 AC8; the in-flight
   derivation treats a detached worktree as neither claim nor stale.
3. **new-plan / plan READMEs / CONVENTIONS §Plan Folder.** The
   `# NNNN — ` title required; the never-reuse rule beside "lower
   numbers run first"; ship-item preserves the title on the move.
4. **Run prompt template.** A comment-only note listing the step titles
   a wave brief may reference by name (no ADR slug). bootstrap Q8
   states the fresh-clone requirement.
5. **Docs.** README row and a "Executing a wave per host" subsection:
   Claude Code rows as observed in this session (structured question
   tool; subagent tool with worktree isolation and background
   completion; the workflow facility and its opt-in signals — the
   keyword, a session mode, the user's own words, a saved workflow —
   one fan-out per wave, subagents inside it see no such tool, the
   default agent-count guideline as the ceiling; permissions bypassed
   here, per-action prompts possible elsewhere, unverified); Cowork
   "same plugin — assumed, verify"; pi, Codex, OpenCode "no
   orchestration facility documented — the wave runs one item at a
   time — assumed, verify". USAGE agent-wave section rewritten
   (specification, rungs, budgets, resume, serialised integration,
   per-mode claims); docs/examples and docs/index reworded.

Out of scope:
- ship-item's integrating mode (plan 0048, which this item invokes).
- The eval case (plan 0050) and per-host runs (plan 0051).

## Exit criteria

Maps to the three owning ADRs' acceptance criteria:

1. ADR 0045 AC1–AC9: every field declared; the canonical brief stated
   once; claim-before-push; gate-cannot-run rule; per-profile
   integration with the PR retry loop; result normalisation; budget
   and stop rules; prohibitions; steps by title with the template
   comment.
2. ADR 0047 AC1–AC8: capability probe and derived rung with no host
   token in the body; rung-one discipline and express behaviour; mode
   mapping with both refusals; preconditions and probe; operator's
   checkout untouched; width rule; README/USAGE per-host table; skill
   directory contents unchanged.
3. ADR 0048 AC1–AC8: collect-first six-class classification;
   exclusions; continue question depth rule; continue path; claims
   ended by deletion; overlap mechanism; no state file; audit's stale
   rule.
4. The revision rows (0010 r5, 0013 r3, 0007 r2, 0043 r2, 0001 r2)
   present with Rationale footers; INDEX regenerated; the three owning
   ADRs Accepted → Implemented on the ship commit.
5. Verify gate green; the body passes the plan 0047 denylist; the
   rung-3 path needs only git plus the run prompt; no ADR identifier in
   any user-visible surface.

## Dependencies

- Plans 0040, 0041, 0042 (artefact-root repair of agent-wave), 0044,
  0045, 0047, and 0048 — sequential.
