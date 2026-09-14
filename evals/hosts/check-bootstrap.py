"""Assert the full, root-layout bootstrap/new-ADR scenario independently."""
from pathlib import Path
import argparse,hashlib,json,re,subprocess,sys
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('repo',type=Path)
p.add_argument('original_gate',type=Path)
p.add_argument('--coordination',choices=['single','separate'],default='single')
p.add_argument('--signed',action='store_true')
a=p.parse_args();r=a.repo;original=a.original_gate
read=lambda p:(r/p).read_text(encoding='utf-8') if (r/p).is_file() else ''
conventions=re.sub(r'\s+',' ',read('CONVENTIONS.md').replace('`',''))
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
 'no_obsolete_coordination':not any((r/'_agent'/p).exists() for p in ['LOCKS.md','WORKLOG.md','CURRENT_FOCUS.md','IN_FLIGHT.md','HANDOFF.md']),
 'roles_match_mode':(r/'_agent/ROLES.md').is_file()==(a.coordination=='separate'),
 'requested_coordination':bool(re.search(r'single.writer' if a.coordination=='single' else r'separate.worktrees',read('CONVENTIONS.md'),re.I)),
 'requested_integration':'fast-forward' in conventions and bool(re.search(r'direct.to.main|fast-forward(?:ed)? (?:to|onto) main',conventions,re.I)),
 'reporting_contract':all(t in read('CONVENTIONS.md') for t in ['Status at a glance','This run','Overall','Yet to do']),
}
git=subprocess.run(['git','log','--oneline'],cwd=r,text=True,capture_output=True)
checks['target_git_history']=git.returncode==0 and len(git.stdout.splitlines())>=2
status=subprocess.run(['git','status','--porcelain'],cwd=r,text=True,capture_output=True)
checks['target_git_clean']=status.returncode==0 and not status.stdout.strip()
tracked=subprocess.run(['git','ls-files'],cwd=r,text=True,capture_output=True)
checks['target_files_tracked']=tracked.returncode==0 and all(p in tracked.stdout.splitlines() for p in required+['adr/'+p.name for p in adrs])
if a.signed:
    signatures=subprocess.run(['git','log','--format=%G?'],cwd=r,text=True,capture_output=True)
    checks['valid_signatures']=signatures.returncode==0 and len(signatures.stdout.splitlines())>=2 and all(s=='G' for s in signatures.stdout.splitlines())
    checks['recorded_signing']=bool(re.search(r'\bsigned\b',read('CONVENTIONS.md'),re.I)) and not re.search(r'\bunsigned\b',read('CONVENTIONS.md'),re.I)
seed_command=['node',str(Path(__file__).with_name('check-seed-completion.mjs')),str(r.resolve())]
if a.signed:seed_command.append('--signed')
seed_result=subprocess.run(seed_command,text=True,capture_output=True)
checks['seed_completion_reference']=seed_result.returncode==0
print(json.dumps({'checks':checks,'passed':all(checks.values()),'gate_stdout':gate.stdout.strip(),'gate_exit':gate.returncode,'target_git_complete':checks['target_git_history'] and checks['target_files_tracked'],'commits':git.stdout.strip(),'seed_completion_check':{'command':seed_command,'exit':seed_result.returncode,'stdout':seed_result.stdout.strip(),'stderr':seed_result.stderr.strip()}},indent=2))
sys.exit(0 if all(checks.values()) else 1)
