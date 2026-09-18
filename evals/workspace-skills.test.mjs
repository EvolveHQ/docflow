import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdtempSync, cpSync, mkdirSync, writeFileSync, rmSync, realpathSync } from 'node:fs';
import { resolve, join, dirname, basename } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { parseRecord, parseMetadata, checkShape, validateWorkspace } from '../plugins/docflow/workspace/validate.mjs';
import { resolveAssets } from '../plugins/docflow/workspace/resolve-assets.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const product = join(root, 'plugins/docflow');
const names = ['add-convention', 'agent-wave', 'audit', 'bootstrap', 'brainstorm',
  'new-adr', 'new-plan', 'rollup', 'ship-item', 'workspace-dispatch',
  'workspace-status', 'workspace-scope', 'workspace-setup', 'workspace-sync'].sort();
const read = p => readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const skill = name => read(join(product, 'skills', name, 'SKILL.md'));
function scratch(fn) {
  const temp = mkdtempSync(join(tmpdir(), 'docflow-skills-test-'));
  try { return fn(temp); } finally {
    const actual = realpathSync(temp);
    assert.equal(dirname(actual).toLowerCase(), realpathSync(tmpdir()).toLowerCase());
    assert.ok(basename(actual).startsWith('docflow-skills-test-'));
    rmSync(actual, { recursive: true, force: true });
  }
}
function assertDiscovery(skills) {
  const found = readdirSync(skills).filter(n => readdirSync(join(skills, n)).includes('SKILL.md')).sort();
  assert.deepEqual(found, names);
  for (const name of found) {
    assert.match(read(join(skills, name, 'SKILL.md')), new RegExp('^---\\nname: ' + name + '\\n'));
    assert.ok(read(join(skills, name, 'agents/openai.yaml')).includes('docflow: ' + name));
  }
}

for (const mode of ['claude-code-plugin', 'cowork-plugin', 'pi-package', 'codex-plugin', 'opencode-copy', 'codex-copy']) {
  test('packaged directory discovery and assets: ' + mode, () => scratch(temp => {
    let skills, assets;
    if (mode.endsWith('-copy')) {
      skills = join(temp, 'host/skills'); assets = join(temp, 'host/docflow-workspace');
      cpSync(join(product, 'skills'), skills, { recursive: true });
      cpSync(join(product, 'workspace'), assets, { recursive: true });
    } else {
      const install = join(temp, mode === 'pi-package' ? 'package/plugins/docflow' : 'plugin');
      cpSync(product, install, { recursive: true });
      skills = join(install, 'skills'); assets = join(install, 'workspace');
      if (mode === 'codex-plugin') {
        const manifest = JSON.parse(read(join(install, '.codex-plugin/plugin.json')));
        assert.equal(resolve(install, manifest.skills), skills);
      }
      if (mode === 'pi-package') {
        const pkg = JSON.parse(read(join(root, 'package.json')));
        assert.equal(resolve(temp, 'package', pkg.pi.skills[0]), skills);
        assert.ok(pkg.files.includes('plugins/docflow/workspace/'));
      }
    }
    assertDiscovery(skills);
    assert.equal(resolveAssets(join(skills, 'bootstrap')), realpathSync(assets));
    for (const file of ['CONTRACT.md', 'schema.json', 'validate.mjs', 'guides/README.md',
      'guides/orca.md', 'guides/cursor.md', 'guides/claude-code.md',
      'guides/deepseek-harness.md', 'guides/zcode.md', 'guides/codex-app.md']) {
      assert.ok(read(join(assets, file)).length > 0);
    }
    assert.ok(read(join(skills, 'bootstrap/templates/workspace-work.md')).includes('"state": "planned"'));
  }));
}

test('detached skills alone fail instead of using a source checkout', () => scratch(temp => {
  cpSync(join(product, 'skills'), join(temp, 'skills'), { recursive: true });
  assert.throws(() => resolveAssets(join(temp, 'skills/bootstrap')), /assets unavailable/);
}));

test('starter roles, profiles and source catalogue form a valid empty adopter workspace', () => scratch(temp => {
  const base = join(temp, '.docflow_workspace');
  const templates = join(product, 'skills/bootstrap/templates');
  for (const dir of ['ideas', 'decisions', 'work', 'knowledge', 'runs', 'agents', 'profiles', 'integrations']) {
    mkdirSync(join(base, dir), { recursive: true });
  }
  const registry = parseMetadata(read(join(templates, 'workspace-registry.yaml')));
  registry.repositories = []; registry.resources = []; registry.external_homes = [];
  writeFileSync(join(base, 'workspace.yaml'), JSON.stringify(registry));
  for (const name of ['coordinator', 'executor', 'reviewer', 'domain-specialist']) {
    const content = read(join(templates, 'workspace-role-' + name + '.md'));
    assert.deepEqual(checkShape(parseRecord(content), 'role'), []);
    cpSync(join(templates, 'workspace-role-' + name + '.md'), join(base, 'agents', name + '.md'));
  }
  for (const name of ['coordination', 'documentation', 'react-review', 'svelte-tauri']) {
    const content = read(join(templates, 'workspace-profile-' + name + '.md'));
    assert.deepEqual(checkShape(parseRecord(content), 'profile'), []);
    cpSync(join(templates, 'workspace-profile-' + name + '.md'), join(base, 'profiles', name + '.md'));
  }
  cpSync(join(templates, 'workspace-starter-sources.yaml'), join(base, 'integrations/sources.yaml'));
  const result = validateWorkspace(temp, { at: '2026-09-15T13:00:00Z' });
  assert.equal(result.valid, true, JSON.stringify(result.diagnostics));
  assert.equal(result.records.length, 0);
}));

test('operating contracts cover authority and outcomes without changing schema vocabulary', () => {
  for (const name of names.filter(n => n.startsWith('workspace-'))) {
    const text = skill(name);
    for (const required of ['**Inputs:**', '**Effects:**', '**Native claims / dependencies / resources:**',
      '**Stopping point:**', '**Receipt:**', 'scope revision', 'expiry', 'revocation',
      'alternate tools', 'Contact loss is not worker exit', 'Unknown']) {
      assert.ok(text.includes(required), name + ': missing ' + required);
    }
  }
  assert.match(skill('workspace-status'), /read and report only/);
  assert.match(skill('workspace-dispatch'), /return a separate receipt/);
  assert.match(skill('workspace-sync'), /still-current agreement accepted/);
  assert.match(skill('workspace-sync'), /prepared pull request or an unmerged plan\/done file/);
});

test('assessment prose reuses supplied answers and still asks material missing choices', () => {
  for (const name of ['bootstrap', 'new-adr', 'new-plan', 'add-convention', 'brainstorm', 'agent-wave']) {
    const text = skill(name);
    assert.match(text, /including depth/);
    assert.match(text, /material[\s\S]{0,35}missing or conflicting/);
    assert.doesNotMatch(text, /selector always\s+(?:still )?appears/);
  }
  assert.match(skill('new-plan'), /owning ADR\(s\) already supplied/);
});
