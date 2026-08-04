# ADR Index

Generated from ADR metadata. Do not hand-edit — regenerate after any
ADR change.

| ADR | Title | Status | Date | Depends on |
|-----|-------|--------|------|------------|
| [0001](adr/0001-adr-driven-workflow.md) | Documentation-led, ADR-driven workflow as the product | Implemented | 2026-05-21 | — |
| [0002](adr/0002-assessment-driven-bootstrap.md) | Interactive assessment-driven bootstrap | Superseded | 2026-05-21 | 0001 |
| [0003](adr/0003-backfill-retrofit.md) | Backfill — retrofit existing repos and capture undocumented developments | Implemented | 2026-05-21 | 0001, 0002 |
| [0004](adr/0004-adr-privacy.md) | ADRs are internal artefacts, never user-visible | Implemented | 2026-05-21 | 0001 |
| [0005](adr/0005-multi-agent-coordination.md) | Configurable multi-agent coordination modes | Implemented | 2026-05-21 | 0001 |
| [0006](adr/0006-integration-model.md) | Configurable integration model (direct-to-main vs PR-based) | Implemented | 2026-05-21 | 0001, 0005 |
| [0007](adr/0007-lifecycle-skills.md) | Lifecycle skills for the ADR and plan loop | Implemented | 2026-05-22 | 0001 |
| [0008](adr/0008-dual-target-packaging.md) | Dual-target packaging from one skill source | Superseded | 2026-05-22 | 0001, 0007 |
| [0009](adr/0009-distribution-marketplace-npm.md) | Distribution via self-hosted marketplace and npm/pi package | Implemented | 2026-05-22 | 0008 |
| [0010](adr/0010-worktree-conflict-reconciliation.md) | Content-level conflict reconciliation across worktrees | Implemented | 2026-06-01 | 0005, 0007 |
| [0011](adr/0011-static-skill-validation.md) | Static structural validation of skills and manifests | Implemented | 2026-06-01 | 0001, 0007, 0008 |
| [0012](adr/0012-skill-behavioural-evals.md) | Behavioural and end-to-end evaluation of skill outcomes | Implemented | 2026-06-01 | 0001, 0011 |
| [0013](adr/0013-interactive-assessment-protocol.md) | Standard interactive assessment protocol for skills | Implemented | 2026-06-02 | 0006, 0007 |
| [0014](adr/0014-concurrency-guardrails.md) | Concurrency guardrails for ADR and plan creation | Implemented | 2026-06-02 | 0001, 0006, 0010, 0013 |
| [0015](adr/0015-multi-target-portability.md) | Multi-target portability — one skill source, many coding agents | Implemented | 2026-06-03 | 0001, 0007, 0009 |
| [0016](adr/0016-layered-artifact-model.md) | Layered artifact model — minimal core, opt-in layers | Implemented | 2026-06-17 | 0001 |
| [0017](adr/0017-configurable-artifact-root.md) | Configurable artifact root — control the repo footprint | Implemented | 2026-06-17 | 0013, 0016 |
| [0018](adr/0018-wip-stays-out-of-catalogue.md) | Work-in-progress stays out of the ADR catalogue | Implemented | 2026-06-17 | 0001, 0013, 0014 |
| [0019](adr/0019-multirepo-topology.md) | Multirepo topology for a single product | Implemented | 2026-06-22 | 0001, 0016 |
| [0020](adr/0020-federation-bootstrap-establish-join.md) | Federation bootstrap — establish vs join | Implemented | 2026-06-22 | 0019, 0013, 0003 |
| [0021](adr/0021-cross-repo-identity-numbering.md) | Cross-repo ADR identity and numbering | Implemented | 2026-06-22 | 0019, 0023 |
| [0022](adr/0022-cross-repo-reference-scheme.md) | Cross-repo reference scheme | Implemented | 2026-06-22 | 0021, 0023 |
| [0023](adr/0023-federation-config-membership-index.md) | Federation config and membership index | Implemented | 2026-06-22 | 0017, 0019, 0020 |
| [0024](adr/0024-federated-rollup-catalogue.md) | Federated roll-up catalogue | Implemented | 2026-06-22 | 0021, 0022, 0023 |
| [0025](adr/0025-cross-repo-plan-ownership.md) | Cross-repo plan ownership | Implemented | 2026-06-22 | 0021 |
| [0026](adr/0026-cross-repo-status-completion.md) | Cross-repo status and completion | Implemented | 2026-06-22 | 0025, 0024 |
| [0027](adr/0027-convention-template-propagation.md) | Convention and template propagation across the federation | Implemented | 2026-06-22 | 0019, 0023, 0028 |
| [0028](adr/0028-cross-repo-audit.md) | Cross-repo audit | Implemented | 2026-06-22 | 0022, 0023, 0024 |
| [0029](adr/0029-seed-adr-recording-the-method.md) | Seed ADR recording the adopted method | Implemented | 2026-06-28 | 0001, 0003, 0016, 0018 |
| [0030](adr/0030-domain-grouping.md) | Domain grouping — navigate the catalogue by area | Implemented | 2026-06-30 | 0016 |
| [0031](adr/0031-tiered-assessment-depth.md) | Tiered assessment depth — express, guided, full | Implemented | 2026-07-03 | 0013 |
| [0032](adr/0032-bootstrap-depth-profiles.md) | Bootstrap express and guided profiles | Implemented | 2026-07-03 | 0016, 0017, 0020, 0029, 0030, 0031 |
| [0033](adr/0033-artefact-root-discovery.md) | Artefact-root discovery contract | Implemented | 2026-07-03 | 0017, 0023 |
| [0034](adr/0034-record-contract.md) | Explicit record contract — cooperative guarantee and capability manifest | Implemented | 2026-07-25 | 0011, 0016, 0033 |
| [0035](adr/0035-per-criterion-evidence.md) | Per-criterion verification — bound evidence records | Implemented | 2026-07-25 | 0007, 0011, 0012, 0034 |
| [0036](adr/0036-enumerated-constraints.md) | Constraints as an enumerated, decision-gated artefact | Implemented | 2026-07-29 | 0016, 0034, 0035 |
| [0037](adr/0037-recorded-abandonment.md) | Deliberate abandonment is a recorded terminal state | Implemented | 2026-07-29 | 0001, 0034, 0035 |
| [0038](adr/0038-capability-spec-records.md) | Capability specs — living, slug-identified records | Implemented | 2026-07-29 | 0016, 0034, 0035, 0036, 0037 |
| [0039](adr/0039-record-model-choice.md) | The record model is a bootstrap choice — capability-first stays the default | Implemented | 2026-07-29 | 0002, 0032, 0038 |
| [0040](adr/0040-challenge-and-router.md) | A convergent challenge skill; brainstorm becomes the router | Implemented | 2026-07-29 | 0007, 0013, 0036, 0038 |
| [0041](adr/0041-goals-layer.md) | Goals layer — the top of the traceability chain | Implemented | 2026-07-31 | 0016, 0034, 0035, 0038, 0040 |
| [0042](adr/0042-validation-loop.md) | Validation loop — outcome records, four verdicts, harm findings | Implemented | 2026-07-31 | 0036, 0040, 0041 |
| [0043](adr/0043-candidate-branch-development.md) | Candidate-branch development — main is the released line | Implemented | 2026-08-04 | 0001 |
| [0044](adr/0044-graded-autonomy.md) | Graded autonomy — the L0–L5 ladder in the manifest | Implemented | 2026-08-04 | 0034, 0036, 0041, 0042 |
| [0045](adr/0045-model-migration.md) | Model migration — the deliberate path, the mapping, evidence rebinding | Implemented | 2026-08-04 | 0035, 0038, 0039 |
| [0046](adr/0046-release-ritual.md) | Release ritual — promotion and publication as one gated skill | Implemented | 2026-08-04 | 0015, 0043, 0044 |

## Goals

| Goal | Title | State | Horizon | Review by |
|---|---|---|---|---|
| [G-aligned-autonomy](goals/G-aligned-autonomy.md) | Agents build unattended within recorded boundaries | Active | 2026-Q4 | 2026-10-31 |
| [G-external-adoption](goals/G-external-adoption.md) | docflow drives repos beyond its own | Active | 2027-Q1 | 2026-12-31 |
| [G-one-zero](goals/G-one-zero.md) | A published 1.0 gated by behavioural evals | Active | 2026-Q4 | 2026-11-30 |
