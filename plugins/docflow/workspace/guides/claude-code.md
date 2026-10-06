# Claude Code workspace guide

Guide revision 1; installed `claude --help` and `claude --version`
checked 2026-09-15, version 2.1.271 on Windows.

```text
claude --help
claude --plugin-dir "<installed-docflow-plugin>"
claude --resume "<session-id>"
```

Run from the selected member directory. The plugin directory must contain
both skills and workspace assets. The installed help confirms plugin-dir
and resume; [official CLI reference](https://code.claude.com/docs/en/cli-reference)
describes their scope. Supply the portable brief and accessible native
instructions in the prompt. Use normal permissions; a role's prose is not a
native tool policy.

An existing local plugin or detached skill copy must resolve the same fourteen
skill sources. Refer to the README for invocation forms. Validate whether
the member's instructions and external workspace context were actually read.
Use the asset README's [external-return procedure](../README.md#external-returns)
for a read-only executor: keep actual session/subagent identity in the external
context and the strict canonical payload in `receipt`, then run its read-only
shape check. A pre-dispatch readiness stop is a report, not a fabricated attempt.
A resumed conversation
must recheck grants and claims rather than treating old context as authority.

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

