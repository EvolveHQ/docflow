import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { check, jsonBytes, PRODUCT, REPOSITORY } from './contract.mjs';
import { approvalComment, compareRemote, prepare, publish, releaseBody, validateApproval } from './consumer.mjs';
import { GitHub } from './github.mjs';
import { selectRelease } from './lookup.mjs';

function options(args, allowed) {
  const values = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, '');
    check(args[i] === `--${key}` && allowed.includes(key) && !(key in values) && typeof args[i + 1] === 'string', 'invalid or duplicate command option');
    values[key] = args[i + 1];
  }
  return values;
}
function readJson(path) { try { return JSON.parse(readFileSync(path, 'utf8')); } catch { throw new Error('cannot read valid JSON record'); } }

export async function main(args, { apiFactory = opts => new GitHub(opts), env = process.env, output = value => process.stdout.write(jsonBytes(value)) } = {}) {
  const [command, ...rest] = args;
  if (command === 'lookup') {
    const opt = options(rest, ['product', 'version', 'include-prerelease']);
    check(opt['include-prerelease'] === undefined || ['true', 'false'].includes(opt['include-prerelease']), 'invalid prerelease option');
    const api = apiFactory({ token: '' });
    const { release, ...selected } = selectRelease(await api.listReleases(), opt.product, opt.version, opt['include-prerelease'] === 'true');
    output(selected); return selected;
  }
  if (command === 'check-environment') {
    check(rest.length === 0 && env.GITHUB_REPOSITORY === REPOSITORY && env.GITHUB_REF === 'refs/heads/main'
      && env.GITHUB_EVENT_NAME === 'workflow_dispatch' && env.GH_TOKEN, 'publication workflow must run manually from main in the public repository');
    await apiFactory({ token: env.GH_TOKEN }).checkApprovalEnvironment({ runId: env.GITHUB_RUN_ID,
      actors: [env.GITHUB_ACTOR, env.GITHUB_TRIGGERING_ACTOR], comment: approvalComment({ version: env.CLARITY_VERSION,
        tag: `clarity-v${env.CLARITY_VERSION}`, compatibleDocflowVersion: env.DOCFLOW_VERSION,
        payloadSha256: env.APPROVED_PAYLOAD, targetCommit: env.PUBLIC_TARGET }) });
    output({ status: 'independent-payload-approval-verified' }); return;
  }
  check(['plan', 'publish', 'verify-public'].includes(command), 'expected plan, publish, verify-public, lookup or check-environment');
  const opt = options(rest, ['directory', 'version', 'counterpart', 'target', 'approval', 'output']);
  check(opt.directory && opt.version && opt.counterpart && opt.target, 'directory, version, counterpart and target are required');
  check(command === 'plan' || !opt.output, 'output is only supported for a plan');
  check(command !== 'plan' || !opt.approval, 'a plan does not accept approval');
  const candidate = prepare(opt.directory, opt.version, opt.counterpart, opt.target);
  if (command === 'plan') {
    if (opt.output) writeFileSync(opt.output, jsonBytes(candidate.plan), { flag: 'wx' });
    output(candidate.plan); return candidate.plan;
  }
  check(opt.approval, 'an explicit approval record is required');
  const approval = readJson(opt.approval); validateApproval(approval, candidate.plan);
  if (command === 'verify-public') {
    // Deliberately ignore all ambient credentials for the final public proof.
    const api = apiFactory({ token: '' }); await api.checkRepository();
    const { release } = selectRelease(await api.listReleases(), PRODUCT, opt.version);
    await compareRemote(api, release, candidate);
    check(release.body === releaseBody(candidate.plan) && release.name === `Clarity ${opt.version}`
      && await api.tagCommit(candidate.plan.tag) === opt.target, 'published metadata or tag target differs');
    const result = { status: 'unauthenticated-download-bytes-verified', product: PRODUCT, tag: candidate.plan.tag, payloadSha256: candidate.plan.payloadSha256 };
    output(result); return result;
  }
  check(env.GH_TOKEN, 'GH_TOKEN with contents write is required for explicitly approved publication');
  const result = await publish(candidate, approval, apiFactory({ token: env.GH_TOKEN }));
  output(result); return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch(error => {
    // Parse/filesystem errors may contain acquired text or local paths. Log only
    // our fixed policy diagnostics; no stack or external response body is emitted.
    const safe = /^(?:release operation failed|existing |complete existing draft|tag exists|GitHub request failed|approval does not bind|explicit publication approval|required|no published release|ambiguous release precedence|counterpart |Docflow package|publication environment|publication workflow|GH_TOKEN|an explicit approval)/.test(error.message);
    process.stderr.write(`release: FAILED: ${safe ? error.message : 'invalid input, candidate or public response; review the contract and local plan'}\n`);
    process.exitCode = 1;
  });
}
