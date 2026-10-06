---
title: Worked workspace example
permalink: /workflows/worked-example/
---

# Worked example: API and mobile deliveries

This is a **synthetic learning fixture**, distributed with the package. It
shows the complete record connections and interrupted delivery without
asserting real approvals, execution or native host acceptance. Browse it
read-only; copy it into scratch before experimenting. Never import its
identities, grants, timestamps or receipts into a real workspace.

## Inspect and validate the packaged example

Run from any authorised shell that can read your installed assets:

```bash
DOCFLOW_ASSETS="/absolute/path/to/installed/workspace"
node "$DOCFLOW_ASSETS/validate.mjs" "$DOCFLOW_ASSETS/fixtures/two-repository" --at 2026-09-15T13:00:00Z
```

The historical time is intentional for this frozen synthetic example. Expect
exit 0 and an active shared work item, an accepted agreement, a complete API
delivery and an incomplete mobile delivery. For your actual workspace,
validate at the actual current UTC time. A valid example is not a grant to act.

Read these files under `fixtures/two-repository/.docflow_workspace/`:

| File | What to inspect |
|---|---|
| `workspace.yaml` | API uses `AGENTS.md`; mobile uses `README.md`. Their paths and native methods remain distinct. |
| `ideas/reliable-exports--123456781111.md` | A selected priority, without execution authority. |
| `decisions/preserve-legacy-response--234567892222.md` | Accepted shared agreement; delivery is tracked separately. |
| `knowledge/legacy-client-observation--456789014444.md` | The sourced reason compatibility matters. |
| `work/deliver-compatible-exports--345678903333.md` | Required deliveries, criterion, grant revisions and separate observations. |
| `runs/api-interrupted--567890125555.md` | A stopped attempt, retained in history. |
| `runs/api-reassigned--678901236666.md` | A later successful return linked to reconciled predecessor evidence. |
| `runs/mobile-revoked--789012347777.md` | A stopped attempt after authority revocation; mobile remains incomplete. |

The API member's native decision can be `Implemented` while the shared work
stays `active`. The successful API run does not satisfy the missing mobile
delivery or prove combined validation. Completing work would require checked
native completion and passed evidence for **every** required delivery and
criterion; the still-current agreement would remain accepted.

## Turn that model into real work

1. **In your workspace home:** use `workspace-status` to read your actual
   members and current ownership. Use `workspace-scope` to plan a compatible
   API/mobile change with separate deliveries and a combined acceptance check.
   Start observations as unknown and evidence lists empty.
2. **In each member root:** create the native task through that member's
   method. Read its instructions, integration rules and claim sources. Use
   `new-plan` only where the member actually uses Docflow; an issue/PR-based
   member retains that process.
3. **In the workspace home:** record only genuinely authorised acceptance and
   grants, citing the committed operator mandate by path and revision. Use
   `workspace-dispatch` only after checking actor, effects, exact grant and
   scope revisions, time limits, native claim, dependencies and resources.
4. **In the assigned member context:** execute the bounded brief. Return actual
   commands, exits, source revisions, timed observations, blockers and next
   action. Use the packaged receipt form and external return envelope described
   in the [asset guide](https://github.com/EvolveHQ/docflow/blob/main/plugins/docflow/workspace/README.md#external-returns).
   A readiness blocker before any attempt starts is a report, not a run receipt.
5. **Back in the workspace home:** `workspace-sync` checks the return against
   the brief and current authority, then independently observes native merge
   and required checks. Keep a prepared PR open. If one delivery fails or is
   revoked, preserve that state and the successful sibling delivery; do not
   declare parent completion or dispatch a replacement merely from silence.

## Try a rejected state in scratch

This copies the fixture and applies one supplied adverse recipe. It writes
only the new scratch destination and never runs native member commands:

```bash
EXAMPLE_SCRATCH="$(mktemp -d)"
node "$DOCFLOW_ASSETS/fixtures/materialise.mjs" invalid-agreement-state "$EXAMPLE_SCRATCH/invalid"
node "$DOCFLOW_ASSETS/validate.mjs" "$EXAMPLE_SCRATCH/invalid" --at 2026-09-15T13:00:00Z
```

Expect materialisation exit 0 and validation exit 1 with a schema diagnostic.
Read the diagnostic and unchanged sibling records. A failing workspace stays
readable, while dependent writes stop. This rejection is an expected learning
result, not a package test failure.

Continue with [daily work]({{ '/workflows/day-to-day/' | relative_url }}) or
[recovery]({{ '/workflows/recovery/' | relative_url }}), or return to the
[workflow hub]({{ '/workflows/' | relative_url }}).
