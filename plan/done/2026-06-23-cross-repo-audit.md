# 0021 — Cross-repo audit

Owning ADR: adr/0028-cross-repo-audit.md

## Scope

Extend the audit skill with federation-aware checks, run from the home
repo, reaching siblings via the local checkouts named in the member index.

- **Bidirectional membership:** flag any member in the index with no
  back-pointer home, and any repo whose back-pointer names this home but
  is missing from the index.
- **Identity collisions:** flag two ADRs that resolve to the same
  federation identity.
- **Dangling cross-repo references:** flag a cross-repo link whose target
  ADR does not exist (the active detection deferred from the reference
  scheme).
- **Roll-up drift:** flag the roll-up out of sync with member `INDEX.md`
  metadata.
- **Tolerant reach:** a member not checked out locally is reported as
  "unverified this run", never silently passed, never a hard failure.

## Exit criteria

Maps to adr/0028-cross-repo-audit.md acceptance criteria:

1. Member in index without a back-pointer home → flagged. → AC1
2. Back-pointer to this home not listed in index → flagged. → AC2
3. Cross-repo identity collision → detected. → AC3
4. Dangling cross-repo reference → detected. → AC4
5. Roll-up drift vs member `INDEX.md` → detected. → AC5
6. Reaches siblings via local checkouts, tolerant; unavailable members
   reported "unverified this run". → AC6
7. `node scripts/verify.mjs` stays green.

## Dependencies

Depends on the shipped reference scheme (0019), member index (federation
config), and roll-up (0020). Closes the deferred unreachable-reference
detection noted in adr/0022-cross-repo-reference-scheme.md.

---

Shipped at HEAD `5884a5f` on 2026-06-23. audit check 12 adds the cross-repo
federation checks (bidirectional membership, identity collisions, dangling
cross-repo references, roll-up drift) with tolerant reach via local
checkouts. ADR 0028 → Implemented; verify green. Structural verification
only — no member repos in this dogfood repo to exercise it end-to-end.
