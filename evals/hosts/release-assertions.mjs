// Preserve the independent release assertions after retiring model cases
// from the deterministic runner. These check target state without a host turn.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  assertTree, assertAbsent, assertFileContains, assertCommandSucceeds,
  assertContiguousAdrs, assertIndexSync, assertMigratedToDeclaredShape,
  assertReferencesRewritten, assertHistoryPreserved, assertPlanShipped,
} from '../assertions.mjs';

export const releaseAssertions = {
  'bootstrap-full'(repo) {
    assertTree(repo, ['AGENTS.md', 'CLAUDE.md', 'CONVENTIONS.md', 'INDEX.md',
      'adr/0000-template.md', 'plan/todo', 'plan/done', 'tools/verify.mjs', '_agent/prompts/autonomous.md']);
    assertAbsent(repo, ['_agent/ROLES.md', '_agent/LOCKS.md', '_agent/WORKLOG.md',
      '_agent/CURRENT_FOCUS.md', '_agent/IN_FLIGHT.md', '_agent/HANDOFF.md']);
    assertFileContains(repo, 'AGENTS.md', 'Picking up this repo');
    assertFileContains(repo, '_agent/prompts/autonomous.md', 'node tools/verify.mjs');
    assertCommandSucceeds(repo, 'node tools/verify.mjs');
  },
  'bootstrap-express'(repo) {
    assertTree(repo, ['AGENTS.md', 'CLAUDE.md', '.docflow/CONVENTIONS.md', '.docflow/INDEX.md',
      '.docflow/adr/0000-template.md', '.docflow/adr/0001-record-architecture-decisions.md']);
    assertAbsent(repo, ['.docflow/plan', 'plan', '_agent', '.docflow/GLOSSARY.md', 'GLOSSARY.md',
      '.docflow/domains', 'domains', '.docflow/federation.md', 'federation.md']);
    const conventions = readFileSync(join(repo, '.docflow/CONVENTIONS.md'), 'utf8');
    assert.match(conventions.replace(/[`*]/g, ''), /^Assessment depth:\s*express\b/m,
      'expected the express assessment depth');
    assertFileContains(repo, '.docflow/CONVENTIONS.md', 'fast-forward');
  },
  'new-adr'(repo) {
    assertContiguousAdrs(repo);
    assertIndexSync(repo);
  },
  'legacy-range'(repo) {
    const map = { '0101': '0004', '0102': '0005' };
    assertMigratedToDeclaredShape(repo, { map });
    assertReferencesRewritten(repo, { map });
    assertHistoryPreserved(repo, { numbers: ['0101'] });
    assertFileContains(repo, 'adr/0001-record-architecture-decisions.md', 'shape: technology');
    assertPlanShipped(repo, 'adopt-the-method');
  },
  'legacy-coordination'(repo) {
    assertAbsent(repo, ['.docflow/_agent/WORKLOG.md', '.docflow/_agent/IN_FLIGHT.md',
      '.docflow/_agent/CURRENT_FOCUS.md', '.docflow/_agent/HANDOFF.md', '.docflow/_agent/LOCKS.md']);
    assertTree(repo, ['.docflow/_agent/ROLES.md', '.docflow/_agent/prompts/autonomous.md']);
    assertFileContains(repo, '.docflow/plan/todo/0001-example.md', '## Status');
    assertFileContains(repo, '.docflow/plan/todo/0001-example.md', 'executor-live');
    assertFileContains(repo, '.docflow/plan/todo/0001-example.md', 'Awaiting fixture data');
    assertFileContains(repo, 'AGENTS.md', 'Picking up this repo');
    assertFileContains(repo, 'AGENTS.md', '.docflow/');
    assertFileContains(repo, 'OPERATIONS.md', 'operator sign-off');
    assertFileContains(repo, '.docflow/_agent/prompts/autonomous.md', 'node tools/verify.mjs');
    for (const [path, stale] of [['.gitattributes', 'merge=union'], ['.gitignore', 'CURRENT_FOCUS.md']]) {
      let text = '';
      try { text = readFileSync(join(repo, path), 'utf8'); }
      catch (e) { if (e.code !== 'ENOENT') throw e; }
      if (text.includes(stale)) throw Error(`Legacy coordination rule remains in ${path}`);
    }
    assertCommandSucceeds(repo, 'node tools/verify.mjs');
  },
};
