# v3.0 Production3D Papa alpha

This is the first **asset-first** Prop Hunt vertical slice. It keeps the proven Lodge/Cloudflare/multiplayer foundation, but begins retiring runtime primitive construction for the objects the player studies most closely. John, Gunner, the prop-zapper, Papa's tractor and Papa's chair now ship as actual GLB files through `public/models/manifest.json`, with procedural visuals retained only as safe fallbacks.

The goal of this release is deliberately narrow: prove on a real phone that authored files plus semantic rig binding close the visual gap before migrating the rest of the family or the other maps. See `PRODUCTION_3D_PAPA_ARCHITECTURE.md` and `PRODUCTION_3D_ASSET_QA.md`.

## What is genuinely new

- baked GLB John benchmark with named body joints, face targets and hand/back sockets,
- baked GLB Gunner benchmark with a named quadruped hierarchy and backpack socket,
- GLB prop-zapper, tractor and Papa chair,
- runtime named-rig binding so GLBs without baked clips still move using the shared animation language,
- bind-position-relative procedural motion so authored joints are not forced into prototype coordinates,
- async hero-object replacement while simulation-owned collision stays stable,
- asset build/audit tools and production-model manifest,
- phone QA HUD now reports `GLB+joints`, `GLB+clips` or `procedural`.

## Important honesty rule

This is **not yet the final Blender/PlayCanvas production scene**. The benchmark files are project-authored baked articulated GLBs and are a meaningful step beyond runtime greybox geometry, but the final target is still continuously skinned/sculpted family models, authored animation clips and editor-composed environments. Papa's Shop must pass the real-phone checklist before we expand this pipeline to the rest of the family or the other maps.

---

# Black Family Game Night v2.0.0-studio-realism

This is the **Studio Realism** release for the private Black Family Game Night collection. It keeps the real-WebGL movement, camera, scene and embodied-realism work from v1.3 through v1.8, then adds the systems needed to cross the next visual and behavioral ceiling without rewriting the games again.

The three free-moving 3D games are:

- Family Prop Hunt
- Family Island Life
- John's Birthday Seat

The Lodge, Family Mystery and original tabletop/card games remain intact.

## Studio Realism focus in v2.0

The core rule is now: **gameplay meaning survives the asset source**.

A human can be rendered by the detailed procedural rig today or by a future skinned GLB tomorrow, while the game still asks for the same semantic actions such as walk, run, jump, aim, cook, fish, sleep, hit and celebrate.

v2.0 adds:

- an optional GLB/GLTF authored-asset pipeline with procedural fallback,
- common human/dog/prop model manifests and rig sockets,
- semantic skeletal AnimationMixer crossfading,
- richer procedural action vocabulary for jobs, tools, life actions and dog behavior,
- visual foot grounding and hand reach helpers,
- local-time multiplayer snapshot buffering and short safe extrapolation,
- A* navigation for ambient family visitors,
- weather that affects rain, fog, wind, light and ambience,
- restrained heightfield tropical terrain with level village/home zones,
- shader water with waves, fresnel response and animated shoreline foam,
- interactive home furniture with server-authorized proximity and ownership rules,
- persistent lamp state tied to actual 3D point lights,
- selective small-object physics,
- surface-aware WebAudio footsteps/landings and event-driven sound cues,
- shared persistent SND controls,
- cinematic reveals that return to the gameplay camera unless explicitly terminal,
- better remote-player interpolation in Prop Hunt and Island Life,
- the same authored-model bridge in Prop Hunt, Island Life and Birthday Seat.

### Important model caveat

Historical v2 note: that release intentionally shipped an empty authored-model manifest. v3 now opts John, Gunner and selected Papa's Shop hero assets into the production GLB pipeline while every unconverted family member/object still falls back safely.

See `AUTHORED_3D_ASSET_GUIDE.md` for the exact future handoff standard.

## Validation

