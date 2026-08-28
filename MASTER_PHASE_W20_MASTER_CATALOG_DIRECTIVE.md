# BLACK FAMILY GAME NIGHT
# MASTER PHASE W.20 — FULL MASTER CATALOG + VISUAL IDENTITY FOUNDATION

Planning/build date: 2026-08-28  
Runtime release: `GAME-NIGHT-STAGING-PHASE-W20-MASTER-CATALOG-42`  
Design release: `GAME-NIGHT-DESIGN-PHASE-W20-MASTER-CATALOG-42`  
Runtime version: `3.18.0-staging-phase-w20-master-catalog-42`  
Status: **HIGHEST-PRECEDENCE CURRENT DIRECTIVE**

W.20 is cumulative on W.19 and W.18. Preserve every earlier gameplay, room, avatar, 3D-camera and identity repair unless this directive explicitly supersedes it.

**Precedence note:** any older appended directive that still calls itself “CURRENT” is archival history. W.20 is the sole current highest-precedence directive in this package.

## 1. Approved visual target

The approved W.20 catalog lookbook is the visual contract:
`public/approved-ui/master-catalog-preview-w20.png`

The grounded base is **rustic/cozy cabin realism**. Catalog collections may extend into playful, funny, glam, luxury, fashion, fantasy, pet, family-signature and later seasonal/event directions, but the product must still feel like one coherent Black Family Game Night world.

Catalog art should be warm, legible, tactile and collectible. Items must read clearly at store-card size while remaining believable when previewed or placed.

## 2. Full catalog size contract

W.20 establishes two live core catalogs:
- **2,000 home items**
- **2,000 avatar/wearable items**
- **4,000 total live catalog records**

The catalogs are a core foundation. Seasonal/event expansions come later and should extend, not replace, the core IDs.

### Home allocation — exactly 2,000
- Clutter & Detail Props: 300
- Wall Decor & Pictures: 220
- Architectural Finishes: 180
- Windows & Doors: 150
- Lighting: 150
- Beds & Bedroom Furniture: 150
- Seating: 150
- Tables & Desks: 130
- Storage: 120
- Rugs & Soft Decor: 120
- Kitchen & Bath Utility Decor: 100
- Electronics & Entertainment: 90
- Outdoor / Porch / Deck: 80
- Specialty / Family / Interactive / Hero: 60

### Wearable allocation — exactly 2,000
- Tops: 240
- Bottoms: 160
- Dresses / Skirts / One-Piece: 120
- Jackets / Coats / Outerwear: 140
- Footwear: 140
- Hats / Headwear: 160
- Wigs / Hairstyles: 150
- Glasses / Face Accessories: 150
- Snapchat-Style Filters / Effects: 140
- Jewelry: 140
- Bags / Back Items: 100
- Scarves / Belts / Wrist Accessories: 120
- Costumes / Novelty Clothing: 140
- Wings / Tails / Ears / Horns / Attachments: 100

## 3. Save compatibility is mandatory

Catalog growth must not erase ownership or placements.

W.20 preserves:
- all **400 W.19 home blueprint IDs** as legacy-preserved records inside the 2,000-item home catalog;
- all **154 pre-W.20 wearable IDs** as legacy-preserved records inside the 2,000-item wearable catalog.

Never rename/recycle a preserved ID for a different object. Existing ownership, gifts, equipped cosmetics and room placements must resolve to the same identity after upgrade.

## 4. Home item identity contract

The category-clone shortcut remains prohibited. Every catalog record needs its own stable identity across the entire product.

W.20 ships per-record generated artwork:
- `public/cabin-assets/generated/thumbs/<id>.svg` — 2,000 browse identities
- `public/cabin-assets/generated/placeables/<id>.svg` — 2,000 placed/preview identities

All 2,000 files in each home set must be individually distinct. The same record identity must remain recognizable through:
**Browse → Buy/Unlock → Collection/Inventory → Large Preview → Room Preview → Cabin Placement → Shared 3D references where available.**

Every item is truly distinct in catalog identity. Hero and Family Signature objects should receive especially memorable silhouettes, construction details and accents.

