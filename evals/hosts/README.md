# Independent vendor-host checks

These tests use actual vendor CLIs in separate Linux Docker containers, or
native editor/desktop sessions with disposable attached target folders. Record
the desktop platform and runtime separately from historical container runs.
The model runs the installed skill; an external process checks the actual
target files and Git state. CLI exit zero is not a test pass.
The normal deterministic suite does not silently run paid model calls.

## Isolation and setup

1. Export a source snapshot containing `plugins/`, the two marketplace
   directories, `package.json`, README and USAGE. Record the Git revision and
   any working-tree changes. Compute SHA-256 over plugin paths relative
   to the snapshot, sorted as case-sensitive POSIX path strings, each followed
   by NUL, file bytes, NUL. Do not sort native filesystem Path objects: their
   ordering differs between Windows and Linux. Compare installed files with
   the snapshot per path as well as comparing the digest. Freeze this snapshot
   for the whole run; never update an installation underneath a running test.
2. Build the selected `Dockerfile` target (`claude`, `codex`, `pi`, `opencode`,
   `grok`, `cursor`, `omp`, `copilot`). Record the actual CLI/desktop version,
   model and image ID; package
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
   the fourteen skills into its created `~/.config/opencode/skills` directory;
   Grok adds the local marketplace and installs `docflow --trust`; Cursor and
   Copilot use `--plugin-dir`; omp installs the npm package.

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

For native Claude tests, explicitly choose `--claude-delegation subagents`
(Agent) or `workflow` (Workflow opt-in through ultracode effort and its tool
allowlist). Both retain ordinary manual permissions. Do not call sequential
execution delegation. Codex native delegation uses `--codex-persist-session`:
the normal ephemeral runner produced a missing-parent-thread error before
dispatch. Native session files stay on the disposable home tmpfs; preserve
sanitised parent/child provenance before cleanup. Codex/OpenCode workers can
be directed into separate Git worktrees without host-enforced isolation;
record that distinction. `--provider` selects a supported pi provider.

Pi preserves its native configured provider, model and thinking level when
the runner's `--provider`, `--model` and `--thinking` flags are omitted.
Explicit flags override only their corresponding selection; the runner does
not inject a cloud fallback or disable thinking. Record requested flags,
isolated native defaults and effective native state separately. The supported
RPC `get_state` command can inspect the selected model/thinking level without
an inference request; preserve only sanitised fields and reasoning counts,
never model thinking text. `python -B evals/hosts/test-run-host.py` checks six
omitted, explicit and partial-override combinations without calling a provider.
It and the eight temporal controls run in the required `verify` CI job.

For an operator-selected local provider, install its native provider extension
in the disposable tmpfs home with the matching native settings. Preserve its
API compatibility options and headers. When the extension uses host loopback,
adapt only that address to a verified route from the container; do not change
the user's settings or model server. Stream any credential-bearing extension
through stdin to its supported tmpfs location, never into an image, command
argument or report. Record sanitised provenance and prove a real tool call
works before running longer fixtures. A failed cloud probe does not make cloud
login a prerequisite for a configured local provider.

- **Bootstrap/new-adr:** initialise an empty main checkout, configure an unsigned
  synthetic Git identity (or configure an ephemeral signing key for signed
  coverage), and provide the unchanged `fixtures/scratch-gate/verify.mjs`
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

### Signed and concurrent coverage

