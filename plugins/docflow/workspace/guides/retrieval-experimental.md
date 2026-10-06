# Experimental local retrieval recipe

Status: experimental, unrun, optional. Ordinary canonical files remain the
supported baseline. Consider this only after a demonstrated retrieval gap
and an explicit setup/data-scope decision. No installation or network setup
is part of the operating skills.

QMD documents keyword search, collection management and optional local model
retrieval. Its dependencies include Node/Bun, SQLite/native components and,
for semantic modes, model downloads. Check the chosen version's full
requirements and licence before proposing setup; this recipe does not pin an
installed integration. [Primary README](https://github.com/tobi/qmd/blob/main/README.md)
checked 2026-09-15.

For an already installed approved version, verify help, then use a unique
test collection over an authorised scratch COPY of selected records:

```text
qmd collection add "<approved-record-copy>" --name docflow-pilot
qmd search "current agreement" -c docflow-pilot
qmd collection remove docflow-pilot
```

The documented commands create/search/remove index configuration. Removal
must target only that owned collection. Rebuild by adding the same scratch
collection again. Do not run generic update hooks, fetch, embed, model setup
or a server implicitly: those have separate effects and authority.

Before qualification, compare a fixed query set against ordinary reads:
current accepted record, superseded predecessor, stale observation, receipt
and unrelated out-of-scope workspace. Record canonical home/full ID/path,
source revision/hash, index observation time and excerpt. Open canonical
sources and recheck current authority regardless of ranking. Remove/rebuild
the index and verify unchanged canonical file hashes and scoped results.
No result is not proof of no record/claim. Unsupported Windows dependencies,
missing returns or stale results remain explicit; fall back to file reads.

## Status at a glance

- **This run:** Documents an optional experiment and its validation procedure.
- **Overall:** unknown — no retrieval installation or experiment executed.
- **Yet to do:** Version-pinned setup, retrieval, rebuild/removal and privacy
  checks before this recipe may be called supported.

