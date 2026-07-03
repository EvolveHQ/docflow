---
adr: 0033
title: Artefact-root discovery contract
status: Accepted
date: 2026-07-03
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0017", "0023"]
tags: [conventions, tooling, discovery]
---

# ADR 0033 — Artefact-root discovery contract

## Context

The artefact root is configurable
(adr/0017-configurable-artifact-root.md) and recorded in
`CONVENTIONS.md` — but `CONVENTIONS.md` itself lives **under** the
root, so the record is only readable once the root is already known.
Skills cope by probing, and the assessment accepts custom roots, so
the candidate set is open — un-probeable for an external tool. The
first such consumer is **Clarity**, the docflow repository browser: it
indexes arbitrary repos read-only and needs to locate the catalogue
deterministically, ideally in one `stat()` call. Making `.docflow/`
mandatory would solve discovery by destroying configurability (and
0017's reasons — `docs/` visibility, monorepo root proximity — still
hold). What is missing is not a fixed layout but a **discovery
contract**: git solved the identical problem with the `.git`
directory-or-pointer-file pattern for worktrees and submodules.

## Capability statement

Any tool or agent can locate a docflow repo's artefact root by a
normative three-step precedence, checked at the repository root:

1. **Marker directory.** A `.docflow/` directory **is** the artefact
   root. The default layout needs no extra file — the root marks
   itself.
2. **Pointer file.** A `.docflow` **file** is a one-line pointer,
   `root: <path>` relative to the repository root (`root: docs/`,
   `root: .`). Bootstrap writes it whenever the operator chooses any
   root other than `.docflow/`. (The filesystem makes the two cases
   mutually exclusive by name.)
3. **Legacy probe.** Neither present: probe the well-known candidates
   — `docs/`, then the repository root — for a `CONVENTIONS.md`
   carrying an artefact-root record. Nothing found means the repo is
   not (yet) a docflow repo.

The pointer file and the `CONVENTIONS.md` artefact-root record must
agree; a disagreement, or a pointer redundantly naming `.docflow/`, is
an audit finding. Federation artefacts (`federation.md`,
`federation-index.md`, the roll-up) live at the artefact root
(adr/0023-federation-config-membership-index.md), so the same contract
discovers a repo's federation membership.

This contract **completes** adr/0017-configurable-artifact-root.md
rather than superseding it: the `CONVENTIONS.md` record remains right
for skills already operating inside the repo; the marker/pointer
serves consumers that must first find it.

## User stories / scenarios

- As Clarity indexing an arbitrary repository, I resolve the artefact
  root from one check at the repo root — no heuristics, no open-ended
  scanning.
- As an operator who chose `docs/` for GitHub visibility, my layout
  keeps working; bootstrap drops a one-line pointer and every tool
  finds my catalogue.
- As a maintainer of a pre-contract repo, discovery still works via
  the legacy probe, and audit offers (never forces) adding the
  pointer.
- As a federation tool, I find `federation.md` through the same
  contract and know the repo's membership without guessing paths.

## Acceptance criteria

1. A `.docflow/` directory at the repository root is the artefact
   root; no pointer file is written or expected in that case.
2. When bootstrap records any other root, it writes a `.docflow`
   pointer file at the repository root whose single `root:` line names
   the chosen root relative to the repository root.
3. The three-step precedence (directory → pointer file → legacy probe
   of `docs/` then repo root for a `CONVENTIONS.md` artefact-root
   record) is documented as normative in the scaffolded conventions
   and the user-facing docs.
4. Audit flags a pointer file that disagrees with the
   `CONVENTIONS.md` artefact-root record, and a pointer that
   redundantly names `.docflow/`.
5. Federation files are discoverable through the same contract: a tool
   that has resolved the artefact root finds `federation.md` there
   when the repo is federated.
6. Existing repos are not force-migrated: the pointer is offered on a
   bootstrap re-run (and surfaced by audit), never imposed.

## Out of scope

- Which roots are offered at bootstrap and their default — unchanged,
  adr/0017-configurable-artifact-root.md.
- Clarity's consumer-side indexing behaviour and its tolerance for
  non-conforming catalogues — decided in the docflow-clarity repo's
  own catalogue.
- Discovery of `AGENTS.md`/`CLAUDE.md` — they are always at the
  repository root already.

## Open questions

- None.

## References

- adr/0017-configurable-artifact-root.md
- adr/0023-federation-config-membership-index.md
- https://git-scm.com/docs/gitrepository-layout (the `.git`
  directory-or-file precedent)

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-07-03 | r1 | Eugenio Minardi | Initial draft (Proposed), from the approved brainstorm: marker directory / pointer file / legacy probe precedence, borrowing the `.git` pattern; motivated by Clarity's need for deterministic read-only discovery. |
| 2026-07-03 | r2 | Eugenio Minardi | Status Proposed → Accepted. Contract confirmed as drafted; the consumer-side algorithm stays with the docflow-clarity catalogue. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-07-03 | — |
