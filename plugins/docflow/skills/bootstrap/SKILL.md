---
name: bootstrap
description: Scaffold or retrofit documentation-led conventions (AGENTS.md, CLAUDE.md, CONVENTIONS.md, ADR catalogue, plan/ queue, _agent/ coordination) into a repo. Use when the user asks to "set up conventions", "bootstrap ADRs", "scaffold the documentation-led layout", "add AGENTS.md and a plan queue", or invokes /bootstrap. Works on fresh repos and existing ones — preserves existing content and merges rather than overwrites.
---

# bootstrap

You are installing (or retrofitting) a documentation-led convention set
in the current repo. The end state is a repo that can be driven by
both humans and coding agents off a small set of canonical files. Carry
over the *mechanism* described here — nothing about any other project.

## Step 1 — Detect the situation

Inspect the repo before asking anything.

- **Fresh repo** (no source, no docs): you are scaffolding from zero.
- **Existing repo**: you are retrofitting.
  - Read any current `README.md`, `CONTRIBUTING.md`, `AGENTS.md`,
    `CLAUDE.md`, `docs/`, `adr/`, `.github/` before proposing changes.
  - Preserve existing content. Merge, don't overwrite. If existing
    conventions conflict with the ones below, surface the conflict in
    your assessment summary.
  - If ADRs already exist in another format, propose a migration plan
    (renumber, keep, translate) rather than creating a parallel tree.
- **Already a docflow repo** (carries `AGENTS.md` + `CONVENTIONS.md` + an
  ADR catalogue): you are **adding to an existing setup**, not scaffolding.
  Do **not** re-scaffold the core or re-ask settled questions — read the
  recorded choices from `CONVENTIONS.md`/`AGENTS.md` (ADR shape, status
  lifecycle, **artefact root**, multi-agent mode, and which optional layers
  already exist). Then offer to **enable any opted-out optional layer**
  still absent — `plan/`, `_agent/`, `GLOSSARY.md`, `domains/`, or the
  technology-ADR template/split — and write only the chosen ones, by
  **merge**, under the recorded artefact root, leaving everything else
  untouched. Ask only the questions the new layers need (e.g. the
  coordination-mode question when enabling `_agent/`). This is the entry
  point for adding a layer you deferred at first bootstrap.

State which situation applies in one line before asking the assessment
questions.

## Step 2 — Target layout

```
<repo>/
  AGENTS.md              # hard rules for coding agents — entry point
  CLAUDE.md              # one-liner: @AGENTS.md
  README.md              # human-facing project summary (preserve if exists)
  CONVENTIONS.md         # authoring rules: ADRs, naming, status, audit, git
  INDEX.md               # generated table of all ADRs
  GLOSSARY.md            # shared terms (optional — see Q7)
  adr/
    0000-template.md     # capability-ADR template (always)
    NNNN-template.md     # technology-ADR template (only if split — see Q2)
    NNNN-<kebab-slug>.md # one ADR per decision, contiguous numbering
  domains/<slug>/README.md   # optional (see Q7)
  plan/
    README.md
    todo/NNNN-<slug>.md
    done/<YYYY-MM-DD>-<slug>.md
  _agent/
    ROLES.md             # named agents and what each owns
    LOCKS.md             # file-claim ledger
    WORKLOG.md           # append-only ship log
    CURRENT_FOCUS.md     # slim live snapshot
    HANDOFF.md           # fresh-agent entry point
    prompts/autonomous.md  # only if a verify gate exists (see Q8)
  federation.md          # multi-repo only (Q11): this repo's back-pointer
  federation-index.md    # multi-repo only (Q11): member index — home repo only
```

**Placement.** The tree above shows the **root** option. `AGENTS.md` and
`CLAUDE.md` always sit at the repository root; `adr/`, `plan/`, `_agent/`,
`INDEX.md`, and `CONVENTIONS.md` go under the **artefact root** chosen in
Q12 (default `.docflow/`, e.g. `.docflow/adr/`, `.docflow/plan/`).

