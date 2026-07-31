---
title: Methodology
layout: default
permalink: /methodology/
---

# The docflow methodology

A formal definition of the documentation-led, ADR-driven method that
docflow installs and maintains — the artefacts, the conventions that
govern them, a normative specification precise enough to implement against,
why the method is useful, and where it is weak.

## 1. Definition

**docflow** is a **documentation-led, ADR-driven** way of running a
repository. Every consequential decision is recorded as an **Architecture
Decision Record (ADR)** — a small, numbered, immutable-by-default document
that states one decision, why it was made, and how to tell whether the
system actually satisfies it. The ADR catalogue is the **source of
truth**: code is written to match the ADRs, not the other way round, and
the running system is expected to conform to its ADRs.

The method constrains **form and lifecycle, never content**. An ADR body is
free-form prose under a fixed skeleton, so the same machinery records a
regulatory control, a training-module decision, a software-architecture
choice, a brownfield retrofit, or a firmware timing constraint without
modification. It has been applied in production across regulated
compliance, training-material authoring, application tooling (an
issue-tracker), brownfield retrofits of existing services and apps, and
embedded firmware (see §6).

The method is deliberately small. It is a set of canonical files plus a
handful of rules strict enough that both a human and a coding agent can
pick up a cold repository and act correctly with no oral handover.

## 2. The artefacts

| Artefact | Role |
|---|---|
| `adr/NNNN-<slug>.md` | One decision per file, contiguously numbered. The catalogue. |
| `INDEX.md` | A table **regenerated** from ADR metadata. Derived, never hand-edited. |
| `plan/todo/` · `plan/done/` | The work queue. Pending items move to done on completion. |
| `CONVENTIONS.md` | The authoring rules every contributor reads first. |
| `AGENTS.md` (+ `CLAUDE.md`) | The hard-rules entry point coding agents load. |
| `_agent/` | Coordination state — roles, work log, live snapshot, hand-off. |
| `docflow.yml` | The **capability manifest** — machine-readable repo shape (contract schema, record model, enabled layers). *(in development)* |
| `CONSTRAINTS.md` | The enumerated **inviolable boundaries**; every change decision-gated. *(optional layer; in development)* |
| `spec/<slug>.md` | **Living capability specs** on the decisions+specs record model — slug-identified, edited in place. *(in development)* |
| `evidence/<record>/AC<n>-<seq>.md` | **Bound verification evidence** — append-only proof per acceptance criterion. *(in development)* |

## 3. The conventions

**C1 — One decision per ADR.** An ADR captures exactly one decision. When
a decision splits or changes, you **supersede** the original with a new
ADR rather than expanding the old one.

**C2 — A fixed shape.** ADRs follow a fixed section order, so they are
scannable and machine-checkable (§4.3).

**C3 — A status lifecycle.** Every ADR moves through a defined state
machine (§4.4). Status is not decorative: it **drives the work queue**.

**C4 — Testable, numbered acceptance criteria.** Each ADR states numbered,
observable criteria. "Done" means the criteria hold — not that code was
written.

**C5 — Contiguous identity.** ADRs are numbered contiguously with no gaps
and no reuse, so the number is a stable, citable key.

**C6 — Derived indices.** Anything derived (`INDEX.md`, a roll-up) is
treated as derived — regenerated, never the source of truth.

**C7 — The plan queue is the ledger of work.** A unit of work is queued
*before* it starts, naming its owning ADR(s), scope, and exit criteria.

**C8 — Audit trail and approvals.** Substantive ADR changes append a
Revision History row; an Approvals table is populated when an ADR is
accepted.

**C9 — ADRs are internal.** ADR numbers, titles, and the existence of the
catalogue never appear in any surface an end user sees.

**C10 — An explicit git contract.** Conventional Commits, a mandatory
rationale footer on ADR-touching changes, and one declared integration
model so "shipped" is unambiguous.

**C11 — Drift made visible by audit.** None of the above is left to
memory: an audit routine checks it mechanically and surfaces every
violation. The controls are cooperative — they detect and report, they
do not prevent a writer from bypassing them; repos needing prevention
add host-level enforcement (CI-required checks, branch protection) on
top.

## 4. Normative specification

This section is the precise definition. It uses the keywords **MUST**,
**MUST NOT**, **SHOULD**, and **MAY** in the sense of RFC 2119: MUST is a
hard requirement an audit can fail; SHOULD is a strong default a team may
override with a recorded reason; MAY is optional.

