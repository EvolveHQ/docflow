#!/usr/bin/env node
// Static verify gate for docflow (ADR 0011). Deterministic, no network,
// no model call. Validates: manifests + version sync (ADR 0008), skill
// structure + multi-target parity (ADR 0007/0015), ADR catalogue
// integrity + INDEX row fidelity (ADR 0001; section order, numbered
// acceptance criteria, depends-on resolution per ADR 0011 r3),
// ADR-privacy leakage into user-visible surfaces (ADR 0004), and
// plan/done queue discipline. Exit 0 = shippable, 1 = blocked.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const fail = (msg) => errors.push(msg);

function read(rel) {
  // Normalise CRLF → LF so parsing is line-ending agnostic (Windows
  // checkouts with autocrlf hand us CRLF).
  return readFileSync(join(root, rel), 'utf8').replace(/\r\n/g, '\n');
}
function readJSON(rel) {
  try {
    return JSON.parse(read(rel));
  } catch (e) {
    fail(`${rel}: failed to parse — ${e.message}`);
    return null;
  }
}
// Split a Markdown file into its YAML-ish frontmatter block and body.
function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { fields: null, body: text };
  const fields = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (kv) fields[kv[1]] = kv[2].trim();
  }
  return { fields, body: m[2] };
}

// ── A. Manifests + version sync (folds in the original verify gate) ──
// Three manifests carry the version — Claude Code, npm/pi, and Codex —
// and must all match (CONVENTIONS.md §Version-Sync Invariant).
const pkg = readJSON('package.json');
const plugin = readJSON('plugins/docflow/.claude-plugin/plugin.json');
const marketplace = readJSON('.claude-plugin/marketplace.json');
const codexPlugin = readJSON('plugins/docflow/.codex-plugin/plugin.json');
const codexMarket = readJSON('.agents/plugins/marketplace.json');

const versioned = [
  ['package.json', pkg],
  ['plugins/docflow/.claude-plugin/plugin.json', plugin],
  ['plugins/docflow/.codex-plugin/plugin.json', codexPlugin],
].filter(([, m]) => m);
const versions = [...new Set(versioned.map(([, m]) => m.version))];
if (versions.length > 1) {
  fail(
    'version mismatch across manifests — bump them together: ' +
    versioned.map(([f, m]) => `${f}=${m.version}`).join(' '),
  );
}
// Each marketplace must list its plugin by name.
for (const [mfile, mkt, pluginName] of [
  ['.claude-plugin/marketplace.json', marketplace, plugin?.name],
  ['.agents/plugins/marketplace.json', codexMarket, codexPlugin?.name],
]) {
  if (mkt && pluginName) {
    const names = (mkt.plugins ?? []).map((p) => p.name);
    if (!names.includes(pluginName)) {
      fail(`${mfile} lists ${JSON.stringify(names)} but plugin name is "${pluginName}"`);
    }
  }
}

