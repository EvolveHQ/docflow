# ADR Index

Generated from ADR metadata. Do not hand-edit — regenerate after any
ADR change.

| ADR | Title | Status | Date | Depends on |
|-----|-------|--------|------|------------|
| [0001](adr/0001-adr-driven-workflow.md) | Documentation-led, ADR-driven workflow as the product | Implemented | 2026-05-21 | — |
| [0002](adr/0002-assessment-driven-bootstrap.md) | Interactive assessment-driven bootstrap | Superseded | 2026-05-21 | 0001 |
| [0003](adr/0003-backfill-retrofit.md) | Retrofit existing repos via backfill from code and history | Implemented | 2026-05-21 | 0001, 0002 |
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
| [0015](adr/0015-multi-target-portability.md) | Multi-target portability — one skill source, many coding agents | Accepted | 2026-06-03 | 0001, 0007, 0009 |
| [0016](adr/0016-layered-artifact-model.md) | Layered artifact model — minimal core, opt-in layers | Accepted | 2026-06-17 | 0001 |
| [0017](adr/0017-configurable-artifact-root.md) | Configurable artifact root — control the repo footprint | Accepted | 2026-06-17 | 0013, 0016 |
| [0018](adr/0018-wip-stays-out-of-catalogue.md) | Work-in-progress stays out of the ADR catalogue | Accepted | 2026-06-17 | 0001, 0013, 0014 |
