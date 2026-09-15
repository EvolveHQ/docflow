# Clarity release preparation verification

Date: 15 September 2026. Scope: public installer handoff preparation under
adr/0056-public-clarity-installer-handoff.md and plan/todo/0064-public-clarity-installer-handoff.md.

## Source and review boundary

- Reviewed integration: `1ede7dc93bf367041e2236e20c07f73266823081`.
- Product implementation: `f019681bcb9c8c3ada0b7897c26f11627875c625`.
- Verified work HEAD, including separate gate controls:
  `434aacf33ca142f1c784f4588e3aa7ae7926e584`.
- Task PR: https://github.com/EvolveHQ/docflow/pull/10, targeting
  `kmox83/docflow-v1-integration`. All three constituent commits through the
  verified HEAD report Git signature status `G`.
- Required source `verify` CI:
  https://github.com/EvolveHQ/docflow/actions/runs/34916382052/job/104214796458,
  success. The PR records the final receipt-head/current CI result separately.

Exactly five portable public files were read through binary Git output and
matched the reviewed byte counts and SHA-256 values before vendoring. Raw Git
blobs of the committed copies match the same pins. The reproducible public pins
are in `scripts/release-handoff/public-contract-hashes.json`; `.gitattributes`
prevents checkout line conversion for those five files. No public protocol change
was made. Private review provenance remains outside this repository and all
release assets. All existing plugin/skill/workspace/package bytes are unchanged
from the reviewed integration, including the three matching 0.9.4 versions.

## Implemented behaviour and acceptance mapping

| Criteria | Evidence and scope |
|---|---|
| 1: portable parity and public-only boundary | Five raw-byte pins; exact public asset allowlist; no private build/source records copied; public text and canonical JSON controls. |
| 2: candidate validation | Wrong product/tag/version, unsupported profiles, all twelve complete profile sets, missing platform/configuration, extra/private files, path/link checks, invalid installer content, size/hash/notice and counterpart controls. |
| 3: approval binding | Real offline command selects exact repository/tag/assets; all-file digest includes manifest/checksum; approval rejects changed identity, counterpart, target or valid changed notice bytes. CI additionally checks independent human review history and the exact payload approval comment. |
| 4: publication/recovery | Fixed GitHub API calls create a draft, upload snapshot buffers, verify complete downloaded bytes/metadata, then publish with `make_latest: false`; existing sets are fully downloaded. Identical published retry has zero writes. Differing/partial/draft/orphan/conflicting states stop without automatic mutation. |
| 5: concrete boundaries | Real CLI entrypoint, consumer, REST adapter and ZIP extractor run against disposable files; only HTTP transport is synthetic. Partial upload, uncertain create, metadata drift, network/authentication failure, pagination and credential-free redirect/public verification controls pass. |
| 6: independent products | Semantic product-specific lookup tests; real unauthenticated metadata lookup returns Docflow `v0.9.4`; Clarity lookup reports no published release. Public download/maintainer guidance distinguishes both channels. |
| 7: checked preparation | Signed product and separate gate commits, required source CI and local results below. Final receipt-head CI is recorded in PR #10 before ready. |
| 8: live acceptance | Pending. No live Clarity release, upload, tag or native installer execution was attempted. |

## Exact process outcomes

Local commands ran on Windows with Node `v24.13.0`; CI ran the same release
controls on Ubuntu with the workflow's Node 22 selection.

| Command/check | Actual result | Exit |
|---|---|---|
| `node scripts/verify.mjs` | `verify: OK (version 0.9.4, 13 skills, 56 ADRs, 67 shipped plan items)` | 0 |
| `node evals/run.mjs` | `10 passed, 0 failed, 6 skipped` | 0 |
| `node --test scripts/release-handoff/contract.test.mjs scripts/release-handoff/consumer.test.mjs` | 65 tests, 65 pass, 0 fail, 0 skipped | 0 |
| `python -B scripts/release-handoff/extract_test.py` | `Ran 6 tests`, `OK` | 0 |
| `actionlint -shellcheck= -pyflakes=` | Version 1.7.12, all workflow syntax/expressions accepted; empty diagnostic output | 0 |
| `git diff --check` | No whitespace defects | 0 |
| Raw committed vendor hash/length comparison | All five match | 0 |
| Real `lookup --product docflow` | Public tag `v0.9.4`, correct product/repository URL | 0 |
| Real `lookup --product docflow-clarity` | `release: FAILED: no published release for the selected product/version` | 1, expected missing-release outcome |

The six model-driven eval cases were not executed. actionlint covered workflow
syntax and expressions; shellcheck/pyflakes were explicitly excluded. The local
actionlint archive matched upstream SHA-256
`6e7241b51e6817ea6a047693d8e6fed13b31819c9a0dd6c5a726e1592d22f6e9`;
the CI archive is independently pinned in the gate. No interrupted or failed
test run is represented as a passing result.

## Limits and remaining acceptance

Synthetic installers prove only structural/header acceptance and byte preservation.
They are not installable, signed, trusted or evidence of an approved producer.
HTTP fixtures exercise concrete request/response boundaries but are not successful
GitHub publication or public downloads. The real metadata lookup is read-only.

The local publisher accepts an operator-controlled approval record, not an identity
certificate. Its operator must review the private producer and native trust evidence
before invocation. The optional workflow also requires main integration, a successful
same-repository run containing an inert public candidate artifact, configured independent
environment reviewers and a review comment binding the exact payload. That staging
transport and environment configuration were not provisioned or invoked here.

Live publication requires separate explicit authority for the exact product, version,
tag, payload digest and public target. Then verify every asset without authentication,
browser access without private permissions, both product lookups and native trust on
the downloaded bytes. The complete candidate is held in memory; provision sufficient
memory for its size. ZIP transport enforces 1,000 entries, 2 GiB per file and 16 GiB
total. The later website, native signing/installer qualification, final operator pilot
and checked main lifecycle completion remain separate pending work.

## Status at a glance

- **This run:** Prepared signed implementation and separate gate controls; static
  verification, deterministic evals, 65 release tests, 6 extraction tests, workflow
  lint and required source CI passed with the exact exits above.
- **Overall:** Verified preparation for coordinator review; no live publication or
  main shipping. Decision stays Accepted and item stays todo.
- **Yet to do:** Final receipt-head CI and coordinator review/integration; separate
  native/producer qualification, final operator pilot, exact-payload publication
  approval, live unauthenticated download/hash/access checks and eventual checked
  main completion. Retain this task branch/worktree until the coordinator resolves it.
