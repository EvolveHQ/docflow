export const meta = {
  name: 'docflow-behavioural-evals',
  description: 'Run docflow lifecycle skills through worktree subagents and assert the resulting repo state (ADR 0012 e2e tier).',
  phases: [{ title: 'Eval', detail: 'one worktree subagent per skill case' }],
}

// Behavioural eval suite (ADR 0012). The RUNNER is the subagent mechanism:
// each case spawns a worktree-isolated subagent that runs a lifecycle skill
// against its specified disposable fixture, then checks its actual target.
// This is a Workflow script with injected globals and a top-level return,
// not a plain Node module. Independent vendor-host execution is documented
// in hosts/README.md and supplies externally asserted release evidence.
//
// Worktrees are cut from a committed ref, so this evaluates COMMITTED
// skills — commit (and push for shared runs) before evaluating.
//
// Run with the Workflow tool (requires opt-in):
//   Workflow({ scriptPath: 'evals/behavioural.workflow.mjs' })

const VERDICT = {
  type: 'object',
  required: ['pass', 'detail', 'report'],
  properties: {
    pass: { type: 'boolean', description: 'true only if the gate passed (exit 0) and the asserted outcome holds' },
    detail: { type: 'string', description: 'what the skill produced + the exact verify.mjs output line and exit code' },
    report: { type: 'string', description: 'The final report verbatim, including Status at a glance with This run, Overall and Yet to do' },
  },
}

