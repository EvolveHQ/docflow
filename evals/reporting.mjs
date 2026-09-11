// Validate report shape independently of a model's self-reported boolean.
import assert from 'node:assert/strict';
export function assertStatusReports(text, minimum = 1) {
  const blocks = String(text).split(/^(?:#{1,6}\s+|\*\*)Status at a glance(?:\*\*)?\s*$/gm).slice(1);
  assert.ok(blocks.length >= minimum, `expected ${minimum} Status at a glance blocks, got ${blocks.length}`);
  for (const block of blocks) {
    const section = block.split(/^#{1,6}\s/m)[0].replace(/\*\*/g, '');
    for (const label of ['This run', 'Overall', 'Yet to do']) {
      assert.match(section, new RegExp(`^- ${label}:\\s*\\S`, 'm'), `missing ${label}`);
    }
    assert.match(section, /^- Overall:\s*(implemented|partially verified|verified|blocked|failed|unknown)\b/mi, 'invalid Overall vocabulary');
  }
}
