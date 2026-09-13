"""Check native Pi ordering for the sequential blocked-wave fixture.

Run alongside check-blocked.py: final refs cannot prove a later item was
never claimed if its claim was subsequently deleted. Only completed native
Bash results count; a model's final narrative is not execution evidence.
"""
import argparse
import json
from pathlib import Path
import re


def inspect(events, alpha, beta):
    calls = {}
    timeline = []
    sequence = 0
    settled = False
    for event in events:
        settled |= event.get('type') == 'agent_settled'
        if event.get('type') != 'message_end':
            continue
        sequence += 1
        message = event.get('message', {})
        if message.get('role') == 'assistant':
            for part in message.get('content', []):
                if part.get('type') == 'toolCall' and part.get('name') == 'bash':
                    calls[part['id']] = part.get('arguments', {}).get('command', '')
            continue
        if message.get('role') != 'toolResult' or message.get('toolName') != 'bash':
            continue
        command = calls.get(message.get('toolCallId'), '')
        output = '\n'.join(p.get('text', '') for p in message.get('content', []) if p.get('type') == 'text')
        kinds = []
        if 'node tools/verify.mjs' in command:
            if re.search(r'^verify: OK \(wave fixture\)$', output, re.M):
                kinds.append('gate_pass')
            if 'ERR_MODULE_NOT_FOUND' in output:
                kinds.append('environment_failure')
        # Match successful native push receipts, including porcelain output.
        for item, label in [(alpha, 'alpha_claim_created'), (beta, 'beta_claim_created')]:
            if any('claim/' + item in line and '[new branch]' in line for line in output.splitlines()):
                kinds.append(label)
        if any(re.search(r'\b(?:HEAD|main)\s*(?:->\s*main\b|:refs/heads/main\b)', line) for line in output.splitlines()):
            kinds.append('main_push')
        if kinds:
            timeline.append({'message_end_sequence': sequence, 'timestamp_ms': message.get('timestamp'),
                             'kinds': kinds, 'command': command, 'output': output})
    occurrences = lambda kind: [e['message_end_sequence'] for e in timeline if kind in e['kinds']]
    passes, failures = occurrences('gate_pass'), occurrences('environment_failure')
    claims, beta_claims = occurrences('alpha_claim_created'), occurrences('beta_claim_created')
    checks = {
        'native_run_settled': settled,
        'base_gate_pass_before_claim': bool(passes and claims) and min(passes) < min(claims),
        'alpha_environment_failure_after_claim': bool(claims and failures) and min(claims) < min(failures),
        'beta_never_claimed': not beta_claims,
        'no_main_push_after_environment_failure': bool(failures) and not any(n > min(failures) for n in occurrences('main_push')),
    }
    return {'checks': checks, 'passed': all(checks.values()), 'timeline': timeline}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('transcript', type=Path)
    parser.add_argument('--alpha', default='0007-alpha')
    parser.add_argument('--beta', default='0008-beta')
    args = parser.parse_args()
    events = []
    for line in args.transcript.read_text(encoding='utf-8').splitlines():
        if line.strip():
            events.append(json.loads(line))
    result = inspect(events, args.alpha, args.beta)
    print(json.dumps(result, indent=2))
    return 0 if result['passed'] else 1


if __name__ == '__main__':
    raise SystemExit(main())
