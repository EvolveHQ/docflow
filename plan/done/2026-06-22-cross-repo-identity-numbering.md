# 0018 — Cross-repo identity and numbering

Owning ADR: adr/0021-cross-repo-identity-numbering.md

## Scope

Implement federation-unique ADR identity with a bootstrap-selected scheme.

- At federation establishment, bootstrap asks the **identity scheme**
  (default **repo-prefixed slug** `<repo-id>/NNNN-slug`) and records it in
  the federation config.
- Preserve **per-repo contiguity**: each repo numbers its own ADRs
  contiguously; standalone repos keep global contiguity.
- Relax the numbering convention text accordingly (federated vs standalone).
- Home/product-wide ADRs use the same scheme as member-local ADRs.

## Exit criteria

Maps to adr/0021-cross-repo-identity-numbering.md acceptance criteria:

1. Each repo's ADRs remain locally contiguous. → AC1
2. Every ADR is uniquely addressable across the federation. → AC2
3. Two repos minting the same local number do not collide. → AC3
4. Numbering convention states per-repo contiguity for federated repos;
   standalone keeps global contiguity. → AC4
5. Home/product-wide ADRs follow the same scheme. → AC5
6. Identity scheme selected at bootstrap establishment, recorded in the
   federation config, default repo-prefixed slug. → AC6
7. `node scripts/verify.mjs` stays green.

## Dependencies

Depends on the shipped foundation (topology, establish flow, federation
config + member index). Gates 0019 (references need an identity to point
at).

---

Shipped at HEAD `e01cd96` on 2026-06-22. Identity scheme asked at
establishment (Q11c, default repo-prefixed slug) and recorded in the
federation config; conditional §Federation in scaffold CONVENTIONS;
new-adr applies per-repo numbering + logical identity. ADR 0021 →
Implemented.
