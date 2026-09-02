# Black Family Game Night — Phase W.21 True-3D Cabin + World Props + Gameplay Recovery

Build date: 2026-08-28  
Runtime release: `GAME-NIGHT-STAGING-PHASE-W21-TRUE3D-WORLD-PROPS-GAMEPLAY-43`  
Design release: `GAME-NIGHT-DESIGN-PHASE-W21-TRUE3D-WORLD-PROPS-GAMEPLAY-43`  
Runtime version: `3.19.0-staging-phase-w21-true3d-world-props-gameplay-43`  
Status: **CURRENT HIGHEST-PRECEDENCE DIRECTIVE**

W.21 is cumulative on W.20. Preserve all prior family identity, catalog ownership, gameplay, room-economy, avatar-fitting, camera and save-compatibility decisions unless this directive explicitly supersedes them.

## 1. Non-negotiable cabin renderer correction

The W.20 personal-room view used an SVG shell plus positioned 2D item images. That architecture is superseded. A room is not considered complete merely because the catalog, placements and save state work.

The live W.21 owner/visitor room must use `public/cabin-3d-room.mjs` and render the room with Three.js/WebGL:
- true 14 x 16 ft room proportions;
- real floor and wall geometry;
- dimensional window opening/frame/glass;
- dimensional door opening/slab/hardware;
- perspective camera;
- physical room lighting and shadows;
- architectural finishes as 3D materials;
- catalog furniture as scene geometry;
- raycast item selection;
- raycast floor/wall placement;
- orbit camera, zoom and reset;
- existing move/rotate/duplicate/store/surface controls remain available.

The old flat room art may remain only for store thumbnails, historical proofs or WebGL-unavailable fallback messaging. It must not be the primary bedroom renderer.

### Cabin visual acceptance gate
A cabin room is not visually approved until a real-device screenshot proves visible perspective depth, dimensional walls/furniture, lighting and shadows. Passing coordinate/save tests alone is not proof of the visual target.

## 2. Room progression remains locked
- Personal rooms start as empty rustic wood shells with door, window and simple lighting.
- Tiny low-end starter inventory only.
- No starter furniture is pre-placed.
- Unlock once = reusable blueprint with unlimited placement.
- Only the room owner edits the room.
- Existing W.19+ placements are preserved during schema upgrades.
- Pre-W.19 legacy decorated rooms migrate once to the bare shell without deleting blueprint ownership.
- W.21 room schema saves as `decorVersion: 21`.

## 3. Shared World Props catalog — exactly 2,000 records

W.21 establishes the reusable world/environment prop library from `Black_Family_Game_Night_V1_World_Props_Master_Catalog.xlsx` and `public/world-prop-catalog-w21.json`.

Exact allocation:
- Indoor Cabin Props: 300
- Workshop / Garage / Papa's Shop: 280
- Farm / Barn / Goat Area: 220
- Outdoor / Campsite / Yard: 240
- Kitchen / Pantry / Dining: 180
- Family Signature Props: 160
- Pet Props: 120
- Wall / Shelf / Filler Decor: 150
- Interactive / Animated Props: 100
- Specialty / Hero / Rare Props: 120
- Seasonal / Event Props: 130

Total: **2,000**.

The catalog contains 200 flagship preview concepts across eight review batches and 41 named collections.

Each record carries deployment/gameplay metadata including hideable, climbable, large-cover, interactive, scale, family-signature, hero, seasonal, primary map and secondary-use tags.

## 4. World prop visual language

The shared prop base remains rustic/cozy grounded family realism, with believable wear, warm materials, readable silhouettes and enough stylization for game readability. Funny, premium, family-signature and seasonal pieces may branch outward while staying in one coherent product world.

Every world prop has a unique catalog identity and generated W.21 art file. This does **not** mean all 2,000 props are hand-sculpted production GLBs. `createWorldPropMesh()` is the current shared procedural 3D bridge and must preserve item metadata/identity while bespoke model production expands later.

Never collapse the catalog into visually indistinguishable generic clones and call that complete.

## 5. World-prop deployment priority

Primary Prop Hunt deployment order remains:
1. Papa's Shop
2. Camper / Campsite
3. Backyard / Fire Pit
4. Goat / Farm
5. Family Mystery rooms
6. Island Life shared props

W.21 integrates the catalog into:
- all four current Prop Hunt maps through `sprinkleWorldCatalog()`;
- Family Mystery room dressing;
- Island Life scene dressing;
- the reusable shared 3D art kit.

