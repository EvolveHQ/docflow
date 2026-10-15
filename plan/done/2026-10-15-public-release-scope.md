# 0082 — Public release documentation scope

Owning ADRs: adr/0051-portable-workspace-memory-contract.md (AC1, AC5–6), adr/0056-public-clarity-installer-handoff.md (AC6), adr/0061-v1-workspace-host-guides.md (AC2, AC5–6), adr/0057-bounded-verification-evidence.md (AC1–4).

## Scope

Keep Docflow release documentation focused on its published features. Review the README, usage guide, site and packaged public documentation; retain accurate package and native-host qualification boundaries. Preserve established URLs, anchors and navigation with concise package guidance. Documentation only: no skill, runtime, version or gate changes.

## Exit criteria

1. Public release copy describes Docflow features and usage without unrelated project planning; legitimate workspace concepts and native-host limits remain accurate.
2. The existing release-help route, title, navigation and anchors resolve to neutral Docflow guidance.
3. Static verify, all 13 deterministic evals, isolated safe Jekyll build, rendered route/navigation checks and targeted content review pass. Package comparison accounts for intended documentation bytes only.
4. Signed Conventional Commits and a ready PR to main carry a concise verification receipt; prepare completion only after verified criteria, with actual PR URL and work HEAD.

## Dependencies

None for this operator-authorised bounded documentation task. Broader owning decision criteria retain their existing status and queue items.

## Verification receipt

Verified work HEAD `56ba7e9`:

- `node scripts/verify.mjs`: exit 0, `verify: OK (version 0.10.0, 14 skills, 63 ADRs, 71 shipped plan items)`.
- `node evals/run.mjs`: exit 0, 13 passed, 0 failed, 0 skipped.
- `node --test evals/repository-producer.test.mjs`: exit 0, 27 passed.
- `GEM_HOME=/tmp/hq-qa/docflow-release-pages-gems GEM_PATH=/tmp/hq-qa/docflow-release-pages-gems /tmp/hq-qa/docflow-release-pages-gems/bin/jekyll build --safe --source docs --destination /tmp/hq-qa/docflow-public-docs-pages`: exit 0.
- `python /tmp/hq-qa/check-docflow-public-docs.py`: exit 0; 25 HTML pages, 873 local links/anchors, all 9 prior release-help IDs preserved, targeted public-content review passed.
- `npm pack --json --pack-destination /tmp/hq-qa/docflow-public-docs-pack-work`: exit 0; all 384 payload paths preserved, 15 intended documentation/receipt files changed, all remaining bytes identical. SHA-256 `3b1565892f0c9bbb837e2034ac0cfc45b1af0f66701799f07f83d63959aa8d69`.

Owning decisions retain their existing states: this bounded documentation item completes no broader qualification or publication criterion. ADR metadata and the derived INDEX remain unchanged.

## Shipped footer (prepared for checked merge)

Shipped on checked merge of [PR #31](https://github.com/EvolveHQ/docflow/pull/31); verified work HEAD `56ba7e919d6d76f274f30b34b7da3944d3be84eb`.
Prepared completion on `docs/public-release-scope`, effective only on checked merge into main.

## Status at a glance

- **This run:** plan 0082 implemented; listed local checks exit 0; completion prepared on ready PR #31.
- **Overall:** locally verified work on an unmerged PR; not shipped.
- **Yet to do:** final-head checks/push and current-head required CI tracked in the PR; maintainer review and separately authorised merge. Branch/worktree retained.
