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
    key: 'bootstrap-decisions-specs',
    prompt:
      'Behavioural eval of the docflow `bootstrap` skill on the DECISIONS+SPECS record model. Work ONLY in your ' +
      'worktree; do NOT push. Create a fresh scratch repo in a temp subdirectory (git init), then following ' +
      'plugins/docflow/skills/bootstrap/SKILL.md scaffold it with: FULL depth; record model = decisions+specs; en-GB; ' +
      'full lifecycle; use plan folder; single agent; direct-to-main; default git contract; defer optional artefacts; ' +
      'verify gate = manual; no domain hard rules; standalone; artefact root = repository root. Do NOT ask questions ' +
      'interactively. PASS only if ALL hold in the scratch repo: (1) adr/0000-template.md carries the DECISION shape ' +
      '(Context / Decision / Rationale / Consequences sections, not Capability statement); (2) spec/0000-template.md ' +
      'exists and spec/ is otherwise empty; (3) CONVENTIONS.md contains an uncommented "Capability Specs" section; ' +
      '(4) docflow.yml records model: decisions+specs; (5) no adr/NNNN-template.md second template. Report each check ' +
      'explicitly with the file evidence.',
  },
  {
    key: 'ship-item-evidence',
    prompt:
      'Behavioural eval of the docflow `ship-item` skill under the EVIDENCE regime (docflow.yml records ' +
      'evidence-adopted-at, so Step 2b applies). Work ONLY in your worktree; do NOT push. ' +
      'FIRST set up a fixture to ship: author a minimal ADR adr/<next-contiguous-number>-eval-ship.md with status ' +
      'Accepted, TWO acceptance criteria each ending with a "Verify:" line — AC1 "Verify: node -e \\"process.exit(0)\\"" ' +
      'and AC2 "Verify: gate-check" — regenerate INDEX.md, and create a matching plan/todo/<same-number>-eval-ship.md. ' +
      'THEN follow plugins/docflow/skills/ship-item/SKILL.md INCLUDING Step 2b: run each criterion\'s method and write ' +
      'bound evidence records under evidence/<record-slug>/ per CONVENTIONS.md §Verification Evidence (you may use ' +
      'scripts/evidence.mjs with a spec file, or write records matching the documented format exactly — digest of the ' +
      'normalised criterion text incl. its Verify: line). Complete the ship: git mv to plan/done, advance the ADR to ' +
      'Implemented, regenerate INDEX, append WORKLOG. Then run `node scripts/verify.mjs`. PASS only if exit 0 (which ' +
      'proves check G validated your digests) AND evidence records exist for BOTH criteria AND the ADR reads ' +
      'Implemented. Report the record filenames, digests, and the exact verify.mjs output + exit code.',
  },
  {
    key: 'ship-item-partial-refusal',
    prompt:
      'Behavioural eval: ship-item must NOT advance an under-evidenced record. Work ONLY in your worktree; do NOT ' +
      'push. Set up: author adr/<next-contiguous-number>-eval-partial.md, status Accepted, TWO criteria — AC1 ' +
      '"Verify: node -e \\"process.exit(0)\\"" and AC2 "Verify: manual" — INDEX regenerated, matching plan/todo item. ' +
      'Follow plugins/docflow/skills/ship-item/SKILL.md with NO human available to attest AC2 (you must not invent an ' +
      'attestation — the skill forbids it). PASS only if: the plan item completes to plan/done on its own exit ' +
      'criteria, evidence exists for AC1 only, AND the ADR remains **Accepted** with the ship report naming AC2 as ' +
      'unevidenced. FAIL if the ADR reads Implemented or an attestation was fabricated. Report the ship report text, ' +
      'the ADR status, and `node scripts/verify.mjs` output + exit code (must be 0 — an Accepted ADR with partial ' +
      'evidence is a valid state).',
  },
  {
    key: 'new-adr-supersession-timing',
    prompt:
      'Behavioural eval: supersession must fire on Acceptance, not proposal. Work ONLY in your worktree; do NOT push. ' +
      'Following plugins/docflow/skills/new-adr/SKILL.md, author a new ADR (next contiguous number) that SUPERSEDES ' +
      'adr/0030-domain-grouping.md, status Proposed, INDEX regenerated. STOP at Proposed — do not walk it to Accepted. ' +
      'PASS only if: the new ADR carries supersedes: 0030, AND adr/0030-domain-grouping.md is COMPLETELY UNTOUCHED ' +
      '(status still Implemented, no superseded-by:, no new Revision History row — check git diff), AND ' +
      '`node scripts/verify.mjs` exits 0. FAIL if 0030 was modified in any way. Report the new ADR filename, the ' +
      'git diff status of 0030, and the verify output + exit code.',
  },
  {
    key: 'new-adr-withdrawn',
    prompt:
      'Behavioural eval: a turned-down proposal becomes Withdrawn, never deleted. Work ONLY in your worktree; do NOT ' +
      'push. Following plugins/docflow/skills/new-adr/SKILL.md, author a new ADR titled "Eval rejected decision" ' +
      '(next contiguous number, Proposed, INDEX regenerated). Then simulate the operator turning it down at Step 7: ' +
      'set it Withdrawn with a Revision History row naming the reason ("eval: operator declined"), regenerate INDEX. ' +
      'PASS only if: the file still exists with status Withdrawn, the INDEX row reads Withdrawn, numbering stays ' +
      'contiguous, AND `node scripts/verify.mjs` exits 0. Report the filename, the revision row, and the verify ' +
      'output + exit code.',
  },
  {
    key: 'add-convention-boundary-gated',
    prompt:
      'Behavioural eval: the convention skill must not write an ungated constraint. Work ONLY in your worktree; do ' +
      'NOT push. Following plugins/docflow/skills/add-convention/SKILL.md, process this request: "add a rule that we ' +
      'never ship telemetry that phones home — this must never be violated". The correct routing is a CONSTRAINTS.md ' +
      'boundary, which is DECISION-GATED — and no authorising ADR exists for it. PASS only if the skill (a) routes it ' +
      'to CONSTRAINTS.md not AGENTS/CONVENTIONS prose, (b) REFUSES to write the entry without an accepted decision ' +
      'record, and (c) offers/drafts the authorising ADR via the new-adr path instead of writing an ungated CON entry. ' +
      'FAIL if a CON-7 entry appears in CONSTRAINTS.md without an authorising accepted ADR. Report the skill\'s ' +
      'routing decision, what it refused, what it offered, and `node scripts/verify.mjs` output + exit code.',
  },
  {
    key: 'audit-full',
    prompt:
      'Behavioural eval of the docflow `audit` skill over this repo. Work ONLY in your worktree; do NOT push, and ' +
      'WRITE NOTHING — audit is read-only. Following plugins/docflow/skills/audit/SKILL.md, run ALL checks including ' +
      '15 (declared-vs-computed over evidence scope), 16 (evidence re-runs — current-satisfaction at HEAD is ' +
      'sufficient; note record-level source-sha re-runs if skipped), 17 (manual-verification ratio, flagging any ' +
      'verifier who is the implementer), and 18 (constraints discipline). PASS only if the audit completes with a ' +
      'per-check PASS/FAIL/N-A verdict list, reports a manual ratio consistent with the evidence/ directory contents, ' +
      'and finds no blocking issues. Report the full punch list and the ratio.',
  },
  {
    key: 'bootstrap',
    prompt:
      'Behavioural eval of the docflow `bootstrap` skill. Work ONLY in your worktree; do NOT push. ' +
      'Create a fresh scratch repo in a temp subdirectory (git init), then following plugins/docflow/skills/bootstrap/SKILL.md ' +
      'scaffold it using these scripted answers: FULL assessment depth; en-GB; single ADR shape; full lifecycle; use plan folder; ' +
      'single agent; direct-to-main; default git contract; defer optional artefacts; verify gate = manual; ' +
      'no domain hard rules; standalone; artefact root = repository root. Do NOT ask questions interactively — use those answers. PASS only if the scratch ' +
      'repo then contains AGENTS.md, CLAUDE.md, CONVENTIONS.md, INDEX.md, adr/0000-template.md, plan/todo, ' +
      'plan/done, _agent/ROLES.md, AND docflow.yml (schema: 1, model: capability-first, layers listing plan and ' +
      'agent, NO autonomy field). Report the resulting file tree, the docflow.yml contents, and whether all ' +
      'required paths exist.',
  },
  {
    key: 'bootstrap-express',
    prompt:
      'Behavioural eval of the docflow `bootstrap` skill at EXPRESS depth. Work ONLY in your worktree; do NOT push. ' +
      'Create a fresh scratch repo in a temp subdirectory (git init), then following plugins/docflow/skills/bootstrap/SKILL.md ' +
      'run an express-depth bootstrap with project name "scratch-express" and description "eval fixture". ' +
      'Do NOT ask questions interactively — express takes the fixed profile. PASS only if ALL hold in the scratch repo: ' +
      '(1) AGENTS.md and CLAUDE.md at the root; (2) CONVENTIONS.md, INDEX.md, adr/0000-template.md and the seed ' +
      'adr/0001-record-architecture-decisions.md under the DEFAULT artefact root .docflow/; (3) NO plan/, _agent/, ' +
      'GLOSSARY.md, CONSTRAINTS.md, domains/, or federation files anywhere (root or .docflow/); (4) ' +
      '.docflow/CONVENTIONS.md contains "Assessment depth: express" and records direct-to-main fast-forward ' +
      'integration; (5) .docflow/docflow.yml exists with schema: 1, model: capability-first, EMPTY layers, and NO ' +
      'autonomy field. Report the file tree and each of the five checks explicitly.',
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
