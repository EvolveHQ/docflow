# project-bootstrap

A Claude Code plugin that installs a `project-bootstrap` skill. The skill
scaffolds — or retrofits — a documentation-led convention set into any
repository, so the project can be driven by both humans and coding
agents from a small set of canonical files.

## What it installs

- `AGENTS.md` — hard rules for coding agents (the entry point).
- `CLAUDE.md` — one-liner re-exporting `AGENTS.md` so Claude Code picks
  it up automatically.
- `CONVENTIONS.md` — authoring rules for ADRs, naming, status
  lifecycle, audit trail, and git contract.
- `INDEX.md` — generated table of all ADRs.
- `adr/` — ADR catalogue with a capability-ADR template (and an
  optional technology-ADR template).
- `plan/todo/` and `plan/done/` — implementation queue. `git mv` from
  `todo/` to `done/` is the completion event.
- `_agent/` — multi-agent coordination: `ROLES.md`, `LOCKS.md`,
  `WORKLOG.md`, `CURRENT_FOCUS.md`, `HANDOFF.md`, and an optional
  unsupervised-run prompt under `prompts/`.

Optional, off by default: `GLOSSARY.md`, `domains/<slug>/README.md`
groupings, project-specific hard rules (vendor-naming restriction,
regulated-evidence posture, language mandate, audit-stream separation).

## Why

Documentation-led projects rot when conventions live in someone's head.
This plugin makes the conventions explicit, machine-readable, and
applied uniformly — so a fresh contributor (human or agent) can pick up
the repo with no oral handover.

It works equally well on **fresh repos** (scaffolds from zero) and on
**existing repos** (retrofits, preserving and merging existing files
rather than overwriting them).

## Install

### From this marketplace

```
/plugin marketplace add EvolveHQ/project-bootstrap-plugin
/plugin install project-bootstrap@evolvehq
```

### Local development (no install)

```
claude --plugin-dir <path-to-this-repo>
```

### Direct skill clone (no plugin lifecycle)

```
git clone https://github.com/EvolveHQ/project-bootstrap-plugin ~/.claude/skills/project-bootstrap-src
ln -s ~/.claude/skills/project-bootstrap-src/skills/project-bootstrap ~/.claude/skills/project-bootstrap
```

On Windows, copy `skills/project-bootstrap/` into
`%USERPROFILE%\.claude\skills\` instead of symlinking.

## Quick start

In any repo, run:

```
/project-bootstrap
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
/plugin install project-bootstrap@evolvehq
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
project-bootstrap-plugin/
  .claude-plugin/
    plugin.json          # plugin manifest
    marketplace.json     # marketplace listing (this repo is its own marketplace)
  skills/
    project-bootstrap/
      SKILL.md           # the skill body — assessment + output sequence
      templates/         # files the skill reads and writes into target repos
  README.md
  USAGE.md
```

## License

MIT. Use it, fork it, change it. If you improve a template, a PR is
welcome.
