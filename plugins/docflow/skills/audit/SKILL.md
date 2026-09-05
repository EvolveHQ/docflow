---
name: audit
description: Audit a documentation-led repo against its own conventions — contiguous ADR numbering, INDEX sync, plan/ coverage, required sections, status validity, cross-reference resolution, language mandate, ADR-privacy leaks into user-visible code, cross-worktree collisions (duplicate numbers, duplicate plan ownership, same ADR edited on two branches), and — for a multi-repo product — cross-repo federation checks (bidirectional membership, identity collisions, dangling cross-repo references, roll-up drift, convention drift). Reports a punch list and offers to fix the mechanical issues. Use when the user says "audit the ADRs", "lint the conventions", "check repo consistency", "are the ADRs in sync", or invokes /audit.
---

# audit

Check a documentation-led repo against the conventions it declares.
This is the enforcement `AGENTS.md` cannot guarantee on its own.

## Step 0 — Preconditions and context

1. Confirm the repo is bootstrapped.
2. Read `CONVENTIONS.md` to learn what to enforce: the **ADR shape
   scheme** — a single shape, two shapes declared by a `shape:` field in
   each ADR's metadata block (no number boundary is recorded and none is
   read), or the **legacy range encoding** described in item 4 — status
   lifecycle, integration model, multi-agent mode,
   language mandate, optional artefacts present (GLOSSARY, domains/),
   and any Q10 domain hard rules, and the **artefact root** (default:
   repository root) — resolve `adr/`, `plan/`, `INDEX.md` against it and
   honour it in the cross-reference and INDEX-sync checks.
3. If a `federation.md` exists, this repo is part of a multi-repo
   product. Note its `Role` (`central` / `home` / `coordinator`
   index-holder, or a plain `member`) and read the recorded identity
   scheme; the cross-repo checks (check 12) run from the index-holding
   repo.
4. **Legacy range encoding.** Some two-shape repos were scaffolded
   before the shape became a declared field and encode it in the
   **number** instead: capability ADRs below a cutoff, technology ADRs
   at or above it, and the technology template sitting at the boundary
   as a pseudo-ADR. Two signals identify it, and **either one alone is
   enough**:
   - `CONVENTIONS.md` §ADR Shapes records a cutoff — a capability range
     and a technology range rather than a `shape:` field; or
   - `adr/` holds a template file numbered other than `0000` (e.g.
     `adr/0100-template.md`, or whatever boundary the project chose).

   Treat the two as one condition, not two findings. When it holds the
   catalogue is **valid, not broken** — it predates the declared field.
   Run the checks below under the **legacy rules** noted against
   checks 1, 2 and 4, so a repo that passed before keeps passing, and
   report the single finding of check 15. A migration onto the declared
   field is offered in Step 4; nothing is rewritten here.

## Step 1 — Run the checks (read-only)

Report each as PASS / FAIL / N/A with specifics (file + line where
relevant):

**Templates are not decisions.** Every check that walks the catalogue
excludes each `adr/0000-*.md` file — `0000-template.md` and, in a
two-shape repo, `0000-template-technology.md`. They are never numbered,
indexed, plan-covered, or section-checked as ADRs. Under the **legacy
range encoding** the boundary-numbered template is excluded in exactly
the same way: it is a template, not the first technology ADR.

1. **Numbering.** ADR filenames contiguous, zero-padded, no gaps, no
   duplicates — **one sequence for the whole catalogue**, whatever each
   ADR's shape. Flag any template numbered other than `0000`.
   *Legacy encoding:* apply the range rules exactly as they stood —
   numbering contiguous **within each block** with no duplicates, the
   gap at the cutoff expected rather than flagged, capability ADRs below
   the cutoff and technology ADRs at or above it, and the
   boundary-numbered template neither flagged nor counted as an ADR.
2. **INDEX sync.** Every ADR appears in `INDEX.md`; every INDEX row has
   a matching file; metadata fields (status, title, date) agree. In a
   two-shape repo the table carries a **Shape** column and its values
   agree with each ADR's `shape:` field (an absent field reads as
   `capability`); a single-shape repo has no such column.
   *Legacy encoding:* the table carries no Shape column — shape is read
   from the range — so do not flag its absence.