The v2 suite now includes direct tests for authored fallback behavior, semantic clip lookup, multiplayer snapshot timing, NPC pathfinding, deterministic weather/routines, terrain restraint, server-authorized furniture, shoreline/audio/physics/cinematic systems and the expanded semantic animation vocabulary.

Final frozen results are recorded in `FINAL_TEST_REPORT.txt`. Real-device WebGL visual/performance signoff is still required.

## Living Worlds foundation from v1.7

v1.7 takes the unified 3D foundation from the previous systems pass and spends the budget on **place, motion and visual believability**. The goal is to make a room, campsite, farm, town or birthday course read as an intentional location rather than a collection of technically valid meshes.

The shared art/gameplay layers now add:

- movement-driven gait timing instead of a fixed walk-cycle clock,
- acceleration and turning lean,
- stronger jump, fall and landing silhouettes,
- torso counter-rotation and more natural sprint elbows,
- dog sniff/idle behavior in addition to quadruped gait,
- support structures below elevated Birthday Seat platforms,
- environmental landmarks such as fountains, notice boards, mailboxes, market stalls, beach umbrellas and party arches,
- lightweight ambient birds, pollen/dust, moving fans, foliage, fire and water,
- deeper themed dressing for Papa's Shop, campsite, acreage, farm, Island Life districts and the Birthday Seat climb,
- stronger visual pathways and human-use objects so players can understand what each place is for without reading labels.

The v1.7 rule is simple: **density must have purpose**. More geometry is not automatically better. Objects should establish scale, activity, navigation, hiding opportunities, interaction opportunities or character.

## What changed in v1.7

### 1. One shared gameplay-feel system

`public/shared-3d-gameplay.mjs` now owns the movement and camera language used across all three 3D games.

Shared behavior includes:

- camera-relative movement,
- true analog joystick magnitude,
- gradual acceleration and braking,
- separate ground and air control,
- sprint logic,
- jump buffering,
- coyote time,
- variable-height jumps,
- semantic locomotion states,
- transient action animations,
- twin-stick gamepad support,
- camera springing and velocity look-ahead,
- camera obstruction handling,
- manual camera-shoulder swapping,
- dynamic field of view,
- recoil camera response,
- shared virtual joystick handling,
- camera-facing interaction selection,
- dynamic mobile performance scaling.

The games still have different tuning. Prop Hunt is tighter and combat-focused, Island Life is calmer and wider, and Birthday Seat has more air control for platforming.

### 2. Better third-person camera

The common camera now supports:

- smooth target tracking instead of snapping directly to the actor,
- different normal, sprint and aim FOV values,
- collision against walls and world geometry,
- closer over-the-shoulder aiming in Prop Hunt,
- velocity look-ahead while moving,
- recoil recovery,
- left/right shoulder switching,
- camera zoom on mouse wheel where appropriate,
- persistent sensitivity and invert-Y preferences.

A visible **CAM ↔** button is available in every 3D game in addition to `C` on keyboard and `LB` on gamepad.

### 3. Shared control preferences

A new **CTRL** panel is available in every free-moving 3D game.

Preferences persist across the collection:

- look sensitivity from 0.65x to 1.50x,
- invert vertical camera look,
- left-handed mobile layout,
- reset to defaults.

Changing the preference in Island Life changes the same control preference the next time Prop Hunt or Birthday Seat is opened.

### 4. Improved jump and platform feel

Jumping is no longer one fixed arc.

The shared movement layer now supports:

- short-tap lower jumps,
- held-button higher jumps,
- a small jump buffer before landing,
- a short coyote window after walking off a ledge,
- automatic mantling where the game allows it,
- ceiling checks,
- landing states,
- moving-platform carry behavior in Birthday Seat.

These features are especially important on touch controls, where perfectly timed single-frame inputs are unrealistic.

### 5. Unified semantic animation system

Characters now speak one animation language across the games:

- `idle`
- `walk`
- `run`
- `jump`
- `fall`
- `land`
- `mantle`
- `aim`
- `hit`
- `wave`
- `work`
- `drink`
- `sit`
- `celebrate`

Short actions are stored as transient states so they are not overwritten by the locomotion loop on the next frame.

Examples:

- Island Life work shifts visibly play a work animation.
- Drinking/eating interactions can use a drink/use pose.
- Waving persists long enough to actually read onscreen.
- Prop Hunt hit reactions survive long enough to be visible.
- Birthday Seat keeps the real 3D runner alive and celebrating at the throne instead of freezing the scene and replacing the runner with a flat portrait.

### 6. More natural procedural humans

The shared art kit now combines its detailed all-angle geometry with a deeper shared animator.

Human motion includes:

- hip rotation,
- torso counter-rotation,
- breathing,
- blinking,
- head look response,
- turn lean,
- arm swing,
- elbow motion,
- knee articulation,
- foot roll,
- jump/fall poses,
- landing compression,
- mantle pose,
- aiming pose,
- recoil response,
- work/wave/drink/celebrate poses.

The model still has a true front, back and side. Facial features remain on the front of the head rather than rotating toward the camera.

### 7. More natural quadruped dogs

Kelsi, Molly and Gunner continue to use actual four-legged rigs.

The shared animation system now drives:

- diagonal quadruped gait,
- upper/lower leg joints,
- head motion,
- ear secondary motion,
- tail movement,
- airborne leg pose,
- hit reaction,
- backpack-zapper movement.

### 8. Environmental ambience

The shared art kit now provides low-cost visual ambience that does not affect collision or multiplayer state.

Current ambient motion includes:

- subtle tree/foliage sway,
- subtle pool/hot-tub water motion,
- existing animated flames and fire lighting.

The visible child geometry moves while physical colliders remain fixed.

### 9. Prop Hunt improvements

Prop Hunt keeps the v1.5 detailed world work and now gains the shared v1.7 controls/animation system.

Important behavior includes:

- character rotates with camera,
- hip-fire and shoulder-aim camera modes,
- right-mouse hold to aim on desktop,
- centered raycast shooting,
- first real 3D hit blocks everything behind it,
- camera obstruction,
- automatic mantling,
- variable jump height,
- recoil response,
- role-specific touch controls,
- shared control preferences,
- environmental ambience,
- detailed all-angle humans and quadruped dogs.

The package runtime marker is now `2.1.0-prop-hunt-quality-slice`. The shared Studio/gameplay modules remain at their v2.0 API contract because this release is a focused Prop Hunt scene-quality slice.

### 10. Family Island Life improvements

Island Life retains its persistent economy, homes, jobs, stores, foraging and multiplayer systems while adopting the same v1.7 control framework.

The exploration layer now has:

- true analog movement,
- smoother acceleration/deceleration,
- variable jumping,
- jump forgiveness,
- camera shoulder switching,
- persistent control preferences,
- left-handed mobile layout,
- camera-facing interaction selection,
- transient work/wave/drink/sit animation states,
- shared environmental ambience.

### 11. John's Birthday Seat is now genuinely WebGL 3D

This is one of the largest v1.7 changes.

The previous Birthday Seat gameplay still used a software-3D/canvas approach and flat runner art. The race itself has now been rebuilt on the same Three.js/WebGL framework as the other 3D games.

The actual race now uses:

- all-angle family human/dog rigs,
- real 3D platforms,
- a perspective camera,
- camera obstruction,
- shared analog movement,
- shared jump buffering and coyote time,
- variable jump height,
- gamepad support,
- mobile joystick/buttons,
- moving gift platforms,
- platforms that physically carry riders,
- Cake Bounce,
- checkpoints,
- bot racers,
- visible 3D throne goal,
- live 3D finish celebration.

Setup portraits are still allowed as menu/reference art. Once the race starts, the runner is genuine scene geometry.

## Mobile controls

Every 3D game follows the same general rule:

