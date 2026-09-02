# Black Family Game Night — Phase W.20 Master Catalog Report

Build date: 2026-08-28  
Runtime release: `GAME-NIGHT-STAGING-PHASE-W20-MASTER-CATALOG-42`  
Design release: `GAME-NIGHT-DESIGN-PHASE-W20-MASTER-CATALOG-42`  
Version: `3.18.0-staging-phase-w20-master-catalog-42`

## Executive result

W.20 expands the approved W.19 cabin/avatar foundation into a production-scale catalog system with **2,000 home records + 2,000 wearable records** while preserving W.18 gameplay fixes and W.19 room/customization behavior.

The approved master-catalog concept board is packaged at:
`public/approved-ui/master-catalog-preview-w20.png`

## Delivered catalog foundation

### Home catalog
- Exactly 2,000 live home records.
- Exact approved category allocation preserved.
- 400 W.19 home IDs are preserved for ownership/save compatibility.
- 2,000 individual browse SVGs.
- 2,000 individual placed/preview SVGs.
- SHA-256 QA confirms all 2,000 browse files are unique and all 2,000 placeable files are unique.
- Named collection metadata, rarity, prices, blueprint ownership and family-signature layers are included.
- Architectural finishes are live catalog items, including wall/floor compatible records.

### Wearable catalog
- Exactly 2,000 live wearable records.
- Exact approved category allocation preserved.
- 154 legacy wearable IDs are preserved for equip/save compatibility.
- 2,000 generated wearable SVG identity assets.
- SHA-256 QA confirms all 2,000 files are individually unique.
- New W.20 slot model supports layered clothing, outerwear, filters, earrings, hats, wigs, back items and novelty attachments.
- Legacy equipped records migrate by item identity into their W.20 slot.
- All wearable fits remain visible for every selectable family human and dog avatar.

## Scalable store and collection UX

`public/tokens-store.html` now supports the 4,000-record catalog using:
- All / Home / Avatar navigation;
- text search;
- category filtering;
- collection filtering;
- rarity filtering;
- sorting;
- paged/load-more rendering;
- owned/hero/signature state;
- exact home preview identity;
- selected-avatar wearable preview;
- packaged approved catalog lookbook reference.

The store does not render 4,000 cards at once.

## Cabin room integration

W.19 empty-room progression remains authoritative.

W.20 adds:
- large-catalog inventory search/filtering;
- architectural finish application/reset;
- finish ownership and surface compatibility validation;
- preservation of W.19 decorated rooms during W.20 migration;
- continued bare-shell migration for older pre-W.19 room data;
- existing select/move/rotate/duplicate/store/floor-wall placement controls.

Migration rules:
- `decorVersion < 19` → bare-shell migration;
- `decorVersion == 19` → preserve placements/finishes and upgrade to 20;
- W.20 saves as `decorVersion: 20`.

## Cross-game catalog artwork integration

Priority order remains Family Mystery → Prop Hunt → Island Life → Molly’s Light Chase.

Implemented hooks:
- **Family Mystery:** named W.20 flagship room objects use generated cabin placeable identities while its movement blocks, cinematic room framing and diagonal shortcuts remain.
- **Prop Hunt / Papa’s Shop:** named W.20 objects are instantiated through the shared catalog 3D bridge without replacing critical gameplay collision landmarks.
- **Island Life:** the furniture shop imports the W.20 catalog and builds catalog-derived 3D samples.
- **Molly’s Light Chase:** Pet Corner/cozy cabin W.20 identities dress the cabin environment while preserving the puppy/light-trail game loop.

## Art-truthfulness boundary

W.20 intentionally separates **catalog identity completeness** from **bespoke 3D mesh completeness**.

It is accurate to say W.20 contains:
- 2,000 unique home records;
- 2,000 unique home browse vector assets;
- 2,000 unique home placed/preview vector assets;
- 2,000 unique wearable records/assets;
- a shared procedural 3D catalog bridge used by the priority 3D games.

It would be inaccurate to call these 2,000 hand-sculpted home GLBs or 2,000 production-rigged clothing meshes. Those remain a future deep-3D production task. The W.20 master directive requires future 3D assets to preserve each catalog identity instead of collapsing them into category clones.

## Save and identity preservation

- 400 legacy home blueprint IDs preserved.
- 154 legacy wearable IDs preserved.
- Existing blueprint ownership remains valid.
- W.19 room placements are not destroyed by the W.20 upgrade.
- Legacy wearable slots migrate to the current item slot.
- Family spelling lock remains **Lizzy / Elizabeth**, never “Lizzie.”

## Automated QA

Final `npm run check` result:
- **549 tests**
- **549 pass**
- **0 fail**

Final staging validator:
- **2,228 pass**
- **2 warnings**
- **0 fail**

The two staging warnings are environmental/inherited:
1. core 3D pages still use the existing Three.js CDN dependency;
2. Wrangler executable is unavailable in this packaging runtime, so an actual Cloudflare deployment is **unverified**.

Neither warning represents a W.20 catalog/state/test failure.

## Manual device QA still required

Automated QA cannot prove final phone/tablet feel. The packaged W.20 QA checklist should be used to verify:
- search/filter/load-more responsiveness;
- touch selection and furniture editing;
- visual identity consistency across store/preview/room;
- architectural finish application;
- avatar clothing/accessory layering and clipping;
- dog adaptations;
- priority 3D game art taste and performance;
- portrait/landscape behavior;
- cache refresh behavior after deploying W.20.

## Packaged production references

W.20 includes:
- `MASTER_PHASE_W20_MASTER_CATALOG_DIRECTIVE.md`
- `MASTER_GAME_DESIGN_PRODUCTION_PROMPT_W20.md`
- `Black_Family_Game_Night_V1_Master_Catalog_Plan.xlsx`
- `public/approved-ui/master-catalog-preview-w20.png`
- `PHONE_QA_PHASE_W20_MASTER_CATALOG_42.md`
- this release report
