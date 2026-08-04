---
adr: 0046
title: Release ritual — promotion and publication as one gated skill
status: Proposed
date: 2026-08-04
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0015", "0043", "0044"]
serves: ["G-one-zero"]
tags: [workflow, release, promotion, skill]
---

# ADR 0046 — Release ritual — promotion and publication as one gated skill

## Context

The 0.9.4 release ran as a manual ritual — three-manifest bump,
verify, tag, push, npm publish through a one-shot userconfig, GitHub
release — held together by a transcript and a snapshot note saying
"write the skill from this next release". Since then the surface
around a release has grown: `main` is now the released line that
advances only by **promoting** one candidate, the behavioural eval
suite is the recorded release gate, and outward-facing commitments
are an always-binding escalation trigger in the autonomy ladder.
The next release has to compose all of that correctly, once, under
operator control at every outward step — which is exactly what a
skill is for.

One honest note on the skill count: the twelve-skill set was settled
as the *writer and interrogation* surface — a writer for every class
the router emits. Release is not a writer; it is an operational
ritual, and this decision consciously extends the set to thirteen.

## Capability statement

**`release` is the thirteenth skill, and the most gated.** It is
**operator-invoked only**: an outward-facing commitment is escalation
trigger 5, binding at **every** autonomy level, so the skill refuses
unattended invocation outright — there is no autonomy grant that
covers it.

**The release gate runs first, before anything outward:** the verify
gate green, the deterministic evals green, and the **behavioural
suite green at the release commit** — run now or explicitly
confirmed by the operator as run at this commit. A red or unconfirmed
gate ends the ritual.

**Promotion is the first movement** (when releasing from a candidate
branch): the operator names the winning candidate; a **promotion
decision record** on that candidate documents what was compared and
why; `main` fast-forwards to it; alternative candidates are archived
unmerged. Releasing from an already-promoted `main` skips this
movement.

**Then the ritual, one operator confirmation per outward step:**

1. **Version bump** — the three manifests (`package.json`, both
   plugin manifests) move to the same number in one commit; the
   version-sync gate holds it.
2. **Tag** — `vX.Y.Z` on `main`, matching the manifests.
3. **Push** — `main` and the tag.
4. **npm publish** — operator-held credentials (the one-shot
   userconfig pattern); never stored by the skill.
5. **GitHub release** — notes generated from the shipped plan items
   since the last tag, operator-reviewed before posting.

The skill never proceeds past a declined confirmation; a partial
ritual stops cleanly and reports exactly which steps completed.
Records close the ritual: worklog row, snapshot update, and the
release named in the plan queue where an item owns it.

## User stories / scenarios

- As the operator, I want promotion and publication to be one guided
  ritual with a confirmation per outward step, so releasing 1.0 is a
  sequence of decisions I hold rather than a transcript I replay.
- As the operator, I want the behavioural suite's state at the
  release commit to be a hard precondition, so the recorded release
  gate is enforced by the ritual itself.
- As a future maintainer, I want the promotion decision recorded on
  the winning candidate, so why this line won is history, not
  memory.
- As the keeper of the autonomy ladder, I want the release skill to
  refuse unattended use at any level, so trigger 5 is structural,
  not aspirational.

## Acceptance criteria

1. `release` is the thirteenth skill, operator-invoked only: it
   refuses unattended invocation at every autonomy level, naming the
   outward-facing escalation trigger as the reason.
   Verify: node -e "const f=require('fs'); const s='plugins/docflow/skills/release/SKILL.md'; process.exit(f.existsSync(s) && /escalation/.test(f.readFileSync(s,'utf8')) && /unattended/.test(f.readFileSync(s,'utf8')) ? 0 : 1)"
2. The release gate precedes anything outward: verify green,
   deterministic evals green, and the behavioural suite green at the
   release commit (run or operator-confirmed); a red or unconfirmed
   gate ends the ritual.
   Verify: node -e "const s=require('fs').readFileSync('plugins/docflow/skills/release/SKILL.md','utf8'); process.exit(s.includes('behavioural') && s.includes('verify') ? 0 : 1)"
3. Promotion is a recorded operator decision: the ritual
   fast-forwards `main` to the operator-chosen candidate only after
   a promotion decision record on that candidate documents the
   comparison; alternatives are archived unmerged.
   Verify: node -e "const s=require('fs').readFileSync('plugins/docflow/skills/release/SKILL.md','utf8'); process.exit(s.includes('promotion') && s.includes('fast-forward') ? 0 : 1)"
4. The three manifests bump to the same number in one commit, and
   the tag and published version track it — the version-sync
   invariant holds through the ritual.
   Verify: gate-check
5. Every outward action — push, tag, npm publish, GitHub release —
   is individually operator-confirmed; the skill never proceeds past
   a declined confirmation and reports a partial ritual exactly.
   Verify: manual
6. The corpus routes release utterances ("release 1.0", "publish the
   plugin", "promote the candidate") to `release`, disjoint from
   `ship-item` (which completes queue items, not releases).
   Verify: npm run evals

## Out of scope

- **Running the 1.0 release** — this decision builds the ritual; the
  release itself happens only on the operator's explicit instruction.
- **Release cadence or versioning policy** — when to release and
  what number it gets stay operator judgement.
- **Changelog automation beyond the release notes draft** — the
  notes are drafted from shipped plan items and operator-reviewed;
  nothing more.

## Open questions

- None.

## References

- adr/0015-multi-target-portability.md
- adr/0043-candidate-branch-development.md
- adr/0044-graded-autonomy.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-08-04 | r1 | Eugenio Minardi | Initial draft (Proposed): the 0.9.4 manual ritual becomes the thirteenth skill, composed with promotion (candidate-branch model), the behavioural release gate, and trigger-5 refusal of unattended use. Skill count consciously extended past the twelve-writer set. |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
