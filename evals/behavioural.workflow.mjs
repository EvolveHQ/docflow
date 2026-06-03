export const meta = {
  name: 'docflow-behavioural-evals',
  description: 'Run docflow lifecycle skills through worktree subagents and assert the resulting repo state (ADR 0012 e2e tier).',
  phases: [{ title: 'Eval', detail: 'one worktree subagent per skill case' }],
}

// Behavioural eval suite (ADR 0012). The RUNNER is the subagent mechanism:
// each case spawns a worktree-isolated subagent that runs one lifecycle
// skill against this repo (a bootstrapped docflow fixture), then runs the
// static gate `node scripts/verify.mjs` inside its own worktree and
// reports the result. No external CLI, no API key.
//
// Worktrees are cut from a committed ref, so this evaluates COMMITTED
// skills — commit (and push for shared runs) before evaluating.
//
// Run with the Workflow tool (requires opt-in):
//   Workflow({ scriptPath: 'evals/behavioural.workflow.mjs' })

const VERDICT = {
  type: 'object',
  required: ['pass', 'detail'],
  properties: {
    pass: { type: 'boolean', description: 'true only if the gate passed (exit 0) and the asserted outcome holds' },
    detail: { type: 'string', description: 'what the skill produced + the exact verify.mjs output line and exit code' },
  },
}

const CASES = [
  {
    key: 'new-adr',
    prompt:
      'Behavioural eval of the docflow `new-adr` skill. Work ONLY in your worktree; do NOT commit or push. ' +
      'Read plugins/docflow/skills/new-adr/SKILL.md and CONVENTIONS.md, then author ONE new ADR titled "Eval smoke-test decision": ' +
      'next contiguous number after the existing catalogue, capability template filled with placeholder content, ' +
      'status Proposed, owner eval-bot, date 2026-06-02; regenerate INDEX.md to include it (keep existing rows). ' +
      'Then run `node scripts/verify.mjs`. PASS only if exit code is 0. Report the new ADR filename, the exact ' +
      'verify.mjs output line, and the exit code.',
  },
  {
    key: 'ship-item',
    prompt:
      'Behavioural eval of the docflow `ship-item` skill. Work ONLY in your worktree; do NOT push. ' +
      'FIRST set up a fixture to ship (the queue may be empty): author a minimal ADR ' +
      'adr/<next-contiguous-number>-eval-ship.md with status Accepted (fill the capability template briefly), ' +
      'regenerate INDEX.md, and create a matching plan/todo/<same-number>-eval-ship.md naming that ADR as owner. ' +
      'THEN, following plugins/docflow/skills/ship-item/SKILL.md, run the completion event for that item: git mv it to ' +
      'plan/done/<date>-eval-ship.md with a shipped footer, advance the owning ADR Accepted->Implemented, ' +
      'regenerate INDEX.md, append a WORKLOG row. Then run `node scripts/verify.mjs`. PASS only if exit 0 AND the ' +
      'item is under plan/done AND its owning ADR reads Implemented. You MAY use git mv/add within your worktree ' +
      'but do NOT commit or push. Report what you created, what moved, the ADR status change, and the exact ' +
      'verify.mjs output + exit code.',
  },
  {
    key: 'bootstrap',
    prompt:
      'Behavioural eval of the docflow `bootstrap` skill. Work ONLY in your worktree; do NOT push. ' +
      'Create a fresh scratch repo in a temp subdirectory (git init), then following plugins/docflow/skills/bootstrap/SKILL.md ' +
      'scaffold it using these scripted answers: en-GB; single ADR shape; full lifecycle; use plan folder; ' +
      'single agent; direct-to-main; default git contract; defer optional artefacts; verify gate = manual; ' +
      'no domain hard rules. Do NOT ask questions interactively — use those answers. PASS only if the scratch ' +
      'repo then contains AGENTS.md, CLAUDE.md, CONVENTIONS.md, INDEX.md, adr/0000-template.md, plan/todo, ' +
      'plan/done, and _agent/ROLES.md. Report the resulting file tree and whether all required paths exist.',
  },
]

phase('Eval')
const results = await parallel(
  CASES.map((c) => () =>
    agent(c.prompt, { label: `eval:${c.key}`, phase: 'Eval', schema: VERDICT, isolation: 'worktree' })
      .then((v) => ({ key: c.key, ...(v || { pass: false, detail: 'no verdict returned' }) }))),
)

const passed = results.filter((r) => r.pass)
const failed = results.filter((r) => !r.pass)
for (const r of results) {
  log(`${r.pass ? 'PASS' : 'FAIL'} ${r.key} — ${r.detail}`)
}
log(`behavioural evals: ${passed.length}/${results.length} passed`)
return { passed: passed.map((r) => r.key), failed: failed.map((r) => r.key), results }
