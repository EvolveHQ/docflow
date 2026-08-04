---
name: new-spec
description: Author a new CAPABILITY SPEC — a living, slug-identified record of what the system must do — in a documentation-led repo whose record model separates decisions from specs. Picks a unique slug, fills the spec template, sets status Draft, walks Draft→Agreed as a human gate, regenerates INDEX, commits. Use when the user says "add a spec", "new spec", "record a capability", "write the spec for X", or invokes /new-spec. NOT for recording a decision or its rationale (use /new-adr), NOT for queueing a unit of work (use /new-plan), and NOT for a reusable rule or term (use /add-convention). Refuses cleanly in repos whose record model has no specs.
---

# new-spec

Author one living capability spec, consistent with this repo's
conventions. A spec is *supposed to change*: growth is an edit with a
Revision History row, never supersession.

## Step 0 — Preconditions and context

1. Confirm the repo is bootstrapped (`AGENTS.md`, `CONVENTIONS.md`).
2. Read the capability manifest (`docflow.yml` at the artefact root).
   **This skill applies only when the record model separates decisions
   from specs** (`model: decisions+specs`). On any other model —
   including `decisions-only`, where capability content is managed
   outside this repo — refuse cleanly, name the recorded model, and
   point at the bootstrap re-run as the way to change it.
3. Read `CONVENTIONS.md` §Capability Specs for this repo's spec rules,
   the language mandate (if any), and the **artefact root** — resolve
   `spec/`, `adr/`, and `INDEX.md` against it.
4. `ls spec/` to learn existing slugs.

## Step 0.5 — Assessment (run first)

Run the shared assessment protocol before authoring:

- **Depth selector first.** Ask how deep this assessment should go:
  **express** — every choice takes its recommended default; only
  questions with no derivable default (the free-text essentials) are
  still asked; **guided** — only the questions marked high-impact
  below, plus the free-text essentials; **full** — every question
  below. If the repo's `CONVENTIONS.md` records an `Assessment depth:`,
  pre-select it as the recommended option — the selector always
  appears (one narrow exception: when the invocation already answers
  every question the tiers differentiate, skip it and say so in one
  line); a recorded depth is never applied silently. Otherwise
  recommend **full** when the request arrived with little or no
  context and **express** when it is already fully specified. At any
  question the operator may answer "defaults from here" or "go
  deeper"; honour the switch immediately.
- Ask the questions below **one at a time**, each with a **recommended
  option** and a one-line reason; wait for each answer.
- Use **structured selection** where the options are enumerable; free
  text only where they are not (title, criteria).
- **The operator decides.** Never proceed past a question without an
  answer, and never guess scope when invoked with no context.

Questions (skip any the request already answers):
1. **Slug** — kebab-case, unique under `spec/`. *Recommended: derived
   from the title.* *(High-impact — asked in guided: the slug is
   immutable once Agreed; renaming later means retiring and creating
   anew.)*
2. **Authorising decisions** — which decision record(s) authorise this
   capability (`decided-by:`). *Recommended: the one named in the
   request.* If none exists, offer the ADR skill first — a capability
   with no authorising decision is a request, not a record.
3. **Bounding constraints** — which constraint ids apply
   (`constrained-by:`), if the repo carries a constraints file.
   *Recommended: none unless one plainly applies.*
3b. **Serves** — which goal id(s) this capability advances
   (`serves:`), if the repo carries a `goals/` directory; every
   listed id must resolve to a goal file. *Recommended: the goal the
   request names, or none.*
4. **Walk to Agreed now?** — yes / no. *Recommended: no — Draft first,
   agree when the criteria are settled.*
5. **Title** — free text (asked at every depth).

## Step 1 — Gather content

Ask for the pieces the template needs, one prompt at a time: the
capability statement, user stories, and **numbered, testable
acceptance criteria — each ending with a `Verify:` line** (an inline
command, `gate-check`, or `manual`). A criterion nobody can name a
check for is not ready to be written — ask, don't invent. **Avoid
time-bound criteria**: one whose truth is momentary ("the directory
is empty") is permanently false on every future re-run at HEAD —
word criteria to be durably true, or scope them to the event they
describe. **Unattended runs (autonomy `L3`+):** name executable
methods only — introducing a `manual` method is an escalation to
the operator. Honour the language mandate if one is set.

## Step 2 — Write

- Copy the repo's spec template, fill all placeholders. `id:` must
  equal the filename slug. Status `Draft`, today's date, owner =
  current agent/human. Seed Revision History with `r1 — Initial
  draft`.
- Do not invent criteria, stories, or constraint references to fill
  space.

## Step 3 — Wire up

- Regenerate `INDEX.md`: the **Specs** section gains this spec's row
  (slug, title, status). Create the section if this is the repo's
  first spec.
- If `domains/` exists and the repo groups specs, file it under its
  domain.

## Step 4 — Walk to Agreed (only on explicit approval)

`Draft → Agreed` is a **human gate**: the operator agrees the
contract. Require at least one acceptance criterion, each with its
`Verify:` method, before offering the walk. On agreement, set the
status, append the Revision History row, regenerate `INDEX.md`. From
here the slug is immutable and a normative change returns the spec to
`Draft` for re-agreement.

## Step 5 — Commit

Conventional Commit. A spec is not a decision record, so the
`Rationale:` footer convention for decision-touching commits does not
apply unless the same commit also touches one.

## Step 6 — Offer the next step

An `Agreed` spec is a contract awaiting delivery. Offer to queue the
work (the plan skill), tracing items to this spec's criterion ids.
