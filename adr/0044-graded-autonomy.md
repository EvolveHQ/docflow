---
adr: 0044
title: Graded autonomy — the L0–L5 ladder in the manifest
status: Accepted
date: 2026-08-04
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0034", "0036", "0041", "0042"]
serves: ["G-aligned-autonomy"]
tags: [workflow, autonomy, governance, manifest]
---

# ADR 0044 — Graded autonomy — the L0–L5 ladder in the manifest

## Context

Every tier built so far exists to let an agent act without asking:
constraints bound what must never happen, evidence proves what was
done, goals record why, verdicts close the loop. What is still
unrecorded is **how much** an agent may do unattended — today that
lives in each session's instructions, invisible to the audit and
different every time. The capability manifest has carried a reserved
`autonomy` field since the record contract (adr/0034-record-contract.md)
precisely for this decision; this decision fills it. The grade is a
**repo setting, recorded and auditable** — not a per-session vibe.

Trust posture is unchanged: the recorded level is a **cooperative
boundary** — skills honour it and the audit checks it; it
authenticates nobody. A repo needing enforcement applies the hosting
recipe.

## Capability statement

**The manifest `autonomy:` field is legal** with values `L0`–`L5`;
its reservation is lifted by this decision. **Absent means no
unattended grant is recorded** — attended, operator-gated work (the
mode every skill runs today) is unaffected at any level; the ladder
governs what an agent may initiate **unattended**.

**The ladder:**

| Level | An agent may, unattended… | Prerequisite |
|---|---|---|
| **L0** | read and propose only | — |
| **L1** | author records (decision drafts, specs, plan items) | conventions installed |
| **L2** | implement a **named** queued plan item | a verify gate exists |
| **L3** | pick the next item from `plan/todo/` itself | plan queue + gate |
| **L4** | specify + queue + implement from an **agreed AC-bearing record** (spec or capability ADR, per the record model) | constraints layer written |
| **L5** | propose decisions and run agent waves within a budget | full stack (goals incl.) + audit on a cadence |

Each level includes those below it. Prerequisites are conformance:
a recorded level whose prerequisite is absent is an audit finding.

**Eight escalation triggers bind at every level** — this list *is*
the boundary; everything not on it is delegated:

1. changing or adding a **constraint**;
2. changing or retiring a **goal**;
3. **accepting** a decision record (drafting is fine);
4. **superseding** a decision record;
5. any **outward-facing commitment** — publishing, releasing,
   joining a federation;
6. changing a **gate**;
7. work with **no traceable parent** (goal, spec, or decision);
8. a **conflict between two constraints** — only a human arbitrates.

**Manual-evidence restriction at L3+**: an agent authoring
acceptance criteria unattended must give each an **executable**
`Verify:` method (a command or `gate-check`); introducing a `manual`
method is itself an escalation — a manual method needs a human at
ship anyway, so creating one unattended only manufactures
unattestable debt. Existing manual criteria are untouched, and the
standing rule stands: an unattended run never invents attestations;
unevidenced records hold below Implemented.

**Bootstrap records the level**: a full-depth question (recommended
default **L2** — implement only what a human named); express and
guided take the default silently. Cross-checks at sign-off: L2+
without a real verify gate, and L4+ without the constraints layer,
are contradictions to resolve, not to write. **This repo records
`L3`** — matching its actual unattended practice (the autonomous
prompt picks the next queued item and implements under the gate),
no more.

**The audit reports autonomy state**: the recorded level, absent
prerequisites, and any unattended activity signature beyond the
recorded grant it can detect — reported, never gated.

## User stories / scenarios

- As an operator, I want the unattended grant written in the
  manifest, so what an agent may initiate is a recorded repo fact
  the audit can check — not a per-session memory.
- As a coding agent starting unattended work, I want one field to
  read and eight triggers to obey, so "must I stop and ask?" has a
  recorded answer.
- As an operator of a cautious repo, I want L0/L1 to be real
  settings, so adopting the conventions does not imply licensing
  unattended implementation.
- As the operator of this repo, I want the recorded level to match
  actual practice (L3), so the dogfood claim is honest.

## Acceptance criteria

1. The manifest accepts `autonomy: L0`–`L5` and rejects any other
   value; an absent field records no unattended grant and changes
   nothing about attended operation.
   Verify: gate-check
2. The conventions record the six-level ladder with each level's
   scope and prerequisite, and the eight escalation triggers that
   bind at every level.
   Verify: node -e "const c=require('fs').readFileSync('CONVENTIONS.md','utf8'); process.exit(c.includes('L0') && c.includes('L5') && c.includes('escalation') ? 0 : 1)"
3. The autonomous-run entry point honours the ladder: the scaffold's
   autonomous prompt template names the recorded level's scope and
   the escalation triggers.
   Verify: node -e "const t=require('fs').readFileSync('plugins/docflow/skills/bootstrap/templates/_agent-prompts-autonomous.md','utf8'); process.exit(/escalat/i.test(t) && t.includes('autonomy') ? 0 : 1)"
4. Bootstrap asks the autonomy level at full depth (default L2;
   express/guided take the default), writes it to the manifest, and
   cross-checks prerequisites at sign-off (L2+ needs a gate; L4+
   needs the constraints layer).
   Verify: node -e "const b=require('fs').readFileSync('plugins/docflow/skills/bootstrap/SKILL.md','utf8'); process.exit(b.includes('autonomy') && b.includes('L2') ? 0 : 1)"
5. The authoring skills state the L3+ manual-evidence restriction:
   unattended-authored criteria carry executable methods; a `manual`
   method is an escalation.
   Verify: node -e "const f=require('fs'); const ok=(p)=>{const s=f.readFileSync(p,'utf8'); return s.includes('escalation') && s.includes('manual')}; process.exit(ok('plugins/docflow/skills/new-adr/SKILL.md') && ok('plugins/docflow/skills/new-spec/SKILL.md') ? 0 : 1)"
6. This repo's manifest records `autonomy: L3`.
   Verify: node -e "process.exit(/^autonomy: L3$/m.test(require('fs').readFileSync('docflow.yml','utf8')) ? 0 : 1)"
7. The audit reports autonomy state — recorded level, missing
   prerequisites, N/A without the field — reported, never gated.
   Verify: manual

## Out of scope

- **Enforcement** — the level is cooperative (trust posture); host
  controls are the hardening path, unchanged.
- **Per-agent levels** — one grant per repo; differentiated grants
  for named agents would be a future decision.
- **L5 budget mechanics** — how a wave budget is set and metered is
  decided when a repo first records L5; none does yet.
- **Automatic level changes** — the level moves only by an
  operator's edit; no skill raises or lowers it.

## Open questions

- None.

## References

- adr/0034-record-contract.md
- adr/0036-enumerated-constraints.md
- adr/0041-goals-layer.md
- adr/0042-validation-loop.md

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-08-04 | r1 | Eugenio Minardi | Initial draft (Proposed), to the four operator decisions taken this session: ladder adopted as designed (L4 generalised to "agreed AC-bearing record"); bootstrap default L2; this repo L3; the L3+ manual-evidence authoring restriction adopted. |
| 2026-08-04 | r2 | Eugenio Minardi | Status Proposed → Accepted by the operator; implementation authorised (plan 0047). |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-08-04 | — |
