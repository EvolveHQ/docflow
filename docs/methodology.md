---
title: Methodology
layout: default
permalink: /methodology/
---

# The docflow methodology

A formal definition of the documentation-led, ADR-driven method that
docflow installs and maintains — the artefacts, the conventions that
govern them, why the method is useful, and where it is weak.

## 1. Definition

**docflow** is a **documentation-led, ADR-driven** way of running a
repository. Every consequential decision is recorded as an **Architecture
Decision Record (ADR)** — a small, numbered, immutable-by-default document
that states one decision, why it was made, and how to tell whether the
system actually satisfies it. The ADR catalogue is the **source of
truth**: code is written to match the ADRs, not the other way round, and
the running system is expected to conform to its ADRs.

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

## 3. The conventions, formally

**C1 — One decision per ADR.** An ADR captures exactly one decision. When
a decision splits or changes, you **supersede** the original with a new
ADR rather than expanding the old one. ADRs are therefore append-only at
the catalogue level: history is preserved, not rewritten.

**C2 — A fixed shape.** A capability ADR has a fixed section order:
Context → Capability statement → User stories / scenarios → Acceptance
criteria → Out of scope → Open questions → References → Revision History →
Approvals. The uniform shape makes ADRs scannable and machine-checkable.

**C3 — A status lifecycle.** Every ADR moves through
`Proposed → Accepted → Implemented`, with `Superseded` and `Deprecated`
reachable as terminal states. Status is not decorative: it **drives the
work queue**. An `Accepted` ADR has a `plan/todo/` item; an `Implemented`
ADR has a `plan/done/` entry. The catalogue and the queue cannot quietly
disagree.

**C4 — Testable, numbered acceptance criteria.** Each ADR states numbered,
observable criteria. They are the contract: tests and reviews map back to
them, and "done" means the criteria hold — not that code was written.

**C5 — Contiguous identity.** ADRs are numbered contiguously with no gaps
and no reuse, so the number is a stable, citable key. Cross-references
between ADRs are explicit links.

**C6 — Derived indices.** `INDEX.md` is regenerated from the ADRs after
any change. Anything derived is treated as derived — never the source of
truth, never hand-patched.

**C7 — The plan queue is the ledger of work.** A unit of work is queued
*before* it starts, naming its owning ADR(s), scope, and exit criteria
mapped to acceptance criteria. The move from `todo/` to `done/` is the
**completion event**, and the owning ADR advances to `Implemented` on the
same change.

**C8 — Audit trail and approvals.** Substantive ADR changes append a
Revision History row; editorial changes are excluded but flagged. An
Approvals table is populated when an ADR is accepted. The record of *how a
decision evolved* is part of the decision.

**C9 — ADRs are internal.** ADR numbers, titles, and the existence of the
catalogue never appear in any surface an end user sees — UI copy, API
responses, error messages, public docs. The catalogue is a builder's
tool. References are allowed only in code comments, commit messages, and
internal documents.

**C10 — An explicit git contract.** Conventional Commits, a mandatory
rationale footer on any change touching an ADR, and a single declared
integration model (fast-forward-only trunk, or pull-request-based) so the
"shipped" event is unambiguous.

**C11 — Enforcement by audit.** None of the above is left to goodwill. An
audit routine checks numbering, index sync, plan coverage, section
completeness, status validity, cross-reference resolution, and privacy
leaks — the discipline a style guide alone cannot guarantee.

## 4. Scaling to many repositories

A single product is often spread across several repositories. docflow
extends the method to a **federation** without abandoning any of the rules
above:

- A repository declares, at set-up, whether it is **standalone** or part
  of a **multi-repo product**, and if so whether it is **establishing** a
  federation or **joining** one. A joining repository only ever writes its
  own back-pointer — never into another repository.
- **Topology** is an explicit choice: a central decisions repository, a
  fully distributed set, or a home repository with local decisions
  alongside.
- Numbering stays **contiguous per repository**; a federation-wide
  **identity** (by default a repository-prefixed slug) is the
  cross-repository key, so two repositories never collide.
- Cross-repository references resolve through a **member index** and
  survive a repository move — same-repository links stay relative.
- A **roll-up** aggregates every member's catalogue into one derived,
  product-wide view, tolerant of members that are not checked out.
- The audit extends across repositories: membership, identity collisions,
  dangling references, and roll-up drift are all checked.
- Shared conventions are **copied at set-up** and kept honest by
  drift-detection in the audit — referenceable from one source, never
  force-pushed into members.

The federation rules are deliberate applications of one principle: **no
tool writes across a repository boundary; consistency is declared at the
edges and enforced by audit, not by remote control.**

## 5. Why it is useful

- **No oral tradition.** The reasons behind the system are written down,
  uniform, and discoverable. A new contributor — human or agent — onboards
  from the files alone.
- **Decisions and work are linked.** The same identity threads an ADR, its
  queue item, and the commit that ships it. "Why does this exist?" always
  has an answer.
- **Agent-ready by construction.** The rules are explicit and
  machine-checkable, so coding agents act correctly and an audit catches
  them when they do not.
- **Auditable history.** Supersession, revision rows, and approvals make
  the evolution of a decision legible long after the fact.
- **Resists rot.** Derived indices, a status-driven queue, and an
  enforcement audit make drift visible instead of letting it accumulate
  silently.
- **Scales without a rewrite.** The same primitives extend from one
  repository to a federation; nothing about the small-team case is thrown
  away to support the large one.

## 6. Weaknesses and limits

An honest method states where it costs more than it returns.

- **Ceremony has a floor.** Numbered records, status transitions,
  revision rows, and queue moves are overhead. For a throwaway script or
  a spike, the method costs more than it returns — use it where decisions
  outlive their authors, not everywhere.
- **Discipline is load-bearing.** The guarantees hold only if the rules
  are followed. The audit catches mechanical drift, but it cannot tell a
  *thoughtful* ADR from a hollow one written to satisfy process. Rubber-
  stamped ADRs give false confidence.
- **Granularity is a judgement call.** "One decision per ADR" has no
  crisp boundary. Too coarse and an ADR becomes a design doc; too fine and
  the catalogue fragments. Teams must calibrate, and they will disagree.
- **Numbering contends under parallelism.** Contiguous numbers are a
  shared resource: concurrent branches can claim the same next number.
  Guardrails (decide-before-do, check-before-merge, a gate backstop)
  mitigate this, but it is friction inherent to the scheme.
- **The catalogue can lag reality.** ADRs are the intended spec; nothing
  physically prevents code from diverging. The method *surfaces*
  divergence through audit and review, but it cannot *prevent* a team
  from shipping behaviour its ADRs do not describe.
- **Privacy is a manual contract.** Keeping ADR identifiers out of
  user-visible surfaces is a rule a person can break by reflex; the audit
  greps for leaks but pattern-matching is not proof.
- **Federation consistency is eventual, not enforced.** Because no tool
  writes across repositories, a member can drift from the shared source
  or fall out of the member index until an audit is run. The method trades
  hard enforcement for autonomy and a smaller blast radius — a deliberate
  choice, but a real limitation.
- **Tooling assumes local availability.** Cross-repository roll-up and
  audit read members from local checkouts; members that are absent are
  reported as unverified rather than checked. Completeness depends on
  having the repositories to hand.

## 7. Lineage

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
