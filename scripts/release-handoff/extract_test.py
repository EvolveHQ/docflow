"""Actual ZIP extraction controls in disposable directories, without network."""
from pathlib import Path
import stat
import subprocess
import sys
import tempfile
import unittest
import zipfile
from extract import extract


class ExtractionTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='docflow-public-extract-')
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.archive = self.root / 'candidate.zip'
        self.destination = self.root / 'public'

    def archive_with(self, entries):
        with zipfile.ZipFile(self.archive, 'w') as bundle:
            for name, content in entries:
                bundle.writestr(name, content)

    def test_exact_binary_bytes_through_actual_command(self):
        content = bytes([0, 255, 13, 10, 128])
        self.archive_with([('docflow-clarity_1.0.0_windows_x64_full.exe', content)])
        result = subprocess.run([sys.executable, '-B', str(Path(__file__).with_name('extract.py')),
                                 str(self.archive), str(self.destination)], capture_output=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(next(self.destination.iterdir()).read_bytes(), content)

    def test_all_invalid_names_reject_before_any_output(self):
        for name in ['../outside', '/absolute', 'C:/escape', 'nested/file', 'nested\\file',
                     'producer.mjs', '.env', 'docflow-clarity_1.0.0:stream', 'docflow-clarity_1.0.0/']:
            with self.subTest(name=name):
                self.archive_with([('docflow-clarity_valid.txt', 'valid'), (name, 'bad')])
                with self.assertRaises(ValueError):
                    extract(self.archive, self.destination)
                self.assertFalse(self.destination.exists())
                self.assertEqual(list(self.root.iterdir()), [self.archive])

    def test_case_collision_rejects_before_output(self):
        self.archive_with([('docflow-clarity_NOTICE.txt', 'a'), ('docflow-clarity_notice.txt', 'b')])
        with self.assertRaises(ValueError):
            extract(self.archive, self.destination)
        self.assertFalse(self.destination.exists())

    def test_symlink_device_and_directory_modes_reject_before_output(self):
        for mode in [stat.S_IFLNK, stat.S_IFCHR, stat.S_IFDIR]:
            with self.subTest(mode=mode):
                info = zipfile.ZipInfo('docflow-clarity_data.txt')
                info.create_system = 3
                info.external_attr = (mode | 0o644) << 16
                self.archive_with([(info, 'untrusted')])
                with self.assertRaises(ValueError):
                    extract(self.archive, self.destination)
                self.assertFalse(self.destination.exists())

    def test_existing_destination_is_preserved(self):
        self.destination.mkdir()
        marker = self.destination / 'keep'
        marker.write_bytes(b'original')
        self.archive_with([('docflow-clarity_data.txt', 'candidate')])
        with self.assertRaises(ValueError):
            extract(self.archive, self.destination)
        self.assertEqual(marker.read_bytes(), b'original')
        self.assertEqual(list(self.destination.iterdir()), [marker])

    def test_invalid_zip_has_no_output(self):
        self.archive.write_bytes(b'not a zip')
        with self.assertRaises(zipfile.BadZipFile):
            extract(self.archive, self.destination)
        self.assertFalse(self.destination.exists())


if __name__ == '__main__':
    unittest.main()
