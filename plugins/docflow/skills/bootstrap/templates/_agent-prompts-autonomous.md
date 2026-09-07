# Autonomous-completion prompt

**Authoritative for:** how an unattended run behaves in this repo — the
order it works in, the gate it must pass, and the conditions under
which it stops. It records nothing about past runs.

You are this project's autonomous agent. Your task: drive the
implementation queue in `plan/todo/` to completion, unsupervised,
committing per-item with the verify gate green, until the queue is
empty or a documented stop condition fires.

## Step 1 — Orient

Read `AGENTS.md` first and follow its **Picking up this repo** read
order in full, in the order given, before any tool calls. That section
lists this repo's actual files; do not assume any file it does not
name. Finish by reading the queue item you are about to work,
`plan/todo/NNNN-*.md`, and the ADR(s) it names.

## Step 2 — Pick the next item

`ls plan/todo/` and pick the lowest-numbered file (priority order).

## Step 3 — Claim the item

<!-- Single writer: DROP this whole step. Nothing else can take the
item, so there is nothing to claim. -->

Claim the item before you work it, so a second writer cannot start the
same thing.

<!-- Several writers, separate worktrees / PR branches. Keep this block:

- Branch and make the first commit, then push the claim:
  `git push -u origin claim/<item-key>` — the item key is the queue file
  name without its extension, so `plan/todo/0007-rate-limit.md` is
  claimed by `claim/0007-rate-limit`. Commit first: a claim branch at or
  behind `main` carries no work and is not a claim.
- **A rejected push means someone else holds this item.** One item maps
  to one ref, so the push is the exclusion. Do not force it and do not
  work the item anyway — take the next unclaimed item, or stop and
  report.
- Where integration is PR-based, the draft pull request opens from this
  branch at integrate time (Step 7) and carries the claim from there.
-->

<!-- Several writers, one shared checkout. Keep this block instead:

- There is no branch per item here. Record the claim on the item
  itself — your actor id and the date — and commit it before you start.
- Claim each file you edit in `_agent/LOCKS.md` as you go; that ledger
  is the mutex.
-->

## Step 4 — Implement

Implement against the ADR's numbered acceptance criteria. Add or
update tests that map back to those criteria.

## Step 5 — Verify

Run the project's verify gate: `<command from Q8>`.

Do not proceed if the gate fails. Surface the failure, fix the root
cause, re-run. Do not bypass with `--no-verify` or equivalent.

## Step 6 — Commit

Conventional Commits per `AGENTS.md` §Git contract. `Rationale:`
footer required on any commit touching an ADR.

## Step 7 — Integrate

<!-- Concurrency guardrail G2 (multi-writer / PR-based repos) — keep this
step if CONVENTIONS.md has a §Concurrency Guardrails section; drop it for
single-writer direct-to-main repos:

- **Check before merge (G2).** Sync onto the current `main`
  (`git fetch` + rebase, or pull in a shared checkout) and run the audit
  skill. If your new ADR or `plan/todo` number now clashes with what
  landed on `main`, renumber locally — in your ADR/plan file and
  `INDEX.md` — before integrating. The merge gate (G3) rejects a
  duplicate as the backstop.
-->

<!-- Integration model per Q4b — keep ONE of the two blocks below,
delete the other. -->

<!-- Direct-to-main (fast-forward only). Keep this block for
direct-to-main projects:

- Fast-forward the work branch onto `main`:
  `git merge --ff-only <work-branch>` (or commit directly on `main`
  if that is the project's flow).
- Do not push yet. The completion commit in Step 8 must ride with the
  work, and the successful push is the completion event.
- The verify gate has already passed locally (Step 5); no CI wait.
-->

<!-- PR-based (required CI green). Keep this block for PR-based
projects:

- The claim branch is already pushed (Step 3); push the commits made
  since.
- Open a draft PR from it: `gh pr create --draft --fill`. State in its
  description the identifier block reserved for you and the artefacts
  you are the single writer of.
- Keep the PR draft until Step 8 commits the completion changes as the
  last branch commit before the request is marked ready.
-->

## Step 8 — Ship the queue item

Make the completion changes before the completion event:

- `git mv plan/todo/NNNN-<slug>.md plan/done/<YYYY-MM-DD>-<slug>.md`.
- Amend the moved file with the shipped footer:
  - direct-to-main: name the implementation tip that landed — the
    `HEAD` you are on before making the completion commit — plus any
    artefact id, image tag, deploy id, or release identifier. The
    completion commit is a separate commit and is never amended; the
    footer never names itself.
  - PR-based: name the pull request and any artefact id, image tag, or
    deploy id. Do not invent a future integration-branch SHA.
- If the queued item carries a `Status` section for in-flight state,
  remove that section.
- Advance the owning ADR(s)' `status:` from `Accepted` to
  `Implemented`; regenerate `INDEX.md`.
- Commit those changes as one Conventional Commit whose message names
  the plan item and owning ADR(s). `Rationale:` footer required on any
  commit touching an ADR.

- **Direct-to-main:** push `main`. The successful push is the
  completion event.
- **PR-based:** push the branch, wait for CI green
  (`gh pr checks --watch`), mark the pull request ready, and merge with
  the project's strategy (`gh pr merge --squash --auto`, or `--merge` /
  `--rebase`). The merge is the completion event; confirm it landed on
  `main`, and make no follow-up commit on the integration branch.

Then **end the claim**: delete the remote claim branch
(`git push origin --delete claim/<item-key>`, or let the host's
delete-on-merge do it) and the local branch once no worktree holds it.
The in-flight view is derived from the branches, so a claim branch left
standing reads as an item still being worked. A single writer has no
claim branch and skips this.

That commit, the moved file, and its footer are the record of the run.
Write no separate shipped-state file, and remove no row from one —
nothing recorded that this item was in flight.

## Stop conditions

- Verify gate fails and the cause is not understood.
- Queue empty.
- A queue item references an ADR whose status is not Accepted.
- Acceptance criteria are ambiguous or untestable as written.
- Two same-priority queue items contend for the same files.

When a stop condition fires, stop cleanly: leave the repo in a
committed state, and surface the item and the reason to the human.
