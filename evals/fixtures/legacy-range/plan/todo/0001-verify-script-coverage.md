# 0001 — Verify script coverage

Owning ADR: adr/0102-static-verify-script.md

## Scope

Write the static verify script and wire it into the pre-push path:
numbering within each range, index fidelity, status values, section order
per shape.

## Exit criteria

Maps to adr/0102-static-verify-script.md acceptance criteria:

1. Non-zero exit on any violation, naming the file. -> AC1
2. No network access and no installed dependencies. -> AC2
3. Runs before every push. -> AC3

## Dependencies

- adr/0101-markdown-files-in-git.md is already Implemented.
