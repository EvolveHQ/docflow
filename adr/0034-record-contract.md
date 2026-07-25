---
adr: 0034
title: Explicit record contract — cooperative guarantee and capability manifest
status: Implemented
date: 2026-07-25
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0011", "0016", "0033"]
tags: [core, conventions, contract, trust]
---

# ADR 0034 — Explicit record contract — cooperative guarantee and capability manifest

## Context

docflow's promises have outgrown its wording. A design analysis and two
adversarial cross-reviews (see References) surfaced three foundational
gaps beneath the planned verification, constraints, and record-model
work:

1. **No stated trust boundary.** Nothing records what the verify gate
   does and does not guarantee. The same agent can edit an acceptance
   criterion, mark the work done, and advance a status; a local script
   is bypassed by a direct edit. Language such as "the gate enforces X"
   overstates what a markdown + git + skills tool can promise.
2. **Status is conflated with truth.** A `status:` line asserts a
   state, but nothing distinguishes the *declared* state from the state
   the repository's contents actually support. Planned work — per-
   criterion evidence, constraint files, living capability records —
   needs that distinction to exist before anything can gate on it. (The
   2026-07-02 review had already queued this instinct as "executable
   acceptance criteria — so Implemented means asserted".)
3. **Repo setup is discovered by parsing prose.** Which optional layers
   exist and which conventions a tool should expect are inferred from
   `CONVENTIONS.md`. That is brittle for tools and undefined under
   version skew.

This ADR records **one decision — docflow adopts an explicit record
contract** — with three inseparable facets: what the contract
guarantees (a cooperative posture), how state is interpreted (declared
vs computed), and how a repo declares its shape (a machine-readable
manifest). Subsequent capability decisions build on this foundation.

## Capability statement

Every docflow artefact class is governed by an explicit record
contract. An artefact carries a **declared state** (its front matter
and location on disk); whether that declaration is **valid** is
computable from the repository contents, and where the two disagree the
computed answer is authoritative — status lines are projections, not
proofs. The contract's guarantee level is **cooperative**: the gate
catches honest mistakes and structural drift; it does not authenticate
authorship or stop a determined writer, and repos needing tamper
resistance apply a documented enforcement recipe (CI-executed gate,
branch protection, protected paths) rather than a docflow runtime. A
repo **declares its shape** — contract schema version, record model,
enabled optional layers — in a machine-readable manifest at the
artefact root, so tools read the declaration instead of inferring it
from prose.

## User stories / scenarios

- As a maintainer, I want the gate's guarantee stated in the scaffolded
  conventions, so that I know what it catches and what it cannot.
- As a coding agent, I want to read the repo's model, layers, and
  schema version from a manifest, so that I do not guess from prose.
- As an auditor (human or skill), I want declared and computed state
  distinguished, so that a stale status line is a finding, not a fact.
- As a tool author, I want schema versioning with defined skew
  behaviour, so that older tools fail gracefully on newer repos.
- As a security-conscious team, I want the enforcement recipe
  documented, so that I can add tamper resistance without docflow
  inventing infrastructure.

## Acceptance criteria

1. The scaffolded `CONVENTIONS.md` template and this repo's own
   `CONVENTIONS.md` carry a **Trust posture** section stating the
   cooperative guarantee: the gate catches honest mistakes and
   structural drift, does not authenticate authorship, and treats
   declarations as projections — computed state wins on disagreement.
   No user-visible surface claims a stronger ("hard") guarantee.
2. An **enforcement recipe** is documented in the user-facing docs:
   CI-executed verify gate, branch protection, and a protected-path set
   that covers every input the gate reads (decision records; constraint,
   capability, and evidence files where present; verification methods;
   and the gate code itself).
3. A **manifest file** (`docflow.yml`) at the artefact root declares at
   minimum `schema` (contract version), `model` (record model), and
   `layers` (enabled optional layers). Artefact-root **discovery is
   unchanged**: discovery finds the root; the manifest sits inside it.
4. **Version-skew behaviour is defined:** a tool meeting a manifest
   `schema` newer than it understands refuses writes and says so; an
   absent manifest means a pre-contract repo and current behaviour
   applies unchanged.
5. On disagreement between the manifest and `CONVENTIONS.md`, the
   **manifest wins**, and the audit reports the divergence.
6. `bootstrap` writes the manifest on new scaffolds; on an existing
   docflow repo, a re-run offers to add it additively, altering nothing
   else.
7. The `autonomy` manifest field is **reserved**: documented, neither
   written nor read by any skill until a later decision activates it.
8. The contract text records the state-resolution rule later work
   depends on: deliberate terminal transitions take precedence over
   automatic progress transitions, and residual ambiguity is reported
   for a human rather than auto-resolved.
9. The verify gate validates the manifest (well-formed, known `schema`,
   legal `model`/`layers` values) — shipped as its own commit, separate
   from commits touching the files the gate judges.

## Out of scope

- Per-criterion verification methods, evidence records, and their
  proof-of-work rules — the next decision in the programme.
- Constraint files, abandonment states, the decision/spec record-model
  split, goals, validation, and autonomy semantics — each a later
  decision of its own.
- Any runtime or server-side enforcement: the recipe is documentation.
- Migration of existing repos onto any of the above.

## Open questions

- None.

## References

- adr/0011-static-skill-validation.md
- adr/0016-layered-artifact-model.md
- adr/0033-artefact-root-discovery.md
- Source analysis and cross-review ledger: `../docflow-workflow-analysis/`
  (unversioned sibling folder, r10)

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-07-25 | r1 | Eugenio Minardi | Initial draft. |
| 2026-07-25 | r2 | Eugenio Minardi | Accepted — approvals populated, implementation queued as plan 0036. |
| 2026-07-25 | r3 | Eugenio Minardi | Implemented (commits c2581df, 2ee2333, 0475c6b): trust posture in own + template conventions and USAGE §5b; `docflow.yml` manifest written by bootstrap at every tier, dogfooded here; gate check F shipped alone. AC1–AC9 met. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-07-25 | — |