A prop may serve multiple roles: map dressing, Prop Hunt disguise, climbable surface, cover, cabin/common-space decor, collectible, reward, quest/pickup or later event item.

## 6. Blackgammon — checker-first playability repair

After the roll/allocation reaches movement:
- the player must **not** be required to choose a die before a checker becomes clickable;
- every checker with at least one legal move must glow/be actionable immediately;
- interaction is `tap checker -> tap highlighted destination`;
- selecting a die is optional and only filters the move set;
- bar checkers follow the same rule;
- direct legal-move buttons remain a fallback, not the primary interaction;
- engine legality remains authoritative.

Do not regress to the W.20 failure where the engine knew legal moves but the UI gated checker clickability behind `selectedBlackTokenId`.

## 7. Deck Sweep — mystery-card rule

The four face-down cards are genuine mystery cards, not decorative locked cards.

For each position:
- the mystery card becomes available when the face-up card immediately above that position has been played/removed;
- it is playable even if the player still has cards in hand;
- the player risks it without seeing the card first;
- after reveal, normal Deck Sweep rank resolution applies;
- if the mystery card is higher than the current pile top, the player picks up the entire center pile including the mystery card;
- a 10 still sweeps according to the established Deck Sweep rules;
- mystery cards remain independent per slot.

## 8. Trail Trouble and Prairie Pots — start-game recovery

The game shelf must provide a reliable `Play Now vs Computer` path for both games.

One click must:
1. create the room;
2. add one Medium computer player;
3. ready the human host;
4. start the room;
5. fetch the live state;
6. render the actual game.

`Multiplayer Room` remains available separately. Do not make the main Play action stop at an inert lobby.

## 9. Mexican Train — full played-train visibility

The screen must not shrink the board until long trains disappear.

W.21 rules:
- board-first single-column layout for the Mexican Train game screen;
- board viewport may scroll/pan when required;
- train chains wrap instead of clipping/hiding their tails;
- private train grid can collapse responsively;
- no 1050px maximum that unnecessarily miniaturizes the board on larger screens;
- the UI displays how many dominoes are placed on every private train and on the community Mexican Train;
- the public state continues to render every tile in each train array.

The established family rule remains: one domino per turn unless a double is played, in which case another domino must be played to satisfy/close the double obligation.

## 10. Save/identity compatibility

Preserve:
- all 2,000 W.20 home item IDs;
- all 2,000 W.20 wearable item IDs;
- the 400 earlier home IDs embedded in W.20;
- the 154 earlier wearable IDs embedded in W.20;
- all blueprint ownership;
- all W.19+ room placements;
- universal accessory fit;
- Family spelling `Lizzy` / `Elizabeth`, never `Lizzie`.

## 11. QA gates

Automated checks must specifically prove:
- active release/cache/build IDs are W.21;
- cabin uses `WebGLRenderer`, `PerspectiveCamera`, real geometry, lights, shadows and `Raycaster` selection;
- world prop count = 2,000 and flagship count = 200;
- all 2,000 world-prop IDs and names are unique;
- all 2,000 generated prop-art files exist and are individually distinct;
- Prop Hunt and other priority worlds import/use the W.21 prop library;
- Blackgammon checker-first movement is not gated by die selection;
- Blackgammon engine publishes legal moves during movement;
- uncovered Deck Sweep mystery cards remain playable with cards in hand;
- a too-high mystery card picks up the center pile;
- Trail/Prairie one-click start performs create + bot + ready + start;
- Mexican Train viewport styles preserve full train tails.

Real-device QA is still mandatory for final visual/touch approval, especially cabin 3D appearance, Blackgammon checker hit targets and Mexican Train long-train readability.

## 12. Truthfulness boundary

It is accurate to say W.21 contains:
- a true Three.js/WebGL personal-room renderer;
- the existing 2,000 home + 2,000 wearable catalogs;
- a new 2,000-record shared world-prop catalog;
- 2,000 unique world-prop catalog-art files;
- a shared procedural 3D world-prop bridge;
- the gameplay fixes listed above.

It is inaccurate to claim:
- every home item or world prop is already a bespoke hand-sculpted GLB;
- every wearable is already a production-rigged clothing mesh;
- real-device QA has passed unless it was actually performed;
- Cloudflare deployment was verified when Wrangler was unavailable.
