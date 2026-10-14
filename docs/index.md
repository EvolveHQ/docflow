---
title: docflow
---

<h1 id="docflow">Decisions, plans and progress.<br>In your repositories.</h1>
<p class="intro">Docflow helps your coding agent record project decisions, plan work and check what is complete. You use its skills through prompts in your agent. The results live in ordinary files in your repositories.</p>
<span id="claude-code--from-this-marketplace" class="anchor-alias"></span><span id="pi-coding-agent" class="anchor-alias"></span><span id="also-codex-opencode-grok-cursor-omp-copilot" class="anchor-alias"></span>
<div class="home-actions"><a class="button" href="{{ '/start/' | relative_url }}">Start here</a><a id="install" href="{{ '/start/#install' | relative_url }}">Install for your agent →</a></div>
<div class="home-steps">
<section><h2>1. Choose your scope</h2><p>Start with one repository. Add a workspace when work spans several.</p></section>
<section><h2>2. Give your agent a task</h2><p>Use a named skill to record a decision, plan work or read current progress.</p></section>
<section><h2>3. Inspect the result</h2><p>Review the proposed changes and check the evidence before calling work complete.</p></section>
</div>

## Start with a plan you can review

Open your repository in your coding agent after installing Docflow.

{% include prompt.html skill="bootstrap" text="here in guided mode, including a plan queue. Read existing instructions and preserve our current Git rules. Show the setup plan and stop for my review before writing." %}

**You should see:** a summary of what exists, the files Docflow proposes to add or merge, and the working rules it will preserve. The [one-repository guide]({{ '/workflows/single-repository/' | relative_url }}) takes you through the next step.

<p class="support-note">The 0.10.0 package provides fourteen skills for eight coding agents. Full native qualification remains pending; Clarity integration is parked. Read the <a href="{{ '/release-notes/' | relative_url }}">release scope</a>.</p>

<p class="legacy-links"><a id="skills" href="{{ '/reference/skills/' | relative_url }}">Skill catalogue</a> · <a id="portable-workspaces" href="{{ '/workspace/' | relative_url }}">Workspace model</a> · <a id="why" href="{{ '/methodology/' | relative_url }}">Why this method?</a> · <a id="links" href="{{ '/reference/' | relative_url }}">Reference</a></p>
