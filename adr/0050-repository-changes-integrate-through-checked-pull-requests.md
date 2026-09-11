---
adr: 0050
title: Repository changes integrate through checked pull requests
status: Accepted
date: 2026-09-11
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0006", "0011", "0044"]
tags: [governance, integration, ci]
---

# ADR 0050 — Repository changes integrate through checked pull requests

## Context

The repository documents direct-to-main fast-forward integration while its
development history contains pull-request merges. The operator chose PRs
with required checks and standard merge commits during the PR #5 audit.
This chooses a profile for this repository; the plugin still supports both
integration models defined in adr/0006-integration-model.md.

## Capability statement

Changes to docflow's development branch main arrive through pull requests
with the static gate and deterministic regressions required at the current
head. Standard merge commits preserve signed constituent commits and the
separation between gate changes and files they judge. Squash and rebase
merges are disabled. The local gate passes before every push. The operator
controls merge and release authorisation; an instruction to update a PR
does not authorise merging it. Prepared completion changes live in the PR;
they become shipped only when that PR is confirmed merged into main.

## User stories / scenarios

- As a reviewer, I assess the complete change and its required checks before integration.
- As a maintainer, I retain signed commits and can inspect gate changes separately.

## Acceptance criteria

1. AGENTS.md, CONVENTIONS.md and the run prompt agree on PR integration with standard merge commits.
2. CI runs the static gate and deterministic regressions for pull requests and main.
3. Main requires a pull request and the named checks; squash/rebase merges are disabled and merge commits enabled.
4. Completion moves, status advances and regenerated INDEX rows are in the PR before ready; an unmerged PR is reported as ready rather than shipped.
5. Existing signing, Rationale footer, gate integrity and explicit release authorisation rules remain enforceable.

## Out of scope

- Changing the plugin's supported integration models or publishing a release.
- Rewriting historic merge commits or promoting an archived candidate branch.

## Open questions

- None.

## References

- adr/0006-integration-model.md
- adr/0044-development-returns-to-main.md
- https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-09-11 | r1 | Eugenio Minardi | Proposed and accepted in the operator session: checked PRs with standard merge commits replace this repository's direct-to-main profile. Implementation pending. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-09-11 | Explicit operator choice in PR #5 audit session |
