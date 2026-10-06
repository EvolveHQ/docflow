"""Export immutable Git blob bytes and verify every installed product file.

This records package identity only; it never claims native discovery/execution.
The destination must be new. No archive or checkout line-ending filters apply.
"""
import argparse
import hashlib
import json
import pathlib
import subprocess
from datetime import datetime, timezone


def sha(data):
    return hashlib.sha256(data).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", required=True)
    parser.add_argument("--destination", type=pathlib.Path, required=True)
    parser.add_argument("--receipt", type=pathlib.Path, required=True)
    args = parser.parse_args()
    revision = subprocess.check_output(["git", "rev-parse", args.source + "^{commit}"]).decode().strip()
    tree = subprocess.check_output(["git", "ls-tree", "-rz", "--full-tree", revision])
    entries = []
    roots = ("plugins/", ".claude-plugin/", ".agents/")
    single = {"package.json", "README.md", "USAGE.md", "LICENSE", "docs/preview.png"}
    for entry in tree.split(b"\0"):
        if not entry:
            continue
        meta, name = entry.split(b"\t", 1)
        mode, kind, oid = meta.decode().split()
        name = name.decode()
        if name.startswith(roots) or name in single:
            if kind != "blob" or mode == "120000":
                raise ValueError("Unsupported package entry: " + name)
            entries.append((name, oid))
    entries.sort()
    output = subprocess.check_output(["git", "cat-file", "--batch"], input="".join(oid + "\n" for _, oid in entries).encode())
    args.destination.mkdir(parents=True, exist_ok=False)
    offset = 0
    files = {}
    digest = hashlib.sha256()
    for name, oid in entries:
        end = output.index(b"\n", offset)
        actual_oid, kind, size = output[offset:end].decode().split()
        assert actual_oid == oid and kind == "blob"
        offset = end + 1
        data = output[offset:offset + int(size)]
        offset += int(size)
        assert output[offset:offset + 1] == b"\n"
        offset += 1
        target = args.destination / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
        actual = target.read_bytes()
        assert data == actual, name
        files[name] = {"git_blob": oid, "sha256": sha(data), "installed_sha256": sha(actual), "bytes": len(data)}
        if name.startswith("plugins/"):
            digest.update(name.encode() + b"\0" + data + b"\0")
    assert offset == len(output)
    skills = sorted(path.split("/")[3] for path in files if path.startswith("plugins/docflow/skills/") and path.endswith("/SKILL.md"))
    assert len(skills) == 13, skills
    version = json.loads((args.destination / "package.json").read_text())["version"]
    for manifest in (".claude-plugin/plugin.json", ".codex-plugin/plugin.json"):
        assert json.loads((args.destination / "plugins/docflow" / manifest).read_text())["version"] == version
    receipt = {
        "observed_at": datetime.now(timezone.utc).isoformat(),
        "source_revision": revision,
        "version": version,
        "status": "development candidate; not released V1",
        "export": str(args.destination.resolve()),
        "method": "git ls-tree -rz and binary git cat-file --batch; byte-for-byte read-back",
        "plugin_digest_sha256": digest.hexdigest(),
        "skills": skills,
        "files": files,
        "native_discovery": "not established by export",
        "clarity_pair": "pending coordinator integrated source/artifact",
    }
    args.receipt.parent.mkdir(parents=True, exist_ok=True)
    args.receipt.write_text(json.dumps(receipt, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"source": revision, "version": version, "files": len(files), "skills": len(skills), "plugin_digest_sha256": digest.hexdigest(), "receipt": str(args.receipt), "outcome": "passed byte identity only"}))


if __name__ == "__main__":
    main()
