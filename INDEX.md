# ADR Index

Generated from ADR metadata. Do not hand-edit — regenerate after any
ADR change.

| ADR | Title | Status | Date | Depends on |
|-----|-------|--------|------|------------|
| [0001](adr/0001-adr-driven-workflow.md) | Documentation-led, ADR-driven workflow as the product | Implemented | 2026-05-21 | — |
| [0002](adr/0002-assessment-driven-bootstrap.md) | Interactive assessment-driven bootstrap | Superseded | 2026-05-21 | 0001 |
| [0003](adr/0003-backfill-retrofit.md) | Backfill — retrofit existing repos and capture undocumented developments | Implemented | 2026-05-21 | 0001, 0002 |
| [0004](adr/0004-adr-privacy.md) | ADRs are internal artefacts, never user-visible | Implemented | 2026-05-21 | 0001 |
| [0005](adr/0005-multi-agent-coordination.md) | Configurable multi-agent coordination modes | Superseded | 2026-05-21 | 0001 |
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
| [0034](adr/0034-adr-shape-as-declared-metadata.md) | ADR shape as declared metadata, one contiguous sequence | Implemented | 2026-09-04 | 0001, 0007, 0029, 0030 |
| [0035](adr/0035-range-numbered-catalogue-migration.md) | Compatibility and migration for range-numbered catalogues | Implemented | 2026-09-04 | 0034, 0003, 0028 |
| [0036](adr/0036-coordination-directory-holds-only-what-git-cannot-tell-you.md) | The coordination directory holds only what git cannot tell you | Accepted | 2026-09-04 | 0001, 0005, 0006, 0016 |
| [0037](adr/0037-shipped-record-is-git-and-plan-done.md) | The shipped-work record is git history and plan/done | Proposed | 2026-09-04 | 0036, 0001, 0007 |
| [0038](adr/0038-in-flight-state-derived-from-branches-and-pull-requests.md) | In-flight state is derived from branches and pull requests | Proposed | 2026-09-04 | 0036, 0006, 0010, 0014 |
| [0039](adr/0039-plan-item-carries-its-own-status.md) | A plan item carries its own live status; the snapshot file is retired | Proposed | 2026-09-04 | 0036, 0001 |
| [0040](adr/0040-coordination-directory-migration.md) | Compatibility, clean-up, and migration of existing coordination directories | Proposed | 2026-09-04 | 0036, 0037, 0038, 0039, 0033, 0035 |
| [0041](adr/0041-status-at-a-glance-reporting-convention.md) | Status at a glance — every report says what was achieved and what is missing | Proposed | 2026-09-04 | 0001, 0007 |
| [0042](adr/0042-skills-end-every-run-with-status-at-a-glance.md) | docflow's own skills end every run with Status at a glance | Proposed | 2026-09-04 | 0041, 0007, 0011, 0012 |
| [0043](adr/0043-persisted-reports-carry-status-at-a-glance.md) | Persisted reports carry Status at a glance — pull-request bodies, wave summaries, stop entries | Proposed | 2026-09-04 | 0041, 0006, 0038, 0039 |
| [0044](adr/0044-development-returns-to-main.md) | Development returns to main — candidate branches archived unmerged | Implemented | 2026-09-04 | 0001, 0006, 0009 |
| [0045](adr/0045-wave-specification-contract.md) | The wave specification is the contract between the orchestrator and the executor | Proposed | 2026-09-04 | 0010, 0014, 0034, 0035, 0038, 0039, 0041, 0043 |
| [0046](adr/0046-serialised-integration-under-direct-to-main.md) | Orchestrated waves integrate serially in queue order under direct-to-main | Proposed | 2026-09-04 | 0006, 0007, 0014, 0037, 0038, 0039, 0045 |
| [0047](adr/0047-agent-wave-adapts-to-host-orchestration-capability.md) | agent-wave adapts to the orchestration capability the host exposes | Proposed | 2026-09-04 | 0006, 0007, 0013, 0014, 0015, 0031, 0036, 0038, 0044, 0045 |
| [0048](adr/0048-wave-resumes-by-replanning-from-git.md) | A wave resumes by re-planning from git | Proposed | 2026-09-04 | 0013, 0031, 0037, 0038, 0039, 0045, 0046 |
| [0049](adr/0049-skill-directories-carry-declarative-host-interface-files-only.md) | Skill directories carry SKILL.md plus declarative host interface files only | Proposed | 2026-09-04 | 0004, 0011, 0013, 0015 |
