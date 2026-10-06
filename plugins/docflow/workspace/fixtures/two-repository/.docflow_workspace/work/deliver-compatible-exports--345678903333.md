---
{
  "schema": 1,
  "id": "34567890-3333-4333-8333-333333333333",
  "home": "example/platform",
  "kind": "work",
  "title": "Deliver compatible exports",
  "owner": "human:owner",
  "created_at": "2026-09-15T08:00:00Z",
  "links": [
    {
      "home": "example/platform",
      "id": "12345678-1111-4111-8111-111111111111",
      "path": ".docflow_workspace/ideas/reliable-exports--123456781111.md"
    },
    {
      "home": "example/platform",
      "id": "23456789-2222-4222-8222-222222222222",
      "path": ".docflow_workspace/decisions/preserve-legacy-response--234567892222.md"
    },
    {
      "home": "example/platform",
      "id": "45678901-4444-4444-8444-444444444444",
      "path": ".docflow_workspace/knowledge/legacy-client-observation--456789014444.md"
    }
  ],
  "state": "active",
  "history": [
    {
      "state": "planned",
      "at": "2026-09-15T08:00:00Z",
      "actor": "human:owner",
      "reason": "Define shared outcome"
    },
    {
      "state": "active",
      "at": "2026-09-15T09:00:00Z",
      "actor": "human:owner",
      "reason": "First scoped assignment starts"
    }
  ],
  "scope_revision": 1,
  "outcome": "Both native changes integrated and combined validation passed.",
  "scope": "Coordinate provider and consumer; preserve compatibility.",
  "exclusions": [
    "No release or deployment."
  ],
  "priority": "high",
  "criteria": [
    {
      "id": "combined",
      "text": "Combined validation passes on both integrated sources.",
      "evidence": []
    }
  ],
  "blockers": [
    {
      "reason": "Mobile attempt revoked before integration",
      "owner": "human:owner",
      "next_action": "Inspect preserved mobile work and decide next scope."
    }
  ],
  "dependencies": [],
  "deliveries": [
    {
      "id": "provider",
      "repository": "example/api",
      "scope_revision": 1,
      "scope": "Prepare the compatible change under native rules.",
      "required": true,
      "native_work": {
        "repository": "example/api",
        "path": "work.md",
        "revision": "1111111111111111111111111111111111111111"
      },
      "required_completion": "merged",
      "depends_on": [],
      "observation": {
        "state": "merged",
        "complete": true,
        "observed_at": "2026-09-15T11:00:00Z",
        "source_revision": "2222222222222222222222222222222222222222",
        "evidence": [
          {
            "repository": "example/api",
            "path": "evidence.txt",
            "revision": "2222222222222222222222222222222222222222",
            "observed_at": "2026-09-15T11:00:00Z",
            "outcome": "passed",
            "summary": "Synthetic source-bound observation; not a real host result."
          }
        ]
      }
    },
    {
      "id": "consumer",
      "repository": "example/mobile",
      "scope_revision": 1,
      "scope": "Prepare the compatible change under native rules.",
      "required": true,
      "native_work": {
        "repository": "example/mobile",
        "path": "work.md",
        "revision": "1111111111111111111111111111111111111111"
      },
      "required_completion": "merged",
      "depends_on": [],
      "observation": {
        "state": "unknown",
        "complete": false,
        "observed_at": null,
        "source_revision": null,
        "evidence": []
      }
    }
  ],
  "grants": [
    {
      "id": "api-first",
      "revisions": [
        {
          "revision": 1,
          "state": "active",
          "delivery": "provider",
          "scope_revision": 1,
          "actor": "agent:api-first",
          "approved_by": "human:owner",
          "approved_at": "2026-09-15T08:20:00Z",
          "mandate": {
            "repository": "example/api",
            "path": "evidence.txt",
            "revision": "1111111111111111111111111111111111111111",
            "observed_at": "2026-09-15T08:00:00Z",
            "outcome": "passed",
            "summary": "Synthetic source-bound observation; not a real host result."
          },
          "actions": [
            "read",
            "implement",
            "test",
            "commit",
            "push",
            "open-draft-pr"
          ],
          "conditions": [
            "Preserve native repository checks and compatibility."
          ],
          "stop_at": "draft-pr-and-checks-reported",
          "valid_from": "2026-09-15T09:00:00Z",
          "expires_at": "2026-09-15T20:00:00Z",
          "recorded_at": "2026-09-15T09:00:00Z",
          "reason": "Synthetic existing mandate recorded."
        },
        {
          "revision": 2,
          "state": "closed",
          "delivery": "provider",
          "scope_revision": 1,
          "actor": "agent:api-first",
          "approved_by": "human:owner",
          "approved_at": "2026-09-15T08:20:00Z",
          "mandate": {
            "repository": "example/api",
            "path": "evidence.txt",
            "revision": "1111111111111111111111111111111111111111",
            "observed_at": "2026-09-15T08:00:00Z",
            "outcome": "passed",
            "summary": "Synthetic source-bound observation; not a real host result."
          },
          "actions": [
            "read",
            "implement",
            "test",
            "commit",
            "push",
            "open-draft-pr"
          ],
          "conditions": [
            "Preserve native repository checks and compatibility."
          ],
          "stop_at": "draft-pr-and-checks-reported",
          "valid_from": "2026-09-15T09:00:00Z",
          "expires_at": "2026-09-15T20:00:00Z",
          "recorded_at": "2026-09-15T10:00:00Z",
          "reason": "Record stopping point or revocation."
        }
      ]
    },
    {
      "id": "api-second",
      "revisions": [
        {
          "revision": 1,
          "state": "active",
          "delivery": "provider",
          "scope_revision": 1,
          "actor": "agent:api-second",
          "approved_by": "human:owner",
          "approved_at": "2026-09-15T08:20:00Z",
          "mandate": {
            "repository": "example/api",
            "path": "evidence.txt",
            "revision": "1111111111111111111111111111111111111111",
            "observed_at": "2026-09-15T08:00:00Z",
            "outcome": "passed",
            "summary": "Synthetic source-bound observation; not a real host result."
          },
          "actions": [
            "read",
            "implement",
            "test",
            "commit",
            "push",
            "open-draft-pr"
          ],
          "conditions": [
            "Preserve native repository checks and compatibility."
          ],
          "stop_at": "draft-pr-and-checks-reported",
          "valid_from": "2026-09-15T10:05:00Z",
          "expires_at": "2026-09-15T20:00:00Z",
          "recorded_at": "2026-09-15T10:05:00Z",
          "reason": "Synthetic existing mandate recorded."
        },
        {
          "revision": 2,
          "state": "closed",
          "delivery": "provider",
          "scope_revision": 1,
          "actor": "agent:api-second",
          "approved_by": "human:owner",
          "approved_at": "2026-09-15T08:20:00Z",
          "mandate": {
            "repository": "example/api",
            "path": "evidence.txt",
            "revision": "1111111111111111111111111111111111111111",
            "observed_at": "2026-09-15T08:00:00Z",
            "outcome": "passed",
            "summary": "Synthetic source-bound observation; not a real host result."
          },
          "actions": [
            "read",
            "implement",
            "test",
            "commit",
            "push",
            "open-draft-pr"
          ],
          "conditions": [
            "Preserve native repository checks and compatibility."
          ],
          "stop_at": "draft-pr-and-checks-reported",
          "valid_from": "2026-09-15T10:05:00Z",
          "expires_at": "2026-09-15T20:00:00Z",
          "recorded_at": "2026-09-15T11:00:00Z",
          "reason": "Record stopping point or revocation."
        }
      ]
    },
    {
      "id": "mobile",
      "revisions": [
        {
          "revision": 1,
          "state": "active",
          "delivery": "consumer",
          "scope_revision": 1,
          "actor": "agent:mobile",
          "approved_by": "human:owner",
          "approved_at": "2026-09-15T08:20:00Z",
          "mandate": {
            "repository": "example/api",
            "path": "evidence.txt",
            "revision": "1111111111111111111111111111111111111111",
            "observed_at": "2026-09-15T08:00:00Z",
            "outcome": "passed",
            "summary": "Synthetic source-bound observation; not a real host result."
          },
          "actions": [
            "read",
            "implement",
            "test",
            "commit",
            "push",
            "open-draft-pr"
          ],
          "conditions": [
            "Preserve native repository checks and compatibility."
          ],
          "stop_at": "draft-pr-and-checks-reported",
          "valid_from": "2026-09-15T11:05:00Z",
          "expires_at": "2026-09-15T20:00:00Z",
          "recorded_at": "2026-09-15T11:05:00Z",
          "reason": "Synthetic existing mandate recorded."
        },
        {
          "revision": 2,
          "state": "revoked",
          "delivery": "consumer",
          "scope_revision": 1,
          "actor": "agent:mobile",
          "approved_by": "human:owner",
          "approved_at": "2026-09-15T08:20:00Z",
          "mandate": {
            "repository": "example/api",
            "path": "evidence.txt",
            "revision": "1111111111111111111111111111111111111111",
            "observed_at": "2026-09-15T08:00:00Z",
            "outcome": "passed",
            "summary": "Synthetic source-bound observation; not a real host result."
          },
          "actions": [
            "read",
            "implement",
            "test",
            "commit",
            "push",
            "open-draft-pr"
          ],
          "conditions": [
            "Preserve native repository checks and compatibility."
          ],
          "stop_at": "draft-pr-and-checks-reported",
          "valid_from": "2026-09-15T11:05:00Z",
          "expires_at": "2026-09-15T20:00:00Z",
          "recorded_at": "2026-09-15T12:00:00Z",
          "reason": "Record stopping point or revocation."
        }
      ]
    }
  ],
  "recommendations": [],
  "next_action": "Reconcile mobile revocation; combined validation remains unperformed."
}
---

# Deliver compatible exports

Synthetic example only; no real authority or execution is asserted.
