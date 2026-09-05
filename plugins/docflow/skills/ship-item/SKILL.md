---
name: ship-item
description: Ship a plan/todo item in a documentation-led repo — run the verify gate, integrate per the repo's model (fast-forward or PR), git mv todo→done with a shipped footer, advance the owning ADR(s) to Implemented, and regenerate INDEX. Use when the user says "ship this", "complete the plan item", "mark done", or "close out the queue item".
---

# ship-item

Execute the completion event for one queue item. This is the most
order-sensitive operation in the system — follow the steps exactly.

## Step 0 — Preconditions and context

1. Confirm the repo is bootstrapped with a `plan/` queue.
2. Read `CONVENTIONS.md` and `AGENTS.md` for: the **integration model**
   (direct-to-main fast-forward vs. PR-based with required CI), the
   **verify gate** command, the **multi-agent mode**, and the Git
   contract (signed commits, tags, trailers). Resolve `adr/`, `plan/`, and
   `INDEX.md` against the **artefact root** recorded in `CONVENTIONS.md`
   (default: repository root).

## Step 1 — Select the item

Default to the lowest-numbered `plan/todo/` file, or the one the user
names. Read it and the owning ADR(s) in full.

## Step 2 — Verify

Run the repo's verify gate. **Require a pass.** Do not bypass with
`--no-verify` or equivalent. If it fails, stop, surface the failure,
fix the root cause, re-run.

## Step 3 — Prepare integration (per the repo's model)

- **Direct-to-main, fast-forward:** `git merge --ff-only <branch>` (or
  the work is already on `main`) so the integration branch contains
  the verified work locally. Do not push yet: the completion commit in
  Step 7 must ride with the work, and the push is the completion event.
- **PR-based:** push the branch and open a draft pull request. Keep it
  draft until Steps 4-7 commit the completion changes as the last
  branch commit before the request is marked ready.

## Step 4 — Move the queue item

Make the queue move before the completion event:

- **Direct-to-main:** move it on the local integration branch before
  the push.
- **PR-based:** move it on the pull-request branch before marking the
  request ready; do not make a follow-up commit on the integration
  branch after merge.

Then:

- `git mv plan/todo/NNNN-<slug>.md plan/done/<YYYY-MM-DD>-<slug>.md`
  (today's date prefix).
- Amend the moved file with a shipped footer:
  - direct-to-main: **"Shipped at HEAD `<sha>`"** plus any artefact id,
    image tag, deploy id, or release identifier. If the SHA is not
    known until the completion commit exists, amend that commit once to
    replace the placeholder with the actual HEAD SHA.
  - PR-based: name the pull request and any artefact id, image tag, or
    deploy id. Do not invent a future integration-branch SHA.
- If the queued item carries a `Status` section for in-flight state,
  remove that section; shipped state is represented by `plan/done/` and
  git history.

## Step 5 — Advance the ADR(s) and regenerate

- Advance each owning ADR's `status:` from `Accepted` to `Implemented`.
- Append a Revision History row if the status change is substantive
  (it is). Regenerate `INDEX.md` to match.

## Step 6 — Record

**Nothing else to write.** The completion commit, the moved
`plan/done/` file and its shipped footer are the record; the
coordination mode prescribes no shipped-state file, dashboard or
snapshot to update.

One transitional exception: a repo scaffolded before this convention
may still *record* a log or snapshot step in its own `AGENTS.md` /
`CONVENTIONS.md`, alongside the files it wrote for them. Honour what
that repo's recorded conventions ask for — a half-maintained log is
worse than either state — and say it is a legacy layout. Never create
such a file, and never add the step to a repo whose conventions do not
already have it.

## Step 7 — Commit and complete

Conventional Commit, `Rationale:` footer (touches an ADR). Group the
move + any Status removal + status advance + INDEX regeneration into
one coherent commit so the completion event is atomic in history. The
commit message names the plan item and the owning ADR(s).

- **Direct-to-main:** after the completion commit exists and the
  footer names the actual HEAD SHA, push the integration branch. The
  successful push is the completion event.
- **PR-based:** push the branch after the completion commit, wait for
  CI green (`gh pr checks --watch`), mark the pull request ready, then
  merge with the repo's strategy. The merge is the completion event;
  confirm it landed on `main`, and make no follow-up commit on the
  integration branch.
