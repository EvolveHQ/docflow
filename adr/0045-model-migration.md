---
adr: 0045
title: Model migration — the deliberate path, the mapping, evidence rebinding
status: Implemented
date: 2026-08-04
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0035", "0038", "0039"]
serves: ["G-one-zero"]
tags: [workflow, migration, record-model, evidence]
---

# ADR 0045 — Model migration — the deliberate path, the mapping, evidence rebinding

## Context

The record model is a bootstrap choice and **re-runs never convert
it** — that rule (adr/0039-record-model-choice.md) exists so a casual
re-run cannot restructure a catalogue. But repos legitimately
outgrow their model: a capability-first catalogue whose living
requirements churn wants decisions+specs, and its capability records
should become living specs without pretending the decisions behind
them changed. Until now there was no sanctioned path — only the
rule that re-runs are not it.

Two problems make migration more than a rename. **Identity:** moved
records leave numbering gaps, and the contiguity promise says gaps
are failures. **Evidence:** bound records cite the old slug in
append-only files that must never be edited — moving criteria would
orphan their proof. The operator decided both: gaps become legal
only where a mapping accounts for them, and evidence follows the
move through a mapping rule, never through edits.

## Capability statement

**Migration is a deliberate, operator-gated bootstrap path** —
invoked explicitly ("migrate the record model"), never offered by a
re-run, run at full depth with the operator holding a **per-record
approval**. It is the one sanctioned way the manifest's `model:`
changes, and the flip ships inside the migration itself.

**Every record is classified before anything moves**, and the
classification is the approval checklist:

- **decision-stays** — a pure decision; byte-untouched.
- **reclassify** — capability content in decision clothing: `git mv`
  to `spec/<slug>.md`, front matter rewritten to spec form plus
  **`migrated-from:`** naming the old path, one revision row
  ("reclassified as a capability spec; content unchanged").
  **Reclassification is not supersession** — the decision behind the
  record still stands; nothing flips to `Superseded`.
- **split** — a mixed record: the decision core stays in place with
  a pointer; the capability content moves to a spec that carries
  `migrated-from:`.
- **terminal** — `Superseded`/`Deprecated`/`Withdrawn`; untouched by
  definition.

**`MIGRATION.md` at the artefact root is the mapping**: one row per
moved record, old path → new home. **Numbering contiguity relaxes to
no-duplicates only where the mapping accounts for every missing
number** — an unaccounted gap is still a failure. Historical
references in commits, plans, and the worklog resolve through the
mapping forever.

**Evidence rebinding — the mapping rule.** Evidence records and
their directories are **never edited, moved, or rewritten** by a
migration. A moved record's `migrated-from:` is the link:
verification tooling checking criteria evidenced **before** the move
follows it to the old slug's evidence directory; evidence produced
**after** the move binds under the new identity. Digest continuity
holds because a reclassification does not reword criteria; a
criterion edited during migration invalidates its old evidence
exactly as any edit does — visibly.

**Wave discipline**: unevidenced records migrate first; evidenced
records move only under the rebinding rule, each with its mapping
row. A repo may stop after wave one indefinitely — mixed records are
a valid state, not a failure.

The audit follows the mapping (numbering, cross-references, spec
lineage); the verify gate supports the mapping and rebinding rules.

## User stories / scenarios

- As an operator whose capability-first catalogue has become a
  living-requirements repo, I want a sanctioned migration with
  per-record approval, so the restructure is a decision I hold, not
  a side effect.
- As a maintainer reading a three-year-old commit that cites a moved
  record, I want the mapping to resolve it, so history survives the
  restructure.
- As the evidence contract's keeper, I want moved criteria to keep
  their proof without any append-only file being touched, so
  migration never launders or loses verification history.
- As a cautious operator, I want to migrate the easy records now and
  the evidenced ones later — or never — without either state being
  wrong.

## Acceptance criteria

1. Migration is a deliberate, operator-gated bootstrap path,
   distinct from re-runs (which never convert): explicit invocation,
   per-record classification and approval, and the manifest `model:`
   flip inside the migration itself.
   Verify: node -e "const b=require('fs').readFileSync('plugins/docflow/skills/bootstrap/SKILL.md','utf8'); process.exit(b.includes('Migration path') && b.includes('MIGRATION.md') && b.includes('never converts') ? 0 : 1)"
2. Reclassification is not supersession: a moved record keeps its
   decision standing — `git mv`, front-matter rewrite with
   `migrated-from:`, one revision row; nothing flips to Superseded.
   Verify: node -e "const b=require('fs').readFileSync('plugins/docflow/skills/bootstrap/SKILL.md','utf8'); process.exit(b.includes('not supersession') && b.includes('migrated-from') ? 0 : 1)"
3. The conventions record the mapping contract: `MIGRATION.md` rows
   for every moved record; contiguity relaxed to no-duplicates only
   where the mapping accounts for the gaps; an unaccounted gap
   remains a failure.
   Verify: node -e "const c=require('fs').readFileSync('CONVENTIONS.md','utf8'); process.exit(c.includes('MIGRATION.md') && c.includes('no-duplicates') ? 0 : 1)"
4. The evidence contract records the rebinding rule and the gate
   supports it: a record carrying `migrated-from:` resolves pre-move
   evidence under the old slug's directory; evidence files are never
   edited or moved; post-move evidence binds under the new identity.
   Verify: node -e "const f=require('fs'); process.exit(f.readFileSync('CONVENTIONS.md','utf8').includes('migrated-from') && f.readFileSync('scripts/verify.mjs','utf8').includes('migrated-from') ? 0 : 1)"
5. Wave discipline: unevidenced records first; evidenced records
   only under the rebinding rule; stopping after wave one is a valid
   end state.
   Verify: manual
6. The corpus routes migration utterances ("migrate the record
   model", "convert the catalogue to specs") to bootstrap.
   Verify: npm run evals

## Out of scope

- **Running docflow's own migration** — sequenced behind external
  use of this machinery; the dry-run triage is its prepared input.
- **Cross-model paths other than into decisions+specs** — the
  classification generalises, but the mechanics documented here
  target the split the triage designed for; other directions get
  their own review when a repo wants one.
- **Automated classification** — the operator approves every record;
  the tooling proposes, never decides.

## Open questions

- None.

## References

- adr/0035-per-criterion-evidence.md
- adr/0038-capability-spec-records.md
- adr/0039-record-model-choice.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-08-04 | r1 | Eugenio Minardi | Initial draft (Proposed), to the two operator decisions taken this session: evidence rebinding by mapping rule (migrated-from:, append-only preserved); numbering gaps legal only with a MIGRATION.md accounting. |
| 2026-08-04 | r2 | Eugenio Minardi | Status Proposed → Accepted by the operator; implementation authorised (plan 0048). |
| 2026-08-04 | r3 | Eugenio Minardi | Implemented (plan 0048): AC1–AC4 command-evidenced, AC6 via the eval suite (24/24), AC5 operator-attested (wave discipline) — six bound records, attended. The machinery ships dormant; first live exercise awaits an external migration, ahead of this repo's own. Status Accepted → Implemented. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-08-04 | — |
