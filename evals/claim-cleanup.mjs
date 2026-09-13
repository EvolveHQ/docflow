// Keep every executable cleanup example tied to the verified integration source.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const paths = [
  'plugins/docflow/skills/ship-item/SKILL.md',
  'plugins/docflow/skills/bootstrap/templates/_agent-prompts-autonomous.md',
  '_agent/prompts/autonomous.md',
];

function cleanupSection(text, path) {
  const section = text.replaceAll('\r\n', '\n')
    .match(/^## (?:End the claim|Cleanup and report)\n([\s\S]*?)(?=^## |$(?![\s\S]))/m)?.[1];
  assert.ok(section, `${path}: cleanup section missing`);
  return section.trim();
}

function commandFor(section, path) {
  const commands = [...section.matchAll(/`(git push [^`]+)`/g)];
  assert.equal(commands.length, 1, `${path}: one explicit cleanup push required`);
  const args = commands[0][1].split(/\s+/).slice(1);
  assert.deepEqual(args, [
    'push', '--force-with-lease=refs/heads/claim/<item-key>:<verified-source-sha>',
    'origin', ':refs/heads/claim/<item-key>',
  ], `${path}: deletion must lease the full claim ref against the verified source`);
  const prose = section.replace(/\s+/g, ' ');
  assert.match(prose, /Retain the source SHA verified for this integration before integrating/,
    `${path}: capture the verified source before integration`);
  assert.match(prose, /Never replace it with a newly read remote tip/,
    `${path}: refreshing the expected tip would admit later work`);
  assert.match(prose, /cleanup blocker: preserve (?:the ref|it)/,
    `${path}: preserve changed claims`);
  assert.match(prose, /expected and observed SHAs/,
    `${path}: identify the changed ref precisely`);
  assert.match(prose, /Keep the confirmed integration outcome/,
    `${path}: cleanup failure must not undo confirmed integration`);
  return args;
}

export function documentedCleanupCommands() {
  return paths.map(path => {
    const section = cleanupSection(readFileSync(join(root, path), 'utf8'), path);
    return { path, section, args: commandFor(section, path) };
  });
}

export function assertClaimCleanupContract() {
  const commands = documentedCleanupCommands();
  assert.equal(commands[1].section, commands[2].section,
    'dogfood cleanup must match the bootstrap template');
  for (const { path, section } of commands) {
    // Exercise the actual regressions, without mutating the checkout or gates.
    for (const [before, after] of [
      ['--force-with-lease=refs/heads/claim/<item-key>:<verified-source-sha>', ''],
      ['<verified-source-sha>', '<current-remote-sha>'],
      ['Retain the source SHA verified for this integration before integrating', 'Read the remote tip during cleanup'],
      ['Keep the confirmed integration outcome', 'Report integration failed'],
    ]) {
      assert.ok(section.includes(before), `${path}: mutation target missing`);
      assert.throws(() => commandFor(section.replace(before, after), path),
        { name: 'AssertionError' }, `${path}: unsafe cleanup mutation accepted`);
    }
  }
}
