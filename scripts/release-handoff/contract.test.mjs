// Portable consumer controls: vendor with contract.mjs and public-fixtures.mjs.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { assertIdenticalPublic, checksumBytes, checksumName, jsonBytes, manifestName, sha256, validateDependencies, validatePublic } from './contract.mjs';
import { publicFixture } from './public-fixtures.mjs';

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'public-release-')); t.after(() => rmSync(root, { recursive: true, force: true }));
  const dir = join(root, 'public'); const doc = publicFixture(dir); return { dir, doc };
}
test('consumer accepts a complete independently versioned Clarity set', (t) => {
  const { dir, doc } = fixture(t); assert.deepEqual(validatePublic(dir, doc.version), doc);
});
for (const [name, mutate] of Object.entries({
  product: (d) => { d.product = 'docflow'; },
  namespace: (d) => { d.tag = `v${d.version}`; },
  suffix: (d) => { d.tag = 'clarity-v1.0.0'; },
  source: (d) => { d.source = 'private'; },
  profile: (d) => { d.assets[0].buildConfiguration = 'unknown'; },
  architecture: (d) => { d.assets[0].arch = 'universal'; },
  duplicate: (d) => { d.assets.push(d.assets[0]); },
  path: (d) => { d.assets[0].name = '../secret'; },
})) test(`consumer rejects ${name}`, (t) => {
  const { dir, doc } = fixture(t); mutate(doc); const bytes = jsonBytes(doc);
  writeFileSync(join(dir, manifestName(doc.version)), bytes); writeFileSync(join(dir, checksumName(doc.version)), checksumBytes(doc, bytes));
  assert.throws(() => validatePublic(dir, doc.version));
});
test('consumer rejects changed installer bytes', (t) => {
  const { dir, doc } = fixture(t); const file = join(dir, doc.assets[0].name); const bytes = readFileSync(file); bytes[bytes.length - 1] ^= 1; writeFileSync(file, bytes);
  assert.throws(() => validatePublic(dir, doc.version), /hash/);
});
test('consumer rejects extra source archive', (t) => { const { dir, doc } = fixture(t); writeFileSync(join(dir, 'source.zip'), 'not allowed'); assert.throws(() => validatePublic(dir, doc.version), /unexpected/); });

test('consumer rejects discarded private text in duplicate release JSON keys', (t) => {
  const { dir, doc } = fixture(t);
  const bytes = Buffer.from(jsonBytes(doc).toString().replace('"product":', '"product": "private draft fragment",\n  "product":'));
  assert.deepEqual(JSON.parse(bytes), doc);
  writeFileSync(join(dir, manifestName(doc.version)), bytes); writeFileSync(join(dir, checksumName(doc.version)), checksumBytes(doc, bytes));
  assert.throws(() => validatePublic(dir, doc.version), /noncanonical release JSON/);
});
test('dependency JSON rejects discarded duplicate fields', () => {
  const doc = { schemaVersion: 1, packages: [{ ecosystem: 'npm', name: 'example', version: '1.0.0', licenses: ['MIT'] }] };
  const bytes = Buffer.from(jsonBytes(doc).toString().replace('"name":', '"name": "private-draft-package",\n      "name":'));
  assert.deepEqual(JSON.parse(bytes), doc); assert.throws(() => validateDependencies(bytes), /noncanonical dependency JSON/);
});
test('dependency JSON rejects escaped token text', () => {
  const doc = { schemaVersion: 1, packages: [{ ecosystem: 'npm', name: 'ghp_syntheticfixtureonly12345', version: '1.0.0', licenses: ['MIT'] }] };
  const bytes = Buffer.from(jsonBytes(doc).toString().replace('ghp_', '\\u0067hp_'));
  assert.deepEqual(JSON.parse(bytes), doc); assert.throws(() => validateDependencies(bytes), /noncanonical dependency JSON/);
});
test('consumer retry comparison preserves identical bytes and refuses changed valid candidate', (t) => {
  const existing = fixture(t); const candidate = fixture(t); const file = join(existing.dir, existing.doc.assets[0].name); const before = statSync(file).mtimeMs;
  assert.equal(assertIdenticalPublic(existing.dir, candidate.dir, existing.doc.version), true); assert.equal(statSync(file).mtimeMs, before);
  const a = candidate.doc.assets[0]; const changed = readFileSync(join(candidate.dir, a.name)); changed[500] ^= 1; writeFileSync(join(candidate.dir, a.name), changed); a.sha256 = sha256(changed);
  const metadata = jsonBytes(candidate.doc); writeFileSync(join(candidate.dir, manifestName(candidate.doc.version)), metadata); writeFileSync(join(candidate.dir, checksumName(candidate.doc.version)), checksumBytes(candidate.doc, metadata));
  validatePublic(candidate.dir, candidate.doc.version); assert.throws(() => assertIdenticalPublic(existing.dir, candidate.dir, existing.doc.version), /differing retry/);
  assert.equal(statSync(file).mtimeMs, before); validatePublic(existing.dir, existing.doc.version);
});
