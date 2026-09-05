# Agent Locks

**Authoritative for:** which file each writer currently holds. In a
shared checkout this ledger is the one real mutex — nothing else stops
two writers editing the same file at the same time.

Append a row before editing a file. Remove the row on commit. A row is
stale only when a commit by its owner touching that path, made **after
the row's timestamp**, has landed and the row is still here — an older
commit on the same file says nothing about this claim. A row with no
pending change is **not** evidence of staleness: the claim is made
before the edit, so that is exactly what a writer preparing an edit
looks like. Clear someone else's row only on that evidence or once
they have confirmed they are done.

Format: `<agent-id> | <path> | <ISO-8601 timestamp>`

<!-- Written in shared-checkout mode only. Writers in separate
worktrees cannot collide on the filesystem: the pushed branch and its
pull request are the claim, so no lock ledger is written. -->

---
