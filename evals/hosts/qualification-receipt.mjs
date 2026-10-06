// Render the plan-item receipt from machine-readable qualification results
// (ADR 0062). The receipt is generated output: the harness emits it from the
// results JSON, so it can never drift from the run it describes.

import { cases } from './qualification-cases.mjs';

export function summarise(payload) {
  const count = (status) => payload.results.filter((r) => r.status === status).length;
  return {
    pass: count('pass'), fail: count('fail'), blocked: count('blocked'), unrun: count('unrun'),
    total: payload.results.length,
  };
}

function perHost(payload) {
  const hosts = [];
  for (const r of payload.results) {
    const id = r.host || 'product';
    if (!hosts.includes(id)) hosts.push(id);
  }
  return hosts.map((id) => {
    const rows = payload.results.filter((r) => (r.host || 'product') === id);
    const by = (st) => rows.filter((r) => r.status === st).length;
    return { id, pass: by('pass'), fail: by('fail'), blocked: by('blocked'), unrun: by('unrun'), total: rows.length };
  });
}

export function renderReceipt(payload) {
  const s = summarise(payload);
  const lines = [];
  lines.push('# Host qualification receipt (generated)');
  lines.push('');
  lines.push(`- Source revision: \`${payload.source_revision}\``);
  lines.push(`- Generated at: ${payload.generated_at}`);
  lines.push(`- Results: ${s.pass} pass, ${s.fail} fail, ${s.blocked} blocked, ${s.unrun} unrun (${s.total} cases)`);
  lines.push('');
  lines.push('## Per-host case counts');
  lines.push('');
  lines.push('| Host | Pass | Fail | Blocked | Unrun | Total |');
  lines.push('|------|------|------|---------|-------|-------|');
  for (const h of perHost(payload)) lines.push(`| ${h.id} | ${h.pass} | ${h.fail} | ${h.blocked} | ${h.unrun} | ${h.total} |`);
  lines.push('');
  lines.push('## Case results');
  lines.push('');
  lines.push('| Host | Case | Status | Cause / evidence |');
  lines.push('|------|------|--------|------------------|');
  for (const r of payload.results) {
    const detail = (r.cause || r.evidence || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
    lines.push(`| ${r.host || 'product'} | ${r.case} | ${r.status} | ${detail.slice(0, 180)} |`);
  }
  lines.push('');
  lines.push('## Retired behavioural evals');
  lines.push('');
  const retired = cases.filter((c) => c.retires).map((c) => `- \`${c.id}\` retires “${c.retires}”`);
  lines.push(...(retired.length ? retired : ['- none declared in this round']));
  lines.push('');
  lines.push('## Status at a glance');
  lines.push('');
  lines.push(`- **This run:** executed ${s.total} qualification cases; ${s.pass} passed.`);
  lines.push(`- **Overall:** ${s.fail === 0 ? 'no failing case' : `${s.fail} failing case(s)`}; ${s.blocked} blocked and ${s.unrun} unrun are not passes.`);
  lines.push('- **Yet to do:** unblock adapters that need credentials and run the model-driven skill cases.');
  lines.push('');
  return lines.join('\n');
}
