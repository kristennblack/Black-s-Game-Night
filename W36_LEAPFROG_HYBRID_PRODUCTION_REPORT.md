# Black Family Game Night - W36 Leapfrog Hybrid Production Report

Candidate: `GAME-NIGHT-STAGING-CANDIDATE-W36-LEAPFROG-HYBRID-57`
Official release remains W30 until real-device visual/gameplay approval.

## Why W36 exists

W31/W32-era Prop Hunt had more complete visible shop/world coverage, while later W34/W35 work improved movement, animation and production architecture but could leave the live scene visually sparser. W36 changes the production rule from whole-layer replacement to a no-regression hybrid ratchet.

## What changed

- Restored the full Phase V Papa property as the default Papa's Shop world: approximately 51.6 m x 41.6 m, about 8.31x the original playable footprint.
- Kept the complete mechanic shop, barn, animal pens, yard, lumber/material storage, hundreds of gameplay props, interactions, climbable routes and environmental context.
- Moved the main hero repair tractor and motorcycle into the mechanic bay so normal spawn immediately reads as a working shop.
- Moved normal Papa spawn into the main shop rather than the sparse rear yard.
- Preserved W30 controls/physics, W34 locomotion/turn/aim/landing improvements, and W35 authored-asset/material architecture.
- Added `w36-leapfrog-visuals.mjs`.
- Added a per-slot visual promotion gate for tractor, motorcycle, Papa chair, fireplace, workbench, tool chest and shelving.
- A new production GLB cannot hide the existing visual unless it passes mesh, triangle, material and bounding-box checks.
- If a candidate asset is missing, invalid or below threshold, the legacy visual remains visible.
- Added automatic authored-asset fitting to the legacy fallback footprint/ground position before promotion.
- Added a procedural PBR-style legacy material pass for wood, concrete, dirt, metal, rubber and fabric. This adds repeatable surface detail, roughness/metalness separation and preserves the existing palette.
- Added a dedicated W36 main-shop lighting layer with daylight doorway key, warm shop lights and barn fill.
- Added a fixed QA benchmark route/camera contract for repeatable build-to-build visual comparison.
- W36 benchmark mode may use the skinned John animation-development proxy, but it remains QA-only and visibly labelled `JOHN LIKENESS NOT YET APPROVED`.
- Added permanent visual-regression references to `visual_proofs/w36/` and `W36_VISUAL_REGRESSION_BASELINE.json`.

## Visual ratchet rule

Future builds may not remove an existing visible asset simply because a newer asset exists. A replacement must load, pass structural validation and be intentionally promoted. Otherwise the prior visual remains.

Generated/mockup images do not count as gameplay proof. The W36 visual gate remains pending until an actual running W36 screenshot is captured from staging/phone at the fixed benchmark view.

## Hero production GLBs audited

- Tractor: 69 meshes / ~5,084 triangles / 6 materials.
- Motorcycle: 43 meshes / ~6,780 triangles / 7 materials.
- Papa chair: 10 meshes / ~3,272 triangles / 3 materials.
- Fireplace: 40 meshes / ~552 triangles / 5 materials.
- Workbench: 28 meshes / ~652 triangles / 7 materials.
- Tool chest: 21 meshes / ~1,484 triangles / 4 materials.
- Shelving: 21 meshes / ~252 triangles / 14 materials.

All listed hero GLBs pass the W36 structural thresholds in the package audit. Structural pass is not the same as visual approval.

## Verification

Working-tree validation before packaging:

- Full automated suite: 628 / 628 PASS before adding the final visual-reference packaging test.
- Staging validator: 4,306 PASS / 2 WARN / 0 FAIL.
- Production asset audit: PASS.
- JavaScript syntax/check: PASS.

The final cold-ZIP verification results are recorded after packaging. The two known staging warnings are infrastructure: Three.js/addon CDN dependency remains and Wrangler/Cloudflare deploy cannot be verified from this sandbox.

## Required real-device proof

Use:

`/new-games.html?qa3d=1&autostart=1&map=papa&role=hunter&char=john&w36Benchmark=1`

The W36 visual pass requires an actual screenshot/video showing:

1. Complete shop walls, floor, roof/doors and populated work areas.
2. Repair tractor and motorcycle inside the mechanic bay.
3. Workbenches, shelving, tool chests, clutter and shop lighting visible around John.
4. No blank/sparse environment regression.
5. John movement/turn/aim/jump/fire still works.
6. No production asset replacement creates missing objects or broken scale.
7. Usable mobile frame pacing.

