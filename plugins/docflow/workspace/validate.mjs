import { readFileSync, readdirSync, realpathSync, statSync } from 'node:fs';
import { resolve, relative, isAbsolute, dirname, basename, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
export const schema = JSON.parse(readFileSync(resolve(here, 'schema.json'), 'utf8'));
export const kinds = ['ideas', 'decisions', 'work', 'knowledge', 'runs'];

// Historical lookup is deliberately offline. Unsupported Git or unavailable
// local objects fail closed; inherited repository/config state is not authority.
export function inspectHistoricalFile(rootInput, ref) {
  if (!/^[0-9a-f]{40}$/.test(ref.revision || '') ||
      typeof ref.path !== 'string' || isAbsolute(ref.path) ||
      /[\\:\u0000]/.test(ref.path) ||
      ref.path.split('/').some(p => !p || p === '.' || p === '..')) return false;
  try {
    const root = realpathSync(rootInput);
    const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^GIT_/i.test(k)));
    Object.assign(env, {
      GIT_NO_LAZY_FETCH: '1', GIT_NO_REPLACE_OBJECTS: '1',
      GIT_OPTIONAL_LOCKS: '0', GIT_CONFIG_NOSYSTEM: '1',
      GIT_CONFIG_GLOBAL: process.platform === 'win32' ? 'NUL' : '/dev/null',
      GIT_CONFIG_SYSTEM: process.platform === 'win32' ? 'NUL' : '/dev/null',
      GIT_CONFIG_COUNT: '0', GIT_TERMINAL_PROMPT: '0',
    });
    const options = { env, encoding: 'utf8', timeout: 5000, windowsHide: true, maxBuffer: 1024 * 1024 };
    const git = args => spawnSync('git', ['--no-lazy-fetch', '--no-replace-objects',
      '--no-optional-locks', '--literal-pathspecs', '-c', 'protocol.allow=never',
      '-C', root, ...args], options);
    const top = git(['rev-parse', '--show-toplevel']);
    if (top.status !== 0) return false;
    const actual = realpathSync(top.stdout.trim());
    const same = process.platform === 'win32' ? actual.toLowerCase() === root.toLowerCase() : actual === root;
    if (!same) return false;
    const type = git(['cat-file', '-t', ref.revision]);
    if (type.status !== 0 || !['commit', 'tree'].includes(type.stdout.trim())) return false;
    const tree = git(['ls-tree', '-z', ref.revision, '--', ref.path]);
    if (tree.status !== 0) return false;
    const entries = tree.stdout.split('\0');
    if (entries.length !== 2 || entries[1] !== '') return false;
    const match = entries[0].match(/^100(?:644|755) blob ([0-9a-f]{40})\t([\s\S]+)$/);
    if (!match || match[2] !== ref.path) return false;
    const blob = git(['cat-file', '-t', match[1]]);
    return blob.status === 0 && blob.stdout.trim() === 'blob';
  } catch { return false; }
}
const transitions = {
  ideas: { backlog: ['selected', 'rejected', 'discarded'], selected: ['backlog', 'rejected', 'discarded'], rejected: ['backlog'], discarded: ['backlog'] },
  decisions: { proposed: ['accepted', 'rejected', 'superseded'], accepted: ['superseded'], rejected: ['superseded'], superseded: [] },
  work: { planned: ['active', 'cancelled'], active: ['review', 'cancelled'], review: ['active', 'done', 'cancelled'], done: [], cancelled: [] },
  runs: { running: ['succeeded', 'failed', 'stopped', 'unknown'], unknown: ['succeeded', 'failed', 'stopped'], succeeded: [], failed: [], stopped: [] },
  grant: { active: ['suspended', 'revoked', 'closed'], suspended: ['active', 'revoked', 'closed'], revoked: [], closed: [] },
};
const initial = { ideas: 'backlog', decisions: 'proposed', work: 'planned', runs: 'running', grant: 'active' };
const uuid = new RegExp(schema.$defs.recordRef.properties.id.pattern);
const equal = isDeepStrictEqual;
const key = r => `${r.home}#${r.id}`;
const time = s => Date.parse(s);
const within = (root, path) => { const r = relative(root, path); return !isAbsolute(r) && r !== '..' && !r.startsWith(`..${sep}`); };