### 4.1 Defined terms

- **ADR** — a single Markdown file recording one **decision**, with the
  metadata and sections defined in §4.3.
- **Decision** — a choice about what the system must do (a *capability*) or
  how it is built (a *technology* choice) that is costly to reverse or that
  others must build against.
- **Acceptance criterion** — a numbered, observable statement that is true
  or false of the running system; the unit against which "done" is judged.
- **Completion event** — the single, repository-defined moment a unit of
  work is considered shipped (e.g. fast-forwarded to the main line and
  pushed, or a pull request merged with required checks green).
- **Catalogue** — the set of ADR files in a repository.
- **Plan queue** — `plan/todo/` (pending) and `plan/done/` (shipped).
- **Federation** — a set of repositories forming one product (§5).
- **Member** / **Home** — a repository in a federation; the home holds the
  authoritative member index.
- **Federation identity** — the cross-repository key for an ADR (by default
  a repository-prefixed slug).
- **Roll-up** — a derived, product-wide aggregate of every member's
  catalogue.
- **Drift** — a divergence between a derived or copied artefact and its
  source.

### 4.2 Conformance

A repository **conforms** when every applicable invariant in §4.5 holds and
its audit reports clean. An ADR **conforms** when it carries the metadata
and sections of §4.3 and its status is reachable in the §4.4 state machine.
A tool implementing the method MUST refuse to mark a unit of work complete
unless its owning ADR's acceptance criteria are met.

### 4.3 The ADR record — schema

Each ADR is a Markdown file named `NNNN-<kebab-slug>.md` (`NNNN`
zero-padded to four digits) with a frontmatter block and a fixed body.

Frontmatter fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `adr` | integer | MUST | The number; MUST equal the filename's `NNNN`. |
| `title` | string | MUST | Sentence-case decision title. |
| `status` | enum | MUST | One of the §4.4 states. |
| `date` | ISO date | MUST | Authoring date. |
| `owner` | string | MUST | Accountable agent or human. |
| `supersedes` | id / empty | MAY | ADR(s) this replaces. |
| `superseded-by` | id / empty | MAY | ADR that replaced this one. |
| `depends-on` | list of ids | SHOULD | ADRs this decision builds on. |
| `tags` | list | MAY | Free-form classification. |

Body — a **capability** ADR MUST contain these sections in order: Context
→ Capability statement → User stories / scenarios → Acceptance criteria →
Out of scope → Open questions → References → Revision History → Approvals.
A **technology** ADR replaces "Capability statement / User stories" with
"Decision → Rationale → Consequences", and its Rationale MUST name the
alternatives considered with specific rejection reasons. Acceptance
criteria MUST be numbered and testable (§4.5 INV-4).

### 4.4 Status — the state machine

States: `Proposed`, `Accepted`, `Implemented`, `Superseded`,
`Deprecated`, `Withdrawn`.

| From | To | Guard (MUST hold to transition) |
|---|---|---|
| Proposed | Accepted | Open questions resolved (section empty); Approvals populated. |
| Proposed | Withdrawn | The proposal was considered and turned down; the reason is recorded. The file is kept — deletion is not a transition. |
| Accepted | Implemented | The owning plan item(s) reached the completion event — in an evidence-adopting repository, additionally every current acceptance criterion carries valid bound evidence (§4.12). In a federation, **every** per-repo plan item shipped. |
| Accepted / Implemented | Superseded | A successor record exists **at `Accepted` or beyond** and the `supersedes`/`superseded-by` links are set symmetrically. A merely-proposed successor MUST NOT flip its predecessor. |
| Accepted / Implemented | Deprecated | The decision is retired with no successor. |

Exits are sharpened by state: from `Proposed` the only exits are
`Accepted` and `Withdrawn`; `Superseded` and `Deprecated` are reachable
from `Accepted` and `Implemented`. All of `Superseded`, `Deprecated`,
and `Withdrawn` are terminal. Where two transitions could apply at
once, a deliberate terminal transition takes precedence over an
automatic progress transition; residual ambiguity is reported for a
human, never auto-resolved. There are no other transitions; an audit
MUST flag any `status` outside this set or any transition lacking its
guard.

### 4.5 Invariants

- **INV-1 (numbering).** Within a repository, ADR numbers MUST be
  contiguous from `0001` with no gaps and no reuse.
