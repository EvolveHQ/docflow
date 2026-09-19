---
title: Portable workspaces
mermaid: true
---

# Portable workspaces

A **workspace** is an adopter-owned Git repository that holds the shared,
cross-repository memory for a product made of several independent
repositories. It is deliberately separate from every member repository: the
workspace owns the shared records, while each member keeps its own method,
instructions and history. A workspace is plain files checked by a
deterministic validator — not a scheduler, a service, an authentication layer
or a live ownership register.

Use a workspace when one product spans more than one repository and the shared
picture — outcomes, decisions, work, knowledge and executed runs — does not
belong inside any single member. Stay with a single `plan/` queue when one
repository is the whole product; adding a workspace then adds a second place
to look for no benefit.

## What a workspace contains

An adopter creates the workspace deliberately (the `workspace-setup` command).
It owns `README.md`, `AGENTS.md` and `.docflow_workspace/` with
`workspace.yaml`, `CONVENTIONS.md`, `INDEX.md`, the record folders and curated
`agents`, `profiles` and `integrations` directories. Checkouts live under
`/repos/`, and private local state under `/.docflow_workspace/local/`; both are
ignored by Git and never canonical.

<div class="mermaid">
graph LR
  WS[".docflow_workspace<br/>workspace home"]
  WS --- REG["workspace.yaml<br/>registry"]
  WS --- IDEAS["ideas/"]
  WS --- DEC["decisions/"]
  WS --- WORK["work/"]
  WS --- KNOW["knowledge/"]
  WS --- RUNS["runs/"]
  WS --- MAND["mandates/"]
  WS -->|registers| A["docflow member<br/>native ADR catalogue + plan/ queue"]
  WS -->|registers| B["non-docflow member<br/>native AGENTS.md + own workflow"]
  WS -.->|identity only| C["remote-only reference"]
</div>

## When to use a workspace

- **Greenfield multi-repository product.** You are starting a product that
  will span several repositories and want one shared record from day one.
- **Existing repositories that already work together.** You have a handful of
  repositories with their own conventions and no shared cross-repository view.
- **A single docflow repository outgrowing itself.** One repository holds the
  decisions today; a second is about to appear.
- **A federation that needs a home.** You already federate ADR catalogues
  across repositories and want ideas, work, deliveries and runs in one place.

A workspace does **not** replace native repositories. It records shared
outcomes and observed delivery; each member still runs its own workflow and
completes its own work.

## Kinds of items and their workflows

The workspace holds six kinds of item. Each is a Markdown file with a
JSON-compatible front matter block, and each has an identity
`{home, id}`; references are durable and source-bound.

| Kind | What it is for | States |
|---|---|---|
| **Idea** | A candidate outcome not yet agreed. Sets priority only. | backlog → selected / rejected / discarded |
| **Decision** | An accepted shared choice. Acceptance records agreement, not execution. | proposed → accepted / rejected / superseded |
| **Work** | A unit of cross-repository work, with deliveries and testable criteria. | planned → active → review → done / cancelled |
| **Knowledge** | A sourced observation or reference, including external and derived documents. | no lifecycle; has `review_when` |
| **Run** | One executed assignment: a dispatched attempt, or an imported historical record. | running → succeeded / failed / stopped / unknown |
| **Mandate note** | The committed operator note that authorises a decision acceptance or a grant. | immutable record |

<div class="mermaid">
stateDiagram-v2
  direction LR
  state "Idea" as I {
    [*] --> backlog
    backlog --> selected
    backlog --> rejected
    backlog --> discarded
    selected --> backlog
  }
  state "Decision" as D {
    [*] --> proposed
    proposed --> accepted
    proposed --> rejected
    accepted --> superseded
    rejected --> superseded
  }
  state "Work" as W {
    [*] --> planned
    planned --> active
    active --> review
    review --> done
    planned --> cancelled
    active --> cancelled
    review --> cancelled
  }
  state "Run" as R {
    [*] --> running
    running --> succeeded
    running --> failed
    running --> stopped
    running --> unknown
    unknown --> succeeded
    unknown --> stopped
  }
</div>

**Work and deliveries.** Work owns one or more **deliveries**, each with a
testable **criterion**. A delivery is observed from the member's own native
evidence: a merge, a required check, a `plan/todo`→`plan/done` move, a branch
head. Work reaches `done` only when every required delivery records its native
completion with passed evidence, and every criterion has passed evidence.
Completing work leaves the still-current agreement accepted.

**Runs, dispatched and imported.** A dispatched run carries a **brief** bound
to an exact grant revision, then a **receipt** with the exact commands, exit
codes, source revisions, evidence, blockers and next action. An **imported**
run has no brief and no grant: it backfills execution that happened under a
native mandate, is read-only, and can never satisfy a dispatch, an active
work-state check or a claim overlap.

**Mandate notes.** Authority is never a chat message. An accepted decision or a
grant cites a committed mandate note under
`.docflow_workspace/mandates/<date>-<slug>.md` by workspace home, path and full
Git revision; the cited revision must contain the note.

## The five commands

