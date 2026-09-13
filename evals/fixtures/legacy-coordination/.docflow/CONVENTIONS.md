# Conventions

Project name: legacy coordination fixture.
Artefact root: .docflow/.
Language: en-GB. Assessment depth: full.
Single capability shape; contiguous zero-padded numbers.
Lifecycle: Proposed → Accepted → Implemented → (Superseded | Deprecated).
Several writers, separate worktrees. Integration: direct-to-main,
fast-forward only. Gate: node tools/verify.mjs. Standalone, no domains.
Conventional Commits with Rationale footer for ADRs; unsigned synthetic
commits; no revision tags or Co-Authored-By trailer.
Keep ROLES, IN_FLIGHT, WORKLOG, CURRENT_FOCUS and HANDOFF under _agent/.
Keep LOCKS until a migration retires the legacy ledger.
