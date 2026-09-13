# PR #5 action-runtime maintenance — 2026-09-13

Verified work HEAD: `0dc3a9523767a185f50919c1cb4ea13535bffafb`.
Owning decision: adr/0050-repository-changes-integrate-through-checked-pull-requests.md;
plan 0055 is routine CI maintenance, with no decision revision.

The [previous verify run](https://github.com/EvolveHQ/docflow/actions/runs/34746862503/job/103696267282)
passed with a Node 20 deprecation annotation naming checkout@v4 and
setup-node@v4. These are the actions' internal runtimes; the workflow's
configured Node 22 test runtime was not the cause. The
[GitHub migration notice](https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/)
requires action versions that run on Node 24.

Official release/tag and action.yml data checked on 2026-09-13:

| Workflow reference | Stable release | Resolved commit | Declared runtime |
|---|---|---|---|
| actions/checkout@v7 | [v7.0.1](https://github.com/actions/checkout/releases/tag/v7.0.1) | `3d3c42e5aac5ba805825da76410c181273ba90b1` | node24 |
| actions/setup-node@v7 | [v7.0.0](https://github.com/actions/setup-node/releases/tag/v7.0.0) | `820762786026740c76f36085b0efc47a31fe5020` | node24 |

Both releases are non-draft and non-prerelease; each major tag matches its
stable release commit. The two-line workflow change keeps major-tag pinning,
Node 22, all three gate commands, triggers, read-only permissions and verify.
No runtime override flags or new harness were added. The workflow commit is
separate from plan/audit metadata; all commits are signed.

Compatibility review: the [checkout README](https://github.com/actions/checkout/blob/3d3c42e5aac5ba805825da76410c181273ba90b1/README.md)
requires runner 2.327.1+ for Node 24, moves persisted credentials under runner
temp, and restricts unsafe fork checkout for pull_request_target/workflow_run.
This workflow uses ordinary pull_request/push events and no Docker action.
The [setup-node README](https://github.com/actions/setup-node/blob/820762786026740c76f36085b0efc47a31fe5020/README.md)
documents automatic npm caching, but this package declares neither triggering
package-manager field and the workflow requests no cache. ESM internals and
removed npm-auth inputs need no caller changes here.

[Fresh work-head verify](https://github.com/EvolveHQ/docflow/actions/runs/34747659620/job/103698443698)
passed on runner 2.337.0 and Node 22.23.2. Logs confirm the resolved action
commits above. The check-run annotations endpoint returned **zero annotations**;
the full log had **zero Node 20 deprecation/forced-runtime warnings** and no
warning markers. Local gates and this CI run each passed, exit 0:

- `verify: OK (version 0.9.4, 9 skills, 50 ADRs, 62 shipped plan items)`.
- `verify mutations: OK (15 rejected mutations)`.
- `6 passed, 0 failed, 6 skipped` (the six model cases remain unexecuted).

Completion adds one prepared plan record after this verified work HEAD.
The final commit requires a fresh verify run and annotation/log inspection;
that delivery receipt is recorded on [PR #5](https://github.com/EvolveHQ/docflow/pull/5).
Plan 0051, product versions and historical receipts remain unchanged.

## Status at a glance

- **This run:** verified stable Node 24 action releases, changed two workflow references, and confirmed all gates plus zero warning annotations/log matches at the work HEAD above.
- **Overall:** verified for this maintenance at the named work HEAD; completion is prepared and effective only on the operator's checked merge. Overall host/release evidence remains partially verified.
- **Yet to do:** final-commit CI and warning inspection recorded on PR #5; plan 0051's outstanding host/release checks; operator review and merge. No release or merge was performed by this run.
