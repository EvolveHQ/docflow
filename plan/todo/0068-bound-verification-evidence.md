# 0068 — Bound verification evidence to one concise receipt per plan item

Owning decision: adr/0057-bounded-verification-evidence.md.

## Status

- **Claimed by:** pi, docflow-v1 delivery, 2026-09-16, branch
  `kmox83/docflow-v1-evidence-bound`.
- **Blockers:** None for the policy change. Automatic enforcement and the
  relocation of pre-existing audits are separately scoped.
- **Stopped:**

## Scope

Author the evidence-bounding decision and state the same bound in
`CONVENTIONS.md`. Do not add audit, log or large-artifact files, and do not
attempt a bulk deletion of the pre-existing committed audits — note the
required cleanup instead and leave it to a separate bounded item.

## Exit criteria

1. ADR 0057 records the bound: at most one concise receipt per plan item; raw
   transcripts, logs, JSON dumps, archives, screenshots and long verification
   narratives are forbidden; raw evidence is referenced by content hash.
2. `CONVENTIONS.md` states the same bound consistently, listing the forbidden
   artifact kinds.
3. This change adds no audit or large-log file; pre-existing audits are
   untouched and any dangling-reference risk from their future removal is left
   to a separate bounded item.
4. `INDEX.md` is regenerated; `node scripts/verify.mjs` and
   `node evals/run.mjs` pass; all three manifests stay at 0.9.4.

## Receipt (2026-09-16)

- ADR 0057 authored; `CONVENTIONS.md` §Verification Evidence states the same
  bound; `INDEX.md` regenerated (57 ADRs).
- `node scripts/verify.mjs` exit 0 (`57 ADRs`); `node evals/run.mjs` exit 0
  (`10 passed, 0 failed, 6 skipped`).
- No audit or large-log file added. Pre-existing audits untouched: 28 inbound
  references from ADRs, `plan/done` and `plan/todo` mean their relocation needs
  a separate bounded item (ADR 0057 criterion 5), noted in the task PR.

## Status at a glance

- **This run:** recorded the evidence bound in ADR 0057 and `CONVENTIONS.md`;
  gates exit 0; no artifacts added.
- **Overall:** verified policy change; not shipped to main.
- **Yet to do:** coordinator review/integration; separate bounded relocation of
  the pre-existing audits; optional later static enforcement.
