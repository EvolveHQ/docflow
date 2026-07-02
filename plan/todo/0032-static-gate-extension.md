# 0032 — Extend the static verify gate with catalogue and queue checks

Owning ADR: adr/0011-static-skill-validation.md (r3)

## Scope

Extend `scripts/verify.mjs` with five deterministic checks. The
full-repo consistency review of 2026-07-02 found that every rule the
gate already enforces held, while unenforced rules had drifted — these
five cover the drift actually observed:

1. **ADR section order** — every catalogue ADR's H2 sequence matches
   the shape's documented order (Context → Capability statement → User
   stories / scenarios → Acceptance criteria → Out of scope → Open
   questions → References → Revision History → Approvals). This repo
   uses the single capability shape; no per-shape dispatch needed.
2. **Numbered acceptance criteria** — every catalogue ADR's Acceptance
   criteria section contains an ordered (numbered) list.
3. **depends-on resolution** — every entry in an ADR's `depends-on`
   frontmatter names an existing catalogue ADR.
4. **INDEX row fidelity** — each `INDEX.md` row's status, date, and
   depends-on match the ADR's frontmatter (today only filename presence
   is checked).
5. **plan/done footer SHA** — every `plan/done/` file carries a footer
   naming the shipping HEAD SHA. Tolerate minor formatting variants
   (about a third of existing files bold the word "Shipped"); match on
   the substance: "Shipped … HEAD `<sha>`".

Constraints (unchanged from the owning ADR): deterministic, no network,
no model call, single command, non-zero exit with a file-and-rule
message per violation.

Out of scope (recorded in the ADR's Out of scope, r3):

- Revision-History-row enforcement on substantive edits.
- `Rationale:` commit-footer enforcement (commit hook territory).
- Prose-drift detection across README/USAGE/docs (separate decision,
  not yet recorded).

## Exit criteria

Maps to adr/0011-static-skill-validation.md acceptance criteria (r3):

1. Section-order check implemented and failing on deviation. → AC5
2. Numbered acceptance-criteria check implemented. → AC6
3. depends-on resolution check implemented. → AC7
4. INDEX row status/date/depends-on fidelity check implemented. → AC8
5. plan/done HEAD-SHA footer check implemented. → AC9
6. Gate still runs with no network and no model call. → AC4
7. The current repo state passes the extended gate — any true positives
   the new checks surface are fixed in the same change, not suppressed.

When this ships, ADR 0011 advances Accepted → Implemented (again).

## Dependencies

None. The queue is otherwise empty.