// JSON is the entire supported YAML subset. Parse syntax first, then reject
// duplicate decoded object keys (JSON.parse alone silently keeps the last).
export function parseMetadata(text) {
  if (Buffer.byteLength(text) > 4 * 1024 * 1024) throw Error('metadata exceeds 4 MiB');
  const data = JSON.parse(text);
  const tokens = text.match(/"(?:[^"\\\u0000-\u001f]|\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4}))*"|[{}\[\]:,]|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null/g) || [];
  const stack = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === '{' || token === '[') {
      stack.push(token === '{' ? new Set() : null);
      if (stack.length > 128) throw Error('metadata nesting exceeds 128');
    } else if (token === '}' || token === ']') stack.pop();
    else if (token.startsWith('"') && tokens[i + 1] === ':') {
      const name = JSON.parse(token), seen = stack.at(-1);
      if (seen.has(name)) throw Error('duplicate metadata key');
      seen.add(name);
    }
  }
  return data;
}

export function parseRecord(text) {
  const m = text.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m || !/^#\s+\S/m.test(m[2])) throw Error('expected JSON-compatible YAML front matter and a Markdown H1 body');
  return parseMetadata(m[1]);
}

// Implements only the keywords used by the distributed schema; no coercion,
// defaults, remote references, expression evaluation or arbitrary validators.
export function checkShape(value, definition) {
  const errors = [];
  function check(v, s, path) {
    if (s.$ref) return check(v, schema.$defs[s.$ref.split('/').at(-1)], path);
    if (s.anyOf) {
      if (!s.anyOf.some(alt => { const start = errors.length; check(v, alt, path); const ok = errors.length === start; errors.splice(start); return ok; })) errors.push(`${path}: incompatible type`);
      return;
    }
    if ('const' in s && v !== s.const) errors.push(`${path}: unsupported value/version`);
    if (s.enum && !s.enum.includes(v)) errors.push(`${path}: invalid state/value`);
    if (s.type) {
      const ok = s.type === 'null' ? v === null : s.type === 'array' ? Array.isArray(v) : s.type === 'object' ? v !== null && typeof v === 'object' && !Array.isArray(v) : s.type === 'integer' ? Number.isSafeInteger(v) : typeof v === s.type;
      if (!ok) { errors.push(`${path}: expected ${s.type}`); return; }
    }
    if (typeof v === 'string') {
      if (s.minLength && !v.trim()) errors.push(`${path}: empty string`);
      if (s.pattern && !new RegExp(s.pattern).test(v)) errors.push(`${path}: malformed value`);
      if (s.format === 'date-time' && (!Number.isFinite(time(v)) || new Date(v).toISOString().replace('.000Z', 'Z') !== v)) errors.push(`${path}: invalid UTC time`);
    }
    if (typeof v === 'number' && s.minimum !== undefined && v < s.minimum) errors.push(`${path}: below minimum`);
    if (Array.isArray(v)) {
      if (v.length < (s.minItems || 0)) errors.push(`${path}: too few entries`);
      if (s.items) v.forEach((x, i) => check(x, s.items, `${path}[${i}]`));
    } else if (v && typeof v === 'object' && s.properties) {
      for (const required of s.required || []) if (!Object.hasOwn(v, required)) errors.push(`${path}.${required}: missing field`);
      for (const [k, x] of Object.entries(v)) {
        if (Object.hasOwn(s.properties, k)) check(x, s.properties[k], `${path}.${k}`);
        else if (s.additionalProperties === false) errors.push(`${path}.${k}: unknown field`);
      }
    }
  }
  check(value, schema.$defs[definition], definition);
  return errors;
}

export function lookupShort(records, home, prefix) {
  if (!/^[0-9a-f]{12}(?:[0-9a-f]{4}){0,5}$/.test(prefix)) throw Error('invalid short reference');
  const matches = records.filter(r => r.home === home && r.id.replaceAll('-', '').startsWith(prefix));
  if (matches.length !== 1) throw Error(matches.length ? 'ambiguous short reference' : 'unresolved short reference');
  return matches[0];
}

