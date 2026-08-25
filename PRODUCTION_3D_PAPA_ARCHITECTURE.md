# Production3D Papa's Shop vertical slice

## Why this branch exists

The earlier WebGL releases proved camera, collision, multiplayer and game rules, but the visible world was still dominated by geometry assembled at runtime. That is useful for greyboxing, fallback rendering and generated clutter, but it is not a credible final-art workflow for the family characters or the objects players stare at.

This branch changes the contract: **high-attention visuals are files, gameplay is code**.

## Runtime stack

- Existing Lodge, Worker and Durable Object multiplayer remain unchanged.
- Prop Hunt still runs on Three.js/WebGL for this first migration slice.
- `public/models/manifest.json` is now the authoritative opt-in list for production assets.
- `public/shared-3d-studio.mjs` loads GLBs asynchronously, uses skeleton-aware cloning when needed, binds named rig nodes to semantic body parts, and falls back to the existing procedural rig if any asset fails.
- `public/shared-3d-gameplay.mjs` animates authored named-joint rigs relative to their authored bind positions when no baked animation clips exist. When real animation clips are later supplied, the existing `SemanticAnimationMixer` becomes the driver without changing game rules.
- Gameplay colliders remain simulation-owned. Replacing a visible tractor or chair never silently changes collision or shooting rules.

## First production benchmark assets

The first migration deliberately covers only the highest-value Papa's Shop benchmark pieces:

- John: `/models/characters/john.glb`
- Gunner: `/models/dogs/gunner.glb`
- Prop-zapper: `/models/props/prop-zapper.glb`
- Tractor: `/models/props/tractor.glb`
- Papa's chair: `/models/furniture/papa-chair.glb`

The files are generated at build time by `tools/build_production_assets.py` and are baked GLB assets, not geometry constructors executed every frame. John and Gunner contain named joint hierarchies and attachment sockets. They are still project-authored stylized benchmark meshes, not the final Blender-sculpted/skinned family models.

## John rig contract

Required named nodes currently include:

`JohnRig`, `hips`, `upperBody`, `head`, `leftShoulder`, `leftElbow`, `leftHand`, `rightShoulder`, `rightElbow`, `rightHand`, `leftHip`, `leftKnee`, `leftFoot`, `rightHip`, `rightKnee`, `rightFoot`, `leftEye`, `rightEye`, `leftBrow`, `rightBrow`, `mouth`, `rightHandSocket`, `leftHandSocket`, `backSocket`.

The production benchmark is scaled in the manifest so its visible height matches John's 1.82 m gameplay body. That closes the prior disconnect where the renderer could show a person larger than the collider.

## Gunner rig contract

Required named nodes include:

`GunnerRig`, `body`, `chestPivot`, `head`, `jaw`, four upper-leg nodes and knee nodes, `tail`, and `backSocket`.

Gunner is calibrated to his larger 1.08 m dog gameplay profile and is not just another golden-dog mesh with a different material.

## Animation bridge

There are two production states:

1. **Authored GLB + named joints, no clips**: the shared procedural animation language drives the GLB joints relative to their authored bind positions.
2. **Authored GLB + clips**: semantic words such as `walk`, `run`, `jump`, `aim`, `fire`, `hit` and `mantle` are resolved to real clips and crossfaded by `SemanticAnimationMixer`.

This allows us to improve the visual assets before the full animation library is finished without reverting to a static model.

## Papa's Shop hero replacement

The production tractor and Papa chair load asynchronously after the level shell is ready. Their procedural versions remain as invisible collision/reference geometry, while the GLB visuals become the raycastable visible objects. If a GLB fails, the procedural fallback remains visible.

That separation is intentional: art replacement should never break gameplay.

## What remains deliberately unfinished

This is the first **asset-first** slice, not final studio art.

- John is a baked articulated stylized mesh, not yet a continuously skinned Blender sculpt.
- Gunner is a baked articulated quadruped, not yet a production fur/skin rig.
- Papa's Shop walls, workbench, tools, motorcycle and many secondary props still come from the procedural art kit.
- Rapier is not yet the authoritative character controller in this slice.
- The scene is still composed from code. A PlayCanvas/visual-editor scene migration is the next major environment-authoring step after the phone test proves the authored-asset swap is materially better.
- Real iPhone visual signoff remains mandatory.

## Build and audit

```bash
npm run assets:build
npm run assets:audit
npm run check
```

The asset audit verifies GLB headers, required hierarchy names and calibrated character heights before a release is accepted.

## Approved-reference curved face surfaces

The production benchmark now uses approved family artwork as an embedded texture source for the front facial surface of John and Gunner. The image is mapped onto a curved mesh conforming to the 3D head. This is deliberately different from a sprite/billboard:

- the patch does not rotate toward the camera;
- ears, skull depth, hair/fur, beard/muzzle, side profile and back-of-head remain modeled geometry;
- side and rear views remain honest;
- the asset still uses named joints and normal world rotation.

This is an intermediate likeness strategy for the benchmark assets. A final sculpted/skinned character can later replace the GLB without changing game code.

## Expanded Papa hero kit

The asset-first swap now covers the tractor, old motorcycle, Papa chair, fireplace, workbench, rolling tool chest and loaded shelving. The procedural versions remain hidden collision/reference objects after the GLB visual loads successfully.
