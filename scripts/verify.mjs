#!/usr/bin/env node
// Verify gate for docflow (see AGENTS.md §Git contract, CONVENTIONS.md
// §Version-Sync Invariant). Validates that the two manifests parse and
// that their versions agree. Exit 0 = shippable, exit 1 = blocked.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];

function readJSON(rel) {
  const path = join(root, rel);
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (e) {
    errors.push(`${rel}: failed to parse — ${e.message}`);
    return null;
  }
}

const pkg = readJSON('package.json');
const plugin = readJSON('.claude-plugin/plugin.json');
const marketplace = readJSON('.claude-plugin/marketplace.json');

if (pkg && plugin) {
  if (pkg.version !== plugin.version) {
    errors.push(
      `version mismatch: package.json=${pkg.version} ` +
      `.claude-plugin/plugin.json=${plugin.version} — bump them together`,
    );
  }
}

// Marketplace listing must reference the plugin by its real name.
if (plugin && marketplace) {
  const names = (marketplace.plugins ?? []).map((p) => p.name);
  if (!names.includes(plugin.name)) {
    errors.push(
      `marketplace.json lists ${JSON.stringify(names)} but plugin.json ` +
      `name is "${plugin.name}"`,
    );
  }
}

if (errors.length) {
  console.error('verify: FAIL');
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}

console.log(`verify: OK (version ${pkg.version})`);
