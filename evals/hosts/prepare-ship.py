"""Prepare one verified pushed fixture claim for an actual ship-item run."""
import argparse,json,subprocess,sys
from pathlib import Path

p=argparse.ArgumentParser(description=__doc__)
p.add_argument('base',type=Path)
p.add_argument('--signed',action='store_true')
a=p.parse_args();base=a.base.resolve();here=Path(__file__).resolve().parent
subprocess.run([sys.executable,str(here/'wave-fixture.py'),str(base),*(['--signed'] if a.signed else [])],check=True)
repo=base/'repo'
def git(*args):return subprocess.check_output(['git',*args],cwd=repo,text=True).strip()
git('switch','-qc','claim/0007-alpha')
item=repo/'plan/todo/0007-alpha.md'
item.write_text(item.read_text().replace('- Claimed by:','- Claimed by: release-fixture, 2026-09-13, claim/0007-alpha'),encoding='utf-8')
git('add','.');git('commit','-qm','test: prepare claim/0007-alpha\n\nWave: release; Reservations: none; Owned: outputs/alpha.txt, adr/0001-alpha.md, plan/todo/0007-alpha.md.')
(repo/'outputs').mkdir();(repo/'outputs/alpha.txt').write_text('alpha\n',encoding='utf-8')
git('add','.');git('commit','-qm','test: implement alpha fixture')
gate=subprocess.run(['node','tools/verify.mjs'],cwd=repo,capture_output=True,text=True)
if gate.returncode:raise SystemExit(gate.stderr)
git('push','-qu','origin','HEAD')
tip=git('rev-parse','HEAD');git('switch','-q','main')
(base/'ship.json').write_text(json.dumps({'verified_claim':tip,'gate_stdout':gate.stdout.strip(),'gate_exit':gate.returncode}),encoding='utf-8')
print(json.dumps({'fixture':str(repo),'claim':'claim/0007-alpha','verified_claim':tip}))
