---
title: docflow
---

![docflow — ADR-driven documentation workflow](preview.png)

**docflow** turns any repository into a **documentation-led, ADR-driven**
project. A `bootstrap` skill scaffolds (or retrofits) an **Architecture
Decision Record (ADR)** catalogue, a `plan/` work queue, `AGENTS.md`
conventions, and multi-agent coordination files — the small set of canonical
files a repo can be driven from by humans and coding agents alike. A set of
**lifecycle skills** then author, queue, ship, and audit ADRs.

It runs on **five coding agents** — Claude Code, Claude Cowork, pi, Codex,
and OpenCode — from the same skill files, and scales from a single
repository to a **multi-repo product**.

**The verified tier** *(in development — beyond the released 0.9.4)*:
a repo can adopt an explicit trust posture and a machine-readable
capability manifest (`docflow.yml`); every acceptance criterion names
its verification method, and shipping writes **bound evidence records**
— digest-tied to the criterion's exact text — so *Implemented* is only
valid while every criterion has matching proof; the repo's inviolable
boundaries live in an enumerated, decision-gated `CONSTRAINTS.md`;
rejected proposals become `Withdrawn` and abandoned work is `dropped`,
never deleted; and product repos can split **pure decision ADRs from
living capability specs** (`spec/<slug>.md`). Above the records sit
**goals** (`goals/G-<slug>.md` — the recorded "why", with `serves:`
edges from the records advancing them and a generated `COVERAGE.md`
walk down to evidence), a **validation loop** (`validate` gathers a
goal's measure and records *your* verdict as an append-only outcome
entry — harm handled separately, whatever the verdict), a **graded
autonomy ladder** (`autonomy: L0–L5` in the manifest — how much an
agent may initiate unattended, with eight escalation triggers binding
at every level), a sanctioned **model-migration path** (per-record
approval, a `MIGRATION.md` mapping, evidence never touched), and a
**release ritual** (promotion + publish, one operator confirmation
per outward step). Tools can locate any docflow
repository's catalogue deterministically via the `.docflow` marker
(directory or one-line pointer file — the same pattern as git's `.git`). See the
[methodology]({{ '/methodology/' | relative_url }}) for the formal definition of the conventions,
why they help, and where they fall short.

## Skills

| Skill | Purpose |
|-------|---------|
| `bootstrap` | Scaffold or retrofit the whole convention set. Start here. Opens with an express / guided / full depth choice — a quick conservative setup needs almost no questions. |
| `new-adr` | Author one ADR — next contiguous number, right shape, INDEX + domain wiring, supersede linkage. |
| `new-spec` | Author one **living capability spec** (`spec/<slug>.md`) on the decisions+specs record model — slug-identified, edited in place, human-gated `Draft`→`Agreed`. |
| `new-plan` | Add a `plan/todo` item tracing to its owning record(s) — ADR, or spec criterion ids where specs exist. |
| `ship-item` | Run the completion event: verify → execute each criterion's `Verify:` method and write **bound evidence** → integrate → `todo`→`done` → owning record → `Implemented` (only with full valid evidence) → INDEX/WORKLOG. |
| `add-convention` | Assess whether a convention is worth codifying, route it to the right home (or to an ADR), then add it — e.g. enable optional practices like TDD on demand. |
| `audit` | Lint the repo against its own conventions — numbering, INDEX sync, plan coverage, ADR-privacy leaks, declared-vs-computed status, evidence re-runs, constraints discipline, and more. |
| `brainstorm` | **The front door.** Decompose a problem into *classified* candidates (choice / behaviour / rule / boundary / outcome / job) and route each to its writer on approval — an approved outcome becomes a goal file. Writes nothing else until approved. |
| `challenge` | **The interrogator.** Pressure-test a draft by rubric, or elicit the boundaries you have not written down. Advisory — writes nothing, gates nothing, and may honestly return "solid, nothing to add". |
| `agent-wave` | Orchestrate a wave of parallel worktree subagents over the queue, with checkpoint or continuous supervision. |
| `validate` | The loop's third human gate *(in development)*: gather a due goal's measure, record **your** verdict (achieved / execution short / hypothesis wrong / inconclusive) as an append-only outcome entry, apply the goal transition. Harm is asked separately on every verdict. |
| `rollup` | For a multi-repo product: aggregate every member repo's ADRs into one derived, product-wide roll-up (run from the home repo). |
| `release` | The outward ritual *(in development)*: release gate (incl. the behavioural suite at the release commit) → promotion of the operator-chosen candidate → tag, push, npm, GitHub release — one confirmation per outward step; refuses unattended use at every autonomy level. |

## Install

### Claude Code — from this marketplace

```
/plugin marketplace add EvolveHQ/docflow
/plugin install docflow@evolvehq
```

Then `/bootstrap`, `/new-adr`, `/ship-item`, … (skills also auto-trigger on
matching requests).

### pi coding agent

```
pi install npm:@evolvehq/docflow
```

(or, from source, `pi install git:github.com/EvolveHQ/docflow`.)
Invoke as `/skill:bootstrap`, `/skill:new-adr`, …

### Also: Claude Cowork, Codex, OpenCode

docflow runs from the same skill files on **Claude Cowork** (the Claude
Code plugin), **Codex** (`codex plugin marketplace add EvolveHQ/docflow`;
invoke `$bootstrap`), and **OpenCode** (reads `.claude`/`.agents`/
`.opencode` skills — auto-discovered; OpenCode-compatible forks like
Xiaomi's *mimocode* inherit this via the same path). See the
[full install matrix](https://github.com/EvolveHQ/docflow#install).

## Why

Documentation-led projects rot when conventions live in someone's head.
docflow makes them explicit, machine-readable, and applied uniformly — so a
fresh contributor (human or agent) can pick up the repo with no oral
handover. It works on fresh repos (scaffolds from zero) and existing ones
(retrofits, preserving and merging rather than overwriting).

## Links

- [Methodology — the formal definition]({{ '/methodology/' | relative_url }})
- [Source on GitHub](https://github.com/EvolveHQ/docflow)
- [README](https://github.com/EvolveHQ/docflow/blob/main/README.md)
- [Full usage & customisation guide (USAGE.md)](https://github.com/EvolveHQ/docflow/blob/main/USAGE.md)

---

MIT licensed · maintained by [EvolveHQ](https://github.com/EvolveHQ) · [Privacy Policy](privacy/)
