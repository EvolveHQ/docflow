# AGENTS.md

This file provides guidance to coding agents working in this repository.

## What this repository is

<One paragraph. Project purpose, current baseline, what the artefacts in
this repo represent.>

## Picking up this repo

<!-- Bootstrap GENERATES this list from the recorded artefact root, the
optional layers this repo actually has, and the coordination mode: drop
every line whose file was not written, renumber what remains, and
resolve each path against the artefact root (e.g.
`.docflow/CONVENTIONS.md`). This section is the repo's only read order —
no separate hand-off file is written. -->

Read these, in order, before any tool calls:

1. `AGENTS.md` (this file) — the hard rules. Read in full.
2. `CONVENTIONS.md` — authoring rules, ADR status semantics, the git
   contract.
<!-- If plan folder skipped (Q4a): drop lines 3 and 7. -->
3. `plan/README.md` — how the work queue is used.
4. `INDEX.md` — the ADR catalogue: an ADR's filename and its dependency
   chain. Sorted by number, not by work order.
<!-- Coordination lines: keep 5 in shared-checkout and separate-worktree
modes; keep 6 in shared-checkout mode only; drop both for a single
writer. -->
5. `_agent/ROLES.md` — who writes what.
6. `_agent/LOCKS.md` — which files are currently claimed; claim yours
   here before editing.
7. The queue item you are about to work, `plan/todo/NNNN-<slug>.md`, and
   the ADR(s) it names — both in full.

## Repository structure

- `adr/0000-template.md` — canonical ADR template.
<!-- If two ADR shapes (Q2): also include `adr/0000-template-technology.md` for technology ADRs. -->
- `adr/NNNN-<kebab-slug>.md` — one ADR per decision, contiguous
  numbering, no gaps.
- `INDEX.md` — table regenerated from every ADR's metadata block.
- `CONVENTIONS.md` — authoring rules (read before editing anything).
<!-- If plan folder skipped (Q4a): drop the two plan/ lines and the
"Plan folder" section below. -->
- `plan/todo/NNNN-<slug>.md` — pending work, lower numbers run first.
- `plan/done/<YYYY-MM-DD>-<slug>.md` — shipped work, chronological.
<!-- `_agent/` line — list the members the coordination mode (Q5) writes,
and drop the line entirely when no `_agent/` exists (a single writer with
no verify gate):
  single writer:       `prompts/autonomous.md`
  shared checkout:     `ROLES.md`, `LOCKS.md`, `prompts/autonomous.md`
  separate worktrees:  `ROLES.md`, `prompts/autonomous.md`
`prompts/autonomous.md` appears only where a verify gate was recorded
(Q8); drop it from the list otherwise. -->
- `_agent/` — the agent operating contract: who writes what, the one
  real mutex, and how an unattended run behaves. Here: `ROLES.md`,
  `LOCKS.md`, `prompts/autonomous.md`. It holds nothing git already
  records.
<!-- If GLOSSARY.md (Q7): also include `GLOSSARY.md` — shared terms. -->
<!-- If domains/ (Q7): also include `domains/<slug>/README.md`. -->

## Hard rules when editing ADRs

These come from `CONVENTIONS.md` and override default behaviour:

- **One decision per ADR.** Splits become new ADRs that supersede;
  never expand scope inside an existing one.
- **Status lifecycle:** `<from Q3>`.
- **Capability ADR section order:** metadata → Context → Capability
  statement → User stories / scenarios → Acceptance criteria → Out of
  scope → Open questions → References → Revision History → Approvals.
<!-- If two ADR shapes (Q2): keep the NEXT TWO bullets. A single-shape repo
drops both — it writes no `shape:` field at all. -->
- **Technology ADR section order:** metadata → Context → Decision →
  Rationale → Consequences → Acceptance criteria → Out of scope → Open
  questions → References → Revision History → Approvals. Rationale must
  name alternatives considered with specific rejection reasons.
- **Shape is declared, never numbered.** Each ADR's `shape:` field says
  which order applies (`capability` — the default when the field is
  absent — or `technology`). Every ADR takes the next contiguous number
  whatever its shape.
<!-- End of the two-shape bullets. -->
- **Acceptance criteria are testable and numbered.**
- **ADRs are internal artefacts — never user-visible.** ADR numbers,
  ADR titles, and the existence of the ADR catalogue must NEVER appear
  in any string the product emits to users: UI copy, API response
  bodies, error messages, customer-visible log lines, public
  documentation, release notes, marketing copy, or support
  communications. The catalogue is a builder's tool, not a user-facing
  surface. References ARE allowed in: code comments
  (`// see adr/0042-foo.md`), commit messages, PR descriptions,
  internal docs, `AGENTS.md`, `CONVENTIONS.md`, `INDEX.md`, and the
  `plan/` queue. Rule of thumb: if a non-builder could ever see the
  string, the ADR reference comes out.
<!-- Insert any Q10 domain-specific hard rules here as additional bullets. -->

## Implementation work

- Start from the ADRs. Identify which ADRs a code change implements or
  affects before changing behaviour.
