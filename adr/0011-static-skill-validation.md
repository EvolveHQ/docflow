---
adr: 0011
title: Static structural validation of skills and manifests
status: Accepted
date: 2026-06-01
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0001", "0007", "0008"]
tags: [testing, quality, verify-gate]
---

# ADR 0011 — Static structural validation of skills and manifests

## Context

The product is a set of Markdown skills plus JSON manifests
(adr/0007-lifecycle-skills.md, adr/0008-dual-target-packaging.md). The
only automated gate today is `scripts/verify.mjs`, which checks manifest
parsing and version sync — nothing validates the skills themselves. A
malformed `SKILL.md` (missing description, missing required section,
agent-specific prose that breaks dual-target parity, or a leaked ADR
reference) ships undetected. This is the "unit test" tier: cheap,
deterministic, no model in the loop.

## Capability statement

docflow validates the structural integrity of its own skills and
manifests as a fast, deterministic gate that extends the existing verify
gate. The validator asserts, for every `skills/*/SKILL.md` and the
manifests:

- Valid, complete frontmatter (name, description present and non-empty).
- Required structural sections present for the skill's kind.
- **Agent-neutral prose** — no hard-coded agent-specific invocation
  syntax in skill bodies (parity rule from
  adr/0008-dual-target-packaging.md).
- **No ADR-privacy leakage** — no ADR numbers/titles in user-visible
  skill/template/doc surfaces (rule from adr/0004-adr-privacy.md).
- Manifest parsing and `package.json` ↔ `plugin.json` version agreement
  (folds in today's `scripts/verify.mjs`).

It exits non-zero on any violation and is wired as the verify gate, so it
runs before every push.

## User stories / scenarios

- As a maintainer, I want a malformed or parity-breaking skill caught
  locally before push, so regressions never reach users.
- As a coding agent editing a skill, I want a deterministic gate that
  tells me exactly which rule I broke.

## Acceptance criteria

1. A single command (the verify gate) validates all `skills/*/SKILL.md`
   frontmatter and required sections and exits non-zero on any failure.
2. The validator flags agent-specific invocation syntax in skill bodies
   and ADR-reference leakage in user-visible surfaces.
3. Manifest parse + version-sync checks from `scripts/verify.mjs` are
   subsumed by, or invoked from, this validator.
4. The gate runs with no network and no model call.

## Out of scope

- Behavioural correctness of what a skill produces — that is the e2e
  tier, adr/0012-skill-behavioural-evals.md.

## Open questions

- None.

## References / cross-links

- adr/0001-adr-driven-workflow.md
- adr/0004-adr-privacy.md
- adr/0007-lifecycle-skills.md
- adr/0008-dual-target-packaging.md
- adr/0012-skill-behavioural-evals.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-06-01 | r1 | Eugenio Minardi | Initial decision. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-06-01 | — |
