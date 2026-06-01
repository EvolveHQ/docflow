// Eval harness (ADR 0012).
//
// Two layers, by design:
//
// 1. DETERMINISTIC (this file + assertions.mjs, run via `node`): the
//    self-check and assertion helpers. No agent, no model. A subagent
//    calls these inside its worktree to verify an outcome, and CI can run
//    the self-check directly.
//
// 2. BEHAVIOURAL (evals/behavioural.workflow.mjs, run via the Workflow
//    tool): the runner is the host's SUBAGENT mechanism. One
//    worktree-isolated subagent per case runs the named skill against the
//    fixture, then runs the deterministic layer and reports PASS/FAIL.
//    A plain `node` process cannot spawn subagents, so the behavioural
//    suite is a Workflow, not a `node` script — see that file.
//
// `runCase` below executes only the deterministic cases. Agent-dependent
// cases are marked and reported as "run via the behavioural workflow".

// Run one deterministic case: assert(repo) over already-existing state.
// Never throws — returns a result record so one case can't abort the run.
export async function runCase(testCase) {
  const { name } = testCase;
  if (testCase.agentDependent !== false) {
    return {
      name,
      status: 'SKIPPED',
      reason: 'behavioural — run via Workflow evals/behavioural.workflow.mjs',
    };
  }
  try {
    await testCase.assert(testCase.repo);
    return { name, status: 'PASS' };
  } catch (e) {
    return { name, status: 'FAIL', reason: e.message };
  }
}