- If implementation reveals a capability gap or changed decision, update
  the relevant ADR rather than silently diverging.
- Add or update tests for implemented behaviour. Map tests back to ADR
  acceptance criteria where practical.
- **Do not leak ADR identifiers into user-visible surfaces.** When
  writing error messages, UI copy, API responses, log lines that ship
  to customers, public docs, or release notes, refer to the behaviour
  by its product-level name — never by ADR number, ADR title, or
  phrases like "per the ADR catalogue". The ADR link belongs in the
  commit message and (optionally) an inline code comment, not in the
  string the user reads.

## Audit trail and revision discipline

- Substantive ADR changes append a row to the Revision History table.
  Editorial changes (typos, formatting, link fixes) are excluded but
  flagged `editorial` in the commit message.
- Approvals table populates when an ADR is Accepted and updates on each
  later substantive revision.
- Regenerate `INDEX.md` from ADR metadata after any ADR status change
  or new ADR.

## Multi-agent workflow

<!-- Keep the ONE block matching the coordination mode (Q5); delete the
others. `_agent/` holds contracts only — no mode writes a log, a
dashboard, or a snapshot of what git already records. -->

<!-- Single writer. Keep this block. -->
A single writer owns this repo — one human/agent integrates at a time,
so there is nothing to serialise. What happened is in git history and
`plan/done/`; what is in flight is the branch you are on and any open
pull request.
<!-- If a verify gate was recorded (Q8), add: The one coordination file
is `_agent/prompts/autonomous.md`, the contract for an unattended run.
With no gate recorded there is no `_agent/` directory at all. -->

<!-- Several writers, one shared checkout. Replace the block above with: -->
<!--
Work is partitioned across named writers (see `_agent/ROLES.md`).
Coordination rules:
- Before editing a file, claim it in `_agent/LOCKS.md` by appending
  `<agent-id> | <path> | <ISO-8601 timestamp>`. Remove the line on
  commit. LOCKS is the one real mutex — it prevents simultaneous
  writes to the same file in this shared checkout.
- Keep no log of what shipped: git history and `plan/done/` are that
  record.
-->

<!-- Several writers, separate worktrees / PR branches. Replace the
block above with: -->
<!--
Work is partitioned across named writers (see `_agent/ROLES.md`).
Each writer works in its own git worktree or PR branch.
Coordination rules:
- **The pushed branch and its draft pull request are the claim.** There
  is no lock ledger: worktrees cannot collide on the filesystem, and an
  advisory ledger nobody can rely on is noise. What has to be guarded
  against is duplicated work and contradictory merges — see the
  guardrails below.
- Keep no dashboard and no log: what is in flight is the set of live
  branches, worktrees and open pull requests; what shipped is git
  history and `plan/done/`.
-->

<!-- Concurrency guardrails hard rule — bootstrap INCLUDES this bullet
ONLY for several-writer (shared-checkout / worktree) OR PR-based repos
(omit for a single writer on direct-to-main). See CONVENTIONS.md
§Concurrency Guardrails.

- **Before integrating, check for number collisions (G2/G3).** Sync onto
  the current `main` and run the audit skill; if your ADR or `plan/todo`
  number now clashes with what landed on `main`, renumber locally before
  integrating. The single-threaded merge gate rejects a duplicate as the
  backstop. Numbers are immutable once merged. (G1 — landing the ADR
  before implementation — is recommended guidance, in CONVENTIONS.md.)
-->

## Plan folder

- A pending item gets a `plan/todo/NNNN-<slug>.md` file BEFORE work
  starts, naming the owning ADR(s), scope, and exit criteria.
- The completion event is: `<from Q4 — e.g. merge to main, deploy +
  smoke passes, release tag>`. On completion, `git mv` the file to
  `plan/done/<YYYY-MM-DD>-<slug>.md` with a footer naming the HEAD SHA
  and any artefact id.
- The owning ADR(s) advance `Accepted → Implemented` on the same
  commit. Regenerate `INDEX.md`.

## Git contract

- Commit messages follow **Conventional Commits**.
- Mandatory `Rationale:` footer on any commit touching an ADR.
- <Signed commits: yes/no per Q6.>
- <ADR-revision tags `adr-NNNN-rN`: yes/no per Q6.>
- <Co-Authored-By trailer: yes/no per Q6 — default no.>
- Cross-references between ADRs use relative paths (`adr/NNNN-*.md`).

<!-- Integration model per Q4b — keep one block. -->

<!-- Direct-to-main (if no verify gate was recorded (Q8), drop the
gate sentence):
- **Integration:** direct-to-main, **fast-forward only**. No merge
  commits on `main`. The verify gate (`<command from Q8>`) runs
  locally and must pass before push. Completion event:
  fast-forwarded to `main` + remote push succeeded.
-->

<!-- PR-based:
- **Integration:** every change ships via a pull request. CI must be
  green before merge — the verify gate (`<command from Q8>`) runs in
  CI on the PR, not (only) locally. Merge strategy:
  <squash | merge | rebase>. Completion event: PR merged to `main`
  with CI green.
-->
