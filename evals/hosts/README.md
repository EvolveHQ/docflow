# Independent vendor-host checks

These tests use actual vendor CLIs or the Cowork desktop in separate Linux
Docker containers. The model runs the installed skill; an external process
checks the resulting files and Git state. CLI exit zero is not a test pass.
The normal deterministic suite does not silently run paid model calls.

## Isolation and setup

1. Export a source snapshot containing `plugins/`, the two marketplace
   directories, `package.json`, README and USAGE. Record the Git revision and
   any working-tree changes. Compute SHA-256 over sorted plugin paths relative
   to the snapshot, each followed by NUL, file bytes, NUL. Freeze this snapshot
   for the whole run; never update an installation underneath a running test.
2. Build the selected `Dockerfile` target (`claude`, `codex`, `pi`, `opencode`,
   `cowork`). Record the actual CLI/desktop version, model and image ID; package
   pins reproduce the tested versions, while distribution dependencies can vary.
3. Start one container per host, with `/home/node` on tmpfs (uid/gid 1000,
   mode 0700), an owned `/workspace`, and the snapshot mounted read-only at
   `/opt/docflow-source`. Do not mount the real repository, Docker socket or
   an entire host home directory. Limit CPU/memory. Use local bare Git remotes.
4. Authenticate through the host's supported login flow. An existing authorised
   host credential may be streamed through stdin to its normal file on tmpfs;
   never put credentials in an image, command argument, tracked file or receipt.
5. Install through the native facility: Claude `--plugin-dir` points to
   `/opt/docflow-source/plugins/docflow`; Codex adds the local marketplace and
   installs `docflow@evolvehq`; pi installs `/opt/docflow-source`; OpenCode links
   the nine skills into its created `~/.config/opencode/skills` directory.

Example image build: `docker build --target claude -t docflow-host-claude evals/hosts`.
Authentication/provider availability is separate from skill behaviour. Record
rejected or unavailable models explicitly rather than substituting silently.

## CLI runs and assertions

`run-host.py` targets an existing dedicated container. Example:

```text
python evals/hosts/run-host.py --host claude --container docflow-test-claude --fixture /workspace/wave/repo --prompt evals/hosts/wave-prompt.txt --output <scratch-results>
```

The runner records actual process outcomes and keeps raw transcripts in the
supplied scratch directory. Its Claude allowlist permits the fixture tools;
Codex uses unrestricted execution only inside the isolated disposable container.
pi/OpenCode use their native approval mode. Record these permission differences.
On timeout the dedicated container is stopped so the model cannot keep acting.

- **Bootstrap/new-adr:** initialise an empty main checkout, configure an unsigned
  synthetic Git identity, and provide the unchanged `fixtures/scratch-gate/verify.mjs`
  as `tools/verify.mjs`. Supply full depth, root `.`, single writer, direct
  integration, queue and seed enabled, en-GB, no federation/domains, that exact
  gate, and approval for local fixture commits only. Author Proposed decision
  0002, “Export a plain text summary”, with ordered lines, empty input and Unicode
  as its three criteria. Run `check-bootstrap.py <fixture> <original-gate>` from
  outside the model process. Also validate its final report with `reporting.mjs`.
- **Wave:** copy `wave-fixture.py` into the container and run
  `python3 wave-fixture.py /workspace/wave`. It creates two accepted items and
  an unrelated live third claim on a local bare remote. Run `wave-prompt.txt`
  through the installed skill, then `python3 check-wave.py /workspace/wave`.
  Validate three final report blocks (two items and the wave), and inspect
  first-parent claim/completion ordering. Preserve the held claim unchanged.
- **Legacy coordination:** copy `fixtures/legacy-coordination` into a fresh
  owned checkout, initialise/push main to a local bare origin and create the
  documented live claim. Run `migration-prompt.txt`, then `check-migration.py`
  against the fixture parent (which records the original claim tip in
  `claim.json`). Inspect the dry run and repeated audit as well as file checks.
- **Blocked verification:** use a wave fixture whose gate passes initially,
  then imports an unavailable dependency once alpha's output exists. Confirm
  the original main tip remains, beta is not attempted, the gate is unchanged,
  the claim retains recovery/status evidence, and the report says blocked.
  This differs from a failed initial probe, which must stop before any claim.

The assertions are deliberately external to the model's verdict. Preserve
original failures when rerunning a repaired skill. Do not repair a failed
fixture and relabel the original run as passing.

## Cowork desktop

Cowork requires interactive desktop login and native plugin installation.
Use the same plugin ZIP (contents of `plugins/docflow/`, including hidden
manifest directories) through Customise → Plugins → Add → Upload plugin.
Attach the disposable fixture folder, then supply the same bootstrap inputs.
If using a local VNC viewer, bind the published port to 127.0.0.1 only.

Record the actual execution environment. The observed Linux desktop used cloud
execution and a local-folder connector, not a local VM shell. File writes can
succeed while `.git` writes are denied. Verify the selected target separately
from any cloud mirror. A downloaded Git bundle can be independently verified
and compared in another scratch clone; it does not prove target Git integration.
Do not commit desktop screenshots or transcripts containing unrelated chats.

## Evidence and cleanup

Publish sanitised receipts only: source revision/digest, image/version/model,
scenario, permission context, assertions, exact gate output/exit, failures and
unperformed capabilities. Keep raw logs and bundles outside the repository.
After collecting evidence, stop/remove only the named test containers so tmpfs
authentication is discarded. Never prune unrelated Docker resources.

Results for the current audit are recorded in `results/2026-09-11.json` and
the internal audit report. Passing a subset does not establish a green release
suite or prove signed remote pushes, GitHub permissions or delegation rungs.