- virtual joystick: movement,
- drag open world space: camera,
- JUMP: jump / automatic mantle when applicable,
- SPRINT: toggle sprint,
- CAM ↔: swap camera shoulder,
- CTRL: sensitivity, invert-Y and left-handed layout.

Prop Hunt additionally exposes combat/disguise actions based on the player's role.

Island Life additionally exposes USE and WAVE plus the resident phone UI.

## Desktop controls

Common:

- `WASD` / arrows: movement
- mouse drag: camera
- `Space`: jump
- `Shift`: sprint
- `C`: swap camera shoulder
- mouse wheel: adjust third-person distance where supported

Prop Hunt:

- hold right mouse: aim
- left click while aiming: shoot
- `E`: disguise
- `F`: flash
- `Q`: decoy
- `L`: prop lock

Island Life:

- `E`: interact
- `Tab`: resident phone

## Gamepad controls

Common twin-stick layout:

- left stick: move
- right stick: camera
- A / button 0: jump
- L3: sprint
- LB: camera shoulder

Where applicable:

- X / button 2: interact
- LT: aim
- RT: shoot

## Design documentation

The current package includes explicit 3D standards documents and an Embodied Realism implementation note:

- `3D_GAMEPLAY_FUNCTIONALITY_AND_DESIGN_STANDARD.md`
- `3D_GAME_QA_MATRIX.md`

The first document defines the expected movement, camera, animation, rigs, input, interactions, environment realism, lighting, multiplayer motion, performance and definition of done.

The QA matrix turns those rules into cross-game acceptance checks.

The existing `FAMILY_GAME_ART_BIBLE.md` remains the visual identity source of truth.

## Testing

Run:

```bash
npm run check
```

Current result: **172 / 172 automated tests passing**.

Coverage now includes the shared 3D movement/control module, analog magnitude, acceleration/braking, jump buffer, coyote time, variable jumps, interaction direction, semantic animation, transient actions, environmental ambience, persistent control preferences, shoulder switching, genuine WebGL Birthday Seat, moving-platform rider carry behavior, Island Life integration, Prop Hunt integration, Cloudflare/Lodge regressions and the existing game collection.

## Deployment status

This package is a source replacement build. It is **not automatically deployed** by creating the ZIP.

The existing Cloudflare Worker/Durable Object architecture remains in place. v2.1 is a focused Prop Hunt client/scene quality slice and does not introduce a new Durable Object class or migration.

The 3D clients currently load Three.js from jsDelivr, so the free-moving 3D games require network access unless Three.js is later vendored into the project.

Real-device GPU visual QA is still required before calling the build production-finished. Automated tests can verify architecture and behavior contracts, but they cannot judge whether John's shoulders look strange on a particular iPhone GPU.

## Important art-quality note

v2.1 improves the Prop Hunt procedural characters and Papa's Shop scene, but procedural geometry is still not the final likeness ceiling. The authored GLB/GLTF pipeline from v2.0 remains the intended route for bespoke family models.

The next major visual step, when desired, is an authored GLB/GLTF pipeline for hero family characters, dogs, vehicles and signature objects. That art upgrade should plug into the shared semantic animation/control contracts instead of replacing the game systems again.

---

## v3.0 Production3D Papa alpha

The current production experiment is documented in `PRODUCTION_3D_PAPA_ARCHITECTURE.md` and `PRODUCTION_3D_ASSET_QA.md`.

This slice keeps the v2/v2.1 gameplay and Cloudflare foundation, but moves Papa's Shop high-attention visuals into baked GLB assets. John and Gunner include calibrated named-joint rigs plus curved approved-reference face textures that stay attached to genuine 3D head geometry. Papa's Shop also swaps authored GLB visuals for the prop-zapper, tractor, motorcycle, Papa chair, fireplace, workbench, tool chest and shelving while preserving gameplay colliders underneath.

The build remains a visual alpha until it passes the real-device QA checklist. Other 3D maps are not visually signed off by this release.
