---
adr: 0034
title: ADR shape as declared metadata, one contiguous sequence
status: Accepted
date: 2026-09-04
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0001", "0007", "0029", "0030"]
tags: [conventions, adr-shape, numbering, tooling]
---

# ADR 0034 — ADR shape as declared metadata, one contiguous sequence

## Context

A repo may distinguish two ADR shapes: **capability** ADRs (what the
system must do) and **technology** ADRs (how it is built). Today the
bootstrap assessment offers that split, and the scaffold encodes the
distinction in the **number**: capability ADRs occupy `0001`–`00NN`,
technology ADRs start at `00NN+1`, and the technology template sits at
the boundary as a pseudo-ADR (`0100-template.md` by default). New-adr
places each ADR on its side of the cutoff; audit checks that no ADR
crosses it.

Field use exposed three faults in that encoding:

- **It overflows.** A capability block that reaches the cutoff has
  nowhere to go: the technology block already occupies the numbers
  above it. The scaffolded conventions say "widen the boundary", but
  widening collides with existing technology ADRs, so the only real
  remedy is renumbering — the one operation the identity scheme
  forbids.
- **It leaks.** The seed ADR that records the adoption of the method
  (adr/0029-seed-adr-recording-the-method.md) is a technology-shaped
  decision that must be `0001`, inside the capability block. Every
  two-shape repo therefore starts with a documented exception to its
  own rule.
- **It duplicates a decision already made.** Identity is the flat,
  contiguous number; grouping is a view over it. That principle was
  settled when per-domain numbering was rejected
  (adr/0030-domain-grouping.md). Shape-by-range is per-shape numbering
  by another name.

The shape of an ADR is a property of the document, not of its
position in the sequence. It belongs in the metadata block with the
other properties.

## Capability statement

A repo that distinguishes capability from technology decisions
records the distinction in a `shape:` field of each ADR's metadata
block, never in a number range. Every ADR takes the next contiguous
number regardless of shape. Two templates exist, both non-decisions
numbered `0000`: the capability template and the technology template.
A single-shape repo omits the field and is unaffected; an absent field
means capability. Every lifecycle skill reads the declared shape to
choose the template, validate the section order, and render the
catalogue; none of them reads a cutoff.

## User stories / scenarios

- As a maintainer of a two-shape repo, I author the hundredth
  capability ADR and it takes the next number, with no boundary to
  widen and nothing to renumber.
- As an author, I answer "capability or technology?" once; new-adr
  picks the template, stamps the field, and assigns the next number.
- As an auditor, I read the shape from the file and check that its
  sections match, without consulting a cutoff recorded elsewhere.
- As a reader of a two-shape catalogue, I see the shape as a column
  in the index rather than inferring it from the number.
- As a maintainer of a single-shape repo, nothing changes: no field,
  no column, no new template.
- As an operator bootstrapping a two-shape repo, the seed ADR is
  `0001` with `shape: technology`, and the conventions carry no
  "recorded exception".

## Acceptance criteria

1. The capability template's metadata block accepts an optional
   `shape:` field with the values `capability` and `technology`; an
   absent field means `capability`.
2. The technology template ships as `adr/0000-template-technology.md`
   with `shape: technology` pre-filled; `adr/0000-template.md` remains
   the capability template. Every tool that excludes templates from
   the catalogue excludes both `0000-` files, and no template carries
   a number other than `0000`.
3. Bootstrap's ADR-shape question offers "single shape" or "two shapes
   declared by field"; it asks for no cutoff, and the scaffolded
   `CONVENTIONS.md` §ADR Shapes describes the field, not a range. The
   existing cross-check between the shape question and the
   technology-template option in the optional-artefacts question is
   preserved.
4. New-adr assigns the next contiguous number irrespective of shape,
   and in a two-shape repo asks the shape, uses the matching template,
   and writes the field.
5. Audit's numbering check requires one contiguous sequence with no
   shape clause; its section-completeness check validates each ADR
   against the section order of its declared shape, and flags an
   unknown `shape:` value.
6. In a two-shape repo, `INDEX.md` carries a Shape column; in a
   single-shape repo it does not.
7. In a two-shape repo the seed ADR is `0001` with `shape: technology`,
   and no exception clause is needed in the scaffolded conventions.
8. A single-shape repo with no `shape:` fields passes every check
   unchanged; this repo's own catalogue and verify gate are unaffected.

## Out of scope

- Compatibility with, and migration of, catalogues already bootstrapped
  with a cutoff — adr/0035-range-numbered-catalogue-migration.md.
- Adding shapes beyond capability and technology; the field is the
  extension point, but a third shape is a separate decision.
- Federation identity and cross-repo references
  (adr/0021-cross-repo-identity-numbering.md,
  adr/0022-cross-repo-reference-scheme.md) — the number stays the
  identity, so nothing there changes.
- Domain grouping (adr/0030-domain-grouping.md) — shape and domain are
  orthogonal views over the same flat sequence.

## Open questions

- None.

## References

- adr/0001-adr-driven-workflow.md
- adr/0007-lifecycle-skills.md
- adr/0029-seed-adr-recording-the-method.md
- adr/0030-domain-grouping.md
- adr/0035-range-numbered-catalogue-migration.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-09-04 | r1 | Eugenio Minardi | Initial draft (Proposed), from the approved brainstorm: shape moves from a number range to a `shape:` metadata field; one contiguous sequence; two `0000` templates; skills read the field, never a cutoff. Motivated by the overflow, the seed-ADR exception, and consistency with the flat-identity principle. |
| 2026-09-04 | r2 | Eugenio Minardi | Status Proposed → Accepted; acceptance delegated to the session by the operator for the sequential development of the queue. Open question resolved: the Shape column is rendered in two-shape indexes only; a federation roll-up may add it when any member is two-shape. Plan 0036 authorised. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-09-04 | — (delegated) |
