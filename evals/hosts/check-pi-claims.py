"""Judge initial published claim objects and completed native tool ordering.

Requires install-claim-observer.py before the run. Never accepts a later
metadata repair as an initially valid claim. Raw model thinking is not emitted.
"""
import argparse
import json
import re
import subprocess
import shlex
from pathlib import Path


def inspect_claim(branch, plan, owned, message, changed, status):
    owner = next((line for line in status.splitlines() if re.search(r'Claimed by', line, re.I)), '')
    return {
        'initial_message_actual_branch': branch in message,
        'initial_message_wave': bool(re.search(r'\bwave\b\s*[:=]\s*\S', message, re.I)),
        'initial_message_reservations': bool(re.search(r'\b(?:reservations?|reserved(?: identifiers)?)\b\s*[:=]\s*\S', message, re.I)),
        'initial_message_owned_paths': all(path in message for path in owned),
        'initial_status_actual_branch': branch in owner,
        'initial_commit_status_only': set(changed) == {plan},
    }


def shell_writes(command, output):
    # Strip only the argument of git commit -m/--message, which is documentary
    # text. Keep shell expansions conservatively visible: they may execute.
    tokens = list(shlex.shlex(command, posix=True, punctuation_chars=';&|<>'))
    executable = []
    is_commit = False
    previous = None
    for token in tokens:
        if previous in ('-m', '--message') and is_commit and '$' not in token and '`' not in token:
            previous = token
            continue
        if token in (';', '&&', '||', '|'):
            is_commit = False
        if token == 'commit' and previous == 'git':
            is_commit = True
        executable.append(token)
        previous = token
    code = ' '.join(executable)
    return output in code and bool(re.search(r'\b(?:printf|echo|tee|cp|mv|touch|sed|python\d*|node)\b|write_text|write_bytes|writeFile', code))


def event_checks(events, keys):
    calls, acquisitions, writes = {}, {}, {}
    settled = False
    for sequence, event in enumerate(events):
        settled |= event.get('type') == 'agent_settled'
        if event.get('type') != 'message_end':
            continue
        message = event.get('message', {})
        if message.get('role') == 'assistant':
            for part in message.get('content', []):
                if part.get('type') != 'toolCall':
                    continue
                calls[part['id']] = (sequence, part)
                name, args = part.get('name'), part.get('arguments', {})
                path = args.get('path', args.get('file_path', ''))
                command = args.get('command', '')
                for key, slug in keys.items():
                    output = 'outputs/' + slug + '.txt'
                    direct = name in ('write', 'edit') and path.replace('\\', '/').endswith(output)
                    shell = name == 'bash' and shell_writes(command, output)
                    if direct or shell:
                        writes.setdefault(key, sequence)
        elif message.get('role') == 'toolResult':
            _, call = calls.get(message.get('toolCallId'), (None, {}))
            if call.get('name') != 'bash' or message.get('isError'):
                continue
            output = '\n'.join(p.get('text', '') for p in message.get('content', []) if p.get('type') == 'text')
            command = call.get('arguments', {}).get('command', '')
            for key in keys:
                dest = 'refs/heads/claim/' + key
                if '--force-with-lease=' + dest + ':' in command and re.search(r'^\*\t[^\t]*:' + re.escape(dest) + r'\t\[new branch\]', output, re.M):
                    acquisitions.setdefault(key, sequence)
    checks = {'native_run_settled': settled}
    for key in keys:
        checks[key + '_acquired_before_first_write_call'] = key in acquisitions and key in writes and acquisitions[key] < writes[key]
    return checks, {'acquisition_result_sequences': acquisitions, 'first_write_call_sequences': writes}


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('base', type=Path)
    p.add_argument('transcript', type=Path)
    p.add_argument('--blocked', action='store_true')
    a = p.parse_args()
    base = a.base.resolve()
    metadata = json.loads((base / 'fixture.json').read_text())
    rows = [json.loads(line) for line in (base / 'transport.jsonl').read_text().splitlines() if line]
    def git(*args):
        return subprocess.check_output(['git', '--git-dir=' + str(base / 'origin.git'), *args], text=True).strip()
    checks, published = {}, {}
    items = metadata['items'][:1 if a.blocked else 2]
    for item in items:
        key, slug = item['key'], item['slug']
        branch = 'claim/' + key
        creations = [row for row in rows if row['ref'] == 'refs/heads/' + branch and set(row['old']) == {'0'}]
        checks[key + '_one_initial_publication'] = len(creations) == 1
        if len(creations) != 1:
            continue
        sha = creations[0]['new']
        plan = 'plan/todo/' + key + '.md'
        owned = [plan, f"adr/{item['adr']:04d}-{slug}.md", 'outputs/' + slug + '.txt']
        message = git('show', '-s', '--format=%B', sha)
        changed = git('diff-tree', '--no-commit-id', '--name-only', '-r', sha).splitlines()
        status = git('show', sha + ':' + plan)
        result = inspect_claim(branch, plan, owned, message, changed, status)
        result['initial_signature_valid'] = git('show', '-s', '--format=%G?', sha) == 'G'
        checks.update({key + '_' + k: v for k, v in result.items()})
        published[key] = {'sha': sha, 'message': message, 'changed': changed}
    if a.blocked:
        checks['beta_never_published'] = not any(row['ref'] == 'refs/heads/claim/' + metadata['items'][1]['key'] for row in rows)
    events = [json.loads(line) for line in a.transcript.read_text(encoding='utf-8').splitlines() if line]
    temporal, sequences = event_checks(events, {item['key']: item['slug'] for item in items})
    checks.update(temporal)
    print(json.dumps({'checks': checks, 'passed': all(checks.values()), 'initial_publications': published, 'sequences': sequences}, indent=2))
    return 0 if all(checks.values()) else 1


if __name__ == '__main__':
    raise SystemExit(main())
