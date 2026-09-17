# 0069 — Resolve references left by the audit-blob cleanup

Owning decision: adr/0057-bounded-verification-evidence.md.

## Status

- **Claimed by:** pi, docflow-v1 delivery, 2026-09-17, branch
  `kmox83/docflow-v1-audit-ref-repair`.
- **Blockers:** None. Retained receipts keep their outcomes; only dead links
  and one dead path are corrected.
- **Stopped:**

## Scope

The separate cleanup (merged as PR #16) removed raw host-qualification
artifacts but left dangling local links in the retained receipts and one dead
path in plan 0063. ADR 0057 criterion 5 requires every reference to be
resolved before such a removal. Convert dead local links to plain text, note
that the raw artifacts were relocated under the evidence-bounding decision,
and correct the plan reference. No raw artifact is re-added; no gate change.

## Exit criteria

1. No retained file references a missing local target (markdown links and
   literal `audits/...` paths both resolve).
2. Removed evidence is not silently re-added; retained receipts still state
   their outcomes, hashes and limits, and say where raw evidence now lives.
3. Plan 0063's upgrade reference no longer names a missing file.
4. `node scripts/verify.mjs` and `node evals/run.mjs` pass; versions stay 0.9.4.

## Receipt (2026-09-17)

- Unlinked 59 dead local targets across six retained receipts; each now carries
  one relocation note pointing at ADR 0057. Corrected the plan 0063 upgrade
  reference. No raw artifact re-added; no gate change.
- `node scripts/verify.mjs` exit 0; `node evals/run.mjs` exit 0 (10 passed,
  0 failed, 6 skipped). Whole-repo scan leaves no audit-cleanup dangling link.

## Status at a glance

- **This run:** resolved every reference left by the audit-blob cleanup on a
  signed commit; gates exit 0.
- **Overall:** verified repair; not shipped to main.
- **Yet to do:** coordinator review/integration; optional later static
  enforcement is out of scope per ADR 0057 learnings.
