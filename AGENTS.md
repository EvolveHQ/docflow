# AGENTS.md

This file provides guidance to coding agents working in this repository.

## What this repository is

docflow is a multi-target plugin that scaffolds (and retrofits)
ADR-driven, documentation-led conventions into other repositories, plus
a set of lifecycle skills to author, queue, ship, and audit ADRs. It
ships the **same** `plugins/docflow/skills/` directory to five coding
agents — Claude Code, Claude Cowork, pi, Codex, and OpenCode — from one
source (see ADR 0015). This repo now also **dogfoods its own
conventions**: the ADR catalogue, plan queue, and `_agent/` coordination
below describe how docflow itself is built and maintained.

## Repository structure

- `plugins/docflow/skills/` — **the product**. `bootstrap/` (with
  `templates/`) plus the lifecycle skills (`new-adr`, `new-plan`,
  `ship-item`, `add-convention`, `audit`, `brainstorm`, `agent-wave`,
  `rollup`). Declarative `agents/openai.yaml` sidecars provide optional
  host interface metadata; SKILL.md remains sufficient on every target.
  This is what gets installed. One source for every target.
- `plugins/docflow/.claude-plugin/plugin.json` — Claude Code / Cowork
  plugin manifest; `plugins/docflow/.codex-plugin/plugin.json` — Codex.
- `.claude-plugin/marketplace.json` + `.agents/plugins/marketplace.json`
  — the marketplaces (root), each pointing at `./plugins/docflow`.
- `package.json` — pi manifest (`pi.skills → ./plugins/docflow/skills`)
  + npm metadata.
- `README.md`, `USAGE.md`, `docs/` — user-facing documentation.
- `adr/0000-template.md` — canonical ADR template.
- `adr/NNNN-<kebab-slug>.md` — one ADR per decision, contiguous
  numbering, no gaps. These describe **docflow itself**. (The optional
  `domains/` grouping layer the product offers is not enabled in this
  repo.)
- `INDEX.md` — table regenerated from every ADR's metadata block.
- `CONVENTIONS.md` — authoring rules (read before editing anything).
- `plan/todo/NNNN-<slug>.md` — pending work, lower numbers run first.
- `plan/done/<YYYY-MM-DD>-<slug>.md` — shipped work, chronological.
- `_agent/prompts/autonomous.md` — the single-writer run contract.
  Live ownership, blockers and stop reasons belong to each queued item.
- `scripts/verify.mjs` — the static verify gate (manifests + version
  sync, skill structure + parity, ADR catalogue + INDEX sync,
  ADR-privacy leak scan).
- `evals/` — behavioural eval harness: deterministic assertions plus
  subagent-driven end-to-end skill runs (release gate, not per-push).

## Hard rules when editing ADRs

These come from `CONVENTIONS.md` and override default behaviour:

- **One decision per ADR.** Splits become new ADRs that supersede;
  never expand scope inside an existing one.
- **Status lifecycle:** `Proposed → Accepted → Implemented → (Superseded | Deprecated)`.
- **Capability ADR section order:** metadata → Context → Capability
  statement → User stories / scenarios → Acceptance criteria → Out of
  scope → Open questions → References → Revision History → Approvals.
- **Acceptance criteria are testable and numbered.**
- **ADRs are internal artefacts — never user-visible.** ADR numbers,
  ADR titles, and the existence of the ADR catalogue must NEVER appear
  in any user-visible surface. For docflow the user-visible surfaces are
  the `plugins/docflow/skills/*/SKILL.md` bodies, the scaffold `templates/`, `README.md`,
  `USAGE.md`, and `docs/`. References ARE allowed in: code/template
  comments (`<!-- see adr/0003-foo.md -->`), commit messages, PR
  descriptions, internal docs, `AGENTS.md`, `CONVENTIONS.md`, `INDEX.md`,
  and the `plan/` queue. If a non-builder could ever see the string, the
  ADR reference comes out.

