# 0036 — Shape by field: templates, bootstrap Q2, new-adr, audit, INDEX

Owning ADR: adr/0034-adr-shape-as-declared-metadata.md

## Scope

Move the capability / technology distinction from a number range into a
`shape:` metadata field, across the product surface:

1. **Templates.** `templates/adr-capability.md` gains an optional
   `shape:` line (absent = capability). `templates/adr-technology.md`
   is written as `adr/0000-template-technology.md` with
   `shape: technology` pre-filled; the boundary-numbered
   `adr/NNNN-template.md` output goes away. `templates/CONVENTIONS.md`
   §ADR Shapes: the split variant describes the field and the two
   `0000` templates, no cutoff, no "recorded exception" clause.
   `templates/INDEX.md`: a Shape column in the two-shape variant only.
   `templates/adr-0001-seed.md`: `shape: technology` when the repo is
   two-shape.
2. **Bootstrap.** Q2 becomes "single shape, or two shapes declared by
   field" (recommendation unchanged: single). Step 5 item 5 writes
   `0000-template-technology.md` instead of `NNNN-template.md` and asks
   for no cutoff. The layout sketch and the Q2/Q7 cross-check are
   updated. Express and guided profiles are untouched (single shape).
3. **New-adr.** Step 0 reads the shape scheme, not a cutoff; Step 1
   numbers next-contiguous irrespective of shape, and in a two-shape
   repo asks the shape, picks the matching `0000` template, and writes
   the field.
4. **Audit.** Check 1 drops the "capability below cutoff" clause. Check 4
   validates each ADR's section order against its declared shape and
   flags an unknown `shape:` value. Both `0000-` files are excluded from
   the catalogue wherever templates are excluded.
5. **Docs.** README / USAGE / `docs/` wherever the split or the `0100`
   template is described.

Out of scope:
- Recognising or migrating catalogues already bootstrapped with a cutoff
  (plan 0037, adr/0035-range-numbered-catalogue-migration.md).
- Any change to this repo's own catalogue (single shape, no field).

## Exit criteria

Maps to adr/0034-adr-shape-as-declared-metadata.md acceptance criteria:

1. Capability template accepts `shape:`; absent means capability. → AC1
2. Technology template ships as `0000-template-technology.md` with the
   field pre-filled; both `0000-` files excluded from the catalogue by
   every consumer; no template numbered other than `0000`. → AC2
3. Bootstrap Q2 reworded, no cutoff asked, scaffolded conventions
   describe the field, Q2/Q7 cross-check preserved. → AC3
4. New-adr numbers contiguously and stamps the field. → AC4
5. Audit numbering check has no shape clause; section check reads the
   declared shape; unknown values flagged. → AC5
6. Scaffolded INDEX has a Shape column only in two-shape repos. → AC6
7. Seed ADR in a two-shape repo is `0001`, `shape: technology`, no
   exception clause in the conventions. → AC7
8. This repo's verify gate stays green with no change to its own ADRs
   or to `scripts/verify.mjs`. → AC8
9. Skill parity across all five targets preserved (verify gate).

When this ships, ADR 0034 advances Accepted → Implemented.

## Dependencies

None. Runs before plan 0037, which migrates legacy catalogues onto the
scheme this item introduces.

---

Shipped at HEAD `35a933c` on 2026-09-04 via PR #1
(https://github.com/EvolveHQ/docflow/pull/1; branch tip 58ca292, eight
signed commits by the Opus 5 worker plus review fixes). Shape moved from
a number range to a `shape:` field across templates, bootstrap, new-adr,
audit, INDEX, and docs. ADR 0034 → Implemented (r3).
