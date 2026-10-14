---
title: Skill catalogue
permalink: /reference/skills/
section: Reference
---

# Skill catalogue

The package has **fourteen skills**: nine repository skills and five workspace skills. Use the names discovered by your actual host; [installation and invocation]({{ '/start/#install' | relative_url }}) are host-specific.

Run repository skills in the **member root**. Run the five `workspace-*` skills in the **workspace home**. Do not run repository bootstrap on the home merely to set up a workspace.


| Skill | Purpose |
|-------|---------|
| `bootstrap` | Scaffold or retrofit the whole convention set. Start here. For the planning journey, choose guided mode with a plan queue. |
| `new-adr` | Author one ADR — next contiguous number, right shape, INDEX + domain wiring, supersede linkage. |
| `new-plan` | Add a `plan/todo` item tracing to its owning ADR(s). |
| `ship-item` | Run the completion event: verify → completion commit (`todo`→`done`, ADR `Accepted`→`Implemented`, INDEX) → push or PR merge per the recorded model. |
| `add-convention` | Assess whether a convention is worth codifying, route it to the right home (or to an ADR), then add it — e.g. enable optional practices like TDD on demand. |
| `audit` | Lint the repo against its own conventions — numbering, INDEX sync, plan coverage, ADR-privacy leaks, and more. |
| `brainstorm` | Decompose a problem into candidate ADRs + plan items (proposes drafts; writes nothing until approved). |
| `agent-wave` | Run a bounded queue wave using available parallel agents or sequential execution, within the recorded supervision and authority. |
| `rollup` | For a multi-repo product: aggregate every member repo's ADRs into one derived, product-wide roll-up (run from the home repo). |
| `workspace-setup` | Create or adopt a portable workspace home and registry. |
| `workspace-status` | Read priorities, owners, authority, blockers and next actions. |
| `workspace-scope` | Record shared outcomes and native deliveries without granting execution. |
| `workspace-dispatch` | Check current grants, claims, dependencies and resources, then hand off a bounded brief. |
| `workspace-sync` | Reconcile returned receipts and member state from checked native evidence; refresh INDEX. |


## Optional repository layers

The core is agent instructions, conventions, an ADR template and index. Choose a plan queue when you need `new-plan` and the shipping journey. An autonomous operating prompt requires both a queue and a recorded verify gate. Other optional layers include a glossary, domain grouping, a second ADR shape and federation.

Federation and `rollup` organise decision catalogues across repositories; a workspace records shared outcomes and delivery without migrating member methods. [Methodology: many repositories]({{ '/methodology/#5-scaling-to-many-repositories' | relative_url }}) describes the distinction. Advanced `agent-wave` coordination follows the repository’s existing authority and integration rules; it does not supply new permission.

For all assessment questions and template customisation, see [USAGE](https://github.com/EvolveHQ/docflow/blob/main/USAGE.md). Re-running bootstrap can propose missing optional layers by merge; existing choices are preserved.
