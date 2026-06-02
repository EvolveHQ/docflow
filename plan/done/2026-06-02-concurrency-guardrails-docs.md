# 0008 — Document the concurrency guardrails

Owning ADR: adr/0014-concurrency-guardrails.md

## Scope

Document the concurrency consideration and the guardrails for all repos
(not just those that pre-wire them).

- `USAGE.md` — a "Concurrent ADR/plan creation" section explaining the
  race, G1/G2/G3, and that single-agent / direct-to-main repos need none
  of it.
- `docs/` site — a short pointer (e.g. in the Examples page or a line on
  the landing page) so the guidance is discoverable.

## Exit criteria

Maps to adr/0014-concurrency-guardrails.md acceptance criteria:

1. `USAGE.md` documents the concurrency consideration + guardrails for all
   repos. → AC5
2. The site references it.
3. `node scripts/verify.mjs` stays green (no ADR leakage, en-GB).

## Dependencies

Independent of 0007.

---

**Shipped** at HEAD `pending` (2026-06-02). Added a "Concurrent ADR/plan
creation" section to `USAGE.md` (the race, G1/G2/G3, single-agent repos
need none of it) and a pointer note on the site's Examples page. With
0007, this completes ADR 0014, which advances Accepted → Implemented.
verify green.
