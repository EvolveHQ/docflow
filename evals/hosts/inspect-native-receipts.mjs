// Read-only diagnostic: judge original returns with the installed schema API.
// This does not certify source references, authority, chronology or execution.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const [assets, ...paths] = process.argv.slice(2);
if (!assets || !paths.length) throw Error('Usage: node inspect-native-receipts.mjs <asset-root> <receipt.json>...');
const { checkShape } = await import(pathToFileURL(resolve(assets, 'validate.mjs')));
const results = paths.map(path => {
  const original = JSON.parse(readFileSync(path, 'utf8').replace(/^\uFEFF/, ''));
  const receipt = original.receipt ?? original;
  const errors = checkShape(receipt, 'receipt');
  const nativePaths = [];
  function visit(value, label) {
    if (!value || typeof value !== 'object') return;
    if (value.repository && value.path && value.revision) nativePaths.push({
      field: label, path: value.path,
      syntacticallyContainedFilePath: typeof value.path === 'string' &&
        !/^[\\/]|[\\:\u0000]/.test(value.path) &&
        value.path.split('/').every(part => part && part !== '.' && part !== '..'),
    });
    for (const [key, child] of Object.entries(value)) visit(child, `${label}.${key}`);
  }
  visit(receipt, 'receipt');
  return { path, selectedValue: original.receipt ? 'original.receipt' : 'original',
    shapeValid: !errors.length, errors, nativePaths,
    limit: 'Path syntax listing only; use canonical-context validation for resolution. Neither shape nor path checks attest model timestamps.' };
});
console.log(JSON.stringify({ observed_at: new Date().toISOString(), assets,
  method: 'Actual exported checkShape(receipt, receipt) from frozen installed validator; original returns unchanged', results }, null, 2));
process.exitCode = results.every(result => result.shapeValid && result.nativePaths.every(path => path.syntacticallyContainedFilePath)) ? 0 : 1;
