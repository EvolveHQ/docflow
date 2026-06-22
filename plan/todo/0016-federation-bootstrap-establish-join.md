# 0016 — Federation bootstrap: establish vs join

Owning ADR: adr/0020-federation-bootstrap-establish-join.md

## Scope

Add the establish-vs-join branch to the bootstrap assessment so per-repo
bootstrap never corrupts the federation or writes across repos.

- Ask "is this repo part of a product that spans multiple repos?"; "no"
  leaves single-repo behaviour unchanged.
- On "yes", ask **establish** vs **join**.
- **Establish**: prompt the topology (0015), mark this repo as home where
  applicable, create the member index.
- **Join**: prompt for the home/federation pointer, write **only** this
  repo's back-pointer config, perform no writes to any other repo, and do
  not re-ask the topology.
- Validate the home pointer by **operator confirmation** only (no
  cross-repo read, no org/host API call).

## Exit criteria

Maps to adr/0020-federation-bootstrap-establish-join.md acceptance
criteria:

1. "Spans multiple repos?" asked; "no" keeps single-repo behaviour. → AC1
2. "Yes" prompts establish vs join. → AC2
3. Establish prompts topology, marks home, creates the member index. → AC3
4. Join writes a back-pointer in this repo only; no other-repo writes.
   → AC4
5. Join does not re-ask the topology; reads the recorded one. → AC5
6. Home pointer validated by operator confirmation; no API call. → AC6
7. `node scripts/verify.mjs` stays green.

## Dependencies

Depends on 0015 (topology must exist to record and to choose at
establish). Establish creates the artefact that 0017 formalises.
