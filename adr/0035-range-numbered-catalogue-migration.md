---
adr: 0035
title: Compatibility and migration for range-numbered catalogues
status: Accepted
date: 2026-09-04
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0034", "0003", "0028"]
tags: [conventions, migration, audit, bootstrap]
---

# ADR 0035 — Compatibility and migration for range-numbered catalogues

## Context

adr/0034-adr-shape-as-declared-metadata.md moves the capability /
technology distinction from a number range into a `shape:` field.
Repos bootstrapped before that decision carry the old encoding: a
cutoff recorded in `CONVENTIONS.md` §ADR Shapes, a technology template
at the boundary (`0100-template.md` or a project-defined number), a
technology block above it, and a seed ADR that is documented as an
exception. Those catalogues are valid histories with cross-references,
plan items, and commits that name their numbers.

docflow's standing position on already-scaffolded repos is that a
change of convention is **offered, never imposed**: bootstrap re-runs
are additive and preserving, and audit surfaces gaps rather than
rewriting files (adr/0003-backfill-retrofit.md,
adr/0033-artefact-root-discovery.md). The same position is needed
here, with one difference: the legacy encoding has a real defect (it
overflows), so the offer must come with a complete, mechanical fix,
not only a warning.

## Capability statement

A catalogue that still encodes shape by number range is recognised by
every lifecycle skill and keeps passing audit. Audit reports the legacy
encoding as a single migration finding and offers a mechanical
migration; a bootstrap re-run on such a repo offers the same
migration. The migration renumbers the technology ADRs onto the end of
the capability sequence in their original order, stamps `shape:` on
every ADR, rewrites every dependency field, relative link, index row,
and domain listing that named an old number, retires the boundary
template in favour of `0000-template-technology.md`, and rewrites the
conventions section. Cross-references from outside the catalogue
(commit messages, plan items in `done/`) are left as history. The
operator confirms before any file is rewritten.

## User stories / scenarios

- As a maintainer of a repo bootstrapped with a cutoff, my audit stays
  green and tells me, in one finding, that a migration is available.
- As that maintainer, I accept the offer and the technology ADRs
  become `0013`, `0014`, … after my last capability ADR, every
  `depends-on` and link follows, and the seed's exception clause
  disappears from my conventions.
- As a maintainer who declines, my repo keeps working with the range
  scheme and audit keeps checking it as before.
- As an operator re-running bootstrap on a legacy repo, I am offered
  the same migration in the existing-content step, with a dry-run
  summary before anything is written.
- As a reviewer, the migration lands as one commit whose message lists
  every old-to-new number pair, so history stays reconstructible.

## Acceptance criteria

1. Audit recognises the legacy encoding from `CONVENTIONS.md`
   (a cutoff in §ADR Shapes) or from a template file numbered other
   than `0000`, and reports it as one finding of severity "migration
   available", not as a failure.
2. While the legacy encoding is in place, audit's numbering and
   section checks apply the range rules exactly as before this
   decision, so a legacy repo that passed keeps passing.
3. Audit and the bootstrap existing-repo path both offer the migration;
   neither performs it without an explicit confirmation, and both show
   the old-to-new number map before writing.
4. The migration assigns technology ADRs the numbers following the
   highest capability ADR, preserving their original relative order,
   and leaves capability numbers unchanged.
5. The migration writes `shape:` on every ADR, rewrites every
   `depends-on` entry, `supersedes` / `superseded-by` entry, relative
   `adr/NNNN-*.md` link, `INDEX.md` row, domain `README.md` listing,
   and `plan/todo/` owning-ADR reference that named a renumbered ADR;
   `plan/done/` footers and commit history are not rewritten.
6. The migration replaces the boundary template with
   `adr/0000-template-technology.md` and rewrites `CONVENTIONS.md`
   §ADR Shapes to the declared-field form, removing any seed-ADR
   exception clause.
7. After migration the catalogue passes the numbering, section, index,
   and cross-reference checks of a two-shape repo under
   adr/0034-adr-shape-as-declared-metadata.md with no manual edits.
8. The migration commit message lists every old-to-new number pair.
9. An eval fixture built from a range-numbered catalogue exercises the
   detection, the offer, and the post-migration audit.

## Out of scope

- The declared-field scheme itself
  (adr/0034-adr-shape-as-declared-metadata.md).
- Migrating repos in a federation whose members reference the
  renumbered ADRs by logical identity; a member's renumbering is
  visible to the roll-up (adr/0024-federated-rollup-catalogue.md) and
  cross-repo audit (adr/0028-cross-repo-audit.md) as dangling
  references, which is the existing behaviour for any renumber.
- Rewriting git history, tags, or `plan/done/` footers.

## Open questions

- None.

## References

- adr/0034-adr-shape-as-declared-metadata.md
- adr/0003-backfill-retrofit.md
- adr/0028-cross-repo-audit.md
- adr/0033-artefact-root-discovery.md (the offered-never-forced
  precedent)

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-09-04 | r1 | Eugenio Minardi | Initial draft (Proposed), from the approved brainstorm: legacy range encoding stays recognised; audit and bootstrap offer a mechanical migration (append technology ADRs after the last capability number, stamp `shape:`, rewrite references, retire the boundary template); never forced. |
| 2026-09-04 | r2 | Eugenio Minardi | Status Proposed → Accepted; acceptance delegated to the session by the operator. Open question resolved: no `aliases:` field; the migration commit's old-to-new map is the record. Plan 0037 authorised. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-09-04 | — (delegated) |
