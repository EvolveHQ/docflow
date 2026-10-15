---
section: Reference
permalink: /clarity-releases/
title: Package releases
---

# Docflow package releases

Docflow package versions use `v<version>` tags in
[EvolveHQ/docflow](https://github.com/EvolveHQ/docflow/releases).
Select the Docflow package explicitly when looking up a release:

```sh
node scripts/release-handoff/cli.mjs lookup --product docflow
node scripts/release-handoff/cli.mjs lookup --product docflow --version 0.10.0
```

Use the [installation guide](https://github.com/EvolveHQ/docflow#install)
for your coding agent and the [usage guide](https://github.com/EvolveHQ/docflow/blob/main/USAGE.md#8-updating-the-plugin)
to update an existing installation. Keep all fourteen skills and their sibling
workspace assets from the same version.

The [release notes]({{ '/release-notes/' | relative_url }}) describe the package
features. The [qualification reference]({{ '/reference/qualification/' | relative_url }})
explains what deterministic checks establish and where native-host evidence is
required. The [workflow guides]({{ '/workflows/' | relative_url }}) show how to
use Docflow through ordinary files.

<span id="clarity-downloads-and-release-preparation"></span>
<span id="choose-the-product-first"></span>
<span id="pick-the-installer-and-verify-it"></span>
<span id="maintainer-prepare-an-offline-plan"></span>
<span id="maintainer-approve-and-publish-only-a-reviewed-payload"></span>
<span id="optional-protected-workflow"></span>
<span id="existing-releases-and-interrupted-uploads"></span>
<span id="after-authorised-publication"></span>
