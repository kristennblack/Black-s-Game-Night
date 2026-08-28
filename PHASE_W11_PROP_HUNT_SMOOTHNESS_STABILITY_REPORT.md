# PHASE W.11 — PROP HUNT SMOOTHNESS + STABILITY REPORT

Release: `GAME-NIGHT-STAGING-PHASE-W11-PROP-HUNT-SMOOTHNESS-STABILITY-35`
Design: `GAME-NIGHT-DESIGN-PHASE-W11-PROP-HUNT-SMOOTHNESS-STABILITY-35`
Date: 2026-08-27

## Scope

W.11 deliberately pauses Prop Hunt content expansion and strengthens the current Three.js/JavaScript runtime underneath John + Papa's Shop.

## Implemented runtime foundation

### Simulation + presentation
- Added shared fixed-step runner at 60 Hz with long-frame clamp and bounded catch-up.
- Prop Hunt gameplay simulation now advances on fixed steps.
- Local/host-simulated actor render roots interpolate between previous/current simulation state.
- Explicit teleports/recovery reset interpolation state instead of visually lerping through walls.

### Camera
- Added resolved camera-distance hysteresis.
- Camera retracts quickly under obstruction and waits for stable clearance before expanding more gradually.
- Existing multi-sample camera candidate solve is preserved.
- Sustained camera collapse resets the camera without automatically treating the player body as invalid.

### Collision/recovery
- Collider metadata now supports independent `blocksPlayer`, `blocksCamera` and `blocksVision` responsibilities.
- Player stability layer records grounded collision-free last-known-safe transforms.
- Invalid/non-finite/out-of-bounds/embedded states prefer last-known-safe recovery before a radial search.
- Recovery zeros stale velocity and resets camera/interpolation state.

### Prop Hunt transformations
- Disguise validates available space before committing and refuses/adjusts unsafe placement.
- Failed disguise does not intentionally become an embedded prop.
- Decoy placement searches for nearby safe positions.
- Network decoy requests are constrained near the sender's live server-known position.

### Frame pacing / allocations
- Added capped reusable effect pool and shared common effect geometry.
- Rapid shot/impact/transform/flash effects reuse pooled objects rather than continuously constructing complete effect graphs.
- Effect budget scales by quality tier.
- Reused scratch vectors/raycasters in several hot camera/aim/shoot/LOS paths.
- Camera right-vector scratch no longer allocates once per camera update.

### Dynamic quality
- Performance governor uses smoothed FPS and adjusts render pixel ratio.
- Adds high/medium/low quality tiers.
- Lowest tier reduces effect budget and expensive dynamic shadows and may hide marked nonessential decoration.

### Browser lifecycle
- Background/resume clears stale held input and resets fixed-step timing.
- WebGL context loss is intercepted; context restore resets timing/view rather than replaying a giant frame.

### QA
- QA overlay includes fixed-step interpolation/recovery data.
- Added recent p95 frame time and recent peak frame time alongside FPS.
- Existing draw calls/triangles/pixel ratio/quality information remains visible.

## Existing systems intentionally preserved
- substep movement collision;
- camera-relative acceleration/braking;
- coyote time and jump buffer;
- variable jump height;
- mantle validation;
- upper/lower animation layering and foot IK;
- W.7 approved-John fallback, correct weapon grip, shot ray/muzzle validation and visible tracer/impact;
- remote `SnapshotBuffer` interpolation;
- ~10 Hz movement snapshot transmission;
- W.8 tutorials/tokens store and all tabletop/card fixes.

## Required future work — NOT claimed complete

These items from the W.11 professional plan need authored assets, a larger protocol change or real hardware:
- authored approved family GLB LOD0/LOD1/LOD2 sets;
- 1–3 material/atlas optimization for final characters;
- Papa's Shop repeated-prop instancing/batching in the final authored environment;
- final baked/static shadow-lighting pipeline;
- broader occlusion/significance optimization on final map assets;
- formal server-authoritative prediction/reconciliation sequencing beyond current immediate local movement + remote snapshot interpolation;
- measured iPhone/Safari and Android/Chrome p95 frame-time gate;
- pinned/self-hosted core Three.js production dependency.

## Release criterion

Automated code validation is necessary but cannot mark W.11 visually approved. Use `PHONE_QA_PHASE_W11_PROP_HUNT_SMOOTHNESS_STABILITY_35.md` on a real phone.

## Automated release validation

Working-tree validation after the W.11 changes:
- full Node regression suite: **484/484 passed, 0 failed**;
- staging validator: **211 passed, 2 environment warnings, 0 failed**;
- known warnings: core Three.js/addon CDN dependency remains; live Wrangler/Cloudflare deployment cannot be verified in this environment.

The exact packaged ZIP must still be cold-extracted and rerun through these gates before delivery.
