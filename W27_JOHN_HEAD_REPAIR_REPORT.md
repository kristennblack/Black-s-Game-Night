# Black Family Game Night - W27 John Head Repair Report

Build target: `GAME-NIGHT-STAGING-PHASE-W27-JOHN-HEAD-REPAIR-52`
Version: `3.25.0-staging-phase-w27-john-head-repair-52`

## Purpose
Repair the malformed John head seen in the W26 wearable-rig proof without discarding the clothing/body rig or the working head-bone wearable attachment pipeline.

## Root cause found
The W26 John head was combining two competing facial systems: a painted/texture face plus separately modeled facial features. The overlap created a visibly broken double-face result. The visible face source also did not match the approved stylized John turnaround closely enough.

## W27 repair
- Rebuilt the visible head presentation around the approved stylized John turnaround.
- Removed the competing duplicate facial-feature presentation from the active W27 head block.
- Uses one coherent approved face layer/material: `John_ApprovedStylizedFace`.
- The approved source is `/approved-character-turnarounds/john-approved-turnaround.png`.
- Preserved John's real skinned character structure, named `head` bone, `headSocket`, skinning contract, and 19 animation clips.
- Preserved the working clothing/body rig rather than rebuilding the successful clothing portion.
- Adjusted the underlying skin/head color and face coverage to reduce pale seams around the cheeks and hairline.

## W27 wearable fit
The same authored W25 wearable GLBs are attached to John's real `head` bone.

Cowboy hat:
- parent: `head`
- position: `[0, 0.155, -0.005]`
- scale: `0.38`

Aviators:
- parent: `head`
- position: `[0, 0.025, -0.202]`
- scale: `0.21`

## Production Shop integration
Selecting the W25 cowboy hat or aviators in the Production Shop now mounts the W27 repaired-John live fit preview instead of showing only the accessory in isolation. The preview uses the same repaired John GLB and the same wearable GLBs/fit transforms used by the W27 fit lab.

## Visual proof
`visual_proofs/W27_JOHN_HEAD_AND_WEARABLE_FIT_PROOF.png` is generated from the actual current John, cowboy-hat, and aviator GLB geometry using the W27 fit transforms. It is a static GLB proof, not a substitute for target-device approval.

## Validation before packaging
- Full regression suite: 592 / 592 pass.
- Staging validation: 4,284 pass, 2 warnings, 0 fail.
- Runtime HTTP smoke check passed for Production Shop, W27 John fit lab, W27 wearable runtime, Cabin, John GLB, cowboy-hat GLB, and aviator GLB.
- Cabin recovery/non-regression tests remain green as part of the full suite.

## Known warnings / remaining gate
1. The existing external Three.js CDN dependency remains in several runtime modules.
2. Wrangler/live Cloudflare deployment is unavailable in this environment.
3. Chromium/WebGL cannot initialize reliably in this container, so real browser/phone visual approval is still pending.
4. W27 materially repairs the malformed head and is the current in-project candidate. A fully authored Blender/Maya-quality John character replacement remains the preferred long-term production destination for the strongest side/rear silhouette and facial deformation quality.

## Release rule
Do not mark the John head or the W27 wearable fit as Device Approved until the exact Build 52 package is visually inspected on the target device. If the in-game head, hat, or glasses do not match the approved visual direction, the item remains blocked and must be corrected.

## Exact Build 52 cold-ZIP validation
After packaging, the exact Build 52 ZIP was extracted into a clean directory and validated again:
- `npm test`: 592 / 592 pass, 0 fail.
- `npm run check`: syntax checks pass and 592 / 592 tests pass.
- `npm run staging:validate`: 4,284 pass, 2 known warnings, 0 fail.
- HTTP runtime smoke: 200/non-empty for Production Shop, W27 John fit lab, W27 runtime module, Cabin, John GLB, cowboy-hat GLB, and aviator GLB.
- Production Shop contains the W27 live repaired-John fit preview integration markers.
- Exact cold package reports release `GAME-NIGHT-STAGING-PHASE-W27-JOHN-HEAD-REPAIR-52` and version `3.25.0-staging-phase-w27-john-head-repair-52`.
