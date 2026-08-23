# Black Family Game Night v1.3.0-real3d

This version keeps the Black Family Lodge and the existing game collection, while rebuilding **Family Prop Hunt** on a real WebGL 3D foundation.

## Prop Hunt rebuild
- Replaced the old Canvas 2D software-projection renderer with Three.js WebGL.
- Added a close third-person PerspectiveCamera, aim zoom, camera-wall collision, real depth buffering, shadows, fog and 3D raycast shooting.
- Rebuilt family players as all-angle hierarchical 3D mesh rigs. Faces exist on the front of the head only, so approaching from behind shows the back of the character.
- Rebuilt Kelsi, Molly and Gunner as quadruped 3D rigs with articulated legs, paws, heads, ears, tails, harnesses and backpack-mounted prop-zappers.
- Human prop-zappers are 3D mesh weapons attached to the hand rig with recoil, muzzle origin, tracers and impact effects.
- Added velocity-based walking/running, acceleration/deceleration, gravity, jumping, landing, step-up, automatic mantle and ceiling clearance.
- Added player-body separation so characters do not simply pass through each other.
- Disguises are actual 3D meshes with prop-sized player collision/camera height while health carries between disguise changes.
- Solid walls and windows participate in world collision and raycasts. Windows remain transparent but are physically solid.
- Shooting and hunter AI line-of-sight stop at world geometry.
- Decoys and wandering animals now participate in shot raycasts instead of being visually present but intangible to shots.

## Maps
All four family maps now use true 3D scene geometry. Papa's Shop is the reference vertical slice and includes a constructed shop/barn shell, doors/windows, ceiling/roof visuals, rafters, work areas, tractor, motorcycle, fireplace, Papa's yellow chair, climbable clutter and barn animals.

Camper / Campsite, Backyard + Fire Pit and Goat / Farm use the same WebGL world/collision system and retain their locked family landmarks.

## Real-time multiplayer
Prop Hunt now has its own Cloudflare Durable Object room (`PROP_HUNT`) rather than running only as a local human-plus-bots simulation.

- One private Durable Object per Prop Hunt room.
- SQLite-backed lobby and match state.
- Hibernatable WebSockets for player/bot movement snapshots and live actions.
- Remote movement interpolation.
- Host-managed map/mode/computer players.
- Ready/start flow, reconnect with the same player token, six-round scoring and map rotation.
- The Lodge's Prop Hunt **Play** and **Share Link** actions create a real private Prop Hunt room.

The original `GAME_HUB` and all 18 existing online games remain separate so the Prop Hunt real-time loop does not disturb the turn-based games.

## Testing
Run:

```bash
npm run check
```

Current result: **143 / 143 automated tests passing**.

The Prop Hunt tests now cover real geometry/camera math, wall ray hits, auto-mantle, ceiling clearance, role rotation, snapshot sanitation, Durable Object room creation/join/ready/start, WebGL renderer requirements and removal of the old Canvas 2D renderer.

## Important runtime note
The WebGL client loads Three.js `0.185.1` from jsDelivr when Prop Hunt starts. Prop Hunt therefore requires an internet connection, which is already required for its private real-time multiplayer room. The rest of the Lodge remains packaged as before.

See `FAMILY_GAME_ART_BIBLE.md` and `PROP_HUNT_REAL3D_ARCHITECTURE.md` for the locked visual and technical rules going forward.
