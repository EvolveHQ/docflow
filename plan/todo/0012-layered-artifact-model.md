# 0012 — Implement the layered artifact model

Owning ADR: adr/0016-layered-artifact-model.md

## Scope

Make `_agent/` (and the other non-core artefacts) genuinely opt-in, and
declare the minimal core, in the `bootstrap` skill + templates.

- `bootstrap/SKILL.md`: declare the always-on **core** (AGENTS.md,
  CLAUDE.md, CONVENTIONS.md, adr/0000-template.md, INDEX.md); make
  `_agent/` an opt-in layer (new question or fold into Q5) alongside the
  existing `plan/` (Q4a) and GLOSSARY/domains (Q7) options.
- Ensure lifecycle skills (`new-plan`, `ship-item`, `agent-wave`, `audit`)
  refuse cleanly when an opted-out layer is absent (most already do —
  confirm/strengthen).
- Document the core-vs-optional tiering in `README.md` / `USAGE.md`.

## Exit criteria

Maps to adr/0016-layered-artifact-model.md acceptance criteria:

1. Bootstrap always writes the core; nothing else is mandatory. → AC1
2. `plan/`, `_agent/`, GLOSSARY, domains are opt-in; omitting any leaves a
   valid repo. → AC2
3. Skills refuse cleanly against a missing layer, naming what's absent.
   → AC3
4. Tiering documented. → AC4
5. `node scripts/verify.mjs` stays green.

## Dependencies

Foundation for 0013 (artifact root) — do first or together.
