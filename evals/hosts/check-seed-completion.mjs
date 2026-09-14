// Direct-bootstrap seed evidence is checked separately from ordinary item shipping.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, relative, join, sep, dirname, isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';

export function checkSeedCompletion(repoPath, { root = '.', signed = false } = {}) {
  const repo = resolve(repoPath);
  const artefacts = resolve(repo, root);
  const rel = (path) => relative(repo, path).split(sep).join('/');
  const rootRelative = relative(repo, artefacts);
  assert(rootRelative !== '..' && !rootRelative.startsWith(`..${sep}`) && !isAbsolute(rootRelative), 'artefact root escapes repository');
  const git = (...args) => execFileSync('git', ['--no-optional-locks', ...args], {
    cwd: repo, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, GIT_OPTIONAL_LOCKS: '0', GIT_TERMINAL_PROMPT: '0' },
  }).trim();
  const seedNames = readdirSync(join(artefacts, 'adr')).filter((name) => /^0001-.+\.md$/.test(name));
  assert.equal(seedNames.length, 1, 'expected one seed decision');
  const seed = rel(join(artefacts, 'adr', seedNames[0]));
  const doneNames = readdirSync(join(artefacts, 'plan/done')).filter((name) => /^\d{4}-\d{2}-\d{2}-adopt-adr-method\.md$/.test(name));
  assert.equal(doneNames.length, 1, 'expected one bootstrap adoption record');
  const done = rel(join(artefacts, 'plan/done', doneNames[0]));
  const body = readFileSync(join(repo, done), 'utf8');
  const owner = body.split('\n')
    .map((line) => line.replace(/^\s*[-*+]\s+/, '').replace(/^(\*\*|__)(Owning ADR:)\1/, '$2'))
    .find((line) => /^Owning ADR:/.test(line)) || '';
  const ownerPath = owner.match(/\[[^\]]*\]\(([^)]+)\)/)?.[1]
    ?? owner.slice('Owning ADR:'.length).trim().replaceAll('`', '');
  assert(ownerPath && [repo, artefacts, dirname(join(repo, done))]
    .some((base) => resolve(base, ownerPath) === resolve(repo, seed)), 'adoption record does not own the seed');
  const footer = body.split(/^## Shipped\s*$/m).at(-1);
  let reference;
  let kind;
  const introduction = footer.match(/^Shipped by bootstrap introduction: `([^`]+)`\.?\s*$/m);
  if (introduction) {
    kind = 'bootstrap-introduction';
    assert.equal(introduction[1], done, 'bootstrap reference names another path');
    const command = footer.match(/^Resolve: `(git log --follow --diff-filter=A --format=%H -- .+)`\s*$/m)?.[1];
    assert(command, 'bootstrap reference lacks the precise resolution command');
    const argument = command.slice('git log --follow --diff-filter=A --format=%H -- '.length);
    assert([done, `"${done}"`, `'${done}'`].includes(argument), 'resolution command names another path');
    // Execute fixed argv derived from the actual record path, never stored shell text.
    const introductions = git('log', '--follow', '--diff-filter=A', '--format=%H', '--', done).split('\n').filter(Boolean);
    assert.equal(introductions.length, 1, 'bootstrap reference has no unique introducing commit');
    reference = introductions[0];
    assert.equal(git('show', `${reference}:${done}`), body.trim(), 'introducing commit does not contain this exact adoption record');
  } else {
    kind = 'verified-work-sha';
    const sha = footer.match(/Shipped at HEAD\s+`?([0-9a-f]{7,40})`?(?=\s|[.,]|$)/i)?.[1];
    assert(sha, 'seed footer lacks a verified-work SHA or precise bootstrap introduction reference');
    reference = git('rev-parse', '--verify', `${sha}^{commit}`);
    // A later documentary correction may cite an existing scaffold introduction.
    // Existence, ancestry and the actual scaffold tree establish that evidence.
  }
  assert.match(reference, /^[0-9a-f]{40}$/);
  git('merge-base', '--is-ancestor', reference, 'HEAD');
  const required = ['AGENTS.md', 'CLAUDE.md',
    ...['CONVENTIONS.md', 'INDEX.md', 'adr/0000-template.md', 'plan/README.md'].map((path) => rel(join(artefacts, path))),
    seed];
  const stableScaffold = required.filter((path) => path !== seed && path !== rel(join(artefacts, 'INDEX.md')));
  for (const path of ['.docflow', 'tools/verify.mjs',
    rel(join(artefacts, '_agent/ROLES.md')), rel(join(artefacts, '_agent/prompts/autonomous.md'))]) {
    if (existsSync(join(repo, path)) && statSync(join(repo, path)).isFile()) {
      required.push(path); stableScaffold.push(path);
    }
  }
  for (const path of required) {
    assert(git('show', `${reference}:${path}`).trim(), `reference has no scaffold content: ${path}`);
  }
  for (const path of stableScaffold) {
    const current = readFileSync(join(repo, path), 'utf8').replaceAll('\r\n', '\n').trim();
    assert.equal(git('show', `${reference}:${path}`).replaceAll('\r\n', '\n'), current, `reference predates the verified scaffold content: ${path}`);
  }
  assert.match(git('show', `${reference}:${seed}`), /^status: Implemented$/m, 'reference does not contain an Implemented seed');
  assert(git('show', `${reference}:${rel(join(artefacts, 'INDEX.md'))}`).includes(seedNames[0]), 'reference INDEX lacks seed row');
  if (signed) assert.equal(git('show', '-s', '--format=%G?', reference), 'G', 'reference signature is not verified');
  return { passed: true, kind, done, seed, reference, signature_required: signed };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const [repo, ...args] = process.argv.slice(2);
    assert(repo, 'usage: check-seed-completion.mjs <repo> [--root <path>] [--signed]');
    const rootAt = args.indexOf('--root');
    const result = checkSeedCompletion(repo, { root: rootAt < 0 ? '.' : args[rootAt + 1], signed: args.includes('--signed') });
    console.log(JSON.stringify(result));
  } catch (error) {
    console.log(JSON.stringify({ passed: false, error: error.message }));
    process.exitCode = 1;
  }
}
