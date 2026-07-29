# 0038 — Enumerated constraints: format, extraction, writer, layer

Owning ADR: adr/0036-enumerated-constraints.md

## Scope

Implement the constraints artefact (programme slice S2):

1. **Format docs.** §Constraints in this repo's `CONVENTIONS.md` and
   the scaffolded template: `## CON-<n> r<n> — <title>` entries with
   `source:` (chosen | imposed | learned), `state:` (Active | Removed),
   `authorised-by:`, `statement:`, `check:`. Change discipline: every
   transition needs a human-accepted ADR; no severity; removal is
   permanent (reintroduction = new id, fresh ADR). `AGENTS.md` hard
   rule (own + template): agents never alter `CONSTRAINTS.md` without
   an accepted ADR.
2. **Extraction.** This repo's `CONSTRAINTS.md` with the six existing
   boundaries — ADR privacy, WIP-stays-out, version-sync, gate
   integrity, multi-target parity, language mandate — origin ADRs
   cited where they exist; ADR 0036 authorises the two promoted from
   convention prose (gate integrity, language mandate).
3. **Writer + layer.** `add-convention` routing gains the boundary
   home (creates the file on first use; requires the authorising ADR,
   handing off to the ADR skill when none exists). Bootstrap: Q7
   optional artefact, `templates/CONSTRAINTS.md`, layout tree, re-run
   offer, USAGE output-files row. Audit gains the constraints
   discipline check.
4. **Gate (own commit).** `verify.mjs`: `constraints` legal in
   manifest `layers`; new check — `CONSTRAINTS.md` parseable, unique
   ids, monotonic revisions, legal source/state, `authorised-by`
   resolving to an existing Accepted-or-beyond record.
5. **Dogfood.** Own `docflow.yml` layers gains `constraints` (after
   the gate accepts it); evidence records for ADR 0036's criteria at
   ship.

Out of scope: goals/validation (produce `learned` entries later),
`challenge` elicitation, runtime measurement of product-metric
constraints, any severity/waiver scheme.

## Exit criteria

Maps to adr/0036-enumerated-constraints.md acceptance criteria:

1. Format + discipline documented (own + template). → AC1, AC2
2. Six boundaries extracted with authorising records. → AC3
3. `add-convention` routes boundaries, ADR-gated. → AC4
4. Opt-in layer end to end (bootstrap, template, manifest). → AC5
5. Gate validates the file + layer; own commits. → AC6
6. Audit discipline check present. → AC7
7. Manifest dogfoods the layer; evidence written at ship. → AC8

When this ships, ADR 0036 advances Accepted → Implemented.

## Dependencies

Slices S0–S1 (shipped): manifest, evidence regime.
