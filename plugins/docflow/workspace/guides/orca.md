# Orca workspace guide

Guide revision 1; installed CLI/runtime reference checked 2026-09-15,
Orca 1.4.201 on Windows. Use the executable selected by the host's Orca CLI
skill; the examples below show the checked local `orca` binary.

```text
orca skills get orca-cli
orca skills get orchestration
orca status --json
orca worktree current --json
orca terminal list --json
```

These installed guides are the authority for this version's commands. Keep
Orca ownership of its worktrees/tasks and copy actual returned handles. Use an
existing session for a manual brief handoff. If supervised orchestration is
explicitly authorised, the installed guide documents:

```text
orca orchestration worker-start --spec "<bounded task>" --worktree current --agent codex --json
```

This command launches work and has native side effects; invoke it only under
the current assignment and after native claims/dependencies/resources pass.
Use the injected lifecycle preamble for replies and completion; never invent
task/dispatch IDs or capabilities. A queued prompt is not a completed run.
Unknown contact cannot justify a duplicate launch or resource release.
Official context: [worktrees](https://www.onorca.dev/docs/model/worktrees).

## Bounded brief and receipt smoke

Run later in an isolated, operator-approved fixture with the candidate package
pinned. This procedure is a test specification, not a record of a passing run.

1. Confirm the actual host version, platform, mode, project path, discovered
   skill path/hash and accessible member/workspace roots. Resolve assets using
   bootstrap's locator; read CONTRACT and native member instructions explicitly.
2. Have workspace-coordinate prepare a read/test/report assignment with an
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

