# Workspace format 1

This is the portable producer/consumer contract. The accompanying schema,
validator and fixtures are usable with Node.js 22 or later, without network,
an agent host or an npm dependency. They check supplied records for consistency;
they do not authenticate an approver, prove an external action occurred or
enforce live host permissions. This foundation is not native-host qualification.

## Ownership and layout

An adopter deliberately creates its own Git workspace. It owns README.md,
AGENTS.md and `.docflow_workspace/{workspace.yaml,CONVENTIONS.md,INDEX.md}`;
five record folders `ideas`, `decisions`, `work`, `knowledge`, `runs`; and
curated `agents`, `profiles`, `integrations`. Ignore `/repos/` and
`/.docflow_workspace/local/`. Checkouts are independent Git histories, never
submodules or a copied native queue. Registry membership grants no authority.
Do not initialise or convert an existing parent container implicitly.

Registry `repositories` is a simple list: immutable shared `id`, retained
`aliases`, declared `path`, optional `remote`, `role` (delivery/reference),
and relative `instructions`. A member may instead be a **remote-only
reference**: `id`, `aliases`, `remote` and `role: reference`, with no `path`
and no `instructions`. Paths may be absolute or relative, including
explicit sibling checkouts. Resolve and canonicalise each declared root;
record/native paths must remain inside their respective declared roots,
including through symbolic links. The validator reads declared instruction
and native reference files, never scans arbitrary sibling repositories.
Missing members produce diagnostics; registry entries are not deleted.
No remote URL is fetched or recorded command executed. A missing native file
may be resolved in its declared local Git revision using read-only Git object
queries, without hooks or network. Where a member has a local Git object
store, **every cited native revision must contain the exact regular file at
that revision**; a revision that does not is a `native-revision` diagnostic
that fails the workspace, and the check fails closed. A member without a
local Git object store is existence-only and never claims revision
verification. Native references to a remote-only reference member are
identity-only. This preserves immutable briefs after a native path move;
historical symlink blobs and escaping paths are rejected.
Historical lookup requires Git with --no-lazy-fetch support (2.45 or later),
ignores inherited repository/configuration redirects and replacement objects,
and requires the exact regular-file entry and blob to exist locally.
Both SHA-1 (40 hex) and SHA-256 (64 hex) full revisions are accepted.
A local commit or tree may name the historical source; label the object type
honestly, since a tree alone does not establish commit ancestry or integration.
Missing promisor objects or unsupported Git produce an unavailable-path
diagnostic; validation never fetches them to repair the reference.

`external_homes` maps canonical workspace identities to explicitly supplied
local workspace roots for cross-workspace resolution. References retain their
home and full identity; local copies are not new authority. Consumers may
display unresolved references, but dependent dispatch remains blocked.

Clarity reads, views, copies and prepares handoffs. It never edits these
canonical records in V1. An authorised Docflow session in the chosen native
host records changes and reconciles receipts; the consumer then refreshes.
Native member instructions, identifiers, lifecycles and completion events
remain authoritative and unchanged, including a native `Implemented` state.

## Encoding and schema

`workspace.yaml`, configuration files and Markdown front matter use the
**JSON-compatible subset of YAML**: exactly one JSON object, double-quoted
keys/strings, arrays, finite numbers, booleans and null. The front matter is
delimited by lines containing `---`. UTF-8 and LF/CRLF are supported. This is
not a general YAML parser: block mappings, comments, anchors, tags, duplicate
keys (including escaped equivalent keys), trailing commas and multiple
documents are rejected. Markdown after the closing delimiter remains prose.
Every record has a non-empty H1 body; its machine fields are in front matter.

`schema.json` is the structural JSON Schema contract. Its root definitions
`registry`, `ideas`, `decisions`, `work`, `knowledge`, `runs`, `role`, `profile`
and `sources` define allowed fields and types. The validator additionally
checks the semantic rules below. Unknown properties fail; `extensions` is an
explicit JSON object for non-authoritative consumer annotations. Extensions
cannot override any field, confer authority or satisfy evidence. Unsupported
schema versions fail with diagnostics; consumers retain a readable error
view and must not reinterpret them as a supported version.

## Identity and references

