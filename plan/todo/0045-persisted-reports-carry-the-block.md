# 0045 — Persisted reports carry the block: PR bodies, wave summaries, stop entries

Owning ADR: adr/0043-persisted-reports-carry-status-at-a-glance.md

## Scope

1. **Run prompt template, PR variant.** The integrate step writes the
   PR body from the run's report (`gh pr create --draft --body-file`
   or equivalent), ending with the block; `gh pr ready` only when the
   block is present. Direct-to-main variant unchanged.
2. **agent-wave.** The spawn brief requires the block from each
   subagent's final report; Step 4 returns one block per item plus one
   wave-level block; checkpoint mode presents that summary; continuous
   mode includes it in the run's report.
3. **Stop entries.** The Stopped field of the plan-item Status section
   (plan 0041) uses the three labels; `templates/plan-README.md` and
   this repo's `plan/README.md` document the shape; the run prompt's
   stop path writes it that way.
4. **Audit.** In PR-based repos with a reachable host: open PRs from
   claim branches lacking the block are flagged as drift; host
   unreachable reports "unverifiable", never PASS. Any repo with
   `plan/`: a Stopped entry without the three labels is flagged.
5. **Docs.** `USAGE.md` (agent-wave, PR-based integration, stop
   entries), `docs/methodology.md`.

Out of scope:
- The convention text (plan 0043) and the skills' chat reports (plan
  0044).
- Squash-merge commit bodies (host behaviour).

## Exit criteria

Maps to adr/0043-persisted-reports-carry-status-at-a-glance.md
acceptance criteria:

1. PR body written from the report, ending with the block; ready only
   when present. → AC1
2. agent-wave brief requires the block; per-item plus wave-level
   summary; checkpoint presents it. → AC2
3. Stopped field carries the three labels; plan READMEs document it.
   → AC3
4. Audit flags PRs and stop entries; "unverifiable" without a host.
   → AC4
5. USAGE and docs updated. → AC5
6. Verify gate green; five-target parity preserved.

When this ships, ADR 0043 advances Accepted → Implemented.

## Dependencies

- Plan 0041 (the Status section this item shapes).
- Plans 0043 and 0044 (the convention and the agent-wave / audit
  closing steps this item extends) — sequential.
