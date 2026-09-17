# Workspace foundations verification — W1/W2

Source: `42ba9322e7b46e603f2a79d3185afbfee5327327`.
Base: `7766e7272e8ec5b882b6d7380595ff482a09de3e`.
Task branch: `kmox83/docflow-v1-workspace-foundations`.
PR: https://github.com/EvolveHQ/docflow/pull/8, targeting
`kmox83/docflow-v1-integration`. Integration-ready foundations, not shipped
to main. The coordinator owns serial integration; the operator retains main,
release and publication review.

## Outcome and scope

Recorded the approved memory and authority decisions in ADRs 0051/0052 and
claimed plan 0054 before implementation. Signed initial commit `8d9770e`
passed both local required commands and opened draft PR #8 before product
edits. Signed implementation `42ba932` adds the portable schema, validator,
five initial-state record forms, registry, skeleton entry points, separate
grant/brief/receipt forms, role/profile/source/recommendation fields and a
synthetic two-repository producer fixture with adverse mutation recipes.

Templates remain in bootstrap's existing flat template home. Executable
validator/tools live outside the skills tree at `plugins/docflow/workspace/`.
The npm allowlist includes those assets. Detached skill copies explicitly
install the sibling asset directory; plugin, npm, symlink and detached
Codex/OpenCode/Claude layouts are exercised without a source checkout at
the resolved install location. Actual native discovery remains separate.

The implementation commit names the **Tighten-and-repair** exception:
static privacy/schema and deterministic eval coverage expanded alongside
the product fixtures and package repairs they judge. Prior checks remain.
Versions stay synchronised at 0.9.4. All nine SKILL.md files and all nine
interface sidecars are byte-identical to the assigned base in Git; this
does not extend PR #7's native evidence to the new workspace assets.

## Exact verification

The [machine receipt](2026-09-15-workspace-foundations.json) retains complete
stdout/stderr, process exit codes, environment, source SHA and SHA-256 for
every distributed workspace/template Git blob. The local environment was
Windows with Node.js v24.13.0; required CI uses Node.js 22 on Ubuntu.

| Command | Exact summary | Exit |
|---|---|---|
| `node scripts/verify.mjs` | `verify: OK (version 0.9.4, 9 skills, 52 ADRs, 67 shipped plan items)` | 0 |
| `node evals/run.mjs` | `7 passed, 0 failed, 6 skipped` | 0 |
| `node --test evals/workspace.test.mjs` | `tests 63`, `pass 63`, `fail 0`, `cancelled 0`, `skipped 0`, `todo 0` | 0 |
| `node scripts/verify-mutations.mjs` | `verify mutations: OK (15 rejected mutations)` | 0 |
| `git diff --check` | No whitespace errors | 0 |
| `git verify-commit 42ba932` | Good EDDSA signature; both task commits report `G` | 0 |

The targeted suite invokes `npm pack --dry-run --json --ignore-scripts`
and checks actual packed contract/validator/fixture member paths. The suite
also exercises the installed CLI on independent package-layout copies.
No npm package was published.

