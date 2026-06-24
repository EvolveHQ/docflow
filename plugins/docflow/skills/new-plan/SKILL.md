---
name: new-plan
description: Queue a UNIT OF WORK in the plan/todo queue of a documentation-led repo, tracing to an existing ADR — names the owning ADR(s), scope, exit criteria mapped to acceptance criteria, dependencies, and queue position. Use when the user says "add a plan item", "queue this work", "create a todo for ADR X", "new plan", "put this on the backlog", or invokes /new-plan. NOT for recording the decision itself (use /new-adr) and NOT for shipping/completing an item already queued (use /ship-item).
---

# new-plan

Add one item to the implementation queue.

## Step 0 — Preconditions and context

1. Confirm the repo is bootstrapped and a `plan/` queue exists. If the
   repo was bootstrapped without a plan folder (Q4a = skip), stop and
   say so — there is no queue to add to.
2. Read `CONVENTIONS.md` for the plan-folder convention and the
   completion event, and `plan/README.md` if present. Resolve `plan/`
   against the **artefact root** recorded there (default: repository root).
3. `ls plan/todo/` to learn existing numbers and priority ordering.

## Step 0.5 — Assessment (run first)

Run the shared assessment protocol before queueing:

- **Opt-out gate first.** Ask whether to run the assessment or skip to
  writing the item. Recommend **running** it when the request arrived
  with little or no context; recommend **skipping** when the item is
  already fully specified.
- Ask the questions below **one at a time**, each with a **recommended
  option** and a one-line reason; wait for each answer.
- Use **structured selection** (single- or multiple-choice). If the host
  exposes a structured single-/multi-select question tool, use it and
  mark the recommended option; otherwise list options A/B/C in plain text
  and name the recommended one. Use **free text only** where an
  enumerable set is impossible (e.g. the scope summary).
- **The operator decides.** Never proceed past a question without an
  answer, and never guess scope when invoked with no context.

Questions (skip any the request already answers):
1. **Owning ADR(s)** — select from the catalogue (single or multiple).
   *Recommended: the ADR named in the request.*
2. **Dependencies** — none, or select the plan items / ADRs that must
   land first. *Recommended: none.*
3. **Priority / position** — next number, or insert ahead of existing
   items. *Recommended: next number.*
4. **Scope & exit criteria** — free text, mapped to the owning ADR's
   numbered acceptance criteria where possible.

## Step 1 — Identify the owning ADR(s)

- Ask which ADR(s) this work implements. Validate they exist in
  `adr/`.
- Normally a queue item tracks an **Accepted** ADR. If the named ADR is
  still `Proposed`, warn — you can queue ahead of acceptance, but the
  work is not yet authorised. If it has no ADR at all, suggest running
  the **new-adr** skill first; plan items should trace to a decision.
- **In a federation** (a `federation.md` exists): the owning ADR may live
  in **another** repo (the home/central). Name it by its **federation
  identity** (`<repo-id>/NNNN-slug`); the plan item itself lives in **this**
  repo — the one whose code the work changes. A decision spanning several
  repos gets **one item per affected repo**, each tracing to the same
  owning ADR (the grouping point — no umbrella record).

## Step 2 — Pick number and position

- `plan/todo/NNNN-<slug>.md`, zero-padded. **Lower numbers run first** —
  ask where this sits in priority and renumber neighbours only if the
  user wants it inserted ahead of existing items.

## Step 3 — Write the item

The file names, at minimum:
- Owning ADR(s) by relative path.
- Scope — what is in, what is explicitly out.
- Exit criteria — map directly to the ADR's numbered acceptance
  criteria where possible.
- Dependencies — other plan items or ADRs that must land first.

## Step 4 — Commit

Conventional Commit. If the file references an ADR by number in its
body that is fine (the plan queue is internal — the ADR-privacy rule
only forbids ADR references in **user-visible product** surfaces).