- **INV-2 (derived indices).** `INDEX.md` and any roll-up MUST be
  regenerable from ADR metadata and MUST NOT be the source of truth.
- **INV-3 (status–queue coherence).** An `Accepted` ADR MUST have a
  `plan/todo/` item; an `Implemented` ADR MUST have a `plan/done/` entry.
- **INV-4 (criteria).** Acceptance criteria MUST be numbered and stated as
  observable true/false conditions of the running system.
- **INV-5 (supersession symmetry).** `supersedes` and `superseded-by` MUST
  reference each other.
- **INV-6 (audit trail).** A substantive change to an accepted ADR MUST
  append a Revision History row; editorial changes are excluded but MUST
  be flagged as such in the commit.
- **INV-7 (privacy).** ADR identifiers MUST NOT appear in any user-visible
  surface.
- **INV-8 (singularity).** An ADR MUST record exactly one decision.
- **INV-9 (federation identity).** Across a federation, every ADR's
  federation identity MUST be unique while local numbering stays per-repo
  contiguous (INV-1 applied per repository).
- **INV-10 (no cross-boundary writes).** A repository's tooling MUST write
  only within that repository; federation membership is declared at the
  edges and reconciled by audit, never by remote write.
- **INV-11 (manifest authority).** *(in development)* Where a capability
  manifest exists, tools MUST read the repository's shape from it; on
  disagreement between the manifest and prose the manifest wins and the
  divergence is an audit finding.
- **INV-12 (evidence validity).** *(in development)* In an
  evidence-adopting repository, a record's `Implemented` status is
  valid only while every current acceptance criterion's content digest
  has a matching valid evidence record; the status line is a
  projection, never a proof.
- **INV-13 (constraint gating).** *(in development)* Every transition
  of a constraint entry — creation, scope revision, removal — MUST be
  authorised by a human-accepted decision record. Constraints have no
  severity; a rule that may bend is a convention.
- **INV-14 (recorded abandonment).** *(in development)* Deliberate
  abandonment is a recorded terminal state — `Withdrawn` for
  proposals, a reasoned move to `dropped/` for queue items — never a
  deletion. A dropped item leaves the owning aggregate and satisfies
  no coverage.
- **INV-15 (slug immutability).** *(in development)* A capability
  spec's slug is immutable once the spec is `Agreed`; renaming means
  retiring and creating anew.

### 4.6 Numbering at scale, and alternatives considered

The identifier is an **integer**, rendered four-digit zero-padded by
convention. Tooling sorts ADRs **numerically**, not lexically, so a
catalogue is not capped at `9999`: widen the padding to five digits if a
repository ever approaches it (none in practice does). The padding is
cosmetic; the integer is the identity.

Two richer identifier schemes are deliberately **not** the default:

- **Timestamp / opaque ids** (e.g. a reverse date-time) make concurrent
  creation collision-free with no coordination — but they sacrifice the
  at-a-glance ordering and the short, citable key that make a contiguous
  number useful, and they break the lightweight-ADR convention every reader
  and tool expects. A creation-time clash is treated as a **coordination**
  problem and closed by the numbering guardrails (decide-before-do,
  check-before-merge, a merge-gate backstop, and claim-before-do) rather
  than by disfiguring the key. A team that genuinely prefers
  zero-coordination ids may select a non-sequential scheme as its
  **federation identity** (§5); the per-repository default stays contiguous.
- **Domain-namespaced ids** (e.g. `auth/0001`, `billing/0001`, each area
  numbering independently) are not used *within* a repository — they would
  re-create the federation's cross-boundary questions at a smaller scale for
  little gain. Independent sequences are instead served by the
  **federation** (one repository per area, each contiguous, joined by a
  federation identity); in-repo organisation is handled by grouping (§4.7).

### 4.7 Grouping ADRs by domain

A repository may add `domains/<slug>/README.md` files (e.g. `domains/auth/`,
`domains/billing/`) — each a **curated index of the ADRs belonging to one
area**. It is an **optional but first-class** organisational layer: a
*navigation view* over the single flat catalogue, enabled when a repository
spans distinct areas or its numbered list grows large enough to be hard to
scan.

The grouping is **organisational only**. An ADR keeps its flat contiguous
number and its `INDEX.md` row; a domain README never renames, renumbers, or
namespaces — the number stays the single identity. `new-adr` maintains the
grouping: it records each new ADR under its owning domain's README and
offers to create `domains/<slug>/README.md` when an ADR is filed under a
domain that does not exist yet.

