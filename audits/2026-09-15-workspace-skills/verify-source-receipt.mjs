// Read-only reproduction of this receipt's hashes from raw Git object Buffers.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import assert from 'node:assert/strict';

const here = dirname(fileURLToPath(import.meta.url));
const repository = resolve(here, '../..');
const receipt = JSON.parse(readFileSync(resolve(here, 'source-receipt.json')));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const specs = new Set(Object.keys(receipt.files).map(path => receipt.source_revision + ':' + path));
for (const name of Object.keys(receipt.original_trigger_hashes)) {
  for (const revision of [receipt.baseline, receipt.source_revision]) {
    specs.add(revision + ':plugins/docflow/skills/' + name + '/SKILL.md');
  }
}
const ordered = [...specs];
// No shell, text decoding, archive filters or checkout conversion on blob bytes.
const output = execFileSync('git', ['cat-file', '--batch'], {
  cwd: repository, input: Buffer.from(ordered.join('\n') + '\n'), maxBuffer: 32 * 1024 * 1024,
});
const blobs = new Map();
let offset = 0;
for (const spec of ordered) {
  const end = output.indexOf(10, offset);
  const header = output.subarray(offset, end).toString('ascii');
  const match = header.match(/^[0-9a-f]+ blob ([0-9]+)$/);
  assert.ok(match, 'Expected available blob: ' + spec + ' / ' + header);
  const size = Number(match[1]);
  offset = end + 1;
  blobs.set(spec, output.subarray(offset, offset + size));
  offset += size;
  assert.equal(output[offset++], 10, 'Git batch separator');
}
assert.equal(offset, output.length, 'All binary output consumed');
const blob = (revision, path) => blobs.get(revision + ':' + path);
for (const [path, expected] of Object.entries(receipt.files)) {
  assert.equal(hash(blob(receipt.source_revision, path)), expected, path);
}
// The original receipt hashes the exact UTF-8 text between YAML --- delimiters.
for (const [name, expected] of Object.entries(receipt.original_trigger_hashes)) {
  const path = 'plugins/docflow/skills/' + name + '/SKILL.md';
  const before = blob(receipt.baseline, path).toString('utf8').split('---')[1];
  const after = blob(receipt.source_revision, path).toString('utf8').split('---')[1];
  assert.equal(before, after, name + ' trigger unchanged');
  assert.equal(hash(before), expected.before, name + ' before trigger hash');
  assert.equal(hash(after), expected.after, name + ' after trigger hash');
}
for (const [name, expected] of Object.entries(receipt.changed_existing_skill_probes)) {
  const path = 'plugins/docflow/skills/' + name + '/SKILL.md';
  assert.equal(hash(blob(receipt.baseline, path)), expected.before_sha256, name + ' before');
  assert.equal(hash(blob(receipt.source_revision, path)), expected.after_sha256, name + ' after');
}
const fixtureRoot = 'plugins/docflow/workspace/repository-fixtures/';
const manifest = JSON.parse(blob(receipt.source_revision, fixtureRoot + 'manifest.json'));
for (const [path, expected] of Object.entries(manifest.files)) {
  assert.equal(hash(blob(receipt.source_revision, fixtureRoot + path)), expected.sha256, path);
}
for (const [path, expected] of Object.entries(manifest.sources)) {
  assert.equal(hash(blob(receipt.source_revision, fixtureRoot + 'sources/' + path)), expected.sha256, path);
}
console.log(JSON.stringify({
  source_revision: receipt.source_revision,
  raw_blob_hashes: Object.keys(receipt.files).length,
  unchanged_original_triggers: Object.keys(receipt.original_trigger_hashes).length,
  before_after_skill_hash_pairs: Object.keys(receipt.changed_existing_skill_probes).length,
  corpus_file_hashes: Object.keys(manifest.files).length,
  corpus_source_hashes: Object.keys(manifest.sources).length,
  validator_sha256: receipt.files['plugins/docflow/workspace/validate.mjs'],
  manifest_sha256: receipt.files[fixtureRoot + 'manifest.json'],
  outcome: 'passed',
}, null, 2));
