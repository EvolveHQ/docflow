# 0046 — Return to main: record the development line

Owning ADR: adr/0044-development-returns-to-main.md

## Scope

Record on `main` that development continues here and that the candidate
branches are archived unmerged; keep today's ADR and plan numbers; no
conventions change, since `CONVENTIONS.md` and `AGENTS.md` on `main`
already describe direct-to-main development.

## Exit criteria

Maps to adr/0044-development-returns-to-main.md acceptance criteria:

1. `main` advances fast-forward only with the gate green. → AC1
2. Conventions on `main` describe direct-to-main, no candidate model. → AC2
3. Candidate branches untouched and unmerged. → AC3
4. No commit cherry-picked or merged from a candidate. → AC4
5. Releases remain explicit tagged events. → AC5

---

Shipped at HEAD `acd3eed` on 2026-09-04. The recording commit is the
completion event; the decision was in force from the operator's choice.
