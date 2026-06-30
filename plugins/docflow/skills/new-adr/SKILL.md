---
name: new-adr
description: Author a new ADR — record a DECISION (what the system must do, or how it is built) in a documentation-led repo. Picks the next contiguous number, chooses the shape (capability vs technology), fills the template, sets status Proposed, regenerates INDEX, updates domain READMEs, handles supersede/deprecate linkage, commits. Use when the user says "add an ADR", "new ADR", "record a decision", "create an architecture decision record", or invokes /new-adr. NOT for queueing a unit of work against an existing decision (use /new-plan) and NOT for recording a reusable rule, practice, or naming/process standard (use /add-convention).
---

# new-adr

Author one new ADR, consistent with this repo's conventions.

## Step 0 — Preconditions and context

1. Confirm the repo is bootstrapped: `AGENTS.md`, `CONVENTIONS.md`, and
   an `adr/` directory with at least `adr/0000-template.md` must exist.
   If not, stop and offer to run the **bootstrap** skill first.
2. Read `CONVENTIONS.md` to learn this repo's choices: ADR shape
   (single vs. capability/technology split and the cutoff number),
   status lifecycle, language mandate (if any), whether `domains/`
   groupings exist (and, if so, which domain this ADR belongs to — ask if
   it isn't obvious), the multi-agent mode, and the **artefact root**
   (default: repository root) — resolve `adr/` and `INDEX.md` against it
   (`AGENTS.md`/`CLAUDE.md` stay at the repo root).
3. Read `INDEX.md` and `ls adr/` to learn existing numbers and titles.
4. If a `federation.md` exists, this repo is part of a multi-repo
   product. Note the **identity scheme** and the **home** it records —
   they govern numbering and cross-repo references below.

## Step 0.5 — Assessment (run first)

Run the shared assessment protocol before authoring:

- **Opt-out gate first.** Ask whether to run the assessment or skip
  straight to authoring. Recommend **running** it when the request
  arrived with little or no context; recommend **skipping** when the
  decision is already fully specified.
- Ask the questions below **one at a time**, each with a **recommended
  option** and a one-line reason; wait for each answer.
- Use **structured selection** (single- or multiple-choice). If the host
  exposes a structured single-/multi-select question tool, use it and
  mark the recommended option; otherwise list options A/B/C in plain text
  and name the recommended one. Use **free text only** where an
  enumerable set is impossible (e.g. the title).
- **The operator decides.** Never proceed past a question without an
  answer, and never guess scope when invoked with no context.

Questions (skip any the request already answers):
1. **Shape** — capability or technology (only if the repo splits shapes;
   single-shape repos skip this). *Recommended: per the request's intent.*
2. **Supersede?** — none, or select the ADR(s) this replaces.
   *Recommended: none.*
3. **Initial status** — Proposed or Accepted. *Recommended: Proposed.*
   **Reconstructing already-shipped work** (a development built ahead of the
   process) is the exception: author at `Implemented`, Revision History
   citing the implementing commits and noting it was recorded after the
   fact, and write a matching `plan/done` entry.
4. **Create a plan item now?** — yes / no. *Recommended: yes when Accepted.*
5. **Title** — free text (the one unavoidable open answer).

## Step 1 — Determine shape and number

- **Shape.** If the repo uses a single ADR shape, use
  `adr/0000-template.md`. If it uses the split, decide capability vs.
  technology from the user's intent (what the system must do →
  capability; how it is built → technology); confirm with the user if
  ambiguous. Use `adr/0000-template.md` (capability) or the technology
  template (`adr/NNNN-template.md`).
- **Number.** Next contiguous integer after the highest existing ADR,
  zero-padded to 4 digits. No gaps, no reuse. For a split repo, keep
  capability ADRs below the cutoff and technology ADRs at/above it.
  **In a federation** (a `federation.md` exists), number contiguously
  **within this repo** — numbers are not unique across the federation.
  The ADR's federation identity is the recorded scheme applied to this
  number (default repo-prefixed slug `<repo-id>/NNNN-slug`).

## Step 2 — Gather content

Ask for the pieces the chosen template needs, one prompt at a time:
- Title (sentence case), Context.
- Capability ADR: capability statement, user stories, **numbered,
  testable** acceptance criteria.
- Technology ADR: decision, rationale (**name alternatives considered
  and give specific rejection reasons** — reject "simpler"/"idiomatic"
  as insufficient), consequences, acceptance criteria.

Honour the language mandate if one is set.

## Step 3 — Supersede / deprecate (only if replacing an ADR)

If this ADR replaces an existing one:
- Set `supersedes:` on the new ADR and `superseded-by:` on the old.
- Advance the old ADR's `status:` to `Superseded`, append a Revision
  History row noting the successor.
- **Same-repo** links use relative paths (`adr/NNNN-*.md`). **In a
  federation**, a link to an ADR in another repo uses the logical
  identity (`<repo-id>/NNNN-slug`), resolved via the member index along
  `repo-id → Pointer → adr/NNNN-*.md` — not a relative path.
- A pure deprecation (no successor) sets the target to `Deprecated`
  with a Revision History row — and is usually done directly, not via
  this skill.

## Step 4 — Write

- Copy the chosen template, fill all placeholders. Status `Proposed`,
  today's date, owner = current agent/human.
- Seed the Revision History with an `r1 — Initial draft` row. Leave the
  Approvals table empty (it populates on Accepted).
- **Do not invent acceptance criteria or rationale to fill space.** If
  the user hasn't supplied enough to make a section meaningful, ask.

## Step 5 — Wire up

- Regenerate `INDEX.md` from ADR metadata.
- If `domains/` exists, add the ADR to the owning domain's `README.md`
  ADR list. If you assign the ADR to a domain that doesn't exist yet, offer
  to create `domains/<slug>/README.md` (at the recorded artefact root) and
  add the ADR to it — this enables the domains layer.
- Multi-agent mode 2: claim the file in `_agent/LOCKS.md` before
  editing, remove on commit. Mode 3: you are on a branch/worktree.

## Step 6 — Commit

Conventional Commit, `Rationale:` footer (this touches an ADR). No
`Co-Authored-By` trailer unless the repo's Git contract requires one.

## Step 7 — Offer the next step

A new ADR is `Proposed`, not actionable yet. Offer to:
- Walk it to `Accepted` (populate Approvals, change status, regen INDEX)
  when the user is ready; and
- Create a `plan/todo/` item for it (hand off to the **new-plan** skill).
