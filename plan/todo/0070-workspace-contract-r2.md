# 0070 — Workspace contract revision 2

Owning decisions: adr/0058-workspace-contract-r2.md (new); adr/0051-portable-workspace-memory-contract.md and adr/0052-workspace-authority-and-attempt-records.md where their records are extended.

## Status

- **Claimed by:** pi, docflow-v1 delivery, 2026-09-18, branch
  `kmox83/docflow-v1-workspace-contract-r2`.
- **Blockers:** None for the offline contract work. Clarity reader parity and
  native qualification are separate.
- **Stopped:**

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

- Contract code SHA (Clarity handoff): `137d19a181ed5b5b5d0c5ed3ad5af89c7b489358`.
- `node scripts/verify.mjs`: `verify: OK (version 0.9.4, 13 skills, 58 ADRs, 67 shipped plan items)`, exit 0.
- `node evals/run.mjs`: `11 passed, 0 failed, 6 skipped`, exit 0.
- Product hashes: `schema.json` `fd4c87c2f315e0846a6fa5ffa44852230f8fb74017ea9cb7467e01168bb63398`; `validate.mjs` `a4fb706d7c7ad0561dc0cdc475522bda147a211cf34a295aa132507f442739fb`.
- Valid/adverse controls: 13 new cases in `evals/workspace-contract-r2.test.mjs` plus the repaired Git-backed case. Versions stay 0.9.4.

## Status at a glance

- **This run:** implemented all six findings as product code, added the
  control suite, documented the contract and corrected the product
  descriptions; both gates green.
- **Overall:** verified code, not shipped; Clarity parity and native
  qualification remain separate.
- **Yet to do:** coordinator review and integration; Clarity reader parity;
  native qualification.
