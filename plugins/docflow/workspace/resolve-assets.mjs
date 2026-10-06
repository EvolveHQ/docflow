import { realpathSync, readFileSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve the real skill directory first: symlink discovery and plugin installs
// retain their sibling assets. Detached skill copies need the documented copy.
export function resolveAssets(bootstrapDirectory, explicitRoot) {
  const skill = realpathSync(bootstrapDirectory);
  const manifest = JSON.parse(readFileSync(resolve(skill, 'templates/workspace-assets.json'), 'utf8'));
  if (manifest.schema !== 1) throw Error('unsupported workspace asset locator');
  const candidates = explicitRoot ? [resolve(explicitRoot)] : manifest.candidates.map(p => resolve(skill, p));
  for (const candidate of candidates) {
    try {
      const root = realpathSync(candidate);
      if (manifest.required.every(p => statSync(resolve(root, p)).isFile())) return root;
    } catch { /* Try the next documented installation location. */ }
  }
  throw Error('workspace assets unavailable: copy the complete packaged workspace directory beside skills as docflow-workspace, or supply its explicit root');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(resolveAssets(process.argv[2], process.argv[3])); }
  catch (e) { console.error(e.message); process.exitCode = 1; }
}
