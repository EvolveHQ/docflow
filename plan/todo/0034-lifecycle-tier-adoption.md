# 0034 — Lifecycle tier adoption: depth selector in the eight skills

Owning ADR: adr/0031-tiered-assessment-depth.md (AC7 — completes it)

## Scope

Propagate the depth selector proven in bootstrap (plan 0033) to the
eight lifecycle skills: new-adr, new-plan, ship-item, add-convention,
audit, brainstorm, agent-wave, rollup.

1. Each skill's assessment section replaces its run/skip opt-out gate
   with the express / guided / full selector, worded identically
   across all eight (consistency is the point — drift between copies
   of the protocol is the disease this repo fights).
2. Express in a lifecycle skill still asks the unavoidable free-text
   essentials (title, goal, scope — inputs with no derivable default)
   and takes recommended defaults for everything else.
3. Each skill marks which of its questions are high-impact (the guided
   subset) — for most lifecycle skills this is one or two questions.
4. The depth preference recorded in the target repo's CONVENTIONS.md
   is read and offered as the pre-selected recommendation — never
   applied silently.
5. Mid-flight switching honoured, as in bootstrap.
6. Docs: README / USAGE updated to say tiers apply to every skill, not
   just bootstrap.

Out of scope:
- Any change to bootstrap (done in plan 0033).
- Plain-language wording (deferred decision).

## Exit criteria

Maps to adr/0031-tiered-assessment-depth.md acceptance criteria:

1. All eight lifecycle skills open with the depth selector, worded
   consistently. → AC1, AC7
2. Express carve-out for free-text essentials honoured per skill. →
   AC2
3. Guided subset marked per skill. → AC3
4. Mid-flight switching honoured. → AC4
5. Recorded preference read and recommended, never auto-applied. → AC5
6. Verify gate green; skill prose stays agent-neutral (multi-target
   parity).

**On ship: adr/0031 advances Accepted → Implemented** (AC6 landed with
plan 0033; AC7 lands here).

## Dependencies

- **plan/todo/0033-bootstrap-tiered-assessment.md must ship first** —
  the mechanism is proven on bootstrap before being propagated.
- **Deliberately gated on bootstrap rollout feedback**: before starting
  this item, confirm the tier design survived real express/guided runs
  (or revise adr/0031-tiered-assessment-depth.md first if it did not).
  This gate is the reason the adoption is staged at all — do not start
  this item purely because it is next in the queue.