Canonical record identity is `{home, id}` where `id` is a full lowercase
UUIDv4 and `home` is the shared workspace identity. A durable reference is
`{home, id, path}` with a workspace-relative canonical record path. Native
references are separate `{repository, path, revision}` values, retaining
the member's exact path/identifier and full Git revision. Evidence adds
`observed_at`, `outcome` and `summary` to that native reference; workspace
evidence uses the workspace home as `repository`. Evidence is a source-bound
observation, not a signature or execution grant. Outcomes are passed, failed,
skipped, unknown and stale; none except passed satisfies completion.

A knowledge source may instead be a **content-addressed external source**:
`locator`, `sha256` `digest` (with the `sha256:` prefix), `observer`,
`observed_at`, `outcome` and `summary`. It is validated without any local Git
root and is never resolved to a workspace path. The locator is an opaque
external reference (for example a URL or an archive path), so a document that
lives outside Git and outside the machine is first-class knowledge.

Filenames are `<readable-slug>--<suffix>.md` in the matching kind folder.
The suffix starts with the first 12 hex characters of the UUID with hyphens
removed. Before publishing a new path, extend by four characters until it
is unique within the home, up to all 32 characters. Never overwrite or
silently rename an established path. If concurrent records have colliding
short labels, report the collision and reconcile the unpublished candidate;
existing paths/full references remain usable. `lookupShort` rejects any
ambiguous prefix, even if the filenames differ. Consumers may use a longer
display label. A title/state/priority edit changes neither path nor identity.
The optional previous-snapshot comparison checks immutable identity/path and
append-only history; a snapshot alone cannot prove historical preservation.

## States and histories

| Kind | Initial state | Permitted later transitions |
|---|---|---|
| ideas | backlog | backlog → selected/rejected/discarded; selected → backlog/rejected/discarded; rejected/discarded → backlog with reason |
| decisions | proposed | proposed → accepted/rejected/superseded; accepted/rejected → superseded |
| work | planned | planned → active/cancelled; active → review/cancelled; review → active/done/cancelled |
| runs | running | running → succeeded/failed/stopped/unknown; unknown → succeeded/failed/stopped after reconciliation |

Knowledge has `category`, sources, observation date and `review_when`, with
no mandatory lifecycle. All other kinds retain an ordered `history` of
state, UTC time, actor and reason, starting at the initial state and ending
at the current state. Material same-state updates append a reasoned entry.
UTC times use `YYYY-MM-DDTHH:mm:ssZ`; no wall-clock default is used in checks.
The caller supplies `--at` to evaluate current expiry deterministically.
Accepted decisions require an acceptance actor, time and mandate reference;
superseded decisions require reciprocal predecessor/successor links. Successor
and work-dependency graphs must be acyclic; no self-reference is valid there.

Selection sets priority only. Acceptance records agreement only. Work state
is independent of blockers, priority and authority. Planned work may have no
grants and unknown delivery observations. A run's success means its assignment
criteria passed; it does not close the parent. Work `done` requires every
required delivery observation to record its declared native completion,
matching passed evidence/revision, plus passed evidence for every work
criterion. Cancelled work records the disposition of partial work in `next_action`.
Completed work leaves its still-current agreement accepted.

## Grants, claims and dispatch

Work owns deliveries and grant histories. A grant's local ID is scoped to
that work; a reference names the parent work, grant ID and exact revision.
Each revision records state, actor, delivery, scope revision, approver,
approval time and source mandate, allowed actions (including known effects),
conditions, start, expiry and stopping point. Revision numbers are contiguous.
States are active/suspended/revoked/closed: active may suspend/revoke/close;
suspended may reactivate/revoke/close; revoked/closed are terminal. Actor or
scope change requires a suspended predecessor or a new grant. Old revisions
are retained. Existing exact authority may be recorded and reused.

Run `brief` and `receipt` are separate structures. Briefs name scope and
exclusions, actor/host, work/delivery/grant, member base and workspace revision,
required checks, dependencies, resources, stopping point and return path.
The exact brief binds its grant revision; copied context grants nothing.
Before each recorded action, check authority at that action's time; for a
currently running attempt, check the latest grant at `--at`. Expiry/revocation
stops future action, not history. A suspended/changed actor/scope cannot reuse
an old brief. Reference-only members permit only read/test/report actions
whose declared scope does not mutate the member; native rules still apply.

