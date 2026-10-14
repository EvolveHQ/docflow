# 0080 — Pages onboarding and prompt-first guides

Owning decisions: adr/0051-portable-workspace-memory-contract.md (AC 1, native boundaries), adr/0059-five-workspace-commands-and-mandate-note.md (AC 2, 4), adr/0060-v1-package-target-set.md (AC 1–3), adr/0061-v1-workspace-host-guides.md (AC 2, 5–6). Federation explanation also traces to adr/0019-multirepo-topology.md (AC 3–6), adr/0024-federated-rollup-catalogue.md (AC 1–5) and adr/0025-cross-repo-plan-ownership.md (AC 1–6). Existing distribution decision: adr/0009-distribution-marketplace-npm.md. This item documents their released behaviour; broader native qualification stays in its existing items.

## Status

- Claimed by: Codex, GPT-6 Astra xhigh, sole Docflow writer, 2026-10-14, branch `docs/pages-onboarding`.
- Blockers: None for the accepted local documentation scope.
- Stopped: —; resumed 2026-10-14 for the operator-requested methodology visual and grouped FAQ. Existing sole-writer claim retained; local-only scope unchanged.

## Scope

Operator follow-up, 2026-10-14: add a visual explanation of federation versus portable workspaces to the methodology, with a grouped FAQ. Explain their distinct purposes and coexistence using existing released behaviour; retain the restored visual style, all existing anchors and the running local/tailnet preview. No new product decision or support claim.

Operator review amendment, 2026-10-14: restore the previous visual style while keeping the new content and navigation. Reuse the released palette, serif headings, amber buttons, brand treatment and artwork; preserve the current accessibility and responsive behaviour. This is a continuation of this owned item, not another implementation claim.

Implement the operator-accepted 2026-10-13 Pages proposal: compact Jekyll home; Start here definitions, single-repository and multi-repository paths; minimal host-specific setup; prompt-first workflow guides; persistent navigation and breadcrumbs; reference for assembly, schema, skills and qualification; README/USAGE alignment. Preserve scenario URLs and important anchors. Keep command uncertainty explicit, including Grok. Evidence stays in the operator-selected external workspace handoff.

No skill/runtime/schema/version changes, expanded support claims, installed configuration changes, Clarity work, push, PR, merge, npm publication or Pages deployment. The operator's local-only instruction overrides the autonomous contract's draft-PR step. No other existing claim is acquired.

## Dependencies

Clean released main `f0799fd87ad580b4e6a29c762709288cf3752c86`; accepted proposal and explicit implementation instruction. No new dependency or product decision.

## Exit criteria

1. Home explains Docflow and exposes Start here in the first 390px-wide viewport. Start here defines plugin/skill/host/repository and separates one repository from several; installation and invocation are accurate for all eight targets, with JavaScript-free access.
2. Every workflow has its selected root, use case, prerequisites, prompt, expected result, check and next step. Guided single-repository setup includes a plan queue. Existing, ordinary-folder, resumed, mixed/future-member and all-new routes preserve native boundaries and current authority.
3. Persistent header, breadcrumbs, desktop section navigation and keyboard-accessible mobile disclosure work. All existing permalinks and important fragments resolve; reference retains manual assembly, validator/schema, fourteen skills, seven distinct host guides and qualification limits.
4. Actual Jekyll 3.10 safe build and rendered checks at 1440, 390 and 320px pass: no document overflow, readable prompts, obvious first action, keyboard/skip/menu/focus and 200% zoom; local links/anchors and source-bound commands checked. Screenshots and logs are external.
5. `node scripts/verify.mjs` and `node evals/run.mjs` exit 0 with unmodified gates; record actual results and limits. Signed local commits leave a clean branch.
6. Local server serves the rendered site at `/docflow/`, survives the agent/tab, and remains running. External result records exact SHA, plan status, exits, screenshots, URL, PID/port/restart/log and remaining review/publication steps. Item remains todo for this local-only phase; no shipped claim.

7. Methodology includes a readable, accessible visual comparison at 1440, 390 and 320px: federation is optional, workspaces do not require it, both can coexist, native ownership remains local. A linked FAQ groups concise source-faithful answers by topic, works with keyboard and without JavaScript, and remains readable at 200% zoom.

## Prior receipt (superseded when this follow-up is verified)

Verified rendered work: `99d856595877ec7a5f07c35e3ba96633bab15f21`.

- `node scripts/verify.mjs`: `verify: OK (version 0.10.0, 14 skills, 63 ADRs, 69 shipped plan items)`, exit 0. `node evals/run.mjs`: `13 passed, 0 failed, 0 skipped`, exit 0; explicitly hostless.
- Jekyll 3.10 safe build, exit 0. External `check-links.py`, exit 0: 24 pages, 955 local links/assets/anchors, all baseline fragments retained. External `review.cjs`, exit 0: 72 page/viewport checks, 25 interactions; `journeys.cjs`, exit 0: 23 checks. Actual Chromium 200% zoom and deep-link refresh regression passed. Scratch assembly/frozen fixture exits 0; deliberately invalid fixture exits 1 as expected.
- Visual identity restored from released source after operator review; new guide content, navigation data and host-selection JavaScript unchanged.
- Tailnet preview: `https://omkrgb.tail1a701.ts.net:8443/docflow/`; local preview: `http://localhost:52447/docflow/`, persistent user service `docflow-pages-preview-20261014.service`. External operator-selected handoff holds screenshots, exact process/restart details, command evidence and source-bound final result. No product, schema, gate or version changes; no push/PR/publication.

## Status at a glance

- **This run:** resuming the owned item for the requested visual explanation and grouped FAQ; the restored preview remains available while work proceeds.
- **Overall:** verified locally, unshipped. This item remains in todo; no completion move or owning-decision advancement is prepared without the next integration phase.
- **Yet to do:** operator review, then separately authorised integration/publication. Grok install resolution and full native/Clarity qualification remain outside this item and retain their existing limits.
