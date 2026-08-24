# Black Family Game Night v2.0.0
## Studio Realism Rebuild Notes

v2.0 is the point where the free-moving 3D games stop being treated as separate experiments and become one expandable 3D platform.

The release intentionally tackles the full upgrade list rather than shipping another narrow visual patch.

## 1. Proper authored 3D family-character pipeline

`shared-3d-studio.mjs` now provides an optional GLB/GLTF asset pipeline.

The loader:

- reads `public/models/manifest.json`,
- caches loaded GLTF scenes,
- uses skeleton-aware cloning for skinned models,
- applies scale/position/rotation corrections from manifest metadata,
- configures shadows/material environment intensity,
- exposes authored animations to the semantic mixer,
- falls back to procedural rigs if an entry/file is absent or fails.

No bespoke family GLB files are claimed in this release. The manifest remains intentionally empty.

## 2. Skeletal animation architecture

`SemanticAnimationMixer` maps gameplay terms to authored animation clips and crossfades them.

If a requested clip does not exist, sensible fallbacks are tried. For example, a missing run clip may use walk/idle rather than freezing on an old action pose.

Procedural rigs now cover a wider action set too, including:

- cook
- carry
- chop
- mine
- dig
- water
- cast
- reel
- sleep
- dance
- dog pant
- dog shake
- dog lie-down

## 3. IK-style grounding and contact

Procedural feet visually sample support height. Context actions can reach hands toward nearby targets. Attention is clamped to plausible head/eye motion.

This is not a full production skeletal IK solver yet, but it gives the gameplay layer the right contact information and provides the bridge for future authored rigs.

## 4. Face/expression states

Procedural humans expose eyes, brows, mouth and lower-lip parts. Shared expression states include neutral, happy, excited, focused, surprised, hurt, sleepy and annoyed.

Dogs expose jaw/tongue behavior for panting and richer idle/action readability.

## 5. Dogs

Dogs remain true quadrupeds with separate semantic behavior rather than scaled humanoids.

The authored pipeline includes dog-specific model slots. Procedural dogs now have richer action vocabulary, ears, tail, head/jaw/tongue behavior and backpack-zapper integration.

## 6. Lighting

The v1.8 shared tone/shadow work remains in force. v2 builds on it with weather-driven exposure/fog/sun changes in Island Life and persistent practical lights for home lamps.

The goal is readable stylized PBR rather than maximum light count.

## 7. PBR-like material response

The shared art kit uses generated roughness/normal/bump detail for common surface families. Authored GLBs are expected to provide proper base color/normal/roughness/metalness channels where appropriate.

## 8. Terrain

Island Life now uses a subtle heightfield instead of one perfectly flat world surface.

Elevation is deliberately flattened around:

- central village
- residential home ring
- building pads

This prevents the common open-world mistake where terrain visually cuts through doors/floors.

## 9. Water

Island water now uses a lightweight shader with:

- vertex waves
- view-angle fresnel
- shallow/deep color response
- sparkle
- animated shoreline foam

It does not render a second reflection camera.

## 10. Interactive furniture

Island home furniture is now an actual interaction system.

The server checks:

- the player is inside a home,
- the home exists,
- the furniture exists,
- the player is close enough,
- the requested action is valid for that furniture,
- bed sleeping belongs to the owner.

Semantic actions include sit, relax, watch, bathe, wash, work, cook, wardrobe, light and sleep.

Lamp on/off state persists with the furniture piece and drives an actual point light.

## 11. Selective object physics

Small loose props can have gravity, bounce, friction, spin, sleeping and player impulses.

This is deliberately not a full-world physics simulation. Large furniture and architecture stay deterministic.

## 12. Smarter NPC behavior

Island Life may spawn bounded ambient family visitors when those family avatars are not occupied by real residents.

Visitors use:

- deterministic routine selection,
- A* pathfinding,
- corner-safe diagonal routing,
- weather-sensitive destination choices,
- coffee/shop/work/fish/gather/sit/socialize/home routines,
- the shared semantic animation system.

## 13. Navigation

The navigation grid now avoids diagonal corner cutting. A bot cannot squeeze between two blocked orthogonal cells just because a diagonal mathematical step exists.

This is still lighter than a full baked navmesh and is appropriate for the browser/mobile target.

## 14. Multiplayer smoothing

`SnapshotBuffer` now stores **local receive time** separately from the server-supplied timestamp.

This fixes a class of interpolation bugs caused by mixing wall-clock (`Date.now`) with animation-clock (`performance.now`) values.

Remote actors are rendered on a slightly delayed timeline with short capped extrapolation.

## 15. Cinematic cameras

Short reveal shots are now reusable across games.

Non-terminal shots restore normal player framing. Terminal victory/match-end shots may opt out of restoration.

## 16. Weather

Island Life weather includes sunny, partly cloudy, overcast, rain, storm and mist states.

Weather coordinates:

- cloudiness
- rainfall
- fog
- wind
- exposure
- sunlight
- hemisphere light
- ambient audio probability
- some NPC routine bias

## 17. Sound

A shared WebAudio layer provides lightweight event feedback without requiring a giant audio download.

v2 adds surface-aware step/landing filters for:

- grass
- dirt
- sand
- gravel
- concrete
- wood
- metal
- water

Game-specific events use zap, impact, coffee, UI, bird, water, rain/wind and landing cues. A shared persistent SND control manages volume/mute.

## 18. Animation transitions

Authored clips crossfade through `AnimationMixer` rather than snapping. Procedural rigs use damped joint transitions and motion telemetry.

The key design rule is that transitions may not change authoritative player position unless gameplay explicitly requests movement.

## Per-game application

### Family Prop Hunt

- optional authored human/dog/zapper assets
- skeleton-safe reuse of one GLB across multiple players
- network snapshot buffering
- semantic authored/procedural animation
- real attachment recoil
- surface-aware footsteps
- intro/match-end cinematic layer
- existing depth-buffer occlusion and first-hit shooting remain untouched

### Family Island Life

- authored resident/dog bridge
- weather/day-night integration
- shader water/shore foam
- heightfield terrain
- ambient visitors/pathfinding
- server-authorized furniture use
- persistent lamp state
- selective physics props
- surface-aware footsteps
- jobs/foraging mapped to action-specific animation
- home claim/enter/upgrade reveals

### John's Birthday Seat

- authored runner bridge
- semantic authored/procedural locomotion
- real moving-platform carry
- surface-aware contact sound
- checkpoint cinematics
- persistent real-3D finish celebration

## Cloudflare architecture

The release keeps three coordination atoms rather than collapsing everything into one global room:

- GameHub
- PropHuntRoom
- IslandLifeRoom

Prop Hunt and Island Life continue using SQLite Durable Objects and the Hibernation WebSocket API pattern (`acceptWebSocket`, attachments and hibernatable message handlers).

The configuration uses:

- `wrangler.jsonc`
- `nodejs_compat`
- a current project compatibility date
- observability logs/traces

## Testing philosophy

v2 adds direct behavior tests for the new foundation instead of merely checking that a feature word exists.

Examples include:

- semantic authored clip resolution
- network timestamp domains
- A* building avoidance
- deterministic weather/routine behavior
- terrain limits
- server-side furniture permissions
- shoreline/audio/physics/cinematic wiring
- expanded procedural semantic actions

## Remaining visual ceiling

The biggest remaining visual jump is no longer another procedural coding pass.

It is the actual creation of high-quality authored assets described in `AUTHORED_3D_ASSET_GUIDE.md`.

When those are supplied, the v2 pipeline is designed to swap them into the same gameplay without discarding the movement, camera, networking, semantic animation or world systems.
