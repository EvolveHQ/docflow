# 0049 — Release ritual: the thirteenth skill

Owning ADR: adr/0046-release-ritual.md (Accepted 2026-08-04).

## Scope

- **The release skill** (AC1–AC3, AC5): operator-invoked only with
  the trigger-5 refusal stated; release gate first (verify +
  deterministic evals + behavioural suite at the release commit, run
  or operator-confirmed); the promotion movement (operator-chosen
  candidate, decision record on the winner, `main` fast-forward,
  alternatives archived); then one operator confirmation per outward
  step — three-manifest bump, tag, push, npm publish (one-shot
  userconfig, credentials never stored), GitHub release with
  reviewed notes; clean partial-ritual stop; worklog/snapshot
  records.
- **Version-sync** (AC4): already gate-enforced; the ritual works
  inside it.
- **Corpus** (AC6): release utterances route to `release`, disjoint
  from `ship-item`. **Ships alone.**
- **Docs**: README + USAGE skill rows.

## Exit criteria

1. AC1–AC6 evidenced per their `Verify:` methods. → review
2. Eval changes ship alone. → gate-check
3. No release runs — the ritual ships dormant; 1.0 waits on the
   operator's explicit instruction. → review

## Dependencies

adr/0043-candidate-branch-development.md and
adr/0044-graded-autonomy.md Implemented (both are).

---

**Shipped at HEAD `64bbb01`** (chain 5bbb648 propose → 5642db4 accept
→ d348e5f implement → 64bbb01 evals (alone) + this ship commit).
Owning ADR Implemented on six bound evidence records (3 command,
1 gate-check, the eval suite, 1 manual attested; all attended). The
ritual is dormant by design: 1.0 is one /release invocation away,
on the operator's explicit instruction only.
