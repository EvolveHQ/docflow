# DeepSeek Harness workspace guide

Guide revision 1; installed package `@deepseek-ai/dsh` 0.1.1-rc.2,
launcher help/version checked 2026-09-15 on Windows. The package is off PATH
in the observed environment; resolve its real installed launcher explicitly.

```text
node "<installed-dsh>/lib/bin.js" --help
node "<installed-dsh>/lib/bin.js" --version
node "<installed-dsh>/lib/bin.js" --profile web --help
```

With an already installed/configured profile and explicit launch authority,
`dsh --profile web` (or the same node launcher) starts the native web
profile from the selected working directory. The launcher accepts flags
before profile arguments. First use of a default profile can initialise
configuration, so do not launch an absent profile during a read-only check.
[Official CLI guide](https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/cli/README.md).

Supply the complete brief and read list explicitly; project-root detection,
instruction budgets and enabled skill-provider plugins affect context.
Do not install a custom Docflow plugin, silently call pnpm or infer that a
documented headless profile is configured. Record the actual profile and
provider outcome; native web authentication and brief/receipt smoke are unrun.

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

