# Native workspace guides

These are prompt-led guides to existing host commands and UI. Choose the
operator's native host; Docflow supplies portable records, never a scheduler
or automatic launch service. Native repository rules and permissions win.
Guide revision 1 was checked against installed help or primary documentation
on 2026-09-15; later versions require rechecking. The Herdr and VS Code agent
mode guides were added for V1 and their entry points checked 2026-09-19.

| Guide | Entry-point evidence | Native brief/receipt smoke |
|---|---|---|
| [Claude Code](claude-code.md) | Installed CLI help/version | Unrun |
| [Codex App](codex-app.md) | Installed app-launcher help; official docs | Unrun |
| [Cursor](cursor.md) | Official editor/Agent docs; local editor CLI broken | Unrun; CLI access blocked |
| [DeepSeek Harness](deepseek-harness.md) | Installed launcher help/version | Unrun |
| [Herdr](herdr.md) | Installed `herdr` CLI reference, checked 2026-09-19 | Unrun |
| [VS Code agent mode](vscode-agent-mode.md) | Official VS Code / Copilot docs, checked 2026-09-19 | Unrun |
| [Orca](orca.md) | Installed version-matched guides | Unrun |

These seven guides are distinct from the eight package installation targets
(Claude Code, pi, Codex, OpenCode, Grok, Cursor, omp and Copilot). Static
package discovery tests do not qualify any native host. All required native
smokes remain required; unavailability is not a reduced support promise.

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

- **This run:** Provides seven source-checked entry guides and ordinary-file fallback.
- **Overall:** partially verified — native host behaviour is unqualified.
- **Yet to do:** Seven smokes, two-host continuation, eighteen workspace scenarios,
  eight-target discovery and combined Clarity/operator qualification.
