# 0055 — Update verify actions to their Node 24 runtime

Owning decision: adr/0050-repository-changes-integrate-through-checked-pull-requests.md
(routine maintenance of the existing required verify check).

## Scope

Upgrade checkout and setup-node in `.github/workflows/verify.yml` from v4
to verified stable releases declaring the Node 24 action runtime. Retain
the existing major-tag pinning style, Node 22 test runtime, three gate
commands, permissions, triggers and required check name. Inspect caching,
runner and credential compatibility; use no runtime override flags.

No new decision, test harness, product/version change or expansion of plan
0051. Keep the CI change in its own signed commit, separate from plan/audit
metadata. Update only PR #5; the operator retains merge authority.

## Exit criteria

1. Official stable release/tag data and action.yml confirm both selected
   action versions use node24; relevant breaking changes are assessed.
2. Only the necessary action references change in the workflow; existing
   gates, configured Node 22, permissions, triggers and verify job remain.
3. All three local gates pass with truthful skipped evals. A fresh required
   verify run at the final remote PR head passes, and its annotations and
   logs contain no Node 20 action-runtime deprecation warning.
4. Prepare completion with exact verified work HEAD and PR #5 URL; regenerate
   INDEX from metadata. Record the versions, rationale and delivery evidence
   in the audit/PR report, effective only on the operator's checked merge.

## Status

- **Claimed by:** Codex ChatGPT Astra, 2026-09-13, local `kmox83/pr5-review-astra`, updating `kmox83/0040-claim-by-branch` in PR #5; sole operator-authorised writer.
- **Blockers:**
- **Stopped:**
