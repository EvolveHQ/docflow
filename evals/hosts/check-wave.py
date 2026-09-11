"""Independent assertions over target Git state; never trust the model verdict."""
from pathlib import Path
import subprocess,json,re,hashlib,sys
base=Path(sys.argv[1]).resolve();repo=base/'repo'
def git(*args):return subprocess.check_output(['git',*args],cwd=repo,text=True).strip()
metadata=json.loads((base/'fixture.json').read_text())
items=metadata.get('items',[{'adr':n,'key':f'{n:04d}-{s}','slug':s} for n,s in enumerate(['alpha','beta','held'],1)])
refs=git('ls-remote','origin')
checks={'held_claim_untouched':metadata['held']+'\trefs/heads/claim/'+items[2]['key'] in refs,
        'completed_claims_removed':all('refs/heads/claim/'+item['key'] not in refs for item in items[:2]),
        'two_outputs':all((repo/f'outputs/{s}.txt').is_file() and (repo/f'outputs/{s}.txt').read_bytes()==(s+'\n').encode() for s in ['alpha','beta']),
        'held_output_absent':not (repo/'outputs/held.txt').exists(),
        'only_held_queued':[p.name for p in (repo/'plan/todo').glob('*.md')]==[items[2]['key']+'.md'],
        'operator_checkout_clean':not git('status','--porcelain'),
        'operator_matches_remote':git('rev-parse','HEAD')==next(line.split()[0] for line in refs.splitlines() if line.endswith('refs/heads/main')),
        'owned_worktrees_removed':len(re.findall(r'^worktree ',git('worktree','list','--porcelain'),re.M))==1}
for item in items[:2]:
    n,s,key=item['adr'],item['slug'],item['key']
    adr=(repo/f'adr/{n:04d}-{s}.md').read_text()
    done=list((repo/'plan/done').glob('*'+s+'.md'))
    checks[s+'_implemented']=bool(re.search(r'^status: Implemented$',adr,re.M))
    checks[s+'_done']=len(done)==1 and '## Status' not in done[0].read_text()
    footer=done[0].read_text().split('Shipped')[-1] if done else ''
    sha=re.search(r'\b([0-9a-f]{7,40})\b',footer)
    checks[s+'_footer_reachable']=bool(sha) and subprocess.run(['git','merge-base','--is-ancestor',sha[1],'origin/main'],cwd=repo).returncode==0
    checks[s+'_index_status']=any(f'adr/{n:04d}-{s}.md' in row and 'Implemented' in row for row in (repo/'INDEX.md').read_text().splitlines())
    checks[s+'_footer_claim']='claim/'+key in footer
    history=git('log','--first-parent','--format=%H','origin/main').splitlines()[::-1]
    claimed=[sha for sha in history if subprocess.run(['git','show',sha+':plan/todo/'+key+'.md'],cwd=repo,capture_output=True,text=True).stdout.find('Claimed by:')>=0]
    claim_commits=[sha for sha in claimed if all(t in git('show','-s','--format=%B',sha) for t in ['claim/'+key,'Reserved','Owned'])]
    checks[s+'_claim_commit_metadata']=bool(claim_commits)
gate=subprocess.run(['node','tools/verify.mjs'],cwd=repo,text=True,capture_output=True)
checks['gate']=gate.returncode==0
checks['gate_unchanged']=git('show',metadata['base']+':tools/verify.mjs')==(repo/'tools/verify.mjs').read_text().strip()
if 'items' in metadata:
    checks['independent_plan_numbers']=all(int(i['key'][:4])!=i['adr'] for i in items)
print(json.dumps({'checks':checks,'passed':all(checks.values()),'gate_stdout':gate.stdout.strip(),'gate_exit':gate.returncode,'log':git('log','--oneline','--all','--max-count=15'),'refs':refs},indent=2))
sys.exit(0 if all(checks.values()) else 1)