Two adjacent mechanisms are deliberately distinct: it is **not per-domain
numbering** (`auth/0001`, `billing/0001`) — rejected in §4.6; identity stays
the flat number — and it is **not the federation** (§5), which serves
genuinely independent sequences across separate repositories. Domain
grouping is one repository's one catalogue, viewed by area.

### 4.8 Capturing work done outside the process

The model assumes decisions are recorded as ADRs and work is queued as plan
items — but real development sometimes runs ahead of the process: a **large
development lands with no ADR and no plan**, recorded only in version
control. The method's answer is **reconstruction, not exception**: such a
development is treated as an ADR *not yet written*. It is captured the same
way an existing codebase is adopted (§ backfill) — recover the decision(s)
it embodies as ADR(s) drafted at **`Implemented`**, each Revision History
row citing the implementing commits and noting it was recorded **after the
fact**, with matching `plan/done` entries so the Implemented⇒plan-coverage
invariant (INV-3) holds. The audit carries a **coverage** check — a
deliberately conservative, doc-centric heuristic — that flags substantial
behaviour with no owning ADR, so an escaped development is surfaced for
capture rather than silently accumulating. Trivial or mechanical changes are
*not* in scope here: they belong to the commit history (and the worklog),
not the catalogue.

### 4.9 Artefact placement and discovery

The catalogue's location is **configurable**: the non-entry artefacts
(`adr/`, `plan/`, `INDEX.md`, `CONVENTIONS.md`, coordination files) live
under an **artefact root** chosen at set-up — a hidden `.docflow/`
directory (the default), `docs/`, or the repository root — recorded in
`CONVENTIONS.md`. The agent entry points (`AGENTS.md`, `CLAUDE.md`)
always stay at the repository root. This preserves each team's placement
preference; but the record naming the root lives *under* the root, so a
record alone cannot bootstrap discovery from outside.

External tools therefore resolve the root by a normative three-step
precedence, checked at the repository root (the same
directory-or-pointer-file pattern git uses for `.git`):

1. A `.docflow/` **directory** *is* the artefact root — the default
   layout marks itself.
2. A `.docflow` **file** is a one-line pointer, `root: <path>` relative
   to the repository root (`root: docs/`, `root: .`), written at set-up
   whenever a non-default root is chosen.
3. Neither present: probe `docs/`, then the repository root, for a
   `CONVENTIONS.md` carrying an artefact-root record (pre-contract
   repositories); nothing found means the repository does not follow
   the method.

The pointer and the `CONVENTIONS.md` record must agree — a disagreement,
or a pointer redundantly naming `.docflow/`, is an audit finding.
Federation artefacts (§5) live at the artefact root, so the same
resolution discovers a repository's federation membership. One check
suffices for a conforming repository, which is what makes read-only
tooling over arbitrary repositories practical.

### 4.10 The capability manifest

*(This and the following sections describe the verified tier — on
`main`, in development beyond the released 0.9.4.)*

`docflow.yml` at the artefact root is the machine-readable record of
the repository's docflow shape: `schema` (contract version), `model`
(record model), `layers` (enabled optional layers), and — where
adopted — `evidence-adopted-at` (the evidence adoption commit). A tool
that meets a `schema` newer than it understands MUST refuse writes and
say so; an absent manifest means a pre-contract repository and prior
behaviour applies unchanged. Re-running the bootstrap never rewrites
the recorded model (§4.14).

### 4.11 Trust posture

