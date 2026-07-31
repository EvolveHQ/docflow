# 0045 — Goals layer: GOALS.md, serves: edges, COVERAGE, brainstorm emission

Owning ADR: adr/0041-goals-layer.md (Accepted 2026-07-31).

## Scope

- **Template + bootstrap** (AC1, AC7): `templates/GOALS.md`; the layer
  offered at Q7 and at re-runs (arriving with its `CONVENTIONS.md`
  §Goals section, layer-gated like §Constraints); listed in the target
  layout and the core-vs-optional split; excluded from the express
  profile.
- **Authoring surfaces** (AC3): capability-ADR and spec templates gain
  the optional `serves:` front-matter key; the decision and spec
  skills offer the edge when the layer is enabled.
- **brainstorm emission** (AC6): approved outcome-class candidates
  become `GOALS.md` entries; clean refusal + bootstrap offer when the
  layer is absent.
- **audit** (AC4): goal-traceability findings — aspiration, missing
  measure, dangling `serves:`, over-cap; N/A without `GOALS.md`.
- **COVERAGE** (AC5): `scripts/coverage.mjs` generator; `ship-item`
  regenerates `COVERAGE.md` alongside `INDEX.md` where the layer is
  enabled.
- **Gate** (AC2, AC3, AC5): verify.mjs check I — goals-file shape,
  `serves:` resolution, coverage sync. **Ships alone** per gate
  integrity, after the dogfood state it judges exists.
- **Dogfood** (AC2, AC3): `goals` in this repo's manifest layers;
  `GOALS.md` with operator-approved goals; ≥1 resolving `serves:`
  edge; generated `COVERAGE.md`; §Goals in own CONVENTIONS; AGENTS.md
  structure line.
- **Evals**: deterministic cases for the new gate check (own commit,
  gate files ship alone).
- **Docs**: README / USAGE / methodology gain the layer, marked
  in-development beyond the released version.

## Exit criteria

1. AC1–AC7 of the owning ADR evidenced per their `Verify:` methods
   (gate checks live, command green, manual attested). → review
2. Gate and deterministic evals green; gate and eval changes each ship
   alone, named. → gate-check
3. Docflow's own goals approved by the operator before `GOALS.md` is
   committed — goals are the operator's "why", never invented by the
   implementer. → review

## Dependencies

None open — the pilot gate closed 2026-07-31.
