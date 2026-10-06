---
adr: 0062
title: Executable native host qualification rounds
status: Accepted
date: 2026-09-21
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0012", "0060"]
tags: [evals, hosts, qualification, v1]
---

# ADR 0062 — Executable native host qualification rounds

## Context

adr/0012-skill-behavioural-evals.md separates deterministic assertions from
behavioural execution and leaves the behavioural runner as a host-owned
mechanism. In practice qualification rounds produced receipt-only pull
requests: the real work happened in manual, unrepeatable host sessions and the
committed evidence was prose. The static `verify` gate is fast and hostless by
design, so the behavioural matrix lived outside any executable command.

The V1 package set of adr/0060-v1-package-target-set.md is eight coding agents.
`evals/hosts/` already carried a Dockerfile, per-case checkers, prepare
scripts, prompts and dated results. The gap is not capability but execution:
nothing drives a host through the whole matrix non-interactively and emits
machine-readable results that a receipt can be generated from.

The operator mandate of 2026-09-21 directs that a qualification round becomes a
test run of an executable harness, that the evidence is reproducible, and that
the pull request carries code rather than a hand-written receipt.

## Capability statement

A single opt-in runner, `evals/hosts/qualify.mjs`, drives each installed host
non-interactively through the qualification case set under hard isolation and
writes machine-readable results; a receipt is rendered from those results, not
written by hand. The catalogue mixes host-interface cases (what a host loads
and the bytes it installs), product cases (the shipped workspace validator over
authority, mandate, recovery and scope), and skill cases (a host turn runs a
lifecycle skill and an external checker judges the result). The static `verify`
gate stays fast and hostless. The behavioural evals that previously reported
SKIPPED for want of a host are retired to this harness.

## User stories / scenarios

- As the maintainer, I want a qualification round to be one command whose
  output I can commit, so that evidence is reproducible rather than retyped.
- As the maintainer, I want each of the eight package targets to declare which
  cases it can run and why not otherwise, so that "blocked" and "unrun" are
  never mistaken for "pass".
- As a reviewer, I want the pull request to carry the harness code and a
  generated receipt, so that I can judge the run, not a summary of it.
- As the operator, I want the harness to abort any case whose working directory
  or target escapes its scratch root, so that my real configuration and
  repositories are never touched.

## Acceptance criteria

1. `evals/hosts/qualify.mjs` runs a host id and a case set end to end without
   interaction; every case is bounded at 900 s and aborts unless its cwd
   resolves under the scratch root.
2. Per-host adapters exist for claude, pi, codex, opencode, grok, cursor, omp
   and copilot. Each launches, names key environment overrides for a disposable
   config home, installs, and discovers; each declares the cases it cannot run
   and why.
3. Native installs operate on a staged copy of the branch; the operator's
   working tree and real host configuration are never written.
4. The case catalogue is data and asserts observable facts only: discovery of
   all fourteen skills, install byte-match against the branch, the authority
   matrix (current/missing/expired/conflicting), mandate-note valid and adverse,
   fresh-session recovery read-only, scope vs new-plan disjointness, dispatch
   brief and refusal, sync reconcile and prepared-not-complete, and the
   bootstrap/new-plan/ship-item regressions. No case accepts model prose.
5. Each run writes a machine-readable result per host and case with status
   (pass/fail/blocked/unrun), cause, exit code, duration, hashes and source
   revision, and the harness emits the plan-item receipt from those results.
6. `evals/run.mjs` exposes the harness as an opt-in tier and the deterministic
   suite reports no SKIPPED cases; the six retired behavioural cases are owned
   by the harness.
7. `node scripts/verify.mjs` and `node evals/run.mjs` stay green, and the
   harness has been run on the installed hosts with its receipt committed.

## Out of scope

- Completing every model-driven skill case on every host; adapters that need a
  credential report `blocked` and cases without a launcher report `unrun`, both
  honestly.
- Replacing the Docker-based `evals/hosts` fixtures or their checkers; the
  harness reuses them.
- Any release, tag or version bump; the version stays 0.9.4.

## Open questions

None.

## References

- adr/0012-skill-behavioural-evals.md
- adr/0060-v1-package-target-set.md
- Operator mandate note,
  `.docflow_workspace/mandates/2026-09-21-automated-host-qualification.md`
  at revision `54edfbb`.

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-09-21 | r1 | Eugenio Minardi | Initial decision: qualification rounds become executable harness runs, the host matrix is wired as an opt-in tier, and the skipped behavioural cases are retired. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Operator | Eugenio Minardi | 2026-09-21 | operator mandate note 54edfbb |
