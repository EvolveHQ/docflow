"""Observe committed local-remote ref changes without changing push outcomes.

Install only in a fresh disposable wave fixture, before native execution.
The append-only receipt lives outside the model's checkout. It is evidence,
not a host security boundary; independently compare it with objects/events.
"""
from pathlib import Path
import argparse

p = argparse.ArgumentParser(description=__doc__)
p.add_argument('base', type=Path)
a = p.parse_args()
base = a.base.resolve()
hook = base / 'origin.git/hooks/reference-transaction'
receipt = base / 'transport.jsonl'
if hook.exists() or receipt.exists():
    raise SystemExit('Refuse to replace an existing observer or receipt')
if not (base / 'fixture.json').is_file():
    raise SystemExit('A prepared disposable wave fixture is required')
receipt.write_text('', encoding='utf-8')
hook.write_text('''#!/usr/bin/env python3
import sys,json,time
from pathlib import Path
if sys.argv[1] == 'committed':
    with Path(RECEIPT).open('a', encoding='utf-8') as out:
        for line in sys.stdin:
            old,new,ref=line.split()
            out.write(json.dumps({'old':old,'new':new,'ref':ref,'observed_ns':time.time_ns()})+'\\n')
'''.replace('RECEIPT', repr(str(receipt))), encoding='utf-8')
hook.chmod(0o755)
print('claim observer installed; fixture transport only')
