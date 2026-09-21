# VS Code agent mode workspace guide

Guide revision 1; official VS Code and GitHub Copilot documentation checked
2026-09-19. VS Code agent mode runs the Copilot coding agent inside the editor.
It reads the member repository's own instructions and exposes reusable prompt
files, custom instructions and agent skills; Docflow still owns the portable
brief and receipt and grants no execution authority by itself.

Open the workspace home (or the member repository) in VS Code and confirm the
integrated agent surface is available. Instructions are read in layers, so
read the member's instructions and the workspace records explicitly rather
than assuming ancestor files merge:

- `AGENTS.md` at the repository root;
- `.github/copilot-instructions.md` for Copilot-wide guidance;
- `.github/instructions/**/*.instructions.md` for path-scoped rules;
- `.github/prompts/**/*.prompt.md` for reusable prompt files.

[Custom instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
and [prompt files](https://code.visualstudio.com/docs/copilot/customization/prompt-files).

Skills are discovered from the same locations the Copilot CLI uses:
`.github/skills/`, `.agents/skills/` or `.claude/skills/` in the project, and
`~/.copilot/skills/` or `~/.agents/skills/` for the user. A standalone copy
also needs the complete Docflow assets beside the skills as
`docflow-workspace/`. A selected skill appears through the agent's skill
picker; the README carries the invocation forms.

For workspace work, open the portable brief as explicit context (attach the
brief file or paste it into the chat) and name the member repository and goal.
Do not ask the agent to search outside the authorised roots; ordinary file
tools may enumerate more than the read scope permits.

## Bounded brief and receipt smoke

Run later in an isolated, operator-approved fixture with the candidate package
pinned. This procedure is a test specification, not a record of a passing run.

1. Confirm the actual host version, platform, mode, project path, discovered
   skill path/hash and accessible member/workspace roots. Resolve assets using
   bootstrap's locator; read CONTRACT and native member instructions explicitly.
2. Have workspace-dispatch prepare a read/test/report assignment with an
   actual current grant and source-bound native claim, dependencies/resources,
   exact revisions, required checks, stopping point and return path.
3. Open the brief in this native session. Identify full work/run identities,
   actor, current grant revision and member base before acting. The executor
   may be outside the workspace; send only the approved context snapshot.
4. Execute the declared bounded check under normal native permissions. Return
   the exact command, exit, output, source evidence, blockers and next action.
   If canonical writes are unavailable, return the receipt externally for the
   authorised coordinator to reconcile. Clarity may copy/view/handoff only.
5. Repeat with expired authority and a denied action. The dependent action must
   stop across routes. Interrupt contact: preserve unknown ownership until
   reconciled native exit evidence permits a new run. Test a continuation in
   another named host with the same portable brief/receipt contract.
6. Reconcile exact evidence in Docflow, validate and refresh Clarity. Compare
   canonical hashes before/after a Clarity-only view/copy session; unchanged
   bytes are required. Preserve selected versus used assets and native claims.

Stop at the brief boundary. No guide grants permission, installs a dependency,
creates a background service or automatically launches another host. A help
command passing proves syntax/access only. Missing authentication, model access,
native discovery, permissions or returned evidence remains blocked/unknown.

## Status at a glance

- **This run:** Documented native entry points and a bounded smoke procedure.
- **Overall:** partially verified — command/documentation checks only; native smoke unrun.
- **Yet to do:** Execute this guide on the integrated candidate; record exact
  host/platform/source and brief/receipt evidence, including adverse outcomes.
