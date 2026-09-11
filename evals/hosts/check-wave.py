"""Independent assertions over target Git state; never trust the model verdict."""
from pathlib import Path
import subprocess,json,re,hashlib,sys
base=Path(sys.argv[1]).resolve();repo=base/'repo'
def git(*args):return subprocess.check_output(['git',*args],cwd=repo,text=True).strip()
metadata=json.loads((base/'fixture.json').read_text())
refs=git('ls-remote','origin')
checks={'held_claim_untouched':metadata['held']+'\trefs/heads/claim/0003-held' in refs,
        'completed_claims_removed':all('refs/heads/claim/'+key not in refs for key in ['0001-alpha','0002-beta']),
        'two_outputs':all((repo/f'outputs/{s}.txt').is_file() and (repo/f'outputs/{s}.txt').read_bytes()==(s+'\n').encode() for s in ['alpha','beta']),
        'held_output_absent':not (repo/'outputs/held.txt').exists(),
        'only_held_queued':[p.name for p in (repo/'plan/todo').glob('*.md')]==['0003-held.md'],
        'operator_checkout_clean':not git('status','--porcelain'),
        'operator_matches_remote':git('rev-parse','HEAD')==next(line.split()[0] for line in refs.splitlines() if line.endswith('refs/heads/main')),
        'owned_worktrees_removed':len(re.findall(r'^worktree ',git('worktree','list','--porcelain'),re.M))==1}
for n,s in [(1,'alpha'),(2,'beta')]:
    adr=(repo/f'adr/{n:04d}-{s}.md').read_text()
    done=list((repo/'plan/done').glob('*'+s+'.md'))
    checks[s+'_implemented']=bool(re.search(r'^status: Implemented$',adr,re.M))
    checks[s+'_done']=len(done)==1 and '## Status' not in done[0].read_text()
    footer=done[0].read_text().split('Shipped')[-1] if done else ''
    sha=re.search(r'\b([0-9a-f]{7,40})\b',footer)
    checks[s+'_footer_reachable']=bool(sha) and subprocess.run(['git','merge-base','--is-ancestor',sha[1],'origin/main'],cwd=repo).returncode==0
    checks[s+'_index_status']=any(f'adr/{n:04d}-{s}.md' in row and 'Implemented' in row for row in (repo/'INDEX.md').read_text().splitlines())
    checks[s+'_footer_claim']=f'claim/{n:04d}-{s}' in footer
gate=subprocess.run(['node','tools/verify.mjs'],cwd=repo,text=True,capture_output=True)
checks['gate']=gate.returncode==0
checks['gate_unchanged']=git('show',metadata['base']+':tools/verify.mjs')==(repo/'tools/verify.mjs').read_text().strip()
print(json.dumps({'checks':checks,'passed':all(checks.values()),'gate_stdout':gate.stdout.strip(),'gate_exit':gate.returncode,'log':git('log','--oneline','--all','--max-count=15'),'refs':refs},indent=2))
sys.exit(0 if all(checks.values()) else 1)
