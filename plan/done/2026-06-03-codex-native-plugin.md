# 0011 — Native Codex plugin packaging + clean install docs

Owning ADR: adr/0015-multi-target-portability.md

## Scope

Make Codex a true one-command install (not a manual copy), and replace
the copy-based README instructions for Codex and OpenCode with clean ones.

- Add `.codex-plugin/plugin.json` (mirror of the Claude Code manifest,
  `skills: "./skills/"`) and `.agents/plugins/marketplace.json` (lists the
  docflow plugin) so `codex plugin marketplace add EvolveHQ/docflow`
  works.
- Extend `scripts/verify.mjs` to version-sync **three** manifests
  (package.json, .claude-plugin, .codex-plugin) and check both
  marketplaces list the plugin.
- Update `CONVENTIONS.md` + `AGENTS.md` version-sync rule (three
  manifests).
- README: replace the `cp -r skills/*` blocks — Codex → `codex plugin
  marketplace add`; OpenCode → auto-discovery / symlink (it has no
  marketplace for SKILL.md skills). Update the support matrix.

## Exit criteria

Maps to adr/0015-multi-target-portability.md acceptance criteria:

1. `.codex-plugin/` + `.agents/plugins/marketplace.json` present; README
   shows the one-command Codex install. → AC4
2. verify gate version-syncs three manifests + both marketplaces. → AC2
3. OpenCode README uses auto-discovery / symlink, not a raw copy. → AC4
4. `node scripts/verify.mjs` green.

## Dependencies

Independent. The actual `codex plugin marketplace add` behaviour is
confirmed under plan 0010 (verification on a real Codex install).

---

**Shipped** at HEAD `104a8a6` (2026-06-03). Added `.codex-plugin/
plugin.json` + `.agents/plugins/marketplace.json`; extended verify.mjs to
version-sync three manifests + check both marketplaces; updated
CONVENTIONS + AGENTS version-sync rule; rewrote the README Codex section
(one-command `codex plugin marketplace add`) and OpenCode section
(auto-discovery / symlink), plus the support matrix and Layout. ADR 0015
r2. verify green. ADR 0015 stays Accepted until 0010 (verification) ships.
