# Repository producer fixtures, format 1

This collection describes native repository output. It is separate from the
workspace format and its two-repository fixture. Open each directory under
`cases/` as a repository root; do not treat this collection itself as an
adopter workspace.

`manifest.json` pins the producing Git revision, per-file SHA-256, source
paths, rendering choices and expected observations. `sources/` retains exact
Git blobs from that revision, including the deterministic renderer. Hashes
use UTF-8 Git bytes with LF; Windows checkouts may use CRLF, so normalise
line endings for a checkout comparison or hash `git show` output.

## Origins and limits

Core files and decisions render the real bootstrap templates. Conditional
sections select the declared shape/layers; supplied synthetic values fill
the forms. Native Status is the exact scaffold excerpt with supplied values.
Minimal plan, INDEX, glossary and domain bodies are authored from the named
skill output rules; they are labelled as such per file, not presented as a
native-host behavioural run. Legacy two-range records come from the retained
producer eval fixture without renumbering; every historical done entry is
byte-preserved. The nested legacy case changes only the artefact-root record
and placement, retaining historical entry-point copies.

The synthetic actors, mandate text, repeated example SHA and example PR URL
are not real approval, check or integration evidence. A consumer must not
infer a checked merge from them. Native host qualification remains separate.

## Cases

| Group | Expected result |
|---|---|
| default-root, root-pointer, docs-pointer, nested-pointer | Resolve marker/pointer before legacy probes; preserve the chosen root. |
| legacy-no-manifest, legacy-two-range | Read without forced migration; infer legacy ranges by native convention; migration is an optional note. |
| explicit-two-shape | Honour explicit capability/technology fields; exclude both templates from numbering. |
| optional-layers | Queue, single-writer prompt, glossary and domain grouping are present; their absence in minimal cases is valid. |
| status-claimed/blocked/stopped/resumed | Preserve fixture-executor, actual named branch, blocker and next step; a resumed item clears the stop and keeps ownership. |
| completion-prepared/integrated | Identical completion files need native Git evidence to establish integration; a done path alone is insufficient. |
| federation-home/member | Distinct repository identities allow the same local number; resolve the declared sibling home/member links. |
| invalid-pointer/syntax, disagreeing-pointer | Report genuine pointer errors; do not probe elsewhere to hide an invalid explicit pointer. |
| duplicate-number, unknown-status/shape | Report the exact malformed native metadata and keep other files readable. |

The integration test creates a real isolated Git history: initial main from
status-resumed, a completion commit on work/0001-example, then a standard
merge commit into main. Before that merge the completion is prepared; after
it the branch is reachable. Those are synthetic Git transport controls,
not hosted PR/CI or operator delivery. Compare the two snapshots for the
todo-to-done move and preserve the original native identity.

## Reproduce and consume

In a source checkout at the manifest's producing revision:

```text
node scripts/produce-repository-fixtures.mjs <source-repo> <full-source-revision> <new-destination>
node --test evals/repository-producer.test.mjs
```

The renderer reads committed Git blobs and writes only the chosen destination.
No network, installer or host launch is involved. Optional --refresh verifies
existing generated hashes and refuses to remove files or overwrite edits.
Distributed fixtures and retained sources can be consumed without a source
checkout; a consumer must pin its own revision alongside this manifest.

Browse/index/watch/audit the same cases in Clarity. Verify five-second ordinary
freshness after add/edit/move/delete, immutable input hashes during reading,
source-qualified links and honest missing/unknown integration observations.
Use the same per-file hashes for the consumer receipt, and report unsupported
cases rather than changing canonical files. Coordinate any format correction
with the producer owner.

## Status at a glance

- **This run:** Supplies source-bound native repository fixtures and expected semantics.
- **Overall:** partially verified — deterministic rendering/Git controls are separate from app and native-host qualification.
- **Yet to do:** Pair exact consumer source and exercise native discovery,
  watching, audit, history and all supported host/platform cases.
