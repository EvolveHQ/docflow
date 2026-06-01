---
adr: 0009
title: Distribution via self-hosted marketplace and npm/pi package
status: Implemented
date: 2026-05-22
owner: Eugenio Minardi
supersedes:
superseded-by:
depends-on: ["0008"]
tags: [distribution, release]
---

# ADR 0009 — Distribution via self-hosted marketplace and npm/pi package

## Context

Once docflow ships two targets from one source
(adr/0008-dual-target-packaging.md), recipients need a way to install and
update it on each agent. Standing up a separate hosting service would be
overhead; the repository itself can serve as the distribution point for
Claude Code, and the existing npm registry serves pi.

## Capability statement

docflow is distributed through two channels with no extra
infrastructure:

- **Claude Code** — the repository is its own marketplace
  (`.claude-plugin/marketplace.json`), installed via
  `/plugin marketplace add EvolveHQ/docflow` then
  `/plugin install docflow@evolvehq`, and refreshed via
  `/plugin marketplace update`.
- **pi** — installed from git (`pi install git:…`) or, once published,
  from npm (`pi install npm:@evolvehq/docflow`); pi auto-discovers
  `skills/` via the `pi` key in `package.json`.

Releases are tagged `vX.Y.Z` matching the manifest version, and the npm
`latest` tracks the same number.

## User stories / scenarios

- As a Claude Code user, I add the marketplace and install the plugin
  with no external service.
- As a pi user, I install from git or npm and get the skills
  auto-discovered.

## Acceptance criteria

1. `marketplace.json` lists the `docflow` plugin and resolves from the
   repo root.
2. `package.json` declares `pi.skills` and the published `files` set, and
   is installable via npm/pi.
3. Release tags `vX.Y.Z` and npm `latest` track the manifest version.

## Out of scope

- The mechanics of keeping the two manifest versions in sync (a
  consequence of adr/0008-dual-target-packaging.md, enforced by the
  verify gate).

## Open questions

- None.

## References / cross-links

- adr/0008-dual-target-packaging.md
- `README.md` §Install, `USAGE.md` §Updating the plugin

## Revision History

| Date | Revision | Author | Change |
|------|----------|--------|--------|
| 2026-05-22 | r1 | Eugenio Minardi | Backfilled from commits 17286a3 (marketplace listing) and 18891d3 (prepare npm publish). |

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Maintainer | Eugenio Minardi | 2026-05-22 | — |
