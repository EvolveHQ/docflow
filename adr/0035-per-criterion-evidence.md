---
adr: 0035
title: Per-criterion verification — bound evidence records
status: Implemented
date: 2026-07-25
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0007", "0011", "0012", "0034"]
tags: [core, verification, evidence, gate]
---

# ADR 0035 — Per-criterion verification — bound evidence records

## Context

Acceptance criteria are the contract of every capability record, and
the conventions already demand they be testable and numbered — but
nothing records *how* a criterion is checked or *whether it ever was*.
"Tests map back to them where practical" is an escape hatch nothing
enforces, and a record can reach `Implemented` with no criterion ever
exercised. The 2026-07-02 review queued exactly this gap: "executable
acceptance criteria — so Implemented means asserted".

Three failure modes follow. A criterion with no named check is
unfalsifiable in practice. A checked criterion leaves no trace, so
"done" cannot be audited later. And a criterion edited after delivery
silently keeps its old standing — the record still claims
`Implemented` for text nobody verified.

A naive fix — an `evidence:` field on each criterion — fails on three
counts established during design review: a non-null pointer is
satisfiable by a dead link or a self-authored sentence; a pointer goes
silently stale when its criterion is edited; and a shared field on the
record is a concurrency hotspot. The record contract's
declared-vs-computed rule and cooperative posture (see References)
provide the foundations this decision builds on.

## Capability statement

Every acceptance criterion names its **verification method** — an
inline command, `gate-check`, or `manual`. Verification produces
**bound evidence records**: append-only files, written by the shipping
skill from the method's execution transcript, each binding the
criterion's identity *and content digest* to the command, source
commit, and result. A record's `Implemented` status is valid only
while **every current criterion's digest has matching valid evidence**
— editing a criterion breaks the match, so invalidation is automatic
and the declared status becomes a reported divergence. Evidence is
re-executable: the audit re-runs methods and reports divergence as a
finding (evidence debt). Manual verification is permitted, attested,
and counted — never silently the default. Pre-existing records are
exempt until edited, computed from an adoption commit recorded in the
capability manifest.

## User stories / scenarios

- As a maintainer, I want each criterion to name its check, so that
  an unverifiable criterion is visible at authoring time, not at ship.
- As a shipping agent, I want the gate to run the methods and write
  the evidence, so that "done" is a transcript, not my claim.
- As an auditor, I want evidence bound to criterion digests, so that
  an edited criterion automatically loses its old proof.
- As a reviewer, I want manual verification attested and counted, so
  that the escape hatch is visible instead of becoming the default.
- As an adopter with an existing catalogue, I want old records exempt
  until touched, so that adoption needs no retroactive evidence hunt.

## Acceptance criteria

1. **Method on every criterion.** The capability-ADR template and the
   scaffolded conventions require each acceptance criterion to carry a
   verification method: an inline command, `gate-check` (covered by the
   repo's static gate), or `manual`. This repo's own conventions drop
   "where practical" in favour of the same rule for records created or
   edited after adoption.
   Verify: manual
2. **Bound evidence format.** An evidence record is an append-only file
   `evidence/<record-slug>/AC<n>-<seq>.md` carrying: the criterion
   reference and its **content digest** (SHA-256 of the normalised
   criterion text), the method and command, the **source commit** the
   run verified, exit code, output digest, verifier identity, and date.
   Corrections are new records naming `supersedes:` — never edits.
   Verify: manual
3. **The shipping skill is the executor.** `ship-item` runs each
   pending criterion's method for the owning record, writes the
   evidence records, and advances the record to `Implemented` **only
   when every current criterion digest has valid evidence**; otherwise
   it names the unevidenced criteria and leaves the status untouched.
   The plan item itself still completes on its own exit criteria — a
   partial contribution integrates without blocking.
   Verify: manual
4. **Manual is attested and counted.** `manual` evidence requires a
   verifier who is not the implementer, named with date and scope; the
   audit reports the manual-verification ratio. Reported, not gated.
   Verify: manual
5. **Audit closes the loop.** The audit gains: a declared-vs-computed
   check (records declaring `Implemented` whose current criteria lack
   valid evidence — post-adoption records only); **evidence re-runs**
   (re-execute inexpensive methods, sample expensive ones; divergence
   between a record and its re-run is a finding, never an automatic
   state change); and the manual ratio.
   Verify: manual
6. **Adoption is computed, not marked.** The capability manifest gains
   an optional `evidence-adopted-at: <commit>` field (within schema 1).
   A record whose last substantive edit predates that commit is exempt;
   editing it brings it into scope. No per-record markers.
   Verify: gate-check
7. **Temporal rules.** Re-running a record's method to check the
   *record* executes at its recorded source commit; checking *current
   satisfaction* executes at HEAD. Divergence produces a finding for a
   human — evidence history is never auto-invalidated.
   Verify: manual
8. **Self-hosting.** At this decision's own ship: the manifest records
   `evidence-adopted-at`, and this ADR's criteria carry methods and
   receive bound evidence records — the first proof the machinery
   works is the machinery's own record.
   Verify: gate-check
9. **Gate changes ship alone.** Static-gate additions (evidence-record
   well-formedness, declared-vs-computed, manifest field validation)
   land as their own commits, per gate integrity.
   Verify: manual

## Out of scope

- The decision/spec record split — evidence binds to acceptance
  criteria wherever they live; today that is the capability ADR.
- Constraint files, goals, outcome validation, autonomy levels — later
  decisions in the programme.
- CI-side enforcement of evidence authorship — the cooperative posture
  and hardening recipe govern (see References); authorship remains a
  protocol role, not an authenticated authority.
- Retroactive evidence for exempt records — they enter scope only when
  edited.

## Open questions

- None.

## References

- adr/0034-record-contract.md
- adr/0011-static-skill-validation.md
- adr/0012-skill-behavioural-evals.md
- adr/0007-lifecycle-skills.md
- Source analysis and cross-review ledger: `../docflow-workflow-analysis/`
  (unversioned sibling folder, r10, §6.5)

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-07-25 | r1 | Eugenio Minardi | Initial draft. |
| 2026-07-27 | r2 | Eugenio Minardi | Accepted — approvals populated, implementation queued as plan 0037. |
| 2026-07-29 | r3 | Eugenio Minardi | Implemented (commits 801b9ec, d7c8e61, f22f0d7, 04aa335, e8be8cd): method rule, evidence contract, executor + audit checks, adoption field, gate check G. Criteria annotated with methods; nine bound evidence records written — seven attested by the operator, two gate-checked. AC1–AC9 met. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-07-27 | — |
