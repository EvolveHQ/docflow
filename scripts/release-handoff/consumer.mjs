// Public consumer policy; the portable contract remains byte-for-byte vendored.
import { lstatSync, readFileSync } from 'node:fs';
import { dirname, parse, resolve } from 'node:path';
import { check, checksumBytes, checksumName, hex, jsonBytes, keys, manifestName, PRODUCT, readFlat, REPOSITORY, sha256, validatePublic, version } from './contract.mjs';

export function rejectLinkedAncestors(path) {
  let cursor = resolve(path);
  for (;;) {
    check(!lstatSync(cursor).isSymbolicLink(), 'linked handoff path is forbidden');
    if (cursor === parse(cursor).root) break;
    cursor = dirname(cursor);
  }
}

export function packageVersion() {
  const paths = ['../../package.json', '../../plugins/docflow/.claude-plugin/plugin.json', '../../plugins/docflow/.codex-plugin/plugin.json'];
  const versions = paths.map(p => JSON.parse(readFileSync(new URL(p, import.meta.url))).version);
  check(versions.every(v => v === versions[0]), 'Docflow package versions disagree');
  return version(versions[0]);
}

export function prepare(directory, expectedVersion, counterpart, targetCommit) {
  version(expectedVersion); version(counterpart); hex(targetCommit, 40);
  check(counterpart === packageVersion(), 'counterpart differs from this Docflow checkout');
  rejectLinkedAncestors(directory);
  const doc = validatePublic(directory, expectedVersion);
  check(doc.compatibleDocflowVersion === counterpart, 'counterpart version mismatch');
  // Capture once after validation, then recheck every captured byte. Remote I/O
  // only uses these buffers, never reopens a possibly replaced candidate path.
  const files = readFlat(directory);
  const metadata = jsonBytes(doc);
  const descriptors = [...doc.assets.map(({ name, size, sha256 }) => ({ name, size, sha256 })),
    { name: manifestName(doc.version), size: metadata.length, sha256: sha256(metadata) }];
  const checksum = files.get(checksumName(doc.version));
  // validatePublic's checksum is deterministic from the validated metadata.
  check(checksum?.equals(checksumBytes(doc, metadata)), 'candidate changed during validation');
  descriptors.push({ name: checksumName(doc.version), size: checksum.length, sha256: sha256(checksum) });
  descriptors.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
  check(files.size === descriptors.length, 'candidate changed during validation');
  for (const asset of descriptors) {
    const bytes = files.get(asset.name);
    check(bytes?.length === asset.size && sha256(bytes) === asset.sha256, 'candidate changed during validation');
  }
  const plan = { schemaVersion: 1, product: PRODUCT, repository: REPOSITORY, version: doc.version,
    tag: doc.tag, compatibleDocflowVersion: counterpart, targetCommit,
    payloadSha256: sha256(jsonBytes(descriptors)), assets: descriptors };
  return { plan, files };
}

export function validateApproval(approval, plan) {
  keys(approval, ['plan', 'authorisation']);
  check(approval.authorisation === 'approve-publication-after-private-producer-and-native-trust-review', 'explicit publication approval required');
  check(jsonBytes(approval.plan).equals(jsonBytes(plan)), 'approval does not bind this exact public payload and target');
  // An operator-supplied local record is an explicit instruction, not proof of
  // identity. CI additionally requires an independently approved environment.
}

export const approvalComment = plan => `approve ${PRODUCT} ${plan.version} ${plan.tag} ${plan.compatibleDocflowVersion} ${plan.payloadSha256} ${plan.targetCommit}`;

export const releaseBody = plan => `Clarity ${plan.version}\n\nCompatible Docflow version: ${plan.compatibleDocflowVersion}.\n\nChoose the installer for your operating system, architecture and build configuration. Download the matching dependency list and notices, and verify SHA-256 against ${checksumName(plan.version)}.\n\nPublic payload SHA-256: ${plan.payloadSha256}.\n\nInstallation and verification: https://github.com/EvolveHQ/docflow/blob/${plan.targetCommit}/docs/clarity-releases.md\n`;

function assertReleaseMetadata(release, plan, draft) {
  check(release && Number.isSafeInteger(release.id) && release.id > 0 && release.draft === draft
    && release.tag_name === plan.tag && release.name === `Clarity ${plan.version}` && release.body === releaseBody(plan)
    && release.prerelease === plan.version.split('+')[0].includes('-'), 'existing release metadata differs; preserved for explicit recovery');
}

export async function compareRemote(api, release, candidate) {
  const assets = await api.listAssets(release.id);
  const downloaded = [];
  // Do not short-circuit on a missing/extra/duplicate/starter asset. Attempt to
  // read every advertised asset before reporting an incomplete or differing set.
  const failures = [];
  for (const asset of assets) {
    try { downloaded.push({ asset, bytes: await api.downloadAsset(asset.id) }); }
    catch { failures.push(asset.id); }
  }
  check(!failures.length, 'existing asset download failed; preserve release and inspect network/authentication before retry');
  const expected = candidate.plan.assets;
  const names = downloaded.map(({ asset }) => asset.name).sort();
  check(JSON.stringify(names) === JSON.stringify(expected.map(a => a.name)), 'existing release has a differing or incomplete asset set; preserved for explicit recovery');
  for (const { asset, bytes } of downloaded) {
    const original = candidate.files.get(asset.name);
    check(asset.state === 'uploaded' && asset.size === original.length && bytes.equals(original), 'existing release bytes/state differ; preserved for explicit recovery');
  }
}

export async function publish(candidate, approval, api) {
  validateApproval(approval, candidate.plan);
  const { plan, files } = candidate;
  await api.checkRepository();
  await api.checkCommit(plan.targetCommit);
  const releases = (await api.listReleases()).filter(r => r.tag_name === plan.tag);
  check(releases.length <= 1, 'ambiguous existing release; preserved for explicit recovery');
  if (releases.length) {
    const release = releases[0];
    await compareRemote(api, release, candidate);
    check(!release.draft, 'complete existing draft requires explicit recovery review; no automatic publication');
    assertReleaseMetadata(release, plan, false);
    check(await api.tagCommit(plan.tag) === plan.targetCommit, 'existing tag target differs; preserved for explicit recovery');
    return { status: 'identical-no-op', repository: REPOSITORY, tag: plan.tag, payloadSha256: plan.payloadSha256 };
  }
  check(await api.tagCommit(plan.tag) === null, 'tag exists without a matching release; preserved for explicit recovery');
  let draft;
  let phase = 'draft creation';
  try {
    draft = await api.createDraft({ tag_name: plan.tag, target_commitish: plan.targetCommit,
      name: `Clarity ${plan.version}`, body: releaseBody(plan), draft: true,
      prerelease: plan.version.split('+')[0].includes('-'), generate_release_notes: false, make_latest: 'false' });
    assertReleaseMetadata(draft, plan, true);
    phase = 'asset upload';
    for (const asset of plan.assets) await api.uploadAsset(draft.id, asset.name, files.get(asset.name));
    phase = 'uploaded byte verification';
    await compareRemote(api, draft, candidate);
    assertReleaseMetadata((await api.listReleases()).find(r => r.id === draft.id), plan, true);
    // A concurrent release/tag change is never fixed by overwriting it.
    check(await api.tagCommit(plan.tag) === null, 'tag appeared during upload');
    phase = 'draft publication';
    await api.publishDraft(draft.id);
    phase = 'published state verification';
    const observed = (await api.listReleases()).find(r => r.id === draft.id);
    assertReleaseMetadata(observed, plan, false);
    await compareRemote(api, observed, candidate);
    check(await api.tagCommit(plan.tag) === plan.targetCommit, 'published tag target mismatch');
    return { status: 'published-authenticated-bytes-verified', repository: REPOSITORY, tag: plan.tag,
      payloadSha256: plan.payloadSha256, publicDownload: 'pending unauthenticated verification' };
  } catch {
    // Never include response bodies, URLs, credentials or acquired text in logs.
    throw new Error(`release operation failed during ${phase}; ${Number.isSafeInteger(draft?.id) && draft.id > 0 ? `release ID ${draft.id}` : 'creation outcome unknown'} must be inspected by tag ${plan.tag}; preserve all assets and do not retry by mutation`);
  }
}
