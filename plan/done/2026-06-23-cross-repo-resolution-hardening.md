# 0026 — Cross-repo resolution hardening

Owning ADRs: adr/0021-cross-repo-identity-numbering.md,
adr/0022-cross-repo-reference-scheme.md, adr/0028-cross-repo-audit.md

## Scope

Operationalise cross-repo reference resolution so the "resolves through
the member index / survives a repo move / detects collisions" promises are
executable, not asserted (assessment PARTIALs). No new frontmatter field.

- **Resolution path.** In `CONVENTIONS.md §Federation` and `new-adr`,
  define cross-repo resolution explicitly:
  `repo-id → member-index Pointer (repo root) → adr/NNNN-*.md`.
- **audit check 12 — identity collisions (0028 AC3):** rewrite as "flag a
  **duplicate `repo-id`** across `federation-index.md` rows / back-pointers"
  (the only reachable collision under the repo-prefixed scheme).
- **audit check 12 — dangling references (0028 AC4):** apply the
  resolution path before the existence check.
- **Soften 0021 AC2 wording** to "uniquely addressable by composing
  repo-id + local number" (identity stays derived, not stored).

Corrections to already-Implemented ADRs: append a Revision History row to
each of 0021/0022/0028 citing the assessment; status stays Implemented.

## Exit criteria

1. CONVENTIONS §Federation + new-adr state the full resolution path
   (repo-id → pointer → adr/NNNN). → 0022 AC1/AC4
2. audit collision check targets duplicate repo-id. → 0028 AC3
3. audit dangling-ref check resolves via the index then checks existence.
   → 0028 AC4
4. 0021 AC2 wording reflects derived-by-composition addressing. → 0021 AC2
5. Revision History rows on 0021/0022/0028. → audit-trail policy
6. `node scripts/verify.mjs` stays green.

## Dependencies

Builds on the shipped identity (0018) and references (0019 plan) work and
the member index. Independent of plan 0025.

---

Shipped at HEAD `dd79d06` on 2026-06-23. Resolution path
`repo-id → Pointer → adr/NNNN-*.md` operationalised in CONVENTIONS
§Federation + new-adr; audit check 12 collision/dangling checks made
executable; 0021 AC2 clarified. ADRs 0021/0022/0028 stay Implemented
(corrections, Revision History r4 each). Structural verification only.
