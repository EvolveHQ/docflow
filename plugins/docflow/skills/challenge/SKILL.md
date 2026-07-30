---
name: challenge
description: Interrogate — pressure-test a DRAFT record, or elicit the boundaries a human has not stated — in a documentation-led repo. Advisory only; writes nothing and gates nothing; hands every finding to the owning writer skill. Use when the user says "poke holes in this", "pressure-test this draft", "grill me", "challenge this", "what are we missing here", "is this solid", or invokes /challenge. NOT for generating candidates from a fuzzy idea (use /brainstorm — it generates, this interrogates), NOT for checking the written record against the conventions (use /audit — it checks what IS, this probes what is proposed or unstated), and NOT for writing any artefact (route findings to /new-adr, /new-spec, /new-plan, /add-convention).
---

# challenge

Interrogate until it is solid — or say plainly that it already is.
This skill is **advisory and write-free**: it produces findings and
hand-offs, never repo artefacts, and no lifecycle transition requires
a challenge pass.

One stance in both modes: **do not accept vague answers; name what is
missing; never invent content to fill a gap.** And the mirror rule:
**"solid — nothing to add" is a first-class outcome.** An interrogator
that always finds three things is noise; manufacture no objections.

## Step 0 — Preconditions and context

1. Confirm the repo is bootstrapped. Read `CONVENTIONS.md` for the
   record model, shapes, and language mandate; read `CONSTRAINTS.md`
   in full if the repo carries one — the boundary scan needs it.
2. Identify the **target**: a draft record (a proposed decision, a
   Draft/Agreed spec, a convention or constraint wording, a plan item)
   → **critique mode**; or the operator's own head ("what haven't we
   written down?") → **elicitation mode**. If ambiguous, ask which.

## Step 0.5 — Assessment (run first)

Run the shared assessment protocol:

- **Depth selector first.** Ask how deep this assessment should go:
  **express** — every choice takes its recommended default; only
  questions with no derivable default are still asked; **guided** —
  only the high-impact questions plus the essentials; **full** — every
  question. If the repo's `CONVENTIONS.md` records an
  `Assessment depth:`, pre-select it as the recommended option — the
  selector always appears; a recorded depth is never applied silently.
  At any question the operator may answer "defaults from here" or "go
  deeper"; honour the switch immediately.
- Ask questions **one at a time**, each with a recommended option; use
  structured selection where options are enumerable.

Questions (skip any the request already answers):
1. **Mode** — critique a draft, or elicit unstated boundaries.
   *Recommended: per the request.* *(High-impact — asked in guided.)*
2. **Target** — which draft (critique), or which categories to walk
   (elicitation; default: all). *Recommended: per the request.*

## Mode A — Critique a draft

Apply the rubric. Report each item as a finding with the exact text it
concerns, or state it holds. The rubric mirrors the gates the
authoring skills already apply inline — this mode makes them
reusable on any draft, before acceptance:

1. **One decision / one capability per record.** If the draft bundles
   several, name the split.
2. **Criteria are testable and observable**, and — in an
   evidence-adopting repo — each names its `Verify:` method. A
   criterion nobody can name a check for is the finding, not a
   formality.
3. **Rationale names real alternatives** with specific rejection
   reasons. "Simpler", "cleaner", "more idiomatic" are findings, not
   rationale. (Capability-shaped records without a Rationale section:
   check the Context carries the forces instead.)
4. **Boundary scan.** Check the draft against every `Active`
   constraint; name any it would violate or strain, by id.
5. **Scope honesty.** Out-of-scope items that the criteria quietly
   depend on; open questions that should block acceptance.

Close with either the findings list (each naming the owning writer to
take it — the decision, spec, plan, or convention skill) or the
explicit verdict: **solid — nothing to add.**

## Mode B — Elicit unstated boundaries

Walk the categories below **one at a time**, asking a concrete
question per category and pressing once on vague answers. Nobody
volunteers these; that is why this mode exists. (The checklist lives
here in the body deliberately — only the scaffolding skill carries
template files.)

1. **Licence / IP** — licences you must not ship or link; ownership
   or attribution obligations.
2. **Privacy and data** — data that must never leave, be stored, or
   be logged; retention limits; anonymisation floors.
3. **Cost ceilings** — spend that must never be exceeded (per call,
   per month, per user).
4. **Latency / performance** — response-time or throughput floors the
   product must never break.
5. **Vendor and dependency** — vendors, registries, or dependencies
   that are banned or mandatory.
6. **Security** — postures that must always hold (no plaintext
   secrets, no unaudited network writes, signing requirements).
7. **Regulatory / compliance** — regimes that bind the product or
   repo (sector rules, audit-evidence obligations, e-signature
   requirements).
8. **Operational limits** — environments, regions, or windows the
   system must never operate outside.

For each boundary surfaced: draft the one-sentence statement and the
check hint, then **route it** — a boundary needs an authorising
decision record, so hand it to the convention skill's constraint path
(which requires the decision, drafting it via the ADR skill when none
exists). **Never write a constraint entry from this skill.** A
category with nothing in it is recorded as asked-and-empty, which is
itself valuable.

## Step 3 — Hand off and stop

Summarise: findings routed (and to which writer), categories
asked-and-empty, and the verdict where the target held. Then stop —
the writers take it from here, each under its own gate. This skill
never follows through into writing.
