# 0017 — Federation config and membership index

Owning ADR: adr/0023-federation-config-membership-index.md

## Scope

Define and implement the two on-disk artefacts that describe a federation,
both as **Markdown**.

- **Per-repo back-pointer config**: a small committed Markdown file in each
  member repo naming the product and the home/federation pointer, using a
  defined minimal field convention a lifecycle skill parses unambiguously.
- **Home-repo member index**: an authoritative Markdown table enumerating
  the member repos, hand-maintained (adding a member is a deliberate
  home-repo edit; no lifecycle skill writes across repos).
- Resolve both file locations against the configured artefact root
  (adr/0017-configurable-artifact-root.md).
- Together they answer "what is my home?" from any member and "which repos
  are in this product?" from the home.

## Exit criteria

Maps to adr/0023-federation-config-membership-index.md acceptance
criteria:

1. Each member repo commits a small back-pointer config (product + home
   pointer). → AC1
2. Home repo holds an authoritative member index enumerating members.
   → AC2
3. Member index hand-maintained; no cross-repo writes to update it. → AC3
4. Config location honours the configured artefact root. → AC4
5. The pair answers "what is my home?" and "which repos are in this
   product?". → AC5
6. Both artefacts are Markdown; member index is a table, back-pointer uses
   a defined minimal field convention. → AC6
7. `node scripts/verify.mjs` stays green.

## Dependencies

Depends on 0015 (topology) and 0016 (establish flow creates the index this
item formalises). The bidirectional consistency check is deferred to
adr/0028-cross-repo-audit.md (not in this item).
