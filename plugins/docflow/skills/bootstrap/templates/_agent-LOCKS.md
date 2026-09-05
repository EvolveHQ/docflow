# Agent Locks

**Authoritative for:** which file each writer currently holds. In a
shared checkout this ledger is the one real mutex — nothing else stops
two writers editing the same file at the same time.

Append a row before editing a file. Remove the row on commit. A row
that outlives its change is stale; clear it.

Format: `<agent-id> | <path> | <ISO-8601 timestamp>`

<!-- Written in shared-checkout mode only. Writers in separate
worktrees cannot collide on the filesystem: the pushed branch and its
pull request are the claim, so no lock ledger is written. -->

---
