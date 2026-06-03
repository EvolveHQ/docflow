# AGENTS.md

This file provides guidance to coding agents working in this repository.

## What this repository is

docflow is a dual-target plugin that scaffolds (and retrofits)
ADR-driven, documentation-led conventions into other repositories, plus
a set of lifecycle skills to author, queue, ship, and audit ADRs. It
ships the **same** `skills/` directory to two coding agents — Claude
Code (via `.claude-plugin/`) and the pi coding agent (via
`package.json`). This repo now also **dogfoods its own conventions**:
the ADR catalogue, plan queue, and `_agent/` coordination below describe
how docflow itself is built and maintained.

## Repository structure

- `skills/` — the product. `bootstrap/` (with `templates/`) plus the
  lifecycle skills (`new-adr`, `new-plan`, `ship-item`, `add-convention`,
  `audit`, `brainstorm`, `agent-wave`). This is what gets installed.
- `.claude-plugin/` — Claude Code manifests (`plugin.json`,
  `marketplace.json`).
- `package.json` — pi manifest (`pi.skills → ./skills`) + npm metadata.
- `README.md`, `USAGE.md`, `docs/` — user-facing documentation.
- `adr/0000-template.md` — canonical ADR template.
- `adr/NNNN-<kebab-slug>.md` — one ADR per decision, contiguous
  numbering, no gaps. These describe **docflow itself**.
- `INDEX.md` — table regenerated from every ADR's metadata block.
- `CONVENTIONS.md` — authoring rules (read before editing anything).
- `plan/todo/NNNN-<slug>.md` — pending work, lower numbers run first.
- `plan/done/<YYYY-MM-DD>-<slug>.md` — shipped work, chronological.
- `_agent/` — coordination: `ROLES.md`, `WORKLOG.md`,
  `CURRENT_FOCUS.md`, `HANDOFF.md`, `prompts/`.
- `scripts/verify.mjs` — the verify gate (manifest + version check).

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
  the `skills/*/SKILL.md` bodies, the scaffold `templates/`, `README.md`,
  `USAGE.md`, and `docs/`. References ARE allowed in: code/template
  comments (`<!-- see adr/0003-foo.md -->`), commit messages, PR
  descriptions, internal docs, `AGENTS.md`, `CONVENTIONS.md`, `INDEX.md`,
  and the `plan/` queue. If a non-builder could ever see the string, the
  ADR reference comes out.

## Domain-specific hard rules

- **Dual-target parity.** Any change to a skill, template, or the skill
  set must keep BOTH targets working: Claude Code (`.claude-plugin/`)
  and pi (`package.json`). Skill prose stays agent-neutral; put
  agent-specific invocation forms (`/name` vs `/skill:name`) in
  `README.md`, not in skill bodies.
- **Version-sync invariant.** The `version` in `package.json`,
  `.claude-plugin/plugin.json`, and `.codex-plugin/plugin.json` must
  always match. Bump them together in the same commit. The git tag
  `vX.Y.Z` and the published npm version track the same number.
  `scripts/verify.mjs` enforces this.

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
