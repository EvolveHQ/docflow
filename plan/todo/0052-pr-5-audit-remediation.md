# 0052 — PR #5 audit remediation and approved coordination rollout

Owning ADRs: adr/0038-in-flight-state-derived-from-branches-and-pull-requests.md,
adr/0012-skill-behavioural-evals.md, adr/0015-multi-target-portability.md.
The existing items 0041–0051 retain ownership of their respective queued work.

## Operator decisions — 2026-09-11

The operator requested fixes and updates to PR #5, then explicitly expanded
the scope to the wider project gaps and queued coordination work. Commits
and pushes to the existing PR branch are authorised; merging and releasing
are not requested.

1. Adopt the queued wave mode mapping: parallel separate worktrees;
   sequential shared checkout with direct integration; reject shared-checkout
   PR waves; single writers use the autonomous prompt, with ordinary PR
   integration supported.
2. Existing live claims are excluded unless the operator names the item or
   branch, or explicitly chooses to continue. New claims require exclusive
   creation; successful ordinary pushes do not prove ownership.
3. Open draft PRs immediately after claim acquisition, before implementation,
   with ownership and identifier reservations visible.
4. This repository switches to PR-based integration with required checks and
   standard merge commits, replacing its fast-forward-only integration rule.
   Preserve constituent signed commits and gate-integrity separation.
5. Adopt Status at a glance for final skill results and persisted reports;
   routine progress messages stay concise.
6. Exercise the vendor hosts independently in Docker. The operator's request
   authorises container setup and real host runs, replacing the assumption
   in item 0051 that every host must be manually tested in a separate session.
   Authentication, VM and permission limitations must be reported honestly.

## Scope

- Repair audit findings R1–R5, updating the owning decisions before product
  changes where their rules change.
- Implement the already queued work 0041–0051 in dependency order, carrying
  the operator's decisions into their records and preserving their scopes.
- Record the repository's new integration decision; align conventions,
  run prompt, required checks and PR description.
- Add isolated container verification outside the shipped plugin, with
  deterministic assertions and actual vendor CLI/desktop observations.
  Credentials must never enter images, tracked files, logs or PR evidence.
- Keep unavailable or unsuccessful verification pending; never count a CLI
  version check or a substitute host as a behavioural pass.

## Exit criteria

1. R1–R5 have regression evidence and no contradictory product instructions.
2. Queued implementation and migration are verified under their owning items;
   genuinely unperformed host checks remain explicitly pending.
3. Repository integration rules agree with the operator's approved model.
4. Static, deterministic and runnable host checks have recorded outputs at
   the reviewed revision; the existing PR is updated with accurate scope.
5. No release, publication, merge, or unrelated repository change occurs.

## Status

- Claimed by: Codex; existing PR branch kmox83/0040-claim-by-branch.
- Blockers:
- Stopped:
