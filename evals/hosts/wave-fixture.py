"""Create a disposable local-remote wave fixture inside a test container."""
from pathlib import Path
import subprocess, json, sys, re

base = Path(sys.argv[1]).resolve()
if base.exists(): raise SystemExit('Refuse to overwrite an existing fixture')
base.mkdir(parents=True)
repo = base / 'repo'
repo.mkdir()
def git(*args, cwd=repo):
    return subprocess.check_output(['git', *args], cwd=cwd, text=True).strip()
def write(p, text):
    p=repo/p; p.parent.mkdir(parents=True,exist_ok=True); p.write_text(text,encoding='utf-8')
git('init','-q','-b','main')
git('config','user.name','docflow-eval')
git('config','user.email','eval@example.invalid')
git('config','commit.gpgsign','false')
write('.docflow','root: .\n')
write('AGENTS.md','''# Wave test
Read CONVENTIONS.md, INDEX.md, the queue item and owning ADR, then
_agent/prompts/autonomous.md. This disposable fixture authorises local
unsigned commits and pushes only to its local bare origin. Keep the gate
unchanged. Do not install dependencies or use external services.
''')
write('CONVENTIONS.md','''# Conventions
Artefact root: .
Language: en-GB. Single capability shape, contiguous ADR numbering.
Lifecycle: Proposed → Accepted → Implemented → Superseded or Deprecated.
Mode: several writers, separate worktrees. Integration: direct-to-main,
fast-forward only, serial integration through ship-item integrating mode.
Remote: origin; integration branch: main. This is a local bare test remote,
not GitHub; there are no PRs or required GitHub checks in this fixture.
Gate: node tools/verify.mjs (fresh-checkout capable, no installation).
Conventional Commits; unsigned synthetic commits; mandatory Rationale footer
when touching an ADR; no tags or Co-Authored-By trailer.
Claim branches use create-only lease and porcelain new-ref proof. Live claims
are excluded unless explicitly continued. Item Status records actor, date,
actual branch, Blockers and Stopped. Completion moves todo to dated done,
removes Status, advances the owning ADR to Implemented, regenerates INDEX,
and records a reachable work HEAD. A successful main push completes the item.
Report Status at a glance with This run, Overall and Yet to do; distinguish
item outcome from Overall (implemented, partially verified, verified,
blocked, failed, unknown). Preserve other owners' claims.
''')
source=Path('/opt/docflow-source/plugins/docflow/skills/bootstrap/templates/_agent-prompts-autonomous.md').read_text()
keep={'SEPARATE WORKTREES','DIRECT INTEGRATION'}
source=re.sub(r'<!-- (SEPARATE WORKTREES|SHARED CHECKOUT|SINGLE WRITER|PR START|DIRECT INTEGRATION|PR INTEGRATION)\n([\s\S]*?)-->',lambda m:m[2].strip() if m[1] in keep else '',source)
source=re.sub(r'<!--[\s\S]*?-->','',source).replace('<command from Q8>','node tools/verify.mjs')
write('_agent/prompts/autonomous.md',source)
write('_agent/ROLES.md','# Roles\nEach executor owns only the named item and its output.\n')
write('plan/README.md','# Plan\nSee CONVENTIONS.md for status and completion.\n')
write('adr/0000-template.md','# Template\nUse the existing capability shape.\n')
(repo/'plan/done').mkdir()
write('plan/done/.gitkeep','')
rows=[]
for n,slug in enumerate(['alpha','beta','held'],1):
    key=f'{n:04d}-{slug}'
    write('adr/'+key+'.md',f'''---
adr: {n:04d}
title: Write {slug}
status: Accepted
date: 2026-09-11
owner: docflow-eval
depends-on: []
---
# Write {slug}

## Context
A deterministic wave test needs a small independent item.
## Capability statement
Write outputs/{slug}.txt as UTF-8 containing exactly {slug} followed by LF.
## User stories / scenarios
The evaluator reads the output independently.
## Acceptance criteria
1. outputs/{slug}.txt contains exactly `{slug}\\n`.
2. The recorded gate passes unchanged.
## Out of scope
Any other output or decision.
## Open questions
None.
## References
CONVENTIONS.md
## Revision History
| Date | Revision | Author | Change |
|---|---|---|---|
| 2026-09-11 | r1 | docflow-eval | Test decision accepted. |
## Approvals
| Role | Name | Date | Signature |
|---|---|---|---|
| Operator | docflow-eval | 2026-09-11 | Fixture approval |
''')
    write('plan/todo/'+key+'.md',f'''# {key}

Owning ADR: adr/{key}.md
## Scope
Create outputs/{slug}.txt; honour the owning ADR and gate.
## Exit criteria
1. Output bytes match the owning ADR.
2. Gate passes; complete the item using the recorded direct profile.
## Status
- Claimed by:
- Blockers:
- Stopped:
''')
    rows.append(f'| [{n:04d}](adr/{key}.md) | Write {slug} | Accepted | 2026-09-11 | — |')
write('INDEX.md','# ADR Index\n\n| ADR | Title | Status | Date | Depends on |\n|---|---|---|---|---|\n'+'\n'.join(rows)+'\n')
write('tools/verify.mjs', '''import {existsSync,readFileSync} from 'node:fs';
for (const name of ['alpha','beta','held']) {
  const p='outputs/'+name+'.txt';
  if(existsSync(p)&&readFileSync(p,'utf8')!==name+'\\n') throw Error('wrong output: '+p);
}
console.log('verify: OK (wave fixture)');
''')
git('add','.')
git('commit','-qm','test: initialise independent wave fixture\n\nRationale: synthetic accepted decisions.')
git('init','-q','--bare','--initial-branch=main',str(base/'origin.git'))
git('remote','add','origin',str(base/'origin.git'))
git('push','-qu','origin','main')
git('switch','-qc','claim/0003-held')
p=repo/'plan/todo/0003-held.md';p.write_text(p.read_text().replace('- Claimed by:','- Claimed by: executor-other, 2026-09-11, claim/0003-held'),encoding='utf-8')
git('add','plan/todo/0003-held.md')
git('commit','-qm','chore: claim held fixture\n\nWave: other; Reservations: none; Owned: outputs/held.txt, adr/0003-held.md, plan/todo/0003-held.md.')
git('push','-q','origin','HEAD')
held=git('rev-parse','HEAD')
git('switch','-q','main')
(base/'fixture.json').write_text(json.dumps({'held':held,'base':git('rev-parse','HEAD')}),encoding='utf-8')
print(json.dumps({'fixture':str(repo),'held':held}))
