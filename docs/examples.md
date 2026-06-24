---
title: Examples
layout: default
permalink: /examples/
---

# Examples

Two end-to-end flows and three examples per skill. The walkthroughs use a
small sample project — **linkfold**, a URL shortener — so the decisions feel
concrete.

> Slash commands are shown in **Claude Code** form (`/bootstrap`). On the
> **pi** coding agent the same skills are `/skill:bootstrap`, `/skill:new-adr`,
> … All skills also auto-trigger from natural-language requests.

---

## Contents

1. [A flow from scratch](#1-a-flow-from-scratch)
2. [Retrofitting an existing repo](#2-retrofitting-an-existing-repo)
3. [Skill-by-skill examples](#3-skill-by-skill-examples)
4. [Multi-repo products: topologies A, B, C](#4-multi-repo-products-topologies-a-b-c)

---

## 1. A flow from scratch

Starting from an empty repo.

### Step 1 — Bootstrap

```
/bootstrap
```

Answer the 10 questions (en-GB · single ADR shape · full lifecycle · use
`plan/` · single agent · direct-to-main · default git contract · defer
optionals · verify gate = `npm test` · no domain rules). Review the plan,
then it writes:

```
linkfold/
├── AGENTS.md          # hard rules entry point
├── CLAUDE.md          # @AGENTS.md
├── CONVENTIONS.md     # authoring rules
├── INDEX.md           # generated ADR table
├── adr/0000-template.md
├── plan/{todo,done}/
└── _agent/{ROLES,WORKLOG,CURRENT_FOCUS,HANDOFF}.md
```

### Step 2 — Record the first decision

```
/new-adr  "store links in Postgres"
```

Creates `adr/0001-postgres-storage.md` and regenerates the index:

```yaml
---
adr: 0001
title: Postgres storage for links
status: Proposed
date: 2026-06-02
---
```

```
INDEX.md:
| 0001 | Postgres storage for links | Proposed | 2026-06-02 | — |
```

### Step 3 — Accept and queue the work

Walk the ADR to `Accepted` (the skill offers this), then:

```
/new-plan  "implement the links table for ADR 0001"
```

```
plan/todo/0001-links-table.md
  Owning ADR : adr/0001-postgres-storage.md
  Scope      : links table + migration
  Exit       : AC1 schema matches ADR · AC2 migration runs clean
```

### Step 4 — Ship it

```
/ship-item
```

```
verify: npm test … OK
fast-forward → main, pushed
plan/todo/0001-links-table.md → plan/done/2026-06-02-links-table.md  (+ shipped footer)
adr/0001  status: Accepted → Implemented
INDEX + WORKLOG updated
```

### Step 5 — Check consistency

```
/audit
```

```
✔ numbering contiguous   ✔ INDEX in sync   ✔ plan coverage
0 blocking · 0 drift · 0 hygiene — clean
```

Repeat the loop for the next decisions — `0002` custom slugs, `0003` Redis
rate limiting, and so on.

---

## 2. Retrofitting an existing repo

Starting from a repo that already has code and history.

### Step 1 — Bootstrap (existing repo)

```
/bootstrap
```

```
Detected: existing repo (retrofit).
Preserving README.md, CONTRIBUTING.md, docs/.
Writing the convention set — merging, not overwriting.
```

### Step 2 — Backfill from code and history

Accept the offer:

```
> Backfill ADRs, plan/done, and CONVENTIONS from the existing code
> and commit history? I'll propose drafts; you approve in batches.  [yes]
```

```
Proposed ADRs (approve in batches):
  0001  Express HTTP API        Implemented
  0002  Postgres storage        Implemented
  0003  JWT authentication      Implemented
+ matching plan/done/<commit-date>-*.md entries
```

### Step 3 — Codify a de-facto rule

```
/add-convention  "we already use Conventional Commits — make it a rule"
```

```
Assessment: durable, repo-wide → codify.
→ CONVENTIONS.md §Git Contract + AGENTS.md hard rule
```

### Step 4 — Audit the result

```
/audit
```

```
✔ numbering 0001–0003 contiguous   ✔ INDEX in sync
⚠ plan coverage: ADR 0003 has no plan/done entry → offer to create
```

### Step 5 — Carry on forward

New work now follows the same loop: `/new-adr` → `/new-plan` → `/ship-item`.

---

## 3. Skill-by-skill examples

> **Heads-up — skills assess first.** `new-adr`, `new-plan`,
> `add-convention`, `brainstorm`, and `agent-wave` open with a brief
> assessment: an opt-out gate, then one scroll-to-select question at a time,
> each with a recommended option — you decide, and a fully-specified request
> lets you skip straight through. The examples below show the *intent*; in
> practice the skill confirms scope with you first.

### bootstrap

1. `/bootstrap` on a fresh repo → 10 questions → full scaffold (see Flow 1).
2. *"set up documentation-led conventions here"* on an existing repo →
   retrofit + backfill offer (see Flow 2).
3. `/bootstrap` choosing **worktree multi-agent + PR integration** → `_agent/`
   also gets `LOCKS.md`, `IN_FLIGHT.md`, `.gitattributes (WORKLOG merge=union)`,
   and a PR-based `prompts/autonomous.md`.

### new-adr

1. `/new-adr "use Postgres for storage"` → `adr/0001-…`, `Proposed`, INDEX wired.
2. *"new ADR: links support custom slugs"* → capability ADR with numbered
   acceptance criteria (`AC1 reserved words rejected`, `AC2 collision → 409`).
3. *"supersede ADR 0003 — move rate limiting to Redis"* →

   ```
   adr/0007-redis-rate-limiting.md  (supersedes: 0003)
   adr/0003  status → Superseded    (superseded-by: 0007)
   ```

### new-plan

1. `/new-plan "queue the work for ADR 0005"` → `plan/todo/00NN` naming owner,
   scope, exit criteria.
2. *"add a plan item for the Redis limiter, depends on the Redis-client ADR"* →
   item with a `depends-on` edge so `agent-wave` won't start it early.
3. *"backlog: analytics dashboard, tracing ADR 0008"* → placed at the right
   queue position by priority number.

### ship-item

1. `/ship-item` → ships the lowest-numbered todo through the full completion
   event (verify → integrate → `todo`→`done` → ADR `Implemented` → INDEX/WORKLOG).
2. *"ship plan/todo/0002"* → ships a specific item.
3. *"mark the custom-slugs work done"* → resolves which item it means, then runs
   the same event. Stops if the verify gate fails — no partial ship.

### add-convention

1. *"add a convention: all timestamps are UTC ISO-8601"* → routed to
   `CONVENTIONS.md`.
2. *"we should always write tests first"* → TDD → an `AGENTS.md` hard rule plus a
   `CONVENTIONS.md` section.
3. *"make 'no secrets in code' a rule"* → the skill **pushes back**: already
   enforced by lint/CI, so it declines to add a duplicate rule (gatekeeper, not
   stenographer).
4. *"don't commit automatically at the end of a cycle — wait for operator
   input"* → assessed as a durable workflow rule → an `AGENTS.md` hard rule plus
   a `CONVENTIONS.md` §Git Contract note:

   ```
   AGENTS.md §Hard rules:
   - Never commit automatically at cycle end. Pause and wait for explicit
     operator approval before each commit (and before any push).
   ```

### audit

1. `/audit` → full punch list: numbering, INDEX sync, plan coverage, required
   sections, status validity, cross-refs, language, privacy leaks.
2. *"are the ADRs in sync?"* → focused numbering + INDEX check.
3. *"check for ADR-privacy leaks before release"* →

   ```
   ⚠ src/api/errors.ts:42  "see ADR 0007" in a customer-facing error string
   ```

### brainstorm

1. `/brainstorm "break 'add billing' into ADRs"` → candidate ADRs + plan items +
   suggested ordering; **writes nothing** until you approve.
2. *"what ADRs do we need for multi-tenant support?"* → decomposition with
   dependency edges between candidates.
3. *"plan the search feature"* → proposes the set, then hands approved candidates
   to `new-adr` / `new-plan`.

### agent-wave

1. `/agent-wave "3 agents, checkpoint after each wave"` → spawns 3 worktree
   subagents, one queue item each, reviews after each wave.
2. *"fan out the next 5 todo items in parallel"* → one wave, budget = 5 items.
3. *"run the queue continuously until empty (PR-based)"* → continuous mode; CI
   gates each merge. Reserves disjoint ADR numbers / plan slots per worktree so
   parallel agents never collide.

> **Concurrent numbering.** ADR/plan numbers are assigned at authoring time,
> so parallel branches can collide on "next". docflow keeps the contiguous
> numbers and closes the race with process guardrails — *decide-before-do*,
> *check-before-merge* (sync + audit + renumber locally), and a *merge-gate
> backstop* — pre-wired only for multi-agent / PR-based repos. Single-agent /
> direct-to-main repos need none of it. See
> [USAGE → Concurrent ADR/plan creation](https://github.com/EvolveHQ/docflow/blob/main/USAGE.md).

### rollup

1. `/rollup` (run from the **home** repo of a federation) → reads
   `federation-index.md`, aggregates each member's `INDEX` into a derived
   product-wide roll-up, and reports how many members were aggregated.
2. *"refresh the product-wide ADR view"* → regenerates the roll-up;
   members not checked out are listed as "not aggregated this run" rather
   than dropped.

> **Federation.** `/rollup` and the cross-repo `/audit` checks run from the
> home repo over the local checkouts named in `federation-index.md`. See
> the [methodology](https://evolvehq.github.io/docflow/methodology/#5-scaling-to-many-repositories).

---

## 4. Multi-repo products: topologies A, B, C

When one product spans several repositories, bootstrap wires them into a
**federation**. You choose a **topology** once, when establishing; every
repo that joins inherits it. These examples split **linkfold** into two
repos — `linkfold-web` and `linkfold-api` (repo-ids `web` and `api`).

The federation step (Q11) runs after the standard bootstrap assessment:
*"Is this repo part of a multi-repo product?"* → **establish** or **join** →
(establish only) **topology** + **identity scheme** (default repo-prefixed
slug `<repo-id>/NNNN-slug`).

### 4A — Topology A: central decisions repo

All product-wide decisions live in one dedicated repo; code repos reference
them and never duplicate.

1. In a fresh `decisions` repo: `/bootstrap` → multi-repo **yes** →
   **establish** → topology **A**. It becomes `Role: central` and writes
   `federation-index.md` + `federation.md` (`Topology: A`, `Repo id: decisions`).
2. In `linkfold-web`: `/bootstrap` → **join** → supply the home pointer
   (`../decisions`) and the topology/identity. It writes only its own
   `federation.md` (`Role: member`) and — per topology A — holds **no**
   product-wide ADRs; its `adr/` is for local-implementation decisions that
   reference `decisions/0001` etc.
3. Add `web` and `api` rows to `decisions/federation-index.md` (a deliberate
   edit in the central repo).
4. `/rollup` and `/audit` run from `decisions`.

*Use A when product-wide decisions need a single, code-free home.*

### 4B — Topology B: distributed + federation

No repo owns product-wide decisions; each repo owns its own catalogue and
the roll-up is the only product-wide view.

1. In `linkfold-web` (the first repo): `/bootstrap` → **establish** →
   topology **B**. It becomes `Role: coordinator` — it holds the member
   index for membership only, not a privileged catalogue.
2. In `linkfold-api`: `/bootstrap` → **join**. It owns its ADRs in full
   (`Role: member`); nothing is "product-wide" except by cross-repo
   reference.
3. Register `api` in the coordinator's `federation-index.md`.
4. `/rollup` from the coordinator gives the combined product view — there is
   no central authority.

*Use B when each repo is autonomous and you only need a combined view.*

### 4C — Topology C: home repo + local (recommended default)

One home repo holds product-wide decisions; members keep local decisions
alongside and reference the home for product-wide ones.

1. In `linkfold-web` (the home): `/bootstrap` → **establish** → topology
   **C** (default). `Role: home`; it holds product-wide ADRs *and* its own
   local ones.
2. In `linkfold-api`: `/bootstrap` → **join**. `Role: member`; it keeps
   local ADRs and references `web/0007` for product-wide decisions.
3. Register `api` in `linkfold-web/federation-index.md`.
4. A cross-repo decision (say, a shared auth contract `web/0007`) gets **one
   plan item per affected repo**. Its aggregate status shows in the roll-up
   — "1 of 2 repos" until both ship, then `Implemented`.
5. `/rollup` and `/audit` run from the home.

*Use C — the default — for the common "one lead repo, several services" shape.*

> **Across all three:** numbering stays contiguous *per repo*; the federation
> identity (`<repo-id>/NNNN-slug`) is the cross-repo key; cross-repo
> references resolve through the member index; aggregate status is derived in
> the roll-up; and no tool writes across a repo boundary — membership and
> convention drift are reconciled by `/audit`, not remote-pushed. See the
> [methodology](https://evolvehq.github.io/docflow/methodology/#5-scaling-to-many-repositories).

---

[← Back to docflow](../)