Native ownership observations are separate from grants. A claim names its
shared native source, owner and observed state/time/expiry. If the member
has no mechanism, use `owner-confirmed-serial` with a source-bound owner
confirmation. Unknown ownership or an expired claim blocks a running attempt;
expiry never proves another actor stopped. Overlapping attempts on the same
canonical repository fail conservatively. Exclusive resource reservations
name a shared resource, native evidence and owner; overlapping reservations
across repositories fail too. Time intervals are half-open, so a reconciled
handoff can start at the previous attempt's recorded stopping time.

Reassignment uses a new run ID and reciprocal predecessor/successor links.
Its predecessor must have a reconciled terminal receipt before the successor
starts. A missing/disconnected worker remains unknown; a new grant alone
cannot release its ownership. Reconciliation cites native evidence and
records who checked it and when. The same actor may resume a stopped attempt
through a new run with the same still-valid grant, preserving attempt history.

Run actions carry timestamps and action names; receipts retain exact commands,
exit codes (null when unknown/skipped), output, outcome, source revisions,
evidence, blockers and next action. A passed check requires exit zero and
matching passed evidence. Skipped/failed checks never become success. A
terminal receipt, not a run label alone, must establish the assignment result.
Conditional native effects and the truth of reported observations remain
human/host verification responsibilities.

## External inputs, remote members and imported history

A registry member with `role: reference`, a `remote` URL and no `path` or
`instructions` is a **remote-only reference**. Its identity resolves; native
references to it are identity-only (no local file or revision check) and its
actions stay non-mutating (read/test/report). A remote-only entry with
`role: delivery`, or without a scheme in its remote, is invalid.

`sources.yaml` may carry a `documents` array registering a **derived
documentation set** as an external content-addressed input (`id`, `locator`,
`sha256` `digest`, `observer`, `observed_at`, optional `derived_from` and
`note`). The document is never vendored into canonical memory: a locator that
resolves to an existing path inside the workspace fails as
`vendored-document`.

A run may be an **imported-evidence record**: `brief` is null and an `import`
object carries `imported_at`, `observer`, `evidence` and an optional `note`.
Imported history is read-only backfill for an execution that happened under a
native mandate. It validates without a workspace grant and can never satisfy a
grant-bound dispatch, an active work-state check or a claim/resource overlap.
A run with both a brief and an import fails as `import-brief`.

**Backlog grouping is out of the contract.** Grouping work into a
product-wide roadmap or backlog is a consumer concern; this format records
ideas, decisions, work, knowledge and runs, and adds no grouping field.

## Roles, profiles and recommendations

Configuration is not a sixth memory kind. Namespaced roles have an owner,
revision, purpose, short soul, skill references and native mappings. Profiles
select pinned role/skill/style references with applicability and exclusions.
The source catalogue separates selection (candidate/approved/retired) from
compatibility (proposed/tested/limited), with asset kind, revision, licence,
requirements, effects and replacement links. Native aliases must be unique
per host. Historical pinned sources remain valid in old receipts.

Recommendations live on work: action reference/enable/use, fit and reason,
scope, pinned source, availability, state, authority reference or null,
setup dependency, fallback and success check. Selection is not setup or
permission. Runs separately record selected and used assets with exact
revisions/results. Recheck fit after host/actor/stack/source/policy changes;
unchanged declined or deferred choices are retained. Empty recommendations
mean add no tool. No installer, recommender service or runtime is introduced.

## Validation and consumer outcomes

Run `node validate.mjs <workspace-root> --at <UTC-time> [--previous <root>]`.
JSON output includes `valid`, `diagnostics`, `records` (successfully parsed
records) and `overview` with observed delivery state. Invalid/incomplete
inputs remain inspectable with diagnostics; exit 1 blocks dependent mutation,
not reading. A structurally valid planned workspace with unknown observations
can pass and still has no execution authority. `--previous` additionally
detects removed records, identity/path rewrites, rewritten grant/history and
scope changes without revision advancement. The validator writes nothing.

Fixtures are synthetic producer examples, not actual approval or native
execution evidence. `fixtures/README.md` identifies expected observations and
the tests that mutate them. Consumers should pin this directory, schema and
contract to the same Docflow source SHA; revalidate after producer changes.

## Status at a glance

- **This run:** Defines the portable format and deterministic validation boundary.
- **Overall:** partially verified — native host and Clarity consumer qualification remain separate.
- **Yet to do:** Apply current native authority/ownership checks in a real host,
  qualify the operating skills and complete the combined V1 evidence.
