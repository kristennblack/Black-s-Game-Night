# Phase W.16 — Cabin + Realistic Cosmetics Runtime Report

Release: `GAME-NIGHT-STAGING-PHASE-W16-CABIN-COSMETICS-RUNTIME-38`
Package version: `3.14.0-staging-phase-w16-cabin-cosmetics-runtime-38`
Date: 2026-08-28

## Why this phase exists
W.14/W.15 correctly captured the approved realistic visual direction, but they were prompt/design packs. They did not change the live W.12 application. W.16 closes that gap by implementing the Cabin entry, Cabin runtime, merged room/cosmetic shop, fitted wearables and persistence in the real application tree.

## Home
- Direct **Visit the Cabin** hero action.
- Direct **Visit the Cabin** destination-row entry.
- **Cabin Shop + Cosmetics** replaces the old narrow token-store label.
- Visible universal currency terminology is **Game Night Tokens**.

## Cabin runtime
Implemented `public/cabin.html`, `public/cabin.js`, `public/cabin.css`.

Current runtime supports:
- realistic aerial/dollhouse presentation;
- named rooms for John, Kristen, Holly, Vanessa, Lizzie, Logan, James, Dorothy, Papa and Nana;
- permanent guest room keys for non-core players;
- owner-only decorating;
- visitor read-only mode;
- visitor reactions and guest book;
- local/offline fallback;
- 14×16 coordinate system;
- 0.5-ft movement steps;
- 90° rotation;
- persistent room placement data;
- realistic transparent representative placeable art.

## Cabin Shop / room blueprints
The live store now combines:
- 400 W.13 room records; and
- 154 W.16 fitted wearable records.

Room blueprint rules now have real server behavior:
- starter blueprints are automatically available;
- eligible token-store blueprints can be purchased with Game Night Tokens;
- reward/achievement/event/secret items cannot be purchased through the token-buy path;
- new room placements must be owned/starter blueprints server-side;
- an existing old placement is grandfathered so a migration does not destroy previous room saves.

## Wearables
The W.8 emoji implementation is superseded.

W.16 contains **154 asset-backed wearables** across:
- hats;
- hair accessories;
- eyewear;
- headsets/earmuffs;
- neckwear;
- jewelry;
- tops;
- badges;
- birthday/seasonal/arcade/achievement variants.

Every live catalog record points to a PNG or SVG runtime asset under `/cosmetics/assets/`.

## Fitting architecture
The shared renderer uses:
- slot-specific X/Y/scale/rotation data;
- character-specific fit overrides;
- per-item overrides;
- portrait-variant conflict suppression.

Variant conflict handling prevents duplicate items when the selected base portrait already contains an accessory, e.g. existing glasses, hats, scarves or earrings.

The shared `avatarHTML()` path passes avatar identity and portrait variant into the cosmetic renderer, so the same fitting system flows into shared card/tabletop/lobby portrait surfaces rather than only the store preview.

## Visual QA correction pass
File-existence tests were not accepted as visual proof. A contact/fitting review found weak early cutouts for some eyewear/headphone/clothing assets. Those were rebuilt/refined before release.

Final fit proof artifact:
`QA_W16_FAMILY_COSMETIC_FIT_GRID.png`

This proof uses actual packaged family portrait images with the same fit data used by the runtime renderer.

## Truthful 3D status
W.16 is intentionally described as **high-fidelity 2.5D** for portrait wearables and Cabin presentation.

It does not falsely claim:
- 400 unique furniture GLB meshes;
- a fully orbitable real-time 3D Cabin shell;
- physical visitor avatars walking in rooms;
- full-body GLB versions of all 154 wearables for Prop Hunt/Island Life.

Those remain later authored-3D production gates. For the card/tabletop portraits the fitted realistic 2.5D approach is the correct runtime technique because the base avatars are themselves 2D portrait images.

## Validation
Final working-tree and cold-ZIP counts are recorded after packaging. Live Cloudflare deployment remains unverified in this local environment if Wrangler is unavailable.
