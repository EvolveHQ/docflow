import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';
import { check, hex, jsonBytes } from './contract.mjs';
import { approvalComment } from './consumer.mjs';

try {
  const plan = JSON.parse(readFileSync(process.argv[2]));
  hex(process.env.APPROVED_PAYLOAD);
  check(plan.payloadSha256 === process.env.APPROVED_PAYLOAD && plan.targetCommit === process.env.PUBLIC_TARGET
    && plan.version === process.env.CLARITY_VERSION && plan.compatibleDocflowVersion === process.env.DOCFLOW_VERSION,
  'workflow approval does not match the local plan');
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY,
    `## Clarity public payload review\n\nApprove only after private producer and native trust evidence review.\n\nRequired environment approval comment:\n\n\`${approvalComment(plan)}\`\n\n\`\`\`json\n${jsonBytes(plan)}\`\`\`\n`);
  if (process.argv[3]) writeFileSync(process.argv[3], jsonBytes({ plan,
    authorisation: 'approve-publication-after-private-producer-and-native-trust-review' }), { flag: 'wx' });
} catch {
  process.stderr.write('workflow payload binding failed; no release writes attempted\n'); process.exitCode = 1;
}
