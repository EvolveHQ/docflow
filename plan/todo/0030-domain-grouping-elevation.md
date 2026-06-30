# 0030 — Domain grouping: clarify usage and elevate

**Owning ADR:** adr/0030-domain-grouping.md

## Scope (C1 + C3 + C4 — the "a bit more important" tier)

In:
- **C3 — assessment.** Split `domains/` out of the Q7 "defer all three"
  lump: give it its own enable recommendation (trigger: distinct areas /
  catalogue size). When the domains layer is present, `new-adr` records the
  ADR's owning domain and updates the domain README; on assign to a new
  domain, it offers to create `domains/<slug>/README.md`.
- **C4 — docs & GitHub Pages.** Lift "Grouping by domain" out from under the
  methodology numbering subsection into its **own section**; add a worked
  domains example to `examples.md`; clarify purpose + when-to-use in
  `README.md`/`USAGE.md`.

Out:
- C2 — a `domain:` metadata field, an `INDEX.md` domain column, an `audit`
  domain-consistency check. (Held as a possible follow-on ADR.)
- Per-domain numbering / namespacing (rejected); cross-repo grouping
  (federation).

## Exit criteria (map to ADR 0030 acceptance criteria)

1. Docs present the grouping as a first-class optional layer — a curated
   index of an area's ADRs at the artefact root (AC1/AC2).
2. `new-adr` prompts for / records the owning domain when the layer is
   present and offers to create a new domain's README on assign (AC3).
3. The bootstrap assessment gives domains its own enable recommendation,
   not bundled "defer all three" (AC4).
4. Methodology has a dedicated "Grouping ADRs by domain" section;
   `examples.md` has a worked example; README/USAGE state purpose +
   when-to-use (AC5).

## Completion event

Fast-forwarded to `main` + remote push. On completion, `git mv` to
`plan/done/`, advance ADR 0030 → Implemented, regenerate `INDEX.md`.

> Queued while ADR 0030 is **Proposed** — do not start until it is Accepted.
