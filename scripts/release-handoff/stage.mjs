// Fetch inert public candidate data only; never download or execute producer code.
import { writeFileSync } from 'node:fs';
import { GitHub } from './github.mjs';
import { check, hex, sha256 } from './contract.mjs';

export async function stage({ artifactId, runId, target, output }, api) {
  check(/^[1-9]\d*$/.test(artifactId) && /^[1-9]\d*$/.test(runId), 'invalid artifact/run ID'); hex(target, 40);
  await api.checkRepository();
  const run = await api.request(`/actions/runs/${runId}`);
  check(run.head_sha === target && run.status === 'completed' && run.conclusion === 'success', 'candidate run does not match the successful public target');
  const artifact = await api.request(`/actions/artifacts/${artifactId}`);
  check(artifact.workflow_run?.id === Number(runId) && artifact.workflow_run.head_sha === target && artifact.expired === false
    && artifact.name === 'clarity-public-handoff', 'candidate artifact identity mismatch');
  check(/^sha256:[a-f0-9]{64}$/.test(artifact.digest), 'candidate archive digest missing');
  const bytes = await api.request(`/actions/artifacts/${artifactId}/zip`, { binary: true });
  check(`sha256:${sha256(bytes)}` === artifact.digest, 'candidate archive digest mismatch');
  writeFileSync(output, bytes, { flag: 'wx' });
}

if (process.argv[1]?.endsWith('stage.mjs')) {
  stage({ artifactId: process.env.CANDIDATE_ARTIFACT_ID, runId: process.env.CANDIDATE_RUN_ID,
    target: process.env.PUBLIC_TARGET, output: process.argv[2] }, new GitHub({ token: process.env.GH_TOKEN }))
    .catch(() => { process.stderr.write('candidate staging failed; no release writes attempted\n'); process.exitCode = 1; });
}
