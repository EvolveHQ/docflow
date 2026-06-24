---
name: rollup
description: Generate the federation roll-up catalogue for a multi-repo product — aggregate every member repo's ADR metadata into one derived, product-wide view, run from the home repo. Use when the user says "roll up the federation", "generate the product-wide ADR view", "aggregate ADRs across the repos", "refresh the roll-up", or invokes /rollup. NOT for regenerating a single repo's own INDEX (that happens in place during authoring/ship) and NOT for linting consistency (use the audit skill).
---

# rollup

Aggregate the ADR catalogues of every repo in a multi-repo product into
one **derived, read-only** product-wide view. The roll-up is regenerated
from source, never hand-edited — treat it exactly like a repo's own
`INDEX.md`.

## Step 0 — Preconditions

1. This skill runs in the **home repo** of a federation. Confirm a
   `federation-index.md` (the authoritative member list) and a
   `federation.md` with `Role: home` exist. If they do not, stop: either
   this repo is standalone (nothing to roll up) or it is a member, not the
   home — point the user at the home repo.
2. Read `federation.md` to learn the **identity scheme** (default
   repo-prefixed slug `<repo-id>/NNNN-slug`); roll-up rows use it.

## Step 1 — Enumerate members

Read `federation-index.md`. For each row, take the `Repo id` and the
`Pointer` (the path/URL of that member's checkout). The member index is
the **only** source of membership — do not auto-discover repos.

## Step 2 — Collect each member's catalogue

For every member whose checkout is **locally available** at its pointer:

- Read that member's `INDEX.md` (its authoritative local catalogue).
- For each ADR row, capture the number, title, status, date, and
  dependencies, and attach the **owning repo id** and the **federation
  identity** (the scheme from Step 0 applied to the local number).

A member's own `INDEX.md` stays authoritative for that member; this skill
only reads it.

## Step 3 — Handle unreachable members

A member named in the index whose checkout is **not locally available** is
**not** dropped and **not** a failure. Record it in a clearly separated
"Not aggregated this run" list with its repo id and pointer, so the gap is
visible rather than silent.

## Step 4 — Write the roll-up

Write the aggregate to **`ROLLUP.md`** at the configured artefact root (the
same root as `INDEX.md`), so every re-run overwrites the same file:

- A header stating it is **generated — do not hand-edit**, with the run
  date and the set of members aggregated.
- One table across the whole product: federation identity, title, status,
  owning repo, date. Group or sort by owning repo for readability.
- The "Not aggregated this run" list from Step 3.

Do not alter any member's `INDEX.md` and do not write into any other repo.

## Step 5 — Report

Tell the user how many members were aggregated, how many were skipped as
unreachable (and which), and the total ADR count in the roll-up. Remind
them the file is derived: re-run this skill to refresh it rather than
editing it by hand.
