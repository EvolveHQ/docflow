# Legacy coordination fixture

This is a separate-worktree layout before coordination migration, with a
non-default artefact root. Copy it to scratch and initialise git plus a
local bare remote. Commit the fixture, push main, then create and push
claim/0001-example with the item's Claimed by set to executor-live. The
dashboard's claim/0002-abandoned has no branch. The queued item disproves
the snapshot's empty queue claim. The custom operator note must survive.

Run audit with cleanup and migration explicitly approved. Verify obsolete
files, their union rule and snapshot ignore entry are removed; the live
owner and blocker remain on the item; paths resolve beneath .docflow;
the run prompt is regenerated; and a second audit has no migration finding.
Never mutate this checked-in fixture in place.
