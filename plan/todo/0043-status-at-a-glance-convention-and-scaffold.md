# 0043 — Status at a glance: convention text and scaffold placement

Owning ADR: adr/0041-status-at-a-glance-reporting-convention.md

## Scope

1. **Templates.** `templates/CONVENTIONS.md` gains a §Reporting
   section: exact heading text, the three labels and meanings, the
   Overall vocabulary, the `None` rule, the four honesty rules, the
   principle, one worked example, and a marked insertion point for
   repository-specific rules. `templates/AGENTS.md` gains a short
   Reporting hard rule (heading, three labels, pointer to the section;
   no rules, no example). `templates/_agent-prompts-autonomous.md`
   gains a final Report step requiring the block and quoting the
   gate's exact output line and exit code under This run.
2. **Bootstrap.** Step 3 "conventions to install" lists the reporting
   convention; Step 5 writes the three placements at every depth; the
   express and guided profile text names it; the full-depth sign-off
   summary offers the opt-out and Step 5 honours it (none of the three
   written); Q10 notes that reporting rules extend §Reporting's
   numbered list.
3. **Audit.** New drift check: AGENTS pointer names a heading or labels
   the CONVENTIONS section does not define; either placement present
   without the other.
4. **Docs.** `README.md`, `USAGE.md` (output table, Q10 note, opt-out),
   `docs/methodology.md` (a Reporting paragraph), `docs/examples.md`.
5. **Dogfood.** This repo's `CONVENTIONS.md` gains §Reporting, its
   `AGENTS.md` the pointer rule, and `_agent/prompts/autonomous.md`
   the Report step.

Out of scope:
- The skills' own closing messages (plan 0044).
- PR bodies, wave summaries, stop entries (plan 0045).

## Exit criteria

Maps to adr/0041-status-at-a-glance-reporting-convention.md acceptance
criteria:

1. CONVENTIONS template §Reporting complete (heading, labels, vocabulary,
   `None` rule, four rules, principle, example). → AC1
2. AGENTS template pointer rule, no duplication. → AC2
3. Prompt template Report step with gate line and exit code. → AC3
4. Written at every depth; full-depth opt-out removes all three. → AC4
5. Q10 extension note and template insertion point. → AC5
6. Audit drift check for pointer/section disagreement and lone
   placement. → AC6
7. This repo's CONVENTIONS, AGENTS, and prompt carry it. → AC7
8. README, USAGE, docs updated. → AC8
9. Verify gate green; skill parity across the five targets preserved.

When this ships, ADR 0041 advances Accepted → Implemented.

## Dependencies

None. Independent of the coordination items 0038–0042; shares
`bootstrap/SKILL.md`, `templates/AGENTS.md`, and
`templates/CONVENTIONS.md` with them, so it runs sequentially in queue
order unless renumbered ahead.
