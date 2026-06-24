# 0010 — Verify docflow on Codex, OpenCode, and Cowork

Owning ADR: adr/0015-multi-target-portability.md

## Scope

Behavioural verification on the three new targets — turns "compatible by
format" into "verified working." Requires a machine with each agent
installed (cannot be run from a Claude Code session).

For each of Codex, OpenCode, Cowork:
1. Install docflow per the documented path — for **Codex** confirm
   `codex plugin marketplace add EvolveHQ/docflow` + `codex plugin add
   docflow@evolvehq` resolves the plugin (the `.codex-plugin/` +
   `.agents/plugins/marketplace.json` from plan 0011); OpenCode via
   auto-discovery/symlink; Cowork via the Claude Code plugin.
2. Run `bootstrap` on a throwaway repo with scripted answers (the
   assessment falls back to plain text where there is no select tool).
3. Run one lifecycle skill (e.g. `new-adr`) and confirm the output
   (contiguous number, INDEX, expected files).
4. Record the result.

## Exit criteria

Maps to adr/0015-multi-target-portability.md acceptance criteria:

1. `bootstrap` + one lifecycle skill run successfully on Codex,
   OpenCode, and Cowork; results recorded. → AC5

When this ships, ADR 0015 advances Accepted → Implemented.

## Dependencies

Independent of 0009. **Blocked** on access to Codex / OpenCode / Cowork
installs (operator-run, not runnable from this environment).

## Verification log

- **2026-06-23 — Claude Code plugin path (= the Cowork artefact): PASS.**
  Behavioural smoke-run in a Claude Code session on a throwaway repo:
  `bootstrap` scaffolded the core with `AGENTS.md`/`CLAUDE.md` at the repo
  root and `adr/`+`INDEX.md` under a `docs/` artefact root, with `_agent/`
  omitted (Q5 = None) — exercising both the layered-model (ADR 0016) and
  configurable-root (ADR 0017) features. `new-adr` then resolved the root
  from `CONVENTIONS.md`, minted a contiguous `0001` under `docs/adr/`, and
  regenerated `docs/INDEX.md` (status `Proposed`). All assertions passed.
  Cowork runs this identical plugin, so this stands in for the Cowork path;
  it does **not** replace a run on a real Cowork install.
- **Codex install:** verified on real Codex per ADR 0015 r3 (`marketplace
  add` → `plugin add docflow@evolvehq` → all skills installed). A
  behavioural `bootstrap`+`new-adr` run on real Codex is **still pending**.
- **OpenCode:** no verification yet.

## Turnkey operator steps (to close AC5)

Run on a machine with each agent installed; record PASS/FAIL here.

1. **Codex** — `codex plugin marketplace add EvolveHQ/docflow` → `codex
   plugin add docflow@evolvehq`; `$bootstrap` on a throwaway repo (scripted
   answers; assessment falls back to plain text); then `$new-adr`; confirm
   contiguous number + INDEX + expected files.
2. **OpenCode** — make the skills discoverable (auto-discovery of a
   `.claude`/`.agents` skills dir, or copy into `.opencode/skills/`); invoke
   `bootstrap` by description; then `new-adr`; confirm output.
3. **Cowork** — install the Claude Code plugin from the marketplace;
   `/bootstrap` then `/new-adr` on a throwaway repo; confirm output.

When all three are recorded PASS, this item ships and ADR 0015 →
Implemented.