[Required verify CI](https://github.com/EvolveHQ/docflow/actions/runs/34909919520/job/104194901655)
passed on `42ba9322e7b46e603f2a79d3185afbfee5327327`. Later report-only commits
require their own current-head CI before the task PR becomes ready.

## Acceptance mapping

| Owning criteria | Implementation and concrete controls |
|---|---|
| 0051 AC1, AC3 | CONTRACT.md, initial-state forms and valid empty/planned/partial/complete workspaces; native numbered/API and issue/mobile methods preserved; accepted agreement remains accepted after completion. |
| 0051 AC2, AC4 | Strict JSON-compatible YAML, duplicate decoded keys, malformed/unsupported fields, full UUID duplicates, prefix extension/ambiguity, path immutability, cyclic dependencies/successors, missing members, sibling/absolute member roots and escaping symlinks. |
| 0051 AC5, AC6 | Packaged producer assets, npm contents and five target installation-layout controls, privacy/schema gates and unchanged existing skills/versions. |
| 0052 AC1, AC2 | Work-owned grant histories, separate run brief/claim/receipt, native evidence and resources; selection, interruption, reconciled reassignment, revocation and partial completion fixture. |
| 0052 AC3, AC4 | Actor/scope/revision/action/expiry/revocation negatives, per-action native claim expiry, owner-confirmed serial fallback, unknown predecessor preservation, two-workspace member overlap, shared resources and native path-move history. |
| 0052 AC5, AC6 | Skipped/nonzero/stale/wrong-revision evidence fails; complete outcome stays separate from accepted agreement; machine and human reports explicitly limit deterministic claims. |

## Review findings and repairs

The coordinator independently reproduced three defects in interim working
bytes: a historical action after native claim expiry passed, object-key
reordering caused a false native-reference mismatch, and an unregistered
record home with resources threw instead of returning diagnostics. These
were repaired and independently re-probed by the coordinator before this
commit. Permanent controls cover them plus an unregistered linked work home.

Historical native references now resolve a missing current file through
read-only local Git object inspection at the declared revision. A real local
Git tree/path-move control preserves old briefs without rewriting history;
unknown objects and escaping/historical symlink paths fail. A current running
brief still matches its delivery's current native work. Supplied revision
strings and synthetic fixture facts are not independent proof of execution.

The actual npm pack inspection exposed that the fixture's adopter-style
`.gitignore` omitted synthetic member files. A local `.npmignore` explicitly
includes them, and the real pack-list regression protects this path.

The initial evidence-output wrapper failed with exit 1 because its Windows
cp1252 console could not print a Unicode arrow after the eval gate had
returned exit 0. No receipt was written by that wrapper. Collection was
repeated with explicit UTF-8; all four commands returned exit 0 and their
complete outputs are retained. This was a report-collection failure, not a
product-gate failure or an omitted failed result.

## Clarity handoff

Pin the following to source `42ba9322e7b46e603f2a79d3185afbfee5327327`:

- `plugins/docflow/workspace/CONTRACT.md` — encoding, ownership, semantics,
  temporal checks, historical native references and diagnostic behaviour.
- `plugins/docflow/workspace/schema.json` — typed root definitions; object
  key order is insignificant, array order and immutable histories matter.
- `plugins/docflow/workspace/fixtures/manifest.json` and `two-repository/`
  — expected accepted agreement, active parent, complete provider and
  incomplete consumer, plus source paths for all five memory kinds.
- `plugins/docflow/workspace/fixtures/adverse.json` and `materialise.mjs`
  — reproducible negative producer inputs and expected diagnostic codes.
- `plugins/docflow/workspace/validate.mjs` — read-only reference validator.

Run from the installed workspace asset directory:

```text
node validate.mjs fixtures/two-repository --at 2026-09-15T13:00:00Z
node fixtures/materialise.mjs invalid-agreement-state <new-destination>
node validate.mjs <new-destination> --at 2026-09-15T13:00:00Z
```

Expect exits 0, 0 and 1 respectively. Consumer view/copy/handoff leaves
canonical bytes unchanged; authorised host edits appear after refresh.
Malformed/incomplete workspaces still return readable parsed records and
diagnostics, never implied authority or a fabricated completed outcome.

## Remaining limits

These are cooperative records and deterministic consistency checks, not an
authentication layer, live ownership service, scheduler or independent
attestation. Synthetic SHA values, mandates and check results are labelled
examples. Qualification of all eighteen scenarios, native hosts and Clarity
belongs to later work; six existing model-dependent eval cases remain skipped
by the deterministic runner. Five product targets, six workspace guides,
three Clarity platforms and the operator's final V1 verification retain
their full acceptance requirements.

No W3 skill, parent document, sibling repository, main ref, tag, release,
public artefact share or worktree deletion is part of this task. Item 0054
remains in todo and both decisions Accepted pending final-main review and
the repository's actual completion event.

## Status at a glance

- **This run:** Implemented and verified W1/W2 on signed source `42ba932`;
  static gate exit 0, deterministic evals 7/0/6 exit 0, targeted tests 63/63
  exit 0, mutation controls 15 rejected exit 0, and required source CI passed.
- **Overall:** verified for bounded foundations; integration-ready, not shipped to main.
- **Yet to do:** Current-head CI for the report commit, coordinator inspection
  and serial integration, operator main review; W3/W4/Clarity/full V1 and
  release acceptance remain separate. Task branch/worktree are retained.
