# 0033 — Bootstrap tiered assessment: depth selector + profiles

Owning ADRs:
- adr/0031-tiered-assessment-depth.md — bootstrap-scoped criteria
  (AC1–6; AC7, lifecycle adoption, belongs to plan 0034)
- adr/0032-bootstrap-depth-profiles.md — all criteria

## Scope

Implement the depth tiers in the **bootstrap skill only** (the staged
rollout both ADRs record):

1. Bootstrap opens with the express / guided / full depth selector,
   replacing its run/skip opt-out gate. Structured selection where the
   host provides it, plain-text fallback (protocol rules unchanged).
2. **Express**: no further questions beyond unavoidable free-text
   essentials; scaffolds the fixed profile — minimal core, optional
   layers (including domains) off, default artefact root,
   direct-to-main fast-forward, single-agent, seed ADR on, standalone.
   The default summary is shown before anything is written.
3. **Guided**: exactly three questions — integration model,
   multi-agent coordination mode, plan queue — defaults elsewhere.
4. **Federation guard**: express and guided never establish or join a
   federation; those questions surface in full only.
5. **Mid-flight switching**: "defaults from here" and "go deeper"
   honoured at any question.
6. **Recorded preference**: the chosen depth is written into the
   scaffolded `CONVENTIONS.md` (template updated) and appears as the
   pre-selected recommendation on later selectors — never applied
   silently.
7. **Retrofit safety**: preserve-and-merge behaviour identical at
   every depth.
8. **Backfill offer**: asked in full, brief in guided, deferred with a
   pointer in express.
9. **Behavioural eval**: an express bootstrap against a scratch repo
   asserting the express profile's file tree (extends the existing
   eval suite).
10. Docs: README / USAGE / docs pages describe the three tiers
    (agent-neutral, no internal ADR references — the privacy rule).

Out of scope:
- Tier adoption in the eight lifecycle skills — plan 0034.
- Plain-language question wording — deferred decision, not queued.

## Exit criteria

Maps to the owning ADRs' acceptance criteria:

1. Selector live in bootstrap with mid-flight switching. → 0031 AC1,
   AC4, AC6
2. Express behaviour incl. free-text carve-out and default summary. →
   0031 AC2; 0032 AC1
3. Guided three-question subset. → 0031 AC3; 0032 AC3
4. Recorded depth as pre-selected recommendation, changeable later. →
   0031 AC5
5. Federation guard. → 0032 AC2
6. Retrofit preserve-and-merge parity across tiers. → 0032 AC4
7. Backfill offer tiering. → 0032 AC5
8. Express behavioural eval green. → 0032 AC6
9. Verify gate green; multi-target parity kept (skill prose stays
   agent-neutral).

**On ship: adr/0032 advances Accepted → Implemented. adr/0031 stays
Accepted** — its AC7 (lifecycle adoption) ships with plan 0034.

## Dependencies

None. Runs first; plan 0034 depends on this item.

---

Shipped at HEAD `fc158bc` on 2026-07-03 (feature 6e7f8a5, evals
4d9df46, template variants f225e70 + fc158bc — gate changes in their
own commit per the gate-integrity convention). Express behavioural
eval PASS against the pushed skill (worktree subagent; all four
profile checks + privacy scan green; an earlier stale-worktree run
validated the spec alone and surfaced the template gaps fixed here).
ADR 0032 → Implemented (r4); ADR 0031 stays Accepted — AC7 ships with
plan 0034.
