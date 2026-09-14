// Exercise incidental Markdown tolerance without accepting the wrong profile.
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { cases } from '../cases.mjs';

const source = resolve(process.argv[2]);
const sourceFile = join(source, '.docflow/CONVENTIONS.md');
const original = readFileSync(sourceFile, 'utf8');
const check = cases.find(c => c.name === 'bootstrap: express depth scaffolds the fixed minimal profile').assert;
const temporary = mkdtempSync(join(tmpdir(), 'docflow-express-assertions-'));
const results = [];
try {
  for (const [name, value, passes] of [['plain', 'express', true], ['code', '`express`', true], ['bold', '**express**', true], ['guided', '`guided`', false], ['full', 'full', false]]) {
    const repo = join(temporary, name);
    cpSync(source, repo, { recursive: true, filter: path => !path.split(/[\\/]/).includes('.git') });
    const changed = original.replace(/^Assessment depth:.*$/m, `Assessment depth: ${value}`);
    assert.notEqual(changed, '', 'missing source conventions');
    assert.match(changed, /^Assessment depth:/m);
    writeFileSync(join(repo, '.docflow/CONVENTIONS.md'), changed);
    if (passes) check(repo); else assert.throws(() => check(repo), /express assessment depth/);
    results.push({ case: name, expected_pass: passes, passed: true });
  }
  assert.equal(readFileSync(sourceFile, 'utf8'), original, 'source target changed');
  console.log(JSON.stringify({ passed: true, cases: results }));
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
