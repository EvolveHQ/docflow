# Using project-bootstrap

This document explains how the skill behaves end-to-end, what each of
the 10 assessment questions actually changes in the output, and how to
customise or extend the templates.

For installation, see the [README](README.md).

## 1. Triggering the skill

Once the plugin is installed (or `--plugin-dir`'d) into a Claude Code
session, the skill is available in any repo. Three ways to trigger:

1. **Slash command:** `/project-bootstrap`.
2. **Natural language** matching the skill's description, e.g.
   - "set up documentation-led conventions in this repo"
   - "bootstrap ADRs and a plan queue"
   - "scaffold AGENTS.md and the _agent/ layout"
   - "retrofit this existing repo with the documentation conventions"
3. **From another agent's prompt** — name the skill explicitly:
   *"invoke the `project-bootstrap` skill on this repository."*

## 2. The flow

The skill runs in three phases.

### Phase A — Detect

The skill inspects the repo and states in one line whether it is:

- **Fresh** — no source, no docs. It will scaffold from zero.
- **Existing** — it reads any current `README.md`, `CONTRIBUTING.md`,
  `AGENTS.md`, `CLAUDE.md`, `docs/`, `adr/`, `.github/` first.
  Existing content is preserved; merges, not overwrites.

If existing ADRs use a different format, the skill proposes a
migration plan (renumber, keep, translate) instead of creating a
parallel tree.

### Phase B — Assess

The skill asks all 10 assessment questions in one batch, waits for
answers, then summarises the resulting plan in 5–10 lines and asks for
sign-off. **It does not write files before sign-off.**

### Phase C — Write

After sign-off, the skill writes files in dependency order
(`CONVENTIONS.md` first, then `AGENTS.md` + `CLAUDE.md`, then ADR
templates, then `plan/`, then `_agent/`, then `INDEX.md` stub,
optionally `_agent/prompts/autonomous.md`). For existing repos it
prefers `Edit` over `Write` where files already exist, and calls out
every merge decision in the commit message.

## 3. The 10 assessment questions

Each question's answer changes specific files. Knowing this up front
helps you give precise answers.

| # | Question | What it changes |
|---|----------|-----------------|
| 1 | **Project identity** — name, one-liner, doc language, existing files to preserve. | Header of `AGENTS.md`, `CONVENTIONS.md`, `README.md`; language mandate (if any) added to `CONVENTIONS.md` §Project. |
| 2 | **ADR shape** — single vs. capability-vs-technology split. | Whether `adr/NNNN-template.md` (technology) is created in addition to `adr/0000-template.md`. Section-order rules in `CONVENTIONS.md` §ADR Shapes and `AGENTS.md` §Hard rules. |
| 3 | **Status lifecycle** — full or shorter. | Status table in `CONVENTIONS.md` §ADR Files and `plan/README.md` §Status semantics. Whether the `Implemented` rung exists at all. |
| 4 | **Plan folder** — use it or skip; if used, what is the "shipped" event. | Whether `plan/` is created at all. The completion-event sentence in `CONVENTIONS.md` §Plan Folder, `plan/README.md`, and `AGENTS.md` §Plan folder. |
| 5 | **Multi-agent setup** — single or many; LOCKS discipline yes/no. | `_agent/ROLES.md` content (single `default-agent` row vs. multiple). `AGENTS.md` §Multi-agent workflow. `_agent/LOCKS.md` may be skipped entirely for a single agent. |
| 6 | **Git contract** — Conventional Commits, `Rationale:` footer, signed commits, ADR-revision tags, `Co-Authored-By` trailer. | `AGENTS.md` §Git contract and `CONVENTIONS.md` §Git Contract bullets. Default is no `Co-Authored-By` trailer unless you ask. |
| 7 | **Optional artefacts** — `GLOSSARY.md`, `domains/`, technology-ADR template. | Whether those files / directories are created. Defaults: defer all three. |
| 8 | **Verify gate** — what command(s) decide a change is shippable. | Whether `_agent/prompts/autonomous.md` is written. The skill **refuses** to write the autonomous prompt without a real verify gate, because unsupervised runs without one ship broken work. The Step 4 line of the prompt is filled with your command. |
| 9 | **Existing-content conflicts** (existing repos only) — current commit format, branch policy, ADR style, status names the new layout must respect. | Merge behaviour during writes; commit-message notes calling out each compromise. |
| 10 | **Domain-specific hard rules** to enforce from day one — e.g. vendor-naming restriction, regulated-evidence posture (attribution, retention, e-signatures), language mandate, mandatory user-story personas, separated audit streams. | Additional sections in `CONVENTIONS.md` and additional bullets in `AGENTS.md` §Hard rules. |

## 4. Output files

After sign-off, the skill writes:

| File | Source template | Notes |
|------|-----------------|-------|
| `CONVENTIONS.md` | `templates/CONVENTIONS.md` | Spec the other files reference. Written first. |
| `AGENTS.md` | `templates/AGENTS.md` | Hard rules entry point. |
| `CLAUDE.md` | `templates/CLAUDE.md` | Single line `@AGENTS.md`. |
| `adr/0000-template.md` | `templates/adr-capability.md` | Capability-ADR template. |
| `adr/NNNN-template.md` | `templates/adr-technology.md` | Technology-ADR template. Only if Q2 said split. `NNNN` is the project-defined cutoff (default 0100). |
| `plan/README.md` | `templates/plan-README.md` | Plus empty `plan/todo/.gitkeep` and `plan/done/.gitkeep`. |
| `_agent/ROLES.md` | `templates/_agent-ROLES.md` | Single `default-agent` by default. |
| `_agent/LOCKS.md` | `templates/_agent-LOCKS.md` | Empty header. Created only if Q5 enabled LOCKS discipline. |
| `_agent/WORKLOG.md` | `templates/_agent-WORKLOG.md` | Empty table header. |
| `_agent/CURRENT_FOCUS.md` | `templates/_agent-CURRENT_FOCUS.md` | Live snapshot, initial state "none". |
| `_agent/HANDOFF.md` | `templates/_agent-HANDOFF.md` | Fresh-agent entry point. |
| `INDEX.md` | (none — generated) | Stub header + empty table. |
| `_agent/prompts/autonomous.md` | `templates/_agent-prompts-autonomous.md` | Only if Q8 confirmed a verify gate. |

## 5. After scaffolding

The repo is now ready for ADR-driven work. Typical first steps:

1. **Author the first ADR.** Copy `adr/0000-template.md` to
   `adr/0001-<slug>.md`. Fill in Context, Capability statement, User
   stories, Acceptance criteria. Set status to `Proposed`.
2. **Get it Accepted.** Update Approvals table, change status to
   `Accepted`, regenerate `INDEX.md`.
3. **Queue the work.** Create `plan/todo/0001-<slug>.md` naming the
   owning ADR, scope, exit criteria. Lower-numbered files run first.
4. **Implement.** Code against the ADR's numbered acceptance criteria.
   Add tests that map back to those criteria.
5. **Ship.** When the project's completion event fires (per Q4):
   `git mv plan/todo/0001-<slug>.md plan/done/<YYYY-MM-DD>-<slug>.md`,
   amend the file with a "Shipped at HEAD `<sha>`" footer, advance the
   ADR's `status:` from `Accepted` to `Implemented`, regenerate
   `INDEX.md`, append a row to `_agent/WORKLOG.md`.

## 6. Customising or extending

The templates are deliberately small and self-contained. To customise:

- **Edit a template.** Files in `skills/project-bootstrap/templates/`
  are read verbatim by the skill, then placeholders are filled from
  the assessment answers. Change the template, the next bootstrap
  reflects it.
- **Add a new template.** Put it in `templates/` and reference it from
  `SKILL.md` §Step 5 (Output sequence).
- **Tighten the skill's auto-trigger.** Edit the `description:`
  frontmatter in `SKILL.md`. Skills match user requests against this
  string — be specific about phrasings, be terse about scope.
- **Fork the plugin.** This repo is small enough to fork and host
  internally if you want a private convention set.

## 7. Re-running

The skill is idempotent in spirit, but be careful: re-running on a
repo that already has scaffolded files will trigger the "existing
repo" path and ask Q9 about conflicts. Use it intentionally — to add
the parts you skipped the first time, not to wipe and rebuild.

## 8. Troubleshooting

- **Skill not appearing in the available-skills list.** Confirm the
  plugin is installed (`/plugin list`) or `--plugin-dir` was passed.
  Restart the Claude Code session.
- **Slash command not found.** The slash form is `/project-bootstrap`
  exactly (hyphenated, lowercase).
- **Skill asks questions the project already answered.** That's by
  design — the skill does not persist state between invocations.
  Answer briefly; the second run is faster.
- **Existing repo merge looks wrong.** Stop and surface it. The skill
  is instructed to preserve existing content; if it overwrote
  something, that's a bug — file an issue with the merge diff.
