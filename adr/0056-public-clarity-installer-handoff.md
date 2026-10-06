---
adr: 0056
title: Public Clarity installer handoff
status: Accepted
date: 2026-09-15
owner: Codex, dispatched single Docflow writer
supersedes:
superseded-by:
depends-on: ["0004", "0009", "0015", "0050"]
tags: [distribution, clarity]
---

# ADR 0056 — Public Clarity installer handoff

## Context

The operator selected public Clarity installers on EvolveHQ/docflow with
independent clarity-v<version> tags. Docflow retains v<version> and its existing
package channels. A public manifest establishes payload consistency, not an
approved producer or native platform trust. This decision records the authorised
preparation scope before implementation; it grants no live publication authority.

## Capability statement

Accept only the reviewed portable public handoff contract: a finite build-profile
registry, complete three-platform sets for each configuration, canonical installer
and per-build notice/dependency filenames, exact versions, sizes and SHA-256 values.
Keep private source, build evidence and cross-repository provenance outside this
public tree and release payloads. Produce a local plan before writes. Publication
requires explicit approval of the exact product, repository, version, tag, public
target commit and digest of every public file, after private producer and native
trust review. Stage a draft, verify all uploaded bytes, then publish without making
Clarity the repository's generic latest release. Existing releases are read in full:
identical published sets are a no-op; differing, incomplete or draft sets stop with
recoverable diagnostics and no automatic repair, overwrite or deletion. Consumers
select releases by product namespace, never by the repository-wide latest alias.

## User stories / scenarios

- A user downloads the selected Clarity platform/configuration and checks its hash.
- A maintainer reviews a concrete dry-run plan before granting publication.
- A failed upload preserves its partial draft for explicit recovery review.
- An independently newer Clarity release never updates the Docflow package.

## Acceptance criteria

1. Exactly the five reviewed public contract files are vendored with raw-byte hash
   parity; no private provenance is committed or uploaded.
2. Validation rejects wrong product/tag/version, unsupported profiles, incomplete
   platform/configuration sets, counterpart mismatch, extra/private files, unsafe
   paths/links, bad content, size/hash mismatch and changed notice bytes.
3. A no-network local plan identifies the exact repository/tag/assets and payload
   digest. Approval binds those bytes and the public target commit; manifest or
   magic-byte success alone cannot authorise publication or prove native trust.
4. Publication validates before every first remote write, preserves installer bytes,
   uses narrow permissions and trusted code, and never executes acquired payloads.
   Download every existing asset before retry comparison; identical published sets
   make no writes, while conflicts and partial drafts remain recoverable failures.
5. Disposable command/API controls demonstrate validation-before-write, exact dry-run
   selection, identical/differing retries, partial upload and network/auth failures.
   Mocked boundaries are labelled and never counted as public-download evidence.
6. Product-specific lookup/download guidance separates Clarity and Docflow releases;
   all three Docflow manifest versions remain 0.9.4 and five-target parity is retained.
7. Static, deterministic, focused release and workflow checks pass on signed task
   commits with a review-ready PR/current required CI; gate changes stay separate.
8. After a separately authorised live release, download the complete published set
   without authentication and verify exact approved bytes and intended lookup paths.
   Until then public-download criteria remain pending, as do native trust, final
   operator acceptance and the checked main completion event.

## Out of scope

Private producer implementation, credential provisioning, live release invocation,
tagging, package version changes, main merging, native signing qualification,
operator pilot execution and the later release website.

## Open questions

None blocking preparation. Explicit payload approval and live-download evidence
remain required before publication and final acceptance respectively.

## References

- adr/0004-adr-privacy.md
- adr/0009-distribution-marketplace-npm.md
- adr/0015-multi-target-portability.md
- adr/0050-repository-changes-integrate-through-checked-pull-requests.md
- plan/todo/0064-public-clarity-installer-handoff.md
- Operator preparation mandate, 2026-09-15; parent delivery plan D5.

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-09-15 | r1 | Codex | Record authorised public handoff preparation and pending live acceptance before implementation. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Development mandate | Operator instruction recorded by Codex | 2026-09-15 | Signed task PR preparation authorised; no native trust, live release or final acceptance attestation asserted. |
