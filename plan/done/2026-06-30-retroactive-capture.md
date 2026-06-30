# 0031 — Retroactive capture of undocumented developments

**Owning ADR:** adr/0003-backfill-retrofit.md (r2 — AC1/AC5/AC6)

## Problem

The ADR+plan model captures decisions and decided work, but a **large
development built ahead of the process** (no ADR, no plan) is captured only
in git history. Backfill exists but is framed as adoption-time only.

## Scope (B1 + B2)

In:
- **B1 — re-runnable capture path.** Generalise `bootstrap` Step 6 backfill
  so it can be **re-run on an already-docflow repo, scoped to an emergent
  development** — reconstruct the owning ADR(s) at `Implemented` (provenance
  noted) + matching `plan/done` entries; regenerate INDEX/WORKLOG. `new-adr`
  gains a short "reconstructing shipped work" note (author at `Implemented`,
  cite commits, write the `plan/done` entry).
- **B2 — audit detection.** Add an `audit` **coverage** check: flag
  substantial behaviour/areas with **no owning ADR** so escapes are
  surfaced. Heuristic by nature (the audit is doc-centric) — a prompt, not a
  precise code-vs-ADR diff.
- Document the capture path in methodology + README/USAGE.

Out:
- A dedicated `capture`/`backfill` skill (B3) — the existing `bootstrap`
  backfill + `new-adr` are the entry points.

## Exit criteria (map to ADR 0003 AC1/AC5/AC6)

1. `bootstrap` backfill is re-runnable mid-life, scoped to a development
   that landed without an ADR/plan (AC1).
2. The capture path reconstructs ADR(s) at `Implemented` with provenance +
   matching `plan/done`; `new-adr` documents the reconstruction (AC5/AC3).
3. `audit` has a coverage check that flags substantial work with no owning
   ADR (AC6).
4. The path is documented in the methodology page + README/USAGE.

## Completion event

Fast-forwarded to `main` + remote push. On completion, `git mv` to
`plan/done/`, advance ADR 0003 → Implemented, regenerate `INDEX.md`.

> Queued while ADR 0003 is **Accepted** (reopened) — implement, then ship.

---

Shipped at HEAD `30b4bf3` on 2026-06-30. bootstrap Step 6 re-runnable capture + new-adr reconstruction note + audit check 13 coverage + methodology §4.8 + README/USAGE. ADR 0003 -> Implemented (r3).
