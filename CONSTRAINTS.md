# Constraints

The inviolable boundaries of this repo — load in full before any task.
Format and change discipline: `CONVENTIONS.md` §Constraints. Every
transition (creation, revision, removal) requires a human-accepted ADR.

## CON-1 r1 — ADR privacy

- source: chosen
- state: Active
- authorised-by: adr/0004-adr-privacy.md
- statement: ADR numbers, ADR titles, and the existence of the ADR
  catalogue never appear in any user-visible surface — skill bodies,
  scaffold templates, README/USAGE, docs site.
- check: gate (ADR-privacy leak scan); audit check 9.

## CON-2 r1 — Work-in-progress stays out of the catalogue

- source: chosen
- state: Active
- authorised-by: adr/0018-wip-stays-out-of-catalogue.md
- statement: The first persisted ADR status is Proposed — no Draft
  state, no drafts/brainstorming folders in the catalogue; unwritten
  work lives in conversation until approved.
- check: audit checks 4–5 (section/status validity); review.

## CON-3 r1 — Version-sync invariant

- source: chosen
- state: Active
- authorised-by: adr/0015-multi-target-portability.md
- statement: The version in package.json, the Claude plugin manifest,
  and the Codex plugin manifest always match; the git tag vX.Y.Z and
  the published npm version track the same number.
- check: gate (manifest version sync).

## CON-4 r1 — Gate integrity

- source: chosen
- state: Active
- authorised-by: adr/0036-enumerated-constraints.md
- statement: No commit changes a gate's behaviour and the files that
  gate judges together; a weakening change always ships alone with the
  reason stated (sanctioned exceptions: tighten-and-repair,
  comment-only — named in the commit message).
- check: commit review; attested per slice (manual evidence).

## CON-5 r1 — Multi-target parity

- source: chosen
- state: Active
- authorised-by: adr/0015-multi-target-portability.md
- statement: Every change to a skill, template, or the skill set keeps
  all five targets working from the one skill source; skill prose
  stays agent-neutral, with agent-specific invocation forms confined
  to README.
- check: gate (agent-neutral body scan); per-release target
  verification.

## CON-6 r1 — Language mandate

- source: chosen
- state: Active
- authorised-by: adr/0036-enumerated-constraints.md
- statement: en-GB throughout all repo artefacts — organisation,
  behaviour, artefact, catalogue, prioritise — matching README and
  USAGE.
- check: audit check 8 (language spot-check).
