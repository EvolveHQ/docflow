# 0014 — Document the WIP-stays-out choice

Owning ADR: adr/0018-wip-stays-out-of-catalogue.md

## Scope

Make the "no drafts in the catalogue" decision explicit in user-facing
docs and reaffirm it in conventions.

- `README.md`: a short subsection explaining WIP stays in the
  conversation (brainstorm writes nothing), ADRs record outcomes, there is
  no Draft status and no brainstorming/ folder, with the rationale (cite
  the lightweight-ADR sources).
- `CONVENTIONS.md` template: a one-line note under the status lifecycle
  that the first persisted status is `Proposed` (no `Draft`).
- Confirm no scaffold path creates a `brainstorming/`/`drafts/` folder.

## Exit criteria

Maps to adr/0018-wip-stays-out-of-catalogue.md acceptance criteria:

1. No `Draft` state; first persisted status is `Proposed`. → AC1
2. No brainstorming/drafts folder in the scaffold; brainstorm stays
   chat-only. → AC2
3. README documents the choice + rationale. → AC3
4. `node scripts/verify.mjs` stays green.

## Dependencies

Independent (docs + a convention note). Smallest of the three.

---

Shipped at HEAD `c1c441e` on 2026-06-23. CONVENTIONS note (first persisted status Proposed; no Draft/brainstorming folder) + README "No drafts in the catalogue" section. ADR 0018 → Implemented.