export function proposeFilename(records, home, id, slug) {
  if (!uuid.test(id) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw Error('invalid identity or slug');
  if (records.some(r => r.home === home && r.id === id)) throw Error('duplicate full identity');
  const hex = id.replaceAll('-', '');
  for (let length = 12; length <= 32; length += 4) {
    const prefix = hex.slice(0, length);
    if (!records.some(r => r.home === home && r.id.replaceAll('-', '').startsWith(prefix))) return `${slug}--${prefix}.md`;
  }
  throw Error('identity collision');
}

export function validateWorkspace(rootPath, { at, previous } = {}) {
  const diagnostics = [], records = [], homes = new Map(), members = new Map();
  const paths = new Map(), byId = new Map(), configurations = [];
  const fail = (code, path, message) => diagnostics.push({ code, path, message });
  if (checkShape({ at }, 'history').some(x => x.startsWith('history.at:'))) fail('time', '--at', 'supply a valid UTC evaluation time');
  if (!at) fail('time', '--at', 'explicit evaluation time required');
  function safePath(root, rel, label) {
    if (typeof rel !== 'string' || isAbsolute(rel) || /[\\:\u0000]/.test(rel) || rel.split('/').some(x => !x || x === '.' || x === '..')) throw Error(`${label}: expected a contained relative path`);
    const p = realpathSync(resolve(root, rel));
    if (!within(root, p)) throw Error(`${label}: path escapes declared root`);
    return p;
  }
  function read(root, rel, parse = parseMetadata) {
    const p = safePath(root, rel, rel);
    if (!statSync(p).isFile()) throw Error('expected regular file');
    return parse(readFileSync(p, 'utf8'));
  }
  function unique(items, label, get = x => x.id) {
    const seen = new Set();
    for (const item of items) { const id = get(item); if (seen.has(id)) fail('duplicate', label, 'duplicate identifier'); seen.add(id); }
  }
  function load(rootInput, expectedHome, loading = new Set()) {
    let root, registry;
    try { root = realpathSync(rootInput); registry = read(root, '.docflow_workspace/workspace.yaml'); }
    catch (e) { fail('registry', String(rootInput), e.message); return; }
    const shape = checkShape(registry, 'registry');
    if (shape.length) { shape.forEach(x => fail('schema', root, x)); return; }
    if (expectedHome && expectedHome !== registry.home) { fail('home', root, 'external home disagrees with registry'); return; }
    if (homes.has(registry.home)) { if (homes.get(registry.home).root !== root) fail('home', root, 'canonical home declared at competing roots'); return; }
    homes.set(registry.home, { root, registry });
    loading.add(root);
    unique(registry.repositories, root);
    unique(registry.external_homes, root, x => x.home);
    unique(registry.resources, root);
    const aliases = new Set(), roots = new Set();
    for (const member of registry.repositories) {
      for (const alias of [member.id, ...member.aliases]) {
        if (aliases.has(alias)) fail('alias', root, 'ambiguous repository identity/alias');
        aliases.add(alias);
      }
      try {
        const memberRoot = realpathSync(resolve(root, member.path));
        if (!statSync(memberRoot).isDirectory()) throw Error('member is not a directory');
        if (roots.has(memberRoot)) throw Error('same member path has multiple identities');
        if (within(memberRoot, resolve(root, '.docflow_workspace')) || within(resolve(root, '.docflow_workspace'), memberRoot)) throw Error('member overlaps workspace-owned records');
        roots.add(memberRoot);
        for (const instruction of member.instructions) safePath(memberRoot, instruction, 'member instruction');
        for (const id of [member.id, ...member.aliases]) members.set(`${registry.home}#${id}`, { ...member, root: memberRoot });
      } catch (e) { fail('member-path', member.path, e.message); }
    }
    for (const kind of kinds) {
      const directory = `.docflow_workspace/${kind}`;
      try {
        const dir = safePath(root, directory, directory);
        for (const entry of readdirSync(dir).sort()) {
          if (!entry.endsWith('.md')) { fail('record-file', `${directory}/${entry}`, 'unexpected record file'); continue; }
          const path = `${directory}/${entry}`;
          try {
            const record = read(root, path, parseRecord), issues = checkShape(record, kind);
            if (issues.length) { issues.forEach(x => fail('schema', path, x)); continue; }
            const r = { ...record, path };
            records.push(r);
            if (r.home !== registry.home) fail('home', path, 'record home disagrees with canonical root');
            if (byId.has(key(r))) fail('duplicate', path, 'duplicate full identity');
            else byId.set(key(r), r);
            const pathKey = `${registry.home}#${path.toLowerCase()}`;
            if (paths.has(pathKey)) fail('path-collision', path, 'case-insensitive filename collision');
            paths.set(pathKey, r);
            const match = entry.match(/^[a-z0-9]+(?:-[a-z0-9]+)*--([0-9a-f]{12}(?:[0-9a-f]{4}){0,5})\.md$/);
            if (!match || !r.id.replaceAll('-', '').startsWith(match[1])) fail('filename', path, 'filename does not match canonical identity');
          } catch (e) { fail('parse', path, e.message); }
        }
      } catch (e) { fail('record-path', directory, e.message); }
    }
    for (const [folder, def] of [['agents', 'role'], ['profiles', 'profile']]) {
      try {
        const dir = safePath(root, `.docflow_workspace/${folder}`, folder);
        for (const f of readdirSync(dir).sort()) {
          const path = `.docflow_workspace/${folder}/${f}`;
          const config = read(root, path, parseRecord);
          const issues = checkShape(config, def);
          if (issues.length) issues.forEach(x => fail('schema', path, x));
          else configurations.push({ home: registry.home, def, path, config });
        }
      } catch (e) { fail('configuration', folder, e.message); }
    }
    try {
      const config = read(root, '.docflow_workspace/integrations/sources.yaml');
      const issues = checkShape(config, 'sources');
      if (issues.length) issues.forEach(x => fail('schema', root, x));
      else configurations.push({ home: registry.home, def: 'sources', config });
    } catch (e) { fail('configuration', root, e.message); }
    for (const ext of registry.external_homes) {
      const extRoot = resolve(root, ext.path);
      if (!loading.has(extRoot)) load(extRoot, ext.home, loading);
    }
  }
  load(rootPath);

  function resolveRecord(ref, path, expectedKind) {
    const target = byId.get(key(ref));
    if (!target || target.path !== ref.path) fail('reference', path, 'unresolved canonical home/full ID/path');
    else if (expectedKind && target.kind !== expectedKind) fail('reference-kind', path, `expected ${expectedKind}`);
    return target;
  }
  function native(ref, home, label) {
    const member = members.get(`${home}#${ref.repository}`);
    const root = member?.root || (ref.repository === home ? homes.get(home)?.root : undefined);
    if (!root) { fail('native-reference', label, 'unresolved member identity'); return; }
    try { const p = safePath(root, ref.path, label); if (!statSync(p).isFile()) throw Error('native reference is not a file'); }
    catch (e) {
      // An immutable brief may name a native todo file that has since moved.
      // Resolve a missing file in the explicitly bound local Git object;
      // never fetch, run hooks, accept traversal, or follow a historical symlink.
      const contained = typeof ref.path === 'string' && !isAbsolute(ref.path) && !/[\\:\u0000]/.test(ref.path) && !ref.path.split('/').some(x => !x || x === '.' || x === '..');
      let historical = false;
      if (e.code === 'ENOENT' && contained) {
        historical = inspectHistoricalFile(root, ref);
      }
      if (!historical) fail('native-path', label, e.message);
    }
  }
  // References in any typed field are checked, including mandates and evidence;
  // extensions remain inert and are not traversed as authoritative structures.
  function references(v, home, label) {
    if (!v || typeof v !== 'object') return;
    if (v.home && v.id && v.path) resolveRecord(v, label);
    if (v.repository && v.path && v.revision) native(v, home, label);
    if (v.observed_at && at && time(v.observed_at) > time(at)) fail('future-evidence', label, 'observation is after evaluation time');
    for (const [k, x] of Object.entries(v)) if (k !== 'extensions') references(x, home, `${label}.${k}`);
  }
  function history(entries, kind, state, label, created) {
    if (entries[0].state !== initial[kind]) fail('transition', label, 'history has invalid initial state');
    if (created && entries[0].at !== created) fail('transition', label, 'history must start at creation time');
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i], before = entries[i - 1];
      if (!(e.state in transitions[kind])) fail('transition', label, 'history contains unsupported state');
      if (at && time(e.at) > time(at)) fail('transition', label, 'history is after evaluation time');
      if (before && (time(e.at) < time(before.at) || (e.state !== before.state && !transitions[kind][before.state]?.includes(e.state)))) fail('transition', label, 'illegal or unordered transition');
    }
    if (entries.at(-1).state !== state) fail('transition', label, 'history disagrees with current state');
  }
  const passed = evidence => evidence.length > 0 && evidence.every(e => e.outcome === 'passed');
  const completedObservation = d => d.observation.complete && d.observation.state === d.required_completion && d.observation.observed_at && d.observation.source_revision && passed(d.observation.evidence) && d.observation.evidence.every(e => e.revision === d.observation.source_revision && time(e.observed_at) <= time(d.observation.observed_at) && (!d.repository || e.repository === d.repository));
  for (const r of records) {
    references(r, r.home, r.path);
    if (r.history) history(r.history, r.kind, r.state, r.path, r.created_at);
    if (at && time(r.created_at) > time(at)) fail('time', r.path, 'creation is after evaluation time');
    for (const repo of r.affected_repositories || []) if (!members.has(`${r.home}#${repo}`)) fail('member', r.path, 'unknown affected repository');
    if (r.kind === 'decisions') {
      if (r.state === 'accepted' && (!r.acceptance || r.acceptance.mandate.outcome !== 'passed')) fail('acceptance', r.path, 'accepted agreement needs a source mandate');
      if (r.acceptance && (!r.history.some(h => h.state === 'accepted' && h.at === r.acceptance.at) || time(r.acceptance.mandate.observed_at) > time(r.acceptance.at))) fail('acceptance', r.path, 'acceptance time/mandate disagrees with history');
      if (r.state === 'superseded' && !r.successors.length) fail('successor', r.path, 'superseded agreement needs a successor');
      if (r.successors.length && r.state !== 'superseded') fail('successor', r.path, 'agreement with successor must be superseded');
    }
    for (const direction of ['predecessors', 'successors']) for (const ref of r[direction] || []) {
      const other = resolveRecord(ref, r.path, r.kind), reverse = direction === 'predecessors' ? 'successors' : 'predecessors';
      if (other && !(other[reverse] || []).some(x => key(x) === key(r))) fail('successor', r.path, 'predecessor/successor must be reciprocal');
    }
    if (r.kind !== 'work') continue;
    unique(r.deliveries, r.path); unique(r.grants, r.path); unique(r.criteria, r.path); unique(r.recommendations, r.path);
    for (const dep of r.dependencies) resolveRecord(dep, r.path, 'work');
    for (const delivery of r.deliveries) {
      if (delivery.repository && !members.has(`${r.home}#${delivery.repository}`)) fail('member', r.path, 'delivery member is unavailable');
      if (delivery.native_work && delivery.native_work.repository !== delivery.repository) fail('native-work', r.path, 'delivery native work belongs to another repository');
      if (delivery.observation.complete && !completedObservation(delivery)) fail('completion', r.path, 'delivery completion lacks matching passed native evidence');
      for (const id of delivery.depends_on) if (!r.deliveries.some(d => d.id === id)) fail('dependency', r.path, 'missing delivery dependency');
    }
    for (const grant of r.grants) {
      history(grant.revisions.map(g => ({ ...g, at: g.recorded_at })), 'grant', grant.revisions.at(-1).state, r.path);
      for (let i = 0; i < grant.revisions.length; i++) {
        const g = grant.revisions[i], prev = grant.revisions[i - 1];
        if (g.revision !== i + 1) fail('grant-revision', r.path, 'grant revisions must be contiguous');
        if (!r.deliveries.some(d => d.id === g.delivery)) fail('grant-delivery', r.path, 'grant delivery does not exist');
        if (g.mandate.outcome !== 'passed' || time(g.approved_at) > time(g.recorded_at) || time(g.mandate.observed_at) > time(g.approved_at) || time(g.valid_from) < time(g.approved_at) || time(g.expires_at) <= time(g.valid_from)) fail('grant-time', r.path, 'invalid approval/validity evidence');
        if (prev && (g.actor !== prev.actor || g.scope_revision !== prev.scope_revision || g.delivery !== prev.delivery) && prev.state !== 'suspended') fail('grant-change', r.path, 'actor or scope change requires suspension or a new grant');
      }
    }
    if (r.state === 'done' && (r.deliveries.filter(d => d.required).some(d => !completedObservation(d)) || r.criteria.some(c => !passed(c.evidence)) || r.blockers.length)) fail('completion', r.path, 'overall completion has unevidenced criteria, deliveries or blockers');
    if (r.state === 'done') {
      const doneAt = time(r.history.at(-1).at);
      if (r.deliveries.filter(d => d.required).some(d => time(d.observation.observed_at) > doneAt) || r.criteria.some(c => c.evidence.some(e => time(e.observed_at) > doneAt))) fail('completion-time', r.path, 'completion predates required evidence');
    }
  }
  function acyclic(nodes, neighbours, label) {
    const seen = new Set(), visiting = new Set();
    function visit(id) {
      if (visiting.has(id)) { fail('cycle', label, 'dependency or successor cycle'); return; }
      if (seen.has(id)) return;
      visiting.add(id);
      for (const next of neighbours(id)) if (nodes.has(next)) visit(next);
      visiting.delete(id); seen.add(id);
    }
    for (const id of nodes.keys()) visit(id);
  }
  acyclic(byId, id => (byId.get(id).successors || []).map(key), 'successors');
  acyclic(byId, id => (byId.get(id).dependencies || []).map(key), 'work dependencies');
  for (const r of records.filter(r => r.kind === 'work')) {
    const ds = new Map(r.deliveries.map(d => [d.id, d]));
    acyclic(ds, id => ds.get(id).depends_on, r.path);
  }

  const attempts = [];
  for (const r of records.filter(r => r.kind === 'runs')) {
    const brief = r.brief, work = resolveRecord(brief.work, r.path, 'work');
    if (!work || work.kind !== 'work' || !homes.has(work.home)) { fail('authority', r.path, 'work canonical home is unavailable'); continue; }
    const delivery = work.deliveries.find(d => d.id === brief.delivery);
    const grant = work.grants.find(g => g.id === brief.grant.id);
    const revision = grant?.revisions.find(g => g.revision === brief.grant.revision);
    if (!delivery || !revision || key(brief.grant.work) !== key(work)) { fail('authority', r.path, 'missing work/delivery/grant revision'); continue; }
    const member = delivery.repository && members.get(`${work.home}#${delivery.repository}`);
    if (brief.return_path !== r.path) fail('return-path', r.path, 'brief return path must be this canonical run record');
    if ((r.state === 'running' && !equal(brief.native_work, delivery.native_work)) || (delivery.repository && (!brief.native_work || brief.native_work.repository !== delivery.repository))) fail('native-work', r.path, 'dispatch requires a compatible native work reference; running work must match the current delivery');
    if (r.started_at !== r.created_at || (r.ended_at && time(r.ended_at) < time(r.started_at))) fail('run-time', r.path, 'invalid attempt interval');
    if (r.state === 'running' && (r.ended_at || r.receipt)) fail('receipt', r.path, 'running attempt cannot claim a terminal return');
    if (['succeeded', 'failed', 'stopped'].includes(r.state) && (!r.ended_at || !r.receipt)) fail('receipt', r.path, 'terminal attempt needs end time and receipt');
    if (r.state === 'unknown' && r.ended_at && !r.reconciliation) fail('reconciliation', r.path, 'unknown contact cannot establish release without reconciliation');
    function authority(atTime) {
      const current = grant.revisions.filter(g => time(g.recorded_at) <= time(atTime)).at(-1);
      if (!current || current.state !== 'active' || current.revision !== revision.revision || current.actor !== brief.actor || current.delivery !== delivery.id || current.scope_revision !== brief.scope_revision || time(atTime) < time(current.valid_from) || time(atTime) >= time(current.expires_at)) fail('authority', r.path, 'action lacks current compatible unexpired grant');
    }
    authority(r.started_at);
    if (brief.stop_at !== revision.stop_at) fail('authority', r.path, 'brief stopping point differs from grant');
    if (r.state === 'running') {
      authority(at);
      if (delivery.scope_revision !== brief.scope_revision || delivery.scope !== brief.scope || work.state !== 'active') fail('authority', r.path, 'current delivery scope/work state disagrees with running assignment');
    }
    let lastAction = time(r.started_at);
    for (const action of r.actions) {
      authority(action.at);
      if (time(action.at) < lastAction || time(action.at) > time(r.ended_at || at)) fail('run-time', r.path, 'action lies outside the ordered attempt interval');
      lastAction = time(action.at);
      if (!revision.actions.includes(action.action)) fail('authority-action', r.path, 'action/effect not granted');
      if (member?.role === 'reference' && !['read', 'test', 'report'].includes(action.action)) fail('reference-only', r.path, 'mutating action against reference member');
    }
    if (member?.role === 'reference' && revision.actions.some(a => !['read', 'test', 'report'].includes(a))) fail('reference-only', r.path, 'reference member has a mutating assignment');
    const claim = brief.claim;
    if (claim.owner !== brief.actor || claim.state !== 'held' || claim.source.outcome !== 'passed' || claim.source.repository !== (delivery.repository || work.home) || time(claim.observed_at) > time(r.started_at) || time(claim.source.observed_at) > time(claim.observed_at) || time(claim.expires_at) <= time(r.state === 'running' ? at : r.started_at)) fail('claim', r.path, 'dispatch lacks current shared native ownership/serial confirmation');
    for (const action of r.actions) if (time(action.at) >= time(claim.expires_at)) fail('claim', r.path, 'action is after native ownership observation expiry');
    for (const dep of [...work.dependencies, ...brief.dependencies]) {
      const target = resolveRecord(dep, r.path, 'work');
      if (target && (target.state !== 'done' || time(target.history.at(-1).at) > time(r.started_at))) fail('dependency', r.path, 'work dependency was not complete before dispatch');
    }
    for (const dep of delivery.depends_on) {
      const target = work.deliveries.find(d => d.id === dep);
      if (!target || !completedObservation(target) || time(target.observation.observed_at) > time(r.started_at)) fail('dependency', r.path, 'delivery dependency was not evidenced before dispatch');
    }
    for (const resource of brief.resources) {
      if (!homes.get(r.home)?.registry.resources.some(x => x.id === resource.resource) || resource.owner !== brief.actor || resource.source.outcome !== 'passed' || time(resource.source.observed_at) > time(r.started_at) || time(resource.start) > time(r.started_at) || time(resource.end) <= time(resource.start) || time(resource.end) < time(r.ended_at || at)) fail('resource', r.path, 'missing or incompatible resource reservation');
    }
    if (r.receipt) {
      if (!r.ended_at || time(r.receipt.returned_at) < time(r.ended_at) || time(r.receipt.returned_at) > time(at)) fail('receipt-time', r.path, 'receipt time disagrees with attempt');
      unique(r.receipt.checks, r.path, c => c.name);
      for (const check of r.receipt.checks) {
        if (check.outcome === 'passed' && (check.exit_code !== 0 || !passed(check.evidence) || check.evidence.some(e => e.revision !== r.receipt.head_revision))) fail('check-evidence', r.path, 'passed check lacks exact successful source evidence');
        if (check.outcome === 'failed' && (check.exit_code === null || check.exit_code === 0)) fail('check-evidence', r.path, 'failed process needs a non-zero exit');
        if (['skipped', 'unknown'].includes(check.outcome) && check.exit_code !== null) fail('check-evidence', r.path, 'unexecuted/unknown check cannot assert a process exit');
      }
      if (r.state === 'succeeded' && (brief.required_checks.some(name => !r.receipt.checks.some(c => c.name === name && c.outcome === 'passed')) || !passed(r.receipt.evidence) || r.receipt.evidence.some(e => e.revision !== r.receipt.head_revision) || r.receipt.blockers.length)) fail('completion', r.path, 'successful attempt lacks required checks and matching evidence');
    }
    if (r.reconciliation && (!passed(r.reconciliation.evidence) || time(r.reconciliation.at) < time(r.ended_at || r.started_at) || time(r.reconciliation.at) > time(at))) fail('reconciliation', r.path, 'invalid reconciliation evidence/time');
    for (const predecessor of r.predecessors) {
      const pred = resolveRecord(predecessor, r.path, 'runs');
      if (pred && (!pred.reconciliation || !pred.ended_at || !['stopped', 'failed', 'succeeded'].includes(pred.state) || time(pred.reconciliation.at) > time(r.started_at) || key(pred.brief.work) !== key(work) || pred.brief.delivery !== delivery.id)) fail('reassignment', r.path, 'predecessor not reconciled before reassignment');
    }
    attempts.push({ record: r, repository: member?.root || homes.get(work.home).root, start: time(r.started_at), end: r.ended_at ? time(r.ended_at) : Infinity });
  }
  for (let i = 0; i < attempts.length; i++) for (let j = i + 1; j < attempts.length; j++) {
    const a = attempts[i], b = attempts[j];
    if (a.repository === b.repository && a.start < b.end && b.start < a.end) fail('claim-overlap', b.record.path, 'overlapping attempts on the same canonical member');
    for (const x of a.record.brief.resources) for (const y of b.record.brief.resources) if (x.resource === y.resource && time(x.start) < time(y.end) && time(y.start) < time(x.end)) fail('resource-overlap', b.record.path, 'overlapping exclusive resource reservations');
  }
  for (const w of records.filter(r => r.kind === 'work' && r.state === 'active')) if (!attempts.some(a => key(a.record.brief.work) === key(w))) fail('work-state', w.path, 'active work has no authorised attempt record');

  const assets = new Map(), roles = new Map(), aliases = new Set();
  for (const c of configurations.filter(c => c.def === 'sources')) {
    unique(c.config.sources, c.home);
    for (const source of c.config.sources) { unique(source.assets, c.home, a => `${a.id}#${a.revision}`); for (const a of source.assets) assets.set(`${c.home}#${source.id}#${a.id}#${a.revision}`, a); }
  }
  function asset(ref, home, label) { if (!assets.has(`${home}#${ref.source}#${ref.asset}#${ref.revision}`)) fail('asset', label, 'unresolved pinned asset revision'); }
  for (const c of configurations) {
    const v = c.config;
    if (c.def === 'role') {
      const id = `${c.home}#${v.id}#${v.revision}`;
      if (roles.has(id) || !v.id.includes(':')) fail('role', c.path, 'duplicate or non-namespaced role');
      roles.set(id, v); v.skills.forEach(x => asset(x, c.home, c.path));
      for (const m of v.native_mappings) { const alias = `${c.home}#${m.host}#${m.alias}`; if (aliases.has(alias)) fail('native-alias', c.path, 'ambiguous native alias'); aliases.add(alias); }
    }
    if (c.def === 'sources') for (const s of v.sources) for (const a of s.assets) if (a.replacement) asset(a.replacement, c.home, 'sources');
  }
  for (const c of configurations.filter(c => c.def === 'profile')) {
    if (!roles.has(`${c.home}#${c.config.role}#${c.config.role_revision}`)) fail('profile', c.path, 'unresolved pinned role');
    c.config.assets.forEach(x => asset(x, c.home, c.path));
  }
  for (const r of records) {
    for (const rec of r.recommendations || []) {
      asset(rec.asset, r.home, r.path);
      if (rec.authority) {
        const w = resolveRecord(rec.authority.work, r.path, 'work');
        if (!w?.grants?.some(g => g.id === rec.authority.id && g.revisions.some(v => v.revision === rec.authority.revision))) fail('authority', r.path, 'recommendation grant reference is unresolved');
      }
    }
    for (const a of r.brief?.selected_assets || []) asset(a, r.home, r.path);
    for (const a of r.receipt?.used_assets || []) asset(a.asset, r.home, r.path);
  }
  for (const home of homes.keys()) {
    const seen = new Map();
    for (const r of records.filter(r => r.home === home)) {
      const suffix = basename(r.path).match(/--([0-9a-f]+)\.md$/)?.[1];
      if (suffix && seen.has(suffix) && seen.get(suffix) !== r.id) fail('short-collision', r.path, 'published suffix collision requires reconciliation');
      seen.set(suffix, r.id);
    }
  }
  if (previous) {
    const old = validateWorkspace(previous, { at });
    if (!old.valid) fail('previous', String(previous), 'previous snapshot is invalid; cannot compare');
    const prefix = (a, b) => equal(a, b.slice(0, a.length));
    for (const prior of old.records) {
      const current = byId.get(key(prior));
      if (!current || current.path !== prior.path || current.kind !== prior.kind || current.created_at !== prior.created_at) { fail('immutable', prior.path, 'record removed or immutable identity/path changed'); continue; }
      if (prior.history && !prefix(prior.history, current.history)) fail('history-rewrite', prior.path, 'transition history was rewritten');
      if (prior.kind === 'work') {
        for (const g of prior.grants) { const next = current.grants.find(n => n.id === g.id); if (!next || !prefix(g.revisions, next.revisions)) fail('history-rewrite', prior.path, 'grant history was rewritten'); }
        if (current.scope_revision < prior.scope_revision || (current.scope !== prior.scope && current.scope_revision <= prior.scope_revision)) fail('scope-revision', prior.path, 'scope changed without revision advancement');
        for (const d of prior.deliveries) { const next = current.deliveries.find(n => n.id === d.id); if (!next || next.scope_revision < d.scope_revision || (next.scope !== d.scope && next.scope_revision <= d.scope_revision)) fail('scope-revision', prior.path, 'delivery removed or changed without scope revision'); }
      }
      if (prior.kind === 'runs' && (!equal(prior.brief, current.brief) || !prefix(prior.actions, current.actions) || (prior.receipt && !equal(prior.receipt, current.receipt)))) fail('history-rewrite', prior.path, 'brief, actions or returned receipt was rewritten');
    }
  }
  const overview = records.filter(r => r.kind === 'work').map(r => ({ home: r.home, id: r.id, path: r.path, state: r.state, owner: r.owner, next_action: r.next_action, deliveries: r.deliveries.map(d => ({ id: d.id, native_state: d.observation.state, complete: Boolean(completedObservation(d)), observed_at: d.observation.observed_at })) }));
  diagnostics.sort((a, b) => `${a.path}:${a.code}:${a.message}`.localeCompare(`${b.path}:${b.code}:${b.message}`, 'en'));
  return { schema: 1, evaluated_at: at || null, valid: diagnostics.length === 0, diagnostics, records, overview };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [root, ...args] = process.argv.slice(2);
  const options = {};
  let invalid = !root;
  for (let i = 0; i < args.length; i += 2) {
    if (!['--at', '--previous'].includes(args[i]) || !args[i + 1] || options[args[i].slice(2)]) invalid = true;
    options[args[i].slice(2)] = args[i + 1];
  }
  if (invalid) { console.error('Usage: node validate.mjs <workspace-root> --at <UTC-time> [--previous <workspace-root>]'); process.exitCode = 2; }
  else {
    try { const result = validateWorkspace(root, options); console.log(JSON.stringify(result, null, 2)); process.exitCode = result.valid ? 0 : 1; }
    catch (e) { console.log(JSON.stringify({ valid: false, diagnostics: [{ code: 'input', message: e.message }] })); process.exitCode = 1; }
  }
}
