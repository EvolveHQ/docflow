# 0069 — Keep audit material out of the product repository

Owning decision: adr/0057-bounded-verification-evidence.md.

## Status

- **Claimed by:** pi, docflow-v1 delivery, 2026-09-17, branch
  `kmox83/docflow-v1-audit-ref-repair`.
- **Blockers:** None. Both changes — the policy bound and the committed-audit
  removal — are complete; only coordinator review and integration remain.
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

## Receipt (audit removal, 2026-09-17)

- Deleted the committed audit directory. Every `audits/…` reference now points
  at the workspace archive; no repository path under `audits/` remains.
- Rewrote references in three ADRs, three `plan/done` items, eleven `plan/todo`
  items and one eval receipt. ADR edits are link fixes and are flagged
  `editorial` in the commit message.
- `node scripts/verify.mjs` exit 0; `node evals/run.mjs` exit 0 (10 passed,
  0 failed, 6 skipped); the touched eval receipt still parses as JSON.
- Content-hash index of the archived evidence now referenced:

| Archived file under `DocflowHQ/.docflow_workspace/local/archive/member-audits/docflow/` | SHA-256 |
|---|---|
| `2026-09-13-host-verification.md` | `1bc43e389e39a10e5d221371dfcb0e42e3563471da6eb7778982a16819dedce7` |
| `2026-09-13-pi-qwen-continuation.md` | `7ae1465b4f3dbe5e91602b5e5e5abccd7bb2093348f4db26f44f767f41f73c65` |
| `2026-09-14-cowork-continuation.md` | `3460e0db15184b4558f86fe6ab1b7aec6f80eac195deb20dcf4a1611e4b5f2cc` |
| `2026-09-14-release-verification.md` | `1a218d91f230260258d50740a24828b2ac5627036b219789aa3fbfff4a2203a8` |
| `2026-09-15-workspace-foundations.md` | `c22c0088c7e780470f5e90122849843034d73741bf640021038ef17b44b016c8` |
| `2026-09-15-workspace-skills.md` | `0eda658f0facfded5e873cb20192e67ec78febaf8330d7d5466b2edfff98d08b` |
| `2026-09-15-clarity-release-preparation.md` | `ec27f1bb0f4201261ce77992b4e19768106cdcd43462e0ba5be03c35790ef613` |
| `2026-09-15-host-qualification/README.md` | `9f6c721eb484ba9898c96b233582e95ac32810f09ebfe448ca99bb1fe76a7bb1` |
| `2026-09-15-host-qualification/scenarios-ctx_59ed70a00d5e/report.md` | `e69f265fa2993d2521ac94ef5b9cdedf0ff55ec0ba3464d86029b894227fae26` |
| `2026-09-15-host-qualification/package-runtime-receipt-freeze.json` | `c6bb9600ffc3ac0f18ded8f1c3a25490bbe2ed052532a88e32f6ebe4d85eb7c6` |
| `2026-09-15-host-qualification/native-receipt-usability.md` | `abcac6c153b32bbb86857ebd23823b71881fc2747d88c1f3c06736b081f77e12` |
| `2026-09-15-host-qualification/cowork-runtime-diagnosis.md` | `af628b08c06fe95dbbe190374046eca02cd522f6bb9c1137693d834baf9788a1` |

## Status at a glance

- **This run:** completed both 0069 changes — the zero-committed-audit policy
  (PR #17) and the removal of the committed audit directory with every
  reference rewritten to the workspace archive; gates exit 0.
- **Overall:** verified. The product repo now commits no audit file.
- **Yet to do:** coordinator review and integration of the removal change. No
  merge, tag or release authority.
