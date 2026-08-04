---
name: bootstrap
description: Scaffold or retrofit documentation-led conventions (AGENTS.md, CLAUDE.md, CONVENTIONS.md, ADR catalogue, plan/ queue, _agent/ coordination) into a repo. Use when the user asks to "set up conventions", "bootstrap ADRs", "scaffold the documentation-led layout", "add AGENTS.md and a plan queue", or invokes /bootstrap. Works on fresh repos and existing ones — preserves existing content and merges rather than overwrites. Opens with an express / guided / full depth choice, so a quick conservative setup needs almost no questions.
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
  recorded choices from the capability manifest and
  `CONVENTIONS.md`/`AGENTS.md` (the **record model**, from `docflow.yml`
  `model:` — a re-run **never converts it**; changing model is a
  separate, deliberate migration path — plus status lifecycle,
  **artefact root**, multi-agent mode, and which optional layers
  already exist). Then offer to **enable any opted-out optional layer**
  still absent — `plan/`, `_agent/`, `GLOSSARY.md`, `CONSTRAINTS.md`,
  `goals/`, or `domains/` — plus the capability manifest
  `docflow.yml` where the repo predates it, and the
  `Assessment depth:` line (§Project) where the recorded
  `CONVENTIONS.md` predates that. (The technology-ADR
  template is **not** offered here: adding it means moving to the
  two-shape record model, and a re-run never converts the model.)
  Write only the chosen ones, by
  **merge**, under the recorded artefact root. Enabling a layer
  **includes writing its `CONVENTIONS.md` section** — each optional
  layer's rules live there, so the layer and its rules arrive
  together (likewise, a repo adopting evidence gains §Trust Posture
  and §Verification Evidence together — the latter cross-references
  the former). Everything not chosen is left untouched. Ask only the
  questions the new layers need (e.g. the
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
  docflow.yml            # capability manifest: schema, model, layers
  GLOSSARY.md            # shared terms (optional — see Q7)
  CONSTRAINTS.md         # inviolable boundaries (optional — see Q7)
  goals/G-<kebab-slug>.md    # one file per goal (optional — see Q7)
  COVERAGE.md            # generated goal→evidence walk (goals layer only)
  adr/
    0000-template.md     # capability-ADR template (always)
    NNNN-template.md     # technology-ADR template (two-shape model only — see Q2)
    NNNN-<kebab-slug>.md # one ADR per decision, contiguous numbering
  spec/                  # decisions+specs model only (see Q2)
    0000-template.md     # capability-spec template
    <kebab-slug>.md      # one living spec per capability, slug-identified
  domains/<slug>/README.md   # optional (see Q7)
  plan/
    README.md
    todo/NNNN-<slug>.md    # default scheme — a recorded convention wins
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

**Discovery.** Tools locate the artefact root without reading
`CONVENTIONS.md` first: a `.docflow/` **directory** at the repository
root *is* the root; for any other root, bootstrap writes a `.docflow`
**file** at the repository root — a one-line pointer, `root: <path>`
(e.g. `root: docs/`, `root: .`). Neither present means a pre-contract
repo (tools probe `docs/`, then the repository root, for a
`CONVENTIONS.md` naming an artefact root) or not a docflow repo.

**Capability manifest.** `docflow.yml` sits **inside** the resolved
artefact root — discovery finds the root; the manifest records the
repo's shape: contract `schema`, record `model`, enabled `layers`.
Tools read it instead of parsing `CONVENTIONS.md`; on disagreement the
manifest wins and the audit reports the divergence. A tool that meets a
`schema` newer than it understands refuses writes and says so; an
absent manifest means a pre-contract repo — behave as before.

**Core vs optional layers.** Only the **core** is always written:
`AGENTS.md`, `CLAUDE.md`, `CONVENTIONS.md`, `adr/0000-template.md`,
`INDEX.md`, and the capability manifest `docflow.yml`. A repo with just
these is a valid, lightweight docflow repo — a
classic ADR catalogue with conventions. Everything else is an **opt-in
layer**: the `plan/` queue (Q4a), the `_agent/` coordination set (Q5 —
choose *None* to omit it), `GLOSSARY.md`, `CONSTRAINTS.md`,
`goals/`, and `domains/` (Q7). Omitting any
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

   Which shape is `adr/0000-template.md` depends on the record model
   (Q2): capability-first uses the capability shape; two-shape uses
   both (capability at `0000`, technology at the cutoff); the
   decision-led models (`decisions+specs`, `decisions-only`) use the
   **decision shape** — the technology-ADR section order — as the
   single `0000` template, since every catalogue entry is a pure
   decision there.
3. **Status lifecycle:** `Proposed → Accepted → Implemented →
   (Superseded | Deprecated)`. Terminal states reachable from any prior
   state. Status drives plan-folder placement: `Accepted` →
   `plan/todo/`, `Implemented` → `plan/done/`.
4. **Filenames:** `adr/NNNN-kebab-slug.md`, zero-padded 4 digits,
   contiguous, no reserved gaps. Cross-references use relative paths.
5. **Acceptance criteria are testable, numbered, and verifiable.** Each
   criterion ends with a `Verify:` line naming how it is checked — an
   inline command, `gate-check` (the static gate covers it), or
   `manual` (a named human attests). The evidence rules live in
   `CONVENTIONS.md` §Verification Evidence.
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

## Step 4 — Assessment (depth-tiered; 10 questions at full depth, plus federation (Q11) and placement (Q12))

**Open with the depth selector — one single-select question before
anything else:** how deep should this assessment go?

- **express** — no further choices. Every choice takes the fixed
  express profile below. Only essentials with **no derivable default**
  are still asked: project name and one-line description — and even
  those are derived from the repo (README, manifest) when possible and
  only asked when underivable.
- **guided** *(recommend this for most repos)* — only the
  hard-to-reverse choices are asked: plan folder (Q4a), coordination
  mode (Q5), and integration model (Q4b — skipped if Q4a = skip), plus
  the underivable essentials. Everything else takes its recommended
  default.
- **full** — the complete question set below.

If the repo's `CONVENTIONS.md` already records an `Assessment depth:`
(a retrofit or re-run), pre-select **that** depth as the recommended
option instead. The selector always appears — a recorded depth steers
the recommendation and is never applied silently — with one narrow
exception: when the invocation already answers every question the
tiers differentiate, skip the selector and say so in one line (no
tiered question remains, so no recorded depth is being applied).

**Mid-flight switching.** At any question the operator may answer
"**defaults from here**" (remaining choices take their recommended
defaults, as in express) or "**go deeper**" (escalate express → guided
→ full for the remaining questions). Honour the switch immediately.

**Express profile.** An express bootstrap scaffolds the conservative
fixed profile — summarise it and get sign-off before writing anything:

- the **core only**: `AGENTS.md`, `CLAUDE.md`, `CONVENTIONS.md`,
  `adr/0000-template.md`, `INDEX.md`, `docflow.yml`, plus the seed ADR
  `0001` (Step 5 item 5b). All optional layers **off**: no `plan/`, no
  `_agent/`, no `GLOSSARY.md`, no `CONSTRAINTS.md`, no `goals/`, no
  `domains/`, no technology template.
- Default artefact root (`.docflow/`); **capability-first record
  model** (single shape); full status lifecycle.
- Git contract: Conventional Commits ON, `Rationale:` footer ON,
  signed commits ON, ADR-revision tags OFF, `Co-Authored-By` OFF.
- Integration recorded as **direct-to-main, fast-forward only**; the
  Multi-Agent Rules section records a **single writer** with no
  coordination directory.
- **Standalone** — never part of a federation.
- Doc language: match the existing repo's content, else en-US.
- No verify gate recorded (so no autonomous prompt); no
  domain-specific hard rules.
- Autonomy: the default grant `L2` recorded in the manifest
  (implement named items only; Q13 is never asked below full depth).

On an existing repo, express preserves and merges exactly as a full
run does — depth changes how many questions are asked, never how
destructive the run is.

**Guided defaults.** Beyond its three questions, guided takes: the
capability-first record model, full lifecycle, the recommended git
contract, optional
artefacts deferred, no hard rules, default artefact root, standalone,
autonomy at the default `L2`,
and the express language rule. Run the Step 4.5 cross-check on the
answers before the sign-off summary.

**Federation guard.** Express and guided runs are always
**standalone**: Q11 is never asked and no federation file is written.
Establishing or joining a multi-repo product is available at full
depth only — it is an outward-facing commitment no default may make.

**Record the choice.** Write the chosen depth into the scaffolded
`CONVENTIONS.md` (`Assessment depth:` line in §Project — see Step 5
item 1). Later assessments read it and pre-select it as the
recommendation.

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
2. **Record model.** Where does capability content live? Four options,
   recorded in the capability manifest (`model:`):
   - **(Default) capability-first** — capability records in the ADR
     catalogue, single shape. Today's behaviour, unchanged.
   - **two-shape** — capability + technology shapes in the catalogue.
   - **decisions+specs** — pure decision ADRs plus living
     `spec/<slug>.md` capability records (slug-identified, edited in
     place, criteria evidenced like ADR criteria).
   - **decisions-only** — pure decision ADRs; capability content is
     managed outside this repo. Choose only when a real external
     system owns it.

   **Recommendation by scale:** capability-first for a small repo with
   a few long-lived capabilities (the light path stays light);
   **decisions+specs for a product repo with many living
   requirements** — capability growth becomes an edit with a revision
   row, not a lifecycle round-trip.
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
   - **`CONSTRAINTS.md`** — enumerated inviolable boundaries, each
     decision-gated (see the conventions §Constraints). *Defer; the
     convention skill creates it when the first boundary-shaped rule
     arrives, requiring its authorising decision record.*
   - **`goals/`** — the repo's 3–7 active goals, one file each, the
     top of the traceability chain (see the conventions §Goals).
     *Defer unless the operator wants the repo's "why" recorded from
     day one; the brainstorm skill writes goal files once the layer
     exists, and offers to enable it when an approved outcome-class
     candidate arrives without it.*
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

13. **Autonomy level** *(full depth only — express and guided record
    the default silently)*. How much may an agent initiate
    **unattended**? Recorded in the manifest (`autonomy: L0`–`L5`;
    see the conventions §Autonomy — attended operation is unaffected
    at every level, and the eight escalation triggers bind at all of
    them). **Recommended: `L2`** — implement only queued items a
    human explicitly named; the conservative grant whose only
    prerequisite is the verify gate. Offer the ladder: L0
    read/propose · L1 author records · L2 named items · L3
    self-serve the queue · L4 specify + queue + implement from an
    agreed AC-bearing record (needs the constraints layer) · L5
    decisions + waves within a budget (needs the full stack).

## Step 4.5 — Cross-check before sign-off

After all answers are in, scan for contradictions before writing the
plan summary. Surface each, take the correction, then proceed. (An
express run is internally consistent by construction and skips this
check; guided and full runs, and any run that switched tiers
mid-flight, get the full scan.)

- **Q5 mode 3 (worktrees) + Q4b direct-to-main.** Unusual but
  legitimate: each worktree rebases onto main before fast-forwarding,
  and the concurrency guardrails (G1–G4) carry the coordination load
  PRs would otherwise provide. Confirm the pair is deliberate and
  that the guardrails section is being written; recommend switching
  to PR-based only when it is not.
- **Q4a plan-folder skipped + Q8 autonomous prompt expected.** The
  autonomous prompt walks `plan/todo/`; with no plan folder it has
  nothing to drive. Do not write the autonomous prompt.
- **Q13 `L2`+ with no real verify gate (Q8).** An unattended
  implementation grant with nothing to hold it to account — resolve
  by naming a gate or dropping to `L1`.
- **Q13 `L4`+ without the constraints layer (Q7).** Unattended
  specification with no recorded boundaries is the unsafe
  combination the ladder's prerequisites exist to prevent — enable
  the constraints layer or cap at `L3`.
- **Q8 has no real verify gate + Q4b PR-based with required CI.**
  "Required CI green" needs a CI gate. Confirm what the CI actually
  runs, or downgrade the completion event.
- **Q2 capability-first + Q7 technology-ADR template requested.**
  Contradiction — the split is the two-shape model; pick one.
- **Q2 not `decisions+specs` + spec artefacts requested.**
  Contradiction — specs exist only on that model; pick one.
- **Q2 `decisions-only` + Q4a plan folder enabled.** Legitimate but
  worth confirming: with no capability records in the repo, plan-item
  exit criteria must cite the external system that owns them — confirm
  the operator knows where "done" is defined.
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
`.docflow/INDEX.md`. Record the chosen root **and the chosen assessment
depth** in `CONVENTIONS.md` so every lifecycle skill resolves paths
against the root and later assessments pre-select the recorded depth,
and adjust the `adr/`/`plan/` cross-paths in the filled `AGENTS.md` (and
other templates) to the chosen root (e.g. `.docflow/adr/`).

**Discovery pointer.** If the chosen root is anything other than
`.docflow/`, also write a `.docflow` file at the repository root
containing the single line `root: <path>` (`root: docs/`, `root: .`) —
the marker external tools use to find the catalogue. Do **not** write
it when the root is `.docflow/` (the directory itself is the marker).
Keep the pointer in sync if a later re-run migrates the root.

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
4. `adr/0000-template.md` — from `templates/adr-capability.md` on the
   capability-first and two-shape models; from
   `templates/adr-technology.md` (the decision shape) on
   `decisions+specs` and `decisions-only`.
5. `adr/NNNN-template.md` — from `templates/adr-technology.md`, only on
   the two-shape model. `NNNN` is the number where capability ADRs end
   (project-defined, e.g. 0091; default 0100 if unspecified).
5b. **Seed ADR (default on; opt-out at sign-off).** Write the seed
   `adr/0001-record-architecture-decisions.md` from
   `templates/adr-0001-seed.md`, filled from the assessment answers — it
   records the **decision to adopt** the documentation-led, ADR-driven
   method, status **`Implemented`**, and **references `CONVENTIONS.md`** for
   the rules (it does not duplicate them). Keep it generic — no other
   project's ADR numbers. **Skip only if the operator opted out.** On the
   **two-shape** and **decision-led** models (Q2) use the
   technology/decision shape for the seed. If `plan/`
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
12b. `docflow.yml` — from `templates/docflow.yml`, at the **artefact
    root**, at **every** depth tier. Fill `model` (`capability-first` |
    `two-shape` | `decisions+specs` | `decisions-only`, per Q2) and
    `layers` (the subset of
    `plan`, `agent`, `glossary`, `constraints`, `goals`, `domains`,
    `federation`
    actually enabled — empty for an express run). Fill `autonomy`
    per Q13 (`L0`–`L5`; express and guided record the default `L2`).
12c. `CONSTRAINTS.md` — from `templates/CONSTRAINTS.md`, at the
    artefact root, **only if Q7 chose the constraints layer**. Written
    with the header and format comment only — entries arrive later via
    the convention skill, each with its authorising decision record.
12d. **Spec artefacts — only on the `decisions+specs` model:** write
    `spec/0000-template.md` from `templates/spec.md` (the copy the
    spec-authoring skill acts on) and leave `spec/` otherwise empty;
    uncomment the Capability Specs section in the scaffolded
    `CONVENTIONS.md` (item 1). The other three models write **no**
    spec artefacts.
12e. **Goals layer — only if Q7 chose it:** write
    `goals/G-template.md` from `templates/goal.md` (the copy the
    brainstorm skill copies per goal) and leave `goals/` otherwise
    empty — goal files arrive via the brainstorm skill on operator
    approval, each with an `INDEX.md` Goals-section row. Uncomment
    the §Goals section in the scaffolded `CONVENTIONS.md` (item 1).
    `COVERAGE.md` is not scaffolded — it is generated once the first
    goal and serving record exist.
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

**Tier the offer by the assessment depth.** At **full**, make the
offer as phrased below. At **guided**, ask it as one brief yes/no
("Backfill decision records from the existing history? I'll propose
drafts for approval."). At **express**, do not run it now — close
with a one-line pointer instead: undocumented history can be captured
later by re-running this skill.

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

## Migration path — changing the record model

The **only sanctioned way** the manifest's `model:` changes. A re-run
**never converts** the model; this path runs only when the operator
explicitly asks to migrate ("migrate the record model", "convert the
catalogue to specs"). Operator-gated throughout — full depth, no
tiers, and a **per-record approval**: tooling proposes, the operator
decides every move.

1. **Classify the whole catalogue first.** Every record gets one of
   four classes, presented as a table the operator approves row by
   row before anything moves:
   - **decision-stays** — a pure decision; byte-untouched.
   - **reclassify** — capability content in decision clothing; moves
     to `spec/`.
   - **split** — a mixed record; the decision core stays with a
     pointer, the capability content moves.
   - **terminal** — Superseded / Deprecated / Withdrawn; untouched by
     definition.
2. **Wave discipline.** Unevidenced records move in wave one.
   Records with bound evidence move only in a later wave, under the
   rebinding rule below — and stopping after wave one indefinitely
   is a valid end state (mixed records are legal), not a failure.
3. **Mechanics — reclassify:** `git mv adr/NNNN-<slug>.md
   spec/<slug>.md`; rewrite front matter to spec form (`id:` =
   slug, `status:`, `decided-by:` naming the authorising decisions,
   `constrained-by:`/`serves:` where they apply) plus
   **`migrated-from: adr/NNNN-<slug>.md`**; append one revision row —
   "reclassified as a capability spec; content unchanged". **This is
   not supersession**: the decision behind the record still stands;
   nothing flips to Superseded, and criteria are **not reworded** (an
   edit during migration invalidates evidence exactly as any edit
   does — visibly).
4. **Mechanics — split:** the capability content and criteria move
   to a new `spec/<slug>.md` carrying `migrated-from:`; the decision
   core stays in place, trimmed, with a `specified-by:` pointer and
   its own revision row.
5. **`MIGRATION.md`** at the artefact root: one row per moved record,
   old path → new home. Every numbering gap the moves leave must be
   accounted for here — contiguity relaxes to **no-duplicates** only
   for accounted gaps; an unaccounted gap is still a failure.
   Historical references resolve through this mapping forever.
6. **Evidence — the rebinding rule.** Evidence records and their
   directories are **never edited, moved, or rewritten**. The moved
   record's `migrated-from:` is the link: pre-move criteria resolve
   their evidence under the old slug's directory; evidence produced
   after the move binds under the new identity.
7. **Close the migration:** regenerate `INDEX.md` (the Specs section
   gains the moved records), flip the manifest `model:` — inside the
   migration, its one sanctioned change — update the conventions'
   shape sections, and commit the chain with the migration named.
   Run the repo's audit as the final check.
