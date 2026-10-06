# AGENTS.md

## What this repository is

Synthetic repository for producer compatibility

## Picking up this repo

Read these, in order, before any tool calls:

1. `AGENTS.md` (this file) — the hard rules. Read in full.
2. `CONVENTIONS.md` — authoring rules, ADR status semantics, the git
   contract.

3. `plan/README.md` — how the work queue is used.
4. The newest `plan/done/` entries and
   `git log --first-parent --oneline -n 20` — the shipped-work record.
5. `INDEX.md` — the ADR catalogue: an ADR's filename and its dependency
   chain. Sorted by number, not by work order.

6. **What is in flight** — no file records it, so derive it:
   `git worktree list`, then `git fetch` and
   `git branch -r --list 'origin/claim/*'`, plus open draft and ready pull
   requests (`gh pr list --state open`) where a host is reachable. A
   `claim/<item-key>` branch means that queue item is already claimed —
   exclude it unless the operator explicitly requests continuation.
7. The queue item you are about to work, `plan/todo/NNNN-<slug>.md`, and
   the ADR(s) it names — both in full.

