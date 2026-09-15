# 0065 — Repair external-return guidance and qualify a fresh native return

Owning decisions: adr/0052-workspace-authority-and-attempt-records.md and
adr/0053-portable-workspace-operating-skills.md.

## Status

- **Claimed by:** Codex, sole Docflow writer, 2026-09-15, branch
  `kmox83/docflow-v1-host-qualification`; task `task_856c97a5b36d`,
  dispatch `ctx_fc206cf7e4a8`.
- **Blockers:** Fresh affected-guidance native receipts and two-host reconciliation
  are required before completion; combined Clarity/operator acceptance is separate.
- **Stopped:**

## Authority and source boundary

Controller message `msg_bd7a220b5585` narrows the earlier layout approval in
`msg_4bacc53cf2c2` to the reviewed three-file patch after the
source-bound diagnosis in
[native-receipt-usability.md](../../audits/2026-09-15-host-qualification/native-receipt-usability.md).
The original source `f47f4c52313163f1ffe55a97d9c8029602d7c5b4`, its exported
package and all running Cowork/scenario installations stay immutable.
Freeze a new source and output directory after the repair gate, and associate
every later affected-guidance assertion with those new bytes.

## Scope

Clarify external transport versus canonical receipt payload and pre-dispatch
readiness reports. Add the shared procedure to `workspace/README.md` and link it
from `workspace-coordinate/SKILL.md` and `workspace/guides/claude-code.md`.
Document the existing read-only shape API with truthful limits, actual UTC
capture and contained native evidence file references. Preserve original failed
returns and never retrofit missing historical measurements.

Keep canonical schema, validator, receipt shape, Clarity copies and all package
versions unchanged. No new validation framework, runtime, scheduler, installer
or implicit authority. Any additional helper or product path needs controller
scope review before expansion.

## Exit criteria

1. The shared procedure gives an executable dependency-free read-only recipe,
   with retained actual output and exit for both valid and invalid payloads,
   distinguishes shape validation from native source/authority/truth, and keeps
   a readiness report without an attempt out of `runs.receipt`.
2. Static and deterministic gates pass. A new source SHA and per-file package
   hashes are frozen in a dedicated new output directory; old evidence stays
   bound to the original package.
3. A fresh actual external executor under a current grant and native claim
   returns an unamended valid receipt with real native file references, measured
   check/return times, exact commands/exits/output and native session binding.
   Independent snapshots prove no canonical/member mutation by that executor.
4. A separate native readiness stop creates no attempt or canonical receipt.
   Two different actual harnesses perform return and reconciliation under
   explicit scope, preserving source/receipt history and parent completion limits.
5. Signed evidence commits and current-head PR checks pass. Completion remains
   prepared on the PR branch until controller integration; no release authority.