**Core vs optional layers.** Only the **core** is always written:
`AGENTS.md`, `CLAUDE.md`, `CONVENTIONS.md`, `adr/0000-template.md`, and
`INDEX.md`. A repo with just these is a valid, lightweight docflow repo — a
classic ADR catalogue with conventions. Everything else is an **opt-in
layer**: the `plan/` queue (Q4a), the `_agent/` coordination set (Q5 —
choose *None* to omit it), `GLOSSARY.md` and `domains/` (Q7). Omitting any
optional layer is a valid state, not an error; a lifecycle skill that needs
an absent layer refuses cleanly and names what is missing.

For a **multi-repo product** (one product spread across several repos —
see Q11), two extra files appear: `federation.md`, a small back-pointer
every member repo carries, and `federation-index.md`, the authoritative
member list that lives only in the home/establishing repo. All federation
artefacts — `federation.md`, `federation-index.md`, and the derived
roll-up `ROLLUP.md` — are placed under the **configured artefact root**.
A standalone repo has none of them.

## Step 3 — Conventions to install

1. **ADRs are the source of truth.** One decision per ADR. Splits become
   new ADRs that supersede; never expand scope inside an existing one.
2. **Up to two ADR shapes:**
   - **Capability ADR** (what the system must do). Section order:
     metadata → Context → Capability statement → User stories / scenarios
     → Acceptance criteria → Out of scope → Open questions → References →
     Revision History → Approvals.
   - **Technology ADR** (how it's built). Section order:
     metadata → Context → Decision → Rationale → Consequences →
     Acceptance criteria → Out of scope → Open questions → References →
     Revision History → Approvals. Rationale must name alternatives
     considered and give specific rejection reasons (not "simpler" /
     "more idiomatic").
3. **Status lifecycle:** `Proposed → Accepted → Implemented →
   (Superseded | Deprecated)`. Terminal states reachable from any prior
   state. Status drives plan-folder placement: `Accepted` →
   `plan/todo/`, `Implemented` → `plan/done/`.
4. **Filenames:** `adr/NNNN-kebab-slug.md`, zero-padded 4 digits,
   contiguous, no reserved gaps. Cross-references use relative paths.
5. **Acceptance criteria are testable and numbered.** Tests map back to
   them where practical.
6. **Audit discipline.** Substantive ADR changes append a Revision
   History row. Editorial changes (typos, formatting, link fixes) are
   excluded but flagged `editorial` in the commit message. Approvals
   table populates when an ADR is Accepted and updates on each later
   substantive revision.
7. **INDEX.md is regenerated** from ADR metadata after any ADR change.
   Treat as derived, not hand-edited.
8. **`plan/` is the work queue.** `git mv plan/todo/X plan/done/<date>-X`
   is the completion event; the moved file gets a footer naming the HEAD
   SHA (and deploy artefact id if applicable). Owning ADR(s) advance
   `Accepted → Implemented` on the same commit.
9. **Multi-agent coordination.** Before editing, an agent appends a row
   to `_agent/LOCKS.md` (`<agent-id> | <path> | <ISO-8601 timestamp>`)
   and removes it on commit. On commit, append one line to
   `_agent/WORKLOG.md`. `CURRENT_FOCUS.md` is the live snapshot; if it
   disagrees with git, git wins and `CURRENT_FOCUS.md` is corrected.
10. **Git contract.** Conventional Commits. Mandatory `Rationale:`
    footer on commits touching an ADR. Signed commits unless the user
    opts out. No `Co-Authored-By` trailer for agent work unless the user
    asks for one.
11. **AGENTS.md is the hard-rules entry point;** **CLAUDE.md** is the
    one-liner `@AGENTS.md` so the Claude Code CLI picks it up.
12. **ADRs are internal artefacts — never user-visible.** ADR numbers,
    ADR titles, and the existence of the ADR catalogue must NEVER
    appear in product code paths that reach a user: UI strings, API
    response bodies, error messages, log lines emitted to customers,
    public documentation, release notes, marketing copy, or support
    communications. ADRs are for builders, not users. References ARE
    allowed in: code comments (`// see adr/0042-foo.md`), commit
    messages, PR descriptions, internal docs, `AGENTS.md`,
    `CONVENTIONS.md`, `INDEX.md`, and the `plan/` queue. When in
    doubt, ask whether a non-builder would ever see this string — if
    yes, the ADR reference comes out.

## Step 4 — Assessment (10 questions, plus federation (Q11) and placement (Q12))

**Ask the questions one at a time, not in a batch.** For each question,
state a **recommended** option (label it "Recommended") with one short
sentence on why; the user picks it, picks an alternative, or types a
custom answer. Wait for the answer before moving to the next question.

If the host CLI exposes a structured single-select question tool (e.g.
Claude Code's `AskUserQuestion`), use it and mark the recommended
option with the literal "(Recommended)" suffix in its label. Otherwise
ask in plain text, listing options as A/B/C and naming the recommended
one.

After the answers are in, summarise the resulting plan in 5–10
lines and ask for sign-off before writing any files. Note in the summary
that a **seed ADR `0001`** recording the adopted method is created by
default (the operator may decline it — see Step 5 item 5b).

1. **Project identity.** Name, one-line description, doc language
   (en-GB / en-US / other), and — if existing repo — what current files
   (README, CONTRIBUTING, docs/, adr/, etc.) must be preserved or
   merged. *No recommendation — project-specific.*
2. **ADR shape.** Single shape, or capability-vs-technology split?
   **Recommended: single shape** — start simple, split later if
   long-lived product requirements clearly outlive their
   implementations.
3. **Status lifecycle.** Full `Proposed → Accepted → Implemented →
   (Superseded | Deprecated)`, or shorter (drop `Implemented`)?
   **Recommended: full lifecycle** — the `Implemented` rung is cheap
   and gives a clear "what's shipped" signal.
4. **Plan folder + integration model.** Two sub-answers. **Ask Q5
   before Q4b — the integration recommendation depends on the
   multi-agent mode chosen in Q5.** When asking sequentially, the
   order is: Q1 → Q2 → Q3 → Q4a → Q5 → Q4b → Q6 → Q7 → Q8 → Q9 → Q10.

   **Q4a — Plan folder.** Use `plan/todo/` + `plan/done/`, or skip it
   because work is tracked elsewhere?
   **Recommended: use it** — the queue is what makes the convention
   set actionable for agents.

   **Q4b — Integration model.** *Skip if Q4a = skip.* Two options:
   - **Direct-to-main, fast-forward only.**
     *Recommended if Q5 = mode 1 (single agent).* Local verify gate
     runs before push. Completion event: "fast-forwarded to main +
     remote push succeeded". Autonomous prompt uses
     `git merge --ff-only`. Trunk-based development; no PRs.
   - **PR-based, required CI green.**
     *Recommended if Q5 = mode 2 or 3 (multi-agent).* Verify gate
     runs in CI on the PR. Completion event: "PR merged to main + CI
     green". Autonomous prompt opens a draft PR, waits for green,
     marks ready, merges. Ask the user for merge strategy
     (squash / merge / rebase — default: squash for clean history,
     rebase if per-commit identity matters).
5. **Coordination — by number of writers.** Pick by how many people/agents
   *write* to this repo and how they integrate — **writers (integration
   concurrency), not how many agents you run.** A team of several developers
   is multi-writer even with one agent each, and wants the worktree/PR
   shape. This sets the `_agent/` shape (or omits it); switching later is
   not free:
   - **None — omit `_agent/`.** A solo human/agent with no coordination
     need; no `_agent/` directory is written, and lifecycle skills skip the
     WORKLOG/snapshot steps. The lightest footprint (the optional `_agent/`
     layer is left out — see the core-vs-optional note in Step 2).
   - **(Recommended) Single agent.** `default-agent` in ROLES.
     LOCKS skipped. WORKLOG / CURRENT_FOCUS as standard single-file
     snapshots. Right for small projects and the "one human + one
     agent" case.
   - **Multi-agent, shared checkout.** Named agents in ROLES. LOCKS
     ON as a filesystem mutex (prevents simultaneous writes to the
     same file). WORKLOG append-on-commit, single file.
     CURRENT_FOCUS as the single in-flight snapshot. Right when
     several agents serialise through one working tree.
   - **Multi-agent, separate worktrees / PR branches.** Named agents
     in ROLES. LOCKS *advisory only* — GitHub draft PRs / branch
     assignment are the real lock; pick one signal, not two.
     `_agent/WORKLOG.md` gets `merge=union` via `.gitattributes` so
     concurrent appends concatenate instead of conflicting (or split
     to `_agent/worklog/<agent-id>.md` if agent set is fixed).
     `_agent/CURRENT_FOCUS.md` becomes local-only (added to
     `.gitignore`); a committed `_agent/IN_FLIGHT.md` dashboard
     aggregates per-worktree state.

   Note: option 2 → option 3 is not a free upgrade later; it means
   splitting WORKLOG (or adding the merge driver) and rethinking
   CURRENT_FOCUS. Choose deliberately.
6. **Git contract.** Confirm or override each — Conventional Commits;
   mandatory `Rationale:` footer on ADR-touching commits; signed
   commits; ADR-revision tags `adr-NNNN-rN`; whether agent commits
   carry a `Co-Authored-By` trailer. **Recommended: Conventional
   Commits ON, `Rationale:` footer ON, signed commits ON, ADR-revision
   tags OFF, `Co-Authored-By` trailer OFF.**
7. **Optional artefacts.** Which now vs. defer:
   - **`domains/<slug>/README.md` grouping** — per-area indexes over the
     flat catalogue (navigation by area, *not* numbering). **Enable when
     the project has distinct areas (e.g. auth, billing, search) or you
     expect the catalogue to grow past ~20 ADRs**; defer for a small,
     single-area repo. Cheap to add later.
   - **`GLOSSARY.md`** — shared term definitions. *Defer; add on
     terminology drift.*
   - **technology-ADR template** — *defer unless technology decisions split
     from product decisions.*
8. **Verify gate.** What command(s) decide a change is shippable
   (`npm test`, CI workflow, deploy + smoke, manual)? *No
   recommendation — project-specific.* If the user has no real gate,
   the skill will refuse to write `_agent/prompts/autonomous.md`.
9. **Existing-content conflicts** (existing repos only). Any
   conventions already in place (commit format, branch policy, ADR
   style, status names) the new layout must defer to or merge with?
   *No recommendation — project-specific.* Skip this question on a
   fresh repo.
10. **Domain-specific hard rules to bake in.** Any project-specific
    constraints to enforce in `AGENTS.md` / `CONVENTIONS.md` from day
    one — e.g. vendor-naming restriction, regulated-evidence posture
    (attribution, retention, e-signatures), language mandate,
    mandatory user-story personas, separated audit streams?
    **Recommended: none from day one** — add later when a concrete
    requirement appears; pre-emptive hard rules accumulate as cruft.
11. **Multi-repo product (optional).** Is this repo part of a product
    that spans several repos? **Recommended: No** — most repos are
    standalone; skip the federation setup entirely. If **yes**, two
    sub-answers:

    **Q11a — Establish or join?** Are you **establishing** a new
    federation (this is the first repo) or **joining** an existing one?

    **Q11b — Topology (establish only).** Where do product-wide
    decisions live?
    - **A — central decisions repo:** a dedicated repo holds all
      product-wide decisions; code repos reference it, never duplicate.
    - **B — distributed + federation:** each repo owns its own
      decisions; a roll-up aggregates them.
    - **(Recommended) C — home repo + local:** one repo is the home for
      product-wide decisions; each repo also keeps purely-local ones.

    **Q11c — Identity scheme (establish only).** How are ADRs identified
    across the federation? **(Recommended) repo-prefixed slug**
    `<repo-id>/NNNN-slug` — each repo keeps local contiguous numbering
    with no central coordinator; the slug is the cross-federation key.
    The scheme is recorded in the federation config and applied by the
    authoring skills.

    **Establish** sets this repo's role from the chosen topology —
    **central** (A), **coordinator** (B), or **home** (C) — writes the
    member index here, and records the topology **and identity scheme**
    in the federation config. **Join** asks for the home pointer **and the federation's topology +
    identity scheme** — **you supply them; the skill performs no
    cross-repo read and no host API call** — then writes **only this
    repo's** back-pointer config, recording those values (it does not
    re-choose the topology). Joining never writes into any other
    repo; adding this repo to the member index is a deliberate edit in
    the home repo. A standalone repo (Q11 = No) writes none of these
    files and behaves exactly as a single-repo bootstrap.
12. **Artefact placement.** Where the non-entry artefacts live — `adr/`,
    `plan/`, `_agent/`, `INDEX.md`, `CONVENTIONS.md`:
    - **(Recommended) `.docflow/`** — a hidden root that keeps the repo
      root clean and groups all docflow artefacts in one place
      (`.docflow/adr/`, `.docflow/plan/`, …).
    - **`docs/`** — aligns with the common `doc/adr` / `docs/` convention;
      records visible alongside other docs.
    - **Repository root** — flat layout; decisions beside the code (good for
      monorepos). This is docflow's own layout.

    `AGENTS.md` and `CLAUDE.md` are **always** written to the repository
    root (coding agents discover them there). The chosen root is recorded in
    `CONVENTIONS.md`, and every lifecycle skill resolves `adr/`, `plan/`,
    and `INDEX.md` against it. For an existing repo already laid out
    differently, offer a documented migration (`git mv` into the chosen root
    + update `CONVENTIONS.md`) — never force it.

## Step 4.5 — Cross-check before sign-off

After all answers are in, scan for contradictions before writing the
plan summary. Surface each, take the correction, then proceed:

- **Q5 mode 3 (worktrees) + Q4b direct-to-main.** Unusual: each
  worktree would have to rebase onto main before fast-forwarding.
  Ask the user to confirm or switch to PR-based — PR-based is the
  near-universal fit for worktree work.
- **Q4a plan-folder skipped + Q8 autonomous prompt expected.** The
  autonomous prompt walks `plan/todo/`; with no plan folder it has
  nothing to drive. Do not write the autonomous prompt.
- **Q8 has no real verify gate + Q4b PR-based with required CI.**
  "Required CI green" needs a CI gate. Confirm what the CI actually
  runs, or downgrade the completion event.
- **Q2 single ADR shape + Q7 technology-ADR template requested.**
  Contradiction — pick one.
- **Q11 = join but no confirmable home pointer.** Joining needs a
  home/federation pointer you can confirm. If none exists yet, you are
  really *establishing* — switch Q11a to establish.

## Step 5 — Output sequence (after sign-off)

Templates live in this skill's `templates/` directory. Read each
template, fill its placeholders from the assessment answers, then
write it into the repo.

**Placement (Q12):** write `AGENTS.md` and `CLAUDE.md` to the repository
root; write everything below under the chosen **artefact root** (default
`.docflow/`) — e.g. `.docflow/adr/0000-template.md`, `.docflow/plan/`,
`.docflow/INDEX.md`. Record the chosen root in `CONVENTIONS.md` so every
lifecycle skill resolves paths against it, and adjust the `adr/`/`plan/`
cross-paths in the filled `AGENTS.md` (and other templates) to the chosen
root (e.g. `.docflow/adr/`).

1. `CONVENTIONS.md` — from `templates/CONVENTIONS.md`. Spec other files
   reference. Include the **§Concurrency Guardrails** section only if Q5
   is mode 2/3 **or** Q4b is PR-based; omit it for single-agent
   direct-to-main repos (no numbering race). Include the **§Federation
   (multi-repo)** section only if Q11 = yes; fill `<product>` and state
   the chosen identity scheme. Omit it for standalone repos.
2. `AGENTS.md` — from `templates/AGENTS.md`. Include the concurrency
   guardrails hard-rule bullet (G2–G4) under the same condition as the
   CONVENTIONS section above; omit otherwise.
3. `CLAUDE.md` — from `templates/CLAUDE.md` (single line `@AGENTS.md`).
4. `adr/0000-template.md` — from `templates/adr-capability.md`.
5. `adr/NNNN-template.md` — from `templates/adr-technology.md`, only if
   Q2 said split. `NNNN` is the number where capability ADRs end
   (project-defined, e.g. 0091; default 0100 if unspecified).
5b. **Seed ADR (default on; opt-out at sign-off).** Write the seed
   `adr/0001-record-architecture-decisions.md` from
   `templates/adr-0001-seed.md`, filled from the assessment answers — it
   records the **decision to adopt** the documentation-led, ADR-driven
   method, status **`Implemented`**, and **references `CONVENTIONS.md`** for
   the rules (it does not duplicate them). Keep it generic — no other
   project's ADR numbers. **Skip only if the operator opted out.** For a
   **split** repo (Q2) use the technology-ADR shape for the seed. If `plan/`
   exists, also write a matching `plan/done/<date>-adopt-adr-method.md` (the
   seed's completion event is this bootstrap), so plan-coverage stays
   satisfied. On a **retrofit/backfill** (Step 6), the seed is `0001`, ahead
   of the reconstructed decisions.
6. `plan/README.md` — from `templates/plan-README.md`. Create empty
   `plan/todo/.gitkeep` and `plan/done/.gitkeep`.
7. `_agent/ROLES.md` — from `templates/_agent-ROLES.md`. **If Q5 = None,
   skip items 7–11 entirely — no `_agent/` directory.** Otherwise: Mode 1
   keeps the `default-agent` block; modes 2 and 3 expand to named
   agents per Q5.
8. `_agent/LOCKS.md` — from `templates/_agent-LOCKS.md`. **Skip in
   mode 1.** **Mode 3** writes it with an advisory header noting
   PRs are the authoritative lock.
9. `_agent/WORKLOG.md` — from `templates/_agent-WORKLOG.md`. In
   **mode 3**, also write a `.gitattributes` entry:
   `_agent/WORKLOG.md merge=union`.
10. `_agent/CURRENT_FOCUS.md` — from
    `templates/_agent-CURRENT_FOCUS.md`. In **mode 3**, add
    `_agent/CURRENT_FOCUS.md` to `.gitignore` (the file stays
    local-only per worktree) and write
    `_agent/IN_FLIGHT.md` from `templates/_agent-IN_FLIGHT.md` as
    the committed cross-worktree dashboard.
11. `_agent/HANDOFF.md` — from `templates/_agent-HANDOFF.md`.
12. `INDEX.md` — header + the seed ADR's row (item 5b); an empty table only
    if the seed was declined.
13. `_agent/prompts/autonomous.md` — from
    `templates/_agent-prompts-autonomous.md`, **only** if Q8 confirmed a
    verify gate. Keep the integration block matching Q4b: the
    **direct-to-main** variant (`git merge --ff-only` then push) or
    the **PR-based** variant (`gh pr create --draft` → wait for CI →
    mark ready → `gh pr merge`). Drop the unused variant.
14. **Federation files** — **only if Q11 = yes.** Place both at the
    configured artefact root (repository root by default).
    - **Establish:** write `federation-index.md` (the member index, a
      Markdown table) from `templates/federation-index.md` into this
      repo, seeded with this repo as the first member; and write
      `federation.md` from `templates/federation-config.md` with the
      chosen topology, the chosen identity scheme (default repo-prefixed
      slug), and this repo's **`Role` set from the topology**:
      `central` for **A** (this repo holds all product-wide ADRs),
      `coordinator` for **B** (this repo holds only the member index —
      product-wide decisions are distributed and the roll-up is the
      product-wide view), or `home` for **C** (this repo holds
      product-wide ADRs; members keep local ADRs alongside). Record the
      identity scheme in both files so it is the same on every read.
    - **Join:** write **only** `federation.md` from
      `templates/federation-config.md` with `Role: member`, the
      confirmed home pointer, and the topology **and identity scheme**
      for the federation, **supplied by the operator at join** (recorded
      into this repo's `federation.md`; no cross-repo read). Then apply
      the **topology's member rule**: for **A**, this
      repo references the central repo and does **not** hold product-wide
      ADRs locally (its `adr/` is for local-implementation decisions
      only); for **B**, this repo owns its own catalogue in full; for
      **C**, this repo keeps local ADRs and references the home for
      product-wide ones. Write nothing into any other repo, and do **not**
      create a member index. Tell the user to add this repo to the
      **index-holding repo's** `federation-index.md` — the home (C),
      central (A), or coordinator (B) repo — a deliberate edit there.

Commit each file (or logical group) with a Conventional Commit message;
no `Co-Authored-By` trailer unless Q6 asked for one.

For an existing repo, prefer Edit over Write where files exist, and
call out every merge decision in the commit message.

## Step 6 — Offer backfill (existing repos; re-runnable for emergent work)

Once the scaffolding commit has landed, **offer to backfill** the ADR
catalogue, the plan folder, and `CONVENTIONS.md` from the existing
code and git history. Skip this step entirely on a fresh repo.

Phrase the offer like this:

> The scaffolding is in. Want me to backfill ADRs, plan/done entries,
> and CONVENTIONS additions from the existing code and commit history?
> I'll propose drafts; you approve in batches before anything lands.

If the user accepts, run the backfill in four passes. Each pass
produces drafts the user reviews before they are committed.

1. **Scan inputs (read-only).**
   - `git log --oneline --reverse main` (or the default branch) — the
     decision and shipped-work trail.
   - Major modules / packages / top-level source directories — the
     surface of what exists.
   - Any existing docs (`README`, `docs/`, design notes, RFCs) — prior
     decision records, even informal ones.
   - `package.json` / `pyproject.toml` / `go.mod` etc. — declared
     dependencies often map to technology decisions.

2. **Propose ADRs.** For each distinguishable decision or capability
   evident from the scan, draft an ADR using the appropriate template.
   - Capabilities (what the system does) → capability ADR, status
     `Implemented` (the code already exists), Revision History row
     citing the commit(s) that introduced the behaviour.
   - Technology choices (framework, persistence, deployment target) →
     technology ADR, status `Accepted` or `Implemented` as appropriate,
     Rationale section reconstructed from commit messages and code
     comments — flag any speculative rationale clearly so the human
     can correct it.
   - Number contiguously from `0001`. Show the user the proposed list
     (number + title + status + one-line scope) before writing files.

3. **Propose plan/done entries.** For each ADR drafted as
   `Implemented`, generate a corresponding `plan/done/<date>-<slug>.md`
   file using the commit date of the implementing commit (or the
   merge commit) as the date prefix. Body: short summary, owning ADR,
   "Shipped at HEAD `<sha>`" footer. Group these into a single
   approval prompt — they are mechanical once the ADRs are agreed.

4. **Propose CONVENTIONS additions.** Identify patterns in the existing
   repo that should be promoted to written conventions: commit-message
   style, branch naming, test layout, file-naming rules, language /
   tooling choices that are de-facto standards. Draft additions to
   `CONVENTIONS.md` (and corresponding bullets in `AGENTS.md` §Hard
   rules if they should be enforced). Show the diff before applying.

After each pass, commit the approved drafts with a Conventional Commit
(`docs(adr): backfill ADRs 0001-00NN from code and history`,
`docs(plan): backfill plan/done from shipped commits`,
`docs: backfill conventions from de-facto patterns`). Regenerate
`INDEX.md` after the ADR pass.

**Important guardrails.**
- The backfill produces *drafts*. Every commit is reviewable; the user
  is the authority on whether an inferred decision is real.
- If commit history is sparse or unclear, say so and stop — do not
  invent rationale to fill gaps.
- If the user declines the backfill, the scaffolding is still
  complete; the queue is just empty until the first hand-authored ADR
  lands.

**Re-running to capture a development that bypassed the process.** This
backfill is not adoption-only. When a substantial development later lands in
an already-docflow repo **without** an owning ADR or plan item — a large
feature built ahead of the process — run the same passes again, **scoped to
that development**: limit the scan (passes 1–3) to its commits and the area
it touched, reconstruct just the decision(s) it embodies as `Implemented`
ADR(s) (Revision History citing the implementing commits and noting they
were recorded after the fact), and write the matching `plan/done` entries;
regenerate `INDEX.md` and the worklog. A large development is never
*outside* the catalogue — it is an ADR not yet written. `/audit`'s coverage
check surfaces such gaps so they are captured, not silently kept.
