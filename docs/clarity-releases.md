# Clarity downloads and release preparation

Clarity installers are intended for public releases in
[EvolveHQ/docflow](https://github.com/EvolveHQ/docflow/releases). Release
preparation tooling is available; a successful local test does not establish that
a particular version has been published, signed or accepted for release.

## Choose the product first

| Product | Tag | What it updates |
|---|---|---|
| Docflow | `v<version>` | The Docflow plugin/package, through its existing installation channels |
| Clarity | `clarity-v<version>` | The Clarity desktop application |

Use an exact product tag. Do not use `/releases/latest`, the generic latest badge,
or the newest release across the whole repository to discover either product.
Clarity publication sets `make_latest: false`; each consumer still needs its own
product filter. A Clarity-only release leaves Docflow's package versions unchanged.

From a trusted Docflow source checkout with Node 22 or newer:

```sh
node scripts/release-handoff/cli.mjs lookup --product docflow
node scripts/release-handoff/cli.mjs lookup --product docflow-clarity
node scripts/release-handoff/cli.mjs lookup --product docflow-clarity --version 1.0.0
```

These read public metadata without authentication. They ignore drafts, select
stable versions by semantic precedence, and fail clearly if none exist. Use
`--include-prerelease true` to include previews, or choose an exact preview
version. Equal-precedence versions with different build metadata require an exact
selection. The examples are command shapes, not claims that version 1.0.0 exists.

## Pick the installer and verify it

The release manifest names the exact compatible Docflow version. Each installer
filename identifies Clarity version, operating system, architecture and build
configuration:

```text
docflow-clarity_<version>_<os>_<arch>_<configuration><extension>
```

| Operating system | Formats | Architecture identifiers |
|---|---|---|
| Windows | `.exe` (NSIS), `.msi` | `x64`, `arm64`, where listed |
| macOS | `.dmg` | `x64`, `arm64`, where listed |
| Linux | `.AppImage`, `.deb`, `.rpm` | `x64`, `arm64`, where listed |

Supported profile names are `minimal`, `ai`, `plugins`, `ai-plugins`, `terminal`,
`ai-terminal`, `plugins-terminal`, `ai-plugins-terminal`, `remote`, `ai-remote`,
`plugins-remote` and `full`. Remote profiles include the terminal. `full` enables
all four optional integration groups; `minimal` omits them. The actual manifest
defines which configurations and architectures are distributed. Every included
configuration must have complete Windows, macOS and Linux builds; each build
contains all formats listed above and its matching `_NOTICES.txt` and
`_DEPENDENCIES.json` files.

1. Open the selected `clarity-v<version>` release and read its manifest
   `docflow-clarity_<version>_release.json`.
2. Download the installer for the listed OS/architecture/configuration, its two
   notice/dependency files, and `docflow-clarity_<version>_SHA256SUMS.txt`.
3. Compare the local file's size and SHA-256 to the manifest/checksum entries.
   On PowerShell use `Get-FileHash -Algorithm SHA256 ./<exact-filename>` and
   `(Get-Item ./<exact-filename>).Length`; on macOS use
   `shasum -a 256 ./<exact-filename>`; on Linux use
   `sha256sum ./<exact-filename>`. Compare the entire hexadecimal value.
4. Follow the producer's verified platform installation/trust instructions before
   running the installer. Hash agreement detects changed bytes; header/magic-byte
   screening does not authenticate a signer, notarisation, provenance or build
   configuration. Native signature/trust qualification belongs to the producer.

GitHub also displays automatically generated source archives for the public
Docflow tag. Those contain the public Docflow repository, are not Clarity
installers, and are outside the attached Clarity payload. Clarity source and
private build evidence are never included in the handoff.

## Maintainer: prepare an offline plan

Keep the producer's reviewed native trust results and source/build mapping in
private records outside the public checkout. Copy only the approved flat public
handoff directory. Do not include archives of source, build logs, credentials,
approval files or private provenance. The consumer enforces the portable schema,
canonical filenames/JSON, complete matrices, text screening, exact byte counts,
hashes and checksum equality. Text screening is a bounded defence; the producer
and reviewer must still check that public notices contain no private material.

```sh
node scripts/release-handoff/cli.mjs plan --directory ./public-candidate --version 1.0.0 --counterpart 0.9.4 --target <public-40-character-commit> --output ./release-plan.json
```

The target is a reviewed **public Docflow commit**, never a private build ref.
The counterpart must equal the three matching package versions in the trusted
checkout. The command performs no network calls and creates its optional output
only if the output path does not already exist. Candidate files stay unchanged.

`payloadSha256` is the SHA-256 of UTF-8, two-space-indented JSON plus a final LF
containing the lexically sorted `{name, size, sha256}` descriptors for **every**
attached file, including the manifest and checksum file. The plan also binds the
product, repository, version, tag, counterpart and target commit. Changing notice
bytes or metadata changes the digest. The implementation holds the complete
candidate in memory to preserve a validated snapshot; allow enough memory for
the full payload. It never executes installer or acquired script content.

## Maintainer: approve and publish only a reviewed payload

Before any live invocation, an authorised operator reviews the exact plan and
the private producer/native trust evidence and explicitly approves publication
of that product/version/tag/digest/target. A valid manifest, a hash supplied by an
untrusted sender or an agent-generated approval file cannot establish that review.
Preparation and a PR approval do not grant live release authority.

For the local command, the operator controls a separate approval JSON file:

```json
{
  "plan": "replace this string with the complete exact reviewed plan object",
  "authorisation": "approve-publication-after-private-producer-and-native-trust-review"
}
```

The string placeholder intentionally fails validation. The actual `plan` must be
the complete generated object, unchanged. This file records the operator's
instruction; it is not an identity certificate. Protect it and the execution
environment, keep it outside the public candidate, and never publish it. With
that approval and existing narrowly scoped publishing access supplied as
`GH_TOKEN`, the future operator may run:

```sh
node scripts/release-handoff/cli.mjs publish --directory ./public-candidate --version 1.0.0 --counterpart 0.9.4 --target <public-40-character-commit> --approval ./release-approval.json
```

The adapter uses GitHub's release/asset APIs, creates a draft with fixed public
text and disabled generated notes, uploads exact buffers, downloads all assets
for comparison, and publishes only after equality. It never requests overwrite,
delete/recreate, automatic repair or a generic latest designation. Release
creation may create the public tag; no separate tagging step is needed.
[GitHub release API](https://docs.github.com/en/rest/releases/releases),
[asset API](https://docs.github.com/en/rest/releases/assets).

### Optional protected workflow

`.github/workflows/clarity-release.yml` is a manually invoked alternative once
the reviewed implementation is on main. It accepts the immutable ID of an
already staged same-repository Actions artifact named `clarity-public-handoff`,
its successful run ID at that exact main commit, version/counterpart and approved
payload digest. The artifact contains only the flat public files. Staging data
into that successful run is a separately authorised transport step; this workflow
does not reach into a private repository or run a producer build. The local
command above accepts a producer directory directly and needs no Actions staging.

The first job has read permissions, checks artifact identity and archive digest,
extracts only bounded flat regular files into a fresh directory, and shows the
validated plan. Acquired scripts, links and escaping paths cannot be executed or
extracted. The second job uses `contents: write` and `actions: read` only, after
the `clarity-publication` environment review. Configure independent required
reviewers, prevent self-review, and restrict that environment to main before use.
The runtime guard rejects absent reviewers or enabled self-review. Reviewers
must compare the preview's exact digest and target to their privately approved
plan and copy the preview's required approval comment into the environment review.
The guard verifies that exact comment in this run's GitHub review history, from a
human other than the initiating/re-running actor; a bypass or missing review is
not approval. Rejected/ambiguous review history requires a fresh reviewed run.
The second job reacquires and revalidates the same immutable artifact;
all third-party actions use reviewed commit pins. No credentials or environment
settings are provisioned by this tooling.
[GitHub environment protection](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments),
[artifact API](https://docs.github.com/en/rest/actions/artifacts).

### Existing releases and interrupted uploads

Every existing asset is downloaded before comparison, including unexpected
assets. An identical already published release with matching public metadata and
tag target returns `identical-no-op`, making no writes. Differing/incomplete sets,
starter assets, existing drafts, orphan tags and metadata/target conflicts fail
with the original release preserved. An upload failure leaves a partial draft;
an uncertain creation response requires inspection by exact tag. A complete
draft is still pending explicit recovery review. Preserve assets and evidence,
inspect the actual remote state and obtain a separate recovery instruction;
never rerun with clobber, delete/recreate, or silently treat a partial set as done.

## After authorised publication

Retain the reviewed candidate and its approval, then run:

```sh
node scripts/release-handoff/cli.mjs verify-public --directory ./public-candidate --version 1.0.0 --counterpart 0.9.4 --target <public-40-character-commit> --approval ./release-approval.json
```

This deliberately ignores ambient credentials, selects the exact Clarity tag,
downloads every attached asset, and compares the bytes and public metadata to
the approved candidate. Record the actual command/result and verify browser
downloads without private access, both product lookup paths and native installer
trust on the downloaded bytes. HTTP mocks, synthetic fixtures and authenticated
upload checks do not satisfy these live criteria. Live public download and native
installation/trust checks remain pending until an authorised release exists.
