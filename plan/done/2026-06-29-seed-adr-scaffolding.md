# 0028 — Seed ADR scaffolding at bootstrap

Owning ADR: adr/0029-seed-adr-recording-the-method.md

## Scope

Make bootstrap scaffold a default-on seed ADR at `adr/0001` recording the
adopted method.

- Add a **seed-ADR template** to `bootstrap/templates/` (e.g.
  `adr-0001-seed.md`) — a filled ADR that records the decision to adopt the
  documentation-led, ADR-driven method, status **`Implemented`**, with a
  rationale that **references `CONVENTIONS.md`** for the rules (no
  duplication) and is written **generically** (no docflow-internal ADR
  numbers/titles).
- Bootstrap output sequence: after `adr/0000-template.md`, write the seed as
  `adr/0001-<slug>.md` **by default**, with an **opt-out** (a question, or
  folded into the existing optional-layer prompts); seed `INDEX.md` with its
  row.
- **Retrofit/backfill** (adr/0003): the seed is always ADR `0001`, ahead of
  the reconstructed decisions.
- The seed uses the repo's ADR shape (technology where the repo splits,
  single/capability otherwise).
- Document it in `README.md`/`USAGE.md` (what the seed is, why, how to opt
  out).

## Exit criteria

Maps to adr/0029-seed-adr-recording-the-method.md acceptance criteria:

1. Bootstrap writes `adr/0001-<slug>.md` by default; operator may opt out. → AC1
2. `adr/0000-template.md` stays the template; seed is `0001`, contiguous. → AC2
3. Seed status is `Implemented` on creation. → AC3
4. Seed states decision + rationale and references CONVENTIONS, no
   duplication. → AC4
5. Seed is generic — no docflow-internal ADR ids. → AC5
6. On retrofit/backfill, seed is ADR `0001` ahead of reconstructed
   decisions. → AC6
7. Seed uses the repo's ADR shape. → AC7
8. `node scripts/verify.mjs` stays green.

## Dependencies

Builds on the layered-artifact model (0016, shipped) for the opt-out
pattern and the backfill flow (0003). Independent of the 0005/0014
coordination revisions.

---

Shipped at HEAD `188c938` on 2026-06-29. templates/adr-0001-seed.md + bootstrap output item 5b (default-on adr/0001 seed, opt-out at sign-off, conditional plan/done entry, backfill anchor); README/USAGE. ADR 0029 -> Implemented.
