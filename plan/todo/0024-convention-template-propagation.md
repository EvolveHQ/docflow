# 0024 — Convention and template propagation

Owning ADR: adr/0027-convention-template-propagation.md

## Scope

Codify how shared conventions/templates stay consistent across the
federation: copy-at-bootstrap, audit-detected drift, referenceable not
enforced.

- The **home repo** holds the authoritative shared conventions/templates.
- Members receive them by **copy at bootstrap**; members may keep
  **local-only** conventions that are never overwritten.
- **Drift** between a member's copy and the home source is **detected by
  audit** (the federation checks), not actively pushed.
- Shared rules are **referenceable** from the home; nothing force-pushes
  them into members, and no member's bootstrap writes into another repo.

## Exit criteria

Maps to adr/0027-convention-template-propagation.md acceptance criteria:

1. One authoritative source for shared conventions/templates. → AC1
2. A defined mechanism (copy-at-bootstrap) propagates updates. → AC2
3. Drift is detectable by audit. → AC3
4. Local-only conventions are not overwritten. → AC4
5. No member's bootstrap writes to another repo. → AC5
6. Copy + audit-drift, referenceable not enforced. → AC6
7. `node scripts/verify.mjs` stays green.

## Dependencies

Depends on the federation config/member index and the cross-repo audit
(0021, shipped). Adds a convention-drift dimension to the audit federation
checks if not already covered.
