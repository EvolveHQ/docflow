# 2026-08-04 — Candidate-branch split (reconstruction)

Owning ADR: adr/0043-candidate-branch-development.md (recorded after
the fact — the operator directed the change and the surgery ran
before the record, per the reconstruction path).

## What shipped

- `v1/aligned-autonomy` created at the then-HEAD (716c409) carrying
  all 88 post-0.9.4 commits, pushed with tracking.
- `main` force-reset to the v0.9.4 release commit (ffd0b4e) and
  force-pushed (`--force-with-lease`) — the released line now carries
  no unreleased development.
- `CONVENTIONS.md` §Git Contract + §Plan Folder completion event and
  `AGENTS.md` integration rule amended to the candidate-branch model:
  development fast-forwards onto the active candidate; `main`
  advances only by promotion; alternatives never merge; exactly one
  candidate is promoted, the rest archived unmerged.

## Exit criteria

1. Branch topology matches the model (main at the tag; candidate
   contains the full line). → gate/commands (owning ADR AC1–AC2)
2. The recorded contract states the model. → command (AC3)
3. Promotion discipline recorded. → manual (AC4)

---

**Shipped at HEAD `716c409`** — the candidate's tip when the surgery
ran (branch surgery makes no commit of its own: the branch was cut
there, and `main` was force-reset to ffd0b4e). The record, contract
amendments, and evidence ship in the commits this file lands with, on
`v1/aligned-autonomy`.