Configure GPG and `commit.gpgsign=true` in the disposable home, then use
`wave-fixture.py <base> --signed --blocked`. The gate passes at the fetched
base and fails only after alpha's output exists. `check-blocked.py <base>
--signed` requires beta to remain unstarted; add `--concurrent` when a native
worker has already started beta. Both claims and the unrelated held claim
must survive without main integration. Existing completion history must
remain byte-identical on the checkout and claims.

To test the complete bootstrap-to-wave path, first independently verify a
native separate-worktree bootstrap, then run
`prepare-bootstrap-wave.py <bootstrap-repo> <new-base>`. It clones that actual
Git history, keeps the scaffold and adoption history, adds three accepted
fixture decisions and a local bare remote, and installs the gate trap before
the model's fresh-checkout probe. Two items are eligible; the third is held.
This fixture extension is preparation, not a claimed model bootstrap.

For sequential Pi blocked runs, also run `check-pi-wave-events.py <transcript>`.
It uses completed native Bash results to detect a beta claim even if later
deleted, prove probe/claim/failure ordering within or across results, and reject
successful pushes to main after failure regardless of their source ref. A main
push anywhere in the failure's Bash result is conservatively rejected because
combined stdout/stderr can obscure ordering. This parser covers the fixture's
gate output and ordinary/porcelain Git push receipts; it complements target
assertions and does not judge arbitrary shell transcripts. Its eight controls
run with `python -B evals/hosts/test-pi-wave-events.py`.

`test-host-assertions.py --bootstrap <verified-full-bootstrap> --gate
<original-gate>` tests eight positive/negative controls, including missing
Git, untracked output, unsigned commits, actual beta work and changed history.
`test-release-assertions.mjs <verified-express-bootstrap>` accepts plain/code/
bold express values and rejects guided/full values. These are checker
regressions, not native-host runs. The synthetic wave checker separately has
nine regression scenarios.

### Explicit release-case mapping

The current release evidence uses these actual vendor-host executions, with
`check-release.mjs <case> <target-repo> <frozen-source>` run outside the model.
Run the corresponding host checker and `reporting.mjs` too where listed.

| Case | Native execution | Independent evidence |
|---|---|---|
| Full bootstrap | Claude Code and Codex, full single-writer profile | `bootstrap-full`; `check-bootstrap.py --signed`, unchanged gate, tracked output, clean signed history |
| Express bootstrap | OpenCode, fixed minimal profile | `bootstrap-express`, exact profile/tree, clean target commit; incidental Markdown tolerated |
| New decision | Claude Code, Codex, OpenCode; Pi with separately repaired separate-worktree bootstrap | `new-adr` / bootstrap checks: exactly seed Implemented plus one Proposed decision, contiguous numbers and linked INDEX metadata |
| Ship item | Claude Code on `prepare-ship.py <base> --signed` | `ship-item`: real claim integration, completion footer ancestor, remote main match, signatures, unchanged beta/held/index statuses |
| Range migration | Codex read-only detection, separately approved map, apply, post-audit | `legacy-range-detect` before apply: hash/HEAD unchanged; `legacy-range` after apply: sections, map, references, INDEX, done bytes preserved |
| Coordination migration | Claude Code on the nested fixture with a live local claim | `legacy-coordination` plus all `check-migration.py` checks, gate unchanged, live ref and custom instructions preserved |
| Wave (additional Workflow case) | Claude Code native rungs 1/2; Codex/OpenCode native rung 2 and sequential blocked controls; Pi rung 3 stop flow with off and native-high thinking, with claim metadata failure retained | `check-wave.py` / `check-blocked.py --signed [--concurrent]`, native tool/session evidence and all item/wave reports; Pi also uses completed-event ordering and published initial-claim checks |

The range post-audit resolved preserved done references through the actual
migration commit and file rename evidence. A fresh negative copy changed the
owner to a nonexistent filename sharing the old number; the real audit
rejected both its link and coverage, and before/after hashes proved it read-only.
Optional hygiene and unrelated fixture findings remain explicit. The first
OpenCode native wave passed state checks but failed its final report; a separate
read-only reporting phase tested the clarified report instructions. It is not
another delegation run or an uninterrupted initial pass.

## Current claim and denial assertions

The separate `results/2026-09-14-release-verification.json` and release audit
record the operator's next continuation on exact Git-blob plugin bytes from
`bef25d8`; the earlier source-pinned observations above remain historical.
Fresh target-state success is scoped separately from native tool chronology,
report format, permission mode and interrupted attempts.

Install `install-claim-observer.py <base>` before a fresh disposable wave. It
records committed ref transactions outside the model checkout and refuses to
overwrite existing evidence. Then run `check-pi-claims.py <base> <transcript>`
after native execution; add `--blocked` for the sequential blocked case. It
checks the first published object, literal branch in message and ownership,
wave/reservations/owned paths, a diff confined to the item's Status section,
signature and a completed acquisition result before the first write call.
A later metadata repair cannot satisfy this check. The observer is evidence,
not a permission boundary. Seventeen controls run with
`python -B evals/hosts/test-pi-claims.py`; the existing six runner and eight
temporal controls remain unchanged.

`node evals/hosts/check-permission-denial.mjs <receipt.json>` judges a focused
native denial case from paired tool events and independent destination hashes.
It requires an explicit denial, no subsequent tool call, unchanged destination
and a truthful stopped report. Twelve controls run with
`node --test evals/hosts/test-permission-denial.mjs`. Historical incomplete
capture remains incomplete even when a particular post-denial failure is
provable. Ordinary gate dependency failure is tested separately from denial.
The seed-reference checker now has 18 controls, including incidental bullet/bold
ownership labels and wrong-file negative cases.

## Evidence and cleanup

Publish sanitised receipts only: source revision/digest, image/version/model,
scenario, permission context, assertions, exact gate output/exit, failures and
unperformed capabilities. Keep raw logs and bundles outside the repository.
After collecting evidence, stop/remove only the named test containers so tmpfs
authentication is discarded. Never prune unrelated Docker resources.

Results are recorded in `results/2026-09-13.json` and the separate continuation
`results/2026-09-13-pi-qwen.json`, with corresponding internal audits. Pi's
original gate-command omission and sequential stop failure remain failures;
native bootstrap repair and a fresh wave retry passed independently with
thinking off. The off positive control failed claim/completion rules; a native
high positive control repeated generation before work and was interrupted.
The first high blocked control recovered after a request timeout, then was
interrupted by the controller; that attempt is inconclusive. The corrective
control settled naturally: stop-flow and acquisition-order checks passed, but
the published initial claim omitted its actual branch name. Judge the published
claim, not an unpublished draft. The receipt retains all controller interventions.
Installed files matched the frozen Windows export byte-for-byte; final Git blobs
match only after CRLF-to-LF normalisation. Both digests and comparisons are recorded.
Passing a subset does not establish a green release suite. Signed local pushes and
native delegation have bounded evidence; hosted GitHub permissions remain
unverified. These statements describe the earlier five-target snapshots;
`results/2026-09-11.json` is also historical.

The final `results/2026-09-14-release-verification.json` assessment covers all
five hosts on exact Git bytes from `bef25d8`. Fresh native-high Pi bootstrap,
normal completion and bootstrap-derived blocked execution pass independent
initial-publication, completed-event, signed-state, persisted-report and
fresh-clone checks. The complete native runs settle naturally. OpenCode's
later wave uses a separately verified native Status-only reporting correction;
that staged result and all failed attempts remain explicit. The exact mapped
full-bootstrap assertion also passes on preserved native Claude Code/Codex
outputs without changing their bytes. No hosted PR or ordinary-manual desktop
permission capability is inferred. Owned runtimes are stopped; public keys and
recoverable histories remain. PR completion and release retain their separate
authorisation requirements.
