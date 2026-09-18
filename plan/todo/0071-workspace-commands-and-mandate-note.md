# 0071 — Five workspace commands and a committed mandate note

Owning decisions: adr/0059-five-workspace-commands-and-mandate-note.md (new;
supersedes adr/0053); adr/0051, adr/0052 and adr/0054 where they are extended.

## Status

- **Claimed by:** pi, docflow-v1 delivery, 2026-09-18, branch
  `kmox83/docflow-v1-workspace-commands`.
- **Blockers:** None for the offline restructure. Clarity mandate-note parity and
  the PR #20 re-run on these bytes are separate.
- **Stopped:**

## Scope

Rename and restructure the workspace commands into five skills; split
`workspace-coordinate` into `workspace-dispatch` and a new `workspace-sync`;
add the committed operator mandate note (schema, validator, template and
CONTRACT); and update every manifest, marketplace, sidecar, guide, doc, template
and eval that names the old set or the skill count. Keep versions at 0.9.4,
five-target parity, en-GB, and no ADR identifiers in user-visible surfaces. No
audit or raw files; one concise receipt.

## Exit criteria

1. ADR 0059 criteria 1–6 are implemented and controlled.
2. Deterministic valid and adverse controls cover the mandate note and the
   dispatch/sync split, including trigger-disjointness and the
   prepared-PR-is-not-shipped rule.
3. `node scripts/verify.mjs` and `node evals/run.mjs` pass before the single
   push; any gate expectation change is named as tighten-and-repair.

## Receipt

Fill at completion: Status at a glance plus commands, exit codes and hashes.
