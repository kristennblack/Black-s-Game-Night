# Black Family Game Night v1.7.0
## Living Worlds Rebuild Notes

## Why this pass exists

v1.6 unified the actual 3D technology, movement, camera and control language. v1.7 goes back through those same games and focuses on the next visible weakness: scenes could still feel assembled instead of inhabited, and procedural character motion could still read as a rig being driven rather than a body reacting to momentum.

This pass deliberately avoids changing the Lodge/game-room architecture or replacing the multiplayer backends. It improves the shared front-end world/animation layer so Prop Hunt, Island Life and Birthday Seat gain the work together.

## Shared animation changes

`public/shared-3d-gameplay.mjs` now tracks motion telemetry for each actor:

- smoothed travel speed
- acceleration/deceleration
- turn rate
- travel-driven stride phase
- idle duration
- air time
- vertical speed
- landing impact

The procedural animator uses those values instead of relying only on a semantic word such as `run`.

Visible results include:

- stride cadence changes with actual movement speed
- body leans subtly into acceleration and turning
- torso and hips counter-rotate
- sprint elbows carry more bend
- jump, fall and landing arm silhouettes differ
- landing compression responds to air time
- head movement reacts to vertical motion/turning
- idle breathing/blinks/weight shift remain subtle
- dogs occasionally lower the head/sniff while idle
- dog ears, tail, head and four-leg gait remain secondary-motion systems

The existing semantic/transient state system remains intact for aim, hit, mantle, work, wave, drink, sit and celebrate.

## Shared living-world art kit

`public/shared-3d-art-kit.mjs` now provides additional reusable place builders:

- plaza fountain with animated water
- beach umbrella/chair cluster
- market stall
- community notice board
- residential mailbox
- balloon/party arch
- ambient bird flock with wing motion
- existing fans, string lights, particles, grass, bushes, rocks, lamps, furniture and workshop objects

The purpose is not to scatter these objects everywhere. They are landmarks and human-use cues that help scenes explain themselves.

## Family Prop Hunt

### Papa's Shop

Retains the deep workshop construction from v1.5/v1.6 and adds more exterior arrival/context detail:

- community/shop notice board
- roadside/property mailbox
- light ambient birds
- existing textured shop/barn shells, rafters, ceiling, practical lights, fan, tool rack, cabinet, workbench, tool chest, shelving, drill press, compressor, welding cart, ladder, tractor, motorcycle, fireplace, chair, stalls, fencing, clutter and vegetation

### Camper/Campsite

Adds more shoreline/campsite identity:

- beach umbrella/chair cluster
- ambient birds over shoreline
- existing string lights, fire/smoke, tent, truck, picnic/BBQ objects, water movement, foliage and ground clutter

### Backyard/Acreage

Adds more property/activity cues:

- notice board/signage detail
- ambient birds
- existing deck, hot tub, shops/sheds, trailer, boat, trampoline, pool, garden rows, fire-pit lighting, seating and landscaping

### Goat/Farm

Adds more farm-market/activity identity:

- small feed/produce stall
- notice board
- ambient birds
- existing pens/stalls, fences, sea can, hay/lumber, farm tools, mud area, vegetation and animal NPCs

## Family Island Life

The island receives stronger landmark hierarchy rather than simply more buildings.

### Village plaza

The center now uses:

- an actual fountain as primary civic landmark
- island-name sign
- community notice board used as the map interaction point
- benches
- planters
- lamp posts
- market stalls
- pollen/ambient particles
- light ambient bird motion

This gives the village a place to gather and a recognizable center.

### Beach and marina

Adds:

- beach umbrella/chair clusters
- marina notice board
- ambient birds
- existing palms, docks, lamps, seating, signs and moving ocean surface

### Residential coast

Every persistent lot receives a mailbox near the arrival edge. Claimed and vacant lots use different mailbox color treatment. This gives each lot a human-scale arrival object even before a house is heavily decorated.

### Existing districts retained

Forest, meadow/fields, rocky cove, stores, residential lots and enterable homes keep their v1.6 game systems while inheriting the expanded environmental kit.

## John's Birthday Seat

The course now has a stronger physical/world context.

### Structural readability

Static elevated course platforms receive visible posts/bracing. Deliberately moving gift/balloon platforms remain unsupported so their fantasy behavior reads as intentional.

### Papa's Shop section

The bottom stage is dressed with:

- tool rack
- storage cabinet
- lumber/material stack
- work light
- floating workshop dust

### Campsite section

Adds:

- tent
- animated campfire
- bench
- string lights
- bushes/grass
- pollen/embers atmosphere

### Farm section

Adds:

- fencing
- tool rack
- rocks
- grass/field dressing

### Birthday summit

Adds:

- party/string lights
- lamps
- bench/planter
- balloon party arch
- market/party stall
- ambient particles and birds
- existing 3D throne/goal

The route therefore reads as a climb through four themed places rather than a helix of unrelated floating blocks.

## Performance rules

This pass still targets phones/tablets. The scene improvements follow these constraints:

- visible detail can be complex while collision stays simplified
- ambient movement changes visual child geometry, not authoritative colliders
- particles use small point buffers rather than physics objects
- bird motion is lightweight transform animation
- no expensive post-processing chain was introduced
- the existing dynamic pixel-ratio performance governor remains active
- dynamic lights are kept selective

## Design rule introduced by v1.7

**Density must have purpose.**

An object earns its place when it improves at least one of:

- scene identity
- scale
- navigation
- activity/storytelling
- interaction
- cover/hiding
- climbing/platforming
- social gathering
- composition

If it only makes the polygon count larger, it should not automatically be added.

## Validation

The automated suite now includes direct checks for:

- v1.7 shared gameplay version
- motion telemetry
- travel-driven animation values
- living-world asset builders
- v1.7 landmarks appearing across all three free-moving games
- structural support in Birthday Seat
- acceleration/turn lean and airborne animation language
- fresh service-worker cache/version markers
- every pre-existing Lodge/game regression

Automated tests cannot decide whether the final scene is attractive on a specific phone. Use the updated `3D_GAME_QA_MATRIX.md` for real-device visual signoff.
