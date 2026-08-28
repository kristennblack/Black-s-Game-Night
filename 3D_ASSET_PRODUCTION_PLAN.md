# Real 3D Asset Production Plan

This document defines the external/authored art work still required. Procedural Three.js geometry and current parametric GLBs are not to be relabeled as finished production artwork.

## Family human avatars

Required finished reusable human assets:

- John
- Kristen
- Holly
- Vanessa
- Lizzie / Elizabeth
- Logan
- James
- Dorothy
- Papa
- Nana

Each finished human should provide:

1. recognizable family-specific face, hair and proportions using approved private reference material
2. intended clothing and footwear
3. authored mesh with sensible deformation topology
4. UVs and intentional materials/textures
5. a compatible humanoid skeleton/armature
6. clean skin weights
7. agreed bone/socket naming
8. browser-appropriate polygon and material counts
9. GLB/GLTF export with local dependencies
10. validation in the shared runtime loader

A common rig/retargeting contract is preferred, but characters must keep individual silhouettes, ages, proportions and identities.

## Dogs

Required finished dog assets:

- Gunner
- Kelsi
- Molly

Use a dog-specific quadruped rig. Do not force the humanoid skeleton or humanoid animation set onto the dogs.

## Shared authored human animation contract

Minimum library:

- Idle
- Walk
- Run
- Turn Left
- Turn Right
- Jump
- Fall
- Land
- Sit
- Wave
- Cheer / Celebrate
- Reaction

Locomotion should normally be in-place so gameplay physics remains authoritative for world movement/collision.

Family Mystery can reuse idle/walk/turn/reaction clips without inheriting the third-person controller.

## Shared dog animation contract

Minimum library:

- Idle
- Walk / Trot
- Run
- Sit
- Lie Down
- Reaction
- Tail/secondary motion

Optional later additions include sniff, scratch, shake and pant variations.

## Environment production order

1. Papa's Shop vertical slice
2. remaining Prop Hunt maps
3. Island Life exterior/interiors
4. Birthday Seat themed course art
5. Family Mystery dimensional board/rooms/corridors

## Prop Hunt environment assets

- Papa's Shop + attached searchable barn
- Camper / Campsite
- Acreage / Backyard + Fire Pit
- Farm / Goat area
- representative hideable prop libraries for each map

## Island Life assets

- island terrain/surfaces
- stores/businesses
- marina/docks
- houses
- resident home interior
- vegetation/rocks
- furniture
- work/crafting/shopping props
- doors/windows/signage/decor

## Birthday Seat assets

- authored obstacle families
- themed platforms/ramps/containers/crates/etc.
- birthday decorations
- final birthday-seat area
- strong route/landmark art hierarchy

## Family Mystery future assets

Architecture target remains:

**3D BOARD GAME - NOT YET IMPLEMENTED TO INTENDED VISUAL STANDARD**

Future art includes:

- dimensional board
- 3D rooms
- corridors/routes
- furniture/environment dressing
- mystery props
- character destination sockets
- camera framing anchors

Its board controls remain click/tap/path-driven rather than free WASD movement.

## Collision separation

Existing tested gameplay colliders/blockouts should remain simplified and invisible where practical. New detailed visual meshes should not automatically become high-complexity collision meshes.
