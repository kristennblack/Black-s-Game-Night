# W36 Phone QA - Leapfrog Hybrid Production 57

Candidate: `GAME-NIGHT-STAGING-CANDIDATE-W36-LEAPFROG-HYBRID-57`

## First test: normal gameplay

1. Deploy the W36 ZIP to staging.
2. Hard refresh/reopen so the W36 cache-busted Prop Hunt script loads.
3. Open Prop Hunt -> Papa's Shop as Hunter.
4. Confirm you start in/near the main mechanic bay, not an empty distant yard.
5. Confirm the shop is visually full: walls/doors, benches, shelves, tool chests, tractor, motorcycle, clutter and lighting.
6. Walk from the shop to barn and yard. Confirm the full property still exists.

## Fixed visual benchmark

Open:

`/new-games.html?qa3d=1&autostart=1&map=papa&role=hunter&char=john&w36Benchmark=1`

The banner may say the John model is an animation proxy and likeness is not approved. That is intentional and QA-only.

Capture one screenshot from this route without changing the initial camera if possible.

## Gameplay feel

Test:

- slow walk
- jog
- run
- sprint
- stop
- 90-degree turn
- 180-degree redirect
- strafe while aiming
- jump and land
- aim and fire while moving
- camera through shop doors and around tractor/workbenches

Reject if controls, camera or collision got worse even if visuals improved.

## Visual no-regression gate

Reject if any of these occur:

- shop becomes emptier than the older fuller reference
- wall/floor/roof disappears
- tractor/motorcycle/workbench/tool chest/shelving vanishes after an asset load
- obvious hero asset is wildly mis-scaled or floating
- flat single-color scene is worse than the previous fuller build
- new visual asset causes collision/camera failure

## Performance

Play continuously for several minutes. Note severe stutter, device heat, low FPS, texture corruption, context loss or browser reloads.

## Send back

Send the fixed-view screenshot and, if possible, a short screen recording of walk -> sprint -> stop -> turn -> jump -> aim -> fire. That becomes the real W36 visual/gameplay gate evidence.
