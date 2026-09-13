"""Run an installed vendor CLI in an existing isolated test container.

Authentication is supplied separately at the host's normal path on tmpfs.
This runner never reads credentials. Raw transcripts stay outside the repo.
"""
import argparse,json,subprocess,time,sys
from pathlib import Path

p=argparse.ArgumentParser()
p.add_argument('--host',choices=['claude','codex','pi','opencode'],required=True)
p.add_argument('--container',required=True)
p.add_argument('--fixture',required=True)
p.add_argument('--prompt',type=Path,required=True)
p.add_argument('--output',type=Path,required=True)
p.add_argument('--model')
p.add_argument('--provider',default='github-copilot',help='pi provider; ignored by other hosts')
p.add_argument('--claude-delegation',choices=['none','subagents','workflow'],default='none',help='Explicit fixture opt-in; retains ordinary manual permissions')
p.add_argument('--codex-persist-session',action='store_true',help='Use native session storage on the disposable home tmpfs for subagent dispatch')
p.add_argument('--plugin-dir',default='/opt/docflow-source/plugins/docflow')
p.add_argument('--timeout',type=int,default=900)
a=p.parse_args()
a.output.mkdir(parents=True,exist_ok=True)
prompt=a.prompt.read_text(encoding='utf-8')
commands={
 'claude':['claude','--plugin-dir',a.plugin_dir,'-p','--output-format','stream-json','--verbose','--no-session-persistence','--permission-mode','manual','--allowedTools','Read,Write,Edit,Bash,Skill,Glob,Grep'+(',Agent,ListAgents,TaskOutput,TaskStop,SendMessage' if a.claude_delegation!='none' else '')+(',Workflow' if a.claude_delegation=='workflow' else ''),'--strict-mcp-config','--effort','ultracode' if a.claude_delegation=='workflow' else 'medium'],
 'codex':['codex','exec',*([] if a.codex_persist_session else ['--ephemeral']),'-s','danger-full-access','-c','approval_policy="never"','-m',a.model or 'gpt-6-astra','-c','model_reasoning_effort="medium"','--json','-'],
 'pi':['pi','--provider',a.provider,'--model',a.model or 'gpt-4.1','--thinking','off','--no-session','--mode','json','-p','--approve'],
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
receipt={'host':a.host,'container':a.container,'fixture':a.fixture,'host_exit':code,'seconds':round(time.monotonic()-start,1),'model_requested':a.model,'provider_requested':a.provider if a.host=='pi' else None,'claude_delegation_opt_in':a.claude_delegation if a.host=='claude' else None,'permission_context':{'claude':'manual with explicit fixture tool allowlist','codex':'danger-full-access, approval never, inside disposable container','pi':'project files trusted with --approve; native tool permissions','opencode':'--auto approves permissions not explicitly denied'}[a.host],'behavioural_verdict':'unverified: run independent assertions'}
receipt['codex_session_storage']='native tmpfs home' if a.host=='codex' and a.codex_persist_session else ('ephemeral' if a.host=='codex' else None)
(a.output/'process.json').write_text(json.dumps(receipt,indent=2),encoding='utf-8')
print(json.dumps(receipt))
sys.exit(code)
