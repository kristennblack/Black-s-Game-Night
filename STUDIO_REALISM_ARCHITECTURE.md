# Black Family Game Night v2.0.0
## Studio Realism Architecture

This document is the technical contract for the free-moving 3D games in the private Black Family Game Night collection:

- Family Prop Hunt
- Family Island Life
- John's Birthday Seat

The v2.0 goal is not photorealism. It is **coherent embodied 3D**: the character, camera, animation, world geometry, lighting, interaction, sound and multiplayer state should all describe the same event.

## 1. Shared stack

The 3D games are split into four layers.

### `shared-3d-art-kit.mjs`
Reusable procedural visual assets and PBR-like materials. This remains the dependable low-cost fallback for mobile devices and for objects that do not justify a bespoke model.

### `shared-3d-gameplay.mjs`
Movement, jumping, camera, control preferences, gamepad input, motion telemetry, attention, contextual facing, procedural family/dog animation, camera obstruction and contact events.

### `shared-3d-studio.mjs`
The v2 studio layer. It adds:

- optional authored GLB/GLTF model loading
- semantic skeletal animation crossfading
- procedural face states
- foot grounding and hand reach helpers
- buffered multiplayer snapshots
- A* NPC navigation
- persistent-routine helpers
- weather
- shader water
- heightfield terrain
- selective object physics
- WebAudio feedback and ambience
- cinematic camera shots
- stereo sound positioning

### game clients
Each game owns only the rules that genuinely belong to that game. Camera math, GLB loading, animation semantics and sound preference code should not be duplicated in individual games.

## 2. Authored asset philosophy

The runtime supports two visual tiers at the same time.

### Tier A: authored hero assets
Use GLB/GLTF for high-attention assets such as:

- family members
- Gunner, Molly and Kelsi
- the prop-zapper
- tractors and vehicles
- signature furniture
- hero shop objects

### Tier B: procedural support assets
Use generated meshes for:

- shelves
- fences
- simple crates
- rocks
- generic vegetation
- background clutter
- collision proxies

An authored asset may never be required for the game to function. If a model is absent or fails to load, the procedural all-angle rig remains available.

## 3. Semantic animation

Gameplay code should request an action by meaning, not by source-file clip name.

Examples:

- `idle`
- `walk`
- `run`
- `jump`
- `fall`
- `land`
- `mantle`
- `aim`
- `fire`
- `hit`
- `wave`
- `sit`
- `sleep`
- `drink`
- `eat`
- `fish`
- `cast`
- `reel`
- `chop`
- `mine`
- `dig`
- `water`
- `cook`
- `work`
- `carry`
- `inspect`
- `dance`
- `celebrate`

The authored animation mixer resolves likely aliases and crossfades between clips. Procedural rigs implement the same semantic vocabulary with joint poses, so gameplay does not care which visual tier is active.

## 4. Locomotion and body realism

The controller includes:

- camera-relative analog motion
- gradual acceleration and braking
- ground and air control
- sprint
- coyote time
- jump buffering
- variable jump height
- landing telemetry
- automatic mantling
- player collision
- ceiling collision
- camera obstruction
- shoulder switching
- automatic shoulder relief in tight spaces

Animation consumes physical telemetry rather than guessing from button presses. Gait cadence follows travel speed. Landings know approximate impact strength. Turns feed torso and head response.

## 5. Contact and IK-style grounding

The procedural rig uses lightweight visual grounding rather than expensive full-body IK.

- feet sample the local support height
- feet may rise independently on small height differences
- foot rotation responds slightly to vertical offset
- hands may reach toward context targets
- characters turn toward stationary interactions
- attention is clamped to human-scale head motion

When authored characters are supplied, the semantic and contact systems remain useful inputs for a later true skeletal IK solver.

## 6. Multiplayer interpolation

Remote players do not chase the newest snapshot directly.

`SnapshotBuffer` stores received snapshots using **local receive time**. This is important because server timestamps and `performance.now()` are not the same clock.

The renderer samples a slightly delayed timeline and may extrapolate only a very short distance. This reduces:

- jitter
- micro-teleports
- rubber-band turns
- mismatched animation speed

Server authority remains separate from rendering smoothness.

## 7. Island simulation

Family Island Life adds persistent world simulation on top of the shared 3D layer.

### Weather
Deterministic weather segments provide:

- sunny
- partly cloudy
- overcast
- rain
- storm
- mist

Weather affects exposure, sun intensity, hemisphere light, fog, rainfall visuals, wind input and ambient sound probabilities.

### Terrain
The island uses a heightfield rather than one perfectly flat disc. Elevation remains restrained around the village and residential ring so houses and shops do not intersect terrain.

### Water
The water shader provides:

