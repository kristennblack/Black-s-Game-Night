# Family Prop Hunt: Real 3D Architecture

## v1.3.0 foundation
The old canvas software-projection renderer is replaced by a Three.js WebGL scene. The Lodge remains the collection entry point. Prop Hunt uses a dedicated Durable Object room so real-time snapshots do not interfere with the original turn-based games.

## Client layers
1. `public/prop-hunt-3d.js`
   - WebGL renderer, PerspectiveCamera, lights, fog and shadows.
   - Procedural 3D environments and scene-object registry.
   - Hierarchical human and dog rigs.
   - Third-person camera, aiming, shooting, effects, UI, AI and room synchronization.
2. `public/prop-hunt-core.mjs`
   - Pure/testable collision, camera obstruction, role assignment, snapshot sanitation/interpolation and hit-range helpers.
3. `public/prop-hunt-3d.css`
   - Desktop/mobile game HUD and controls.

## Server layers
1. `propHuntRoom.mjs`
   - One Durable Object per Prop Hunt room.
   - SQLite-backed lobby/match state.
   - Hibernatable WebSockets for live movement snapshots/actions.
   - Host-managed computer players and match settings.
2. `worker.mjs`
   - Routes `/api/prop/*` to `PROP_HUNT` while preserving existing `GAME_HUB` behavior.
3. `wrangler.jsonc`
   - Separate `PROP_HUNT` binding and v2 SQLite class migration.

## Rendering/occlusion contract
- Opaque walls are real meshes and participate in the WebGL depth buffer.
- Windows are transparent meshes with collision/raycast geometry.
- Camera movement is shortened by world colliders before it can pass through a wall.
- Shooting uses a center-screen Raycaster and accepts the first intersected surface only.
- AI line of sight raycasts against the same world geometry.
- No Canvas 2D character drawing is allowed in Prop Hunt gameplay.

## Movement contract
- Acceleration/deceleration and sprint speeds are velocity-driven.
- Gravity and support checks keep players grounded.
- Step-up handles low obstacles.
- Jumping into a tagged climbable ledge triggers automatic mantle when height is reasonable.
- Ceiling clearance prevents the player's head from moving through an overhead solid.
- Character bodies gently separate from each other instead of ghosting through.

## Network contract
- Real player motion and host-driven bot motion send sanitized snapshots at 100 ms intervals.
- Remote motion is interpolated locally.
- Match phases, roles, health, prop changes, decoys, flash state, round/match score and active map are authoritative room state.
- Full wall hit validation remains client-geometry based in this private family build; server still validates role, target state and maximum hit range.

## Definition of done for future Prop Hunt changes
A change is not considered complete because a screenshot looks good. It must preserve real depth, wall/camera collision, all-angle characters, weapon attachment, disguise geometry, movement/vertical collision and multiplayer synchronization, with regression tests for any new underlying rule.
