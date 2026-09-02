# Black Family Game Night - W25 Production Asset Vertical Slice Report

Build date: 2026-08-31

Runtime release: `GAME-NIGHT-STAGING-PHASE-W25-PRODUCTION-ASSET-VERTICAL-SLICE-50`

Design release: `GAME-NIGHT-DESIGN-PHASE-W25-PRODUCTION-ASSET-VERTICAL-SLICE-50`

Version: `3.23.0-staging-phase-w25-production-asset-vertical-slice-50`

## Executive result

W25 changes the cabin/shop art pipeline rather than continuing to polish generated 2D catalog artwork. The 2,000 home and 2,000 wearable records remain intact for IDs, saves, ownership, pricing and collection metadata, while eight selected records become the gold-standard production vertical slice.

The normal shop now defaults to Production Shop and shows only the eight W25 production records. The remaining 3,992 records remain available under Concept / Coming Soon and are not presented as finished purchasable content.

## Locked art direction

- Stylized realism matching the approved family art direction.
- Upscale rustic lodge: warm authentic cabin materials with a polished modern finish.
- Mid-range 2022+ phone is the baseline performance target; desktop may use higher quality.
- Shop previews must come from the same production asset used in runtime.
- Automated tests are not visual approval.

## W25 gold-standard cabin assets

1. `W25-C01` Cognac Lodge Reading Chair
   - Actual GLB: `/models/w25/w25-cognac-lodge-reading-chair.glb`
   - Cognac leather, deep walnut frame, brass detailing.
   - Authored seat target.
   - Final character sit animation remains pending an approved production avatar mesh.

2. `W25-C02` Live-Edge Side Table
   - Actual GLB: `/models/w25/w25-live-edge-side-table.glb`
   - Deep walnut top with black metal sled frame.
   - Valid decor surface interaction.

3. `W25-C03` Linen + Bronze Table Lamp
   - Actual GLB: `/models/w25/w25-linen-bronze-table-lamp.glb`
   - Linen shade and bronze base.
   - Real runtime PointLight with persisted on/off state.

4. `W25-C04` Deep Walnut Upholstered Bed
   - Actual GLB: `/models/w25/w25-deep-walnut-upholstered-bed.glb`
   - Deep walnut frame, upholstered headboard, softened bedding forms.
   - Place/rotate production interaction.

## W25 gold-standard cosmetic assets

1. `W25-A01` Dark Brown Ranch Cowboy Hat
   - Actual GLB: `/models/w25/w25-dark-brown-ranch-cowboy-hat.glb`
   - Curved ranch brim, tapered crown, leather band and brass concho.
   - Actual-avatar fit master remains pending.

2. `W25-A02` Gold + Brown Aviators
   - Actual GLB: `/models/w25/w25-gold-brown-aviators.glb`
   - Teardrop brown lenses, gold frame, bridge, top bar and temples.
   - Actual-avatar fit master remains pending.

3. `W25-A03` Smooth Gold Hoops
   - Actual GLB: `/models/w25/w25-smooth-gold-hoops.glb`
   - True torus geometry with posts/clasps.
   - Actual-avatar fit master remains pending.

4. `W25-A04` Soft-Glam Beauty Filter
   - Implemented as a face-material/effect target, not a physical mesh or sticker.
   - Current preview is an art/effect target based on the approved Kristen reference.
   - Runtime face-material application remains pending the approved production avatar mesh.

## Single-source production-asset rule

For the seven physical W25 objects, the production GLB is the source of truth. Model-derived PNG thumbnails are used for the catalog cards and fallback preview. The live shop preview loads the same GLB. The four cabin GLBs are loaded by the actual cabin renderer for the mapped records.

If live 3D preview cannot initialize, the store falls back to the model-derived image from that same GLB rather than substituting unrelated concept art.

## Cabin integration

`public/cabin-3d-room.mjs` now recognizes the four W25 home production records and dynamically loads their exact GLBs with shadows and the existing selection/placement system.

- Lamp: real `THREE.PointLight`, toggleable, state stored on the placement.
- Chair: real authored seat target; no fake sit-animation completion claim.
- Side table: valid surface interaction.
- Bed: place/rotate interaction.

The existing non-W25 cabin catalog remains available for compatibility and remains concept/fallback content.

## Production Shop / Concept Lab

`public/tokens-store.html` now defaults to `production` mode.

- Production Shop: exactly eight W25 vertical-slice production records.
- Concept / Coming Soon: the remaining 3,992 catalog records.
- Production records show actual model-derived art and are blocked from purchase/equip until device approval.
- Concept records are explicitly labeled as unfinished.
- `public/w25-production-preview.mjs` provides the live rotatable GLB preview for production models.

## W25 Production Asset Lab

`public/w25-production-lab.html` is a staging-only visual QA surface using the actual cabin renderer and W25 models without changing ownership or save state.

It provides:
- the four cabin production assets in one room;
- lamp toggle testing;
- chair/table/bed selection;
- live standalone model inspection for cowboy hat, aviators and hoops;
- the soft-glam target preview;
- explicit messaging that cosmetic actual-avatar fitting is still pending.

## Character / cosmetic blocker

John already has a production-skinned GLB in the project. Kristen does not yet have an authored production GLB, and Kelsi does not yet have an individual approved turnaround or production quadruped GLB.

Therefore W25 does **not** claim that the hat, aviators, hoops or soft-glam effect have passed actual Kristen/John/Kelsi 3D fit. Final cosmetic fit should not be faked with generic stand-in meshes.

## Validation

- Full Node regression suite: **581 / 581 pass, 0 fail**.
- Staging validation: **4,280 pass, 2 warnings, 0 fail**.
- Local clean-port HTTP smoke check: Production Shop, Production Asset Lab, cabin entrypoint, W25 manifest, preview module and representative W25 GLBs all returned HTTP 200 from the W25 workspace.
- Standalone model-derived visual contact sheet manually inspected: `visual_proofs/W25_PRODUCTION_THUMBNAILS_CONTACT_V3.png`.
- Exact finished Build 50 ZIP cold-unzip validation: **581 / 581 tests pass**, **4,280 staging checks pass, 0 fail**, and `unzip -t` reports no compressed-data errors.

### Remaining validation warnings

1. Existing Three.js / GLTFLoader CDN dependencies remain in the project, including the W25 preview and cabin renderer.
2. Wrangler is unavailable in this environment, so live Cloudflare deployment is not verified here.

### Browser/device proof

A Chromium screenshot attempt was made against the isolated W25 local server. Chromium could not initialize a working GL implementation in this container and hung with DBus/GL initialization errors. No browser screenshot is claimed from that attempt.

Actual user-device visual review therefore remains mandatory before Device Approved.

## Release gate

Build 50 is a staging vertical slice, not a claim that the full 4,000-item catalog is repaired.

The eight W25 records may advance only after:

`Production Asset -> In-Game Visual QA -> Actual Avatar / Cabin Fit -> Device Approved -> Release Approved`

No mass catalog conversion should begin until this vertical slice visibly meets the approved target on the user's device.