// ── B. Skills: frontmatter, body shape, multi-target parity ──
const skillsDir = join(root, 'plugins/docflow/skills');
const skillDirs = readdirSync(skillsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

// Agent-specific invocation syntax that must not appear in skill BODIES
// (descriptions may carry trigger hints; bodies must stay agent-neutral).
const SKILL_NAMES = skillDirs.join('|');
const invocationRe = new RegExp(`(^|\\s)/(?:skill:)?(?:${SKILL_NAMES})\\b`);

for (const name of skillDirs) {
  const rel = `plugins/docflow/skills/${name}/SKILL.md`;
  if (!existsSync(join(root, rel))) {
    fail(`${rel}: missing SKILL.md`);
    continue;
  }
  const { fields, body } = frontmatter(read(rel));
  if (!fields) {
    fail(`${rel}: missing YAML frontmatter`);
    continue;
  }
  if (!fields.name) fail(`${rel}: frontmatter missing 'name'`);
  else if (fields.name !== name) {
    fail(`${rel}: frontmatter name "${fields.name}" != directory "${name}"`);
  }
  if (!fields.description) fail(`${rel}: frontmatter missing 'description'`);
  if (!/^#\s+\S/m.test(body)) fail(`${rel}: body has no H1 heading`);

  body.split('\n').forEach((line, i) => {
    if (invocationRe.test(line)) {
      fail(
        `${rel}:${i + 2}: agent-specific invocation "${line.trim()}" in ` +
        `body — keep skill prose agent-neutral (ADR 0008)`,
      );
    }
  });
}

// ── C. ADR catalogue: numbering, status, structure, INDEX fidelity ──
const VALID_STATUS = new Set([
  'Proposed', 'Accepted', 'Implemented', 'Superseded', 'Deprecated',
  'Withdrawn', // terminal, reachable only from Proposed (ADR 0037)
]);
// Expected H2 sequence for the single ADR shape this repo uses
// (CONVENTIONS.md §ADR Shapes).
const SECTION_ORDER = [
  'Context', 'Capability statement', 'User stories / scenarios',
  'Acceptance criteria', 'Out of scope', 'Open questions', 'References',
  'Revision History', 'Approvals',
];
const adrDir = join(root, 'adr');
const catalogue = [];
if (existsSync(adrDir)) {
  const adrFiles = readdirSync(adrDir)
    .filter((f) => /^\d{4}-.+\.md$/.test(f) && f !== '0000-template.md');
  for (const f of adrFiles) {
    const { fields, body } = frontmatter(read(`adr/${f}`));
    const fileNum = f.slice(0, 4);
    if (!fields) {
      fail(`adr/${f}: missing frontmatter`);
      continue;
    }
    if (String(fields.adr).padStart(4, '0') !== fileNum) {
      fail(`adr/${f}: frontmatter adr "${fields.adr}" != filename ${fileNum}`);
    }
    if (!VALID_STATUS.has(fields.status)) {
      fail(`adr/${f}: invalid status "${fields.status}"`);
    }
    // Section order matches the documented shape exactly.
    const heads = [...body.matchAll(/^##\s+(.+?)\s*$/gm)].map((m) => m[1]);
    if (heads.join(' | ') !== SECTION_ORDER.join(' | ')) {
      fail(
        `adr/${f}: section order [${heads.join(', ')}] != ` +
        `[${SECTION_ORDER.join(', ')}] (CONVENTIONS.md §ADR Shapes)`,
      );
    }
    // Acceptance criteria carry a numbered list.
    const acBlock = body.split(/^## Acceptance criteria\s*$/m)[1]?.split(/^## /m)[0] ?? '';
    if (!/^\d+\.\s+\S/m.test(acBlock)) {
      fail(`adr/${f}: Acceptance criteria section has no numbered list`);
    }
    const deps = (fields['depends-on'] ?? '').match(/\d{4}/g) ?? [];
    catalogue.push({
      num: Number(fileNum), file: f, slug: f.replace(/\.md$/, ''), fields, deps,
    });
  }
  catalogue.sort((a, b) => a.num - b.num);
  catalogue.forEach((adr, i) => {
    if (adr.num !== i + 1) {
      fail(`ADR numbering not contiguous: expected ${String(i + 1).padStart(4, '0')}, got ${adr.file}`);
    }
  });
  // depends-on entries resolve to existing catalogue ADRs.
  const nums = new Set(catalogue.map((a) => String(a.num).padStart(4, '0')));
  for (const adr of catalogue) {
    for (const d of adr.deps) {
      if (!nums.has(d)) {
        fail(`adr/${adr.file}: depends-on "${d}" names a non-existent ADR`);
      }
    }
  }
  // INDEX fidelity — every catalogue ADR has a row whose status, date,
  // and depends-on agree with the ADR's frontmatter.
  if (existsSync(join(root, 'INDEX.md'))) {
    const indexLines = read('INDEX.md').split('\n');
    for (const adr of catalogue) {
      const row = indexLines.find((l) => l.includes(`(adr/${adr.file})`));
      if (!row) {
        fail(`INDEX.md: missing row for adr/${adr.file} (regenerate INDEX)`);
        continue;
      }
      // | [NNNN](adr/…) | Title | Status | Date | Depends on |
      const cols = row.split('|').map((c) => c.trim());
      const [status, date, depCol] = [cols[3], cols[4], cols[5]];
      if (status !== adr.fields.status) {
        fail(`INDEX.md: adr/${adr.file} row status "${status}" != frontmatter "${adr.fields.status}" (regenerate INDEX)`);
      }
      if (date !== adr.fields.date) {
        fail(`INDEX.md: adr/${adr.file} row date "${date}" != frontmatter "${adr.fields.date}" (regenerate INDEX)`);
      }
      const rowDeps = ((depCol ?? '').match(/\d{4}/g) ?? []).join(', ');
      if (rowDeps !== adr.deps.join(', ')) {
        fail(`INDEX.md: adr/${adr.file} row depends-on "${rowDeps || '—'}" != frontmatter "${adr.deps.join(', ') || '—'}" (regenerate INDEX)`);
      }
    }
  } else {
    fail('INDEX.md: missing');
  }
}

// ── D. ADR-privacy: no real catalogue ADR referenced in user-visible
// surfaces. Matches full slugs (adr/NNNN-slug) to avoid false positives
// on the 0000 template and placeholder examples like adr/0042-foo.md. ──
const realSlugs = catalogue.map((a) => a.slug); // e.g. 0001-adr-driven-workflow
function scanLeaks(rel) {
  if (!existsSync(join(root, rel))) return;
  const text = read(rel);
  for (const slug of realSlugs) {
    if (text.includes(slug)) {
      fail(
        `${rel}: references real catalogue ADR "${slug}" in a user-visible ` +
        `surface — ADRs are internal (ADR 0004)`,
      );
    }
  }
}

const textSurfaceExts = new Set(['.css', '.html', '.md', '.mdx', '.svg', '.yml', '.yaml']);
function scanLeakTree(rel) {
  if (!existsSync(join(root, rel))) return;
  for (const entry of readdirSync(join(root, rel), { withFileTypes: true })) {
    const child = `${rel}/${entry.name}`;
    if (entry.isDirectory()) {
      scanLeakTree(child);
    } else if (textSurfaceExts.has(entry.name.slice(entry.name.lastIndexOf('.')).toLowerCase())) {
      scanLeaks(child);
    }
  }
}

for (const name of skillDirs) {
  scanLeaks(`plugins/docflow/skills/${name}/SKILL.md`);
}
for (const f of ['README.md', 'USAGE.md']) scanLeaks(f);
// The docs site is public/user-visible too; scan text-like site files
// while skipping binary assets such as PNG/ICO previews.
scanLeakTree('docs');
// Bootstrap templates are user-visible (they ship into target repos).
const tplDir = join(root, 'plugins/docflow/skills/bootstrap/templates');
if (existsSync(tplDir)) {
  for (const f of readdirSync(tplDir)) scanLeaks(`plugins/docflow/skills/bootstrap/templates/${f}`);
}

// ── E. Plan queue discipline: shipped items name the shipping SHA ──
// Tolerant of formatting variants (e.g. a bolded "**Shipped**"); strict
// on substance: the word Shipped, HEAD, and a backticked commit SHA.
let doneCount = 0;
const doneDir = join(root, 'plan/done');
if (existsSync(doneDir)) {
  for (const f of readdirSync(doneDir).filter((n) => n.endsWith('.md'))) {
    doneCount++;
    const text = read(`plan/done/${f}`).replace(/\*/g, '');
    if (!/Shipped[^\n]*HEAD[^\n]*`[0-9a-f]{7,40}`/.test(text)) {
      fail(`plan/done/${f}: footer does not name the shipping HEAD SHA`);
    }
  }
}

// ── C2. Capability specs (spec/, ADR 0038) ──
// Living slug-identified records. When spec/ exists: id equals the
// filename slug, status in the spec lifecycle, retired-from set iff
// Retired, Agreed-or-beyond has ≥1 criterion each with a Verify: line,
// decided-by resolves to catalogue ADRs, constrained-by to CON ids,
// and INDEX's Specs section keeps row fidelity.
const SPEC_STATUS = new Set(['Draft', 'Agreed', 'Implemented', 'Retired']);
const specs = [];
const specDir = join(root, 'spec');
if (existsSync(specDir)) {
  const conIds = new Set(
    existsSync(join(root, 'CONSTRAINTS.md'))
      ? [...read('CONSTRAINTS.md').matchAll(/^## (CON-\d+) r\d+/gm)].map((m) => m[1])
      : [],
  );
  const indexText = existsSync(join(root, 'INDEX.md')) ? read('INDEX.md') : '';
  // 0000-template.md is the scaffolded copy the authoring skill acts
  // on — excluded, mirroring the ADR template exclusion.
  for (const f of readdirSync(specDir).filter((n) => n.endsWith('.md') && n !== '0000-template.md')) {
    const slug = f.replace(/\.md$/, '');
    const { fields, body } = frontmatter(read(`spec/${f}`));
    if (!fields) { fail(`spec/${f}: missing frontmatter`); continue; }
    if (fields.id !== slug) {
      fail(`spec/${f}: id "${fields.id}" != filename slug "${slug}" (slugs are the identity)`);
    }
    if (!SPEC_STATUS.has(fields.status)) {
      fail(`spec/${f}: invalid status "${fields.status}" (Draft | Agreed | Implemented | Retired)`);
    }
    if (fields.status === 'Retired' && !fields['retired-from']) {
      fail(`spec/${f}: Retired without retired-from (never-delivered vs removed must stay distinguishable)`);
    }
    if (fields.status !== 'Retired' && fields['retired-from']) {
      fail(`spec/${f}: retired-from set but status is "${fields.status}"`);
    }
    if (['Agreed', 'Implemented'].includes(fields.status)) {
      const block = body.split(/^## Acceptance criteria\s*$/m)[1]?.split(/^## /m)[0] ?? '';
      const items = [...block.matchAll(/^(\d+)\.\s([\s\S]*?)(?=^\d+\.\s|$(?![\s\S]))/gm)];
      if (!items.length) {
        fail(`spec/${f}: ${fields.status} with no acceptance criteria (Agreed requires ≥1)`);
      }
      for (const it of items) {
        if (!/Verify:\s*\S/.test(it[2])) {
          fail(`spec/${f}: AC${it[1]} has no Verify: method (required at Agreed and beyond)`);
        }
      }
    }
    for (const d of (fields['decided-by'] ?? '').match(/\d{4}/g) ?? []) {
      if (!catalogue.some((a) => String(a.num).padStart(4, '0') === d)) {
        fail(`spec/${f}: decided-by "${d}" names a non-existent ADR`);
      }
    }
    for (const c of (fields['constrained-by'] ?? '').match(/CON-\d+/g) ?? []) {
      if (!conIds.has(c)) fail(`spec/${f}: constrained-by "${c}" names no constraint entry`);
    }
    const row = indexText.split('\n').find((l) => l.includes(`(spec/${f})`));
    if (!row) {
      fail(`INDEX.md: missing Specs row for spec/${f} (regenerate INDEX)`);
    } else if (!row.split('|').map((c) => c.trim()).includes(fields.status)) {
      fail(`INDEX.md: spec/${f} row does not carry status "${fields.status}" (regenerate INDEX)`);
    }
    specs.push({ slug, fields, body });
  }
}

// ── F. Capability manifest (docflow.yml, ADR 0034) ──
// Machine-readable repo shape (CONVENTIONS.md §Project / §Trust
// Posture). An absent file means a pre-contract repo — no failure; a
// present file must be well-formed, carry a schema this gate
// understands, and use only legal model/layer values. `autonomy` is
// reserved and must not be set.
const MANIFEST_SCHEMA = 1;
const MANIFEST_MODELS = new Set(['capability-first', 'two-shape', 'decisions+specs', 'decisions-only']);
const MANIFEST_LAYERS = new Set(['plan', 'agent', 'glossary', 'constraints', 'domains', 'federation']);
if (existsSync(join(root, 'docflow.yml'))) {
  const manifest = {};
  for (const line of read('docflow.yml').split('\n')) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*?)\s*(?:#.*)?$/);
    if (kv) manifest[kv[1]] = kv[2].trim();
  }
  if (!('schema' in manifest)) {
    fail('docflow.yml: missing "schema"');
  } else if (Number(manifest.schema) !== MANIFEST_SCHEMA) {
    fail(
      `docflow.yml: schema "${manifest.schema}" is not one this gate ` +
      `understands (${MANIFEST_SCHEMA}) — refusing (newer schema means a newer gate)`,
    );
  }
  if (!('model' in manifest)) {
    fail('docflow.yml: missing "model"');
  } else if (!MANIFEST_MODELS.has(manifest.model)) {
    fail(`docflow.yml: illegal model "${manifest.model}" (legal: ${[...MANIFEST_MODELS].join(', ')})`);
  }
  if (!('layers' in manifest)) {
    fail('docflow.yml: missing "layers"');
  } else {
    for (const layer of manifest.layers.match(/[a-z]+/g) ?? []) {
      if (!MANIFEST_LAYERS.has(layer)) {
        fail(`docflow.yml: illegal layer "${layer}" (legal: ${[...MANIFEST_LAYERS].join(', ')})`);
      }
    }
  }
  if ('autonomy' in manifest) {
    fail('docflow.yml: "autonomy" is reserved by the contract — do not set it');
  }
  if ('evidence-adopted-at' in manifest &&
      !/^[0-9a-f]{7,40}$/.test(manifest['evidence-adopted-at'])) {
    fail(`docflow.yml: evidence-adopted-at "${manifest['evidence-adopted-at']}" is not a commit SHA`);
  }
}

// ── G. Bound evidence records (ADR 0035) ──
// Evidence records are append-only proofs per acceptance criterion
// (CONVENTIONS.md §Verification Evidence). This check validates every
// record's shape and — for any catalogue ADR that carries an evidence
// directory and declares Implemented — recomputes each criterion's
// digest and requires matching valid evidence: the declared status
// must be backed by the computed state.
const normaliseCriterion = (text) => text.replace(/\s+/g, ' ').trim();
const digest = (text) => createHash('sha256').update(text, 'utf8').digest('hex');
// Parse the numbered items of an ADR's Acceptance-criteria section into
// normalised texts, index 0 = AC1. Items span lines up to the next item.
function criteriaOf(body) {
  const block = body.split(/^## Acceptance criteria\s*$/m)[1]?.split(/^## /m)[0] ?? '';
  const items = [];
  for (const m of block.matchAll(/^(\d+)\.\s([\s\S]*?)(?=^\d+\.\s|$(?![\s\S]))/gm)) {
    items[Number(m[1]) - 1] = normaliseCriterion(m[2]);
  }
  return items;
}
const EVIDENCE_FIELDS = ['ac', 'ac-digest', 'method', 'source-sha', 'exit-code', 'verifier', 'date'];
const evidenceDir = join(root, 'evidence');
if (existsSync(evidenceDir)) {
  for (const entry of readdirSync(evidenceDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    const adr = catalogue.find((a) => a.slug === slug);
    const spec = specs.find((s) => s.slug === slug);
    if (!adr && !spec) {
      fail(`evidence/${slug}/: no catalogue ADR or spec with that slug`);
      continue;
    }
    // Validate each record's shape and collect the latest record per AC
    // (a record superseded by a later one is not "current").
    const records = {}; // ACn → { fields, file, seq }
    for (const f of readdirSync(join(evidenceDir, slug)).filter((n) => n.endsWith('.md'))) {
      const m = f.match(/^AC(\d+)-(\d{3})\.md$/);
      if (!m) {
        fail(`evidence/${slug}/${f}: filename is not AC<n>-<seq>.md`);
        continue;
      }
      const { fields } = frontmatter(read(`evidence/${slug}/${f}`));
      if (!fields) {
        fail(`evidence/${slug}/${f}: missing frontmatter`);
        continue;
      }
      for (const k of EVIDENCE_FIELDS) {
        if (!fields[k]) fail(`evidence/${slug}/${f}: missing "${k}"`);
      }
      if (fields.verifier?.startsWith('human:') && !/human:\s*\S/.test(fields.verifier)) {
        fail(`evidence/${slug}/${f}: manual evidence names no verifier`);
      }
      const acN = Number(m[1]);
      const seq = Number(m[2]);
      if (!records[acN] || seq > records[acN].seq) records[acN] = { fields, file: f, seq };
    }
    // Declared-vs-computed: an Implemented record (ADR or spec) with an
    // evidence dir must have, for EVERY current criterion, a current
    // record whose digest matches and whose result is valid (exit 0,
    // or attested manual).
    const owner = adr
      ? { label: `adr/${adr.file}`, status: adr.fields.status, body: frontmatter(read(`adr/${adr.file}`)).body }
      : { label: `spec/${spec.slug}.md`, status: spec.fields.status, body: spec.body };
    if (owner.status === 'Implemented') {
      const criteria = criteriaOf(owner.body);
      criteria.forEach((text, i) => {
        const acN = i + 1;
        const rec = records[acN];
        if (!rec) {
          fail(`${owner.label}: declares Implemented but AC${acN} has no evidence record`);
          return;
        }
        if (rec.fields['ac-digest'] !== digest(text)) {
          fail(
            `${owner.label}: AC${acN} was edited — evidence ` +
            `${rec.file} digest no longer matches (stale projection; re-verify)`,
          );
        }
        const manual = rec.fields.verifier?.startsWith('human:');
        if (!manual && rec.fields['exit-code'] !== '0') {
          fail(`evidence/${slug}/${rec.file}: exit-code ${rec.fields['exit-code']} does not evidence a pass`);
        }
      });
    }
  }
}

// ── E2. Dropped queue items (ADR 0037) ──
// Abandonment is recorded, never deleted: plan/dropped/ files keep the
// item's number (<date>-NNNN-<slug>.md) and carry a Dropped footer
// naming the reason.
const droppedDir = join(root, 'plan/dropped');
if (existsSync(droppedDir)) {
  for (const f of readdirSync(droppedDir).filter((n) => n.endsWith('.md'))) {
    if (!/^\d{4}-\d{2}-\d{2}-\d{4}-.+\.md$/.test(f)) {
      fail(`plan/dropped/${f}: name is not <YYYY-MM-DD>-NNNN-<slug>.md (the number must be kept)`);
    }
    const text = read(`plan/dropped/${f}`).replace(/\*/g, '');
    if (!/Dropped[^\n]{8,}/.test(text)) {
      fail(`plan/dropped/${f}: no Dropped footer naming the reason`);
    }
  }
}

// ── H. Constraints file (ADR 0036) ──
// CONSTRAINTS.md, when present, enumerates decision-gated boundaries
// (CONVENTIONS.md §Constraints): parseable CON-<n> r<n> entries with
// unique ids, positive revisions, legal source/state values, and an
// authorised-by decision record that exists at Accepted or beyond.
const CON_SOURCES = new Set(['chosen', 'imposed', 'learned']);
const CON_STATES = new Set(['Active', 'Removed']);
if (existsSync(join(root, 'CONSTRAINTS.md'))) {
  const conIds = new Set();
  const blocks = read('CONSTRAINTS.md').split(/^## /m).slice(1);
  if (!blocks.length) fail('CONSTRAINTS.md: present but has no CON entries');
  for (const block of blocks) {
    const head = block.split('\n', 1)[0];
    const hm = head.match(/^(CON-\d+) r(\d+) — (.+)$/);
    if (!hm) {
      fail(`CONSTRAINTS.md: entry header "${head}" is not "CON-<n> r<n> — <title>"`);
      continue;
    }
    const [, id, rev] = hm;
    if (conIds.has(id)) fail(`CONSTRAINTS.md: duplicate id ${id}`);
    conIds.add(id);
    if (Number(rev) < 1) fail(`CONSTRAINTS.md: ${id} revision r${rev} is not positive`);
    const field = (name) =>
      block.match(new RegExp(`^- ${name}:\\s*(.+)$`, 'm'))?.[1].trim();
    const source = field('source');
    if (!CON_SOURCES.has(source)) {
      fail(`CONSTRAINTS.md: ${id} source "${source}" not in {${[...CON_SOURCES].join(', ')}}`);
    }
    const state = field('state');
    if (!CON_STATES.has(state)) {
      fail(`CONSTRAINTS.md: ${id} state "${state}" not in {${[...CON_STATES].join(', ')}}`);
    }
    if (!field('statement')) fail(`CONSTRAINTS.md: ${id} missing statement`);
    if (!field('check')) fail(`CONSTRAINTS.md: ${id} missing check`);
    const auth = field('authorised-by');
    const am = auth?.match(/^adr\/(\d{4}-[a-z0-9-]+)\.md$/);
    if (!am) {
      fail(`CONSTRAINTS.md: ${id} authorised-by "${auth}" is not an adr/NNNN-<slug>.md path`);
    } else {
      const target = catalogue.find((a) => a.slug === am[1]);
      if (!target) {
        fail(`CONSTRAINTS.md: ${id} authorised-by names non-existent ${auth}`);
      } else if (!['Accepted', 'Implemented'].includes(target.fields.status)) {
        fail(
          `CONSTRAINTS.md: ${id} authorised-by ${auth} is "${target.fields.status}" ` +
          '— a constraint needs an Accepted-or-beyond decision',
        );
      }
    }
  }
}

// ── Report ──
if (errors.length) {
  console.error('verify: FAIL');
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(
  `verify: OK (version ${pkg.version}, ${skillDirs.length} skills, ` +
  `${catalogue.length} ADRs, ${doneCount} shipped plan items)`,
);