## 5. Home collections and authored finishes

The full catalog is organized into named collections rather than a warehouse-like unstructured list. Collection definitions live in `public/w20-catalog-meta.mjs` and include core rustic collections, premium/luxury branches, playful collections and family-signature layers.

Architectural customization is first-class catalog content. Windows, doors, wallpaper, wall paneling, wall finishes, flooring and related shell treatments are named authored designs, not anonymous color swatches.

Owned architectural finish blueprints may be applied through the room editor to compatible surfaces. Bare pine remains the free default/reset state.

## 6. Cabin room progression and migration

Preserve the W.19 progression loop:
- personal rooms begin as bare rustic architectural shells;
- wood walls/floors, doors/windows and simple lighting remain;
- no purchased furniture is pre-placed;
- the small deliberately low-end starter inventory remains available;
- unlock once = unlimited blueprint placement;
- only the room owner may decorate.

Migration semantics are now versioned precisely:
- room data older than W.19 (`decorVersion < 19`) migrates to the bare-shell progression model;
- valid W.19 room data (`decorVersion == 19`) upgrades to W.20 **without clearing W.19 placements or finishes**;
- W.20 persists as `decorVersion: 20`.

Do not re-run destructive room migration on a room already intentionally decorated under W.19.

## 7. Room editor at 2,000-item scale

The editor must remain usable with a large catalog.

Required capabilities:
- search owned blueprints;
- category filtering;
- readable bounded result rendering rather than dumping thousands of DOM nodes at once;
- select placed item by tap/click;
- tap/click destination to move;
- precision movement controls;
- 90-degree rotate;
- remove/store;
- duplicate when blueprint-owned;
- floor/wall surface selection and snapping;
- reject out-of-room placement;
- apply/reset compatible architectural finishes;
- explicit save of dirty state.

Do not add arbitrary free resizing by default.

## 8. Store / collection UX at 4,000-item scale

The store must support discovery, not endless scrolling.

Required filters/navigation:
- Home / Avatar / All tabs
- text search
- category
- collection
- rarity
- sort
- incremental/paged rendering with load-more behavior
- owned state
- hero/signature visibility

Home preview:
- show exact item identity;
- use empty rustic room shell;
- provide room-context preview;
- use the matching placeable identity.

Avatar preview:
- use the currently selected avatar;
- use a large rectangular/bust/full-body stage rather than relying on tiny circles;
- layer selected/equipped cosmetic assets visibly;
- make fit judgment possible before purchase.

The approved W.20 lookbook should remain available as an art-direction/reference surface in the store.

## 9. Rarity, economy and collecting

Keep the blueprint economy authoritative for home objects: unlock once, then unlimited placement. Removing an object never destroys its blueprint.

The catalog may use permanent store purchase, bundles, drops, gifting, achievements, event rewards and later rotations as appropriate. Achievement/prestige rules from earlier directives remain authoritative where they conflict with generic gifting.

Rarity vocabulary should remain clear and useful for collecting and browsing. Current visual language may include Common, Uncommon, Rare, Premium, Legendary, Family Signature and Event Exclusive tiers.

Rarity should not mean that common objects are visually lazy. Even inexpensive basic items need their own believable identity.

## 10. Universal wearable compatibility

Every wearable unlock is expected to resolve visibly on every selectable family avatar, including Kelsi, Molly and Gunner.

Never solve clipping/conflict by silently hiding the item.

Use anatomical anchors, scale, offsets and avatar-specific fitting. Dog presentation may adapt the same owned identity into a sensible dog form, such as a torso garment becoming a shirt/harness overlay.

Primary W.20 slot vocabulary:
`hair, hat, headset, face, filter, earrings, neck, top, outerwear, onepiece, bottom, shoes, wrists, back, attachment, badge, costume`

Legacy saved slots must migrate by item identity to their current slot rather than losing equipped items.

Rich layering is encouraged where slots do not conflict. Snapchat-style filters/effects are a significant category but should not dominate the overall wardrobe.

## 11. Wearable art identity

W.20 ships:
`public/cosmetics/generated/<id>.svg` — 2,000 wearable identity assets.

