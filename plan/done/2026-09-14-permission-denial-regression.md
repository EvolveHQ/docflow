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

## Verification and prepared completion

The historical cross-tool continuation fails the new regression. Twelve
positive/negative controls pass; the fresh native Cowork case passes seven
independent assertions, with no tool call after denial and all 20 destination
files unchanged. Exact installed bytes, expanded native request/error and
original failures are recorded in the [release audit](../../audits/2026-09-14-release-verification.md)
and its sanitised receipt. The broader Git-lock probe failure is retained;
this focused success is not a general permission boundary.

Product and gate changes are separate signed commits. Required local checks
pass, including `verify: OK`, exit 0, six deterministic eval passes, zero
failures and six explicit skips. Full release evidence is assessed separately
under 0051.

Shipped footer prepared for checked merge — verified work HEAD: `fd0fe0d9c25653e5c1e78dbe80f6421e4796c319`.
PR: https://github.com/EvolveHQ/docflow/pull/7

## Status at a glance

- **This run:** Verified the focused regression and prepared its atomic
  completion move on the PR branch. Local gates pass, exit 0.
- **Overall:** verified within this item's scope; completion is prepared.
- **Yet to do:** An authorised checked merge into main, with required checks
  green on the current PR head, makes completion effective. This is not yet shipped.