const CASES = [
  {
    key: 'agent-wave',
    prompt:
      'Behavioural eval of agent-wave using the same local-remote fixture as the vendor-host Docker runs. ' +
      'Create a fresh owned scratch directory outside this checkout. Set DOCFLOW_PLUGIN_ROOT to this checkout\'s ' +
      'absolute plugins/docflow directory; run python3 evals/hosts/wave-fixture.py <scratch> to prepare it. ' +
      'The fixture has distinct plan/ADR numbers, two accepted items and a third live claim that must remain untouched. ' +
      'Read plugins/docflow/skills/agent-wave/SKILL.md and evals/hosts/wave-prompt.txt; apply that approved specification ' +
      'with the fixture path changed to <scratch>/repo. Use rung 3, requested width 2, budget 2 items, continuous supervision. ' +
      'Unsigned commits and pushes to the fixture local bare origin only are authorised. Never push this checkout. ' +
      'Run python3 evals/hosts/check-wave.py <scratch> after the wave and report its exact output and exit. ' +
      'PASS requires every assertion, two per-item Status at a glance blocks and a wave block. Preserve all failures; ' +
      'do not repair the tested fixture outside the skill and call its original result passing.',
  },
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
      'Behavioural eval of ship-item against a disposable local bare remote. Never modify or push this checkout. ' +
      'Create a fresh owned scratch directory outside it, set DOCFLOW_PLUGIN_ROOT to this checkout\'s absolute ' +
      'plugins/docflow directory and run python3 evals/hosts/prepare-ship.py <scratch>. This creates a verified ' +
      'pushed claim/0007-alpha, an unselected beta item and an unrelated held claim. Read the installed ship-item ' +
      'skill and complete ONLY claim/0007-alpha using its detached integrating mode and the recorded direct profile. ' +
      'Unsigned synthetic commits and pushes to this fixture local origin are expressly authorised; no external ' +
      'remote or hosted PR is authorised. Keep gate, beta, held claim and existing identifiers unchanged. Perform ' +
      'the real commit, completion and local-remote push, verify the remote tip and do the applicable owned cleanup. ' +
      'Then run node evals/hosts/check-release.mjs ship-item <scratch>/repo from this checkout. PASS requires exit 0, ' +
      'reachable completion history, matching target/remote state and a valid final Status at a glance report. ' +
      'Report exact gate/assertion outputs and exits; a prepared filesystem move alone is not completion.',
  },
  {
    key: 'legacy-range-migration',
    prompt:
      'Behavioural eval of the docflow `audit` skill against a RANGE-NUMBERED catalogue. Never modify, commit ' +
      'or push this source checkout or evals/fixtures/legacy-range itself. ' +
      'FIRST copy evals/fixtures/legacy-range to a scratch directory (e.g. ../legacy-scratch) and work THERE — ' +
      'that copy is the repo under audit for the rest of this case. Initialise Git on main in that copy, ' +
      'configure a synthetic identity and unsigned commits only there, and commit its initial files with ' +
      'a Rationale footer. The operator expressly authorises these local synthetic commits and no push. ' +
      'Read plugins/docflow/skills/audit/SKILL.md, then: ' +
      '(1) DETECTION — audit the scratch repo and report whether it recognised the legacy range encoding, from ' +
      'which signal(s), and confirm the run produced exactly ONE "migration available" finding, that the finding ' +
      'is NOT a failure, and that the numbering / INDEX / section checks PASSED under the range rules ' +
      '(gap at the cutoff expected, no Shape column required, the 0100 template not counted as an ADR). ' +
      '(2) OFFER — produce the dry-run old-to-new number map WITHOUT writing anything, and state the file count ' +
      'changed so far (it must be zero). The expected map is 0101 -> 0004 and 0102 -> 0005, with 0001-0003 ' +
      'unchanged and 0001 keeping its number. ' +
      '(3) MIGRATION — the operator explicitly approves the displayed map 0101 -> 0004, 0102 -> 0005, ' +
      '0001-0003 unchanged; apply it after the read-only dry run, exactly as the skill ' +
      'specifies (renumber, stamp shape: on every ADR, rewrite depends-on / supersede links / relative ' +
      'adr/NNNN-*.md links / INDEX rows / domains listings / plan/todo owning-ADR lines, retire the boundary ' +
      'template in favour of adr/0000-template-technology.md, rewrite CONVENTIONS §ADR Shapes and drop the ' +
      'recorded-exception clause, regenerate INDEX with the Shape column). Preserve every plan/done file byte for byte. ' +
      'Make the single local migration commit, listing every old-to-new pair and a Rationale footer; no push. ' +
      '(4) POST-MIGRATION AUDIT — re-run the checks with the legacy rules off and confirm the catalogue passes ' +
      'with NO manual edit. ' +
      'THEN run the deterministic assertions from the docflow checkout against the scratch repo: ' +
      'node -e "import(\'./evals/assertions.mjs\').then(m=>{const r=process.argv[1];const map={\'0101\':\'0004\',\'0102\':\'0005\'};' +
      'm.assertMigratedToDeclaredShape(r,{map});m.assertReferencesRewritten(r,{map});' +
      'm.assertHistoryPreserved(r,{numbers:[\'0101\']});console.log(\'OK\')})" <scratch-repo-path> ' +
      'PASS only if all four steps hold AND that command prints OK. Report each step, the map you produced, ' +
      'the commit message, and the assertion output.',
  },
  {
    key: 'bootstrap',
    prompt:
      'Behavioural eval of the docflow `bootstrap` skill. Work ONLY in your worktree; do NOT push. ' +
      'Create a fresh scratch repo in a temp subdirectory (git init). BEFORE invoking bootstrap, give that repo a ' +
      'gate it can actually run: copy evals/fixtures/scratch-gate/verify.mjs from this checkout to ' +
      '<scratch>/tools/verify.mjs (node built-ins only; exits 0 on a sane bootstrapped tree). The scaffolded repo ' +
      'has no scripts/verify.mjs of its own, so a gate pointing at this checkout would be unrunnable there. ' +
      'THEN, following plugins/docflow/skills/bootstrap/SKILL.md, scaffold it using these scripted answers: ' +
      'FULL assessment depth; en-GB; single ADR shape; full lifecycle; use plan folder; ' +
      'single writer; direct-to-main; default git contract; defer optional artefacts; verify gate = ' +
      '`node tools/verify.mjs`; no domain hard rules; standalone; artefact root = repository root. ' +
      'Do NOT ask questions interactively — use those answers. ' +
      'PASS only if ALL hold in the scratch repo: (1) it contains AGENTS.md, CLAUDE.md, CONVENTIONS.md, INDEX.md, ' +
      'adr/0000-template.md, plan/todo, plan/done, and _agent/prompts/autonomous.md — a single writer with BOTH a ' +
      'recorded verify gate and the plan queue the prompt walks gets the run prompt and nothing else under _agent/; ' +
      '(2) there is NO _agent/ROLES.md, LOCKS.md, ' +
      'WORKLOG.md, CURRENT_FOCUS.md, IN_FLIGHT.md or HANDOFF.md, no merge=union line in .gitattributes and no _agent/ ' +
      'entry in .gitignore; (3) AGENTS.md carries a "Picking up this repo" section whose read order names only files ' +
      'that exist in the scratch repo; (4) the gate the run prompt records is the one that was scripted and it RUNS ' +
      'THERE: _agent/prompts/autonomous.md names `node tools/verify.mjs`, and running that command from the scratch ' +
      'repo root exits 0. Verify (4) with the deterministic assertions, run from the docflow checkout: ' +
      'node -e "import(\'./evals/assertions.mjs\').then(m=>{const r=process.argv[1];' +
      'm.assertFileContains(r,\'_agent/prompts/autonomous.md\',\'node tools/verify.mjs\');' +
      'm.assertCommandSucceeds(r,\'node tools/verify.mjs\');console.log(\'OK\')})" <scratch-repo-path> ' +
      'Report the file tree, each of the four checks explicitly, and that command\'s output.',
  },
  {
    key: 'bootstrap-express',
    prompt:
      'Behavioural eval of the docflow `bootstrap` skill at EXPRESS depth. Work ONLY in your worktree; do NOT push. ' +
      'Create a fresh scratch repo in a temp subdirectory (git init), then following plugins/docflow/skills/bootstrap/SKILL.md ' +
      'run an express-depth bootstrap with project name "scratch-express" and description "eval fixture". ' +
      'Do NOT ask questions interactively — express takes the fixed profile. PASS only if ALL hold in the scratch repo: ' +
      '(1) AGENTS.md and CLAUDE.md at the root; (2) CONVENTIONS.md, INDEX.md, adr/0000-template.md and the seed ' +
      'adr/0001-record-architecture-decisions.md under the DEFAULT artefact root .docflow/; (3) NO plan/, _agent/ ' +
      '(express records a single writer and no verify gate, so no coordination directory at all), ' +
      'GLOSSARY.md, domains/, or federation files anywhere (root or .docflow/); (4) .docflow/CONVENTIONS.md contains ' +
      'the express assessment depth (incidental Markdown around the value is allowed) and records direct-to-main fast-forward integration. Report the file tree and ' +
      'each of the four checks explicitly.',
  },
]

phase('Eval')
const { assertStatusReports } = await import('./reporting.mjs')
const results = await parallel(
  CASES.map((c) => () =>
    agent(c.prompt + ' End the final report with Status at a glance: This run, Overall, Yet to do. Return that report verbatim in the report field.', { label: `eval:${c.key}`, phase: 'Eval', schema: VERDICT, isolation: 'worktree' })
      .then((v) => {
        const result = { key: c.key, ...(v || { pass: false, detail: 'no verdict returned' }) }
        try { assertStatusReports(result.report, c.key === 'agent-wave' ? 3 : 1) }
        catch (e) { result.pass = false; result.detail += '; ' + e.message }
        return result
      })),
)

const passed = results.filter((r) => r.pass)
const failed = results.filter((r) => !r.pass)
for (const r of results) {
  log(`${r.pass ? 'PASS' : 'FAIL'} ${r.key} — ${r.detail}`)
}
log(`behavioural evals: ${passed.length}/${results.length} passed`)
return { passed: passed.map((r) => r.key), failed: failed.map((r) => r.key), results }
