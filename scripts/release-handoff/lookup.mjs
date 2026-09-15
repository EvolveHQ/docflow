import { check, PRODUCT, REPOSITORY, version } from './contract.mjs';

const prefix = product => { check(['docflow', PRODUCT].includes(product), 'unsupported product'); return product === PRODUCT ? 'clarity-v' : 'v'; };

// SemVer precedence ignores build metadata; ambiguous equal-precedence tags need
// an exact version. Numeric components use BigInt to avoid precision loss.
export function compareVersions(a, b) {
  const parts = v => { const [core, ...pre] = v.split('+')[0].split('-'); return [core.split('.').map(BigInt), pre.join('-').split('.').filter(Boolean)]; };
  const [ac, ap] = parts(a); const [bc, bp] = parts(b);
  for (let i = 0; i < 3; i++) if (ac[i] !== bc[i]) return ac[i] > bc[i] ? 1 : -1;
  if (!ap.length || !bp.length) return !ap.length && !bp.length ? 0 : !ap.length ? 1 : -1;
  for (let i = 0; i < Math.max(ap.length, bp.length); i++) {
    if (ap[i] === undefined || bp[i] === undefined) return ap[i] === undefined ? -1 : 1;
    if (ap[i] === bp[i]) continue;
    const an = /^\d+$/.test(ap[i]); const bn = /^\d+$/.test(bp[i]);
    if (an && bn) return BigInt(ap[i]) > BigInt(bp[i]) ? 1 : -1;
    if (an !== bn) return an ? -1 : 1;
    return ap[i] > bp[i] ? 1 : -1;
  }
  return 0;
}

export function selectRelease(releases, product, exactVersion, includePrerelease = false) {
  const start = prefix(product);
  if (exactVersion) version(exactVersion);
  const found = releases.flatMap(release => {
    if (release.draft || typeof release.tag_name !== 'string' || !release.tag_name.startsWith(start)) return [];
    const v = release.tag_name.slice(start.length);
    try { version(v); } catch { return []; }
    const pre = v.split('+')[0].includes('-');
    if (release.prerelease !== pre || (!exactVersion && !includePrerelease && pre) || (exactVersion && v !== exactVersion)) return [];
    return [{ release, version: v }];
  }).sort((a, b) => compareVersions(b.version, a.version));
  check(found.length, 'no published release for the selected product/version');
  check(found.length === 1 || compareVersions(found[0].version, found[1].version) !== 0, 'ambiguous release precedence; select an exact version');
  const selected = found[0];
  return { product, repository: REPOSITORY, version: selected.version, tag: selected.release.tag_name,
    url: `https://github.com/${REPOSITORY}/releases/tag/${encodeURIComponent(selected.release.tag_name)}`, release: selected.release };
}
