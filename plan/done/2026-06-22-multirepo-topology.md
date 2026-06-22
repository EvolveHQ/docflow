# 0015 — Multirepo topology for a single product

Owning ADR: adr/0019-multirepo-topology.md

## Scope

Implement the configurable multirepo topology so a product spread across
repos agrees on where product-wide decisions live.

- Add a topology selection to bootstrap when the operator declares the
  repo part of a multi-repo product: **A** (central decisions repo),
  **B** (distributed + federation), **C** (home repo + local), with **C**
  as the default.
- Implement all three modes in v1; C is the default, not the only one.
- Record the chosen topology federation-readably so every lifecycle skill
  resolves behaviour against it.
- Leave standalone repos untouched: no topology question, no federation
  artefacts.

## Exit criteria

Maps to adr/0019-multirepo-topology.md acceptance criteria:

1. Bootstrap offers A/B/C (C default) when the repo is part of a
   multi-repo product. → AC1
2. Topology recorded federation-readably; lifecycle skills resolve against
   it. → AC2
3. Topology C designates exactly one home repo; product-wide ADRs live
   there, local ADRs stay per repo. → AC3
4. Standalone repos unaffected — no topology question, single-repo
   behaviour unchanged. → AC4
5. Topology chosen once at establishment, not re-asked on join. → AC5
6. A, B, and C all implemented and selectable in v1. → AC6
7. `node scripts/verify.mjs` stays green.

## Dependencies

Foundational — gates 0016 (establish/join bootstrap) and 0017 (federation
config + member index). No prerequisites.

---

Shipped at HEAD `69fca8b` on 2026-06-22. Topology A/B/C selection (default
C) implemented in the bootstrap skill; recorded in the federation config.
ADR 0019 → Implemented (AC2 scope tightened in r3 — per-skill consumption
owned by 0021/0022/0028).
