# 2026-08-05 — Candidate-branch split, second candidate (reconstruction)

Owning ADR: adr/0034-candidate-branch-development.md (recorded after
the fact — the operator directed the change; the branch topology
predates the record, per the reconstruction path).

## What shipped

- `main` force-reset to the v0.9.4 release commit (ffd0b4e) on
  2026-08-04 — the released line carries no unreleased development
  (performed once, repo-wide; recorded independently on each
  candidate, since catalogues never merge).
- This branch, `v1/agent-loop-graph`, cut clean from the v0.9.4 tag
  on 2026-08-05 as the **second v1 candidate**, focused on **agent
  loop/graph management**. First candidate: `v1/aligned-autonomy`.
- `CONVENTIONS.md` §Git Contract + completion event and `AGENTS.md`
  amended on this branch: candidate development fast-forward only;
  `main` advances only by promotion; candidates never merge; exactly
  one is promoted; **no release — internal testing only**.

## Exit criteria

1. Branch topology matches the model (main at the tag; this candidate
   from the tag). → owning ADR AC1–AC2
2. The recorded contract states the model on this branch. → AC3
3. Promotion + no-release discipline recorded. → AC4

---

**Shipped at HEAD `ffd0b4e`** — the v0.9.4 commit this branch was cut
from (branch creation makes no commit of its own). The record and
contract amendments ship in the commit this file lands with, on
`v1/agent-loop-graph`.
