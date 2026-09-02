# Black Family Game Night
## Family Prop Hunt Flagship Audit + Concrete Implementation Plan

**Audit basis:** actual latest packaged project ZIP: `black-family-game-night-STAGING-PHASE-O-BLACK-GAMMON-BOTS-12.zip`  
**Package version:** `3.0.1-staging-phase-o-black-gammon-bots-12`  
**Build ID:** `GAME-NIGHT-STAGING-PHASE-O-BLACK-GAMMON-BOTS-12`

## Executive conclusion

Do **not** rewrite the 3D stack. The latest project already contains a useful shared gameplay/runtime foundation that should be preserved. The main gap is now art production and presentation quality, not the existence of a 3D engine.

The next milestone should be a deliberately narrow **Family Prop Hunt -> John -> Papa's Shop character benchmark**. No major Island Life or Birthday Seat visual work should happen until this benchmark passes real-device visual review.

## What already exists and should be reused/locked

### Shared movement / camera / collision
- `public/shared-3d-gameplay.mjs`
- `public/prop-hunt-core.mjs`
- Current third-person camera includes obstruction solving, recovery, zoom, shoulder swap and Reset View.
- Movement includes acceleration/braking, jumping, support/ceiling collision, recovery and mantling.
- Prop Hunt uses the shared camera/movement layer rather than a one-off controller.
- Current camera recovery work must be treated as locked unless a benchmark test proves a specific defect.

### Shared authored-asset pipeline
- `public/shared-3d-studio.mjs`
- `public/models/manifest.json`
- GLB loader, skeleton-safe cloning, semantic animation mapping and authored sockets already exist.
- Load failure falls back rather than breaking gameplay.
- This is the correct architectural seam for replacing prototype art with production art.

### Current John candidate
`public/models/characters/john-production-skinned.glb`

Technical contract:
- 4,640,280 bytes
- 1 skin
- 1 mesh
- 23 glTF nodes
- 14 authored animation clips
- 9 materials
- 3 embedded images
- calibrated final height ~1.819 m
- named hand/back/head sockets
- semantic clips: Idle, Walk, Run, Turn_Left, Turn_Right, Jump, Fall, Land, Aim, Fire, Hit_Reaction, Wave, Celebrate, Sit

Important: the GLB itself is explicitly tagged `characterLab: 02` and `experimental local character-lab candidate`. It is not a finished likeness asset.

### Papa's Shop asset replacement architecture
- `public/models/environments/papa-shop-barn-production.glb`
- `public/models/sets/papa-shop-production-props.glb`
- dedicated hero GLBs for tractor, motorcycle, Papa chair, fireplace, workbench, tool chest and shelving
- visible production GLBs are aligned over preserved gameplay colliders/fallbacks

This is valuable: art can be upgraded without silently rewriting collision, shooting, climbing or multiplayer rules.

### Existing approved cabin assets
The latest package still contains recoverable approved cabin art:
- `public/home-cabin-approved.png`
- `public/home-cabin-background.jpg`
- `public/john-home-approved.jpg`

The current app also has a cabin/firelight home implementation. These should be preserved for the later home-screen phase rather than redesigned from zero.

### Shooting basics already exist
Prop Hunt currently has:
- centered crosshair
- visible hit marker
- hunter AIM and SHOOT controls
- desktop right-mouse aim + left-click shoot
- camera raycast followed by muzzle revalidation
- wall/prop/player shot blocking
- tracer / impact feedback

These are foundations to polish, not systems to throw away.

## What is preventing the latest build from meeting the directive

### 1. Character coverage is still prototype/fallback-heavy
The production model manifest contains only:
- human: John
- dog: Gunner

Every other family member still relies on the procedural fallback human/dog renderer. A flagship visual standard cannot be reached while the cast visibly switches between one authored character and primitive fallbacks.

### 2. John is technically complete but not yet visually approved
The latest John candidate has the correct rig/animation contract, but the package itself labels it experimental. Previous Phase K documentation also says real-device likeness approval remains required.

Therefore the next work should improve/validate John, not create more family models yet.

### 3. Current authored animation system is single-state, not true locomotion + upper-body layering
`SemanticAnimationMixer` plays/crossfades one semantic action at a time. In Prop Hunt, an authored hunter who aims is switched to the `aim` semantic. That means the current authored path does not yet provide a proper lower-body locomotion layer while the upper body independently aims/fires.

This directly conflicts with the desired benchmark where aiming should coexist naturally with movement.

### 4. Missing animation states relative to the quality target
John has 14 clips, but the directive's target also calls for distinct start/stop motion, sprint, crouch where applicable, climbing/mantling and more complete ability reactions. The runtime has a mantle state but the authored John clip set has no dedicated mantle/climb clip and falls back to jump/idle semantics.

### 5. Papa's Shop art is an intermediate algorithmic production slice, not final studio-quality environment art
The architecture and GLB replacement path are good, but project reports explicitly describe the Papa assets as locally code-authored/algorithmic rather than hand-modeled studio-final assets.

The environment can be used as the collision/layout contract, but should not be mistaken for the final quality benchmark.

### 6. Gunner is technically authored but has not passed the visual bar
Gunner has a dedicated GLB and correct calibrated scale, but the current QA documents still require proof that he reads as Gunner rather than a generic/recolored dog, including side/rear views and grounded quadruped motion.

Do not spend the first benchmark on Gunner. John should pass first, then Gunner.

### 7. Aiming usability has no real aim-assist layer yet
The current code has crosshair, camera aim, hit feedback and ray validation, but no dedicated mild touch aim-assistance/magnetism system was found. Add this only after John locomotion/camera benchmark is stable.

