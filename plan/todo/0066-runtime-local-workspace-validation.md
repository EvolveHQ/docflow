# 0066 — Resolve workspace validation within the native execution context

Owning decisions: adr/0053-portable-workspace-operating-skills.md and
adr/0054-reuse-supplied-choices-and-current-authority.md.

## Status

- **Claimed by:** Codex, sole Docflow writer, 2026-09-15, branch
  `kmox83/docflow-v1-host-qualification`; task `task_856c97a5b36d`,
  dispatch `ctx_fc206cf7e4a8`.
- **Blockers:** Affected native qualification requires the new frozen source;
  another Cowork session or plugin change is not authorised.
- **Stopped:**

## Authority and finding

Controller `msg_62c465b67cb8` reviewed the source-bound
[Cowork runtime diagnosis](../../audits/2026-09-15-host-qualification/cowork-runtime-diagnosis.md)
and approved the one-file README proposal, SHA-256
`274b871cb5e7871cc5d2fc321dd49a4254036a24df6ddc21052a36195d43662f`,
with the editorial correction that the context must **run** Node.js 22+.
The native cloud validator could not see the device workspace; its existing
same-revision attached assets were not used. Two native exit-1 results and the
missed controller stop deadline remain failures.

## Scope

Clarify only `plugins/docflow/workspace/README.md`: check the execution
filesystem before setup, distinguish native discovery from a permitted explicit
same-revision asset root, and preserve strict briefs and denial boundaries.
No schema, validator, template, version, Clarity, host setting or plugin change.
Freeze the combined receipt/runtime guidance in a new directory and retain both
f47 and eed source packages unchanged. Already started eed cases keep their
source binding and original outcomes.

## Exit criteria

1. The approved bounded clarification is readable, agent-neutral and explicit
   about runtime access, matching source bytes and current authority.
2. Static/eval gates pass; signed product commit and a separate raw-blob source
   freeze identify all distributed skills/assets without a version change.
3. A byte-exact disposable fixture passes preflight in the actual executor
   runtime before the one authorised affected native rerun; retain earlier
   preparation, line-ending, timing and scope failures without relabelling them.
4. Fresh external/readiness and genuine two-host reconciliation evidence under
   the combined candidate satisfies the relevant plan0065 checks, or remains
   explicitly incomplete. A concrete bounded Cowork proposal precedes any
   separately authorised Cowork qualification.
5. Current-head PR checks pass and controller review accepts the evidence;
   integration, release and the real operator pilot remain separate prerequisites.
