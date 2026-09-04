# 0040 — In-flight state derived: retire the dashboard, claim by branch

Owning ADR: adr/0038-in-flight-state-derived-from-branches-and-pull-requests.md
Also revises: adr/0010-worktree-conflict-reconciliation.md (r3),
adr/0014-concurrency-guardrails.md (r4)

## Scope

1. **Claim convention.** `templates/CONVENTIONS.md` §Concurrency
   Guardrails G4 and `templates/AGENTS.md`'s hard-rule bullet name the
   claim: a pushed branch `<actor>/NNNN-<slug>` for the item, plus a
   draft PR where integration is PR-based. The identifier-reservation
   and single-writer paragraphs point at the branch and PR description
   instead of a dashboard. `USAGE.md` §Concurrency documents it.
2. **bootstrap.** No `_agent-IN_FLIGHT.md` template; mode 3 Step 5
   writes no dashboard and no `.gitignore` entry.
3. **agent-wave.** Step 2 hands each agent its reserved block in the
   brief and requires it in the PR description or first commit; Step 4
   and the stop path have no dashboard write or cleanup; the mode-2
   path no longer references a file that does not exist.
4. **ship-item / run prompt.** No dashboard-row removal; the merge and
   branch deletion end the claim. The run-prompt template gains a Claim step between Pick and
   Implement: push the branch named for the item; where integration is
   PR-based, the draft PR opens at integrate time.
5. **Audit.** Check 10 derives the in-flight set from `git worktree
   list`, remote branches matching the convention, and draft PRs;
   fails on duplicate claims and claims without an item; flags stale
   worktrees and offers to prune; reports "unverifiable" with no
   remote. Check 11 collisions become FAIL severity; the dashboard
   cross-check is removed.
6. **ADR revisions.** 0010 r3: AC2 names the claiming branch/PR as the
   ownership record; open-question resolution wording updated. 0014
   r4: G4 names the branch/PR claim. Both stay Implemented; Rationale
   footers on the commit.
6b. **ADR 0038 r2 (lands with this item, before the claim convention is
   scaffolded).** The claim branch is `claim/<item-key>`, the item key
   being the queue file name without extension — a fixed prefix so the
   push itself is the exclusion — replacing the actor-prefixed form and
   resolving the open question; the claim commit exists before the
   branch is pushed; a remote claim whose tip is at or behind the
   integration branch is not a claim; per-mode claim (branch in
   separate worktrees; Claimed by plus lock rows in a shared checkout;
   none for a single writer); stale = a worktree or Claimed by whose
   remote claim branch no longer exists, a detached worktree being
   neither; AC6: ship deletes the remote branch and the local one once
   unheld; the rejected "claim commit to main" alternative reworded to
   carve out the shared-checkout form; "spawn brief" reads "wave
   specification"; the templates' partition sentence becomes "named
   actors answer for areas; work is assigned by claim" on the
   post-plan-0038 text. Scope items 1 and 4 above follow this wording.
7. **Docs.** `README.md`, `USAGE.md`, `docs/examples.md` (mode-3
   paragraph), `docs/methodology.md`.

Out of scope:
- Task blockers and stop reasons (plan 0041).
- Migration of existing dashboards (plan 0042).

## Exit criteria

Maps to adr/0038-in-flight-state-derived-from-branches-and-pull-requests.md
acceptance criteria:

1. Claim convention stated in scaffolded CONVENTIONS/AGENTS and USAGE.
   → AC1
2. Bootstrap writes no dashboard in any mode. → AC2
3. Audit check 10 derives from worktrees/branches/PRs with the listed
   failures, stale prune offer, and "unverifiable" without a remote.
   → AC3
4. Audit check 11 collisions are FAIL; dashboard cross-check removed.
   → AC4
5. agent-wave carries reservation in the brief and PR; no dashboard
   phase anywhere. → AC5
6. ship-item and prompt remove no row. → AC6
7. ADR 0010 r3 and 0014 r4 rows present; both Implemented. → AC7
8. Docs updated. → AC8
9. Verify gate green; skill parity preserved.

When this ships, ADR 0038 advances Accepted → Implemented.

## Dependencies

- Plan 0038 (file set) and plan 0039 (shares ship-item, prompt,
  bootstrap edits) — sequential.
