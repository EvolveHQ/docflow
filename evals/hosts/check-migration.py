from pathlib import Path
import subprocess,json,sys
base=Path(sys.argv[1]).resolve();r=base/'repo';root=r/'.docflow'
def read(p):return p.read_text() if p.is_file() else ''
tip=json.loads((base/'claim.json').read_text())['tip']
remote=subprocess.check_output(['git','ls-remote','origin','refs/heads/claim/0001-example'],cwd=r,text=True)
item=read(root/'plan/todo/0001-example.md')
checks={
 'legacy_files_removed':not any((root/'_agent'/p).exists() for p in ['WORKLOG.md','IN_FLIGHT.md','CURRENT_FOCUS.md','HANDOFF.md','LOCKS.md']),
 'roles_preserved':(root/'_agent/ROLES.md').is_file(),
 'nested_prompt': 'node tools/verify.mjs' in read(root/'_agent/prompts/autonomous.md'),
 'no_root_agent_dir':not (r/'_agent').exists(),
 'live_status_preserved':all(t in item for t in ['## Status','executor-live','Awaiting fixture data']),
 'remote_claim_untouched':remote.split()[0]==tip,
 'union_rule_removed':'merge=union' not in read(r/'.gitattributes'),
 'snapshot_ignore_removed':'CURRENT_FOCUS.md' not in read(r/'.gitignore'),
 'custom_note_preserved':'operator sign-off' in read(r/'OPERATIONS.md'),
 'read_order_updated':'Picking up this repo' in read(r/'AGENTS.md'),
}
gate=subprocess.run(['node','tools/verify.mjs'],cwd=r,text=True,capture_output=True)
checks['gate']=gate.returncode==0
initial=subprocess.check_output(['git','rev-list','--max-parents=0','HEAD'],cwd=r,text=True).strip()
original=subprocess.check_output(['git','show',initial+':tools/verify.mjs'],cwd=r)
checks['gate_unchanged']=original==(r/'tools/verify.mjs').read_bytes()
print(json.dumps({'checks':checks,'passed':all(checks.values()),'gate_stdout':gate.stdout.strip(),'gate_exit':gate.returncode,'commits':subprocess.check_output(['git','log','--oneline','-3'],cwd=r,text=True).strip()},indent=2))
sys.exit(0 if all(checks.values()) else 1)
