# Black Family Game Night v2.0.0-prop-true3d-alpha

This alpha keeps the full v1.9 game collection, including Family Sabotage, and replaces the visual presentation layer of **Family Prop Hunt** with a real WebGL / Three.js 3D renderer.

## Why v2 exists

The prior Prop Hunt engine tracked x/y/z coordinates but rendered the world through Canvas2D projection. That architecture produced the issues visible in phone testing: large flat wall slabs, paper-like characters, props that looked pasted onto the floor, limited character turning and poor local-player readability.

The v2 renderer keeps the proven Prop Hunt rules/input/state engine and changes the renderer instead of trying to keep polishing the old projection system.

## Prop Hunt true-3D layer

- real `THREE.Scene`, `PerspectiveCamera` and `WebGLRenderer`
- third-person camera collision against walls/buildings
- volumetric walls, furniture, structures and environmental props
- textured wood, stone, metal, earth, grass, gravel, fabric, plaid and hay materials
- fog, room lights, ACES tone mapping and soft shadows
- 3D family character rigs that rotate and animate with movement
- dog-specific 3D rigs
- modeled 3D hunter prop-zapper
- 3D farm animals
- one shared 3D prop factory for scenery, player disguises and decoys
- explicit local-player, disguise, lock-state, ammo and room HUD
- player-only location/facing minimap

The existing four expanded Prop Hunt worlds and their room/clutter definitions are reused, so this is a renderer replacement rather than a gameplay reset.

## Family Sabotage

Family Sabotage from v1.9 remains included with its secret Family Crew / Fixer / Saboteur roles, tasks, fake tasks, service vents, sabotages, emergency meetings, chat, voting, ghosts and bots.

## Test status

`npm run check` passes **209 / 209 tests**.

## Alpha runtime note

The Three.js module is currently imported from jsDelivr at runtime. The old renderer remains as a fallback. Because this build environment cannot fetch the CDN from its local browser sandbox, the real WebGL scene still needs a post-deploy phone/browser visual check.

When the true 3D renderer is active, the Prop Hunt status strip reads **TRUE 3D WEBGL ACTIVE**. If it does not, the CDN import did not load and the next engineering step is to vendor Three.js locally in the project.
