#!/usr/bin/env node
// Static verify gate for docflow (ADR 0011). Deterministic, no network,
// no model call. Validates: manifests + version sync (ADR 0008), skill
// structure + dual-target parity (ADR 0007/0008), ADR catalogue
// integrity + INDEX sync (ADR 0001), and ADR-privacy leakage into
// user-visible surfaces (ADR 0004). Exit 0 = shippable, 1 = blocked.

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
const plugin = readJSON('.claude-plugin/plugin.json');
const marketplace = readJSON('.claude-plugin/marketplace.json');
const codexPlugin = readJSON('.codex-plugin/plugin.json');
const codexMarket = readJSON('.agents/plugins/marketplace.json');

const versioned = [
  ['package.json', pkg],
  ['.claude-plugin/plugin.json', plugin],
  ['.codex-plugin/plugin.json', codexPlugin],
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

// ── B. Skills: frontmatter, body shape, dual-target parity ──
const skillsDir = join(root, 'skills');
const skillDirs = readdirSync(skillsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

// Agent-specific invocation syntax that must not appear in skill BODIES
// (descriptions may carry trigger hints; bodies must stay agent-neutral).
const SKILL_NAMES = skillDirs.join('|');
const invocationRe = new RegExp(`(^|\\s)/(?:skill:)?(?:${SKILL_NAMES})\\b`);

for (const name of skillDirs) {
  const rel = `skills/${name}/SKILL.md`;
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

// ── C. ADR catalogue: numbering, status, INDEX sync ──
const VALID_STATUS = new Set([
  'Proposed', 'Accepted', 'Implemented', 'Superseded', 'Deprecated',
]);
const adrDir = join(root, 'adr');
const catalogue = [];
if (existsSync(adrDir)) {
  const adrFiles = readdirSync(adrDir)
    .filter((f) => /^\d{4}-.+\.md$/.test(f) && f !== '0000-template.md');
  for (const f of adrFiles) {
    const { fields } = frontmatter(read(`adr/${f}`));
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
    catalogue.push({ num: Number(fileNum), file: f, slug: f.replace(/\.md$/, '') });
  }
  catalogue.sort((a, b) => a.num - b.num);
  catalogue.forEach((adr, i) => {
    if (adr.num !== i + 1) {
      fail(`ADR numbering not contiguous: expected ${String(i + 1).padStart(4, '0')}, got ${adr.file}`);
    }
  });
  // INDEX sync — every catalogue ADR appears in INDEX.md.
  if (existsSync(join(root, 'INDEX.md'))) {
    const index = read('INDEX.md');
    for (const adr of catalogue) {
      if (!index.includes(adr.file)) {
        fail(`INDEX.md: missing row for adr/${adr.file} (regenerate INDEX)`);
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
for (const name of skillDirs) {
  scanLeaks(`skills/${name}/SKILL.md`);
}
for (const f of ['README.md', 'USAGE.md']) scanLeaks(f);
// Bootstrap templates are user-visible (they ship into target repos).
const tplDir = join(root, 'skills/bootstrap/templates');
if (existsSync(tplDir)) {
  for (const f of readdirSync(tplDir)) scanLeaks(`skills/bootstrap/templates/${f}`);
}

// ── Report ──
if (errors.length) {
  console.error('verify: FAIL');
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(
  `verify: OK (version ${pkg.version}, ${skillDirs.length} skills, ` +
  `${catalogue.length} ADRs)`,
);
