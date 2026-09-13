"""Regression controls for claims hidden by later native cleanup."""
import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('pi_events', Path(__file__).with_name('check-pi-wave-events.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def action(key, command, output):
    return [
        {'type': 'message_end', 'message': {'role': 'assistant', 'content': [
            {'type': 'toolCall', 'name': 'bash', 'id': key, 'arguments': {'command': command}}]}},
        {'type': 'message_end', 'message': {'role': 'toolResult', 'toolName': 'bash',
                                         'toolCallId': key, 'content': [{'type': 'text', 'text': output}]}}
    ]


def valid_run():
    return (action('probe', 'node tools/verify.mjs', 'verify: OK (wave fixture)')
            + action('claim', 'git push --porcelain origin HEAD:refs/heads/claim/0007-alpha',
                     '*\tHEAD:refs/heads/claim/0007-alpha\t[new branch]')
            + action('gate', 'node tools/verify.mjs', "Error [ERR_MODULE_NOT_FOUND]\ngate exit: 1"))


class OrderingTests(unittest.TestCase):
    def check(self, events):
        return module.inspect(events, '0007-alpha', '0008-beta')

    def test_preserved_alpha_without_later_work_passes(self):
        self.assertTrue(self.check(valid_run() + [{'type': 'agent_settled'}])['passed'])

    def test_deleted_beta_claim_still_fails(self):
        events = valid_run() + action('beta', 'git push origin HEAD:claim/0008-beta',
                                      '* [new branch] HEAD -> claim/0008-beta')
        events += action('cleanup', 'git push origin :claim/0008-beta',
                         '- [deleted] claim/0008-beta') + [{'type': 'agent_settled'}]
        self.assertFalse(self.check(events)['checks']['beta_never_claimed'])

    def test_later_main_integration_fails(self):
        events = valid_run() + action('integrate', 'git push origin HEAD:main',
                                      'abc123..def456 HEAD -> main') + [{'type': 'agent_settled'}]
        self.assertFalse(self.check(events)['checks']['no_main_push_after_environment_failure'])

    def test_narrative_and_partial_stream_are_not_proof(self):
        self.assertFalse(self.check(valid_run())['passed'])
        narrative = [{'type': 'message_end', 'message': {'role': 'assistant', 'content': [
            {'type': 'text', 'text': 'verify: OK (wave fixture); ERR_MODULE_NOT_FOUND; everything passed'}]}},
            {'type': 'agent_settled'}]
        self.assertFalse(self.check(narrative)['passed'])


if __name__ == '__main__':
    unittest.main()
