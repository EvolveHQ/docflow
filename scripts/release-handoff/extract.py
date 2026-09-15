"""Extract only flat, bounded public data into a new directory; execute nothing."""
from pathlib import Path
import re
import stat
import sys
import zipfile


def extract(archive, destination):
    destination = Path(destination)
    if destination.exists() or destination.is_symlink():
        raise ValueError('destination already exists')
    for ancestor in [destination.parent, *destination.parent.parents]:
        if ancestor.is_symlink():
            raise ValueError('linked destination parent')
    with zipfile.ZipFile(archive) as bundle:
        entries = bundle.infolist()
        if not 1 <= len(entries) <= 1000:
            raise ValueError('invalid entry count')
        names = set()
        total = 0
        for entry in entries:
            mode = entry.external_attr >> 16
            if (not re.fullmatch(r'docflow-clarity_[A-Za-z0-9_.+\-]+', entry.filename)
                    or entry.filename.lower() in names or entry.is_dir()
                    or stat.S_IFMT(mode) not in (0, stat.S_IFREG)
                    or entry.flag_bits & 1 or entry.file_size <= 0):
                raise ValueError('unsafe public archive entry')
            names.add(entry.filename.lower())
            total += entry.file_size
            if entry.file_size > 2 * 1024**3 or total > 16 * 1024**3:
                raise ValueError('public archive exceeds size bound')
        # The entire directory/path table is accepted before filesystem writes.
        destination.mkdir()
        for entry in entries:
            with bundle.open(entry) as source, open(destination / entry.filename, 'xb') as target:
                remaining = entry.file_size
                while block := source.read(min(1024 * 1024, remaining + 1)):
                    remaining -= len(block)
                    if remaining < 0:
                        raise ValueError('archive size mismatch')
                    target.write(block)
                if remaining:
                    raise ValueError('truncated archive')


if __name__ == '__main__':
    try:
        extract(*sys.argv[1:])
    except Exception:
        sys.exit('candidate extraction failed; preserve diagnostic input; no release writes attempted')
