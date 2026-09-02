# Black Family Game Night — Phase W.21 Release Report

Build date: 2026-08-28  
Runtime release: `GAME-NIGHT-STAGING-PHASE-W21-TRUE3D-WORLD-PROPS-GAMEPLAY-43`  
Design release: `GAME-NIGHT-DESIGN-PHASE-W21-TRUE3D-WORLD-PROPS-GAMEPLAY-43`  
Version: `3.19.0-staging-phase-w21-true3d-world-props-gameplay-43`

## Executive result

W.21 fixes the architectural cause of the flat personal-room screenshot by replacing the live room decorator with a Three.js/WebGL renderer, adds the 2,000-record shared World Props catalog foundation, and repairs the five reported gameplay/viewport problems: Blackgammon checker selection, Deck Sweep mystery cards, Trail Trouble start, Prairie Pots start, and Mexican Train train visibility.

## True-3D cabin repair

The W.20 room page used an SVG room image plus absolutely positioned 2D placeable images. W.21 supersedes that live renderer with `public/cabin-3d-room.mjs`.

The new room renderer includes:
- real 14 x 16 ft room geometry;
- geometric floor/walls, window and door openings;
- dimensional door/window trim and glass;
- perspective camera;
- hemisphere, directional/window and warm interior lighting;
- cast/receive shadows;
- architectural finish materials;
- catalog-derived 3D furniture;
- raycast furniture selection;
- raycast floor/wall placement;
- orbit, zoom and reset controls;
- existing rotate/duplicate/store and precision movement controls.

Room schema is now `decorVersion: 21`. W.19+ placements are preserved. Pre-W.19 legacy rooms still receive the one-time bare-shell migration.

## 2,000 World Props catalog

W.21 packages `Black_Family_Game_Night_V1_World_Props_Master_Catalog.xlsx`, plus runtime JSON/module data and generated catalog artwork.

Totals:
- 2,000 records;
- 2,000 unique Prop IDs;
- 2,000 unique Prop Names;
- 200 flagship concepts;
- 41 collections;
- 2,000 generated prop-art SVG files with distinct SHA-256 hashes.

The approved 11-category allocation totals exactly 2,000.

Runtime integration:
- Prop Hunt: all four current maps receive catalog-driven world prop dressing;
- Family Mystery: W.21 world-prop art can dress room scenes;
- Island Life: shared catalog props are instantiated through the 3D art kit;
- shared art kit: `createWorldPropMesh()` provides the current procedural 3D bridge.

This is a unique-identity catalog and reusable 3D bridge, not a claim of 2,000 hand-sculpted GLBs.

## Blackgammon repair

Root UI issue: checker clickability was effectively gated by a selected die token even though the engine already exposed legal checker moves.

W.21 changes the primary flow to:
`tap legal checker -> tap legal destination`.

A die may still be tapped to filter choices, but it is no longer required. Bar entry follows the same checker-first principle. Direct legal-move buttons remain as fallback controls.

## Deck Sweep mystery-card repair

An uncovered face-down mystery card is now an actual playable action even when cards remain in the player's hand.

When risked:
- it is revealed only by the play;
- normal rank comparison is applied;
- if it is higher than the current pile top, the full center pile including the mystery card is picked up;
- 10/sweep behavior remains intact.

## Trail Trouble / Prairie Pots start repair

Both shelf cards now expose `Play Now vs Computer` as the primary action.

The client performs create -> add Medium bot -> ready host -> start -> fetch live state -> render. A separate `Multiplayer Room` option remains.

## Mexican Train viewport repair

W.21 removes the narrow board constraint and hidden train-tail behavior:
- board-first single-column layout;
- larger desktop width;
- scrollable board viewport;
- wrapping domino chains;
- visible private/community placed-tile counts;
- responsive private-train layout.

## Automated QA

Final `npm run check`:
- **558 tests**
- **558 pass**
- **0 fail**

Final staging validator:
- **4,231 pass**
- **2 warnings**
- **0 fail**

The two warnings are explicit environment/infrastructure items:
1. core 3D pages still use the existing Three.js CDN dependency;
2. Wrangler is unavailable in this packaging environment, so an actual Cloudflare deployment remains unverified.

## Manual device QA still required

Automated tests do not prove real-device visual/touch quality. Before calling the release visually final, test:
- cabin true-3D depth, shadows, camera and furniture selection on phone/tablet;
- Blackgammon checker-first touch targets after roll/allocation;
- Deck Sweep uncovered mystery-card taps;
- Trail/Prairie one-click start from the shelf;
- Mexican Train with deliberately long private/community trains on portrait and landscape screens.
