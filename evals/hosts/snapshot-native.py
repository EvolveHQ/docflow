"""Read exact native fixture files and Git state without judging model text.

Writes a JSON receipt locally. It never reads credential homes or changes the
container. Run before and after the separately invoked native model process.
"""
import argparse
import json
from pathlib import Path
import subprocess


REMOTE = r'''
import pathlib,hashlib,json,subprocess,sys
from datetime import datetime,timezone
roots=json.loads(sys.argv[1])
result={"observed_at":datetime.now(timezone.utc).isoformat(),"roots":{}}
for name in roots:
    root=pathlib.Path(name)
    if not root.is_dir():
        result["roots"][name]={"available":False};continue
    paths={}
    repositories=set()
    for path in sorted(root.rglob("*")):
        parts=path.relative_to(root).parts
        if ".git" in parts:
            if path.name==".git":repositories.add(str(path.parent))
            continue
        if path.is_symlink():
            paths[path.relative_to(root).as_posix()]={"symlink":str(path.readlink())}
        elif path.is_file():
            paths[path.relative_to(root).as_posix()]={"sha256":hashlib.sha256(path.read_bytes()).hexdigest(),"bytes":path.stat().st_size}
    git={}
    for repository in sorted(repositories):
        git[repository]={}
        for label,args in [("head",["rev-parse","HEAD"]),("status",["status","--porcelain=v1"]),("refs",["show-ref"]),("branch",["branch","--show-current"])]:
            proc=subprocess.run(["git","--no-optional-locks","-C",repository,*args],capture_output=True,text=True)
            git[repository][label]={"exit":proc.returncode,"stdout":proc.stdout,"stderr":proc.stderr}
    result["roots"][name]={"available":True,"files":paths,"git":git}
print(json.dumps(result))
'''


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--container', required=True)
    parser.add_argument('--root', action='append', required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    if any(not root.startswith('/workspace/') and not root.startswith('/opt/docflow-source/') for root in args.root):
        parser.error('Only dedicated /workspace/ fixtures and frozen /opt/docflow-source/ assets are in scope')
    proc = subprocess.run(['docker', 'exec', args.container, 'python3', '-c', REMOTE, json.dumps(args.root)], capture_output=True, text=True, encoding='utf-8')
    args.output.parent.mkdir(parents=True, exist_ok=True)
    if proc.returncode:
        args.output.write_text(json.dumps({'container':args.container,'exit':proc.returncode,'stdout':proc.stdout,'stderr':proc.stderr,'outcome':'unavailable snapshot'},indent=2)+'\n',encoding='utf-8')
        raise SystemExit(proc.returncode)
    receipt = json.loads(proc.stdout)
    receipt.update(container=args.container, command=['docker','exec',args.container,'python3','-c','<REMOTE in snapshot-native.py>',json.dumps(args.root)], outcome='read-only observation; compare separately')
    args.output.write_text(json.dumps(receipt,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'container':args.container,'observed_at':receipt['observed_at'],'files':{name:len(item.get('files',{})) for name,item in receipt['roots'].items()},'output':str(args.output)}))


if __name__ == '__main__':
    main()
