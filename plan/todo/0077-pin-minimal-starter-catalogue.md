# 0077 — Pin a minimal starter catalogue

Owning decisions: adr/0059-five-workspace-commands-and-mandate-note.md
(Accepted; carries W3 forward), adr/0051-portable-workspace-memory-contract.md
(AC5), and adr/0061-v1-workspace-host-guides.md (AC4).
W3 trace: adr/0053-portable-workspace-operating-skills.md AC3/5, carried forward
under 0059; this item does not reinstate its superseded command or guide sets.

## Status

- Claimed by:
- Blockers:
- Stopped:

## Scope

Deliver a usable, small starter catalogue through the shipped role/profile/
source templates, recommendation procedure and resolver controls. Connect the
four existing roles to reviewed, immutable skill/resource references, include
one Addy review example and optional Ponytail minimal-change and Caveman
concise-updates profiles, and resolve the VS Code agent-mode mapping with a
manual brief fallback. Profiles must describe actual applicability, effects,
dependencies and exclusions rather than contain empty asset lists.

Source: reviewed gap 6 in
`../../.docflow_workspace/local/handoffs/workspace-gaps-review.md`; design
document 09 §§9, 11, 14 (P3 and curated starter surface), document 14 §4 W3 and
§5 WV11/WV15/WV18. Existing availability values and schema are reused. Empty
catalogues in an adopter's live workspace remain a valid adoption choice.

Out of scope: mandatory installation, pack-wide vendoring, hooks, proxy/context
compression, a recommendation service, a new machine-availability schema and
editing an adopter's real configuration. No new capability ADR is required.

## Dependencies and queue position

- Uses integrated 0057/0070/0071/0072 assets and the current five-command,
  eight-target, seven-guide scope; no dependency on local-path overrides.
- Inspect each selected source, licence and referenced resource at its pinned
  revision before packaging references. A changed upstream requires explicit
  review; a historical design link alone is not compatibility proof.
- Third new increment. Item 0062 owns native WV11/WV15/WV18 and paired Clarity
  observations on these final bytes; 0061 covers package discovery/byte parity.

## Exit criteria

1. Four roles and concrete profiles resolve their selected skill/style/resource
   references from versioned source entries with licence, owner, compatibility,
   required tools and side effects. Missing required references fail; optional
   material has an explicit core-role fallback. (W3 AC3/5; 0051 AC5)
2. The Addy review example preserves required supporting resources; optional
   Ponytail and Caveman examples retain native checks and exact IDs, grants,
   commands and results. No selection installs, launches or authorises an
   actor; named profiles are examples, not mandatory dependencies. (W3 AC3)
3. VS Code mapping resolves to the selected role/profile and records discovery
   evidence plus the brief fallback, with alias conflicts explicit. All seven
   guide mappings remain usable. (0061 AC4; W3 AC3)
4. Deterministic controls and native WV11/WV15/WV18 demonstrate task-specific
   documentation/React/Svelte-Tauri suggestions, normally at most three, with
   add-nothing and missing-specialist outcomes. They exercise unavailable or
   conflicting dependencies, changed stack/source/data policy and unchanged
   declined choices without repeated suggestion. (W3 AC3; 0059 AC2)
5. Selection, compatibility, availability and actual use stay distinct in
   briefs/receipts; stale or retired pins retain historical references and
   require reassessment. Package resolution and both local gates pass;
   meaningful stricter controls follow gate-integrity commit rules. (W3 AC3/5;
   0059 AC5)

## Size estimate

L — 3–5 focused curation, product and verification days, excluding native-host
access; one shipped templates/recommendation/resolver increment.
