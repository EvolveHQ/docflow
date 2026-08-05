# Current Focus

This file is the LIVE SNAPSHOT of any in-flight session. It is short
on purpose — the durable record lives in git (`git log`),
`_agent/WORKLOG.md`, and `plan/done/`. The queued work lives in
`plan/todo/`. If status files and git disagree, git is authoritative;
correct this file.

## Active state

- **Branch:** `v1/agent-loop-graph` — the **second v1 candidate**,
  cut clean from the v0.9.4 tag (ffd0b4e) on 2026-08-05. **Thesis:
  agent loop/graph management.** `main` is the released line, frozen
  at v0.9.4, advanced only by promoting exactly one candidate; the
  first candidate is `v1/aligned-autonomy` (the verified tier);
  candidates never merge — see
  adr/0034-candidate-branch-development.md.
- **Released:** 0.9.4 (tag + npm). **No release from this branch —
  internal testing only**, until the operator's explicit instruction.
- **Base state:** the clean 0.9.4 product — 9 skills, 33 prior ADRs,
  pre-verified-tier (no manifest, no evidence machinery, no
  constraints file on this line). What this candidate builds on top
  is its own decision trail, starting at 0035.
- **Active item:** none — the plan queue is empty. **Next: the
  loop/graph-management design** — brainstorm the approach into
  classified candidates, decisions first.
- **Blockers:** none.

## Pointers

- Catalogue numbers above 0033 on this branch are independent of the
  sibling candidate's — the never-merge rule means they can never
  collide on one line.
- Ship-by-ship history: `_agent/WORKLOG.md`.
