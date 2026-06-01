# Distribution via self-hosted marketplace and npm/pi package

Owning ADR: adr/0009-distribution-marketplace-npm.md

Repo serves as its own Claude Code marketplace; pi installs from git or
npm with `skills/` auto-discovered; release tags and npm `latest` track
the manifest version.

Shipped at HEAD `18891d3` (2026-05-22, prepare npm publish); marketplace
listing present from `17286a3`.
