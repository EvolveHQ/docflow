---
{
  "schema": 1,
  "id": "67890123-6666-4666-8666-666666666666",
  "home": "example/platform",
  "kind": "runs",
  "title": "Imported mobile execution history",
  "owner": "human:owner",
  "created_at": "2026-09-15T09:00:00Z",
  "links": [],
  "state": "succeeded",
  "history": [
    {
      "state": "running",
      "at": "2026-09-15T09:00:00Z",
      "actor": "human:owner",
      "reason": "Imported historic native attempt"
    },
    {
      "state": "succeeded",
      "at": "2026-09-15T09:30:00Z",
      "actor": "human:owner",
      "reason": "Imported native result recorded read-only"
    }
  ],
  "started_at": "2026-09-15T09:00:00Z",
  "ended_at": "2026-09-15T09:30:00Z",
  "brief": null,
  "actions": [],
  "receipt": null,
  "reconciliation": null,
  "predecessors": [],
  "successors": [],
  "import": {
    "imported_at": "2026-09-15T10:00:00Z",
    "observer": "human:owner",
    "evidence": [
      {
        "repository": "example/mobile",
        "path": "evidence.txt",
        "revision": "1111111111111111111111111111111111111111",
        "observed_at": "2026-09-15T09:30:00Z",
        "outcome": "passed",
        "summary": "Synthetic imported observation; not a real host result."
      }
    ],
    "note": "Read-only backfill: this history had no workspace grant and never satisfies a dispatch check."
  }
}
---

# Imported mobile execution history

Template form: use only to backfill execution history that happened under a native mandate. It carries no workspace brief or grant, is read-only, and can never satisfy a dispatch, claim or completion check. Mint a new UUIDv4 and replace all synthetic facts.