- low-cost vertex waves
- view-angle fresnel response
- shallow/deep colour blending
- moving sparkle
- animated shoreline foam

It deliberately avoids an expensive secondary reflection render pass on phones.

### NPC visitors
Private family visitors use:

- deterministic routines
- A* pathfinding
- outdoor/indoor routine bias from weather
- destinations such as coffee, shopping, work, fishing, gathering, sitting and visiting homes

They exist to make a solo island feel inhabited without pretending to be other online players.

## 8. Interactive home objects

Furniture is now treated as a gameplay object, not merely decoration.

Server-authorized examples include:

- chairs and sofas: sit / relax
- hammock: sit / relax
- TV: watch
- tub: bathe
- sink: wash
- desk: sit / work
- table: sit
- stove: cook
- fridge: use
- dresser: wardrobe
- lamp: toggle light
- bed: sit / sleep

The server checks that the resident is actually inside the correct home and close enough to the furniture. Sleeping is restricted to the owner's bed.

Lamp state persists on the furniture piece and drives the actual 3D point light.

## 9. Selective physics

Full rigid-body simulation is intentionally not enabled for the whole world.

Small loose objects can be registered with the selective physics system and receive:

- gravity
- bounce
- friction
- rolling/spin
- player nudges
- world bounds
- sleeping

Large furniture, buildings and collision architecture remain deterministic.

## 10. Audio

The shared WebAudio system does not require binary sound files for core feedback.

It provides synthesized/filtered cues for:

- footsteps
- landings
- impacts
- doors
- prop-zapper fire
- UI confirmation
- coffee/appliance activity
- birds
- water
- rain/wind ambience

Footstep/landing filtering now differs for:

- grass
- dirt
- sand
- gravel
- concrete
- wood
- metal
- water

The user has one persistent SND panel across the 3D games with volume and mute settings.

Authored audio files can later replace or augment these cues without changing the event architecture.

## 11. Cinematics

The cinematic camera helper is intentionally short and non-destructive.

Normal reveals:

1. ease away from the normal camera
2. hold briefly
3. ease back to the player's original camera

True end-state shots can opt out of restoration.

Current uses include:

- Prop Hunt introductions / match end
- Island home claim / entry / upgrade reveals
- Birthday Seat checkpoints / finish

Cinematics should never seize control during precision movement.

## 12. Prop Hunt specifics

Prop Hunt retains the strict real-3D rules from earlier rebuilds:

- depth-buffer wall occlusion
- no enemy X-ray outlines
- camera collision
- first-hit raycast shooting
- real 3D disguises
- collider changes with disguises
- real all-angle human/dog presentation
- backpack-mounted dog zapper
- network buffered remote movement
- weapon rig recoil

Authored family/dog/zapper GLBs can replace procedural versions when the manifest is populated.

## 13. Birthday Seat specifics

The Birthday Seat remains a real WebGL race rather than software pseudo-3D.

It includes:

- real family/dog runners
- moving platforms that carry riders
- jump buffering and coyote time
- checkpoints
- Cake Bounce
- 3D throne goal
- cinematic checkpoint feedback
- persistent 3D finish celebration
- surface-aware footstep feedback

## 14. Performance rules

The private collection still targets phones and tablets first.

High-cost effects should be concentrated around what the player is looking at.

Rules:

- procedural collision meshes stay simpler than visible hero meshes
- authored models need sane polygon and texture budgets
- no full-world dynamic rigid bodies
- no secondary real-time reflection camera for water
- only selected lamps cast local practical light
- ambient particles use pooled/shared geometry where practical
- remote player interpolation does not increase server tick rate just to hide visual jitter
- performance governor may reduce pixel ratio before removing gameplay features

## 15. What v2 does not claim

v2.0 includes the **authored model pipeline**, but this package does not contain bespoke sculpted/skinned family GLB files yet.

That distinction matters.

The procedural models remain the current visible fallback until real authored models are supplied and added to `public/models/manifest.json`.

The runtime, semantic animation vocabulary, sockets, authored clip mixer and fallback behavior are ready for that transition.

## 16. Definition of done for a future authored family model

A family model is not accepted merely because it loads.

It must:

- look correct from front, side and back
- preserve the recognizable family silhouette
- use human-scale proportions appropriate to the art bible
- have a clean humanoid skeleton
- expose hands/head/spine bones that can be found by the socket resolver
- have no billboarded face
- have no baked weapon permanently attached
- use mobile-appropriate texture sizes
- use physically plausible roughness/metalness
- support the semantic locomotion/action clip set or graceful fallbacks
- cast and receive shadows correctly
- not break camera collision or player collider assumptions
- perform acceptably with multiple family characters visible

The dog equivalent must be a true quadruped rig.
