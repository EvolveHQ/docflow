import { cpSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseRecord, parseMetadata } from '../validate.mjs';

const here = dirname(fileURLToPath(import.meta.url));
export const adverse = JSON.parse(readFileSync(resolve(here, 'adverse.json'), 'utf8')).cases;
export function materialise(id, destination) {
  const scenario = adverse.find(c => c.id === id);
  if (!scenario) throw Error('unknown fixture case');
  const root = resolve(destination);
  if (existsSync(root)) throw Error('destination must not already exist');
  cpSync(resolve(here, 'two-repository'), root, { recursive: true, errorOnExist: true });
  for (const operation of scenario.operations) {
    const path = resolve(root, operation.file), rel = relative(root, path);
    if (isAbsolute(rel) || rel.startsWith('..')) throw Error('fixture operation escapes destination');
    const markdown = operation.file.endsWith('.md');
    const text = readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
    const value = markdown ? parseRecord(text) : parseMetadata(text);
    const parts = operation.pointer.slice(1).split('/');
    if (parts.some(x => ['__proto__', 'prototype', 'constructor'].includes(x))) throw Error('unsafe fixture pointer');
    let parent = value;
    for (const part of parts.slice(0, -1)) parent = parent[part];
    parent[parts.at(-1)] = operation.value;
    const json = JSON.stringify(value, null, 2);
    writeFileSync(path, markdown ? `---\n${json}\n---\n${text.split(/^---\n/m).slice(2).join('---\n')}` : `${json}\n`);
  }
  return scenario;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { const c = materialise(process.argv[2], process.argv[3]); console.log(JSON.stringify({ case: c.id, expected_codes: c.expected_codes })); }
  catch (e) { console.error(e.message); process.exitCode = 1; }
}
