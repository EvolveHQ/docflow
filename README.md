# docflow

![docflow — ADR-driven documentation workflow](docs/preview.png)

A plugin for **ADR-driven, documentation-led projects**, working on
**Claude Code, Claude Cowork, pi, Codex, and OpenCode** from the same
skill files (see [Install](#install)).
It installs a `bootstrap` skill that scaffolds (or retrofits) an
**Architecture Decision Record (ADR)** catalogue, a plan queue, and
`AGENTS.md` conventions into any repository, plus a set of **lifecycle
skills** that author, queue, ship, and audit ADRs — so the project can
be driven by both humans and coding agents from a small set of canonical
files. For the formal definition of the conventions — why they help and
where they fall short — see the
[methodology](https://evolvehq.github.io/docflow/methodology/).

## Skills

Slash commands below are the **Claude Code** form. On the **pi** coding
agent the same skills are invoked as `/skill:<name>` (e.g.
`/skill:bootstrap`, `/skill:new-adr`). See [Install](#install).

| Skill | Slash command | Purpose |
|-------|---------------|---------|
| bootstrap | `/bootstrap` | Scaffold or retrofit the whole convention set. Start here. |
| new-adr | `/new-adr` | Author one ADR — next contiguous number, right shape, INDEX + domain wiring, supersede linkage. |
| new-plan | `/new-plan` | Add a `plan/todo` item tracing to its owning ADR(s). |
| ship-item | `/ship-item` | Run the completion event: verify → integrate → `todo`→`done` → ADR `Accepted`→`Implemented` → INDEX/WORKLOG. |
| add-convention | `/add-convention` | Assess whether a convention is worth codifying, route it to the right home (or to an ADR), then add it. Use it to enable optional practices (e.g. TDD) on demand — see [USAGE §5a](USAGE.md). |
| audit | `/audit` | Lint the repo against its own conventions — numbering, INDEX sync, plan coverage, **ADR-privacy leaks**, more. |
| brainstorm | `/brainstorm` | Decompose a problem into candidate ADRs + plan items (proposes drafts; writes nothing until approved). |
| agent-wave | `/agent-wave` | Orchestrate a wave of parallel worktree subagents over the queue, with checkpoint or continuous supervision. |
| rollup | `/rollup` | For a multi-repo product: aggregate every member repo's ADRs into one derived, product-wide roll-up (run from the home repo). |

The lifecycle skills all **read `CONVENTIONS.md` first** and honour the
choices the bootstrap recorded (ADR shape, status lifecycle, integration
model, multi-agent mode). They refuse to run on an un-bootstrapped repo
and point you at `/bootstrap`.

## What `/bootstrap` installs

Only the **core** is always written; everything else is an **opt-in layer**
chosen during the assessment, so a minimal repo stays as light as a classic
ADR catalogue.

**Core (always):**
- `AGENTS.md` — hard rules for coding agents (the entry point).
- `CLAUDE.md` — one-liner re-exporting `AGENTS.md` so Claude Code picks it
  up automatically.
- `CONVENTIONS.md` — authoring rules for ADRs, naming, status lifecycle,
  audit trail, and git contract.
- `INDEX.md` — generated table of all ADRs.
- `adr/0000-template.md` — the ADR template; the catalogue starts here.

**Optional layers (opt-in):**
- `plan/todo/` + `plan/done/` — the implementation queue (Q4a). `git mv`
  from `todo/` to `done/` is the completion event.
- `_agent/` — coordination (`ROLES`, `LOCKS`, `WORKLOG`, `CURRENT_FOCUS`,
  `HANDOFF`, optional `prompts/`). **Q5 — choose *None* to omit it.**
- `domains/<slug>/README.md` — **grouping**: per-area indexes (e.g.
  `domains/auth/`) over the flat catalogue, for navigating a large catalogue
  by area. Organisational only — ADRs keep their number; `new-adr` files
  each under its domain. Enable it when the project has distinct areas (Q7).
- `GLOSSARY.md`, the technology-ADR template, and project-specific hard
  rules (vendor-naming, regulated evidence, language mandate, audit-stream
  separation) — Q7/Q10.

Omitting any optional layer leaves a valid repo; a lifecycle skill that
needs an absent layer refuses cleanly and says what's missing.

**Enable a deferred layer later:** re-run **bootstrap** on the repo — it
detects your existing setup, skips the settled questions, and offers only
the optional layers you don't have yet, adding the chosen ones by merge.
(Two shortcuts: `add-convention` creates `GLOSSARY.md` on your first shared
term, and `new-adr` offers to create a `domains/<slug>/` grouping when you
file an ADR under a new domain.)

**Placement:** `AGENTS.md` and `CLAUDE.md` always stay at the repository
root; everything else lives under a configurable **artefact root** —
`.docflow/` (the default), `docs/`, or the repo root — chosen at bootstrap
and recorded in `CONVENTIONS.md`.

**Seed ADR:** by default, bootstrap also writes **`adr/0001`** — a first
ADR recording the decision to adopt this method (self-documenting, like the
classic "use ADRs" convention). It references `CONVENTIONS.md` for the rules
and is created `Implemented`. Decline it at sign-off if you want only the
template.

## Why

Documentation-led projects rot when conventions live in someone's head.
This plugin makes the conventions explicit, machine-readable, and
applied uniformly — so a fresh contributor (human or agent) can pick up
the repo with no oral handover.

It works equally well on **fresh repos** (scaffolds from zero) and on
**existing repos** (retrofits, preserving and merging existing files
rather than overwriting them).

## Multi-repo products

A single product spread across several repositories can run as a
**federation**. At bootstrap a repo declares whether it is standalone or
part of a multi-repo product, and whether it is **establishing** a new
federation or **joining** one — a joining repo only ever writes its own
back-pointer, never into another repo. You pick a **topology** (central
decisions repo · distributed · home-repo-plus-local), and the convention
set keeps numbering contiguous **per repo** while a federation-wide
identity is the cross-repo key. The `rollup` skill aggregates every
member's catalogue into one product-wide view, and `audit` gains
cross-repo checks (membership, identity collisions, dangling references,
roll-up drift, convention drift). Work and status cross repos the same way:
a cross-repo decision is one plan item per affected repo, and its aggregate
status ("2 of 3 repos") surfaces in the roll-up. No tool writes across a
repo boundary; consistency is declared at the edges and enforced by audit. See the
[methodology](https://evolvehq.github.io/docflow/methodology/#5-scaling-to-many-repositories)
for the full model.

## No drafts in the catalogue

docflow records **outcomes, not work-in-progress**. There is **no `Draft`
status** and **no `brainstorming/` folder** — an ADR's first persisted
status is `Proposed`, created only once a decision is approved. The
`brainstorm` skill explores candidates **in conversation and writes
nothing** until you approve them; only then does `new-adr` mint a numbered
ADR. This keeps the catalogue free of half-formed drafts and the numbering
clean — numbers go only to real decisions — following the lightweight-ADR
tradition that an ADR captures the agreed decision, not the discussion that
produced it.

## Install

docflow ships from **one skill source** (`plugins/docflow/skills/`) to
five coding agents — only the packaging differs. Two surfaces: the scaffolded **output**
(`AGENTS.md`, the ADR catalogue, `plan/`, `_agent/`) is plain Markdown
read natively by any agent that loads `AGENTS.md`; the **skills** are
`SKILL.md` files the host discovers.

| Agent | Output | Skills | Install | Invoke |
|-------|:------:|:------:|---------|--------|
| Claude Code | native | ✅ | marketplace (below) | `/bootstrap` |
| Claude Cowork | native | ✅ | same Claude Code plugin | `/bootstrap` |
| pi | native | ✅ | `pi install npm:@evolvehq/docflow` | `/skill:bootstrap` |
| Codex | native | ✅ | `codex plugin marketplace add EvolveHQ/docflow` | `$bootstrap` / `/skills` |
| OpenCode | native | ✅ | auto-discovered, or symlink into `~/.config/opencode/skills` | auto, by description |

Handy: OpenCode also reads `~/.claude/skills/` and `~/.agents/skills/`, so
a shared skills directory can serve it alongside another agent.

### Claude Code — from this marketplace

```
/plugin marketplace add EvolveHQ/docflow
/plugin install docflow@evolvehq
```

Invoke with `/bootstrap`, `/new-adr`, `/ship-item`, … (auto-triggers on
matching requests too).

### Claude Cowork

Cowork uses the **same plugin system** as Claude Code, so install the
docflow plugin exactly as above (`/plugin marketplace add
EvolveHQ/docflow`, then install) — or from Anthropic's community
marketplace once listed. No separate packaging.

### pi coding agent

```
pi install git:github.com/EvolveHQ/docflow
```

or, once published to npm, `pi install npm:@evolvehq/docflow`. Pi
auto-discovers the skills via the `pi.skills` key in
`package.json`. Invoke with `/skill:bootstrap`, `/skill:new-adr`,
`/skill:ship-item`, … Pi does **not** auto-trigger skills from their
descriptions the way Claude Code does — invoke them explicitly (the
agent will also load a skill on-demand when a task clearly matches).

The scaffolded output (`AGENTS.md`, `CONVENTIONS.md`, the ADR catalogue,
`plan/`, `_agent/`) is plain Markdown and is read natively by pi's
hierarchical `AGENTS.md` loading — no porting needed.

### Codex (OpenAI)

docflow ships a Codex plugin (`.codex-plugin/`), so it's a one-command
install from this repo's marketplace:

```
codex plugin marketplace add EvolveHQ/docflow
codex plugin add docflow@evolvehq
```

Codex reads the scaffolded `AGENTS.md` natively. Invoke with `$bootstrap`
/ `/skills`, or just describe the task (Codex auto-triggers from the skill
description); the assessment questions fall back to plain `A/B/C` text
where there is no select tool. Update later with `codex plugin
marketplace upgrade`.

### OpenCode (sst)

OpenCode auto-discovers skills from `.claude/skills`, `.agents/skills`,
and `.opencode/skills` (project and global) — so **if you already run
docflow on Claude Code or Codex via a shared skills directory, OpenCode
picks it up with no extra step.** Standalone, symlink the skills into
OpenCode's global directory (one command, stays in sync with the clone):

```
git clone https://github.com/EvolveHQ/docflow ~/.docflow-src
ln -s ~/.docflow-src/plugins/docflow/skills/* ~/.config/opencode/skills/
```

OpenCode has no marketplace command for `SKILL.md` skills (its plugin
system is for npm JS plugins), so a shared skills directory is the clean
path. Skills auto-load by description.

**OpenCode-compatible forks** — e.g. Xiaomi's *mimocode* — inherit this
support via the same skill-discovery path; no separate packaging.

### Claude Code — local development (no install)

```
claude --plugin-dir <path-to-this-repo>
```

### Direct skill clone (no plugin lifecycle)

```
git clone https://github.com/EvolveHQ/docflow ~/.docflow-src
ln -s ~/.docflow-src/plugins/docflow/skills/* ~/.claude/skills/
```

On Windows, copy `plugins\docflow\skills\*` into
`%USERPROFILE%\.claude\skills\` instead of symlinking.

## Quick start

In any repo, run:

```
/bootstrap
```

or just say *"set up documentation-led conventions in this repo"*,
*"bootstrap ADRs and a plan queue"*, or *"scaffold AGENTS.md and the
_agent/ layout"*. The skill auto-triggers on those phrasings.

The skill will:

1. Detect whether the repo is fresh or existing, and state which.
2. Ask 10 assessment questions to tune the conventions to the project
   — one at a time, with a recommended option for each.
3. Summarise the resulting plan and ask for sign-off.
4. Write (or Edit, for existing repos) the files.
5. Commit each logical group with a Conventional Commit message.
6. **On existing repos**, offer to backfill ADRs, `plan/done/`, and
   `CONVENTIONS.md` additions from the existing code and git history
   — drafts only, approved in batches before anything commits.

## Updating

Recipients refresh installations with:

```
/plugin marketplace update evolvehq
/plugin install docflow@evolvehq
```

See [USAGE.md §Updating the plugin](USAGE.md#8-updating-the-plugin)
for the author-side flow (version bumps, release tags) and recipient
options including `/reload-plugins` for live sessions.

## Full usage and customisation guide

See [USAGE.md](USAGE.md) for the assessment questions, what each
answer changes, the file-by-file output, the backfill flow, and how
to extend or override the templates.

## Layout

```
docflow/
  .claude-plugin/marketplace.json   # Claude Code / Cowork marketplace (-> ./plugins/docflow)
  .agents/plugins/marketplace.json  # Codex marketplace (-> ./plugins/docflow)
  package.json                      # pi manifest (pi.skills -> ./plugins/docflow/skills) + npm
  plugins/docflow/                  # the plugin — one source, every target
    .claude-plugin/plugin.json      #   Claude Code / Cowork plugin manifest
    .codex-plugin/plugin.json       #   Codex plugin manifest (skills -> ./skills)
    skills/                         #   the one skill source
      bootstrap/
        SKILL.md                    #   bootstrap: assessment + output sequence + backfill
        templates/                  #   files the bootstrap reads and writes into target repos
      new-adr/SKILL.md              #   lifecycle skills — operate on a bootstrapped repo,
      new-plan/SKILL.md             #     read CONVENTIONS.md, honour its choices
      ship-item/SKILL.md
      add-convention/SKILL.md
      audit/SKILL.md
      brainstorm/SKILL.md
      agent-wave/SKILL.md
      rollup/SKILL.md
  README.md
  USAGE.md
```

Only the `bootstrap` skill uses `plugins/docflow/skills/bootstrap/templates/`. The
lifecycle skills act on the copies the bootstrap wrote into the target
repo (e.g. its `adr/0000-template.md`), so they carry no templates of
their own.

## License

MIT. Use it, fork it, change it. If you improve a template, a PR is
welcome.
