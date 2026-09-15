// Portable public handoff validator. D5 vendors this file and its test fixtures.
import { createHash } from 'node:crypto';
import { lstatSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

export const PRODUCT = 'docflow-clarity';
export const REPOSITORY = 'EvolveHQ/docflow';
// Versioned copy of the producer's build-profile registry; it detects drift.
export const PROFILES = { minimal: [], ai: ['ai'], plugins: ['plugins'], 'ai-plugins': ['ai', 'plugins'], terminal: ['terminal'], 'ai-terminal': ['ai', 'terminal'], 'plugins-terminal': ['plugins', 'terminal'], 'ai-plugins-terminal': ['ai', 'plugins', 'terminal'], remote: ['terminal', 'remote'], 'ai-remote': ['ai', 'terminal', 'remote'], 'plugins-remote': ['plugins', 'terminal', 'remote'], full: ['ai', 'plugins', 'terminal', 'remote'] };
export const CONFIGURATIONS = Object.keys(PROFILES);
export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
export const jsonBytes = (value) => Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
export function check(ok, message) { if (!ok) throw new Error(message); }
export function keys(value, expected) {
  check(value && typeof value === 'object' && !Array.isArray(value), 'expected object');
  check(Object.keys(value).sort().join(',') === [...expected].sort().join(','), 'unexpected or missing fields');
}
export function version(value) {
  check(typeof value === 'string' && value.length <= 100 && /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/.test(value), 'invalid version');
  const pre = value.split('+')[0].split('-').slice(1).join('-');
  check(!pre || pre.split('.').every((s) => !/^0\d+$/.test(s)), 'invalid prerelease number');
  return value;
}
export function hex(value, length = 64) { check(typeof value === 'string' && new RegExp(`^[a-f0-9]{${length}}$`).test(value), 'invalid digest'); }
export function tuple(asset) {
  check(['windows', 'macos', 'linux'].includes(asset.os), 'unsupported OS');
  check(['x64', 'arm64'].includes(asset.arch), 'unsupported architecture');
  check(CONFIGURATIONS.includes(asset.buildConfiguration), 'unsupported build configuration');
  return `${asset.os}_${asset.arch}_${asset.buildConfiguration}`;
}
export const formats = {
  windows: { nsis: '.exe', msi: '.msi' },
  macos: { dmg: '.dmg' },
  linux: { appimage: '.AppImage', deb: '.deb', rpm: '.rpm' },
};
export function assetName(releaseVersion, asset) {
  const build = tuple(asset);
  const suffix = asset.role === 'notices' ? '_NOTICES.txt' : asset.role === 'dependencies' ? '_DEPENDENCIES.json' : formats[asset.os][asset.role];
  check(suffix, 'unexpected asset role for OS');
  return `${PRODUCT}_${version(releaseVersion)}_${build}${suffix}`;
}
export const manifestName = (v) => `${PRODUCT}_${version(v)}_release.json`;
export const checksumName = (v) => `${PRODUCT}_${version(v)}_SHA256SUMS.txt`;

export function safeText(bytes) {
  const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  check(text.trim().length > 0 && !/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(text), 'invalid text asset');
  check(!/(?:\.docflow[\\/]|\bADR[ -]?\d{4}\b|\b[A-Z]:[\\/]|\/Users\/|\/home\/|\/work\/|github\.com\/EvolveHQ\/docflow-clarity|BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY|(?:gh[pousr]_|github_pat_)[A-Za-z0-9_]{15,}|(?:secret|password|token)\s*[:=]\s*\S+)/i.test(text), 'private material in public text');
  return text;
}
export function validateDependencies(bytes) {
  const doc = JSON.parse(safeText(bytes));
  check(bytes.equals(jsonBytes(doc)), 'noncanonical dependency JSON');
  keys(doc, ['schemaVersion', 'packages']);
  check(doc.schemaVersion === 1 && Array.isArray(doc.packages) && doc.packages.length > 0, 'missing dependency list');
  const ids = new Set();
  for (const p of doc.packages) {
    keys(p, ['ecosystem', 'name', 'version', 'licenses']);
    check(['npm', 'cargo'].includes(p.ecosystem), 'invalid dependency ecosystem');
    check(typeof p.name === 'string' && /^(?:@[a-z0-9._-]+\/)?[A-Za-z0-9._-]+$/.test(p.name) && p.name !== PRODUCT, 'invalid public dependency');
    check(typeof p.version === 'string' && /^[A-Za-z0-9.+-]{1,100}$/.test(p.version), 'invalid dependency version');
    check(Array.isArray(p.licenses) && p.licenses.length > 0 && p.licenses.every((v) => typeof v === 'string' && /^[A-Za-z0-9.+ -]{1,100}$/.test(v)), 'invalid dependency licenses');
    const id = `${p.ecosystem}:${p.name}@${p.version}`;
    check(!ids.has(id), 'duplicate dependency'); ids.add(id);
  }
}
export function validateContent(asset, bytes) {
  if (asset.role === 'notices') { safeText(bytes); return; }
  if (asset.role === 'dependencies') { validateDependencies(bytes); return; }
  const magic = (offset, hex) => bytes.subarray(offset, offset + hex.length / 2).toString('hex') === hex;
  if (asset.role === 'nsis') {
    check(bytes.length > 64 && magic(0, '4d5a'), 'invalid PE installer');
    const pe = bytes.readUInt32LE(60);
    check(pe + 6 <= bytes.length && magic(pe, '50450000'), 'invalid PE header');
    // NSIS bootstrap machine need not equal the installed application's machine.
    check([0x14c, 0x8664, 0xaa64].includes(bytes.readUInt16LE(pe + 4)), 'invalid PE machine');
  } else if (asset.role === 'msi') check(bytes.length >= 512 && magic(0, 'd0cf11e0a1b11ae1'), 'invalid MSI installer');
  else if (asset.role === 'dmg') check(bytes.length >= 512 && bytes.subarray(-512, -508).toString() === 'koly', 'invalid DMG installer');
  else if (asset.role === 'appimage') {
    check(bytes.length >= 64 && magic(0, '7f454c46') && bytes[4] === 2 && bytes[5] === 1 && magic(8, '414902'), 'invalid AppImage installer');
    check(bytes.readUInt16LE(18) === (asset.arch === 'x64' ? 62 : 183), 'ELF architecture mismatch');
  } else if (asset.role === 'deb') check(bytes.length >= 68 && bytes.subarray(0, 8).toString() === '!<arch>\n' && bytes.subarray(8, 24).toString().trim().replace(/\/$/, '') === 'debian-binary', 'invalid Debian installer');
  else if (asset.role === 'rpm') check(bytes.length >= 96 && magic(0, 'edabeedb'), 'invalid RPM installer');
  else check(false, 'unexpected content type');
}
export function validateManifest(doc) {
  keys(doc, ['schemaVersion', 'product', 'repository', 'version', 'tag', 'compatibleDocflowVersion', 'assets']);
  check(doc.schemaVersion === 1 && doc.product === PRODUCT && doc.repository === REPOSITORY, 'wrong schema/product/repository');
  version(doc.version); version(doc.compatibleDocflowVersion);
  check(doc.tag === `clarity-v${doc.version}`, 'wrong product tag or version suffix');
  check(Array.isArray(doc.assets) && doc.assets.length > 0, 'missing assets');
  const names = new Set(); const builds = new Map();
  for (const a of doc.assets) {
    keys(a, ['name', 'role', 'os', 'arch', 'buildConfiguration', 'size', 'sha256']);
    check(a.name === assetName(doc.version, a), 'wrong asset name/product/version/path');
    check(!names.has(a.name.toLowerCase()), 'duplicate/case-colliding asset'); names.add(a.name.toLowerCase());
    check(Number.isSafeInteger(a.size) && a.size > 0, 'invalid asset size'); hex(a.sha256);
    const id = tuple(a); const roles = builds.get(id) ?? []; roles.push(a.role); builds.set(id, roles);
  }
  const platforms = new Set();
  for (const [id, roles] of builds) {
    const os = id.split('_')[0]; platforms.add(os);
    check([...Object.keys(formats[os]), 'notices', 'dependencies'].sort().join(',') === roles.sort().join(','), 'missing or unexpected build assets');
  }
  check(platforms.size === 3, 'incomplete platform matrix');
  for (const config of new Set(doc.assets.map((a) => a.buildConfiguration))) {
    check(new Set(doc.assets.filter((a) => a.buildConfiguration === config).map((a) => a.os)).size === 3, 'incomplete configuration matrix');
  }
  return doc;
}
export function checksumBytes(doc, metadataBytes) {
  const rows = [...doc.assets.map((a) => [a.name, a.sha256]), [manifestName(doc.version), sha256(metadataBytes)]];
  rows.sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0);
  return Buffer.from(rows.map(([name, hash]) => `${hash}  ${name}\n`).join(''));
}
export function readFlat(directory) {
  check(lstatSync(directory).isDirectory() && !lstatSync(directory).isSymbolicLink(), 'unsafe public directory');
  const files = new Map();
  for (const name of readdirSync(directory)) {
    const path = join(directory, name); const stat = lstatSync(path);
    check(stat.isFile() && !stat.isSymbolicLink() && stat.nlink === 1, 'unexpected directory/link in public handoff');
    files.set(name, readFileSync(path));
  }
  return files;
}
export function validatePublic(directory, expectedVersion) {
  version(expectedVersion);
  const files = readFlat(resolve(directory));
  const metadata = files.get(manifestName(expectedVersion)); check(metadata, 'missing release metadata');
  const doc = validateManifest(JSON.parse(metadata)); check(doc.version === expectedVersion, 'unexpected release version');
  // Parsed objects discard duplicate keys and normalize escapes. Only generated
  // bytes may cross the boundary, so discarded private text cannot hide there.
  check(metadata.equals(jsonBytes(doc)), 'noncanonical release JSON');
  const expectedNames = [...doc.assets.map((a) => a.name), manifestName(doc.version), checksumName(doc.version)].sort();
  check([...files.keys()].sort().join('\n') === expectedNames.join('\n'), 'unexpected or missing public assets');
  for (const a of doc.assets) {
    const bytes = files.get(a.name);
    check(bytes.length === a.size && sha256(bytes) === a.sha256, 'asset hash/size mismatch');
    validateContent(a, bytes);
  }
  check(files.get(checksumName(doc.version)).equals(checksumBytes(doc, metadata)), 'checksum manifest mismatch');
  return doc;
}

// D5 calls this after downloading all existing assets. This performs no writes.
export function assertIdenticalPublic(existing, candidate, expectedVersion) {
  validatePublic(existing, expectedVersion); validatePublic(candidate, expectedVersion);
  const a = readFlat(existing); const b = readFlat(candidate);
  check([...a.keys()].sort().join('\n') === [...b.keys()].sort().join('\n'), 'differing retry asset set');
  for (const [name, bytes] of a) check(bytes.equals(b.get(name)), 'differing retry bytes; existing release must be preserved');
  return true;
}
