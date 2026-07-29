# 0039 — Recorded abandonment: Withdrawn, dropped/, supersession fix

Owning ADR: adr/0037-recorded-abandonment.md

## Scope

Implement recorded abandonment (programme slice S3):

1. **Lifecycle.** Own + template CONVENTIONS status table gains
   `Withdrawn` (terminal, from `Proposed` only) and records the
   narrowing: `Proposed` exits only to `Accepted` | `Withdrawn`;
   `Superseded`/`Deprecated` reachable from `Accepted`/`Implemented`.
   Own + template AGENTS lifecycle line updated.
2. **Dropped queue items.** Plan conventions (own + template) and both
   plan READMEs document `plan/dropped/<date>-NNNN-<slug>.md`: number
   kept, `Dropped` footer with date + reason, never deletion.
   Aggregate semantics recorded: dropped plans leave the owning set;
   scope re-queued or dispositioned in the reason.
3. **Supersession fix.** `new-adr` Step 3: `supersedes:` intent
   recorded at proposal; the predecessor flips to `Superseded` only on
   the successor's **Acceptance**; a withdrawn successor leaves it
   untouched. The acceptance walk (Step 7) gains the flip.
4. **Audit.** Status validity + supersession symmetry include
   `Withdrawn`; plan coverage treats `dropped/` as terminal; no plan
   expected for `Withdrawn` ADRs.
5. **Gate (own commit).** `verify.mjs`: `Withdrawn` joins
   VALID_STATUS; `plan/dropped/` files validated (NNNN kept in name,
   footer naming the drop reason).
6. **Ship.** Evidence records for AC1–AC8; plan mv; ADR 0037 →
   Implemented; INDEX; WORKLOG; snapshot.

Out of scope: done/ semantics, Implemented-work archiving,
withdrawn-successor linkage schemes.

## Exit criteria

Maps to adr/0037-recorded-abandonment.md acceptance criteria:

1. Lifecycle + narrowing documented both sides. → AC1
2. INDEX row fidelity holds for `Withdrawn` (gate). → AC2
3. `dropped/` documented with number-keeping + footer. → AC3
4. Aggregate semantics recorded. → AC4
5. `new-adr` supersession-on-Acceptance. → AC5
6. Gate accepts the states, validates dropped files; own commit. → AC6
7. Audit semantics updated. → AC7
8. Evidence written at ship. → AC8

When this ships, ADR 0037 advances Accepted → Implemented.

## Dependencies

Slices S0–S2 (shipped): contract, evidence regime, constraints.