<div class="mermaid">
graph TD
  SETUP["workspace-setup<br/>create or adopt the home"]
  STATUS["workspace-status<br/>read-only briefing"]
  SCOPE["workspace-scope<br/>ideas, decisions, work,<br/>deliveries, criteria, grants"]
  DISPATCH["workspace-dispatch<br/>check authority, write a brief"]
  SYNC["workspace-sync<br/>reconcile receipts, refresh INDEX"]
  SETUP --> STATUS --> SCOPE --> DISPATCH --> SYNC
  SYNC -.->|next briefing| STATUS
</div>

- **workspace-setup** creates or deliberately adopts the workspace home and
  registry. It is the only command that writes the home itself.
- **workspace-status** gives a read-only briefing and fresh-session recovery:
  priorities, owners, current authority, delivery progress, blockers and next
  actions. It never writes.
- **workspace-scope** records ideas, accepts decisions, records work with
  deliveries and criteria, and records grants and recommendations from a
  committed mandate note. It is disjoint from the repository `new-plan` skill.
- **workspace-dispatch** checks the current grant, native claim, dependencies
  and resources, writes a bounded brief, and hands it to a native host.
- **workspace-sync** reconciles returned receipts and observes member state
  read-only, updating delivery observations and criteria evidence only from
  checked native evidence, then refreshes `INDEX.md`. It works whether or not
  this workspace dispatched the work.

Selection and agreement grant **no execution authority**. A prepared pull
request or an unmerged plan item never marks a delivery complete.

## Member repositories

A workspace registers three kinds of member. Membership grants no authority;
it only declares where native truth lives.

- **docflow members** keep a native ADR catalogue, `CONVENTIONS.md`, a
  `plan/` queue and their own completion event. The workspace references their
  decisions and deliveries; it never copies or rewrites their queue.
- **non-docflow members** keep their own `AGENTS.md`/`README.md` and native
  workflow. The workspace contract preserves those instructions untouched and
  only references the member by identity and revision.
- **remote-only reference members** exist only as identity, aliases and a
  remote URL with `role: reference`. They have no local path or instructions;
  references to them are identity-only and actions stay non-mutating
  (read/test/report).

<div class="mermaid">
graph TD
  WS["Workspace home"]
  subgraph delivery["delivery members (writable, native-owned)"]
    DF["docflow member<br/>ADR/ + plan/ queue"]
    ND["non-docflow member<br/>AGENTS.md + own workflow"]
  end
  REF["remote-only reference<br/>identity only, non-mutating"]
  WS -->|outcome + criteria| DF
  WS -->|outcome + criteria| ND
  WS -.->|reference| REF
  DF -->|native evidence: merge, checks, plan move| WS
  ND -->|native evidence: merge, checks| WS
</div>

## Use cases

### 1. Greenfield product across repositories

1. Create the workspace home with **workspace-setup**, choosing the product
   identifier and the repository paths.
2. Register the first members in `workspace.yaml` (delivery role, local path,
   instructions file).
3. Run **workspace-status** to confirm the registry validates and reports no
   work yet.
4. Record the first idea with **workspace-scope**, select it, and accept the
   shared decision that follows.
5. Record work with its deliveries and criteria, then **workspace-dispatch**
   the first brief. Reconcile it with **workspace-sync**.

### 2. Retrofit existing repositories

1. Clone the existing repositories as independent checkouts under `/repos/`
   (never submodules, never a copied queue).
2. Run **workspace-setup** and register each repository with its real path and
   instructions file; keep every native workflow untouched.
3. Run **workspace-status** and fix any registry diagnostics; confirm each
   native `AGENTS.md` is read explicitly.
4. Capture the cross-repository outcomes that are currently only in people's
   heads as ideas and decisions with **workspace-scope**.
5. Import any already-executed history as read-only **imported runs**, then
   dispatch new work.

### 3. Migrating a single docflow repository to a workspace

1. Keep the existing repository's ADR catalogue, its plan queue and its
   completion event exactly as they are.
2. Create the workspace home and register the repository as a docflow member.
3. Reference the repository's existing decisions from the workspace rather
   than copying them; the native catalogue stays authoritative.
4. Move only the genuinely cross-repository outcomes into the workspace.
5. Continue to run `new-adr`, `new-plan` and `ship-item` **inside** the member;
   use **workspace-sync** to observe the merges and plan moves.

### 4. Other cases

- **Mixed docflow and non-docflow product.** Register both member kinds; the
  workspace holds one shared outcome graph while each member keeps its own
  method. Non-docflow instructions are preserved by the contract.
- **Remote-only references.** Register a repository you consume but never
  check out with `role: reference` and a remote URL. Cite it by identity; do
  not attempt a local revision check.
- **A federation becoming a workspace.** When several repositories already
  federate ADR catalogues, create a workspace home and register the members;
  the workspace adds ideas, work, deliveries and runs around the existing
  catalogues without rewriting them.

## Authority and verification limits

The validator (`node validate.mjs <workspace-root> --at <UTC-time>`) checks
supplied records for consistency; it does not authenticate an approver, prove
that an external action happened, or enforce live host permissions. A
structurally valid planned workspace can pass and still have no execution
authority. Native-host, consumer and operator qualification remain separate
from a green package check.

Ready to start? See the
[methodology]({{ '/methodology/' | relative_url }}) for the repository
conventions and [Examples]({{ '/examples/' | relative_url }}) for worked
skill-by-skill flows.
