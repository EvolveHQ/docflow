---
name: audit
description: Audit a documentation-led repo against its own conventions — contiguous ADR numbering, INDEX sync, plan/ coverage, required sections, status validity, cross-reference resolution, language mandate, ADR-privacy leaks into user-visible code, cross-worktree collisions (duplicate numbers, duplicate plan ownership, same ADR edited on two branches), and — for a multi-repo product — cross-repo federation checks (bidirectional membership, identity collisions, dangling cross-repo references, roll-up drift, convention drift). Reports a punch list and offers to fix the mechanical issues. Use when the user says "audit the ADRs", "lint the conventions", "check repo consistency", "are the ADRs in sync", or invokes /audit. NOT for pressure-testing a draft or eliciting unstated boundaries (use /challenge — this checks the written record, that interrogates what is proposed or unsaid) and NOT for decomposing new work (use /brainstorm).
---

# audit

Check a documentation-led repo against the conventions it declares.
This is the detection layer: `AGENTS.md` states the rules; this skill
checks they were followed and reports drift. It detects — it does not
prevent.

## Step 0 — Preconditions and context

1. Confirm the repo is bootstrapped.
2. Read `CONVENTIONS.md` to learn what to enforce: ADR shape and
   cutoff, status lifecycle, integration model, multi-agent mode,
   language mandate, optional artefacts present (GLOSSARY, domains/),
   and any Q10 domain hard rules, and the **artefact root** (default:
   repository root) — resolve `adr/`, `plan/`, `INDEX.md` against it and
   honour it in the cross-reference and INDEX-sync checks.
3. If a `federation.md` exists, this repo is part of a multi-repo
   product. Note its `Role` (`central` / `home` / `coordinator`
   index-holder, or a plain `member`) and read the recorded identity
   scheme; the cross-repo checks (check 12) run from the index-holding
   repo.

## Step 1 — Run the checks (read-only)

Report each as PASS / FAIL / N/A with specifics (file + line where
relevant):

1. **Numbering.** ADR filenames contiguous, zero-padded, no gaps, no
   duplicates. **In a migrated repo** (a `MIGRATION.md` exists), gaps
   the mapping accounts for are legal — no-duplicates is the rule
   there; an unaccounted gap still fails. Split repos: capability
   below cutoff, technology
   at/above — but **never derive an ADR's shape from its number
   alone**: a recorded exception (an ADR noting it deviates from the
   range) wins over the range; flag only undocumented deviations.
2. **INDEX sync.** Every ADR appears in `INDEX.md`; every INDEX row has
   a matching file; metadata fields (status, title, date) agree.
3. **Plan coverage.** Every `Accepted` ADR has a `plan/todo/` item;
   every `Implemented` ADR has a `plan/done/` entry. Flag orphans both
   ways. `plan/dropped/` is a **valid terminal location**, not a
   missing item — but a dropped item satisfies no coverage, and its
   claimed scope must be re-queued or dispositioned in the drop
   reason. `Withdrawn` ADRs expect **no** plan item.
4. **Section completeness.** Each ADR has the required sections in the
   order its shape mandates — read the required list **from the
   repo's own templates** (`adr/0000-template.md` and, where present,
   the technology template), not from a memorised section list; repos
   legitimately vary section names. Acceptance criteria are numbered.
5. **Status validity.** Every `status:` is in the declared lifecycle
   (including `Withdrawn` — terminal, reachable only from `Proposed`).
   `Superseded` ADRs name a successor in `superseded-by:`; the successor
   names them in `supersedes:` (symmetry) **and is `Accepted` or
   beyond** — a merely-`Proposed` or `Withdrawn` successor must not
   have flipped its predecessor.
6. **Revision/Approvals.** Revision History present; Approvals populated
   for ADRs at `Accepted` or beyond.
7. **Cross-references.** Relative `adr/NNNN-*.md` links resolve to real
   files — or, in a migrated repo, through the `MIGRATION.md` mapping
   to the record's new home. Glossary anchors (if used) resolve. A
   spec's `migrated-from:` must name a path the mapping lists.
8. **Language mandate.** If set, spot-check user-facing docs for the
   required spellings.
9. **ADR-privacy leaks.** Grep source / product directories for ADR
   identifiers in user-visible strings — patterns like `ADR 0042`,
   `adr-0042`, `see ADR`, ADR titles — in UI copy, API responses,
   error messages, customer-facing logs, public docs, release notes.
   Report each suspect; this rule is easy to violate by reflex.
10. **Coordination hygiene.** N/A if `_agent/` was omitted at bootstrap
    (Q5 = None). Otherwise: `_agent/LOCKS.md` has no stale claims
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
      Pointer in `federation-index.md`, then the ADR file under that repo.
      A repo-id with **no index row** is a dangling reference. If the row
      exists but the **checkout is absent**, report it **"unverified this
      run"** (not dangling); only an **absent ADR in a present checkout**
      is a true dangling reference. (Same-repo relative links are
      check 7.)
    - **Roll-up drift.** The roll-up agrees with each member's `INDEX.md`
      metadata; flag rows that are stale, missing, or extra.
    - **Convention drift.** Compare each member's **shared** conventions
      against the index-holder's authoritative copy; flag a member whose
      shared conventions have drifted from the source. Members' **local-only**
      conventions are exempt.
