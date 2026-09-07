# Plan

This folder holds the project's implementation queue — one file per
unit of work. The queue mirrors the ADR catalogue (`INDEX.md`) but
tracks the human ordering of work, not the ADR catalogue ordering.

## Layout

- `plan/todo/NNNN-<slug>.md` — pending work, ordered by priority
  (lower numbers run first). Each file names the owning ADR(s), the
  scope, the exit criteria, and any dependencies.
- `plan/done/<YYYY-MM-DD>-<slug>.md` — shipped work, ordered
  chronologically. The file's body is amended with a "Shipped" footer:
  under direct-to-main integration it names the HEAD SHA and any
  artefact id; under pull-request integration it names the pull request
  and any artefact id.

## Convention

- A pending item gets a `plan/todo/` file BEFORE work starts.
- Numbers are never reused. The next `todo/` number is one above the
  highest number across `todo/` filenames and `done/` titles; an empty
  queue does not restart the sequence.
- When work ships under direct-to-main integration, the completion
  commit moves the file to `plan/done/` with a new date prefix, amends
  the body with the shipped footer, advances the owning ADR(s), and
  regenerates `INDEX.md`; the successful push is the completion event.
- When work ships under pull-request integration, those completion
  changes are the final branch commit before the pull request is
  marked ready; the footer names the pull request, the merge is the
  completion event, and no follow-up commit is made on the integration
  branch.
- A small fix that doesn't justify a plan file (a typo, a one-line
  tweak, a dependency bump) skips the ceremony. Use judgement.
- The status of the owning ADR(s) advances when the work ships:
  `Accepted` → `Implemented`.

## Status semantics on the owning ADRs

| ADR status | Meaning |
|---|---|
| Proposed | Draft; decision authored but not yet approved. |
| Accepted | Decision approved; implementation authorised. Sits in `plan/todo/`. |
| Implemented | Shipped per the project's completion event. Sits in `plan/done/`. |
| Superseded | Replaced by another ADR (named in `superseded-by:`). |
| Deprecated | Was real; the world moved on; no successor. |

See `CONVENTIONS.md` §Status lifecycle for the canonical definition.
