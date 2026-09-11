"""Run an installed vendor CLI in an existing isolated test container.

Authentication is supplied separately at the host's normal path on tmpfs.
This runner never reads credentials. Raw transcripts stay outside the repo.
"""
import argparse,json,subprocess,time
from pathlib import Path

p=argparse.ArgumentParser()
p.add_argument('--host',choices=['claude','codex','pi','opencode'],required=True)
p.add_argument('--container',required=True)
p.add_argument('--fixture',required=True)
p.add_argument('--prompt',type=Path,required=True)
p.add_argument('--output',type=Path,required=True)
p.add_argument('--model')
p.add_argument('--plugin-dir',default='/opt/docflow-source/plugins/docflow')
p.add_argument('--timeout',type=int,default=900)
a=p.parse_args()
a.output.mkdir(parents=True,exist_ok=True)
prompt=a.prompt.read_text(encoding='utf-8')
commands={
 'claude':['claude','--plugin-dir',a.plugin_dir,'-p','--output-format','stream-json','--verbose','--no-session-persistence','--allowedTools','Read,Write,Edit,Bash,Skill,Glob,Grep','--strict-mcp-config','--effort','medium'],
 'codex':['codex','exec','--ephemeral','-s','danger-full-access','-c','approval_policy="never"','-m',a.model or 'gpt-6-astra','-c','model_reasoning_effort="medium"','--json','-'],
 'pi':['pi','--provider','github-copilot','--model',a.model or 'gpt-4.1','--thinking','off','--no-session','--mode','json','-p','--approve'],
 'opencode':['opencode','run','--model',a.model or 'opencode/big-pickle','--format','json','--auto',prompt],
}
if a.host=='claude' and a.model:commands['claude']+=['--model',a.model]
start=time.monotonic()
with (a.output/'transcript.jsonl').open('w',encoding='utf-8') as out,(a.output/'stderr.txt').open('w',encoding='utf-8') as err:
    process=subprocess.Popen(['docker','exec','-i','-w',a.fixture,a.container,*commands[a.host]],stdin=subprocess.PIPE,stdout=out,stderr=err,text=True,encoding='utf-8')
    try:
        process.communicate(input=prompt if a.host!='opencode' else '',timeout=a.timeout)
        code=process.returncode
    except subprocess.TimeoutExpired:
        # A dedicated container belongs to this one test. Stop it so no model
        # continues acting after a timeout; stopping also drops tmpfs auth.
        subprocess.run(['docker','stop','--timeout','10',a.container],capture_output=True)
        process.kill();process.communicate();code=124
receipt={'host':a.host,'container':a.container,'fixture':a.fixture,'host_exit':code,'seconds':round(time.monotonic()-start,1),'model_requested':a.model,'behavioural_verdict':'unverified: run independent assertions'}
(a.output/'process.json').write_text(json.dumps(receipt,indent=2),encoding='utf-8')
print(json.dumps(receipt))
