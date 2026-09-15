# Receipt guidance repair and separate candidate

Native plan: `plan/todo/0065-external-receipt-guidance-and-native-return.md`.
Controller `msg_bd7a220b5585` approved the reviewed three-file change after the
original failed returns were preserved. Signed source
`eed722c8398b1e85d14ed57fa6dc53d5f5655bd0` changes only the coordinate skill,
workspace asset README and Claude Code guide. Schema, validator, templates and
development version 0.9.4 are unchanged.

The shared procedure separates pre-dispatch readiness from assigned attempts,
external context from the strict canonical payload, and shape checks from
source resolution, authority and observed execution. It requires actual clock
observations and contained native file references rather than substituted
timestamps or repository directories.

## Candidate and checks

`package-receipt-guidance-freeze.json` records 338 raw Git blob files and all
13 skills in a new dedicated export, with plugin digest
`9b49cc10332241883806a02a4d775d8ddb8581c1cc7fb4490e6c742be5b2dec2`.
The original f47 package/export and its Cowork/scenario installations remain
immutable. Earlier receipts are not evidence for the changed guidance.

The repair gate returned `verify: OK (version 0.9.4, 13 skills, 56 ADRs, 67 shipped plan items)`
with exit 0. Deterministic evals returned `10 passed, 0 failed, 6 skipped`, exit 0;
the six skipped native cases were not executed by that command.

`documented-receipt-command.json` retains actual execution of the exact README
command, its complete stdout/stderr and exits: 0 for a retained shape-valid
original and 1 for a synthetic invalid payload. All checked inputs remained
unchanged. The valid original still has its previously reported native-path
defects; a shape pass neither repairs it nor establishes native acceptance.

## Status at a glance

- **This run:** Implemented and separately froze the bounded guidance repair;
  static/eval gates and the exact documented command checks passed as above.
- **Overall:** Partially verified; no fresh native acceptance for the repaired
  candidate has yet been established, and the PR is not integrated or released.
- **Yet to do:** Fresh unamended native external receipt, separate readiness stop,
  two-host reconciliation, independent nonmutation assertions and current-head
  PR checks; combined Clarity handoff and the operator pilot remain separate.
