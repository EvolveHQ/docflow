# 0070 — Workspace contract revision 2

Owning decisions: adr/0058-workspace-contract-r2.md (new); adr/0051-portable-workspace-memory-contract.md and adr/0052-workspace-authority-and-attempt-records.md where their records are extended.

## Status

- **Claimed by:** pi, docflow-v1 delivery, 2026-09-18, branch
  `kmox83/docflow-v1-workspace-contract-r2`.
- **Blockers:** Signed commits are blocked. The operator's GPG passphrase is not
  cached in gpg-agent and pinentry cannot reach a display in this pane, so
  `git commit -S` times out. All product code, tests and docs are complete and
  both gates are green; committing and pushing await the operator running
  `gpg-cache` once interactively (or caching the passphrase), after which the
  work commits and the single draft PR opens. Clarity reader parity and native
  qualification are separate.
- **Stopped:** 2026-09-18, awaiting GPG passphrase caching.

## Scope

Implement the six adopter findings as product code under the new accepted
decision: content-addressed external knowledge sources, remote-only reference
members, revision-existence verification, derived-documentation registration,
imported execution-history records, and the explicit out-of-contract statement
for backlog grouping. Extend the schema, validator, templates and `CONTRACT.md`;
add deterministic valid and adverse controls for every new rule; update the four
workspace skills only where their procedure changes; and correct the three
shipped product descriptions to advertise all thirteen skills. No version change,
no new runtime, no vendored document, no audit file.

## Exit criteria

1. ADR 0058 criteria 1–6 are implemented in schema, validator, templates and
   `CONTRACT.md`, with format-1 records still valid.
2. Deterministic valid and adverse controls exist for each new rule, including a
   real local Git member for revision existence.
3. The three product descriptions advertise thirteen skills; all manifests stay
   at 0.9.4.
4. `node scripts/verify.mjs` and `node evals/run.mjs` pass before the single
   push; version-sync and multi-target parity hold.
5. One draft PR to the integration branch carries the receipt below; Clarity
   parity and native qualification remain separate.

## Receipt

Work is complete and uncommitted on `kmox83/docflow-v1-workspace-contract-r2`
as of this note; gates are green (`verify` exit 0, evals 11 passed / 0 failed /
6 skipped exit 0). The commit SHA, push and PR are blocked on GPG signing.
Fill the final command/exit/hash receipt when the commits land.
