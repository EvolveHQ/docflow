---
name: validate
description: Give a VERDICT on a goal — did the goal's measure actually move? — in a documentation-led repo with the goals layer. Gathers the measure's current reading against the goal's stated measure, presents the evidence, records the operator's verdict as an append-only outcome entry in the goal file, and applies the goal transition. The verdict is always human. Use when the user says "did it work", "has the goal been achieved", "validate the goal", "is the measure moving", "give a verdict on G-x", or invokes /validate. NOT for checking a change against its acceptance criteria (that is the verify gate, run by /ship-item), NOT for checking the repo against its conventions (use /audit — it checks the record; this checks the world), and NOT for writing goals (use /brainstorm — it writes goal files; this closes them).
---

# validate

Close the loop on one goal: did the measure move? This is the
system's third human gate — the skill **gathers and drafts; the
operator decides**. A verdict is never invented, inferred, or
defaulted.

## Step 0 — Preconditions and context

1. Confirm the repo is bootstrapped **with the goals layer** (a
   `goals/` directory exists). Without it, refuse cleanly and offer
   the bootstrap skill to enable the layer — there is nothing to
   validate.
2. Read `CONVENTIONS.md` §Goals for the outcome-entry format and the
   artefact root; read the `INDEX.md` Goals section and the `Active`
   goal files in full.
3. Identify what is **due**: goals whose `review-by:` date has
   passed with no outcome entry dated after the current arming. The
   audit surfaces these too — if the operator named a goal, validate
   that one whether or not it is due.

## Step 0.5 — Assessment (run first)

Run the shared assessment protocol:

- **Depth selector first.** Ask how deep this assessment should go:
  **express** — every choice takes its recommended default; only
  questions with no derivable default are still asked; **guided** —
  only the high-impact questions plus the essentials; **full** — every
  question. If the repo's `CONVENTIONS.md` records an
  `Assessment depth:`, pre-select it as the recommended option — the
  selector always appears (one narrow exception: when the invocation
  already answers every question the tiers differentiate, skip it and
  say so in one line); a recorded depth is never applied silently.
  At any question the operator may answer "defaults from here" or "go
  deeper"; honour the switch immediately.
- Ask questions **one at a time**, each with a recommended option;
  use structured selection where options are enumerable.

Questions (skip any the request already answers):
1. **Which goal** — the due goal(s), or the one named.
   *Recommended: the longest-overdue due goal.* *(High-impact —
   asked in guided.)*
2. **Reading source** — where to read the measure from, when the
   goal's measure does not already name a `source`. *Recommended:
   per the measure's text.*

## Step 1 — Gather the reading

Read the goal's `## Measure` (and its `baseline` / `threshold` /
`source` sub-fields where present). Collect the **current reading**
from the named source — command output, a report, a count, an
observation — and note exactly what was read and where. **Do not
judge yet.** If the measure cannot be read at all, say so plainly:
that itself argues for an `inconclusive` verdict and possibly a
respecified measure.

## Step 2 — Present and take the verdict

Present: the goal's statement, the measure as written, the baseline
(if recorded), the current reading, and the gap. Then ask the
operator for the **verdict** — structured single-select, exactly
four options, no recommendation strong enough to decide for them:

- **`achieved`** — the measure moved as the goal sought.
- **`not-achieved-execution`** — the work fell short; the goal
  stands.
- **`not-achieved-hypothesis`** — the goal itself was wrong.
- **`inconclusive`** — the reading cannot support a judgement yet.

Then ask the **harm question**, separately and always: *did pursuing
this goal cause harm anywhere — regardless of the verdict?* Harm is
orthogonal: a goal can be achieved and harmful. If yes, take the
finding in one or two sentences and ask for its **disposition**:
rolled back | remediated | respecified | accepted trade-off |
**constraint** — the last routes to the convention skill's
constraint path with its decision gate; **this skill never writes
`CONSTRAINTS.md`.**

## Step 3 — Record the outcome

Append one entry to the goal file's `## Outcomes` section (create
the section on the goal's first outcome; never edit an existing
entry — a correction is a new entry naming what it corrects):

```
### Cycle <n> — <YYYY-MM-DD>
- verdict: achieved | not-achieved-execution | not-achieved-hypothesis | inconclusive
- measure-before: <baseline or prior reading, with source>
- measure-after: <current reading, with source>
- basis: <what was read and where, one or two sentences>
- harm: none | <the finding>
- disposition: <required when harm is not none>
- verdict-by: human: <name>
```

`<n>` is this goal's next ordinal (first outcome = 1).

## Step 4 — Apply the transition

Per the verdict, edit the goal file's front matter:

- `achieved` → `state: Achieved`. The records serving it stand if
  they serve other goals or describe enduring behaviour —
  achievement retires the goal, not its records.
- `not-achieved-execution` → state stays `Active`; offer the
  respecification hand-off (the decision or spec skill, then the
  plan skill).
- `not-achieved-hypothesis` → `state: Retired`; the reason lives in
  the outcome entry.
- `inconclusive` → state stays `Active`; **re-arm `review-by:`** to
  the new date the operator chooses. Note when this is a repeated
  inconclusive — the audit tracks the pattern.

Regenerate the `INDEX.md` Goals section and `COVERAGE.md` to match.

## Step 5 — Commit

Conventional Commit. A goal file is not a decision record, so the
`Rationale:` footer applies only if the same commit touches one.
Where `_agent/` exists, append the WORKLOG row naming the goal,
cycle, and verdict.
