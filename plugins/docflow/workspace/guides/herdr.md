# Herdr workspace guide

Guide revision 1; `herdr` CLI reference checked 2026-09-19 (the installed
binary is the authority for its own syntax). Herdr is a terminal multiplexer
for coding agents: it recognises an agent occupying a pane and exposes the
current session through the `herdr` CLI. Use it when the operator already
works inside a Herdr session; it is not a scheduler, a launch service or an
authority source.

Confirm the caller is inside a managed pane before any control command:

```bash
test "${HERDR_ENV:-}" = 1
herdr --help
```

Use `herdr agent` and `herdr pane` (without a subcommand) to print the
installed command groups. Read identifiers from JSON replies instead of
predicting them. Never close or reconfigure panes the caller did not create.

## Mapping workspace-dispatch and workspace-sync

Herdr owns tabs, panes and agent lifecycle; Docflow owns the portable brief
and receipt. The mapping is:

- **workspace-dispatch → `herdr agent prompt`.** Give the bounded brief to the
  agent standing for the assigned repository in one prompt, then wait for a
  settled state. `--wait` already waits for the first `idle`, `done` or
  `blocked` state; do not repeat those defaults with `--until`.

  ```bash
  herdr agent prompt <repo>-<goal> "<portable brief: grant, scope, revisions, checks, stopping point, return path>" --wait --timeout 120000
  ```

- **workspace-sync → `herdr agent read` and `herdr agent wait`.** Read the
  returned result from the same agent, and wait on a state transition when the
  assignment is still running. Reconcile only from checked native evidence.

  ```bash
  herdr agent read <repo>-<goal> --source recent-unwrapped --lines 120
  herdr agent wait <repo>-<goal> --timeout 120000
  ```

- **One agent per tab, named `<repo>-<goal>`.** A Herdr agent name follows the
  current pane occupant, must match `[a-z][a-z0-9_-]{0,31}` and is unique
  among live agents. Name it for the member repository and the goal so a
  multi-repository wave stays legible; do not reuse a name after the agent
  exits or is replaced.

- **Move a completed agent into its own tab.** When a delivered assignment
  should be parked without ending the process, move its pane to a new tab:

  ```bash
  herdr pane move --new-tab <pane-id>
  ```

  A moved pane receives a new workspace-qualified pane ID; continue with
  `.result.move_result.pane.pane_id` or the live agent name. `blocked` means
  Herdr recognised an approval or question UI: inspect `herdr agent get` and
  `herdr agent read` and ask the operator before answering it. `unknown` does
  not prove completion. Contact loss is not worker exit; preserve unresolved
  ownership until reconciled native exit evidence permits a new run.

Background work keeps user focus unchanged (`--no-focus`), and every prompt
carries the brief only — selection and agreement grant no execution authority.
A queued or working agent is not a completed receipt.

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
