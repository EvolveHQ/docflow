# 0075 — Detect claims across independent checkouts

Owning decisions: adr/0051-portable-workspace-memory-contract.md (AC2–5)
and adr/0052-workspace-authority-and-attempt-records.md (AC3–6), both Accepted.

## Status

- Claimed by:
- Blockers:
- Stopped:

## Scope

Repair shared-repository ownership detection in the workspace validator and
dispatch checks. Resolve canonical repository identity and unambiguous aliases
across explicitly registered homes before comparing attempts, instead of using
checkout real paths as identity. Preserve native claims, resource checks and
unknown-owner stops. Supply versioned fixtures for the Clarity consumer.

Source: reviewed gap 1 in
`../../.docflow_workspace/local/handoffs/workspace-gaps-review.md`; design
document 09 §§4, 8 and document 14 §5 WV05/WV08. The review is a static defect
finding, not an executed reproduction. No new decision is required.

Out of scope: Clarity edits, local-path overrides, URL normalisation as an
identity substitute, a central lock service and unrelated claim redesign.

## Dependencies and queue position

- Uses the integrated workspace foundations and contract revision 2 (0054,
  0070); reproduce against the selected source before changing behaviour.
- No dependency on Proposed ADR 0063 or item 0076: separate shared registry
  paths already reproduce the claim defect.
- Controller routes a separate Clarity repair under its ADR 0135. Publish the
  fixture source/digest for it; paired-reader agreement is a final acceptance
  dependency, not permission to edit the consumer here.
- First new increment after 0074. Final 0061/0062 qualification depends on this
  repair even though those existing items have lower queue numbers.

## Exit criteria

1. A failing-before/passing-after control uses two homes and two independent
   checkouts of one canonical repository: overlapping incompatible attempts
   are rejected. Same-root overlap still fails. (0051 AC2; 0052 AC3–4)
2. Alias/canonical-ID variants resolve the same ownership domain; ambiguous
   identities stop. Distinct repositories and non-overlapping intervals are
   not falsely rejected; shared exclusive resources still conflict across
   distinct repositories. (0051 AC2–4; 0052 AC4)
3. Missing or unresolved native ownership stops assignment; ending an interval
   alone does not reconcile a predecessor. Grant and reference-only checks
   continue to apply. (0052 AC3–5)
4. Source-bound producer fixtures are consumed on the paired Clarity revision
   with matching outcomes, including aliases and distinct-repository controls.
   Docflow-only success is recorded as partial until that return. (0051 AC5)
5. Native WV05 exercises the repaired identity path; item 0062 owns its combined
   Clarity observation. Static and deterministic gates pass. Gate behaviour
   and judged product repairs use separate commits unless the named
   tighten-and-repair exception applies. (0052 AC6)

## Size estimate

M — 2–3 focused implementation/verification days, excluding consumer scheduling
and native qualification access; one validator/dispatch/fixture increment.
