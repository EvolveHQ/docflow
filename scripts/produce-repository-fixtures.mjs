// Deterministic producer rendering for ADR 0055. No model, installer or network.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

export const sha256 = value => createHash('sha256').update(value).digest('hex');
const tpl = 'plugins/docflow/skills/bootstrap/templates/';
const legacy = 'evals/fixtures/legacy-range/';
export function renderRepositoryFixtures(sources, revision) {
  const files = {}, cases = [];
  const source = path => {
    if (!(path in sources)) throw Error('missing producing source: ' + path);
    return sources[path];
  };
  function emit(id, path, content, origins, rendering) {
    files['cases/' + id + '/' + path] = { content, origins, rendering };
  }
  const uncomment = s => s.replace(/<!--[\s\S]*?-->/g, '').replace(/\n{3,}/g, '\n\n');
  const section = (s, heading) => s.match(new RegExp('^## ' + heading + '\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))', 'm'))?.[0] || '';
  function conventions(root, two, queue) {
    let s = source(tpl + 'CONVENTIONS.md');
    if (two) {
      const twoBlock = s.match(/<!-- Two shapes \(Q2\): -->\n<!--\n([\s\S]*?)\n-->/)[1];
      s = s.replace(/<!-- Single shape \(Q2\): -->[\s\S]*?<!-- Q10/, twoBlock + '\n\n<!-- Q10');
    }
    const pr = s.match(/PR-based:\n([\s\S]*?)\n-->/)[1];
    s = uncomment(s).replace('<name>', 'synthetic-producer')
      .replace('<.docflow/ | docs/ | .>', root)
      .replace('<express | guided | full>', queue ? 'full' : 'express')
      .replace('<from Q3>', 'Proposed → Accepted → Implemented → (Superseded | Deprecated)')
      .replace('<from Q4>', 'Checked pull-request merge into main');
    s = s.replace('## Git Contract\n', '## Git Contract\n\n' +
      pr.replace(/The verify\ngate[^.]+\. /, '').replace('<squash | merge |\nrebase>', 'merge') + '\n');
    if (!queue) {
      s = s.replace(/## Multi-Agent Rules[\s\S]*?(?=## Audit Trail Policy)/, '')
        .replace(/## Item status[\s\S]*/, '')
        .replace(' Work item lives in `plan/todo/`.', '')
        .replace(' Work item moved to `plan/done/`.', '');
    }
    return s;
  }
  function decision(number, shape, state = 'Accepted') {
    let s = source(tpl + 'adr-' + shape + '.md');
    s = s.replace(/^# shape:[\s\S]*?(?=^supersedes:)/m, '')
      .replaceAll('NNNN', number).replaceAll('YYYY-MM-DD', '2026-09-15')
      .replaceAll('<Title in sentence case>', 'Synthetic ' + shape + ' decision')
      .replaceAll('<Title>', 'Synthetic ' + shape + ' decision')
      .replace('status: Proposed', 'status: ' + state)
      .replaceAll('<agent-id or human>', 'fixture-author')
      .replace(/<[^>]+>/g, 'Synthetic fixture input')
      .replace(/^3\. \.\.\.$/m, '3. The fixture remains readable without migration.');
    return s;
  }
  function base(id, root = '.docflow', { two = false, queue = false, pointer = true } = {}) {
    const rel = p => root === '.' ? p : root + '/' + p;
    if (root !== '.docflow' && pointer) emit(id, '.docflow', 'root: ' + root + '\n',
      ['plugins/docflow/skills/bootstrap/SKILL.md'], 'Exact pointer form; root choice = ' + root);
    emit(id, rel('CONVENTIONS.md'), conventions(root, two, queue), [tpl + 'CONVENTIONS.md'],
      'Select single-writer, PR integration, ' + (two ? 'two shapes' : 'single shape') + ', queue=' + queue + '; fill supplied fixture choices.');
    let agents = '# AGENTS.md\n\n' + section(uncomment(source(tpl + 'AGENTS.md')), 'What this repository is') +
      section(uncomment(source(tpl + 'AGENTS.md')), 'Picking up this repo');
    agents = agents.replace(/<[^>]+>/g, 'Synthetic repository for producer compatibility');
    agents = agents.replace(/^\d+\.[\s\S]*?(?=^\d+\.|$(?![\s\S]))/gm,
      line => /_agent\/(?:ROLES|LOCKS)/.test(line) || (!queue && /plan\/|What is in flight/.test(line)) ? '' : line);
    let readOrder = 0;
    agents = agents.replace(/^\d+\./gm, () => String(++readOrder) + '.');
    agents = agents.replaceAll('`CONVENTIONS.md`', '`' + rel('CONVENTIONS.md') + '`')
      .replaceAll('`INDEX.md`', '`' + rel('INDEX.md') + '`');
    emit(id, 'AGENTS.md', agents, [tpl + 'AGENTS.md'], 'Select generated entry/read-order sections; resolve root and omit disabled queue/coordination.');
    emit(id, 'CLAUDE.md', source(tpl + 'CLAUDE.md'), [tpl + 'CLAUDE.md'], 'Exact template copy.');
    emit(id, rel('adr/0000-template.md'), source(tpl + 'adr-capability.md'), [tpl + 'adr-capability.md'], 'Exact template copy.');
    let first = decision('0001', 'capability');
    if (two) first = first.replace('status: Accepted', 'shape: capability\nstatus: Accepted');
    emit(id, rel('adr/0001-synthetic-capability.md'), first, [tpl + 'adr-capability.md'],
      'Fill synthetic author/date/title/body; explicit shape only in two-shape case.');
    if (two) {
      emit(id, rel('adr/0000-template-technology.md'), source(tpl + 'adr-technology.md'), [tpl + 'adr-technology.md'], 'Exact template copy.');
      const second = decision('0002', 'technology');
      emit(id, rel('adr/0002-synthetic-technology.md'), second, [tpl + 'adr-technology.md'], 'Fill synthetic input and explicit technology shape.');
    }
    const rows = ['| [0001](adr/0001-synthetic-capability.md) | Synthetic capability decision | Accepted | 2026-09-15 |' + (two ? ' capability |' : '')];
    if (two) rows.push('| [0002](adr/0002-synthetic-technology.md) | Synthetic technology decision | Accepted | 2026-09-15 | technology |');
    emit(id, rel('INDEX.md'), '# Index\n\n| ADR | Title | Status | Date |' + (two ? ' Shape |' : '') +
      '\n|---|---|---|---|' + (two ? '---|' : '') + '\n' + rows.join('\n') + '\n',
      ['plugins/docflow/skills/bootstrap/SKILL.md', tpl + 'adr-capability.md'],
      'Derive INDEX rows from the rendered metadata; bootstrap output rule, not a host-run receipt.');
    if (queue) emit(id, rel('plan/README.md'), source(tpl + 'plan-README.md'), [tpl + 'plan-README.md'], 'Exact template copy.');
    cases.push({ id, root, encoding: two ? 'explicit-two-shape' : 'single-shape', queue, expected_diagnostics: [],
      native_integration: 'unverified', evidence_kind: 'deterministic template rendering' });
    return rel;
  }
  function plan(id, rel, status, done = false) {
    const shape = source(tpl + 'CONVENTIONS.md').match(/```markdown\n(## Status[\s\S]*?)\n```/)[1];
    let statusBlock = shape.replace('- Claimed by:', '- Claimed by: fixture-executor, 2026-09-15, branch `work/0001-example`.');
    if (status === 'blocked' || status === 'stopped') statusBlock = statusBlock.replace('- Blockers:', '- Blockers: Required local dependency unavailable; owner fixture-executor; next step restore dependency and rerun.');
    if (status === 'stopped') statusBlock = statusBlock.replace('- Stopped:', '- Stopped: 2026-09-15; This run: check failed, exit 1; Overall: blocked; Yet to do: restore dependency and resume the same owned branch.');
    let body = '# 0001 — Synthetic implementation\n\nOwning decision: adr/0001-synthetic-capability.md.\n\n## Scope\n\nVerify the synthetic output.\n\n## Exit criteria\n\n1. The named output is checked.\n\n## Dependencies\n\nNone.\n\n';
    body += done ? 'Prepared completion; Shipped upon checked merge. Verified work HEAD `' + 'a'.repeat(40) + '`; PR https://example.invalid/pull/1.\n' : statusBlock + '\n';
    emit(id, rel(done ? 'plan/done/2026-09-15-synthetic-implementation.md' : 'plan/todo/0001-example.md'), body,
      [tpl + 'CONVENTIONS.md', 'plugins/docflow/skills/new-plan/SKILL.md', 'plugins/docflow/skills/ship-item/SKILL.md'],
      'Exact Status template rendered with supplied synthetic values; minimal plan fields authored from new-plan contract; completion footer follows ship-item. No host execution claimed.');
  }
  base('default-root');
  base('root-pointer', '.');
  base('docs-pointer', 'docs');
  base('nested-pointer', 'governance/decisions/current');
  base('legacy-no-manifest', '.', { pointer: false });
  base('explicit-two-shape', '.docflow', { two: true });
  const optional = base('optional-layers', '.docflow', { two: true, queue: true });
  emit('optional-layers', optional('_agent/prompts/autonomous.md'), source(tpl + '_agent-prompts-autonomous.md'),
    [tpl + '_agent-prompts-autonomous.md'], 'Exact portable run prompt copy; no run invoked.');
  for (const state of ['claimed', 'blocked', 'stopped', 'resumed']) {
    const id = 'status-' + state, rel = base(id, '.', { queue: true });
    plan(id, rel, state);
    Object.assign(cases.at(-1), { status: state, owner: 'fixture-executor', branch: 'work/0001-example',
      blockers: ['blocked', 'stopped'].includes(state), next_action: ['blocked', 'stopped'].includes(state) ? 'restore dependency and rerun' : 'continue the named owned item' });
  }
  for (const phase of ['prepared', 'integrated']) {
    const id = 'completion-' + phase, rel = base(id, '.', { queue: true });
    plan(id, rel, 'resumed', true);
    for (const name of [rel('adr/0001-synthetic-capability.md'), rel('INDEX.md')]) {
      files['cases/' + id + '/' + name].content = files['cases/' + id + '/' + name].content.replaceAll('Accepted', 'Implemented');
    }
    Object.assign(cases.at(-1), { checkout_branch: phase === 'prepared' ? 'work/0001-example' : 'main',
      native_integration: 'unverified without accompanying Git history',
      git_scenario: 'Create initial main from status-resumed; commit this completion on work/0001-example; integrate via a merge commit only for completion-integrated.' });
  }
  for (const path of Object.keys(sources).filter(p => p.startsWith(legacy))) {
    const nativePath = path.slice(legacy.length);
    emit('legacy-two-range', 'docs/' + nativePath, source(path), [path],
      'Retained producer legacy fixture bytes; relocate whole artefact home to docs without migration.');
    if (['AGENTS.md', 'README.md'].includes(nativePath)) emit('legacy-two-range', nativePath,
      source(path), [path], 'Preserve legacy entry point at repository root; historical copy also retained in docs.');
  }
  const lc = files['cases/legacy-two-range/docs/CONVENTIONS.md'];
  lc.content = lc.content.replace('Artefact root: `.` — the repository root.', 'Artefact root: `docs/` — legacy nested artefact home.');
  lc.rendering += ' Only artefact-root declaration changes to docs/.';
  cases.push({ id: 'legacy-two-range', root: 'docs', encoding: 'legacy-range', queue: true,
    expected_diagnostics: ['migration-available'], native_integration: 'historical fixture evidence only',
    preserved_history: Object.keys(sources).filter(p => p.startsWith(legacy + 'plan/done/')) });
  // Every legacy record, number and done footer remains byte-identical.
  for (const [id,root] of [['federation-home','.'],['federation-member','docs']]) {
    const rel = base(id, root);
    const home = id === 'federation-home';
    let config = uncomment(source(tpl + 'federation-config.md'));
    for (const [field,value] of Object.entries({Product:'Synthetic federation',Topology:'C — home repo + local',
      'Identity scheme':'repo-prefixed slug',Home:home?'this repo':'../federation-home',
      Role:home?'home':'member','Repo id':home?'home':'member'})) {
      config = config.replace(new RegExp('^- \\*\\*' + field + ':\\*\\*.*$', 'm'), '- **' + field + ':** ' + value);
    }
    emit(id, rel('federation.md'), config, [tpl + 'federation-config.md'], 'Fill topology C, stable repo identity and explicit sibling home pointer.');
    if (home) {
      const index = uncomment(source(tpl + 'federation-index.md')).replace(/<product-name>/g,'Synthetic federation')
        .replace(/^- \*\*Topology:\*\*.*$/m,'- **Topology:** C — home repo + local')
        .replace(/^- \*\*Identity scheme:\*\*.*$/m,'- **Identity scheme:** repo-prefixed slug')
        .replace(/^\| <id>.*$/m,'| home | Federation home | home | this repo |\n| member | Federation member | member | ../federation-member |');
      emit(id, rel('federation-index.md'), index, [tpl + 'federation-index.md'], 'Render declared two-member index; identical local numbers remain distinct.');
    }
    cases.at(-1).federation = home ? 'home' : 'member';
  }
  for (const [id,pointer,code] of [
    ['invalid-pointer','root: ../outside\n','invalid-pointer'],
    ['invalid-pointer-syntax','elsewhere: docs\n','invalid-pointer'],
    ['disagreeing-pointer','root: .\n','root-disagreement'],
  ]) {
    base(id, '.', { queue: false });
    files['cases/' + id + '/.docflow'].content = pointer;
    files['cases/' + id + '/.docflow'].rendering += ' Adverse mutation: ' + code;
    if (code === 'root-disagreement') files['cases/' + id + '/CONVENTIONS.md'].content =
      files['cases/' + id + '/CONVENTIONS.md'].content.replace('Artefact root: `.`', 'Artefact root: `docs/`');
    cases.at(-1).expected_diagnostics = [code];
  }
  for (const [id,mutation,code] of [
    ['duplicate-number','duplicate','duplicate-number'],
    ['unknown-status','status','unknown-status'],
    ['unknown-shape','shape','unknown-shape'],
  ]) {
    base(id, '.');
    const path = 'cases/' + id + '/adr/0001-synthetic-capability.md';
    if (mutation === 'duplicate') files['cases/' + id + '/adr/0001-other.md'] = { ...files[path], rendering:'Adverse duplicate of the rendered record.' };
    if (mutation === 'status') files[path].content = files[path].content.replace('status: Accepted','status: Unsupported');
    if (mutation === 'shape') files[path].content = files[path].content.replace('status: Accepted','shape: unsupported\nstatus: Accepted');
    cases.at(-1).expected_diagnostics = [code];
  }
  return { files, manifest: { schema: 1, format: 'docflow-repository-producer-fixtures-1', producer_revision: revision,
    evidence_scope: 'Exact template rendering plus retained legacy producer files; plan bodies follow authoring rules. Synthetic authority, SHA and PR examples are not execution/integration evidence.',
    sources: Object.fromEntries(Object.entries(sources).map(([path,content]) => [path,{ sha256:sha256(content) }])),
    cases, files:Object.fromEntries(Object.entries(files).map(([path,file]) => [path,{ sha256:sha256(file.content), origins:file.origins, rendering:file.rendering }])),
    status_at_a_glance:{this_run:'Rendered versioned producer inputs and expected observations',overall:'partially verified',yet_to_do:'Native host and Clarity compatibility qualification on paired sources'} } };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [sourceRoot, revision, destination, refresh] = process.argv.slice(2);
  if (!sourceRoot || !/^[0-9a-f]{40}$/.test(revision || '') || !destination ||
      (existsSync(destination) && refresh !== '--refresh')) {
    throw Error('Usage: node scripts/produce-repository-fixtures.mjs <source-repo> <full-committed-revision> <destination> [--refresh]');
  }
  const git = args => {
    const r = spawnSync('git', ['--no-lazy-fetch','--no-replace-objects','-C',sourceRoot,...args], { encoding:'utf8',maxBuffer:16*1024*1024 });
    if (r.status !== 0) throw Error(r.stderr); return r.stdout;
  };
  const paths = git(['ls-tree','-r','--name-only',revision,'--',tpl,legacy]).trim().split('\n')
    .filter(p => !p.includes('/workspace-'));
  paths.push('plugins/docflow/skills/bootstrap/SKILL.md','plugins/docflow/skills/new-plan/SKILL.md',
    'plugins/docflow/skills/ship-item/SKILL.md','scripts/produce-repository-fixtures.mjs');
  const sources = Object.fromEntries(paths.map(path => [path,git(['show',revision + ':' + path])]));
  const result = renderRepositoryFixtures(sources, revision);
  if (existsSync(destination)) {
    const previous = JSON.parse(readFileSync(resolve(destination,'manifest.json'),'utf8'));
    for (const [path, file] of Object.entries(previous.files)) {
      if (!result.files[path]) throw Error('Refresh preserves old files; a removal needs separate review: ' + path);
      const existing = readFileSync(resolve(destination,path),'utf8').replace(/\r\n/g,'\n');
      if (sha256(existing) !== file.sha256) throw Error('Preserve edited fixture file: ' + path);
    }
  }
  for (const [path, file] of Object.entries(result.files)) {
    const target = resolve(destination,path); mkdirSync(dirname(target),{recursive:true}); writeFileSync(target,file.content);
  }
  for (const [path,content] of Object.entries(sources)) {
    const target = resolve(destination,'sources',path); mkdirSync(dirname(target),{recursive:true}); writeFileSync(target,content);
  }
  writeFileSync(resolve(destination,'manifest.json'),JSON.stringify(result.manifest,null,2)+'\n');
  console.log('Produced ' + result.manifest.cases.length + ' cases and ' + Object.keys(result.files).length + ' files from ' + revision);
}
