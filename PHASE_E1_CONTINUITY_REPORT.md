# Phase E1 Continuity Recovery

Build: **3D-STAGING-PHASE-E1-02**

This package restores the Phase D behaviors that were proven missing from the reconstructed Phase E source:

- Prop Hunt shot revalidation from the actual weapon muzzle.
- Prop Hunt vertically constrained disguise selection.
- Prop Hunt decoys preserve elevated support Y and network playback Y.
- Island Life interactions require world line-of-sight.
- Island Life visitors use swept collision and force path replanning when blocked.
- Island Life scene teardown removes input/resize listeners, animation frame, polling/reconnect timers and WebSocket reconnect activity.
- Shared geometry recovery now handles NaN/invalid transforms and horizontal bounds as well as collider overlap.

The historical Phase D total of 243 tests cannot be recreated exactly because the 37 Phase-D-only test cases were never persisted. This package does **not** claim numerical identity with that historical suite. It restores explicit regression protection for the known lost behaviors while preserving the repaired camera/spawn/controller foundation.

Real-device visual/game-feel QA remains required. The art gap is unchanged: procedural geometry is not treated as finished production artwork.
