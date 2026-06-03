# Conventions

## Project

Project name: docflow.

Language: en-GB throughout. Use forms such as organisation, behaviour,
prioritise, catalogue, authorisation, artefact, customisation
consistently across all files. This matches the existing `README.md`
and `USAGE.md`.

## ADR Files

ADR filenames use `NNNN-kebab-case-slug.md`, zero-padded to 4 digits,
with contiguous numbering and no reserved gaps.

Each ADR describes one decision. If a decision splits, supersede the
original ADR and create new ADRs rather than expanding scope inside a
single document.

Status lifecycle: `Proposed → Accepted → Implemented → (Superseded | Deprecated)`.

| Status | Meaning |
|---|---|
| Proposed | Draft. Decision authored but not yet approved. |
| Accepted | Decision approved; implementation authorised. Work item lives in `plan/todo/`. |
| Implemented | Code shipped per the completion event. Work item moved to `plan/done/`. ADR is the authoritative spec the running system matches. |
| Superseded | Replaced by another ADR. The successor is named in `superseded-by:` metadata. |
| Deprecated | Was real; the world moved on; no successor. Capability is not being rebuilt. |

Terminal states (Superseded / Deprecated) are reachable from any prior
state.

Cross-references link by relative path to `adr/NNNN-*.md`.

## ADR Shapes

This project uses a single ADR shape. ADRs use `adr/0000-template.md`
and contain these sections in order: Context, Capability statement,
User stories / scenarios, Acceptance criteria, Out of scope, Open
questions, References, Revision History, Approvals.

## Dual-Target Parity

docflow ships for two coding agents — Claude Code and the pi coding
agent — from the **same** skill files under `skills/`. Only the
manifests differ: `.claude-plugin/plugin.json` + `marketplace.json`
for Claude Code, `package.json` (`pi.skills`) for pi.

Any change to a skill, template, or the skill set must keep **both**
targets working. Skill prose stays agent-neutral; agent-specific
invocation forms (`/name` vs `/skill:name`) belong in `README.md`, not
in the skill bodies. A change that only makes sense on one agent is a
defect until the other agent is handled too.

## Version-Sync Invariant

The package version is declared in three manifests and they must always
agree:

- `package.json` → `version` (npm / pi)
- `.claude-plugin/plugin.json` → `version` (Claude Code / Cowork)
- `.codex-plugin/plugin.json` → `version` (Codex)

Bump them together in the same commit. The verify gate
(`node scripts/verify.mjs`) fails if any diverge. The git tag `vX.Y.Z`
and the published npm version must match this same number. Each
marketplace manifest (`.claude-plugin/marketplace.json`,
`.agents/plugins/marketplace.json`) must list the plugin by name.

## Skill Authoring

The product is the `skills/` tree. When adding or editing a skill:

- **Agent-neutral prose.** Skill bodies must not hard-code one agent's
  invocation syntax. Refer to other skills by name; put agent-specific
  forms (`/name` for Claude Code, `/skill:name` for pi) in `README.md`.
- **Disjoint auto-trigger descriptions.** On agents that auto-trigger
  skills from their `description`, the trigger boundaries must not
  overlap. The authoring skills explicitly delimit their scope
  (new-adr = a decision, new-plan = a unit of work, add-convention = a
  reusable rule) so the wrong skill does not fire. State what each skill
  is NOT for.
- **Only `bootstrap` carries `templates/`.** The lifecycle skills act on
  the copies the bootstrap wrote into the target repo; they ship no
  templates of their own.

## ADR Privacy

ADRs are internal artefacts. ADR numbers, ADR titles, and the
existence of the ADR catalogue must never appear in any string the
product emits to users: UI copy, API response bodies, error messages,
customer-visible log lines, public documentation, release notes,
marketing copy, or support communications.

For docflow specifically, the **user-visible surfaces are the
`skills/*/SKILL.md` bodies, `README.md`, `USAGE.md`, and the scaffold
templates** — these reach end users of the plugin. Keep this repo's own
ADR numbers out of them. The ADR catalogue describes how docflow itself
is built; it is not part of what docflow installs into a target repo.

Allowed references:
- Inline code comments / template comments tying a non-obvious choice
  to its ADR (`<!-- see adr/0003-foo.md -->`).
- Commit messages and PR descriptions.
- Internal documents: `AGENTS.md`, `INDEX.md`, the `plan/` queue,
  `_agent/` files.

Rule of thumb: if a non-builder could ever read the string, the ADR
reference comes out. Refer to the behaviour by its product-level name
instead.

## Multi-Agent Rules

A single agent owns this repo. The `_agent/` directory tracks live
state and history; no LOCKS discipline.

## Plan Folder

Pending and shipped work live in `plan/` at the repository root:

- `plan/todo/NNNN-<slug>.md` — pending work, lower numbers run first.
  Each file names the owning ADR(s), scope, and exit criteria.
- `plan/done/<YYYY-MM-DD>-<slug>.md` — shipped work, chronological. A
  `git mv` from `todo/` to `done/` is the completion event.

The completion event is: the change is fast-forwarded onto `main` and
the remote push succeeds (verify gate green locally first). No PRs, no
merge commits.

When a `plan/todo/` item ships, the file moves to `plan/done/` AND the
owning ADR(s)' `status:` advances from `Accepted` to `Implemented`.
`INDEX.md` is regenerated to match.

## Audit Trail Policy

Every substantive change to an Accepted ADR appends a new row to its
Revision History table.

Editorial changes — typos, formatting, link fixes — are excluded from
Revision History but must be flagged "editorial" in the commit message.

The Approvals table is populated when an ADR transitions to Accepted
and updated on every subsequent substantive revision.

## Git Contract

Commit messages follow Conventional Commits with a mandatory
`Rationale:` footer for any commit that touches an ADR.

- Signed commits: yes.
- ADR-revision tags `adr-NNNN-rN`: no.
- Co-Authored-By trailer on agent commits: no, from this convention set
  onward. (Commits predating the bootstrap that carry the trailer are
  left untouched — history is not rewritten.)

Integration model: direct-to-main, **fast-forward only**. Changes are
fast-forwarded onto `main`; no merge commits. The verify gate runs
locally and must pass before push. A change is "shipped" when it is on
`main` and pushed.
