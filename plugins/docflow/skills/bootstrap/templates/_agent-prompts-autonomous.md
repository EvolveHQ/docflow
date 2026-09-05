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

## Step 3 — Implement

Implement against the ADR's numbered acceptance criteria. Add or
update tests that map back to those criteria.

## Step 4 — Verify

Run the project's verify gate: `<command from Q8>`.

Do not proceed if the gate fails. Surface the failure, fix the root
cause, re-run. Do not bypass with `--no-verify` or equivalent.

## Step 5 — Commit

Conventional Commits per `AGENTS.md` §Git contract. `Rationale:`
footer required on any commit touching an ADR.

## Step 6 — Integrate

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
- Push: `git push origin main`.
- The verify gate has already passed locally (Step 4); no CI wait.
-->

<!-- PR-based (required CI green). Keep this block for PR-based
projects:

- Push the work branch: `git push -u origin <work-branch>`.
- Open a draft PR: `gh pr create --draft --fill`.
- Wait for CI: `gh pr checks --watch`. The verify gate runs in CI;
  do not proceed until it is green.
- Mark ready: `gh pr ready`.
- Merge with the project's strategy:
  `gh pr merge --squash --auto` (or `--merge` / `--rebase`).
- Confirm the merge landed on `main` before treating the item as
  shipped.
-->

## Step 7 — Ship the queue item

Once the change is on `main` (fast-forwarded or PR-merged):

- `git mv plan/todo/NNNN-<slug>.md plan/done/<YYYY-MM-DD>-<slug>.md`.
- Amend the moved file with a "Shipped at HEAD `<sha>`" footer (and
  any artefact id, image tag, deploy id, PR link).
- Advance the owning ADR(s)' `status:` from `Accepted` to
  `Implemented`; regenerate `INDEX.md`.

That commit, the moved file, and its footer are the record of the run.
Write no separate log of what you did.

## Stop conditions

- Verify gate fails and the cause is not understood.
- Queue empty.
- A queue item references an ADR whose status is not Accepted.
- Acceptance criteria are ambiguous or untestable as written.
- Two same-priority queue items contend for the same files.

When a stop condition fires, stop cleanly: leave the repo in a
committed state, and surface the item and the reason to the human.
