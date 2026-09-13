# PR #5 cleanup lease follow-up — 2026-09-13

Scope: [review comment 3993698694](https://github.com/EvolveHQ/docflow/pull/5#discussion_r3993698694),
following the [2026-09-11 audit](2026-09-11-pr-5-follow-up.md).
Baseline: `5437824730d9a80c07c4d06e54e6de707fa0e4cb`.
Verified work HEAD: `32f944eda50cd651cf461602cc8e243f85a4cedc`.
Product repair: `cd96c0c`; separate regression commit: `32f944e`.

The refreshed review had two resolved, outdated threads and one unresolved
current thread, with no general comments or new findings. Independent source
inspection confirmed the older branch-mode and early-draft fixes remain in
the prompt, agent-wave, ship-item and G4. The current finding is valid: both
autonomous prompts omitted the deletion lease already required by
adr/0038-in-flight-state-derived-from-branches-and-pull-requests.md r6.
Plan 0054 was written and signed before product/test edits; no new decision
or status revision is needed for this implementation consistency repair.

Both baseline prompts failed the focused lease assertion (exit 1). The repair
retains the verified source before integration and explicitly leases deletion
against it. A changed or unverifiable ref survives, with a cleanup blocker
that preserves the confirmed integration outcome. The dogfood prompt was
regenerated from the single-writer/PR template selection. Ship-item explicitly
captures the verified PR head; audit follows its shipped-claim cleanup and
leases abandoned work against the operator-confirmed tip. Local unpushed
and dirty work remain protected. All three coordination modes remain intact.

The deterministic regression checks three documented commands, prompt parity
and 12 unsafe mutations. The existing real-Git race now reproduces destructive
unguarded deletion, then executes each documented command: an advanced claim
survives even after fetch; an unchanged verified claim is deleted. Its existing
same-tip, descendant and simultaneous acquisition assertions also pass.

At the verified work HEAD, all commands exited 0:

- `node scripts/verify.mjs`: `verify: OK (version 0.9.4, 9 skills, 50 ADRs, 61 shipped plan items)`.
- `node scripts/verify-mutations.mjs`: `verify mutations: OK (15 rejected mutations)`.
- `node evals/run.mjs`: `6 passed, 0 failed, 6 skipped`.

The six skips were not executed. The static gate's shipped-item count includes
prepared PR records. Completion of 0054 adds one prepared record after this
work HEAD; its final-head gates and CI are reported on [PR #5](https://github.com/EvolveHQ/docflow/pull/5).
Historical Docker/Cowork receipts were not changed or rerun for this repair.

During completion preparation, the static gate rejected a footer labelled
`Verified work HEAD` (`footer does not name the shipping HEAD SHA`, exit 1).
The footer now uses the repository's required `Shipped at HEAD` form with an
explicit prepared-only qualification. INDEX was regenerated from all metadata;
the final table is unchanged. No gate was weakened to admit the record.

Fetch found the PR target still at the baseline and main at `78f2021`;
both are ancestors of the work HEAD. PR #5 is the only open PR, there are
no remote claim refs, and plan 0054 has no competing reservation. The other
worktrees are retained operator contexts, not assigned concurrent writers.
Root discovery uses `.docflow` (`root: .`); this checkout has no `docflow.yml`.
Diff review found no credentials, catalogue leaks or version/host packaging
changes. Signing remained enabled with key `753272C2405F9B34`.

## Status at a glance

- **This run:** reproduced and repaired the cleanup gap; all three work-head gates above exited 0. Product and gate edits are separate signed commits; completion is prepared on the same PR.
- **Overall:** verified for this repair at the named work HEAD; overall host/release coverage remains partially verified. Prepared completion becomes effective only on a checked merge.
- **Yet to do:** final published-head verification/CI is a delivery check recorded on PR #5; plan 0051's host/provider, Cowork target Git, signed-push/delegation and release matrix; review and explicitly authorised merge. This worktree remains available for review.
