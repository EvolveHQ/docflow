# Federation

This repo is part of a multi-repo product. Lifecycle skills read this
back-pointer to resolve cross-repo behaviour. It is the answer to "what
is my home?"; the home repo's `federation-index.md` is the answer to
"which repos are in this product?".

- **Product:** <product-name>
- **Topology:** <A — central decisions repo | B — distributed + federation | C — home repo + local>
- **Identity scheme:** <repo-prefixed slug `<repo-id>/NNNN-slug` (default) | other scheme chosen at establishment>
- **Home:** <pointer to the home/central repo — URL or path; for the home repo itself, `this repo`>
- **Role:** <home | member>
- **Repo id:** <short identifier for this repo, used to qualify its records across the federation>

<!-- Hand-maintained. Membership is declared, not auto-discovered: a
member's bootstrap writes only this file in its own repo; adding the
repo to the home's federation-index.md is a deliberate edit there. -->
