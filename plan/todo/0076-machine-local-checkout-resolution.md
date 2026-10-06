# 0076 — Implement machine-local checkout resolution

Owning decision: adr/0063-machine-local-checkout-resolution.md (Proposed).
Existing constraints: adr/0051-portable-workspace-memory-contract.md and
adr/0052-workspace-authority-and-attempt-records.md.

## Status

- Claimed by:
- Blockers:
- Stopped:

## Scope

Implement the accepted local-location contract in the packaged schema,
resolver/validator, setup/adoption guidance and portable producer fixtures.
Make every Docflow workspace entry point use the same precedence and explicit
failure semantics. Preserve canonical identity, source-bound evidence,
containment and the role of reference-only members.

Source: reviewed gap 5 in
`../../.docflow_workspace/local/handoffs/workspace-gaps-review.md`; design
document 09 §4 and document 14 §4 W2 / §5 WV05/WV09/WV17.

Out of scope: Clarity implementation, checkout management, automatic host setup,
changing shared identity/authority, publication and native qualification runs
owned by 0061/0062.

## Dependencies and queue position

- **Not authorised for implementation:** operator acceptance of ADR 0063,
  including its open file-shape/path choice, is required first. Queueing this
  item is preparation only.
- Item 0075 supplies identity-based overlap checks; integrate its repair before
  counting override/claim controls as passing.
- Controller routes a separate Clarity consumer item against the accepted
  contract and pinned producer fixtures. No cross-repository writes here.
- Second new increment; acceptance can proceed while 0075 is implemented.
  Final paired qualification in 0062 waits for both producer and consumer.

## Exit criteria

1. Absent mappings preserve existing behaviour; valid mappings relocate a
   member without any shared record edits. All entry points report the same
   effective location. (0063 AC1)
2. The complete malformed/duplicate/unknown/home/schema matrix fails without
   fallback; external and relative roots pass or fail under the accepted
   real-path and workspace-record containment rules. (0063 AC2–3)
3. Cross-home ownership, native claim, source revision and reference-only
   controls cannot be bypassed by location changes. External homes resolve
   their own mappings without ambient scanning or network setup. (0063 AC4–5)
4. Package valid/adverse fixtures with exact source and digest; paired Clarity
   consumes them with matching roots/failure categories and unchanged canonical
   bytes. Consumer evidence remains pending until returned. (0063 AC6)
5. Isolated setup/adoption proves that local paths remain ignored and do not
   enter shared examples or records; plugin, npm and detached-copy paths work
   across the declared target set. Static and deterministic gates pass with
   gate-integrity commit separation. (0063 AC7)

## Size estimate

L — 3–5 focused implementation/verification days after acceptance, excluding
Clarity delivery and native-host access; one resolver/schema/package increment.
