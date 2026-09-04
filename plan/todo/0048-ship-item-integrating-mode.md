# 0048 — ship-item integrating mode: claim-branch selector, check-before-merge, index rule

Owning ADR: adr/0046-serialised-integration-under-direct-to-main.md
Also revises: adr/0010-worktree-conflict-reconciliation.md (r4 — index
exempt from the single-writer rule; same-branch renumbering scope),
adr/0014-concurrency-guardrails.md (r5 — G2 closes gaps within the
sequence; AC3 extends to ship-item; AC4 accepts the single-tree
numbering check on the rebased tree; G4 gains the shared-checkout claim
form), adr/0007-lifecycle-skills.md (r2, ship-item line)

## Scope

1. **ship-item.** On the post-0041 text. Description gains "from the
   current checkout or from a claim branch named for the item … end
   the claim". Step 0 reads the integration branch, the remote, and
   whether the guardrails section exists. Step 1 accepts
   `claim/<item-key>`: fetch; refuse never-pushed or unpushed (local
   tip not an ancestor of the remote tip); read item and ADR(s) from
   `origin/<branch>`. Step 2 integrating mode in a caller-supplied
   detached worktree (own worktree when stand-alone, at an ignored or
   external path): detach at the source tip; rebase onto
   `origin/<integration-branch>`, forced when signed commits are
   required and ship-item signs; index-only conflict rewritten from
   the ADR files; other conflict aborts with the files named;
   check-before-merge iff guardrails (numbering and duplicate-plan-
   ownership on the rebased tree; renumber own files within the
   sequence in one commit); gate. Step 3 merges nothing locally in
   integrating mode; the PR-based path commits the completion changes
   on the branch before ready with delete-on-merge, waits for the
   merge, retries at most twice. Step 4 confirms the item is still
   queued, writes the footer "Shipped at HEAD `<rebased tip>` from
   `claim/<item-key>`" and removes the Status section. Step 7 completion
   commit, gate again, `git push origin HEAD:<branch>` with two bounded
   retries rewriting the footer. Step 8 ends the claim (remote delete;
   clean executor worktree removed then `branch -D`; dirty worktree
   reported; clean current checkout on the branch fast-forwarded).
   Step 9 the closing block. Default mode unchanged.
2. **Run prompt template and this repo's prompt.** Direct-to-main
   Integrate block keeps its by-hand form; the PR-based Ship step moves
   the completion changes before ready (the 0037 r2 repair, if plan
   0039 did not already land it).
3. **Cross-checks.** bootstrap's and agent-wave's worktrees + direct-to-
   main cross-check reworded: legitimate with recorded guardrails; the
   cost is sequential integration.
4. **Hygiene.** Item keys validated with `git check-ref-format`; a
   branch named `claim` refused; a leftover integration worktree
   reused or removed.
5. **Docs.** `USAGE.md` ship-item row and §Concurrent creation name the
   integrating mode and the index rule.

Out of scope:
- The wave itself (plan 0049).

## Exit criteria

Maps to adr/0046-serialised-integration-under-direct-to-main.md
acceptance criteria:

1. Integrating mode selected by a claim branch, in a caller-supplied
   or own detached worktree. → AC1
2. Steps 0–6 as stated; unpushed detection by ancestry. → AC2
3. Index-only conflict rewritten; other conflicts fail and keep the
   claim. → AC3
4. Check-before-merge iff guardrails; own-file renumbering in one
   commit. → AC4
5. Gate before and after completion; footer names the rebased tip,
   rewritten on retry; item confirmed queued. → AC5
6. Push with two bounded retries, then "integration branch moved".
   → AC6
7. Claim ended as stated; dirty worktree never force-removed. → AC7
8. Index exempt from single-writer; own rows only on a claim branch.
   → AC8
9. agent-wave carries no integration procedure of its own (verified
   when plan 0049 lands; this item exposes the mode). → AC9
10. Key validation, `claim` refusal, leftover worktree handling. → AC10
11. Cross-checks reworded. → AC11
12. Every step exercised by hand on a scratch repo with a bare remote
    and a worktree holding the claim branch; gate green; no gate file
    touched; no ADR identifier in any user-visible surface.

When this ships, ADR 0046 advances Accepted → Implemented; the 0010,
0014, and 0007 rows land on the ship commit and those ADRs stay
Implemented.

## Dependencies

- Plan 0039 (record step removed), plan 0040 (claim convention and
  ADR 0038 r2), plan 0041 (Status section), plan 0044 (closing block),
  plan 0047 (denylist in force) — sequential.
