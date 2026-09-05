# AGENTS.md

Guidance for coding agents working in this repository.

## Hard rules when editing ADRs

- **One decision per ADR.** Splits become new ADRs that supersede.
- **Status lifecycle:** `Proposed -> Accepted -> Implemented ->
  (Superseded | Deprecated)`.
- **Capability ADR section order:** metadata -> Context -> Capability
  statement -> User stories / scenarios -> Acceptance criteria -> Out of
  scope -> Open questions -> References -> Revision History -> Approvals.
- **Technology ADR section order:** metadata -> Context -> Decision ->
  Rationale -> Consequences -> Acceptance criteria -> Out of scope ->
  Open questions -> References -> Revision History -> Approvals.
- **Shape is the number range.** Capability ADRs are numbered below
  `0100`; technology ADRs from `0100` onwards. The technology template
  sits at the boundary as `adr/0100-template.md`.
- **Acceptance criteria are testable and numbered.**
- **ADRs are internal artefacts — never user-visible.**

## Plan folder

`plan/todo/NNNN-<slug>.md` is pending work; `git mv` to
`plan/done/<YYYY-MM-DD>-<slug>.md` is the completion event.
