# Conventions

## Project

Project name: legacy-range.

Artefact root: `docs/` — legacy nested artefact home.

Language: en-GB throughout.

Assessment depth: full.

## ADR Files

ADR filenames use `NNNN-kebab-case-slug.md`, zero-padded to 4 digits,
contiguous within each shape's range.

Status lifecycle: `Proposed -> Accepted -> Implemented ->
(Superseded | Deprecated)`.

Cross-references link by relative path to `adr/NNNN-*.md`.

## ADR Shapes

Capability ADRs (`0001`-`0099`) describe what the system must do. They
use `adr/0000-template.md` with sections: Context, Capability
statement, User stories / scenarios, Acceptance criteria, Out of
scope, Open questions, References, Revision History, Approvals.

Technology ADRs (`0100` onwards) describe how the system is built.
They use `adr/0100-template.md` with sections: Context, Decision,
Rationale, Consequences, Acceptance criteria, Out of scope, Open
questions, References, Revision History, Approvals.

Technology ADR Rationale must name alternatives considered and give
specific reasons they were rejected.

**Recorded exception.** `adr/0001-record-architecture-decisions.md` is a
technology-shaped decision that sits in the capability range, because the
ADR that adopts the method must be the first in the catalogue. It is the
one ADR whose shape does not follow its number.

## Plan Folder

- `plan/todo/NNNN-<slug>.md` — pending work, lower numbers run first.
- `plan/done/<YYYY-MM-DD>-<slug>.md` — shipped work, chronological.

## Git Contract

Conventional Commits, with a mandatory `Rationale:` footer on any commit
touching an ADR. Signed commits: yes.

## Reporting

End reports with Status at a glance: This run (actual actions and command
outcomes), Overall (implemented, partially verified, verified, blocked,
failed or unknown), and Yet to do (all remaining work). A missing or
unavailable check is not a pass.
