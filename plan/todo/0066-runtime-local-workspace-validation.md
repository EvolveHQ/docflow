# 0066 — Resolve workspace validation within the native execution context

Owning decisions: adr/0053-portable-workspace-operating-skills.md and
adr/0054-reuse-supplied-choices-and-current-authority.md.

## Status

- **Claimed by:** pi, docflow-v1 delivery, 2026-09-18, branch
  `kmox83/docflow-v1-host-qualification-r2`; reassigned by the operator via the
  workspace controller; predecessor ctx_239ed333d8c6. Predecessor text:
  task `task_856c97a5b36d`; first dispatch `ctx_fc206cf7e4a8` (Codex) stopped on
  a usage limit.
- **Blockers:** Any Cowork qualification needs a concrete bounded proposal and
  separate authorisation; the completion move waits on current-head PR checks
  and controller review.
- **Stopped:**

## Latest checkpoint (continuation dispatch ctx_239ed333d8c6)

The combined candidate (70bae90 plus the reviewed README clarification) passed
static gates and carries its own raw-blob freeze (`DocflowHQ/.docflow_workspace/local/archive/member-audits/docflow/2026-09-15-host-qualification/package-runtime-receipt-freeze.json`).
Both fresh v3 fixtures passed the 338-file installed-source preflight inside
the actual executor runtime before native launch. The one authorised affected
native rerun (fresh assigned case) exercised the new guidance natively: the
executor matched the execution context, verified member Git blobs byte-for-byte
and validated within the same runtime; readiness and two-host reconciliation
satisfy the relevant plan0065 checks (see the 0065 checkpoint). Earlier eed
preparation, line-ending, timing and scope failures keep their original
bindings and outcomes. The bounded Cowork proposal remains the recorded
runtime-diagnosis recommendation; no new Cowork attempt is authorised.

## Authority and finding

Controller `msg_62c465b67cb8` reviewed the source-bound
Cowork runtime diagnosis (`DocflowHQ/.docflow_workspace/local/archive/member-audits/docflow/2026-09-15-host-qualification/cowork-runtime-diagnosis.md`)
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

## Same-session evidence (2026-09-18)

The 2026-09-18 Claude Code workspace-setup probe validated inside a disposable
runtime (validator exit 0), which partially exercises the runtime preflight.
No affected-guidance native rerun or two-host reconciliation ran. Item stays
todo.

### Behavioural matrix update (2026-09-18)
The Claude Code workspace-setup probe validated inside a disposable runtime
(`validate.mjs` exit 0), exercising the runtime-local validation path. No
affected-guidance native rerun or two-host reconciliation ran.

### r3 update (2026-09-18)
Runtime-local validation ran on all three hosts (validator exit 0); two-host reconciliation Claude Code -> Codex ran on one scratch workspace (Codex workspace-sync exit 0). Affected-guidance rerun remains. Item stays todo.
