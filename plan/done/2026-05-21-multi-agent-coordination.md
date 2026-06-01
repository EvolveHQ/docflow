# Configurable multi-agent coordination modes

Owning ADR: adr/0005-multi-agent-coordination.md

Three coordination modes — single / shared-checkout / worktree — each
selecting the `_agent/` file shapes (LOCKS, WORKLOG merge strategy,
CURRENT_FOCUS vs IN_FLIGHT).

Shipped at HEAD `8d9e3a0` (2026-05-21, three-option multi-agent mode).
