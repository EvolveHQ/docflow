"""Regress the wave checker with synthetic Git results, without a model run."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import json
import os
import subprocess
import sys
import tempfile
import unittest


HOSTS = Path(__file__).resolve().parent
SOURCE = HOSTS.parent.parent


class ClaimMetadataTests(unittest.TestCase):
    def check_message(self, template, valid):
        with tempfile.TemporaryDirectory(prefix='docflow-wave-metadata-') as scratch:
            scratch = Path(scratch).resolve()
            self.assertTrue(scratch.is_relative_to(Path(tempfile.gettempdir()).resolve()))
            base = scratch / 'wave'
            repo = base / 'repo'
            env = dict(os.environ, PYTHONUTF8='1',
                       DOCFLOW_PLUGIN_ROOT=str(SOURCE / 'plugins/docflow'))

            def run(*args, cwd=repo):
                return subprocess.run(args, cwd=cwd, env=env, text=True,
                                      encoding='utf-8', capture_output=True, check=True)

            def git(*args):
                return run('git', *args).stdout.strip()

            run(sys.executable, str(HOSTS / 'wave-fixture.py'), str(base), cwd=scratch)
            items = json.loads((base / 'fixture.json').read_text(encoding='utf-8'))['items']
            for item in items[:2]:
                key, slug, number = item['key'], item['slug'], item['adr']
                branch = 'claim/' + key
                plan = repo / 'plan/todo' / (key + '.md')
                plan.write_text(plan.read_text(encoding='utf-8').replace(
                    '- Claimed by:', '- Claimed by: fixture, 2026-09-13, ' + branch),
                    encoding='utf-8')
                git('add', str(plan))
                git('commit', '-qm', 'chore: claim fixture item\n\n' +
                    template.format(branch=branch, key=key, slug=slug))
                source = git('rev-parse', 'HEAD')

                # Materialise a completed result for the external checker. This
                # tests its assertions, not whether a vendor host runs the skill.
                output = repo / 'outputs' / (slug + '.txt')
                output.parent.mkdir(exist_ok=True)
                output.write_bytes((slug + '\n').encode('utf-8'))
                adr = repo / 'adr' / f'{number:04d}-{slug}.md'
                adr.write_text(adr.read_text(encoding='utf-8').replace(
                    'status: Accepted', 'status: Implemented'), encoding='utf-8')
                done = repo / 'plan/done' / f'2026-09-13-{slug}.md'
                done.write_text(plan.read_text(encoding='utf-8').split('## Status')[0] +
                                f'\nShipped at HEAD {source} from {branch}\n', encoding='utf-8')
                plan.unlink()
                rows = []
                for record in items:
                    adr_path = f"adr/{record['adr']:04d}-{record['slug']}.md"
                    status = (repo / adr_path).read_text(encoding='utf-8').split('status: ')[1].splitlines()[0]
                    rows.append(f"| {adr_path} | {status} |")
                (repo / 'INDEX.md').write_text('\n'.join(rows) + '\n', encoding='utf-8')
                git('add', '.')
                git('commit', '-qm', 'feat: complete fixture item\n\nRationale: synthetic result.')
            git('push', '-q', 'origin', 'main')

            result = subprocess.run([sys.executable, str(HOSTS / 'check-wave.py'), str(base)],
                                    cwd=scratch, env=env, text=True, encoding='utf-8',
                                    capture_output=True)
            self.assertIn(result.returncode, (0, 1), result.stderr)
            report = json.loads(result.stdout)
            failed = {name for name, passed in report['checks'].items() if not passed}
            expected = set() if valid else {'alpha_claim_commit_metadata', 'beta_claim_commit_metadata'}
            self.assertEqual(failed, expected)
            self.assertEqual(report['passed'], valid)
            self.assertEqual(result.returncode, 0 if valid else 1)

    def check_messages(self, messages, valid):
        # Each case owns an independent local remote; bound parallelism keeps
        # Windows process-start costs from making this small regression slow.
        with ThreadPoolExecutor(max_workers=3) as executor:
            runs = [(message, executor.submit(self.check_message, message, valid))
                    for message in messages]
            for message, result in runs:
                with self.subTest(message=message):
                    result.result()

    def test_valid_wording(self):
        self.check_messages([
            '{branch}; Reserved identifiers: none; Owned artefacts: outputs/{slug}.txt',
            '{branch}; reserved identifiers: none; owned artefacts: outputs/{slug}.txt',
            '{branch}; reservations: none; owned artefacts: outputs/{slug}.txt',
            '{branch}; ReSeRvAtIoN: none; oWnEd artefacts: outputs/{slug}.txt',
            'For {branch}, no identifiers are reserved. The owned artefacts include outputs/{slug}.txt.',
        ], True)

    def test_missing_metadata(self):
        self.check_messages([
            'Reserved identifiers: none; Owned artefacts: outputs/{slug}.txt',
            '{branch}; Owned artefacts: outputs/{slug}.txt',
            '{branch}; Reserved identifiers: none',
            'CLAIM/{key}; Reserved identifiers: none; Owned artefacts: outputs/{slug}.txt',
        ], False)


if __name__ == '__main__':
    unittest.main()
