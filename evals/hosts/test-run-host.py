"""Assert that the runner preserves native Pi selection unless overridden.

Intercept the Docker process, not provider configuration: no inference or
credentials are needed, and the actual CLI argument path is exercised.
"""
import json
from pathlib import Path
import runpy
import tempfile
import unittest
from unittest.mock import patch


class PiSelectionTests(unittest.TestCase):
    def launch(self, *selection):
        with tempfile.TemporaryDirectory(prefix='docflow-pi-selection-') as scratch:
            root = Path(scratch)
            prompt = root / 'prompt.txt'
            prompt.write_text('Disposable test prompt', encoding='utf-8')
            output = root / 'results'
            args = ['run-host.py', '--host', 'pi', '--container', 'docflow-test',
                    '--fixture', '/workspace/test', '--prompt', str(prompt),
                    '--output', str(output), *selection]
            with patch('sys.argv', args), patch('subprocess.Popen') as launch, patch('builtins.print'):
                launch.return_value.returncode = 0
                with self.assertRaises(SystemExit) as stopped:
                    runpy.run_path(str(Path(__file__).with_name('run-host.py')), run_name='__main__')
                self.assertEqual(stopped.exception.code, 0)
            return launch.call_args.args[0], json.loads((output / 'process.json').read_text())

    def test_omitted_flags_leave_native_defaults_intact(self):
        command, receipt = self.launch()
        self.assertNotIn('--provider', command)
        self.assertNotIn('--model', command)
        self.assertNotIn('--thinking', command)
        self.assertIsNone(receipt['provider_requested'])
        self.assertIsNone(receipt['model_requested'])
        self.assertIsNone(receipt['thinking_requested'])
        self.assertEqual(receipt['pi_thinking_selection'], 'native configured default')

    def test_explicit_provider_and_model_are_used(self):
        command, receipt = self.launch('--provider', 'fixture-local', '--model', 'fixture-coding')
        self.assertEqual(command[command.index('--provider') + 1], 'fixture-local')
        self.assertEqual(command[command.index('--model') + 1], 'fixture-coding')
        self.assertEqual(receipt['provider_requested'], 'fixture-local')
        self.assertEqual(receipt['model_requested'], 'fixture-coding')

    def test_provider_only_does_not_inject_a_cloud_model(self):
        command, _ = self.launch('--provider', 'fixture-local')
        self.assertEqual(command[command.index('--provider') + 1], 'fixture-local')
        self.assertNotIn('--model', command)

    def test_model_only_does_not_inject_a_cloud_provider(self):
        command, _ = self.launch('--model', 'fixture-local/fixture-coding')
        self.assertEqual(command[command.index('--model') + 1], 'fixture-local/fixture-coding')
        self.assertNotIn('--provider', command)

    def test_thinking_only_preserves_native_provider_and_model(self):
        command, receipt = self.launch('--thinking', 'high')
        self.assertEqual(command[command.index('--thinking') + 1], 'high')
        self.assertNotIn('--provider', command)
        self.assertNotIn('--model', command)
        self.assertEqual(receipt['thinking_requested'], 'high')
        self.assertEqual(receipt['pi_thinking_selection'], 'explicit override')

    def test_explicit_thinking_off_is_retained(self):
        command, receipt = self.launch('--provider', 'fixture-local', '--model', 'fixture-coding', '--thinking', 'off')
        self.assertEqual(command[command.index('--thinking') + 1], 'off')
        self.assertEqual(receipt['thinking_requested'], 'off')
        self.assertEqual(command[command.index('--provider') + 1], 'fixture-local')
        self.assertEqual(command[command.index('--model') + 1], 'fixture-coding')


if __name__ == '__main__':
    unittest.main()
