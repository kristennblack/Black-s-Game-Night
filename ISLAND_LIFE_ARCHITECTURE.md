# Family Island Life Architecture

## Purpose
Family Island Life is the persistent, open-ended life-sim branch of the Black Family Game Collection. It is designed to support long sessions and repeat visits rather than round-based play.

The design combines original versions of several broad life-sim ideas:
- a cozy explorable island,
- gathering and crafting,
- switchable jobs,
- resident needs,
- freeform town role-play,
- personal homes,
- persistent money/inventory,
- clothing and furniture collection,
- and multiplayer family presence.

## Runtime split

### Lodge / original games
`GAME_HUB -> GameHub`

The existing Lodge and original turn-based games remain on their existing room architecture.

### Prop Hunt
`PROP_HUNT -> PropHuntRoom`

Prop Hunt remains a separate real-time game room so its fast movement loop does not disturb turn-based games.

### Family Island Life
`ISLAND_LIFE -> IslandLifeRoom`

Island Life has its own persistent coordination object. One IslandLifeRoom represents one private island world.

This keeps persistent life-sim state isolated from card games and Prop Hunt while still launching through the same Lodge.

## Persistent resident record
A resident stores state such as:
- identity/name/family avatar,
- reconnect token,
- currency,
- selected job and job skill,
- inventory,
- wardrobe/equipped clothing,
- gentle need values,
- claimed home lot,
- house level/style,
- placed furniture.

Transient live movement is not treated as the only source of truth for durable player progression.

## Island world
The first island intentionally uses districts so exploration has purpose:

### Village / plaza
Primary shopping, services and social hub.

### Residential coast
Thirteen claimable family home lots arranged around the coastline.

### Tropical forest
Wood/resource gathering, trees and denser vegetation.

### Meadow / field
Open field area and gardening-oriented gathering/job space.

### Rocky cove
Stone/clay/mineral-style resource region.

### Beach / marina
Shoreline, shells/resources, fishing and marina activity.

The WebGL client builds real 3D scene geometry with colliders rather than treating these districts as flat background art.

## Character architecture
Humans and dogs are all-angle 3D scene objects.

### Humans
- Head/torso/limb hierarchy.
- Face geometry placed on the front of the head only.
- World rotation determines where the resident is facing.
- Movement animation operates on limb joints rather than rotating a 2D portrait toward the viewer.

### Dogs
- Four independently represented legs/paws.
- Body/head/muzzle/ears/tail geometry.
- Same world-orientation rule as humans.

The present meshes are procedural stylized rigs. They can later be swapped for authored GLB/GLTF rigs while preserving resident/network/home systems.

## Movement and camera
Island Life reuses proven 3D movement/math concepts from the Prop Hunt rebuild:
- velocity-based acceleration/deceleration,
- sprinting,
- gravity/grounding,
- step and collision handling,
- third-person perspective camera,
- camera obstruction checks,
- remote-player interpolation,
- player-body separation where applicable.

## Economy
Currency is persistent and earned through jobs/selling/activity rather than resetting each match.

Nine initial jobs:
1. Barista
2. Shopkeeper
3. Carpenter
4. Ranger
5. Gardener
6. Fisher
7. Stylist
8. Cook
9. Courier

Work uses a cooldown and skill progression. Higher job skill can improve pay.

## Physical authorization
Important interactions are server-authorized against the resident's latest accepted world position. This prevents the client from treating UI clicks as automatic success.

Examples:
- Work requires proximity to the assigned workplace.
- Shopping requires proximity to the correct store.
- Foraging requires proximity to the resource node.
- Claiming requires proximity to the selected lot.
- Tool requirements are verified for applicable resources.
- House editing verifies ownership.

Network coordinates and animation state are sanitized before being accepted.

## Resource nodes
Forage nodes have:
- district-specific locations,
- resource yields,
- tool requirements where needed,
- persistent/shared cooldown state.

Harvesting hides/cools down the individual resource node, not its whole parent district or unrelated scenery.

## Home system
Each resident can claim one available lot.

Homes support:
- upgrade levels,
- material + currency requirements,
- exterior style,
- enterable interior,
- level-dependent interior bounds,
- furniture placement/movement/removal,
- owner-only editing.

Furniture placement is sanitized to keep objects inside allowed home space.

## Needs
Energy, Food, Fun and Social decay slowly. They are a texture layer for life simulation, not a hard survival mechanic.

Needs can be restored through sleep, food/drink and activities. Offline/elapsed-time calculations are deliberately conservative.

## Networking
Island Life uses hibernatable WebSockets through its Durable Object for live resident state. Durable progression uses SQLite-backed room state.

The client interpolates remote residents toward their latest accepted network target to reduce visible snapping.

## Day/night
The island uses a long in-game day cycle and adjusts scene lighting over time. The cycle is part of the persistent room state rather than starting from noon every time someone refreshes.

## Current art limitations
This release establishes the systems and spatial foundation. Current environment and character meshes are stylized procedural geometry, not final AAA art.

Future art upgrades should preserve:
- all-angle silhouettes,
- true building depth,
- enterable interiors,
- collision/readability,
- district landmarks,
- mobile performance,
- and the shared Family Game Art Bible.

## Non-goals for this release
Not yet claiming final production polish for:
- bespoke facial animation,
- high-resolution authored character sculptures,
- complex NPC dialogue trees,
- deep farming crop genetics/seasons,
- vehicles,
- large quest/career storylines,
- pet breeding,
- user-generated building-wall construction tools.

Those can be layered onto the persistent architecture rather than faked into the first version.
