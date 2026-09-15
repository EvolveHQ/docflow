// Synthetic public file-format fixtures; never installable or trusted.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { PRODUCT, REPOSITORY, assetName, checksumBytes, checksumName, formats, jsonBytes, manifestName, sha256 } from './contract.mjs';
export function installer(role, arch = 'x64') {
  const b = Buffer.alloc(1024);
  if (role === 'nsis') { b.write('MZ'); b.writeUInt32LE(128, 60); b.write('PE\0\0', 128); b.writeUInt16LE(0x14c, 132); }
  if (role === 'msi') Buffer.from('d0cf11e0a1b11ae1', 'hex').copy(b);
  if (role === 'dmg') b.write('koly', b.length - 512);
  if (role === 'appimage') { b.write('\x7fELF'); b[4] = 2; b[5] = 1; b.write('AI\x02', 8); b.writeUInt16LE(arch === 'x64' ? 62 : 183, 18); }
  if (role === 'deb') b.write('!<arch>\ndebian-binary   ');
  if (role === 'rpm') Buffer.from('edabeedb', 'hex').copy(b);
  return b;
}

export function publicFixture(directory, releaseVersion = '1.0.0-rc.1+build.7') {
  mkdirSync(directory);
  const doc = { schemaVersion: 1, product: PRODUCT, repository: REPOSITORY, version: releaseVersion,
    tag: `clarity-v${releaseVersion}`, compatibleDocflowVersion: '0.9.4', assets: [] };
  for (const os of ['windows', 'macos', 'linux']) {
    for (const role of [...Object.keys(formats[os]), 'notices', 'dependencies']) {
      const bytes = role === 'notices' ? Buffer.from('Synthetic fixture notice. https://opensource.org/license/mit\n')
        : role === 'dependencies' ? jsonBytes({ schemaVersion: 1, packages: [{ ecosystem: 'npm', name: 'example', version: '1.0.0', licenses: ['MIT'] }] }) : installer(role);
      const a = { name: '', role, os, arch: 'x64', buildConfiguration: 'full', size: bytes.length, sha256: sha256(bytes) };
      a.name = assetName(releaseVersion, a); doc.assets.push(a); writeFileSync(join(directory, a.name), bytes);
    }
  }
  const metadata = jsonBytes(doc); writeFileSync(join(directory, manifestName(releaseVersion)), metadata);
  writeFileSync(join(directory, checksumName(releaseVersion)), checksumBytes(doc, metadata)); return doc;
}
