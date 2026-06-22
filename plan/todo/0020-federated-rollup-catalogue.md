# 0020 — Federated roll-up catalogue

Owning ADR: adr/0024-federated-rollup-catalogue.md

## Scope

Provide an agent-run lifecycle skill that aggregates per-repo ADR metadata
into one product-wide roll-up.

- New lifecycle skill (home-repo): read the member index, then each
  member's `INDEX.md` from its local checkout, and write a derived,
  read-only roll-up catalogue.
- Each roll-up row records the owning repo and the ADR's federation-unique
  identity; per-repo `INDEX.md` stays authoritative for its repo.
- **Tolerant generation:** a member not checked out locally is listed as
  "not aggregated this run" — never silently dropped, never a hard failure.
- The roll-up is regenerated, not hand-edited (treat like `INDEX.md`).

## Exit criteria

Maps to adr/0024-federated-rollup-catalogue.md acceptance criteria:

1. Each member repo keeps its own `INDEX.md`. → AC1
2. The roll-up aggregates ADR metadata across member repos. → AC2
3. Generated from the member index, not hand-maintained. → AC3
4. Derived/read-only; member `INDEX.md` stays authoritative. → AC4
5. Each entry records owning repo + federation identity. → AC5
6. Generator is an agent-run lifecycle skill (not CI), reading members'
   `INDEX.md` from local checkouts. → AC6
7. Tolerant: uncheckedout members listed as "not aggregated this run".
   → AC7
8. `node scripts/verify.mjs` stays green (skill count updated if a new
   skill is added).

## Dependencies

Depends on the shipped identity (0018) and reference (0019) work and the
member index (federation config). Aggregate **status** reporting is out of
scope here — owned by adr/0026-cross-repo-status-completion.md.
