# 0078 — Canonical glossary structure and safe migration

Owning decisions: adr/0016-layered-artifact-model.md (AC2 opt-in layer,
AC5 enable-later via bootstrap re-run and `add-convention`) and
adr/0007-lifecycle-skills.md (bootstrap / add-convention / audit
contracts). Controller set the canonical GLOSSARY.md shape as a routine
format choice; no new ADR is required.

## Status

- Claimed by: fix/glossary-structure (sole Docflow writer, 2026-10-04)
- Blockers:
- Stopped:

## Scope

Make glossary creation and maintenance produce one canonical shape — an
optional heading, optional introductory prose, then a single two-column
Markdown table headed `Term | Definition` — across every product path:

- `bootstrap` ships the canonical `GLOSSARY.md` template (templates stay
  bootstrap-only) and writes it only when the optional layer is chosen,
  additively on a re-run and never overwriting an existing file.
- `add-convention` creates `GLOSSARY.md` on the first term and appends to
  an existing glossary in the canonical shape.
- The generated `CONVENTIONS.md` guidance carries the canonical shape so
  scaffolded skills read one source instead of restating variants.
- `audit` detects non-canonical or mixed entry structure, reports it
  read-only, and offers a migration with a concrete proposed diff. It
  rewrites nothing without explicit target-user consent; a decline keeps
  the existing file untouched and never adds a further shape.

Migration must be lossless: preserve term spelling and meaning, aliases,
links and inline code, entry order and meaningful prose; escape literal
pipes; keep a multiline definition in one cell with an explicit
meaning-preserving form; and flag ambiguous or duplicate terms for user
resolution instead of inferring, merging or dropping content. Absence of
a glossary stays valid and audit must not create one to satisfy a check.

Out of scope: bulk migration of operator repositories, personal installed
skill writes, Clarity rendering, a new Markdown parser or dependency,
pushes, PRs, releases, and any change to the required gate except a named
tighten-and-repair that also ships the repairs it surfaces.

## Review repair (FB026, 2026-10-04)

An independent review of `458a836` raised six findings: a legacy
§Glossary title treated as adoption, inverted producer glossary
inclusion, a canonical checker that accepted malformed tables and
anchored duplicates, lossless qualification that permitted rewrites and
reordering, H1 term headings dropped from the anchor obligation, and
consent/decline preservation not exercised. This repair closes all six
with focused positive/negative controls; the scope and exit criteria
above stand unchanged.

## Dependencies and queue position

- Sole Docflow writer on `fix/glossary-structure`; nothing else may claim
  this item.
- Number reserved as the next free slot after 0077; no collision found in
  `plan/todo/`, `plan/done/`, `adr/`, or `INDEX.md`.

## Exit criteria

1. `bootstrap` writes `GLOSSARY.md` from one canonical template only when
   Q7 enables the layer, by merge on a re-run; absence remains valid.
   (0016 AC2, AC5)
2. `add-convention` creates the first term and appends later terms in the
   canonical table, preserving existing rows and prose. When no `§Glossary`
   rule is recorded it uses the canonical default and offers to record the
   agreed shape as its own confirmed edit, without rewriting unrelated
   conventions. (0016 AC5)
3. The generated `CONVENTIONS.md` guidance states the canonical shape once
   and `AGENTS.md`/`README`/`USAGE` stay consistent with it, with no ADR
   identifiers in user-visible strings. (0007)
4. `audit` distinguishes a non-canonical glossary under an adopted
   `§Glossary` rule (drift) from one where the rule was never adopted
   (migration available), fails duplicate terms, and offers a migration
   showing a concrete diff that preserves heading anchors (or stops for
   resolution) and leaves the repo unchanged until the target user
   consents; ambiguous mapping flags for resolution. (0007)
5. Deterministic fixtures and evals cover fresh canonical, absent/deferred,
   uniform, non-canonical/mixed, escaped-pipe/multiline/link, ambiguous/
   duplicate, decline/no-mutation, accepted lossless migration, and repeat
   maintenance without shape drift. Eight-target parity, privacy and gate
   integrity hold; `node scripts/verify.mjs` and `node evals/run.mjs` pass.
   (0012, 0015)

## Size estimate

M — skill/template/docs consistency plus deterministic fixtures and one
host qualification case; no model runs performed locally.
