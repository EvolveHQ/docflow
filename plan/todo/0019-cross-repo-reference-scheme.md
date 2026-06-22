# 0019 — Cross-repo reference scheme

Owning ADR: adr/0022-cross-repo-reference-scheme.md

## Scope

Implement cross-repo references as logical ids resolved via the member
index.

- A reference to an ADR in another repo uses the **logical federation
  identity** and resolves through the **member index** (`repo-id →
  location`); same-repo references stay **relative paths**.
- `supersedes:` / `superseded-by:` may point across repos.
- References survive a target repo move (edit one member-index row, not
  the referencing ADRs).
- An uncheckedout target stays well-formed; audit flags it unreachable
  rather than malformed.

## Exit criteria

Maps to adr/0022-cross-repo-reference-scheme.md acceptance criteria:

1. Cross-repo reference uses the logical identity, resolved via the member
   index. → AC1
2. Same-repo references remain relative paths, unchanged. → AC2
3. `supersedes:` / `superseded-by:` may point across repos. → AC3
4. Reference survives target move via a member-index edit, no ADR edits.
   → AC4
5. Uncheckedout target stays well-formed; audit flags unreachable. → AC5
6. `node scripts/verify.mjs` stays green.

## Dependencies

Depends on 0018 (an identity must exist to reference). Dangling-reference
detection is delivered with adr/0028-cross-repo-audit.md, not here.
