# 0044 — Pilot findings, wave 1: contract and skill refinements

Owning ADRs: adr/0034-record-contract.md,
adr/0035-per-criterion-evidence.md, adr/0036-enumerated-constraints.md,
adr/0031-tiered-assessment-depth.md (F4 — revision-gated),
adr/0013-interactive-assessment-protocol.md,
adr/0039-record-model-choice.md, adr/0040-challenge-and-router.md —
each fix implements or clarifies an existing decision; no new
capability. F4 and F11 need small operator decisions before their fix
lands.

Source: the clarity pilot retrofit (external, 2026-07-31; 14 findings
relayed by the operator). F1 (pilot-brief record-model error) was
docflow's own record defect — already corrected in the snapshot and
analysis doc, not part of this item.

## Scope — the thirteen findings, triaged

**Mechanical (no decision needed):**

- **F2 — locale-invariant keys.** Declare in the conventions template
  (§Verification Evidence, §Constraints) and methodology §4 that field
  keys (`authorised-by:`, `retired-from:`, …) are machine identifiers,
  locale-invariant regardless of the repo's language mandate; prose
  localises, keys never.
- **F3 — layer enabling includes its conventions section.** Bootstrap
  re-run contract: "leave everything else untouched" amended — enabling
  a layer writes that layer's conventions section (and §Trust Posture +
  §Verification Evidence arrive together with evidence adoption, since
  the latter cross-references the former; pre-pilot repos have
  neither).
- **F5 — re-run offers to record `Assessment depth:`** when the repo
  predates it.
- **F6 — pre-approved handoff.** new-adr → new-plan (and analogous
  chains): when the operator already approved the item's exact scope at
  an earlier gate, the receiving skill takes a fast path — no second
  full assessment.
- **F7 — mode 3 + direct-to-main is legitimate with guardrails.**
  Bootstrap cross-check softened: admit the combination when G1–G4 are
  recorded, instead of near-forbidding it.
- **F8 — todo naming is a recorded convention.** `NNNN-<slug>` is the
  default, not the only form; skills follow the repo's recorded
  scheme (clarity uses `<YYYY-MM-DD>-<slug>`); bootstrap layout says
  "default".
- **F9 — audit reads the repo's template for section names**, not a
  hardcoded list (clarity false-positive on "References /
  cross-links").
- **F10 — never derive shape from number alone**; recorded exceptions
  exist (clarity's 0001 is technology-shaped in the capability range).
  Audit/skill prose caveat.
- **F12 — self-referential adoption documented.** §Verification
  Evidence: the adopting ADR's own evidence runs at the implementation
  HEAD, not the adoption commit — legal under the temporal rules;
  state it.
- **F13 — time-bound criteria warning.** new-adr, new-spec, and the
  challenge rubric warn against criteria whose truth is momentary
  ("directory is empty") — permanently false on every future HEAD
  re-run; criteria must be durably true or scoped to a commit.
- **F14 — challenge Mode B multi-select.** A category may surface
  several boundaries at once; codify the multi-select posture.

**Decision-gated — both DECIDED by the operator, 2026-07-31:**

- **F4 — depth-selector skip exception: ACCEPTED.** One narrow
  exception to "the selector always appears" — when the invocation
  pre-answers every tier-differentiated question, the skill skips the
  selector and says so in one line; no recorded depth is applied.
  Lands as a revision row on the owning ADR. Side effect: the edit is
  the ADR's first post-adoption change, so its criteria gain
  `Verify:` methods and bound evidence — the first live instance of
  the re-evidencing rule firing on a pre-adoption record.
- **F11 — attended-ship verifier: ACCEPTED as `gate@ship-item
  (attended)`.** The verifier names the executor role; the attended
  marker makes operator-supervised runs visible to the audit. Defined
  in §Verification Evidence (own + template), supported by the
  executor (`attended` flag), named in the ship skill.

## Exit criteria

1. F2, F3, F5–F10, F12–F14 landed across bootstrap/new-adr/new-plan/
   new-spec/challenge/audit skill prose, the conventions template,
   own CONVENTIONS where applicable, and methodology §4 — each fix
   traceable to its finding number in the commit messages. → review
2. F4 and F11 decided by the operator; accepted ones landed (F4 as a
   revision row on its owning ADR), declined ones recorded with
   reasons. → review
3. Gate and evals stay green throughout; any gate-judging change ships
   in its own commit per gate integrity. → gate-check
4. The pilot-findings disposition (all 14, incl. F1's correction) is
   recorded in the analysis doc's ledger. → review

## Dependencies

None — all Phase-1 machinery shipped. Independent of the two remaining
pilot-gate criteria (which run in clarity, not here).

---

**Shipped at HEAD `d1922d1`** (chain 9e3a71c → 9dc1510 → d1922d1 +
this ship commit). All thirteen queued findings landed; F4 and F11
operator-accepted 2026-07-31. Owning-record side effect: the
tiered-depth record entered evidence scope on its first post-adoption
edit — seven criteria gained `Verify:` methods and bound evidence
(5 manual batch-attested by the operator, 2 command, attended). Gate
and deterministic evals green throughout; no gate behaviour changed.