3. **Plan coverage.** Every `Accepted` ADR has a `plan/todo/` item;
   every `Implemented` ADR has a `plan/done/` entry. Flag orphans both
   ways.
4. **Section completeness.** Each ADR has the required sections in the
   order its **declared shape** mandates — read the `shape:` field:
   `capability`, or an absent field, means the capability order
   (Context, Capability statement, User stories / scenarios, …);
   `technology` means the technology order (Context, Decision,
   Rationale, Consequences, …). In a single-shape repo every ADR takes
   that repo's one order. Flag any `shape:` value that is neither
   `capability` nor `technology`. A `shape:` field in a single-shape repo
   is redundant, not wrong — report it as hygiene. Acceptance criteria
   are numbered.
   *Legacy encoding:* the shape is the ADR's side of the cutoff — below
   it capability, at or above it technology — and no `shape:` field is
   expected. Validate the section order against that, exactly as before,
   with the one carve-out the encoding forces and these repos record for
   themselves: an ADR below the cutoff that `CONVENTIONS.md` names as a
   **documented exception** — typically the ADR adopting the method,
   which is technology-shaped but has to be first in the sequence — is
   checked against the technology order, not flagged. A mismatch the
   conventions do **not** record is still a finding. A `shape:` field
   contradicting the range is a real inconsistency; one agreeing with it
   is hygiene, not a failure.
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
15. **Legacy shape encoding.** N/A unless Step 0 item 4 holds. When it
    does, report exactly **one** finding at severity **migration
    available**: name the signal(s) that identified the encoding (the
    cutoff recorded in §ADR Shapes, the boundary-numbered template file,
    or both), state that the catalogue is valid and passing under the
    range rules, and say that a complete mechanical migration onto the
    declared-field scheme is available (Step 4). Never split it into a
    second finding — a template numbered off `0000` and a recorded
    cutoff are the same condition — and never fail the audit for it.

## Step 2 — Report

Lead with a one-line verdict (clean / N issues). Then the punch list,
grouped by severity: **blocking** (privacy leaks, status/lifecycle
violations, broken cross-refs), **drift** (INDEX out of sync, missing
plan files), **hygiene** (stale locks, formatting), and **migration
available** (a superseded scheme the repo can move off — check 15).
A migration-available finding does not count towards the issue count in
the verdict and never makes the run dirty: a repo whose only finding is
that one is **clean, with a migration available**.

## Step 3 — Offer fixes

Offer to fix the **mechanical** issues automatically: regenerate
`INDEX.md`, create missing `plan/todo` stubs, clear stale locks, fix
broken relative links. **Do not** auto-edit ADR content, rewrite
acceptance criteria, or remove suspected privacy leaks without the
user confirming each — those need judgement. Commit fixes as
`fix(adr): ...` / `docs: ...` with a `Rationale:` footer where an ADR
is touched.

If check 15 fired, offer the **legacy range migration** here too — as
its own offer, separate from the mechanical fixes above, and never
bundled into a "fix everything" confirmation. Step 4 is the procedure.

## Step 4 — Offer the legacy range migration (only when check 15 fired)

The migration is **offered, never forced**. A repo that declines keeps
the range encoding, keeps passing under the legacy rules, and is offered
again on the next audit. Nothing below is written without the
confirmation in 4.2.

### 4.1 — Dry run: show the old-to-new number map

Compute the map and show it **before touching a single file**:

- **Capability ADRs** — those below the cutoff — keep their numbers.
  Nothing moves, so the numbers already cited in commits, tickets and
  shipped plan entries still resolve.
- **Technology ADRs** — those at or above the cutoff — take the numbers
  immediately following the **highest capability ADR**, in their
  original relative order. With capability ADRs ending at `0012` and
  technology ADRs `0101`, `0102`, `0104`, the map is `0101 → 0013`,
  `0102 → 0014`, `0104 → 0015`. Order is preserved; gaps in the old
  technology block are closed, not carried over.
