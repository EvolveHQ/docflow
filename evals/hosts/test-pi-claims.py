"""Controls for initial-claim metadata and acquisition-before-write evidence."""
import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('claims', Path(__file__).with_name('check-pi-claims.py'))
claims = importlib.util.module_from_spec(spec)
spec.loader.exec_module(claims)
key = '0007-alpha'
branch = 'claim/' + key
plan = 'plan/todo/' + key + '.md'
owned = [plan, 'adr/0001-alpha.md', 'outputs/alpha.txt']


def metadata(**changes):
    values = dict(branch=branch, plan=plan, owned=owned,
                  message='chore: claim\n\nBranch: ' + branch + '\nWave: release\nReservations: none\nOwned: ' + ', '.join(owned),
                  changed=[plan], status='- Claimed by: eval, 2026-09-14, ' + branch)
    values.update(changes)
    return claims.inspect_claim(**values)


def call(id, name, args):
    return {'type': 'message_end', 'message': {'role': 'assistant', 'content': [{'type': 'toolCall', 'id': id, 'name': name, 'arguments': args}]}}


def result(id, text):
    return {'type': 'message_end', 'message': {'role': 'toolResult', 'toolCallId': id, 'content': [{'type': 'text', 'text': text}]}}


def events():
    return [call('push', 'bash', {'command': 'git push --porcelain --force-with-lease=refs/heads/' + branch + ': origin HEAD:refs/heads/' + branch}),
            result('push', '*\tHEAD:refs/heads/' + branch + '\t[new branch]\nDone'),
            call('write', 'write', {'path': '/workspace/wt/outputs/alpha.txt', 'content': 'alpha\n'}),
            result('write', 'written'), {'type': 'agent_settled'}]


class Claims(unittest.TestCase):
    def test_complete_initial_metadata(self):
        self.assertTrue(all(metadata().values()))

    def test_reserved_identifiers_is_equivalent_metadata(self):
        self.assertTrue(metadata(message='Branch: '+branch+'\nWave: release\nReserved identifiers: none\nOwned: '+', '.join(owned))['initial_message_reservations'])

    def test_missing_reservation_value_is_not_metadata(self):
        self.assertFalse(metadata(message='Reserved identifiers:')['initial_message_reservations'])

    def test_later_branch_name_cannot_repair_initial_message(self):
        self.assertFalse(metadata(message='chore: claim\nWave: release\nReservations: none\nOwned: ' + ', '.join(owned))['initial_message_actual_branch'])

    def test_branch_required_in_committed_owner(self):
        self.assertFalse(metadata(status='- Claimed by: eval, 2026-09-14')['initial_status_actual_branch'])

    def test_wrong_plan_extension(self):
        self.assertFalse(metadata(message='Branch: ' + branch + '\nWave: release\nReservations: none\nOwned: ' + ', '.join(owned).replace('.md', '.txt'))['initial_message_owned_paths'])

    def test_initial_commit_cannot_include_output(self):
        self.assertFalse(metadata(changed=[plan, 'outputs/alpha.txt'])['initial_commit_status_only'])

    def test_completed_acquisition_before_write(self):
        self.assertTrue(all(claims.event_checks(events(), {key: 'alpha'})[0].values()))

    def test_write_before_acquisition(self):
        e = events(); e[0], e[2] = e[2], e[0]
        self.assertFalse(all(claims.event_checks(e, {key: 'alpha'})[0].values()))

    def test_batched_push_and_write_rejected(self):
        e = events(); e[0]['message']['content'][0]['arguments']['command'] += '; printf alpha > outputs/alpha.txt'
        self.assertFalse(all(claims.event_checks(e, {key: 'alpha'})[0].values()))

    def test_claim_message_path_is_not_an_output_write(self):
        e=events();e.insert(0,call('commit','bash',{'command':'git commit -m "chore: claim\nOwned: outputs/alpha.txt" && echo message && git show -s --format=%B HEAD'}))
        self.assertTrue(all(claims.event_checks(e, {key: 'alpha'})[0].values()))

    def test_actual_write_after_claim_message_still_detected(self):
        e=events();e.insert(0,call('commit','bash',{'command':'git commit -m "Owned: outputs/alpha.txt" && printf alpha > outputs/alpha.txt'}))
        self.assertFalse(all(claims.event_checks(e, {key: 'alpha'})[0].values()))

    def test_command_substitution_in_message_is_not_ignored(self):
        self.assertTrue(claims.shell_writes('git commit -m "$(printf alpha > outputs/alpha.txt)"', 'outputs/alpha.txt'))

    def test_up_to_date_is_not_acquisition(self):
        e = events(); e[1] = result('push', '=\tHEAD:refs/heads/' + branch + '\t[up to date]')
        self.assertFalse(all(claims.event_checks(e, {key: 'alpha'})[0].values()))

    def test_unsettled_run_is_not_pass(self):
        self.assertFalse(all(claims.event_checks(events()[:-1], {key: 'alpha'})[0].values()))


if __name__ == '__main__':
    unittest.main()
