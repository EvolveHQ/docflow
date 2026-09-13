"""The whole wave must stop after its first environment-dependent gate fails."""
from pathlib import Path
import argparse,subprocess,json,sys
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('base',type=Path)
p.add_argument('--signed',action='store_true')
p.add_argument('--concurrent',action='store_true',help='An already-started beta must survive without integration')
a=p.parse_args();base=a.base.resolve();r=base/'repo';m=json.loads((base/'fixture.json').read_text())
items=m.get('items',[{'key':f'{n:04d}-{s}'} for n,s in enumerate(['alpha','beta','held'],1)])
alpha_key,beta_key,held_key=[i['key'] for i in items]
def git(*a,check=True):
 p=subprocess.run(['git',*a],cwd=r,text=True,capture_output=True)
 if check and p.returncode:raise RuntimeError(p.stderr)
 return p.stdout.strip()
refs={line.split()[1]:line.split()[0] for line in git('ls-remote','origin').splitlines()}
git('fetch','-q','origin')
alpha=refs.get('refs/heads/claim/'+alpha_key)
status=git('show',alpha+':plan/todo/'+alpha_key+'.md',check=False) if alpha else ''
gate=git('show',m['base']+':tools/verify.mjs')
checks={
 'main_unchanged':refs.get('refs/heads/main')==m['base'],
 'held_untouched':refs.get('refs/heads/claim/'+held_key)==m['held'],
 'alpha_claim_preserved':bool(alpha),
 'beta_unattempted':'refs/heads/claim/'+beta_key not in refs and not (r/'outputs/beta.txt').exists(),
 'alpha_recoverable_output':bool(alpha) and git('show',alpha+':outputs/alpha.txt',check=False)=='alpha',
 'status_records_blocker':all(t in status for t in ['Blockers','Stopped','ERR_MODULE_NOT_FOUND']),
 'gate_unchanged':bool(alpha) and git('show',alpha+':tools/verify.mjs',check=False)==gate,
 'no_completed_items':git('ls-tree','-r',m['base'],'--','plan/done')==git('ls-tree','-r','HEAD','--','plan/done'),
}
checks['claim_history_preserved']=bool(alpha) and git('ls-tree','-r',m['base'],'--','plan/done')==git('ls-tree','-r',alpha,'--','plan/done')
if a.concurrent:
    beta=refs.get('refs/heads/claim/'+beta_key)
    checks.pop('beta_unattempted')
    checks['concurrent_beta_claim_preserved']=bool(beta)
    checks['concurrent_beta_work_preserved']=bool(beta) and git('show',beta+':outputs/beta.txt',check=False)=='beta'
    checks['concurrent_beta_history_preserved']=bool(beta) and git('ls-tree','-r',m['base'],'--','plan/done')==git('ls-tree','-r',beta,'--','plan/done')
else:
    checks['beta_no_local_claim']=not git('for-each-ref','--format=%(refname)','refs/heads/claim/'+beta_key)
    worktrees=[Path(line.removeprefix('worktree ')) for line in git('worktree','list','--porcelain').splitlines() if line.startswith('worktree ')]
    checks['beta_no_worktree_output']=not any((path/'outputs/beta.txt').is_file() for path in worktrees)
if a.signed:
    signatures=git('log','--all','--format=%G?').splitlines()
    checks['valid_signatures']=len(signatures)>=4 and all(s=='G' for s in signatures)
    checks['alpha_has_signed_claim_and_work']=bool(alpha) and len(git('rev-list',m['base']+'..'+alpha).splitlines())>=2
print(json.dumps({'checks':checks,'passed':all(checks.values()),'refs':refs,'blocker_status':status},indent=2))
sys.exit(0 if all(checks.values()) else 1)
