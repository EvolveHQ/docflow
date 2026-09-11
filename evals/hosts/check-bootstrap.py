"""Assert the full, root-layout bootstrap/new-ADR scenario independently."""
from pathlib import Path
import hashlib,json,re,subprocess,sys
r=Path(sys.argv[1]);original=Path(sys.argv[2])
read=lambda p:(r/p).read_text(encoding='utf-8') if (r/p).is_file() else ''
adrs=sorted((r/'adr').glob('[0-9][0-9][0-9][0-9]-*.md'))
adrs=[p for p in adrs if not p.name.startswith('0000-')]
seed=next((p.read_text() for p in adrs if p.name.startswith('0001-')),'')
feature=next((p.read_text() for p in adrs if p.name.startswith('0002-')),'')
gate=subprocess.run(['node','tools/verify.mjs'],cwd=r,text=True,capture_output=True)
required=['AGENTS.md','CLAUDE.md','CONVENTIONS.md','INDEX.md','.docflow','adr/0000-template.md','plan/README.md','_agent/prompts/autonomous.md']
checks={
 'required_files':all((r/p).is_file() for p in required),
 'root_pointer':read('.docflow').strip()=='root: .',
 'two_adrs':[p.name[:4] for p in adrs]==['0001','0002'],
 'seed_implemented':bool(re.search(r'^status: Implemented$',seed,re.M)),
 'new_adr_proposed':bool(re.search(r'^status: Proposed$',feature,re.M)),
 'three_criteria':len(re.findall(r'^\d+\. ',feature.split('## Acceptance criteria')[-1].split('## Out of scope')[0],re.M))==3,
 'index_rows':len(adrs)==2 and all(p.name in read('INDEX.md') for p in adrs),
 'plan_queue':(r/'plan/todo').is_dir() and (r/'plan/done').is_dir(),
 'seed_completion':len(list((r/'plan/done').glob('*.md')))==1,
 'recorded_gate':'node tools/verify.mjs' in read('CONVENTIONS.md'),
 'autonomous_gate':'node tools/verify.mjs' in read('_agent/prompts/autonomous.md'),
 'gate_unchanged':(r/'tools/verify.mjs').read_bytes()==original.read_bytes(),
 'gate':gate.returncode==0,
 'no_obsolete_coordination':not any((r/'_agent'/p).exists() for p in ['ROLES.md','LOCKS.md','WORKLOG.md','CURRENT_FOCUS.md','IN_FLIGHT.md','HANDOFF.md']),
 'reporting_contract':all(t in read('CONVENTIONS.md') for t in ['Status at a glance','This run','Overall','Yet to do']),
}
git=subprocess.run(['git','log','--oneline'],cwd=r,text=True,capture_output=True)
print(json.dumps({'checks':checks,'passed':all(checks.values()),'gate_stdout':gate.stdout.strip(),'gate_exit':gate.returncode,'target_git_complete':git.returncode==0,'commits':git.stdout.strip()},indent=2))
sys.exit(0 if all(checks.values()) else 1)
