# 0029 — Enable optional layers after bootstrap

**Owning ADR:** adr/0016-layered-artifact-model.md (r3, AC5)

## Problem

The layered model lets you **defer** optional layers at bootstrap, but
there is no entry point to **enable** one later. `add-convention` routes a
term to `GLOSSARY.md` only "if the repo has one" (won't create it);
`new-adr` uses `domains/` only "if it exists"; `bootstrap` has no
"already a docflow repo → add a layer" path. So a deferred `GLOSSARY.md`,
`domains/`, technology-ADR template, `plan/`, or `_agent/` is stranded.

## Scope

In:
- **`bootstrap` additive mode** — a third Step-1 situation ("already a
  docflow repo"): read the recorded setup (shape, artefact root, mode,
  layers present), skip settled questions, and offer only the **absent**
  optional layers; add the chosen ones by **merge** under the recorded
  artefact root, never overwriting.
- **`add-convention`** — create `GLOSSARY.md` if absent when routing the
  first shared term to it (enables the glossary layer).
- **`new-adr`** — when an ADR is assigned to a `domains/<slug>/` that does
  not exist, offer to create `domains/<slug>/README.md` before adding it.
- Document the "enable a deferred layer later" path in `README.md`/`USAGE.md`.

Out:
- A new dedicated skill (`add-layer`) — `bootstrap` is the entry point.
- Changing the resolution fallback (skills still assume repository root
  when no artefact root is recorded).

## Exit criteria (map to ADR 0016 AC5)

1. Re-running `bootstrap` on an existing docflow repo offers the absent
   optional layers and adds the chosen ones by merge (never overwriting).
2. `add-convention` creates `GLOSSARY.md` if absent when adding the first term.
3. `new-adr` offers to create a `domains/<slug>/` grouping on assign to a
   new domain.
4. The path is documented in `README.md`/`USAGE.md`.

## Completion event

Fast-forwarded to `main` + remote push. On completion, `git mv` to
`plan/done/`, advance ADR 0016 → Implemented, regenerate `INDEX.md`.

---

Shipped at HEAD `92cd5cc` on 2026-06-30. bootstrap additive 'already a docflow repo' situation + add-convention GLOSSARY auto-create + new-adr domain auto-create; README/USAGE. ADR 0016 -> Implemented (r4).