The conventions, the audit, and any verify gate are **cooperative**
controls: they catch honest mistakes and structural drift, and they
make skipped steps visible. They do not authenticate authorship, and a
local check is sidestepped by a direct edit. Two rules follow.
**Declarations are projections** — a `status:` line records what an
author asserted; where the declared state and the state the
repository's contents support disagree, the contents win and the audit
reports the divergence. **Stronger guarantees are a hosting concern** —
a repository needing tamper resistance runs the gate as a required CI
check, protects the integration branch, and restricts write access to
every path the gate reads (records, constraints, verification inputs,
and the gate's own code). Detection, not prevention, is the honest
claim; the hosting recipe upgrades it where required.

### 4.12 Verification evidence

Each acceptance criterion names its **verification method** on a
trailing `Verify:` line — an inline command, `gate-check` (the static
gate covers it), or `manual` (a named human attests). Verification
produces **bound evidence records**: append-only files under
`evidence/<record-slug>/AC<n>-<seq>.md`, written by the shipping
tooling from the method's execution transcript, each binding the
criterion's content digest (its normalised text, including the
`Verify:` line), the method and command, the source commit, the exit
code and output digest, the verifier (the executor role, marked
`(attended)` when an operator supervised the run, or the named human
for a manual attestation), and the date. Corrections are
new records naming what they supersede; existing records are never
edited. Manual evidence MUST name a verifier who is not the
implementer; the audit reports the manual-verification ratio —
reported, not gated. Re-running a method to check a *record* executes
at the record's source commit; checking *current satisfaction*
executes at HEAD; divergence is a finding for a human, and evidence
history is never auto-invalidated. Adoption is computed against the
manifest's adoption commit — records last substantively edited before
it are exempt until edited. The adopting record itself is in scope:
its evidence runs at its implementation commit like any other; the
adoption commit defines the scope boundary, not a special execution
point. Field keys and enumerated values in records and manifests are
machine identifiers, locale-invariant — a repository's language
mandate governs prose only.

### 4.13 Constraints

A repository's inviolable boundaries are enumerated in
`CONSTRAINTS.md` — one `CON-<n> r<n>` entry per constraint, each with a
provenance (`chosen`, `imposed`, or `learned`), a state (`Active` or
`Removed`), the authorising decision record, a statement, and a check
hint. Constraints are **absolute** — there is no severity. Every
transition is decision-gated (INV-13); removal is permanent, and
reintroduction is a new id under a fresh decision. The file is small
by design: its value is that an agent loads it in full before any
task.

### 4.14 Record models and capability specs

Where capability content lives is a bootstrap choice recorded in the
manifest: **capability-first** (capability records in the ADR
catalogue — the default), **two-shape** (capability + technology
shapes), **decisions+specs** (pure decision ADRs plus living
`spec/<slug>.md` records), or **decisions-only** (pure decisions;
capability content owned by an external system). The honest
recommendation is scale-dependent: capability-first for a small
repository with few long-lived capabilities; decisions+specs for a
product repository with many living requirements, where capability
growth becomes an edit with a revision row instead of a lifecycle
round-trip. A capability spec is slug-identified (INV-15), edited in
place, and carries the living lifecycle `Draft → Agreed → Implemented
→ Retired`: `Agreed` is a human gate requiring at least one criterion,
each with its method; `Implemented` is a projection under INV-12;
`Retired` records the state it left so never-delivered and
delivered-then-removed stay distinguishable. Its criteria and evidence
work identically to decision records. A re-run of the bootstrap never
converts a repository's model — migration is a separate, deliberate
path.

### 4.15 The goals layer

Goals are the top of the traceability chain — the recorded "why"
above every record. The layer is opt-in: a single `GOALS.md` at the
artefact root, small enough to load in full, guiding 3–7 `Active`
goals. Each entry carries a stable id (`G-<kebab-slug>`, immutable,
never reused), a statement, a **measure** (a goal that cannot name
one can never be validated), a horizon, a `review-by:` date, and a
state (`Active | Achieved | Retired` — terminal entries stay; removal
is by state, never deletion). AC-bearing records — capability ADRs
and specs alike — name the goals they advance in `serves:` front
matter; every id must resolve. `COVERAGE.md` is the generated walk
goal → serving record → criteria evidence state → plan items,
maintained like the index. Entries are written by the decomposition
skill on operator approval — a goal is discovered in decomposition,
not dictated by category first. The audit reports, never edits: an
Active goal nothing serves is an aspiration; a goal without a measure
is unvalidatable; a dangling `serves:` id is a broken edge; growth
past the cap is a signal, not a gate. Acting on the measure — outcome
records and validation cycles — is a later tier of the method.

## 5. Scaling to many repositories

A single product spread across several repositories runs as a
**federation**, applying §4 unchanged:

- A repository declares, at set-up, whether it is **standalone** or part of
  a **multi-repo product**, and if so whether it is **establishing** a
  federation or **joining** one. A joining repository writes only its own
  back-pointer (INV-10).
- **Topology** is an explicit choice: a central decisions repository, a
  fully distributed set, or a home repository with local decisions
  alongside.
- Numbering stays contiguous **per repository** (INV-1); the **federation
  identity** (INV-9) is the cross-repository key.
- Cross-repository references resolve through a **member index** and
  survive a repository move; same-repository links stay relative.
- A **roll-up** aggregates every member's catalogue into one derived view,
  tolerant of members that are not checked out.
