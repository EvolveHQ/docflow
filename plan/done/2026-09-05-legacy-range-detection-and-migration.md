# 0037 — Legacy range detection and mechanical migration

Owning ADR: adr/0035-range-numbered-catalogue-migration.md

## Scope

Keep catalogues bootstrapped with a cutoff working, and offer them a
complete mechanical migration onto the declared-field scheme:

1. **Detection.** Audit recognises the legacy encoding from
   `CONVENTIONS.md` §ADR Shapes (a cutoff) or from a template file
   numbered other than `0000`. While it is present, the numbering and
   section checks apply the range rules exactly as before, and the
   report carries one "migration available" finding.
2. **Offer.** Audit's fix step and the bootstrap existing-repo path both
   present the migration with an old-to-new number map and write
   nothing until the operator confirms.
3. **Migration.** Technology ADRs take the numbers after the highest
   capability ADR, original order preserved; capability numbers stay.
   `shape:` is written on every ADR. Rewritten: `depends-on`,
   `supersedes` / `superseded-by`, relative `adr/NNNN-*.md` links,
   `INDEX.md`, domain `README.md` listings, `plan/todo/` owning-ADR
   references. Not rewritten: `plan/done/` footers, commit history.
   The boundary template is replaced by `0000-template-technology.md`;
   `CONVENTIONS.md` §ADR Shapes is rewritten to the declared-field form
   and any seed-ADR exception clause removed. The commit message lists
   every old-to-new pair.
3b. **new-adr (scope addition, agreed with the coordinator during the
   run).** Traced to ADR 0035's capability statement ("recognised by
   every lifecycle skill"): when the legacy encoding is present, new-adr
   offers the migration first and, if declined, reads the cutoff and
   places the new ADR on its side of it, stopping if that side is full;
   no `shape:` field is written into a legacy catalogue.
4. **Eval.** A fixture built from a range-numbered catalogue (a small
   capability block, a `0100` template, a short technology block, one
   cross-reference each way) exercises detection, the offer, and a
   clean two-shape audit after migration.

Out of scope:
- The declared-field scheme itself (plan 0036).
- Federation-side consequences of a member renumbering; existing
  dangling-reference behaviour applies.

## Exit criteria

Maps to adr/0035-range-numbered-catalogue-migration.md acceptance
criteria:

1. Legacy encoding detected from conventions or template numbering;
   reported as one non-failing "migration available" finding. → AC1
2. Legacy repos keep passing under the range rules until migrated. → AC2
3. Audit and bootstrap both offer, show the map, and wait for
   confirmation. → AC3
4. Renumbering appends technology ADRs after the last capability
   number in original order; capability numbers unchanged. → AC4
5. Every in-catalogue reference rewritten; `plan/done/` and history
   left alone. → AC5
6. Boundary template retired, conventions rewritten, exception clause
   gone. → AC6
7. Post-migration catalogue passes the two-shape checks with no manual
   edits. → AC7
8. Migration commit message lists every old-to-new pair. → AC8
9. Eval fixture and assertions in `evals/` cover detection, offer, and
   post-migration audit. → AC9
10. Skill parity across all five targets preserved (verify gate).

When this ships, ADR 0035 advances Accepted → Implemented.

## Dependencies

- Plan 0036 (the declared-field scheme this migrates onto) must ship
  first.

---

Shipped at HEAD `ce41a34` on 2026-09-05 via PR #2
(https://github.com/EvolveHQ/docflow/pull/2; six signed commits by the
Opus 5 worker, the eval fixture in its own commit). Legacy range
detection with the range rules kept alive, the offered migration in
audit and bootstrap, the new-adr legacy clause, the `legacy-range`
eval fixture, and docs. ADR 0035 → Implemented (r3).
