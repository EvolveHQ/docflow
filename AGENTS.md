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
  `rollup`). This is what gets installed. One source for every target.
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
- `CONSTRAINTS.md` — the six inviolable boundaries (CON-1..6).
- `docflow.yml` — capability manifest: contract schema, record model,
  enabled layers, evidence adoption commit.
- `GOALS.md` — the repo's active goals (id, statement, measure,
  horizon, review-by); AC-bearing records name the goals they advance
  in `serves:` front matter.
- `COVERAGE.md` — generated goal → record → evidence → plan walk
  (`scripts/coverage.mjs`); derived, never hand-edited.
- `evidence/<record-slug>/AC<n>-<seq>.md` — bound verification
  evidence, written at ship (`CONVENTIONS.md` §Verification Evidence).
- `plan/todo/NNNN-<slug>.md` — pending work, lower numbers run first.
- `plan/done/<YYYY-MM-DD>-<slug>.md` — shipped work, chronological.
- `_agent/` — coordination: `ROLES.md`, `WORKLOG.md`,
  `CURRENT_FOCUS.md`, `HANDOFF.md`, `prompts/`.
- `scripts/verify.mjs` — the static verify gate (manifests + version
  sync, skill structure + parity, ADR catalogue + INDEX sync,
  ADR-privacy leak scan).
- `evals/` — behavioural eval harness: deterministic assertions plus
  subagent-driven end-to-end skill runs (release gate, not per-push).

## Hard rules when editing ADRs

These come from `CONVENTIONS.md` and override default behaviour:

- **Load `CONSTRAINTS.md` before any task.** The six boundaries bind
  every action in this repo; read them first, every session.
- **One decision per ADR.** Splits become new ADRs that supersede;
  never expand scope inside an existing one.
- **Status lifecycle:** `Proposed → Accepted → Implemented →
  (Superseded | Deprecated)`, with `Proposed → Withdrawn` for a
  rejected proposal. Supersession fires on the successor's
  **Acceptance**, never its proposal.
- **Capability ADR section order:** metadata → Context → Capability
  statement → User stories / scenarios → Acceptance criteria → Out of
  scope → Open questions → References → Revision History → Approvals.
- **Acceptance criteria are testable, numbered, and — on ADRs created
  or edited after evidence adoption — carry a `Verify:` method**
  (inline command | `gate-check` | `manual`; see `CONVENTIONS.md`
  §Verification Evidence).
- **Never alter `CONSTRAINTS.md` without a human-accepted ADR.** Every
  constraint transition — creation, scope revision, removal — is
  decision-gated (`CONVENTIONS.md` §Constraints). Proposing is fine;
  writing is gated.
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

A single agent owns this repo. The `_agent/` directory tracks live
state and history; LOCKS discipline is not in use.

## Plan folder

- A pending item gets a `plan/todo/NNNN-<slug>.md` file BEFORE work
  starts, naming the owning ADR(s), scope, and exit criteria.
- The completion event is: the change is fast-forwarded onto `main` and
  the remote push succeeds. On completion, `git mv` the file to
  `plan/done/<YYYY-MM-DD>-<slug>.md` with a footer naming the HEAD SHA
  (and any release tag / npm version).
- The owning ADR(s) advance `Accepted → Implemented` on the same
  commit. Regenerate `INDEX.md`.
- An abandoned item is never deleted: `git mv` to
  `plan/dropped/<YYYY-MM-DD>-NNNN-<slug>.md` (number kept) with a
  `Dropped` footer naming the reason.

## Git contract

- Commit messages follow **Conventional Commits**.
- Mandatory `Rationale:` footer on any commit touching an ADR.
- Signed commits: yes.
- ADR-revision tags `adr-NNNN-rN`: no.
- Co-Authored-By trailer: no.
- Cross-references between ADRs use relative paths (`adr/NNNN-*.md`).
- **Integration:** direct-to-main, **fast-forward only**. No merge
  commits on `main`. The verify gate (`node scripts/verify.mjs`) runs
  locally and must pass before push. Completion event: fast-forwarded
  to `main` + remote push succeeded.
