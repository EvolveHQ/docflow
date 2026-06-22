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

**C11 — Enforcement by audit.** None of the above is left to goodwill; an
audit routine checks it mechanically.

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

States: `Proposed`, `Accepted`, `Implemented`, `Superseded`, `Deprecated`.

| From | To | Guard (MUST hold to transition) |
|---|---|---|
| Proposed | Accepted | Open questions resolved (section empty); Approvals populated. |
| Accepted | Implemented | The owning plan item(s) reached the completion event. In a federation, **every** per-repo plan item shipped. |
| any non-terminal | Superseded | A successor ADR exists and the `supersedes`/`superseded-by` links are set symmetrically. |
| any non-terminal | Deprecated | The decision is retired with no successor. |

`Superseded` and `Deprecated` are terminal and reachable from any prior
state. There are no other transitions; an audit MUST flag any `status`
outside this set or any transition lacking its guard.

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
- The audit extends across repositories: membership, identity collisions,
  dangling references, and roll-up drift are all checked.
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

See the [examples](/examples/) for the method applied, or the
[source on GitHub](https://github.com/EvolveHQ/docflow).