All 2,000 generated wearable art files must be individually distinct. A wearable’s visual identity must remain recognizable from store card to avatar preview/equip state.

Normal/stylish clothing is the majority. The catalog also includes glam, themed, family-signature, funny, wigs, ears, horns, wings, filters and costume content.

## 12. Family-signature layers

Family-signature collections are an important layer, not the entire catalog. Keep a strong generic core while including special collection language for John, Kristen, Holly, Lizzy, Logan, Vanessa, Papa, Nana and the dogs, plus other family-world references already established in earlier directives.

The spelling lock remains absolute: **Lizzy** or **Elizabeth**, never “Lizzie.”

## 13. Shared 3D catalog bridge

Cross-game priority remains:
1. Family Mystery
2. Family Prop Hunt
3. Island Life
4. Molly’s Light Chase

W.20 integrates flagship catalog identities into those games through the shared 3D art kit and existing 2D/placeable artwork:
- Family Mystery uses named W.20 cabin objects in its room scenes while retaining glowing reachable movement blocks, tap-destination routing, cinematic room views and obvious diagonal secret passages.
- Prop Hunt / Papa’s Shop displays W.20 catalog-derived rustic props without blocking chase/play lanes.
- Island Life’s furniture shop can construct catalog-derived 3D samples using the shared art kit.
- Molly’s Light Chase uses Pet Corner/cozy-cabin catalog identities in its environmental dressing.

### 3D truthfulness boundary

Do **not** claim W.20 contains 2,000 hand-sculpted home GLB models or 2,000 production-rigged wearable meshes. It does not.

W.20 contains:
- 2,000 unique home catalog records;
- 2,000 unique home browse vectors;
- 2,000 unique home placed/preview vectors;
- 2,000 unique wearable records/assets;
- a smaller shared procedural 3D bridge for catalog-derived props in priority games.

Future bespoke 3D production work must preserve each catalog record’s approved identity rather than reducing the catalog back to repeated category geometry.

## 14. Visual-preview-first production rule

The V1 catalog plan and approved flagship lookbook remain production references. New large asset batches should be visually reviewed before full runtime integration whenever practical.

The production plan should continue to use collection/category concept boards, sample rooms, avatar lookbooks, hero sheets and cross-avatar fit previews as quality gates.

## 15. QA / acceptance gates

A W.20 release is not shippable unless automated QA proves at minimum:
- current runtime/design/cache markers are W.20 while W.18/W.19 historical constants remain available where expected;
- exact 2,000 home + 2,000 wearable counts and category allocations;
- 400 legacy home IDs and 154 legacy wearable IDs are preserved;
- all 2,000 home browse assets are individually unique;
- all 2,000 home placeable assets are individually unique;
- all 2,000 wearable assets are individually unique;
- every wearable returns a visible finite fit for every selectable family avatar/dog;
- legacy equipped slots migrate by item identity;
- 4,000-item store search/filter/paging and approved lookbook hooks exist;
- W.19 room data upgrades without destructive clearing;
- older pre-W.19 rooms still migrate into the bare-shell progression model;
- architectural finish ownership/compatibility is validated server-side;
- the four priority 3D games contain W.20 catalog integration hooks;
- visible family spelling contains no “Lizzie”;
- W.18/W.19 gameplay and cabin regression tests remain green.

Real-device phone/tablet QA still matters. Automated tests cannot prove touch target feel, perceived art scale, scroll performance on every device, final avatar clipping taste or final 3D art taste.

## 16. Preservation rules

W.20 must not regress:
- W.18 repaired Backgammon/Blackgammon, Deck Sweep, Campfire Chaos, Golf, Trail Trouble, Prairie Pots, Mexican Train, Family Mystery or Molly gameplay;
- W.19 empty-room progression, blueprint ownership, owner-only room editing or room furniture controls;
- prior 3D camera/movement recovery work;
- birthday/lobby/home/cabin systems unless explicitly superseded;
- approved family-character identity and naming rules.

When future directives conflict, the newest explicit user-approved rule wins. Otherwise preserve established behavior.