## Domain-specific hard rules

- **Multi-target parity.** Any change to a skill, template, or the
  skill set must keep ALL five targets working: Claude Code / Cowork
  (`.claude-plugin/`), pi (`package.json`), Codex (`.codex-plugin/` +
  `.agents/`), and OpenCode (skill auto-discovery, no manifest). Skill
  prose stays agent-neutral; put agent-specific invocation forms
  (`/name` vs `/skill:name` vs `$name`) in `README.md`, not in skill
  bodies.
- **Version-sync invariant.** The `version` in `package.json`,
  `.claude-plugin/plugin.json`, and `.codex-plugin/plugin.json` must
  always match. Bump them together in the same commit. The git tag
  `vX.Y.Z` and the published npm version track the same number.
  `scripts/verify.mjs` enforces this.
- **Gate integrity.** Never change gate behaviour (`scripts/verify.mjs`,
  `evals/`) and the files the gate judges in the same commit.
  Exceptions, named in the commit message: a new/stricter check may
  ship with the repairs it surfaces; comment-only gate edits may ride
  along. Weakening a check always ships alone, with the reason stated.

## Implementation work

- Start from the ADRs. Identify which ADRs a code change implements or
  affects before changing behaviour.
- If implementation reveals a capability gap or changed decision, update
  the relevant ADR rather than silently diverging.
- **Do not leak ADR identifiers into user-visible surfaces** — skill
  bodies, templates, README/USAGE, docs. The ADR link belongs in the
  commit message and (optionally) an internal comment.

## Audit trail and revision discipline

- Substantive ADR changes append a row to the Revision History table.
  Editorial changes (typos, formatting, link fixes) are excluded but
  flagged `editorial` in the commit message.
- Approvals table populates when an ADR is Accepted and updates on each
  later substantive revision.
- Regenerate `INDEX.md` from ADR metadata after any ADR status change
  or new ADR.

## Multi-agent workflow

A single writer owns this repo; no claim branch or lock ledger is required.
Use the operator-named PR branch, otherwise `work/<item-key>`. Keep item
status on that branch. Parallel implementation requires a separate decision.

## Picking up this repo

1. Read CONVENTIONS.md and the owning ADRs.
2. Inspect `git status`, the current branch and fetched `origin/main`.
3. Inspect open PRs, the plan queue and each item's Status; a ready PR can
   carry the completion move on its branch while it remains unmerged.
4. Resume only an explicitly named live/stopped item; otherwise select the
   first eligible item. Read `_agent/prompts/autonomous.md` before running it.

## Plan folder

Write a pending item before implementation, naming its owning decisions,
scope and testable exit criteria. Each todo carries `## Status` with
Claimed by, Blockers and Stopped. Remove it at completion.

Prepare the atomic completion move, owning ADR status and regenerated INDEX
on the PR branch, with a footer naming the verified work HEAD and PR URL.
It becomes shipped only when the PR is merged into main with required checks
green. A ready, unmerged PR is still live; never report it as shipped.
Keep items with unverified exit criteria in todo and their ADRs Accepted.

## Reporting

Final skill results and persisted reports end with **Status at a glance**:
**This run**, **Overall**, **Yet to do**. Follow CONVENTIONS.md §Reporting;
routine progress does not need the block.

## Git contract

- Commit messages follow **Conventional Commits**.
- Mandatory `Rationale:` footer on any commit touching an ADR.
- Signed commits: yes.
- ADR-revision tags `adr-NNNN-rN`: no.
- Co-Authored-By trailer: no.
- Cross-references between ADRs use relative paths (`adr/NNNN-*.md`).
- **Integration:** PR-based integration into `main`, using standard merge commits. Run
`node scripts/verify.mjs` and `node evals/run.mjs` locally before pushing;
the required `verify` CI check must pass on the current PR head. Constituent
commits are signed. Updating a PR does not authorise merging or releasing it.
