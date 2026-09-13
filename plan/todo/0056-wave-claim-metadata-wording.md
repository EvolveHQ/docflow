# 0056 — Accept valid claim metadata wording in the wave checker

Owning decision: adr/0012-skill-behavioural-evals.md (independent assertions
of skill outcomes). Claim semantics remain owned by
adr/0038-in-flight-state-derived-from-branches-and-pull-requests.md.

## Scope

Repair Cursor comment 3999224590 on PR #5: check-wave.py currently requires
Title Case `Reserved` and `Owned`, which the executor brief does not require.
Accept case-insensitive reservation/owned wording while retaining the actual
claim branch and both metadata categories. Exercise the actual checker over
synthetic completed Git fixtures, including missing-metadata failures.

This relaxes an undocumented presentation restriction in a gate, so the gate
repair and regression tests must be committed alone, with the reason stated.
Product instructions, host receipts, existing CI actions/Node 22 gates and
versions are unchanged. No paid host/model rerun is needed. Plan 0051 remains
open and ADR 0012 remains Accepted for its broader incomplete release matrix.

## Exit criteria

1. Reproduce rejection of valid lowercase/ordinary reservation metadata.
2. The checker accepts original Title Case, lowercase and mixed-case forms,
   including the skill's reservation/owned wording, and still rejects missing
   claim identity, reservation metadata or owned-artefact metadata.
3. Focused regression fixtures pass all unrelated wave assertions unchanged;
   local static verify, mutation gate and deterministic evals pass. Skipped
   behavioural cases and synthetic regressions are reported distinctly.
4. Prepare completion at the exact verified work HEAD and PR #5 URL,
   regenerate INDEX, update the audit/PR report and push signed commits to
   the existing PR. Required verify passes at the final remote head; no merge
   or release is performed.

## Status

- **Claimed by:** Codex ChatGPT Astra, 2026-09-13, local `kmox83/pr5-review-astra`, updating `kmox83/0040-claim-by-branch` in PR #5; sole operator-authorised writer.
- **Blockers:**
- **Stopped:**
