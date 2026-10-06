# Conventions

## Project

Project name: synthetic-producer.

Artefact root: `.` — `adr/`, `plan/`, `INDEX.md`, `_agent/`, and
this file live under this root; `AGENTS.md` and `CLAUDE.md` always stay at
the repository root. Every lifecycle skill resolves paths against this root.

Discovery: a `.docflow/` **directory** at the repository root is itself the
artefact root; any other root is named by a one-line `.docflow` **file** at
the repository root (`root: <path>`). Tools resolve the root in that order,
falling back to probing `docs/` then the repository root for this file.
The pointer and the record above must agree.

Assessment depth: `full` — the depth chosen at
bootstrap. Skill assessments pre-select it as the recommended depth; the
depth selector appears when depth is unresolved and material choices remain.
Reuse applicable answers already supplied in the request or session, including
depth; defaults never replace explicit choices. A recorded preference alone
steers the recommendation and is never applied silently or treated as an
execution grant. Change this line to change the recommendation.

## ADR Files

ADR filenames use `NNNN-kebab-case-slug.md`, zero-padded to 4 digits,
with contiguous numbering and no reserved gaps.

The number is an **integer**; the four-digit zero-padding is a display
convention only — tools sort ADRs **numerically**, not lexically, so the
catalogue is not capped at `9999` (widen the padding to five digits if you
ever approach it; none do). Related ADRs may be **grouped** under
`domains/<slug>/README.md` without changing their numbers — grouping is a
curated view, not a separate namespace; the contiguous number stays the
single identity.

Each ADR describes one decision. If a decision splits, supersede the
original ADR and create new ADRs rather than expanding scope inside a
single document.

Status lifecycle: `Proposed → Accepted → Implemented → (Superseded | Deprecated)`.

| Status | Meaning |
|---|---|
| Proposed | Draft. Decision authored but not yet approved. |
| Accepted | Decision approved; implementation authorised. Work item lives in `plan/todo/`. |
| Implemented | Code shipped per Q4 completion event. Work item moved to `plan/done/`. ADR is the authoritative spec the running system matches. |
| Superseded | Replaced by another ADR. The successor is named in `superseded-by:` metadata. |
| Deprecated | Was real; the world moved on; no successor. Capability is not being rebuilt. |

Terminal states (Superseded / Deprecated) are reachable from any prior
state.

The first **persisted** status is `Proposed` — there is no separate `Draft`
state and no `brainstorming/`/`drafts/` folder. Work-in-progress lives in
the brainstorm conversation; only an approved decision is written, as a
numbered `Proposed` ADR.

Cross-references link by relative path to `adr/NNNN-*.md`.

## ADR Shapes

This project uses a single ADR shape. ADRs use `adr/0000-template.md`
and contain these sections in order: Context, Capability statement,
User stories / scenarios, Acceptance criteria, Out of scope, Open
questions, References, Revision History, Approvals. No `shape:` field
is written. The template is not a decision: it is excluded from the
catalogue and from `INDEX.md`.

## ADR Privacy

ADRs are internal artefacts. ADR numbers, ADR titles, and the
existence of the ADR catalogue must never appear in any string the
product emits to users: UI copy, API response bodies, error messages,
customer-visible log lines, public documentation, release notes,
marketing copy, or support communications.

Allowed references:
- Inline code comments tying a non-obvious choice to its ADR
  (`// see adr/0042-foo.md`).
- Commit messages and PR descriptions.
- Internal documents: `AGENTS.md`, `INDEX.md`, the `plan/` queue,
  `_agent/` files, internal runbooks.

Rule of thumb: if a non-builder could ever read the string, the ADR
reference comes out. Refer to the behaviour by its product-level name
instead.

## Multi-Agent Rules

`_agent/` is the **agent operating contract**: who writes what, the one
real mutex, and how an unattended run behaves. It holds nothing git
already records — no duplicate shipped record, no dashboard of what is
in flight, no snapshot of the current state. Its absence is a valid
state.

