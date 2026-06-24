---
name: audit
description: Audit a documentation-led repo against its own conventions — contiguous ADR numbering, INDEX sync, plan/ coverage, required sections, status validity, cross-reference resolution, language mandate, ADR-privacy leaks into user-visible code, cross-worktree collisions (duplicate numbers, duplicate plan ownership, same ADR edited on two branches), and — for a multi-repo product — cross-repo federation checks (bidirectional membership, identity collisions, dangling cross-repo references, roll-up drift). Reports a punch list and offers to fix the mechanical issues. Use when the user says "audit the ADRs", "lint the conventions", "check repo consistency", "are the ADRs in sync", or invokes /audit.
---

# audit

Check a documentation-led repo against the conventions it declares.
This is the enforcement `AGENTS.md` cannot guarantee on its own.

## Step 0 — Preconditions and context

1. Confirm the repo is bootstrapped.
2. Read `CONVENTIONS.md` to learn what to enforce: ADR shape and
   cutoff, status lifecycle, integration model, multi-agent mode,
   language mandate, optional artefacts present (GLOSSARY, domains/),
   and any Q10 domain hard rules.
3. If a `federation.md` exists, this repo is part of a multi-repo
   product. Note whether it is the **home** or a **member** and read the
   recorded identity scheme; the cross-repo checks (check 12) run from
   the home repo.

## Step 1 — Run the checks (read-only)

Report each as PASS / FAIL / N/A with specifics (file + line where
relevant):

1. **Numbering.** ADR filenames contiguous, zero-padded, no gaps, no
   duplicates. Split repos: capability below cutoff, technology at/above.
2. **INDEX sync.** Every ADR appears in `INDEX.md`; every INDEX row has
   a matching file; metadata fields (status, title, date) agree.
3. **Plan coverage.** Every `Accepted` ADR has a `plan/todo/` item;
   every `Implemented` ADR has a `plan/done/` entry. Flag orphans both
   ways.
4. **Section completeness.** Each ADR has the required sections in the
   order its shape mandates. Acceptance criteria are numbered.
5. **Status validity.** Every `status:` is in the declared lifecycle.
   `Superseded` ADRs name a successor in `superseded-by:`; the successor
   names them in `supersedes:` (symmetry).
6. **Revision/Approvals.** Revision History present; Approvals populated
   for ADRs at `Accepted` or beyond.
7. **Cross-references.** Relative `adr/NNNN-*.md` links resolve to real
   files. Glossary anchors (if used) resolve.
8. **Language mandate.** If set, spot-check user-facing docs for the
   required spellings.
9. **ADR-privacy leaks.** Grep source / product directories for ADR
   identifiers in user-visible strings — patterns like `ADR 0042`,
   `adr-0042`, `see ADR`, ADR titles — in UI copy, API responses,
   error messages, customer-facing logs, public docs, release notes.
   Report each suspect; this rule is easy to violate by reflex.
10. **Coordination hygiene.** `_agent/LOCKS.md` has no stale claims
    (mode 2); `_agent/IN_FLIGHT.md` rows match live worktrees (mode 3).
11. **Cross-worktree collisions** (mode 3, or when auditing across
    unmerged branches). These catch semantic conflicts that a
    line-level git merge cannot:
    - **Duplicate ADR or plan/todo numbers** — two ADR files, or two
      `plan/todo/` items, (across branches/worktrees) claiming the same
      `NNNN`. Distinct from check 1, which only sees one tree. This is the
      collision the concurrency guardrails (G2 pre-merge / G3 gate) guard
      against; flag it so the later author renumbers.
    - **Duplicate plan ownership** — two `plan/todo/` items naming the
      same owning ADR for the same scope, i.e. two worktrees building
      the same thing.
    - **Same ADR edited on two unmerged branches** — compare ADR files
      across the live worktrees / open PRs; flag any ADR modified in
      more than one. A `merge=union` would concatenate them silently.
    Cross-check against `_agent/IN_FLIGHT.md`: every collision should
    correspond to a reservation/ownership violation recorded there.
12. **Cross-repo (federation) checks** — only when a `federation.md`
    exists; run from the **index-holding** repo (`Role: central`, `home`,
    or `coordinator` — whichever holds `federation-index.md`). Reach each
    member through the local checkout named in `federation-index.md`. A member not checked
    out locally is reported **"unverified this run"** — never silently
    passed, never a hard failure.
    - **Bidirectional membership.** Every repo listed in the member index
      carries a `federation.md` back-pointer to this index-holder, and
      every repo whose back-pointer names this repo is listed in the
      index. Flag either half-edge (in-index-without-back-pointer, or
      points-here-but-unlisted).
    - **Identity collisions.** Under the repo-prefixed scheme an identity
      is `repo-id` + local number, so the only reachable collision is a
      **duplicate `repo-id`**. Flag any repo-id that appears on more than
      one `federation-index.md` row or in two members' `federation.md`
      back-pointers.
    - **Dangling cross-repo references.** Resolve each cross-repo link
      along `repo-id → Pointer → adr/NNNN-*.md` — look up the repo-id's
      Pointer in `federation-index.md`, then the ADR file under that repo —
      and flag a target that does not exist. (Same-repo relative links are
      check 7.)
    - **Roll-up drift.** The roll-up agrees with each member's `INDEX.md`
      metadata; flag rows that are stale, missing, or extra.

## Step 2 — Report

Lead with a one-line verdict (clean / N issues). Then the punch list,
grouped by severity: **blocking** (privacy leaks, status/lifecycle
violations, broken cross-refs), **drift** (INDEX out of sync, missing
plan files), **hygiene** (stale locks, formatting).

## Step 3 — Offer fixes

Offer to fix the **mechanical** issues automatically: regenerate
`INDEX.md`, create missing `plan/todo` stubs, clear stale locks, fix
broken relative links. **Do not** auto-edit ADR content, rewrite
acceptance criteria, or remove suspected privacy leaks without the
user confirming each — those need judgement. Commit fixes as
`fix(adr): ...` / `docs: ...` with a `Rationale:` footer where an ADR
is touched.
