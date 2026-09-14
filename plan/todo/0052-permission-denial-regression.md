# 0052 — Stop at an explicit tool permission denial

Owning decisions: adr/0012-skill-behavioural-evals.md,
adr/0045-wave-specification-contract.md and
adr/0043-persisted-reports-carry-status-at-a-glance.md.

## Scope

Preserve the native Cowork receipt-export failure. Add focused independent
assertions for denial followed by another tool, destination preservation and
truthful stopped reporting. Clarify neutral skill instructions within the
existing stop/authorisation contract. Separate permission failure from a
legitimate environment-gate stop; prose is not a host security boundary.
Use disposable fixtures, retain failures, and never route around a denial.

## Exit criteria

1. The original cross-tool continuation fails the regression.
2. Positive and negative controls judge completed tool ordering, no denied
   destination mutation, and a stopped/blocked report with remaining work.
3. Relevant native regression execution has independently checked, source-pinned
   evidence; any unavailable execution remains pending.
4. Product and gate changes are separate signed commits; required gates pass.

## Status

- **Claimed by:** Codex, 2026-09-14, `kmox83/docflow-release-verification`.
- **Blockers:** Native regression execution pending.
- **Stopped:**
