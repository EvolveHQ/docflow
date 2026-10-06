# 0078 — Canonical glossary structure and safe migration

Owning decisions: adr/0016-layered-artifact-model.md (AC2 opt-in layer,
AC5 enable-later via bootstrap re-run and `add-convention`) and
adr/0007-lifecycle-skills.md (bootstrap / add-convention / audit
contracts). Controller set the canonical GLOSSARY.md shape as a routine
format choice; no new ADR is required.

## Status

- Claimed by: Codex bounded FB026 repair, fix/glossary-structure (sole Docflow writer, 2026-10-04)
- Blockers:
- Stopped: 2026-10-04 — bounded FB026 repair complete locally; controller review pending. See the receipt below. No integration performed.

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
consent/decline preservation not exercised. The first repair targeted all
six with focused positive/negative controls; the scope and exit criteria
above stand unchanged.

The independent recheck at signed `b182f970831166b505af0acc563406d87170e688`
found four remaining P2 oracle gaps. This bounded local-only continuation
repairs concrete migration authorisation, complete prose preservation,
no-title first-H1 anchors, and exact first/append definitions with unchanged
conventions on both turns. Add independent adverse controls and inspect
adjacent bypasses. Keep generator/fixture consistency separate; no paid
hosts, installed-skill or real-repository edits, push, PR or integration.

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

## Bounded FB026 final repair receipt (2026-10-04)

Verified work: `0610f6779183c004afbccd811844c0dd86e06980` (signed).
The acceptance checks now require the exact approved diff after a no-write
review, complete ordered file content, the first no-title H1 target, and
exact definitions plus unchanged conventions on both maintenance turns.
Product skills, generator sources and generated fixtures were unchanged.
Evidence and individual logs remain outside this repository in
`DocflowHQ/.docflow_workspace/local/handoffs/feedback-glossary-final-repair-20261004.md`.

- `node --test evals/hosts/test-qualification-glossary.mjs`: exit 0; 63/63.
- `node scripts/verify.mjs`: exit 0; `verify: OK`.
- `node evals/run.mjs`: exit 0; 13 passed, 0 failed, 0 skipped.
- `node --test evals/repository-producer.test.mjs`: exit 0; 27/27.
- `node scripts/verify-mutations.mjs`: exit 0; 15 rejected mutations.
- `python /tmp/hq-qa/clarity-feedback-20261004/final-repair-oracle-mutations.py`:
  exit 0; 9 checker regressions rejected; baseline/restored 63/63.
- Broader hostless controls: 134/134, exit 0. The initial wildcard invocation
  exited 1 by including an argument-requiring CLI helper; the corrected suite
  runs that helper with its required fixture through its existing wrapper.

**Status at a glance**

- **This run:** repaired all four reported oracle gaps and adjacent controls;
  focused, verify, evals, producer and mutation checks pass as recorded above.
- **Overall:** verified for this bounded hostless repair; item remains in todo,
  unmerged and unshipped. No native-host qualification was performed.
- **Yet to do:** controller review/recheck and any separately authorised native
  qualification, integration and item completion. Writer stops on this branch.
