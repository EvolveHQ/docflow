# Native workspace guides

These are prompt-led guides to existing host commands and UI. Choose the
operator's native host; Docflow supplies portable records, never a scheduler
or automatic launch service. Native repository rules and permissions win.
Guide revision 1 was checked against installed help or primary documentation
on 2026-09-15; later versions require rechecking.

| Guide | Entry-point evidence | Native brief/receipt smoke |
|---|---|---|
| [Orca](orca.md) | Installed version-matched guides, 1.4.201 | Unrun |
| [Cursor](cursor.md) | Official editor/Agent docs; local editor CLI broken | Unrun; CLI access blocked |
| [Claude Code](claude-code.md) | Installed CLI 2.1.271 help/version | Unrun |
| [DeepSeek Harness](deepseek-harness.md) | Installed 0.1.1-rc.2 launcher help/version | Unrun |
| [ZCode](zcode.md) | Official UI docs; coordinator desktop preflight | Unrun |
| [Codex App](codex-app.md) | Installed app-launcher help; official docs | Unrun |

These six guides are distinct from the five package installation targets
(Claude Code, Cowork, pi, Codex and OpenCode). Static package discovery tests
do not qualify any native host. All required native smokes remain required;
unavailability is not a reduced support promise.

## Ordinary-file baseline

Read registry, conventions, current records and native instructions directly.
From the authorised workspace root, use an available ordinary file tool, for
example `rg --files --hidden .docflow_workspace` and
`rg -n --hidden "next_action|blockers|accepted" .docflow_workspace`.
Open matched canonical files and bind observations to their Git revision or
content hash. Exclude ignored local caches and private/member data outside the
scope; file tools can enumerate more than the allowed scope if asked broadly.
A missing search tool falls back to explicit reads. A missing/stale index
never hides current claims or overrides current grants.

See [recommendations](recommendations.md) for contextual reference/enable/use
and [experimental retrieval](retrieval-experimental.md) for an optional
local-only pilot. Add nothing when ordinary files suffice.

## Status at a glance

- **This run:** Provides six source-checked entry guides and ordinary-file fallback.
- **Overall:** partially verified — native host behaviour is unqualified.
- **Yet to do:** Six smokes, two-host continuation, eighteen workspace scenarios,
  five-target discovery and combined Clarity/operator qualification.