### 8. Performance tooling is present but production optimization is incomplete
The current runtime has:
- performance governor with dynamic pixel ratio
- frustum culling on loaded meshes
- real-time QA metrics

No meaningful LOD/InstancedMesh strategy is currently evident in the Prop Hunt path. Do not optimize blindly now; capture benchmark phone metrics first and optimize whichever assets actually cause spikes.

### 9. Existing Phase O bot-default regression
Although Phase O describes an Easy-first bot UX, Prop Hunt's realtime room markup still explicitly selects `medium`, and Birthday Seat also seeds new bot configs with `medium`. This is a preservation/regression defect and should be corrected in the stabilization pass, but it should not derail the 3D flagship work.

## First visual benchmark to establish

### Benchmark name
**PH-CHAR-01: John in Papa's Shop**

### Why this is the correct first gate
It exercises the shared character pipeline while using the already-built camera, collision, animation, weapon sockets, lighting and Papa's Shop layout. If John cannot look convincing here, propagating the pipeline to the rest of the family would multiply the wrong art standard.

### Required proof views
Capture from the actual running game at normal gameplay FOV/distance:
1. John idle, front three-quarter view.
2. John walking, side view.
3. John running, rear three-quarter view.
4. John turning 90-180 degrees while moving.
5. John jumping and landing.
6. John aiming while walking.
7. John firing while moving.
8. John standing in the man doorway for scale.
9. John beside tractor/workbench.
10. John in the fireplace/Papa-chair corner under local lighting.

### Pass criteria
John must:
- read recognizably as John without depending only on plaid shirt;
- have believable adult proportions and hands/feet;
- show a clean silhouette from front, side and rear;
- have face/hair/beard that remain coherent from normal camera distance;
- keep feet visually grounded during walk/run;
- turn smoothly without body snapping;
- maintain lower-body locomotion while aiming/firing;
- keep zapper attached correctly through all animations;
- stay correctly scaled against the man door and workbench;
- remain visually readable in both interior and exterior lighting;
- preserve the recovered camera behavior with no top-down collapse or pinned view.

### Automatic fail conditions
- face reads as a texture pasted onto a generic head;
- hands/arms clip severely during aim/fire;
- obvious foot sliding;
- aim pose freezes the whole body while moving;
- camera collapses or clips badly around doorways/roof;
- model floats/sinks relative to floor;
- visual quality is only good from the front;
- noticeable fallback asset appears in place of John.

## Concrete implementation order

### Phase P0 - Preservation and audit lock
1. Preserve Phase O ZIP unchanged as known-good source package.
2. Add a locked-components register for camera recovery, collision, Prop Hunt rules, multiplayer/reconnect, map layout and approved cabin assets.
3. Correct the Easy-default bot regression without touching gameplay logic.
4. Add tests that fail if a future visual pass silently removes John authored loading, camera reset/recovery, wall-first shot validation or Papa's Shop layout contract.

### Phase P1 - John character benchmark
1. Keep the existing manifest URL and socket/animation contract.
2. Improve or replace only the John GLB bytes, not the shared runtime interfaces.
3. Preserve 1.82 m reference height and named sockets.
4. Improve head/face/hair/beard/hands/clothing silhouette first.
5. Validate front/side/rear before touching the rest of the cast.

### Phase P2 - Animation and locomotion benchmark
1. Extend authored animation control to support lower-body locomotion plus upper-body aim/fire overlay or an equivalent masked-layer approach.
2. Add authored sprint and mantle/climb support if required by gameplay.
3. Tune stride speed to actual movement speed to eliminate skating.
4. Verify start/stop/turn behavior at half joystick and full joystick.

### Phase P3 - Camera and aiming polish
1. Preserve the existing multi-candidate obstruction/recovery solver.
2. Tune camera distance/shoulder/FOV only after the new John proportions are in-game.
3. Add mild touch aim assistance with strict limits and line-of-sight checks.
4. Keep centered crosshair and hit feedback, then improve clarity rather than redesigning from scratch.

### Phase P4 - Papa's Shop environment benchmark
Only after PH-CHAR-01 passes:
1. Upgrade architecture/materials of the existing Papa layout contract.
2. Prioritize doorway, shop shell, attached barn, tractor/workbench zone and fireplace/Papa-chair corner.
3. Replace algorithmic hero assets selectively without changing collider footprints.
4. Improve local lighting and shadow response.
5. Keep clutter readable for Prop Hunt gameplay.

### Phase P5 - Prop/disguise benchmark
1. Establish reusable finished prop categories.
2. Ensure scenery prop, disguise and decoy share the same render asset.
3. Validate scale/collision/shadow consistency.

### Phase P6 - Prop Hunt integration
1. Expand approved character pipeline to the next family character only after John passes.
2. Expand map art only after Papa's Shop passes.
3. Keep other 3D games visually frozen except for shared bug fixes.

### Phase P7 - Home-screen restoration/polish
Use the existing approved cabin composition/assets as the starting point. Do not redesign the room from scratch. Replace/improve seated John and then integrate dimensional game-selection UI and custom icons.

### Phase P8 - Reuse
Only after Prop Hunt visual/device acceptance, propagate the approved character/camera/control/material systems into Island Life and Birthday Seat.

## What should NOT happen next
- no simultaneous Island Life/Birthday visual rebuild;
- no replacement of the recovered camera system merely to make code cleaner;
- no procedural restyling of all family characters before John passes;
- no claim of "production ready" based only on automated tests;
- no giant Papa's Shop rewrite before the character benchmark;
- no home-screen redesign from scratch.

## Next release gate
Do not package the next 3D milestone as visually complete until PH-CHAR-01 has real-device screenshots/video and the benchmark has been explicitly accepted. Automated tests may mark the package technically healthy, but visual status remains pending until that proof exists.
