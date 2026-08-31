# Black Family Game Night - W26 Character Handoff + John Rig Proof Report

Build date: 2026-08-31

Runtime release: `GAME-NIGHT-STAGING-PHASE-W26-CHARACTER-WEARABLE-FIT-PROOF-51`

Design release: `GAME-NIGHT-DESIGN-PHASE-W26-CHARACTER-WEARABLE-FIT-PROOF-51`

Version: `3.24.0-staging-phase-w26-character-wearable-fit-proof-51`

## Executive result

W26 completes two things without pretending the character-art problem is solved:

1. A complete authored-character production handoff for Kristen and Kelsi, plus a John visual-replacement specification.
2. A real runtime technical proof that the W25 cowboy hat and aviator GLBs can attach directly to the named `head` bone of the actual skinned John GLB and follow his real Idle animation.

The attachment pipeline is technically proven. The legacy John visible mesh is **not** visually approved. The proof exposed that it is still blocky/segmented and must be replaced by a stylized-realism authored model before John becomes the visual fit master.

## Character production handoff

Packaged folder: `W26_CHARACTER_PRODUCTION_HANDOFF/`

### Kristen

- Approved turnaround copied into the package.
- Stylized-realism production specification added.
- Human rig/bone contract defined.
- Hat, glasses, earring and face-filter socket contract defined.
- Separate hair-mesh requirement defined.
- Cowboy-hat and cap/beanie hair-compression/tuck profiles required.
- Mobile-conscious topology, LOD, texture and GLB-export requirements defined.

### Kelsi

- Multi-angle production reference extracted into a standalone handoff image.
- Family-lineup reference included.
- Proper quadruped rig contract defined.
- Dog-specific hat, glasses and earring-charm adaptations required.
- Collar, hat, ear-charm and back-accessory sockets defined.
- Curly-coat performance guidance added.
- Mobile-conscious LOD/texture/export requirements defined.

### John

- Existing `john-production-skinned.glb` retained as a technical rig carrier only.
- Existing useful bone/animation naming can be reused where practical.
- Visible segmented body/head/hands/boots are explicitly marked for replacement.
- New hat/glasses/ear/filter sockets are required in the authored replacement.

## Real John rig proof

New runtime files:

- `public/w26-john-fit-lab.html`
- `public/w26-character-wearable-runtime.mjs`

The proof loads:

- `/models/characters/john-production-skinned.glb`
- `/models/w25/w25-dark-brown-ranch-cowboy-hat.glb`
- `/models/w25/w25-gold-brown-aviators.glb`

It then:

- finds John's real named `head` bone;
- attaches both wearable GLB scenes as children of that bone;
- uses head-local production fit transforms;
- plays the actual John Idle animation through `THREE.AnimationMixer`;
- allows Hat / Aviators / Both / None toggles;
- allows live rotate and zoom in WebGL;
- clearly labels the legacy John visible mesh as not W26 art-approved.

### Locked John technical-fit transforms

Cowboy hat:

- parent: `head`
- position: `[0.000, 0.135, -0.005]`
- rotation XYZ: `[0, 0, 0]`
- scale: `0.38`

Aviators:

- parent: `head`
- position: `[0.000, 0.035, -0.202]`
- rotation XYZ: `[0, 0, 0]`
- scale: `0.31`

These are **technical legacy-rig transforms**, not final authored-character offsets.

## Production Shop connection

The Production Shop now includes a direct **John Fit Proof** navigation path.

The W25 production manifest advances only the cowboy hat and aviators to:

`John Technical Rig Fit Verified; Authored Visual Fit Pending`

They remain blocked from Device Approved / live release.

## Proof image

`W26_CHARACTER_PRODUCTION_HANDOFF/proofs/W26_JOHN_WEARABLE_FIT_PROOF.png`

This software-rendered proof uses the same GLB geometry and bind-pose head coordinates. It is included for diagnostics only and does not override the real-device WebGL gate.

## Validation

- Node regression tests: **587 / 587 pass**
- Staging validation: **4,282 pass, 2 warnings, 0 fail**
- Static runtime smoke: Production Shop, John Fit Lab, W26 runtime module, John GLB, cowboy-hat GLB, aviator GLB and Cabin all returned HTTP 200 from an isolated local server.

Known staging warnings:

1. Existing Three.js CDN dependency remains, now including the W26 fit-proof module.
2. Wrangler executable is unavailable in this environment, so actual Cloudflare deployment remains unverified.

## What W26 does not claim

- Kristen does not yet have an authored production GLB.
- Kelsi does not yet have an authored production quadruped GLB.
- John does not yet have a visually acceptable W26 replacement GLB.
- Hat hair-compression cannot be visually approved until authored separate hair meshes exist.
- The soft-glam filter cannot be device-approved until it runs on an authored face/material system.
- This build is not Device Approved until checked on the target phone/browser.

## Next production gate

When `CHAR_KRISTEN.glb`, `CHAR_KELSI.glb` and the authored John replacement are delivered, integrate them using the supplied socket contract, retarget/reuse animations, then run the full John + Kristen + Kelsi gate with:

- Dark Brown Ranch Cowboy Hat
- Gold/Brown Aviators
- Smooth Gold Hoops
- Soft-Glam Face Filter

No mass cosmetic/catalog conversion should resume before that gate passes visually on the target device.
