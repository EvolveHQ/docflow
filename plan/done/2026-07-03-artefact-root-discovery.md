# 0035 — Artefact-root discovery: pointer file, probe order, audit check

Owning ADR: adr/0033-artefact-root-discovery.md

## Scope

Implement the discovery contract:

1. **Bootstrap writes the pointer.** When the chosen artefact root is
   anything other than `.docflow/`, bootstrap writes a `.docflow` file
   at the repository root with the single line `root: <path>`
   (`root: docs/`, `root: .`). No pointer when the root is `.docflow/`
   (the directory is the marker) — which also means the express tier
   (default root) never writes one. Applies at every depth tier and on
   additive re-runs that migrate the root.
2. **Normative precedence documented.** The three-step discovery order
   (marker directory → pointer file → legacy probe of `docs/` then the
   repository root for a `CONVENTIONS.md` artefact-root record) is
   stated in the scaffolded `CONVENTIONS.md` template (§Project, next
   to the artefact-root record) and in README/USAGE.
3. **Audit checks.** `/audit` gains: pointer file present but
   disagreeing with the `CONVENTIONS.md` artefact-root record;
   pointer redundantly naming `.docflow/`; root ≠ `.docflow/` with no
   pointer (surfaced as an offer to add one — migration is offered,
   never forced).
4. **Dogfood.** This repo uses the root layout: add its own `.docflow`
   pointer file (`root: .`).

Out of scope:
- Clarity's consumer-side discovery implementation (docflow-clarity
  catalogue).
- Any change to which roots bootstrap offers or their default.

## Exit criteria

Maps to adr/0033-artefact-root-discovery.md acceptance criteria:

1. Bootstrap writes the pointer for non-default roots, at every depth
   tier; no pointer for `.docflow/`. → AC1, AC2
2. Precedence documented in the scaffolded conventions and
   README/USAGE. → AC3
3. Audit flags disagreement and redundancy; offers (never forces) the
   pointer on legacy repos. → AC4, AC6
4. Federation-file discovery via the resolved root stated in the docs
   where federation placement is described. → AC5
5. This repo carries a valid `root: .` pointer; verify gate green.

When this ships, ADR 0033 advances Accepted → Implemented.

## Dependencies

None. Independent of plan 0034 (lifecycle tier adoption, feedback-
gated) — this item may run first.

---

Shipped at HEAD `37a1798` on 2026-07-03. Pointer written by bootstrap
for non-default roots, precedence documented (template + README/USAGE),
audit check 14 added, this repo carries its own `root: .` pointer.
ADR 0033 → Implemented (r3).
