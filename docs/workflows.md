---
title: Workspace workflows
permalink: /workflows/
---

# Workspace workflows

A Docflow workspace is an adopter-owned Git home for shared outcomes across independent repositories. It keeps a registry, planning records, authority references and observed delivery. Each member repository keeps its own instructions, work method, history and completion event. You can use the workspace through ordinary files and the five workspace skills; a companion app is not required.

Choose the path that matches what already exists:

| Starting point | Guide | First decision |
|---|---|---|
| Several existing repositories, no workspace | [Adopt existing repositories](https://evolvehq.github.io/docflow/workflows/existing-repositories/) | Which outcomes are shared? |
| An ordinary folder of repositories or existing workspace memory | [Adopt or resume a workspace](https://evolvehq.github.io/docflow/workflows/existing-workspace/) | Is `.docflow_workspace/` already present and valid? |
| Governed and ungoverned, existing and new members together | [Mixed members](https://evolvehq.github.io/docflow/workflows/mixed-members/) | Which checkouts and native rules exist now? |
| A new workspace around existing members | [New workspace](https://evolvehq.github.io/docflow/workflows/new-workspace/) | Where will the adopter-owned home live? |
| New repositories and a new workspace | [New repositories](https://evolvehq.github.io/docflow/workflows/new-repositories/) | Which repositories need their own method? |

For a concrete two-member record and interrupted-delivery example, read the
[worked example](https://evolvehq.github.io/docflow/workflows/worked-example/).
For the record model and limits, read [Portable workspaces](https://evolvehq.github.io/docflow/workspace/). The guides below include a [repeatable scratch setup](https://evolvehq.github.io/docflow/workflows/new-workspace/#try-an-empty-workspace-in-scratch), [daily cycle](https://evolvehq.github.io/docflow/workflows/day-to-day/) and [recovery path](https://evolvehq.github.io/docflow/workflows/recovery/).

## Before you start

1. Choose the actual filesystem context: host, workspace root, member roots and permitted read/write scope. A desktop shell, cloud session and native worktree may see different paths. The same context must be able to read the workspace and the installed assets; validation needs Node.js 22 or later. Git 2.45 or later is needed when checking cited historical files in a local member Git object store.
2. Install Docflow for your host using the [repository install matrix](https://github.com/EvolveHQ/docflow#install) or [usage guide](https://github.com/EvolveHQ/docflow/blob/main/USAGE.md). Keep all fourteen skills and the complete sibling `workspace/` asset directory from the same package revision. A detached skill copy also needs the complete assets as `docflow-workspace/` beside the host's `skills/` directory. Verify where your host actually discovered the skill and assets; a skill-only copy cannot run the validator.
3. Pick the workspace home deliberately. Do not point setup at a parent directory containing unrelated projects. Member checkouts remain independent Git repositories; `/repos/` is a convenient ignored location, not a required location.
4. Read the workspace `README.md`, `AGENTS.md`, `.docflow_workspace/workspace.yaml` and `.docflow_workspace/CONVENTIONS.md`, plus each relevant member's declared native instructions. Read current records and native claim sources before assigning work. Registry membership, a role, a selected idea and an accepted decision do not grant execution authority.

### Invoke the skills

The same skill names are used on every host. Claude Code uses `/workspace-setup` (or the plugin-qualified `/docflow:workspace-setup` when exposed); pi and omp use `/skill:workspace-setup`; Codex uses `$workspace-setup`; other hosts use their discovered skill menu. Substitute `workspace-status`, `workspace-scope`, `workspace-dispatch` or `workspace-sync` for the task. Invoke repository `bootstrap`, `new-adr`, `new-plan` and `ship-item` **from that member repository**, following its own rules. A workspace setup is separate from member bootstrap.

### What to expect

The home has `README.md`, `AGENTS.md` and `.docflow_workspace/`. Within that directory, `workspace.yaml` is the registry, `CONVENTIONS.md` defines home rules, `INDEX.md` is a dated derived view, and `ideas/`, `decisions/`, `work/`, `knowledge/` and `runs/` hold canonical records. `agents/`, `profiles/` and `integrations/` hold chosen configuration; `templates/` holds blank record forms. Ignore `/repos/` and `/.docflow_workspace/local/`. A missing member stays registered with diagnostics. An empty valid workspace has no grants, runs or completed deliveries.

After empty setup, expect this tree (the optional `repos/` folder appears only after you obtain independent checkouts):

```text
acme-workspace/
├── README.md
├── AGENTS.md
├── .gitignore
└── .docflow_workspace/
    ├── workspace.yaml
    ├── CONVENTIONS.md
    ├── INDEX.md
    ├── ideas/  decisions/  work/  knowledge/  runs/
    ├── agents/  profiles/
    ├── integrations/sources.yaml
    ├── templates/workspace-{ideas,decisions,work,knowledge,runs}.md
    └── local/                  # ignored, optional local state
```

Run `workspace-setup`, `workspace-status`, `workspace-scope`, `workspace-dispatch` and `workspace-sync` **with the workspace home selected as the host project/current directory**. Run `bootstrap`, `new-adr`, `new-plan`, `ship-item` and native implementation **with the relevant member root selected**. The validator accepts an explicit workspace path, so it can run from any directory that can read both the home and matching assets. Always give the selected root explicitly in the prompt when a host's working directory is uncertain.

## The common cycle

1. **Orient:** Run `workspace-status` from the selected workspace home. It reads current records, native instructions, grant and claim sources, and reports dated priorities, owners, blockers and next actions. It never writes.
2. **Plan:** Use `workspace-scope` for the shared outcome, linked native deliveries and testable criteria. Keep a decision proposed until a real accepted agreement and its committed mandate note exist. Planning may end with no grant. Use `new-plan` only inside a Docflow member for that repository's native task.
3. **Authorise and dispatch:** With a current mandate and compatible grant, `workspace-dispatch` checks the exact work/delivery revision, actor, allowed effects, grant validity, native claim, dependencies and resources. It writes a bounded brief for an authorised attempt and hands it to the chosen native host. If readiness fails before an attempt starts, report the blocker; do not invent a run or receipt.
4. **Do native work:** The executor reads the member's rules and works inside the assigned boundary. A read-only executor can return an external receipt without editing the workspace. Preserve actual command outputs, exit codes, observations, source revisions, blockers and return time.
5. **Reconcile:** `workspace-sync` checks a returned receipt and/or native member state at exact revisions, updates observations and criteria only from checked evidence, and refreshes `INDEX.md`. It can observe work that was never dispatched by this workspace. A prepared PR or a plan/done file on an unmerged branch is still pending. One successful run does not complete all required deliveries.

Use the [daily checklist](https://evolvehq.github.io/docflow/workflows/day-to-day/) for concrete prompts and the [recovery guide](https://evolvehq.github.io/docflow/workflows/recovery/) after interruption or host change.

## Qualification limits

Version 0.10.0 supplies portable files and deterministic package checks. The
seven host guides document entry points; full native qualification on the
combined eight-target package remains pending. Clarity integration and
installer publication are parked. See the [release notes](https://evolvehq.github.io/docflow/release-notes/)
for the exact scope.