- **The moved set is the technology *range*, not every technology-shaped
  ADR.** The range encoding forces one exception — the ADR that adopts
  the method is a technology-shaped decision that has to be first in the
  sequence — and repos record it as such in their conventions. It is
  below the cutoff, so it does **not** move: it keeps its number and
  simply gains `shape: technology`, which is what retires the exception
  clause in step 6. Renumbering it would churn the one number every
  early commit cites, for nothing.

Render the map as an `old → new` table with each ADR's title, then list
what follows from it: every `depends-on`, `supersedes` /
`superseded-by`, relative `adr/NNNN-*.md` link, `INDEX.md` row, domain
`README.md` listing, and `plan/todo/` owning-ADR reference that names a
moved number; the boundary template replaced by
`adr/0000-template-technology.md`; §ADR Shapes rewritten to the declared
field. Say plainly what is **not** touched: `plan/done/` footers, commit
messages, tags, and any reference from outside the catalogue. Those are
history, and history is not rewritten.

### 4.2 — Confirm

Ask for an explicit confirmation of **that map**. Write nothing without
it. Acceptance of the audit report is not acceptance of the migration:
ask for it as its own question, and take silence or ambiguity as a no.

### 4.3 — Apply, as one commit

1. `git mv` each moved technology ADR to its new number, keeping its
   slug. Capability files do not move.
2. In each moved file, update the `adr:` metadata field and the H1
   heading to the new number.
3. Write `shape:` on **every** ADR — the shape each one **actually
   has**, not the block it came from. `technology` on the moved ones and
   on the documented exception that stayed (4.1); `capability` on the
   rest. Stamping the exception `capability` because it did not move
   would put the field at odds with its sections, and the check in 4.4
   would fail the catalogue the migration just produced. Write the field
   explicitly on all of them: it is the encoding now, and a catalogue
   carrying it on only half its ADRs is still readable but no longer
   self-describing.
4. Rewrite every in-catalogue reference to a moved number: `depends-on:`,
   `supersedes:`, `superseded-by:`, relative `adr/NNNN-*.md` links in
   any ADR body, `INDEX.md` rows, domain `README.md` listings, and the
   owning-ADR line — and any other relative ADR link — of every
   `plan/todo/` item. Rewrite by resolved
   identity, not by text search alone — a bare `0101` in prose may be a
   quantity, and a number that did **not** move must not be touched.
5. Delete the boundary-numbered template and write
   `adr/0000-template-technology.md` in its place — the technology
   template, `shape: technology` pre-filled. `adr/0000-template.md`
   stays as the capability template; no template carries any other
   number afterwards.
6. Rewrite `CONVENTIONS.md` §ADR Shapes to the declared-field form: two
   shapes named by the field, an absent field meaning capability, one
   contiguous sequence with no boundary, both templates numbered
   `0000`, and a Shape column in `INDEX.md`. Delete the cutoff, and
   delete any clause recording the seed ADR as an exception to the
   range — under the declared field the seed is simply
   `shape: technology`, and there is nothing to except. If `AGENTS.md`
   mirrors the section, give it the matching shape hard rules.
7. Regenerate `INDEX.md` from the new metadata, with the **Shape**
   column.
8. Commit **once**. The message lists **every** old-to-new pair, one per
   line, so the renumbering is reconstructible from history alone — it
   is the only record of the old numbers, and there is no alias field to
   fall back on. Conventional Commit, with the `Rationale:` footer the
   repo's git contract requires for ADR changes.

### 4.4 — Verify before handing back

Re-run Step 1 with the legacy rules **off**: one contiguous sequence,
each ADR's sections matching its declared shape, a Shape column whose
values agree with the fields, every relative link resolving, and no
template numbered other than `0000`. The catalogue must pass with **no
manual edit**. If anything fails, the migration is incomplete — finish
it in the same commit rather than leaving a half-migrated catalogue,
which is the one state neither rule set describes.
