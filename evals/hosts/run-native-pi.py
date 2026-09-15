"""Run a source-pinned Pi prompt using an existing isolated local-Qwen home.

Never reads credentials or changes the selected endpoint/model/thinking.
Raw native events can contain model reasoning and stay in private scratch.
"""
import argparse
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import subprocess


def now():
    return datetime.now(timezone.utc).isoformat()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--launcher', type=Path, required=True)
    parser.add_argument('--home', type=Path, required=True)
    parser.add_argument('--fixture', type=Path, required=True)
    parser.add_argument('--prompt', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--timeout', type=int, default=900)
    args = parser.parse_args()
    settings = json.loads((args.home/'settings.json').read_text(encoding='utf-8'))
    expected = {'defaultProvider':'llama-server','defaultModel':'qwen3.8-27b-coding','defaultThinkingLevel':'high'}
    assert all(settings.get(key)==value for key,value in expected.items()), 'Pi source selection must remain local Qwen with native high'
    args.output.mkdir(parents=True, exist_ok=False)
    env = dict(os.environ, PI_CODING_AGENT_DIR=str(args.home.resolve()), PI_TELEMETRY='0', PI_OFFLINE='1')
    argv = ['node',str(args.launcher.resolve()),'--no-session','--mode','json','-p','--approve','--offline']
    receipt = {'host':'pi','platform':os.name,'started_at':now(),'fixture':str(args.fixture.resolve()),'argv':argv,'prompt_file':str(args.prompt.resolve()),'native_defaults':expected,'timeout_seconds':args.timeout,'permission_context':'--approve project trust; no OS sandbox asserted','behavioural_verdict':'pending independent assertions'}
    with (args.output/'transcript.jsonl').open('wb') as out, (args.output/'stderr.txt').open('wb') as err:
        process = subprocess.Popen([*argv,args.prompt.read_text(encoding='utf-8')],cwd=args.fixture,env=env,stdout=out,stderr=err)
        receipt['pid'] = process.pid
        try:
            code = process.wait(timeout=args.timeout)
        except subprocess.TimeoutExpired:
            if os.name=='nt':
                stop = subprocess.run(['taskkill','/PID',str(process.pid),'/T','/F'],capture_output=True,text=True)
                receipt['timeout_stop'] = {'exit':stop.returncode,'stdout':stop.stdout,'stderr':stop.stderr}
            else:
                process.terminate()
            try:
                receipt['native_exit_after_stop'] = process.wait(timeout=15)
                code = 124
            except subprocess.TimeoutExpired:
                receipt['termination'] = 'unverifiable; do not reassign this process'
                code = 125
    receipt.update(host_exit=code,ended_at=now())
    (args.output/'process.json').write_text(json.dumps(receipt,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(receipt))
    raise SystemExit(code)


if __name__=='__main__':
    main()