- **Work and status flow across repositories too.** A cross-repository
  decision is **one plan item per affected repository**, each tracing to the
  owning ADR by its federation identity (no umbrella record). The decision's
  **aggregate status** — *"2 of 3 repositories"* — is a derived roll-up
  column, reaching `Implemented` only when every per-repository plan item has
  shipped under its own completion event.
- The audit extends across repositories: membership, identity collisions,
  dangling references, roll-up drift, and convention drift are all checked.
- Shared conventions are **copied at set-up** and kept honest by
  drift-detection in the audit — referenceable from one source, never
  force-pushed (INV-10).

The federation rules are one principle applied repeatedly: **no tool writes
across a repository boundary; consistency is declared at the edges and
enforced by audit, not by remote control.**

## 6. Domain independence

Because the method fixes *form and lifecycle* but never *content* (§1), the
same primitives carry very different subject matter. The ADR body is prose;
domain-specific rigour is added as **optional hard rules** layered on top
(for example a regulated-evidence posture — attribution, retention,
e-signatures — or a mandatory persona set), leaving the core untouched.

It has been used successfully across:

- **Regulated compliance** — controls and their evidence recorded as
  numbered, auditable decisions with an explicit revision and approval
  trail.
- **Training-material authoring** — curriculum and module decisions tracked
  the same way as engineering ones.
- **Application tooling** — building an issue-tracker, where product
  capabilities and technology choices coexist in one catalogue.
- **Brownfield retrofits** — backfitting existing services and apps, where
  the catalogue is reconstructed from code and history rather than written
  ahead of it.
- **Embedded firmware** — hardware and timing constraints captured as
  testable acceptance criteria.

The breadth is the point: the method is a *container* for decisions, not a
template for any one kind of system.

## 7. Why it is useful

- **No oral tradition.** The reasons behind the system are written down,
  uniform, and discoverable. A new contributor — human or agent — onboards
  from the files alone.
- **Decisions and work are linked.** One identity threads an ADR, its queue
  item, and the commit that ships it.
- **Agent-ready by construction.** The rules are explicit and
  machine-checkable, so coding agents act correctly and an audit catches
  them when they do not.
- **Auditable history.** Supersession, revision rows, and approvals make
  the evolution of a decision legible long after the fact.
- **Resists rot.** Derived indices, a status-driven queue, and an
  enforcement audit make drift visible instead of letting it accumulate.
- **Scales without a rewrite.** The same primitives extend from one
  repository to a federation.

## 8. Weaknesses and limits

An honest method states where it costs more than it returns.

- **Ceremony has a floor.** Numbered records, status transitions, revision
  rows, and queue moves are overhead. For a throwaway script or a spike the
  method costs more than it returns.
- **Discipline is load-bearing.** The audit catches mechanical drift but
  cannot tell a thoughtful ADR from a hollow one. Rubber-stamped ADRs give
  false confidence.
- **Granularity is a judgement call.** "One decision per ADR" has no crisp
  boundary; teams must calibrate and will disagree.
- **Numbering contends under parallelism.** Contiguous numbers are a shared
  resource; concurrent branches can claim the same next number. Guardrails
  mitigate but do not remove the friction.
- **The catalogue can lag reality.** ADRs are the intended spec; nothing
  physically prevents code from diverging. The method *surfaces* divergence
  through audit and review but cannot *prevent* it.
- **Privacy is a manual contract.** The audit greps for ADR-identifier
  leaks, but pattern-matching is not proof.
- **Federation consistency is eventual, not enforced.** Because no tool
  writes across repositories (INV-10), a member can drift or fall out of
  the index until an audit runs — autonomy and a smaller blast radius
  traded for hard enforcement.
- **Tooling assumes local availability.** Cross-repository roll-up and
  audit read members from local checkouts; absent members are reported as
  unverified, not checked.

## 9. Lineage

The method is a strict, operationalised descendant of the classic
lightweight ADR (Michael Nygard, 2011; the `doc/adr` convention
popularised by Martin Fowler and the ADR community). It keeps the core
idea — short, immutable, numbered decision records — and adds the parts a
running, agent-driven, possibly multi-repository project needs: a
status-driven work queue, an enforcement audit, an explicit privacy
boundary, and a federation model.

---

See the [examples]({{ '/examples/' | relative_url }}) for the method applied, or the
[source on GitHub](https://github.com/EvolveHQ/docflow).