A single writer owns this repo — one human/agent integrates at a time,
so there is nothing to serialise: no roles list, no lock ledger. What
happened is git history and `plan/done/`; what is in flight is the
current branch and any open pull request. The one coordination file is
`_agent/prompts/autonomous.md`, written only where a verify gate is
recorded **and** the `plan/todo/` queue it walks exists; without both
there is no `_agent/` directory at all.
Regenerate `INDEX.md` after any ADR status change or new ADR.

## Plan Folder

Pending and shipped work live in `plan/` at the repository root:

- `plan/todo/NNNN-<slug>.md` — pending work, lower numbers run first.
  Each file names the owning ADR(s), scope, and exit criteria.
- `plan/done/<YYYY-MM-DD>-<slug>.md` — shipped work, chronological.
  Under direct-to-main integration, the completion commit moves the
  item here and its footer names the verified implementation HEAD recorded
  before the completion commit. Under pull-request
  integration, the move happens on the pull-request branch before it is
  marked ready and the footer names the pull request.

The completion event is: `Checked pull-request merge into main`.

The bootstrap seed's adoption record is created with the complete scaffold.
For that seed alone, a direct-integration footer may use this form, with its
actual repository-relative path and host-appropriate quoting:

```text
Shipped by bootstrap introduction: `<repository-relative done path>`.
Resolve: `git log --follow --diff-filter=A --format=%H -- "<repository-relative done path>"`
```

Resolve it after committing to one reachable introducing commit containing
the record, Implemented seed and verified scaffold; verify the signature when
required. A generic bootstrap label or future/self SHA is not evidence.
Ordinary completion footers name an existing verified implementation SHA.

When a `plan/todo/` item ships, the file moves to `plan/done/`, any
plan-item Status section is removed, the owning ADR(s)' `status:`
advances from `Accepted` to `Implemented`, and `INDEX.md` is
regenerated to match. Under direct-to-main integration these changes
are committed before the final push. Under pull-request integration
they are the final branch commit before the pull request is marked
ready; the merge is the completion event, and no follow-up commit is
made on the integration branch.

## Audit Trail Policy

Every substantive change to an Accepted ADR appends a new row to its
Revision History table.

Editorial changes — typos, formatting, link fixes — are excluded from
Revision History but must be flagged "editorial" in the commit message.

The Approvals table is populated when an ADR transitions to Accepted
and updated on every subsequent substantive revision.

## Git Contract

Every change ships via a pull request with required CI. Merge strategy is merge. A change is "shipped" when its PR is merged to `main` with
CI green. Completion changes are committed on the pull-request branch
before it is marked ready; no follow-up commit is made on the
integration branch after merge.

Commit messages follow Conventional Commits with a mandatory
`Rationale:` footer for any commit that touches an ADR.

## Reporting

Final skill results and persisted verification, PR, wave and stop reports
end with a section headed exactly **Status at a glance**, with three labels:

- **This run** — what was attempted, actual outcomes, exact gate output and exit code.
- **Overall** — implemented, partially verified, verified, blocked, failed or unknown.
- **Yet to do** — all remaining work, checks, findings, cleanup and required input; None only when the complete task is verifiably finished.

1. Report exact process outcomes, including timeouts and interruptions.
2. A passing sub-step is not an overall pass; require complete evidence.
3. Missing returns or incomplete evidence remain unknown or partially verified.
4. Do not omit remaining work when a budget or session ends.

The reader must be able to distinguish what was achieved from what is
missing. Routine progress updates remain concise and need no closing block.
Repository-specific reporting rules extend this numbered list.

Example:

**Status at a glance**

- **This run:** prepared the PR; `verify: OK`, exit 0.
- **Overall:** partially verified — CI is still pending.
- **Yet to do:** required CI, authorised merge and branch cleanup.

## Item status

Every new queue item carries this section, initially empty:

```markdown
## Status

- Claimed by:
- Blockers:
- Stopped:
```

At start, record actor, date and actual branch in Claimed by (no invented
claim branch for shared checkouts or single writers). The owner maintains
Blockers. On stop, record date and reason in Stopped with the three Status
at a glance labels. Commit status with the work. Remove the section in
the completion move to plan/done; the shipped footer replaces it.
