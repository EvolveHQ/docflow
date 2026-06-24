# 0025 — Topology A/B/C differentiation

Owning ADR: adr/0019-multirepo-topology.md

## Scope

Make the multi-repo topology choice produce **distinct behaviour** per
A/B/C, not just a recorded label (the assessment FAIL on 0019 AC6).

- **Bootstrap establish** branches per topology:
  - **A — central:** this repo is the central decisions repo (`Role:
    central`); it holds all product-wide ADRs.
  - **B — distributed:** this repo is the coordinator (`Role:
    coordinator`) holding only the member index; product-wide decisions
    are distributed, and the roll-up is the product-wide view.
  - **C — home:** current behaviour (`Role: home`).
- **Bootstrap join** branches per inherited topology:
  - **A:** member references the central repo and does **not** hold
    product-wide ADRs locally (its `adr/` is local-only).
  - **B:** member owns its own catalogue fully.
  - **C:** member keeps local ADRs alongside and references the home for
    product-wide ones.
- Make the conditional **§Federation** CONVENTIONS section
  **topology-aware** — a short distinct clause per A/B/C — instead of the
  single B/C-shaped block it hard-codes today.
- Extend the `Role` field/column in `federation-config.md` /
  `federation-index.md` to `central | home | coordinator | member`.

## Exit criteria

Maps to adr/0019-multirepo-topology.md acceptance criteria:

1. Bootstrap offers A/B/C, C default. → AC1
2. Topology recorded federation-readably. → AC2
3. Topology C: home holds product-wide, local stay local. → AC3
4. Standalone unaffected. → AC4
5. Chosen once, not re-asked on join. → AC5
6. Each topology produces its defined distinct behaviour (A central-only;
   B distributed + roll-up; C home + local). → AC6
7. Establish/join + §Federation branch per topology; `Role` reflects it. → AC7
8. `node scripts/verify.mjs` stays green.

## Dependencies

The federation foundation (config, member index, identity, references,
roll-up, audit) is shipped; this re-implements the topology layer on top.
On completion ADR 0019 advances Accepted → Implemented (genuinely).

---

Shipped at HEAD `dab737c` on 2026-06-23. Establish/join branch per
topology, topology-aware §Federation clause, and Role values
central|home|coordinator|member. A/B/C now produce distinct behaviour
(AC6/AC7). ADR 0019 → Implemented (honestly; the prior label-only stamp
was voided in r4 and restored in r5). Structural verification only.
