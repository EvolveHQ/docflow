---
{
  "schema": 1,
  "id": "56789012-5555-4555-8555-555555555555",
  "home": "example/platform",
  "kind": "runs",
  "title": "Api interrupted",
  "owner": "human:owner",
  "created_at": "2026-09-15T09:00:00Z",
  "links": [],
  "state": "stopped",
  "history": [
    {
      "state": "running",
      "at": "2026-09-15T09:00:00Z",
      "actor": "human:owner",
      "reason": "Dispatch within current synthetic authority"
    },
    {
      "state": "stopped",
      "at": "2026-09-15T10:00:00Z",
      "actor": "human:owner",
      "reason": "Record actual boundary in the fixture"
    }
  ],
  "started_at": "2026-09-15T09:00:00Z",
  "ended_at": "2026-09-15T10:00:00Z",
  "brief": {
    "work": {
      "home": "example/platform",
      "id": "34567890-3333-4333-8333-333333333333",
      "path": ".docflow_workspace/work/deliver-compatible-exports--345678903333.md"
    },
    "delivery": "provider",
    "scope_revision": 1,
    "scope": "Prepare the compatible change under native rules.",
    "exclusions": [
      "No merge, release or deployment by the executor."
    ],
    "actor": "agent:api-first",
    "host": "synthetic-native-host",
    "grant": {
      "work": {
        "home": "example/platform",
        "id": "34567890-3333-4333-8333-333333333333",
        "path": ".docflow_workspace/work/deliver-compatible-exports--345678903333.md"
      },
      "id": "api-first",
      "revision": 1
    },
    "workspace_revision": "1111111111111111111111111111111111111111",
    "base_revision": "1111111111111111111111111111111111111111",
    "native_work": {
      "repository": "example/api",
      "path": "work.md",
      "revision": "1111111111111111111111111111111111111111"
    },
    "claim": {
      "mode": "native",
      "owner": "agent:api-first",
      "state": "held",
      "source": {
        "repository": "example/api",
        "path": "evidence.txt",
        "revision": "1111111111111111111111111111111111111111",
        "observed_at": "2026-09-15T09:00:00Z",
        "outcome": "passed",
        "summary": "Synthetic source-bound observation; not a real host result."
      },
      "observed_at": "2026-09-15T09:00:00Z",
      "expires_at": "2026-09-15T20:00:00Z"
    },
    "dependencies": [],
    "resources": [],
    "required_checks": [
      "native-check"
    ],
    "stop_at": "draft-pr-and-checks-reported",
    "return_path": ".docflow_workspace/runs/api-interrupted--567890125555.md",
    "selected_assets": []
  },
  "actions": [
    {
      "at": "2026-09-15T09:00:00Z",
      "action": "read",
      "summary": "Read current native rules and authority."
    },
    {
      "at": "2026-09-15T09:00:30Z",
      "action": "implement",
      "summary": "Synthetic scoped implementation action."
    }
  ],
  "receipt": {
    "returned_at": "2026-09-15T10:00:00Z",
    "head_revision": "2222222222222222222222222222222222222222",
    "checks": [
      {
        "name": "native-check",
        "command": "synthetic-check --fixture",
        "outcome": "skipped",
        "exit_code": null,
        "output": "Synthetic expected output; no native process was executed.",
        "evidence": []
      }
    ],
    "evidence": [
      {
        "repository": "example/api",
        "path": "evidence.txt",
        "revision": "2222222222222222222222222222222222222222",
        "observed_at": "2026-09-15T10:00:00Z",
        "outcome": "passed",
        "summary": "Synthetic source-bound observation; not a real host result."
      }
    ],
    "blockers": [
      {
        "reason": "Attempt stopped at an explicit boundary.",
        "owner": "human:owner",
        "next_action": "Reconcile before further mutation."
      }
    ],
    "next_action": "Return evidence; parent completion remains independent.",
    "used_assets": []
  },
  "reconciliation": {
    "by": "human:owner",
    "at": "2026-09-15T10:00:00Z",
    "evidence": [
      {
        "repository": "example/api",
        "path": "evidence.txt",
        "revision": "2222222222222222222222222222222222222222",
        "observed_at": "2026-09-15T10:00:00Z",
        "outcome": "passed",
        "summary": "Synthetic source-bound observation; not a real host result."
      }
    ]
  },
  "predecessors": [],
  "successors": [
    {
      "home": "example/platform",
      "id": "67890123-6666-4666-8666-666666666666",
      "path": ".docflow_workspace/runs/api-reassigned--678901236666.md"
    }
  ]
}
---

# Api interrupted

Synthetic example only; no real authority or execution is asserted.
