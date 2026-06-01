# Dual-target packaging from one skill source

Owning ADR: adr/0008-dual-target-packaging.md

Ship the same `skills/` tree to Claude Code (`.claude-plugin/`) and pi
(`package.json` `pi.skills`); skill prose kept agent-neutral, invocation
forms moved to `README.md`.

Shipped at HEAD `042786e` (2026-05-22, dual-target packaging); rename in
`65193f0`, agent-neutral references in `034f52c`.
