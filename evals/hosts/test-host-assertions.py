"""Mutate a successful host bootstrap copy and a synthetic blocked fixture.

Run in its disposable host container so the synthetic signing key is available.
The supplied bootstrap and all existing host fixtures remain untouched.
"""
import argparse,json,os,shutil,subprocess,sys,tempfile
from pathlib import Path

p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--bootstrap',type=Path,required=True)
p.add_argument('--gate',type=Path,required=True)
a=p.parse_args();here=Path(__file__).resolve().parent
results=[]
def command(argv,cwd=None):
    return subprocess.run(argv,cwd=cwd,text=True,capture_output=True)
def git(repo,*args):
    result=command(['git',*args],repo)
    if result.returncode:raise RuntimeError(result.stderr)
    return result.stdout.strip()
def check(label,script,args,expected,failed_check=None):
    result=command([sys.executable,str(here/script),*map(str,args)])
    data=json.loads(result.stdout)
    assert result.returncode==expected,(label,result.returncode,data)
    assert data['passed']==(expected==0),(label,data)
    if failed_check:assert data['checks'][failed_check] is False,(label,data)
    results.append({'case':label,'checker_exit':result.returncode,'expected_exit':expected,'passed':True})

with tempfile.TemporaryDirectory(prefix='docflow-host-assertions-') as temporary:
    root=Path(temporary)
    for mutation in ['control','missing-git','untracked-file','unsigned-commit']:
        repo=root/mutation;shutil.copytree(a.bootstrap,repo)
        if mutation=='missing-git':
            # Rename only this owned copy's Git directory; never touch the source.
            (repo/'.git').rename(root/'hidden-copy-git')
        elif mutation=='untracked-file':
            git(repo,'rm','--cached','AGENTS.md')
            git(repo,'commit','-qm','test: untrack required target file')
        elif mutation=='unsigned-commit':
            git(repo,'-c','commit.gpgsign=false','commit','--allow-empty','-qm','test: unsigned fixture commit')
        failed={'missing-git':'target_git_history','untracked-file':'target_files_tracked','unsigned-commit':'valid_signatures'}.get(mutation)
        check('bootstrap '+mutation,'check-bootstrap.py',[repo,a.gate,'--signed'],0 if mutation=='control' else 1,failed)

    base=root/'blocked'
    prepared=command([sys.executable,str(here/'wave-fixture.py'),str(base),'--signed','--blocked'])
    assert prepared.returncode==0,prepared.stderr
    repo=base/'repo';key='0007-alpha'
    git(repo,'switch','-qc','claim/'+key)
    item=repo/'plan/todo'/f'{key}.md'
    item.write_text(item.read_text().replace('- Claimed by:','- Claimed by: regression, claim/'+key))
    git(repo,'add','.');git(repo,'commit','-qm','test: claim alpha')
    (repo/'outputs').mkdir();(repo/'outputs/alpha.txt').write_text('alpha\n')
    item.write_text(item.read_text().replace('- Blockers:','- Blockers: ERR_MODULE_NOT_FOUND').replace('- Stopped:','- Stopped: regression fixture'))
    git(repo,'add','.');git(repo,'commit','-qm','test: preserve blocked alpha');git(repo,'push','-qu','origin','HEAD')
    git(repo,'switch','-q','main')
    check('blocked control','check-blocked.py',[base,'--signed'],0)
    diagnostic=base/'scratch/gatetest/outputs';diagnostic.mkdir(parents=True)
    (diagnostic/'beta.txt').write_text('beta\n')
    check('diagnostic beta is not a claimed item','check-blocked.py',[base,'--signed'],0)
    beta=base/'beta-worktree';git(repo,'worktree','add','--detach',str(beta),'main')
    (beta/'outputs').mkdir();(beta/'outputs/beta.txt').write_text('beta\n')
    check('registered worktree beta is rejected','check-blocked.py',[base,'--signed'],1,'beta_no_worktree_output')

print(json.dumps({'passed':True,'cases':results},indent=2))
