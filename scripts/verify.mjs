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

// ── F. Capability manifest (docflow.yml, ADR 0034) ──
// Machine-readable repo shape (CONVENTIONS.md §Project / §Trust
// Posture). An absent file means a pre-contract repo — no failure; a
// present file must be well-formed, carry a schema this gate
// understands, and use only legal model/layer values. `autonomy` is
// reserved and must not be set.
const MANIFEST_SCHEMA = 1;
const MANIFEST_MODELS = new Set(['capability-first', 'two-shape']);
const MANIFEST_LAYERS = new Set(['plan', 'agent', 'glossary', 'domains', 'federation']);
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
