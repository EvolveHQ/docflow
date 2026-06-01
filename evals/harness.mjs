// Behavioural eval harness (ADR 0012) — SCAFFOLD.
//
// An eval case runs a skill against a fixture repository with scripted
// inputs and asserts the resulting state. The deterministic pieces
// (fixtures, assertions) are implemented; the one missing piece is the
// RUNNER — the thing that actually drives a coding agent through a skill
// headlessly. That choice is ADR 0012's open question; until it is made,
// `runAgent` throws and agent-dependent cases report SKIPPED.
//
// To finish item 0002: implement `runAgent` against the chosen runner
// (e.g. a non-interactive CLI invocation that loads this plugin, runs the
// named skill with the scripted answers, and commits), then flip the
// case results from SKIPPED to PASS/FAIL.

export class RunnerNotConfigured extends Error {
  constructor() {
    super(
      'No headless agent runner configured (ADR 0012 open question). ' +
      'Implement runAgent() in evals/harness.mjs to enable agent-dependent ' +
      'eval cases. Until then they report SKIPPED.',
    );
    this.name = 'RunnerNotConfigured';
  }
}

// Pluggable seam. Given a fixture repo path, a skill name, and scripted
// inputs, drive the agent through the skill end-to-end. Returns when the
// skill has finished and committed. Replace the throw with a real runner.
//
// eslint-disable-next-line no-unused-vars
export async function runAgent({ repo, skill, inputs }) {
  throw new RunnerNotConfigured();
}

// Run one eval case: optional setup → runAgent → assert. Returns a result
// record; never throws (so one case cannot abort the suite).
export async function runCase(testCase) {
  const { name, skill } = testCase;
  try {
    const repo = testCase.setup ? await testCase.setup() : testCase.repo;
    if (testCase.agentDependent !== false) {
      try {
        await runAgent({ repo, skill, inputs: testCase.inputs });
      } catch (e) {
        if (e instanceof RunnerNotConfigured) {
          return { name, status: 'SKIPPED', reason: 'runner not configured' };
        }
        throw e;
      }
    }
    await testCase.assert(repo);
    return { name, status: 'PASS' };
  } catch (e) {
    return { name, status: 'FAIL', reason: e.message };
  }
}