13. **Coverage (undocumented developments).** A heuristic nudge, not a
    precise diff: scan the major modules / top-level source directories and
    the recent `git log` for **substantial behaviour or an area with no
    owning ADR** — a large feature, subsystem, or dependency the catalogue
    never records. Report each as a prompt to **capture** it (reconstruct
    the decision as an `Implemented` ADR + `plan/done`, per the backfill
    path), **not** as a hard failure. Because the audit is doc-centric, keep
    this conservative — flag clear, sizable gaps, not every file.
14. **Artefact-root discovery.** If a `.docflow` **file** exists at the
    repository root, its `root:` line must agree with the artefact root
    recorded in `CONVENTIONS.md`, and it must not redundantly name
    `.docflow/` (the directory is its own marker — flag the file for
    removal). If the artefact root is **not** `.docflow/` and no pointer
    file exists, surface it as an **offer** to add one (external tools
    discover the catalogue through it) — never as a hard failure;
    migration is offered, not forced.
15. **Declared-vs-computed status.** N/A unless `docflow.yml` records
    `evidence-adopted-at:`. For each record in evidence scope (created
    or edited after that commit) declaring `Implemented`: every current
    criterion's digest has a matching valid evidence record (exit code
    0, or an attested manual record) under `evidence/<record-slug>/`.
    Flag stale projections — the computed state wins (§Trust Posture);
    report the divergence, never silently rewrite the status.
16. **Evidence re-runs.** N/A without adoption. Re-execute inexpensive
    `Verify:` commands (sample expensive ones): checking a *record*
    runs at its recorded `source-sha`; checking *current satisfaction*
    runs at HEAD. Divergence between a record and its re-run is a
    **finding** (evidence debt) for a human — never an automatic state
    change or record edit.
17. **Manual-verification ratio.** N/A without adoption. Report the
    share of in-scope criteria verified `manual`, and flag any manual
    record whose verifier is the implementer. Reported, not gated — the
    number is the argument.
18. **Constraints discipline.** N/A without a `CONSTRAINTS.md`. Every
    entry parses per the conventions' format; ids unique; revisions
    positive and monotonic; `source` and `state` legal; each
    `authorised-by:` names a decision record that exists at Accepted
    or beyond. Heuristically flag any constraint change in recent
    history whose commit touched no authorising record, and surface
    the removal of any `learned` constraint for extra scrutiny (they
    are deliberately harder to remove). Report — the file is never
    auto-edited.
19. **Spec records.** N/A without a `spec/` directory. Every spec's
    `id:` equals its filename slug; statuses are in the spec lifecycle
    (Draft / Agreed / Implemented / Retired, with `retired-from:` set
    only on Retired); an Agreed-or-beyond spec has ≥1 criterion, each
    with a `Verify:` method; `decided-by:` entries resolve to existing
    decision records and `constrained-by:` to existing constraint ids;
    the INDEX Specs section matches the files. Checks 3
    (plan coverage), 15 (declared-vs-computed), and 16 (re-runs) apply
    to specs exactly as to ADRs — an Implemented spec needs full valid
    evidence; an Agreed spec's queued work traces to its criterion
    ids. Flag any spec whose slug changed in recent history after it
    reached Agreed (slugs are immutable from Agreed — rename = retire
    + new).

20. **Goal traceability.** N/A without a `goals/` directory. Every
    goal file parses per the conventions' §Goals format (`id:` equal
    to the filename stem, legal state, title/horizon/review-by/date,
    Statement and Measure sections); the `INDEX.md` Goals section
    matches the files both ways (id, state). Findings — all reported,
    never auto-edited: an `Active` goal no AC-bearing record
    `serves:` (an aspiration, not a goal); an `Active` goal without a
    measure (it can never be validated); a `serves:` id on any record
    that resolves to no goal file; more Active goals than the
    recorded cap (~7 — a signal, not a gate). Where `COVERAGE.md`
    exists, check it is in sync with the catalogue (stale, missing,
    or extra rows), exactly as INDEX sync is checked.
21. **Validation state.** N/A without a `goals/` directory. Reported,
    never gated: every `Active` goal past its `review-by:` with no
    outcome entry dated after the current arming (**due for a
    verdict** — the validate skill performs it); goals accumulating
    repeated `inconclusive` verdicts (a measure unmeasurable in
    practice — fix or retire it); and the shipped-versus-validated
    picture (work shipped against goals vs outcomes recorded) as a
    visibility note — the number is the argument, nothing blocks.
22. **Autonomy state.** N/A when the manifest records no `autonomy:`
    field. The recorded level is legal (`L0`–`L5` — the gate holds
    this too) and its **prerequisites are present**: `L2`+ a named
    verify gate; `L3`+ a plan queue; `L4`+ the constraints layer;
    `L5` the goals layer and an audit cadence. A missing prerequisite
    is a conformance finding. Heuristically flag recent unattended
    activity signatures beyond the recorded grant (e.g. WORKLOG rows
    from autonomous runs on a repo recording `L0`/`L1`) — reported,
    never gated; the level moves only by an operator's edit.

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
