# 0054 — Preserve advanced claims during autonomous cleanup

Owning decision: adr/0038-in-flight-state-derived-from-branches-and-pull-requests.md
(r6; existing verified-source deletion lease requirement). Integration follows
adr/0050-repository-changes-integrate-through-checked-pull-requests.md.

## Scope

Repair PR #5 review comment 3993698694: the bootstrap autonomous prompt
and its dogfood copy omit ship-item's expected-tip deletion lease. Retain
the source SHA verified for integration, preserve changed remote claims,
and report cleanup blockers independently of confirmed integration.
Inspect related cleanup paths and retain all three coordination modes.

Add focused deterministic coverage of prompt/template consistency and reuse
the real-Git claim-race eval. Update the internal audit with new evidence;
historical host receipts and plan 0051 remain unchanged. No new decision,
version change, merge, release, additional PR or host matrix run is in scope.

## Exit criteria

1. Reproduce the missing lease in both prompts before repair. Both require
   an explicit deletion lease against the retained verified integration
   source, never a newly read remote tip; changed claims survive.
2. Related cleanup instructions agree, preserve local unpushed/dirty work,
   distinguish cleanup blockers from integration failure, and retain the
   existing single/shared/separate-worktree branch and early draft rules.
3. A regression rejects a missing or incorrectly sourced lease and prompt
   drift; real Git proves advanced-ref rejection and unchanged-ref deletion.
4. Static verification, all 15 gate mutations and deterministic evals pass;
   skipped behavioural cases stay explicitly unexecuted. Five-target shared
   source parity, privacy and version 0.9.4 remain intact.
5. Prepare completion with exact verified-work HEAD and PR URL, regenerate
   INDEX from metadata, and push signed commits normally to PR #5's existing
   branch. Required verify CI passes at the exact new head. Completion takes
   effect only on an authorised checked merge; plan 0051 stays open.

## Status

- **Claimed by:** Codex ChatGPT Astra, 2026-09-13, local `kmox83/pr5-review-astra`, updating `kmox83/0040-claim-by-branch` in PR #5; sole operator-authorised writer.
- **Blockers:**
- **Stopped:**
