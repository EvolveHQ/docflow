---
name: release
description: Run a RELEASE of this repo's product — promotion of the chosen candidate branch to the released line, version bump, tag, publish — as one gated ritual with an operator confirmation per outward step. Use when the operator says "release", "publish the plugin", "cut a version", "promote the candidate", or invokes /release. Operator-invoked ONLY — an outward-facing commitment is an always-binding escalation trigger, so this skill refuses unattended invocation at every autonomy level. NOT for completing a queued work item (use /ship-item — it ships changes to the development line; this ships the product to the world).
---

# release

Ship the product to the world — the most outward-facing operation in
the system, and therefore the most gated. **Every outward step is a
separate operator confirmation; a declined confirmation ends the
ritual cleanly.**

## Step 0 — Refuse unattended use

An outward-facing commitment (publishing, releasing, promotion) is an
**escalation trigger binding at every autonomy level** — no recorded
`autonomy:` grant covers it. If this invocation is not an operator
present and confirming interactively, stop: state the trigger and
surface to the human. There is no flag, level, or configuration that
overrides this.

## Step 1 — Preconditions

1. Clean working tree, synced with the remote.
2. Read `CONVENTIONS.md` §Git Contract for the branch model: a
   **released line** (`main`, frozen at the last release tag) and a
   **development/candidate line**, or classic direct-to-main.
3. Confirm with the operator: what version number, and from which
   line — the current candidate, or an already-promoted `main`.

## Step 2 — The release gate (before anything outward)

All three, at the release commit:

1. **Verify gate** — run it; require green.
2. **Deterministic evals** — run them; require green.
3. **Behavioural suite** — the release gate proper. Run it now, or
   have the operator explicitly confirm it ran green **at this
   commit**. An older run at an older commit does not count.

Red, or unconfirmed, ends the ritual — report what failed and stop.

## Step 3 — Promotion (candidate-branch repos, when releasing a candidate)

1. The **operator names the winning candidate**. Never infer it —
   even when only one exists, the choice is theirs.
2. Write the **promotion decision record** on the winning candidate:
   what alternatives existed (or that none did), what was compared,
   why this line won. Commit it there — the winner carries its own
   justification into history.
3. Fast-forward the released line: `git checkout main` +
   `git merge --ff-only <candidate>` — promotion is a fast-forward
   by construction; a non-ff state means the released line moved
   unexpectedly: stop and surface.
4. Alternative candidates are **archived unmerged** — kept, never
   deleted, never cross-merged.

Releasing from an already-promoted `main` skips this step.

## Step 4 — Version bump

The **three manifests move together in one commit** — `package.json`
and both plugin manifests, same number (the version-sync gate holds
this). Conventional Commit: `chore(release): X.Y.Z`.

## Step 5 — The outward steps — one confirmation each

Ask before each; a decline stops the ritual with an exact report of
what completed:

1. **Push** the released line.
2. **Tag** `vX.Y.Z` on the release commit; push the tag.
3. **npm publish** — with operator-held credentials via a one-shot
   userconfig (the token is supplied for the single command and
   never written to a file this skill keeps or commits).
4. **GitHub release** — draft the notes from the shipped plan items
   since the previous tag; the operator reviews the text before it
   posts. No decision-record identifiers in the notes — release
   notes are a user-visible surface.

## Step 6 — Record

- Worklog row: version, release commit, gate results, what shipped.
- Snapshot updated: the released version, the promoted line, what
  the development line becomes next.
- Where a plan item owns the release, complete it per the normal
  completion event.

## Partial rituals

Stopping partway is a first-class outcome, not a failure: report
exactly which steps completed (e.g. "promoted and tagged, publish
declined") and what a resumed ritual must skip. Never retry a
declined step on your own.
