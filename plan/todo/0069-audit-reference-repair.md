# 0069 — Keep audit material out of the product repository

Owning decision: adr/0057-bounded-verification-evidence.md.

## Status

- **Claimed by:** pi, docflow-v1 delivery, 2026-09-17, branch
  `kmox83/docflow-v1-audit-ref-repair`.
- **Blockers:** None. The committed audit directory that predates the bound is
  removed by this item's follow-up change, never inside the policy change.
- **Stopped:**

## Scope

The operator follow-up of 2026-09-16 sets **zero committed audit files** in the
product repository and forbids adding, modifying, restoring, moving or
referencing anything under `audits/`. Revert the audit-file edits made earlier
in this task so this change touches no `audits/` path; keep only the plan-queue
work; record the relocation note here and in the PR body; and strengthen the
bound in the owning decision and the conventions.

This item also owns removal of the audit material still committed before the
bound. That removal is a separate change under this item — never mixed into the
policy change — because it must also clear the references held by ADRs and the
plan queue.

## Exit criteria

1. This change adds, modifies, moves or restores no `audits/**` file; the net
   audit diff against `kmox83/docflow-v1-integration` is empty.
2. The relocation note lives here and in the PR body: raw and historical audit
   material is archived at
   `DocflowHQ/.docflow_workspace/local/archive/member-audits/docflow/` and
   referenced by content hash only.
3. ADR 0057 and `CONVENTIONS.md` state the zero-committed-audit bound, the
   plan-item/PR-body receipt location and the archive location, with matching
   acceptance criteria.
4. Plan 0063's upgrade reference points to archived evidence by content hash
   and names no repository audit path.
5. The follow-up removal change deletes the committed audit directory, clears
   every reference to it from ADRs and the plan queue, and passes the gates.
   `node scripts/verify.mjs` and `node evals/run.mjs` pass and all three
   manifests stay at 0.9.4 on both changes.

## Relocation note (2026-09-17)

Raw and historical audit material for this repository is archived outside the
product repository at
`DocflowHQ/.docflow_workspace/local/archive/member-audits/docflow/`, referenced
by content hash and revision only. No repository `audits/` path is repointed.

## Receipt (policy change)

- Reverted all six `audits/**` edits from this task; the net audit diff against
  the integration branch is empty. No audit file is added, modified or restored.
- `node scripts/verify.mjs` exit 0; `node evals/run.mjs` exit 0 (10 passed,
  0 failed, 6 skipped).
- Task PR: see the PR body; `gh pr diff 17 --name-only` lists no `audits/` path.

## Status at a glance

- **This run:** reverted the audit edits, kept only the plan-queue work, and
  tightened ADR 0057 + `CONVENTIONS.md` to zero committed audit files; gates
  exit 0.
- **Overall:** policy change verified; the committed audit directory is still
  present and is removed by this item's follow-up change.
- **Yet to do:** the follow-up removal and reference clearing; coordinator
  review and integration. No merge, tag or release authority.
