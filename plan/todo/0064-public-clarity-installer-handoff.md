# 0064 — Public Clarity installer handoff

Owning decision: adr/0056-public-clarity-installer-handoff.md.

## Status

- **Claimed by:** Codex, 2026-09-15, branch `kmox83/docflow-v1-public-releases`.
- **Blockers:** Live payload approval/publication, native trust qualification and
  final operator acceptance are outside this preparation dispatch.
- **Stopped:**

## Dependencies

Reviewed integration `1ede7dc93bf367041e2236e20c07f73266823081` and reviewed public
producer contract. Operator explicitly selects this item before 0061–0063;
their identifiers and qualification scope remain unchanged.

## Scope

Vendor only the five public contract files; implement consumer acceptance,
approval-bound publication, product-specific discovery/download guidance and
disposable boundary controls. Own this task's scripts, workflow, public guidance,
native records and separate gate commits. Private provenance stays in external
scratch/parent records. All Docflow versions stay at matching 0.9.4.

## Local plan before external mutation

1. Commit this decision/claim and regenerate INDEX from metadata; run verify/evals,
   push the signed branch and open the authorised draft PR against
   `kmox83/docflow-v1-integration` before implementation.
2. Read raw binary Git blobs and verify the five pinned hashes before vendoring.
3. Implement an offline `plan` command over a flat public candidate directory. Its
   output binds repository, product/version/tag, counterpart, public target commit,
   filenames, sizes and hashes into an approval digest.
4. Exercise publication only through disposable fake API/command boundaries. A
   future operator reviews producer/native evidence privately and explicitly
   approves that plan before invoking live publication from trusted code.
5. Run gates and workflow checks, push signed changes, prepare the task PR for
   coordinator review and current required CI. No release, tag or main mutation.

## Exit criteria

1. Decision criteria 1–2: exact vendored parity and full rejection matrix pass.
2. Decision criteria 3–4: concrete offline plan and approval binding; staged release,
   read-all retry handling and preservation of every existing conflicting asset.
3. Decision criterion 5: command/API controls pass with mock scope explicit.
4. Decision criterion 6: public guidance selects only the intended product and all
   three unchanged versions agree at 0.9.4.
5. Decision criterion 7: signed clean branch, verify/evals/focused/workflow receipts,
   task PR and current required CI ready for coordinator review.
6. Decision criterion 8: live unauthenticated download/hash verification remains
   pending until separately authorised publication. Native trust and final pilot
   remain separate. Keep this item todo and its decision Accepted until verified
   acceptance and the final checked main completion event.
