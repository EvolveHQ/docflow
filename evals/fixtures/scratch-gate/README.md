# scratch-gate fixture

A **runnable verify gate for a freshly scaffolded repo**: `verify.mjs`,
node built-ins only, no dependencies and no network.

The bootstrap behavioural case scaffolds a fresh scratch repo and has to
answer Q8 with a real gate. It cannot answer with this checkout's
`scripts/verify.mjs`: bootstrap does not install that file, so the
scaffolded repo would record a command that exits 1 with
`MODULE_NOT_FOUND` the moment anything ran it — and the autonomous prompt
built on it would be unusable. The case therefore copies this file to
`<scratch>/tools/verify.mjs` **before** invoking bootstrap and records
`node tools/verify.mjs` as the gate.

What it checks, run from a repo root:

- `AGENTS.md`, `CONVENTIONS.md`, `INDEX.md` and `adr/` exist;
- every catalogue ADR (`adr/NNNN-*.md`, `0000-` templates excluded)
  carries `adr:`, `title:` and `status:` in its metadata block;
- `INDEX.md` has a row for each of those numbers.

Exit 0 on a sane bootstrapped tree; exit 1 with one `verify: …` line per
problem. It is deliberately weaker than the real gate — its job is to be
a genuine, runnable gate in the scratch repo, not to re-implement
`scripts/verify.mjs`.

Copied, never mutated in place: a case that needs a different gate writes
its own scratch copy.
