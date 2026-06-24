# Federation member index

Authoritative list of the repos in this product. Lives only in the
home/central repo. **Hand-maintained:** adding a member is a deliberate
edit here — no lifecycle skill writes across repos to update it. Lifecycle
skills read this to enumerate the product's repos.

- **Product:** <product-name>
- **Topology:** <A — central decisions repo | B — distributed + federation | C — home repo + local>
- **Identity scheme:** <repo-prefixed slug `<repo-id>/NNNN-slug` (default) | other scheme chosen at establishment>

| Repo id | Repo | Role | Pointer |
|---------|------|------|---------|
| <id>    | <this repo> | <central\|home\|coordinator> | this repo |

<!-- Role values: the establishing repo is `central` (topology A),
`coordinator` (B), or `home` (C); every other member is `member`. -->

<!-- Each row should have a matching federation.md back-pointer in the
named repo, and vice versa. The audit step cross-checks both directions. -->
