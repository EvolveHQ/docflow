# 0043 — Challenge skill + brainstorm router

Owning ADR: adr/0040-challenge-and-router.md

## Scope

The convergent mode (programme slice S5 — the last before the pilot
gate):

1. **`challenge`** (eleventh skill): advisory, writes nothing, two
   modes — elicit-from-human (inline category checklist: licence/IP,
   privacy+data, cost, latency, vendor, security, compliance,
   operational; boundaries routed to the decision-gated constraint
   path) and critique-a-draft (rubric: testable criteria + methods,
   real alternatives, one decision, boundary scan). The "solid —
   nothing to add" outcome is normative. Depth-tiered assessment per
   the shared protocol.
2. **Brainstorm rework**: candidates classified with the routing
   phrasing (choice / behaviour / rule / boundary / job); routed on
   approval to the writers that exist per record model; absent classes
   surfaced as future routes; intake constraint-probing answers routed,
   not discarded.
3. **Disjointness**: challenge/brainstorm/audit demarcation stated in
   all three descriptions.
4. **Corpus (evals, own commit)**: labelled utterance corpus
   (`evals/trigger-corpus.json`) incl. abstain cases for the
   not-yet-existing validate; deterministic case validates the corpus;
   behavioural case routes every utterance and reports collisions and
   abstentions.
5. **Ship**: challenge's first recorded run critiques ADR 0040's own
   draft (findings in this file's footer); evidence AC1–AC8; plan mv;
   ADR → Implemented; INDEX; WORKLOG; snapshot.

Out of scope: goal routes (S6), creative checklist (blocked on the
creative-surface dogfood), any gating power, the validate skill.

## Exit criteria

Maps to adr/0040-challenge-and-router.md acceptance criteria:

1. Skill exists, advisory, "solid" clause normative. → AC1
2. Checklist inline; boundaries routed, never written. → AC2
3. Rubric consistent with the authoring skills' gates. → AC3
4. Brainstorm classifies + routes per model; future routes named. → AC4
5. Demarcation on all three descriptions. → AC5
6. Corpus + eval cases (`npm run evals` green). → AC6
7. First run critiques this ADR; findings recorded here. → AC7
8. Evidence at ship. → AC8

When this ships, ADR 0040 advances Accepted → Implemented and
**Phase 1 (S0–S5) is complete — the programme parks at the pilot
gate.**

## Dependencies

Slices S0–S4 (all shipped). The pilot candidate gates what follows,
not this item.

---

Shipped at HEAD `8ed6217` on 2026-07-29, two implementation commits +
ship: `010aaa9` challenge skill (advisory interrogator, two modes,
inline checklist, rubric, 'solid' clause) + brainstorm router
(classify + route per model, future routes, intake answers kept) +
three-way demarcation; `8ed6217` trigger corpus alone (30 labelled
utterances incl. abstains; 19/19 deterministic).

**AC7 — first challenge run, against ADR 0040 itself (critique mode):**
three findings, no blockers: (1) bundles skill + router — noted, not
blocking (one trigger surface, router meaningless without the classes;
layered-model precedent); (2) Context argues for the design without
naming the rejected per-category-brainstorm alternative (9→17 skills,
classification-precedes-decomposition inversion); (3) AC6's method
verifies the deterministic half — the behavioural routing case runs at
the release gate/pilot. Boundary scan CON-1/4/5/6: no violations.

Eight evidence records — six operator-attested (batch), one command
transcript (npm run evals, exit 0), one gate-checked. ADR 0040 →
Implemented (r3). AC1–AC8 met. **Phase 1 (S0–S5) complete — the
programme parks at the pilot gate.**
