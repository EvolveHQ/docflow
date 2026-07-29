// Mutation-fixture layer (ADR 0012, covering the gate checks added by
// the record-contract / evidence / constraints / abandonment work).
//
// Each slice's gate check was mutation-tested by hand at its ship
// (mutate a file → expect verify FAIL → restore → green). This module
// makes those tests repeatable: cut a pristine copy of committed HEAD
// with `git archive`, apply one mutation, run the static gate INSIDE
// THE COPY, and return the result. The live working tree is never
// touched; the copy is removed afterwards.
//
// Note the behavioural caveat applies here too: the fixture is cut
// from HEAD, so mutations exercise the COMMITTED gate + artefacts.

import { execFileSync, spawnSync } from 'node:child_process';
import {
  mkdtempSync, rmSync, readFileSync, writeFileSync, mkdirSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Run `mutate(fix)` against a pristine copy of HEAD, then the gate.
// Returns { status, out }. Always cleans up the copy.
export function gateAfterMutation(repoRoot, mutate) {
  const dir = mkdtempSync(join(tmpdir(), 'docflow-eval-'));
  try {
    const tarPath = join(dir, 'fixture.tar');
    execFileSync('git', ['archive', '--format=tar', '-o', tarPath, 'HEAD'], {
      cwd: repoRoot,
    });
    // Extract with a RELATIVE path and cwd — GNU tar on Windows parses
    // "C:\…" as a remote host ("Cannot connect to C").
    execFileSync('tar', ['-xf', 'fixture.tar'], { cwd: dir });
    rmSync(tarPath);
    const fix = {
      root: dir,
      read: (rel) => readFileSync(join(dir, rel), 'utf8').replace(/\r\n/g, '\n'),
      write: (rel, text) => writeFileSync(join(dir, rel), text),
      replace(rel, from, to) {
        const t = fix.read(rel);
        if (!t.includes(from)) throw new Error(`${rel}: mutation anchor not found: ${from}`);
        fix.write(rel, t.replace(from, to));
      },
      mkdir: (rel) => mkdirSync(join(dir, rel), { recursive: true }),
    };
    mutate(fix);
    const res = spawnSync('node', ['scripts/verify.mjs'], {
      cwd: dir, encoding: 'utf8',
    });
    return { status: res.status, out: `${res.stdout ?? ''}${res.stderr ?? ''}` };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// Assert the gate FAILS after the mutation, with output matching needle.
export function assertGateFails(repoRoot, mutate, needle) {
  const { status, out } = gateAfterMutation(repoRoot, mutate);
  if (status === 0) throw new Error('gate passed but the mutation should FAIL it');
  if (needle && !needle.test(out)) {
    throw new Error(`gate failed but without the expected message ${needle}; got:\n${out.slice(0, 400)}`);
  }
}

// Assert the gate stays GREEN after the mutation (positive cases).
export function assertGateGreen(repoRoot, mutate) {
  const { status, out } = gateAfterMutation(repoRoot, mutate ?? (() => {}));
  if (status !== 0) {
    throw new Error(`gate expected green but failed:\n${out.slice(0, 400)}`);
  }
}
