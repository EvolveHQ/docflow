# Agent Worklog

Append one row per commit. Newest at the bottom.

| Date | Commit | Branch | Item | Notes |
|------|--------|--------|------|-------|
| 2026-06-01 | 9582a14 | main | plan 0001 / ADR 0011 | Implemented static verify gate in scripts/verify.mjs; verify green; ADR 0011 → Implemented. |
| 2026-06-01 | b05293e | main | plan 0003+0004 / ADR 0010 | agent-wave reservation + single-writer, IN_FLIGHT columns, audit check 11, CONVENTIONS template; verify green; ADR 0010 → Implemented. |
| 2026-06-02 | e0a6bd3 | main | plan 0002 / ADR 0012 | evals/ + behavioural.workflow.mjs; three subagent evals (new-adr/ship-item/bootstrap) PASS at HEAD; ADR 0012 → Implemented. Queue now empty. |
| 2026-06-02 | 7769f99 | main | plan 0005 / ADR 0013 | Assessment Step 0.5 added to new-adr/new-plan/add-convention/brainstorm; verify green; ADR 0013 stays Accepted (0006 pending). |
| 2026-06-02 | e50d7b6 | main | plan 0006 / ADR 0013 | agent-wave Step 0.5 + merge-strategy question; verify green; ADR 0013 → Implemented. Queue empty. |
| 2026-06-02 | 0548d6c | main | plan 0007 / ADR 0014 | Conditional concurrency-guardrails (G1/G2/G3) in templates + bootstrap/agent-wave/audit; verify green; ADR 0014 stays Accepted (0008 pending). |
| 2026-06-02 | cb54799 | main | plan 0008 / ADR 0014 | USAGE + site docs for the guardrails; verify green; ADR 0014 → Implemented. Queue empty. |
| 2026-06-03 | b2c7399 | main | plan 0009 / ADR 0015 | Multi-target install docs + support matrix (Cowork/Codex/OpenCode) in README + site; verify green; ADR 0015 stays Accepted (0010 verification pending). |
| 2026-06-03 | 104a8a6 | main | plan 0011 / ADR 0015 | Native Codex plugin (.codex-plugin + .agents/plugins); 3-manifest version-sync; clean README Codex/OpenCode install (ADR 0015 r2). verify green. |
| 2026-06-04 | pending | main | ADR 0015 r3 | Restructure to plugins/docflow/ (skills inside the plugin dir) — Codex needs a subdir. Both marketplaces → ./plugins/docflow; verify/package.json/evals/docs repointed. Verified on real Codex: marketplace add → plugin add docflow@evolvehq → 8 skills installed. verify + evals green. |
