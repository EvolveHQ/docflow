# 0082 — Public release documentation scope

Owning ADRs: adr/0051-portable-workspace-memory-contract.md (AC1, AC5–6), adr/0056-public-clarity-installer-handoff.md (AC6), adr/0061-v1-workspace-host-guides.md (AC2, AC5–6), adr/0057-bounded-verification-evidence.md (AC1–4).

## Scope

Keep Docflow release documentation focused on its published features. Review the README, usage guide, site and packaged public documentation; retain accurate package and native-host qualification boundaries. Preserve established URLs, anchors and navigation with concise package guidance. Documentation only: no skill, runtime, version or gate changes.

## Exit criteria

1. Public release copy describes Docflow features and usage without unrelated project planning; legitimate workspace concepts and native-host limits remain accurate.
2. The existing release-help route, title, navigation and anchors resolve to neutral Docflow guidance.
3. Static verify, all 13 deterministic evals, isolated safe Jekyll build, rendered route/navigation checks and targeted content review pass. Package comparison accounts for intended documentation bytes only.
4. Signed Conventional Commits and a ready PR to main carry a concise verification receipt; prepare completion only after verified criteria, with actual PR URL and work HEAD.

## Dependencies

None for this operator-authorised bounded documentation task. Broader owning decision criteria retain their existing status and queue items.

## Status

- Claimed by: Codex sole writer, 2026-10-15, `docs/public-release-scope`.
- Blockers:
- Stopped:
