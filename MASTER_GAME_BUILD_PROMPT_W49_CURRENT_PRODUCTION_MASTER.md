# MASTER GAME BUILD PROMPT — W49 CURRENT PRODUCTION MASTER

## HIGHEST-PRECEDENCE W49 DIRECTIVE

# MASTER PHASE W49 — GUNNER 30 LOOKS SHOP + PLAYER SHOP CLEANUP DIRECTIVE

## Status
Highest-precedence directive for Gunner complete-look merchandising, John/Holly Looks Shop image recovery, and player-facing shop simplification.

W49 extends W48 and W47. It does **not** replace or reduce the approved John or Holly complete-look collections.

## Locked Gunner identity source
The user explicitly confirmed the exact playable Gunner avatar from the current game before the W49 collection was created.

Locked base reference:
- `visual_proofs/gunner_30_looks/GUNNER_APPROVED_GAME_AVATAR_SOURCE.png`

Approved 30-look visual board:
- `visual_proofs/gunner_30_looks/GUNNER_30_APPROVED_LOOKS.png`

Runtime crop proof derived from that approved board:
- `visual_proofs/gunner_30_looks/GUNNER_30_RUNTIME_LOOKS_PROOF.jpg`

### Absolute identity rule
For Gunner, do not invent, reinterpret, substitute, or regenerate another dog and call it Gunner. Runtime portraits must remain crops/format conversions of the user-approved look board.

The confirmed-avatar-first rule remains mandatory for every future person or pet:
1. locate the exact playable avatar already in the game;
2. show that exact source to the user;
3. receive confirmation if there is any uncertainty;
4. only then generate a complete-look collection;
5. use only the approved collection art for packaged runtime portraits.

## Approved Gunner collection — 30 complete looks
1. Everyday Gunner
2. Cabin Cozy
3. Birthday Boy
4. Cowboy Gunner
5. Lake Day Gunner
6. Plaid Pup
7. Game Night Buddy
8. Prop Hunt Pup
9. Explorer Gunner
10. Winter Toque
11. Campfire Buddy
12. Sunday Best
13. Rainy Day Pup
14. Trail Champion
15. Holiday Sparkle
16. Fishing Buddy
17. Pajama Pup
18. Firefighter Pup
19. Construction Gunner
20. Family Photo Gunner
21. Bandana Buddy
22. Ball Cap Buddy
23. Lumberjack Pup
24. Adventure Harness
25. Celebration Crown
26. Cozy Scarf
27. Mountain Trek
28. Weekend Cutie
29. Birthday Balloons
30. Sleepy Sweater Gunner

## Runtime asset contract
- IDs: `gunner-look-01` through `gunner-look-30`.
- Authoritative catalog: `public/gunner-looks-catalog.mjs`.
- Manifest: `GUNNER_30_LOOKS_MANIFEST.json`.
- Unified player storefront: `public/looks-shop.html`.
- Everyday Gunner is the free starter look.
- Gunner complete looks use the same ownership/equip model already proven for John and Holly.

### W49 canonical complete-look image path
The player-facing app and Looks Shop now use fresh canonical URLs:
- `public/look-assets/john-look-XX.jpg`
- `public/look-assets/holly-look-XX.jpg`
- `public/look-assets/gunner-look-XX.jpg`

The earlier `public/avatars/styles/...` copies remain packaged only for backward compatibility and historical tests.

This path separation is intentional. It repairs the user-reported broken John/Holly Looks Shop portraits by avoiding stale older shop URLs and by giving W49 a new service-worker cache identity. The shop also has a base-avatar image fallback if an individual complete-look image ever fails to load.

## Looks Shop collections
The normal Looks Shop exposes exactly the currently approved complete collections:
- John — 30 looks
- Holly — 30 looks
- Gunner — 30 looks

Each locked card remains visible. Owned cards can be equipped. Purchases are permanent.

## Gunner purchase and win rules
All Gunner looks can be purchased with Game Night Tokens except the free starter. Selected looks can additionally be won through actual Gunner arcade play.

Real W49 win integrations:
- `gunner-look-07` Game Night Buddy — save the first goat in Gunner's Goat Run.
- `gunner-look-14` Trail Champion — save 5 goats in Gunner's Goat Run / earn Good Boy Gunner.
- `gunner-look-24` Adventure Harness — collect 20 snacks in Gunner's Snack Attack.

A reward grant unlocks the exact same permanent store item. It does not create a duplicate reward-only version.

## Server persistence
Arcade profile complete-look fields now include:
- `johnLooks` / `equippedJohnLook`
- `hollyLooks` / `equippedHollyLook`
- `gunnerLooks` / `equippedGunnerLook`

`POST /api/arcade/look` supports `character: "john"`, `"holly"`, or `"gunner"` with:
- `buy`
- `equip`
- controlled `grant`

Token charges, ownership and reward grants remain server-side validated/persisted.

## Player-facing shop simplification — locked
The user explicitly requested that the normal game present only two shopping destinations:
1. **Looks Shop**
2. **Cabin Room Shop**

### Looks Shop
`/looks-shop.html`
- complete approved character/pet looks only;
- John, Holly, Gunner as of W49;
- purchase, win, own and equip.

### Cabin Room Shop
`/cabin-room-shop.html`
- furniture, decor and room blueprints purchasable with Game Night Tokens;
- search/category/collection/rarity filtering;
- permanent reusable blueprint ownership;
- direct route back to the Cabin.

### Removed from the normal player experience
Do not expose these as normal player-facing shop/navigation destinations:
- Approved Lookbook
- Production Lab
- John Head Fit Proof
- Approval Studio
- Family V1 Lab

Their historical implementation files may remain packaged for engineering regression/history, but normal routes redirect to one of the two player shops unless an explicit `?legacy=1` engineering query is used. Normal Lodge, Cabin and Arcade navigation must not advertise those labs.

The old `tokens-store.html` and `john-looks-shop.html` are compatibility routes, not normal player shops. Without explicit legacy mode they redirect to Cabin Room Shop and the unified Looks Shop respectively.

## Cabin navigation rule
Normal Cabin navigation should offer:
- Lodge
- Looks Shop
- Cabin Room Shop
- Cabin Overview / My Room

Do not show player-facing links for the 4,000-item catalog, 2,000 World Props, production shop, catalog approval studio, or QA-lab destinations.

## Service-worker repair rule
W49 uses a new cache identity:
`black-family-game-night-staging-candidate-w49-gunner-30-looks-shop-cleanup-67`

The W49 shell includes:
- unified Looks Shop;
- Cabin Room Shop;
- Gunner look catalog;
- all 90 canonical fresh complete-look portraits.

Activating W49 removes older caches, preventing an older cached shop shell/image set from surviving the upgrade.

## Compatibility
Preserve all compatible W48/W47/W46/W30 gameplay, multiplayer, cabin placement, Prop Hunt, tabletop, arcade, save IDs, John ownership and Holly ownership.

W49 is a focused merchandising/navigation repair and Gunner collection extension, not permission for unrelated gameplay rewrites.

## Technical verification gate
W49 technical candidate passes only when:
1. all 30 Gunner runtime portraits exist in the canonical W49 look-assets directory;
2. all 30 Gunner records are unique and match the approved collection;
3. the confirmed Gunner source, approved Gunner board and runtime proof are packaged;
4. unified Looks Shop exposes John, Holly and Gunner;
5. all 90 John/Holly/Gunner canonical W49 shop images exist and are non-empty;
6. John and Holly shop paths use the fresh W49 image URLs with fallback behavior;
7. Gunner looks can be bought/equipped server-side;
8. the three Gunner win conditions grant the real store items;
9. Cabin Room Shop can buy reusable room blueprints through `/api/cabin/item`;
10. normal player navigation exposes only Looks Shop and Cabin Room Shop as shops;
11. legacy lab routes are absent from normal navigation and redirect outside explicit legacy mode;
12. W49 service worker caches both shops plus all 90 canonical complete-look portraits;
13. full regression and syntax/check suites pass;
14. staging validator reports zero failures;
15. exact final ZIP cold-extracts and passes the same gates.

Real-device visual approval remains separate from technical packaging approval.


---

# PRESERVED W48 CURRENT PRODUCTION MASTER

# MASTER GAME BUILD PROMPT — W48 CURRENT PRODUCTION MASTER

## HIGHEST-PRECEDENCE W48 DIRECTIVE

# MASTER PHASE W48 — HOLLY 30 LOOKS SHOP DIRECTIVE

## Status
Highest-precedence directive for Holly avatar identity, Holly complete-look merchandising, and the confirmed-avatar-first workflow for future family Looks Shop collections.

W48 extends W47. It does **not** replace or reduce John's approved 30-look collection.

## Locked Holly identity source
The user explicitly confirmed the exact playable Holly avatar source before the W48 collection was created.

Locked base reference:
- `visual_proofs/holly_30_looks/HOLLY_APPROVED_GAME_AVATAR_SOURCE.png`

User correction:
- Holly's eyes are blue.

Approved 30-look visual board:
- `visual_proofs/holly_30_looks/HOLLY_30_APPROVED_LOOKS.png`

Runtime contact proof derived from the approved board:
- `visual_proofs/holly_30_looks/HOLLY_30_RUNTIME_LOOKS_PROOF.jpg`

### Absolute identity rule
For Holly, do not invent, reinterpret, redraw, substitute, or regenerate another face and call it Holly.

The W48 runtime portraits are crops/formatting of the user-approved Holly board. They are **not** newly generated face interpretations.

For all future family members:
1. locate the exact playable avatar image already used by the game;
2. show that exact image to the user;
3. ask for confirmation if there is any uncertainty;
4. only after confirmation create that person's look collection;
5. preserve the confirmed face/identity across every look.

## Approved Holly collection — 30 complete looks
1. Everyday Holly
2. Cabin Cozy
3. Birthday Princess
4. Dance Class Holly
5. Cowgirl Holly
6. School Day Holly
7. Lake Day Holly
8. Gamer Holly
9. Pajama Party
10. Sunday Sweet
11. Winter Toque
12. Pink Hoodie Holly
13. Story Time Holly
14. Campfire Cutie
15. Ballet Bow
16. Family Photo Holly
17. Holiday Sparkle
18. Ski Day Holly
19. Floral Dress Holly
20. Varsity Holly
21. Little Explorer
22. Tea Time Holly
23. Rainy Day Holly
24. Sleepy Sweater Holly
25. Sparkle Tiara
26. Summer Sunshine
27. Craft Room Holly
28. Trail Day Holly
29. Birthday Balloons
30. Weekend Cutie

## Runtime asset contract
- IDs: `holly-look-01` through `holly-look-30`.
- Portraits: `public/avatars/styles/holly-look-XX.jpg`.
- Authoritative catalog: `public/holly-looks-catalog.mjs`.
- Manifest: `HOLLY_30_LOOKS_MANIFEST.json`.
- Unified customer storefront: `public/looks-shop.html`.
- Everyday Holly is the free starter look.
- Holly now uses complete-look portraits in normal game/profile rendering rather than the old four generic Holly style images.
- Complete Holly looks do not stack legacy loose portrait cosmetics in normal avatar rendering.

## Looks Shop product decision
The user-facing store is **Looks Shop**.

W48 supports:
- John — 30 complete looks from W47;
- Holly — 30 complete looks from W48.

Locked looks remain visible and route to the Looks Shop. Ownership is permanent.

The old `/john-looks-shop.html` route remains packaged for W47/save/history compatibility, but normal W48 navigation points to `/looks-shop.html`.

## Purchase and win rules
All Holly looks can be acquired with Game Night Tokens except the free starter, and selected looks can additionally be won.

Real W48 win integrations:
- `holly-look-08` Gamer Holly — granted on the first completed win in Holly's Memory Mayhem.
- `holly-look-13` Story Time Holly — granted when the Holly Memory Star is earned on Medium in 14 moves or fewer.
- `holly-look-25` Sparkle Tiara — granted by completing Hard in 18 moves or fewer.

A reward grant unlocks the exact same store item permanently. It does not create a duplicate reward-only avatar.

## Server persistence
Arcade profile fields now include:
- `johnLooks`
- `equippedJohnLook`
- `hollyLooks`
- `equippedHollyLook`

`POST /api/arcade/look` supports both `character: "john"` and `character: "holly"` with:
- `buy`
- `equip`
- controlled `grant`

Token charges and reward grants are server-side validated/persisted.

## Avatar picker behavior
- John exposes his 30 W47 complete looks.
- Holly exposes her 30 W48 complete looks.
- Owned looks can be equipped.
- Locked looks stay visible and open the correct character tab in Looks Shop.
- Other family/original avatars keep their previous style behavior until their own complete collection is explicitly approved.

## Visual integrity rule
For Holly W48:
- do not use the rejected dark-haired reinterpretations;
- do not substitute the separate stylized 3D turnaround as the playable avatar portrait;
- do not silently revert to `holly-cute.jpg` as the W48 complete-look source;
- do not change Holly's approved blue eyes;
- do not replace the approved W48 portraits with text-prompt recreations;
- do not claim a look is available unless the exact runtime portrait exists.

## Compatibility
Preserve all compatible W47/W46/W30 gameplay, multiplayer, cabin, Prop Hunt, tabletop, arcade, save IDs and John look ownership.

W48 is a focused Holly Looks Shop extension, not permission for unrelated rewrites.

## Verification gate
W48 technical candidate passes only when:
1. all 30 Holly runtime portraits exist;
2. all 30 Holly catalog records are unique;
3. approved Holly source and approved 30-look board are packaged;
4. unified Looks Shop exposes both John and Holly;
5. Holly looks can be purchased with server-validated tokens;
6. Holly reward looks can be granted by the real Holly Memory Mayhem conditions;
7. Holly owned looks can be equipped and locked looks cannot;
8. avatar picker uses complete Holly portraits and routes locked looks to the store;
9. service worker caches the W48 shop/catalog/assets;
10. the full regression suite passes;
11. staging validator has zero failures;
12. exact final ZIP passes cold extraction and retesting.

Real-device visual approval remains separate from technical packaging approval.


---

# PRESERVED W47 CURRENT PRODUCTION MASTER

# MASTER GAME BUILD PROMPT — W47 CURRENT PRODUCTION MASTER

## HIGHEST-PRECEDENCE W47 DIRECTIVE

# MASTER PHASE W47 — JOHN 30 LOOKS SHOP DIRECTIVE

## Status
Highest-precedence directive for John avatar appearance selection and user-facing avatar shopping. This directive supersedes earlier John 16-look/Birthday Boy lookbook behavior and the user-facing loose clothing/accessory approach for John.

## Locked product decision
John is the first character to use **complete purchasable avatar looks** rather than requiring every loose clothing/accessory item to fit every avatar.

A John look is one finished portrait/avatar presentation. The shop image and equipped portrait use the same packaged look asset. John does **not** stack the legacy loose wearable overlays on top of these complete looks in the normal game profile renderer.

The user-facing avatar destination is **Looks Shop**. Cabin furniture remains a separate destination. The older production/concept wearable catalog is preserved for compatibility and production reference, but it is not the primary way a player dresses John.

## Approved John collection — 30 looks
These three approved batches are the W47 visual contract:

1. Everyday Check
2. Workshop John
3. Birthday Legend
4. Cabin Hoodie
5. Lake Toque
6. Flannel Classic
7. Denim Rider
8. Cowboy John
9. Prop Hunt Hunter
10. Game Night Fuel
11. Formal Suit
12. Poker Night
13. Black Gammon Pro
14. Explorer John
15. Construction John
16. Firefighter John
17. Holiday Plaid
18. Winter Parka
19. Summer Beach
20. Fishing Trip
21. Trail Trouble Champ
22. Mexican Train Conductor
23. Cabin Sherpa
24. Vintage Leather
25. Varsity Cap
26. Family Photo John
27. Lumberjack John
28. Celebration Crown
29. Mountain Trek
30. Sunday Casual

The source approval boards are packaged at:
- `visual_proofs/john_30_looks/JOHN_LOOKS_COLLECTION_J1.png`
- `visual_proofs/john_30_looks/JOHN_LOOKS_COLLECTION_J2.png`
- `visual_proofs/john_30_looks/JOHN_LOOKS_COLLECTION_J3.png`

The exact runtime portrait proof generated from the packaged images is:
- `visual_proofs/john_30_looks/JOHN_30_RUNTIME_LOOKS_PROOF.jpg`

## Runtime asset contract
- IDs are stable: `john-look-01` through `john-look-30`.
- Runtime portraits are `public/avatars/styles/john-look-XX.jpg`.
- `public/john-looks-catalog.mjs` is the authoritative W47 catalog for name, price, batch, tag and description.
- `public/john-looks-shop.html` is the primary John shopping UI.
- Everyday Check is the starter/free look.
- Purchased looks are permanent unlocks.
- The currently equipped look is written back to the normal player profile as John's `variant` index so rooms, lobby portraits, cabin/profile surfaces and other compatible screens use it.
- A player's currently selected pre-W47 John look is grandfathered on first Looks Shop migration rather than silently discarded.

## Economy and persistence
John look ownership is stored in the arcade/progression profile under `johnLooks` and the active look under `equippedJohnLook`.

The Worker exposes:
- `GET /api/arcade/profile`
- `POST /api/arcade/look` with `buy`, `equip`, and controlled `grant` actions.

Token purchases are validated server-side. The client must not grant itself paid looks by changing local storage.

## Avatar picker behavior
- John shows all 30 approved looks.
- Owned looks can be selected.
- Locked looks remain visible but route the player to the Looks Shop.
- Other family/original avatars keep their existing compatible style behavior until their own complete-look collections are approved.
- Future rollout is character-by-character, not one universal clothing-fit matrix.

## User-facing navigation
Primary navigation should expose:
- Lodge
- Avatars
- Looks Shop
- Cabin Furniture
- Requests / How to Play / other existing destinations

Do not relabel Looks Shop back to a generic accessories/clothing store.

## John visual integrity rule
For W47 complete John looks:
- do not add legacy hat/shirt/earring overlays on top of the approved full-look portrait in the normal game renderer;
- do not recolor the face, skin, hair or approved outfit artwork;
- do not substitute old 16-look imagery;
- do not use a thumbnail that differs from the equipped portrait asset;
- do not claim a look is available unless its packaged runtime image exists.

## Compatibility rule
Preserve:
- existing multiplayer/profile variant transport;
- game rules and scoring;
- Prop Hunt/cabin work from later phases;
- existing cosmetic/cabin catalog IDs for save compatibility;
- prior production and approval files as history.

W47 changes John avatar merchandising/presentation. It does not authorize unrelated gameplay rewrites.

## Verification gate
A W47 package passes the technical gate only when:
1. all 30 John portrait files exist;
2. all 30 catalog records exist and IDs are unique;
3. Looks Shop can buy and equip through server-side token validation;
4. locked John looks cannot be equipped through the normal picker without ownership;
5. John normal portrait rendering does not layer the old loose cosmetics over the complete look;
6. service worker contains the Looks Shop, catalog and all 30 portraits;
7. full automated regression suite passes;
8. exact ZIP can be extracted and the same test suite passes from the cold copy.

Actual phone/browser visual approval remains a separate device gate.

---

# PRESERVED W46 CURRENT PRODUCTION MASTER

# MASTER GAME BUILD PROMPT — W46 CURRENT PRODUCTION MASTER

## HIGHEST-PRECEDENCE W46 DIRECTIVE

# W46 — APPROVED HEADWEAR ART DIRECTIVE

## Status
Highest-precedence production directive for the first approved portrait-headwear art batch until explicitly superseded.

## Approved visual source of truth
The user-approved `Headwear 3D Approval Board 01` controls the intended visual identity for these 12 items:

1. Camp Cap
2. Cowboy Hat
3. Cabin Knit Toque
4. Firefighter Helmet
5. Birthday Crown
6. Family Tiara
7. Legendary Top Hat
8. Trail Trouble Champion Cap
9. Prop Hunt Hunter Hat
10. Mexican Train Conductor Cap
11. Wide-Brim Sun Hat
12. Canvas Bucket Hat

For these items, old flat/generic SVG art is not the preferred portrait asset when a W46 approved-art portrait render is available.

## Portrait implementation contract
These 12 items use dedicated transparent W46 portrait-render assets in the shop/card portrait path.

The portrait asset path is distinct from full 3D gameplay wearables. W46 portrait PNGs must not be described as rigged GLB/gameplay meshes. They are detailed portrait-compatible render assets derived from the approved visual direction.

## Fit contract
W45 semantic head fitting remains authoritative for:
- exact portrait variant lookup;
- head width / temple span;
- crown or hairline seat;
- portrait roll;
- per-avatar correction;
- category-specific width.

W46 adds art-specific natural-aspect shaping required by the approved portrait asset. Do not shrink the W45 visual width merely to make a tall asset fit. W46 may use item-level width/roll refinement when the approved product-render perspective requires it.

Headwear rotation must use the semantic wear-seat as the transform origin. Do not rotate approved hats around the center of the PNG, because that causes brims to swing into the eyes on tilted portraits.

## Natural-aspect shaping
Each approved W46 asset may define:
- `assetAspect`;
- `targetDepthScale`;
- `seatNudge`.

The renderer should preserve the approved visual width while deriving portrait height from crown-to-seat depth. This prevents square-canvas padding or transparent margins from stretching a hat over the face.

## Item identity corrections
`Prop Hunt Hunter Hat` is an olive cap in the approved board. It must use the cap geometry/fitting family, not the generic cowboy/hunter-hat family.

## Non-regression
A later build may not silently return these 12 items to:
- generic SVG art;
- toy-sized W44 sizing;
- one-size-fits-all head boxes;
- stale service-worker assets.

If a W46 asset fails to load, fallback may preserve the prior asset rather than leave the portrait empty, but fallback status must remain diagnosable.

## Cache/version contract
W46 uses its own candidate cache/version (`W46-APPROVED-HEADWEAR-ART-64`) so older W44/W45 portrait art cannot silently reappear due to stale caching.

## QA gate
Automated tests establish code integrity only. Final visual approval still requires:
1. staging load of W46;
2. shop portrait inspection;
3. same-avatar card-game portrait inspection;
4. representative mobile/device proof;
5. user visual approval.

## Proof honesty
A code-driven composite using the exact app portraits + W46 asset files + production fit math is valid implementation evidence, but it is not a deployed phone screenshot. Label it accordingly.


---

## PRESERVED W45 PRODUCTION MASTER

# MASTER GAME BUILD PROMPT - W45 CURRENT PRODUCTION MASTER

## HIGHEST-PRECEDENCE W45 DIRECTIVE

# W45 - PORTRAIT HEADWEAR VISUAL SCALE RECOVERY DIRECTIVE

## Status
Highest-precedence directive for portrait headwear scale, seat, and fit until explicitly superseded.

## Goal
Portrait headwear must look naturally worn, not miniaturized to stay inside conservative collision-style bounds.

This applies to shop portraits, card-game portraits, profile portraits, and any other portrait surface using the shared cosmetic renderer. It does not replace the separate full-3D gameplay wearable system.

## Core rule
Fit headwear from exact portrait landmarks and visual wearing proportions.

Do not solve clipping or uncertain hair volume by shrinking the accessory until it becomes toy-sized.

Correction order:
1. correct semantic anchor;
2. correct seat height;
3. correct roll;
4. allow hair-volume clearance;
5. adjust category scale;
6. only then reduce size slightly if absolutely necessary.

## Required portrait landmarks
Use the exact portrait variant currently displayed and its:
- head top;
- left/right head edges;
- left/right temples;
- pupil/eye line;
- nose bridge;
- derived hairline;
- derived crown center;
- portrait roll.

Per-person correction profiles may adjust scale and seat modestly after the semantic geometry is solved.

## W45 category fit families
- Caps/newsboy/trucker/conductor: fuller crown, brim above eyebrows, visual width near full head width.
- Cowboy/western: crown seated on skull, brim visibly wider than skull.
- Helmets: outer shell visibly larger than skull with eye/ear clearance.
- Toques/beanies: wrap crown and retain top volume.
- Crowns/flower crowns: readable ornamental width, seated near hairline rather than shrunk into the forehead.
- Tiaras: forward ornamental seat, readable width, no miniaturization.
- Top hats: narrow brim plus tall crown, centered over skull.
- Bucket hats: full crown and readable surrounding brim.
- Wide-brim/sun hats: clearly exceed skull width.
- Berets: slightly wider than crown with controlled asymmetric volume.
- Bandana/headwrap: follow hairline/crown, not generic center-box placement.
- Headbands: use forehead/hairline seat.
- Earmuffs: use ear-to-ear plus crown geometry.
- Hat pins/clips: remain small accessory classes and must not inherit full-hat scale.

## W45 current benchmark visual ratios
Production-fit values are intentionally larger than W44 safe-box values. Current benchmark families use approximately:
- cowboy: 1.27 x semantic head width, with temple-width safeguard;
- helmet: 1.17 x;
- cap: 1.08 x;
- toque/beanie: 1.08 x;
- wide brim: 1.32 x;
- bucket: 1.12 x;
- crown: 0.82 x;
- tiara: 0.78 x;
- top hat: 0.99 x.

These are starting production ratios, not immutable constants. Actual visual proof may tune them.

## Rollout scope
W45 routes the normal human headwear catalog through semantic visual sizing.

Specialty semantic items keep their dedicated solvers:
- earmuff/ear-specific flagship item;
- bun/ribbon accessory;
- forehead-specific headband.

Dog headwear stays blocked from the human solver until dog-specific skull/ear profiles are proven.

## Approval gate
A headwear item fails if it:
- looks miniature;
- has a visibly pinched crown;
- has an undersized brim;
- floats above the head;
- cuts through eyes;
- is seated on the wrong facial plane;
- only looks correct because it was excessively shrunk.

A headwear fit passes only when the actual app portrait makes it read as naturally worn.

## Art honesty
Correct fit does not make concept SVG art production-approved.

Production-art status and fit status are separate gates.

The W45 anchor system may be rolled across concept items to prove scale/seat behavior, but those items remain blocked from visual/live approval until their actual art passes the production-art gate.

## Non-regression
Future builds may not restore W44-style conservative shrinking or generic percentage-box headwear placement.

Shop and card-game portraits must continue sharing the same exact portrait source, landmark profile, accessory asset, and fit solver.


---

## PRESERVED PRIOR PRODUCTION MASTER

# MASTER GAME BUILD PROMPT — W44 CURRENT PRODUCTION MASTER

## HIGHEST-PRECEDENCE W44 DIRECTIVE

# W44 — PORTRAIT EARRING + HEADWEAR ANCHOR DIRECTIVE

## Status
Highest-precedence production directive for portrait-based earrings and headwear until explicitly superseded.

## Objective
Make earrings and headwear fit correctly on the exact shop/card-game avatar portrait being displayed.

This directive applies to:
- avatar shop previews;
- card-game player portraits;
- profile/avatar portraits;
- any portrait-based cosmetic preview that reuses the same avatar images.

This directive does NOT replace the separate full-3D gameplay wearable system.

---

# 1. CORE NON-NEGOTIABLE RULE

Accessories must fit the exact portrait image being rendered.

Never use one generic fit per person when multiple portrait variants exist.

Required lookup hierarchy:

`character -> exact portrait asset/variant -> semantic landmarks -> accessory-category solver`

Examples:
- `john-look-07`
- `kristen-cute`
- `kristen-glam`
- `logan-rugged`
- `holly-goofy`

If the exact portrait has no approved landmark profile, the accessory must remain hidden or QA-only. Do not silently fall back to arbitrary legacy CSS offsets.

---

# 2. ONE AUTHORITATIVE PORTRAIT ACCESSORY TRANSFORM

There must be one authoritative portrait cosmetic solver.

Legacy CSS rules such as fixed:
- left/top percentages;
- width percentages;
- generic rotation;
- category-wide hard-coded offsets

must not override semantic-anchor output.

Shop, card games, family arcade portraits, and avatar previews must call the same portrait accessory fitting module.

---

# 3. LANDMARK DATA MODEL

Every supported portrait variant should be able to store:

## Face / eye landmarks
- leftPupil
- rightPupil
- noseBridge
- leftTemple
- rightTemple

## Ear landmarks
- leftEarTop
- leftEarCenter
- leftEarLobe
- rightEarTop
- rightEarCenter
- rightEarLobe
- leftEarVisible
- rightEarVisible
- leftEarOcclusion
- rightEarOcclusion

## Head landmarks
- headTop
- foreheadCenter
- hairlineCenter
- leftHeadEdge
- rightHeadEdge
- leftCrownEdge
- rightCrownEdge
- leftTemple
- rightTemple

## Orientation metadata
- faceRoll
- faceYawEstimate
- facePitchEstimate
- perspectiveSkew
- portraitCropScale

## Hair / baked-art metadata
- hairVolumeTop
- hairVolumeLeft
- hairVolumeRight
- hairOcclusionMask if available
- bakedHat
- bakedGlasses
- bakedEarrings
- bakedHeadAccessory

All coordinates should be normalized to the portrait image so resizing the UI does not invalidate calibration.

---

# 4. EARRING ANCHOR SYSTEM

## 4.1 Primary attachment point
Earrings must attach to the relevant `EarLobe` point, not a generic side-of-head coordinate.

Each earring render must define its own local pivot corresponding to the piercing / hook point.

The accessory solver aligns that local pivot to the portrait's lobe anchor.

## 4.2 Visibility
If an ear is not visible:
- do not draw that side's earring;
- do not mirror an earring into hair;
- do not place it based on the opposite ear.

If only one ear is visible, a one-sided visible result is correct.

## 4.3 Earring classes
Different classes need different fit logic.

### Stud
- small footprint around lobe;
- minimal vertical drop;
- scale primarily from ear size/head scale.

### Hoop
- pivot at lobe;
- ring drops below lobe;
- diameter scales from ear/head size;
- must not float beside cheek.

### Drop / dangle
- pivot at lobe;
- vertical length scales from head size;
- may require a slight gravity/downward angle;
- must clear shoulder/cheek where possible.

### Statement earring
- pivot at lobe;
- may need per-portrait maximum size;
- must not dominate the face or visibly detach from the ear.

## 4.4 Perspective
For strong three-quarter/profile faces:
- near-side earring may render at 100% scale;
- far-side earring may be reduced, partially occluded, or hidden;
- optional horizontal squash may be used for perspective;
- far-side layering must respect face/hair occlusion.

## 4.5 Hair occlusion
Where hair covers the upper earring or hook:
- render the earring behind a hair occlusion mask if available;
- otherwise hide the portion/side that cannot be represented cleanly;
- never place the full earring on top of dense hair merely to make it visible.

---

# 5. HEADWEAR ANCHOR SYSTEM

## 5.1 Headwear seat line
Headwear must not position from the image's top-left corner.

Each portrait needs a real head seat region derived from:
- headTop;
- left/right head edge;
- forehead/hairline;
- crown edges;
- face/head roll.

## 5.2 Category-specific fitting

### Baseball / camp / conductor caps
Use:
- forehead/hairline seat;
- left/right head width;
- head roll.

Rules:
- brim must sit above eyebrows;
- crown wraps upper head;
- no floating cap;
- no brim through eyes;
- rear crown should respect hair volume.

### Toques / beanies
Use:
- headTop;
- head width;
- hair volume;
- forehead seat.

Rules:
- wrap the crown;
- lower edge should sit near upper forehead/hairline;
- adapt height for buns/high hair;
- do not become an oversized egg.

### Cowboy / wide-brim hats
Use:
- crown seat;
- head width;
- forehead center;
- roll/perspective.

Rules:
- actual cowboy crown silhouette;
- brim width visibly exceeds skull width;
- brim angle follows face/head roll;
- crown must not read as a top hat;
- hair/ears may be partially occluded by brim.

### Top hats
Use:
- crown seat;
- head width;
- head roll.

Rules:
- narrow brim;
- tall crown;
- remain centered over skull, not face box.

### Crowns / tiaras
Use:
- hairline/forehead;
- crown edges;
- head roll.

Rules:
- sit forward at hairline/crown transition;
- smaller than helmets/hats;
- should not float high above hair.

### Helmets
Use:
- headTop;
- head width;
- ear line;
- forehead.

Rules:
- provide full-head coverage;
- leave eyes/face readable;
- ear clearance matters;
- scale must be larger than ordinary caps but must still follow head shape.

### Earmuffs / headsets
Use:
- left/right ear centers;
- headTop;
- head width.

Rules:
- pads must land on the actual ears;
- headband arcs over the crown;
- pad spacing is derived from ear-to-ear geometry;
- use portrait-specific vertical correction.

---

# 6. PIVOT + BOUNDS CONTRACT FOR ACCESSORY ART

Every production portrait accessory render must have:

- transparent background;
- documented local anchor pivot;
- tight visible-content bounds;
- no large transparent padding used for fit calculations;
- stable orientation;
- known category;
- source 3D asset / approved art provenance.

Do not scale from the entire PNG canvas if the canvas contains transparent margins.

Fit math must use measured visible bounds or per-asset fit metadata.

---

# 7. BAKED-IN COSMETIC PROTECTION

If the selected portrait already has:
- glasses;
- earrings;
- hat/headwear;
- other conflicting accessory

baked into its base artwork, do not stack another incompatible accessory.

The portrait must be flagged:
`cleanPortraitRequired: true`

Until a clean portrait is available, that category should display:
- unavailable;
- needs clean base;
- or QA-only.

Never hide double-accessory defects by shrinking the new accessory.

---

# 8. DOG-SPECIFIC RULES

Dogs need separate semantic profiles.

## Dog headwear
Use:
- headTop;
- left/right skull edge;
- left/right ear base;
- muzzle-safe face region.

Headwear must avoid:
- ear clipping;
- floating above fur;
- hats covering eyes/muzzle.

## Dog ear accessories
Human earrings should not automatically be applied to dogs.

Only dog-specific ear/bow accessories may use dog ear anchors unless the item is intentionally designed for dogs.

## Dog eyewear/headsets
Use dog-specific eye/ear landmarks, not human ratios.

---

# 9. SHOP + CARD-GAME CONSISTENCY

The shop preview and the card-game avatar must share:
- the same portrait source;
- the same landmark profile;
- the same accessory asset;
- the same fit solver;
- the same visibility/occlusion rules.

A cosmetic that looks correct in the shop but wrong beside cards is a FAIL.

---

# 10. QA APPROVAL BOARDS

## Earring approval boards
For each production earring style:
- show exact supported portrait variants;
- show left/right lobe anchor markers;
- show accessory pivot;
- show visible-ear state;
- show final composite without markers.

Minimum representative styles:
1. stud;
2. medium hoop;
3. pearl/drop;
4. gem dangle;
5. heart/charm;
6. statement.

## Headwear approval boards
Minimum representative styles:
1. camp/baseball cap;
2. toque/beanie;
3. cowboy hat;
4. crown;
5. tiara;
6. firefighter helmet;
7. top hat;
8. conductor cap;
9. earmuffs/headset if applicable.

For each proof:
- exact portrait source;
- head landmarks;
- fitted accessory;
- clean final composite.

No concept-only board counts as runtime approval.

---

# 11. QA STATUS RULES

### GREEN
- correct semantic anchor;
- believable scale;
- no meaningful float/sink;
- correct head/ear roll;
- appropriate occlusion;
- works in shop and card portrait;
- real production asset/render.

### AMBER
- technically anchored and usable;
- needs minor scale/rotation/occlusion tuning;
- not live approved.

### RED
- detached/floating;
- clips face/eyes/ears badly;
- wrong category silhouette;
- wrong portrait calibration;
- generic fallback pretending to be production;
- double accessory due to baked art;
- uses legacy generic CSS placement.

---

# 12. RELEASE GATE

An accessory cannot become live merely because:
- its file exists;
- tests pass;
- it renders somewhere;
- an isolated product image looks good.

For portrait cosmetics, release requires:
1. exact portrait calibration;
2. semantic-anchor fit;
3. shop proof;
4. card-game proof;
5. mobile/device proof;
6. user visual approval.

---

# 13. NON-REGRESSION RULE

Future builds may not replace semantic anchors with generic percentage offsets.

Every later build must preserve:
- portrait-specific landmarks;
- variant-specific lookup;
- one authoritative transform;
- baked-art protection;
- exact shop/card consistency.

If a new system cannot resolve a valid anchor, it must fail closed rather than display a visibly wrong accessory.

---

# 14. IMPLEMENTATION ORDER

1. Lock current W43 glasses anchor system.
2. Add complete ear/head landmarks to clean portrait variants.
3. Implement earring solver.
4. Produce earring internal QA board.
5. User approves earring fits.
6. Implement headwear category solvers.
7. Produce headwear internal QA boards.
8. User approves headwear fits.
9. Verify same assets in shop and card-game portraits.
10. Device QA.
11. Only then promote approved assets.

---

# 15. NEXT CATALOG EXPANSION

After W44 is proven:
- headphones/headsets;
- earmuffs;
- hair accessories;
- face accessories;
- necklaces/neckwear;
- badges;
- remaining portrait wearables

must use the same semantic-landmark architecture instead of one-off manual placement.


---

## PRESERVED PRIOR PRODUCTION MASTER

# MASTER GAME BUILD PROMPT — W42 CURRENT PRODUCTION MASTER

# MASTER PHASE W42 — SHOP/CARD PORTRAIT ACCESSORY ANCHOR DIRECTIVE

Status: highest-precedence accessory fitting directive until superseded.

## User-approved visual contract
The shop and card-game cosmetic system must fit accessories to the portrait/avatar artwork actually shown beside the player and in the shop. A full-body 3D gameplay character is not a valid approval surface for these portrait cosmetics.

The user approved the W42A.3 anchored-glasses target. The system must use anatomical/semantic portrait points rather than one generic x/y/width box.

## Required portrait landmark contract
Every family portrait profile must support, at minimum:
- left pupil and right pupil;
- nose bridge;
- left/right temples;
- left/right ear anchors;
- head top and left/right head sides;
- optional yaw/perspective metadata;
- baked-accessory conflict flags;
- portrait variant overrides.

Glasses derive center, scale and rotation from pupil/bridge geometry. Hats/headwear use head points. Earrings use ear/earlobe points once calibrated. Headsets use ear + head points. A generic global box may only be a temporary fallback for an uncalibrated non-family portrait and is never visual approval.

## Portrait variants
The selected avatar portrait variant is part of the fitting key. If an exact variant override is absent, inherit that person's calibrated base anchors, not a global one-size-fits-all profile. Add exact per-variant landmarks during QA whenever a style changes crop, face pose or silhouette materially.

## Baked-art conflicts
If a portrait already contains baked-in glasses, hats, or another conflicting accessory, do not stack a second accessory and call it approved. Record the conflict and require a clean base portrait or an explicitly approved adapted presentation.

## Art pipeline
For approved portrait accessories, keep a real 3D master asset when available. Render that master into a transparent portrait overlay for shop/card use. The shop/card renderer uses the transparent production-derived overlay; fully 3D games use a separate 3D wearable path and separate QA gate.

## Evidence hierarchy
1. approved visual target;
2. exact code-driven composition using real app portraits and actual production-derived overlay assets;
3. actual browser/shop/card runtime screenshot;
4. real device screenshot.

AI-generated approval art is a target, never proof that runtime implementation works.

## Release rule
Do not promote the entire accessory catalog. Only items specifically converted and verified through this anchor path may use production-derived portrait overlays. Keep live-release/device approval separate from implementation status.


---

# PRESERVED W40 MASTER BELOW

# BLACK FAMILY GAME NIGHT - MASTER PHASE W40
## External Asset Pipeline, Runtime Truth, and Professional 3D Proof

Build candidate: `GAME-NIGHT-STAGING-CANDIDATE-W40-EXTERNAL-ASSET-PIPELINE-59`
Official current release remains W30 until real-device visual approval.

## 1. Why W40 exists
The user-provided actual Prop Hunt screenshot proves that repeated internal code passes have not produced the required visual result. The scene still reads as steep/top-down, procedural, sparsely textured and weakly lit. W40 changes the production method rather than adding another cosmetic patch.

The game engine remains Three.js. Gameplay systems, collision, networking, Prop Hunt rules and proven movement work are preserved. Final visual content is moved to an authored-asset workflow.

## 2. Flagship vertical slice
Prove one real mechanic-bay scene before expanding again:
- approved John;
- main Papa's Shop mechanic bay;
- bright garage opening;
- tractor;
- workbench;
- rolling tool chest;
- shelving;
- tires;
- welder/compressor;
- roughly ten readable hider props.

The slice must work with the actual game camera and gameplay. It is not a poster, concept board or isolated beauty render.

## 3. Asset states
Every visible hero asset has four separate states:
- `fallback`: proven existing visual remains visible;
- `candidate`: external authored file exists and is being audited;
- `qaReady`: file passes technical import checks and may be tested in runtime;
- `approved`: separate visual/device approval has been recorded.

Never equate `candidate` or `qaReady` with `approved`.

## 4. John contract
Expected filename: `public/models/w40/incoming/CHAR_JOHN_W40.glb`.

Requirements:
- approved recognizable John likeness and proportions;
- approximately 1.82 m game height unless art review changes it;
- clean humanoid hierarchy and skin weights;
- production hands/shoulders/neck/head;
- plaid shirt, jeans, boots, hair and beard/stubble as actual authored surfaces;
- weapon hand/socket support;
- recommended LOD0 20k-65k triangles, LOD1 <=30k;
- core clips or retargetable equivalents for Idle, Walk, Run, Sprint, Start/Stop, Turn, Jump/Fall/Land, Mantle, Aim and Fire.

The legacy John GLB remains a QA animation proxy only while `approvedModel:false`. W40 may not silently override that gate.

## 5. Papa's Shop hero-bay contract
Expected filename: `public/models/w40/incoming/ENV_PAPA_SHOP_HERO_BAY_W40.glb`.

Requirements:
- coherent authored coordinate system and meter scale;
- origin and floor at y=0;
- readable garage walls/openings/doorway/ceiling structure;
- UV-mapped materials;
- baseColor + normal + roughness minimum on hero surfaces;
- metallic/AO where physically appropriate;
- no baked gameplay colliders required in the visible model;
- no invisible giant meshes or bad bounds;
- static geometry suitable for simplified collision extraction/proxies.

## 6. Hero prop-set contract
Expected filename: `public/models/w40/incoming/SET_PAPA_SHOP_HERO_PROPS_W40.glb`.

It must share the hero-bay coordinate contract or use clearly documented independent pivots. Required hero identities include tractor, workbench, tool chest, shelving, tires, welder, compressor, gas can, bucket and toolbox. A different object may not masquerade as one of those names merely to satisfy a manifest check.

## 7. Professional camera
W40 Prop Hunt candidate camera target:
- distance ~3.72 m;
- aim distance ~2.88 m;
- camera target height ~1.34 m;
- shoulder ~0.46 m;
- normal FOV ~56 degrees;
- aim FOV ~49 degrees;
- initial/recovery pitch near level rather than steep top-down.

Existing obstruction collision, pinch/zoom/look controls and recovery behavior remain mandatory.

## 8. Lighting and color
- sRGB output;
- ACES filmic tone mapping;
- soft shadows within mobile budget;
- HDR/image-based environment lighting when available;
- cool/neutral exterior daylight plus warm shop practicals;
- contact shadows under John, machinery and furniture;
- exposure chosen to preserve material detail.

W40 may use the Poly Haven Small Workshop HDRI as a CC0 lighting benchmark when network access permits. Failure to load it must degrade safely without taking down gameplay.

## 9. Runtime truth overlay
The QA overlay is mandatory for W40 proof and must expose:
- exact candidate build;
- WebGL status and DPR;
- character source and approval state;
- authored environment/prop-set status;
- W40 incoming candidate state;
- camera distance/pitch/FOV/target height;
- visible mesh and triangle counts;
- material and PBR map counts;
- production/legacy/collision-only counts;
- warnings for unapproved character, missing authored environment, very low texture coverage or camera problems.

Cabin QA receives an equivalent W40 truth panel showing true-3D versus static fallback and production-GLB versus design/legacy furniture counts.

## 10. Clean external proof bench
`/w40-production-proof.html` is an isolated real-WebGL import bench. It must be able to load project fallbacks and local user-selected GLBs for John, shop and hero props, report geometry/material/rig/animation statistics, and provide a shoulder-level camera and basic animation playback. This page is technical/visual QA only and does not mark assets approved.

## 11. Optimization
Every candidate passes a glTF audit before game integration. Remove unused nodes/materials/textures, deduplicate where safe, compress meshes/textures only after visual comparison, keep mobile texture sizes sensible, and create LODs/decimation for heavy models. Never optimize by deleting the visual identity that made an item pass approval.

## 12. Cabin/furniture relation
W39 true-3D cabin remains active. W40 adds runtime truth so a static SVG fallback cannot be mistaken for the 3D room. The same external pipeline should later produce real furniture GLBs, but Prop Hunt's flagship slice remains the first W40 visual proof.

## 13. QA sequence
1. Open `/w40-production-proof.html` and inspect external GLBs before integration.
2. Run the GLB audit tool.
3. Put accepted candidate filenames in `public/models/w40/incoming/`.
4. Keep manifest `qaReady:false` until technical review passes.
5. Set `qaReady:true` only for a candidate ready for runtime comparison.
6. Open Prop Hunt with `w40Truth=1` and capture actual screenshots/video.
7. Compare against the user-provided W40 failure baseline and approved visual target.
8. Mark visual/device approval separately.

## 14. Shipping gates
A W40 visual advancement requires all of:
- automated regression green;
- staging validator green except known infrastructure warnings;
- production asset audit green;
- exact ZIP cold extraction/test green;
- actual running phone/browser visual proof;
- user approval of the visible result.

Until then, W40 remains a staging candidate and W30 remains official current release.
# BLACK FAMILY GAME NIGHT — MASTER GAME BUILD PROMPT W39

> W39 TRUE-3D CABIN FURNITURE REALISM is the highest-precedence cabin/furniture directive. Preserve all compatible W36 Prop Hunt leapfrog work and prior locked game/family/catalog rules.

# MASTER PROMPT INSERT — W39 REALISTIC CABIN FURNITURE

This directive has highest precedence for cabin rooms, furniture rendering, furniture QA, room placement and Home-item production until superseded by a later explicit user-approved directive.

## Non-negotiable objective
The Cabin must stop reading as a flat decorator. The normal player-facing room must be a true 3D, mobile-safe, stylized-realistic cabin room with believable depth, furniture scale, materials, lighting, shadows, collision and interaction. The existing 2D/SVG room may remain only as an emergency WebGL fallback and catalog/concept-art source.

## Production rule
Do not call an item implemented because its ID, SVG, thumbnail or generic category mesh exists. Browse art, production model and placed in-room object must represent the same recognizable design. A sofa may not become a generic chair; a canopy bed may not become a generic bed; a wardrobe may not become a dresser; a desk may not become a generic table.

## W39 benchmark slice
Before mass-producing furniture, make one 14 × 16 ft bedroom excellent. It must use the real 3D cabin renderer and contain, at minimum:
- W25 Double Cabin Bed production GLB;
- W25 Kristen's Cozy Lodge Reading Chair production GLB;
- W25 Live-Edge Nightstand production GLB;
- W25 Warm Table Lamp production GLB;
- a dimensional dresser/storage piece;
- a dimensional rug;
- a dimensional wall-mounted TV or wall object;
- believable window/door architecture and cabin shell.

The room must show clear floor/wall depth, contact shadows, soft daylight, warm practical lighting, material variation, readable furniture silhouettes, and a close-enough camera that furniture quality can actually be judged.

## Rendering architecture
Separate:
1. persistent room data and gameplay state;
2. physical placement/collision proxies;
3. visible production models;
4. concept/legacy fallback art.

Visual priority for each furniture item:
1. Device-Approved production model;
2. Production/QA model;
3. W39 design-specific 3D fallback;
4. legacy generic 3D fallback;
5. SVG/2D fallback only when WebGL cannot run.

A failed new asset load must never make the room emptier. Preserve the previous visible fallback until the replacement is successfully loaded.

## Placement contract
Use one coordinate contract consistently. Persistent `x/z` values are room-placement anchors, not arbitrary model centers. Renderer and server must agree on footprint, rotation and surface. Floor items must remain inside room bounds after rotation. Wall items must be supported by their catalog surface metadata. Prevent obvious item-to-item overlap and wall penetration. Server validation is authoritative; client validation is convenience only.

Do not use the catalog's small grid-footprint numbers as literal real-world model dimensions. Maintain separate physical model dimensions/bounds for production assets. The 14 × 16 ft room is real scale.

## Furniture realism bar
- Stylized realism, not photorealism and not blocky placeholder art.
- Rounded/beveled-looking construction where furniture would naturally have softened edges.
- Wood must show grain/roughness variation; upholstery must read as fabric/leather; metal must read as metal; glass must read as glass; rugs must read as woven textiles.
- Furniture must have believable thickness, legs, backs, cushions, drawer fronts, hardware and construction details.
- No paper-thin furniture cards in the normal WebGL path.
- Shadows must ground furniture to the floor/wall.
- Room lighting must include cool/neutral window daylight and warm practical light without washing out material detail.

## Identity preservation
Runtime shape selection must use the actual intended furniture family inferred from approved identity/name when legacy W20 subcategory metadata is clearly wrong. Repair the catalog metadata where the intended type is unambiguous. Preserve IDs, ownership, price, collection and unlock rules.

## Interaction minimums
- seating: authored seat target and future sit-animation hook;
- beds: sleep/lie target and clearance region;
- tables/nightstands: valid tabletop surface target;
- storage: open/store interaction hook and door/drawer clearance;
- lighting: on/off state with emissive/real light behavior;
- wall electronics/decor: valid wall mounting and no floor-style placement unless explicitly supported.

## Mobile/performance
Do not solve performance by deleting visible furniture or returning to flat sprites. Use pixel-ratio limits, shadow budgets, model LOD/decimation where available, shared materials, instancing for repeated low-priority objects, culling and limited dynamic lights. The hero room must remain visually complete.

## QA gates
A furniture/cabin build does not advance unless all four gates pass:
1. **Technical:** assets load, IDs resolve, saves/migration work, no regressions.
2. **Spatial:** scale, rotation, floor/wall placement, collision and clearance are valid.
3. **Visual:** actual running WebGL screenshot is visibly dimensional and better than the flat W13/W19 baseline.
4. **Device:** real phone/tablet interaction and performance pass.

Automated tests are not visual approval. Concept renders are not runtime proof. AI-generated target images are not runtime proof. Only an actual running build screenshot/video can satisfy the visual/device gates.

## Non-regression rule
Every later furniture build must preserve the best previously proven room. A newer build may not remove furniture density, distinctive silhouettes, working placement, lighting, shadows or interactions unless the replacement is visibly and functionally better.

## Expansion rule
After the benchmark room passes, expand by furniture family, not random individual patches:
1. beds;
2. seating;
3. tables/desks;
4. storage;
5. lighting;
6. rugs/soft decor;
7. wall electronics/decor;
8. specialty/interactive furniture.

Do not claim the 2,000 Home catalog is production-complete until its visible runtime assets actually reach the required production and device gates.


---
# FULL W39 FURNITURE DIRECTIVE

# BLACK FAMILY GAME NIGHT
# MASTER PHASE W39 — TRUE-3D CABIN FURNITURE REALISM DIRECTIVE

Planning/build date: 2026-09-01
Status: HIGHEST-PRECEDENCE CABIN/FURNITURE PRODUCTION DIRECTIVE
Base candidate: W36 Leapfrog Hybrid
QA foundation: W38 Deep Furniture QA

## 0. Mission
Turn the Cabin from a catalog-driven decorator with legacy flat/generic presentation into a professional, believable, stylized-realistic 3D decorating space while preserving all existing ownership, blueprint, family-room and social rules.

The first deliverable is not 2,000 models. The first deliverable is one room that convincingly proves the production pipeline.

## 1. Problems W39 must correct
### 1.1 Flat presentation legacy
Historical Cabin screenshots show furniture as top-down/2D tokens. That is unacceptable as the normal path. The WebGL room renderer must be the primary player-facing surface.

### 1.2 Generic silhouette collapse
The W20 procedural bridge reduces many distinct catalog identities into a few generic families. This is a temporary bridge only. W39 must add design-specific/subtype-specific 3D fallback families and must never treat a category-generic silhouette as final art.

### 1.3 Catalog subtype corruption
W38 found large-scale mismatches between names and stored subcategories in generated core furniture. Where the intended furniture type is objectively clear from the item name, repair the subtype metadata without changing item ID, ownership, price, collection, source or unlock rules.

### 1.4 Placement coordinate mismatch
The existing 2D placement core treats x/z as a footprint anchor, while the 3D renderer historically treated x/z like object centers. W39 must establish one persisted anchor convention and convert to visual centers using the rotated footprint/physical bounds.

### 1.5 Grid footprint versus real dimensions
Catalog `Footprint W/D` values are editor metadata and are not trustworthy literal physical feet for production models. Production assets need separate actual dimensions/bounds. Use real 14 × 16 ft room scale.

### 1.6 Weak server spatial authority
Room saves must not rely on client-only placement checks. The server must revalidate item existence, ownership, surface compatibility, room bounds, rotation and overlap/clearance. A server rejection must not silently fall back to an unauthorized local save.

### 1.7 Mobile asset cost
W25 hero furniture is visually richer but heavy. W39 must record triangle/bounds data and maintain a mobile optimization plan. Do not downgrade hero visuals to flat sprites merely to improve frame rate.

## 2. Benchmark room contract
Create a W39 furniture benchmark mode/page that cannot mutate ownership or live saves. It must use the same renderer and same production assets as the real Cabin.

Room: 14 ft × 16 ft × approximately 9 ft high.

Required objects:
- W25-C04 Double Cabin Bed GLB;
- W25-C01 Cognac Lodge Reading Chair GLB;
- W25-C02 Live-Edge Nightstand GLB;
- W25-C03 Linen/Bronze Table Lamp GLB;
- W39 dimensional four-drawer dresser;
- W39 woven rug;
- W39 wall-mounted TV;
- optional W39 desk chair or wall art for density.

Composition:
- bed against a believable wall zone with walking clearance;
- nightstand adjacent to bed;
- table lamp positioned as a table lamp, not arbitrarily floating on the floor;
- reading chair in a lit reading corner;
- dresser with drawer-front depth and hardware;
- rug layered slightly above floor without z-fighting;
- TV mounted on a valid wall plane;
- window daylight and warm lamp/ceiling practical lighting.

## 3. 3D room shell
- True floor slab/plane with material scale appropriate to 14 × 16 ft.
- Three visible walls and open/cutaway camera side.
- True window opening/frame/glass, not a sticker.
- True door opening/slab/frame.
- Baseboards and selected trim.
- Optional simple ceiling beams where they improve cabin identity.
- Background beyond window should not be empty black; use a lightweight exterior/sky/tree suggestion when practical.

## 4. Camera
Default camera should make the room and furniture legible without looking like a map editor.
- Perspective camera.
- Three-quarter dollhouse/room view by default.
- Orbit with drag.
- Wheel/pinch-style zoom support where platform permits.
- Camera target near furniture center of mass.
- Clamp pitch/radius so users cannot lose the room.
- Double-click/reset control.
- Benchmark camera preset for regression screenshots.

## 5. Materials
Use a coherent cabin material library:
- pine/walnut/oak wood: base-color variation, grain, roughness, subtle normal/bump;
- leather: broad roughness and fine surface breakup;
- woven fabric: visible but not noisy weave;
- linen shade: soft roughness, warm translucency impression where practical;
- bronze/brass: controlled metalness and roughness;
- rug: fabric with pattern/border/fringe or equivalent geometry;
- TV glass/screen: dark reflective/emissive material;
- painted surfaces: controlled sheen, not plastic gloss.

No hero object may be uniformly flat-colored if its approved identity calls for a different material language.

## 6. Lighting
Minimum stack:
- hemisphere/environment fill;
- directional daylight motivated by window;
- soft practical ceiling or room light;
- window-area fill if needed;
- W25 lamp real point-light/emissive toggle.

Shadows:
- hero furniture casts and receives shadows;
- preserve readable contact with floor;
- mobile shadow map sizes must be bounded;
- if additional contact-shadow helpers are used, they must not visibly float.

Tone/color:
- sRGB output;
- ACES Filmic or equivalent tone mapping;
- warm cabin palette with daylight contrast;
- no crushed black corners that hide furniture.

## 7. Furniture identity system
Every furniture item resolves through this priority:
1. Device-approved GLB;
2. production/QA GLB;
3. W39 subtype/design-specific 3D procedural fallback;
4. older category-generic 3D bridge;
5. SVG/2D only on WebGL failure.

W39 subtype fallback must differentiate, at minimum:
### Beds
single/twin, double, bunk, storage bed, canopy/four-poster, daybed/trundle.
### Seating
reading/club chair, desk/dining chair, rocking chair, barrel chair, sofa, loveseat, bench, chaise, recliner.
### Tables/desks
nightstand/side table, coffee table, writing desk, farm/dining table, game table, vanity/secretary where obvious.
### Storage
dresser, wardrobe/armoire, bookcase/shelf, chest/toy chest, hutch/display.

This fallback is still not final production art. It exists to prevent the room from visually collapsing while bespoke GLBs are authored.

## 8. Physical scale and bounds
Production model bounds must be measured from the GLB and stored separately from catalog grid footprint.

Measured W25 source bounds should be recorded in the runtime manifest/report. Visual models may be scaled only through an explicit production calibration field, never by arbitrary per-frame guessing.

Persistence remains compatible with existing room coordinates, but the 3D renderer must convert the persisted anchor to a visual center using the rotated footprint/bounds contract.

## 9. Placement validation
Client and server share equivalent rules.

For floor items:
- supported floor surface;
- normalized 0/90/180/270 rotation;
- physical/placement footprint inside room;
- no obvious overlap with other solid furniture;
- optional clearance zone for drawers, doors, sit/sleep targets.

For wall items:
- catalog supports Wall;
- wall anchor stays within valid wall region;
- item does not cross window/door exclusion regions when wall geometry is known;
- floor-only items cannot be saved as wall items.

Placement overlap may use simple oriented/AABB footprints in the first W39 slice. It does not need a full physics engine, but it must stop impossible obvious placements.

## 10. Security/data integrity
- Server remains authoritative for owner-only room edits.
- Server rejects unowned non-grandfathered blueprints.
- Server rejects unsupported surfaces and out-of-bounds placements.
- Server rejects impossible overlap where validation applies.
- A 4xx API rejection must be shown to the user; it must not be converted into a silent local success.
- Offline/local fallback may be used only for true network unavailability and must be clearly marked local/offline if surfaced to the player.

## 11. Interactions
### Chair
Provide a stable seat target. Full avatar sit animation may remain blocked until approved character rigs are production-ready, but the target and API hook must exist.

### Bed
Provide sleep/lie target and a clear access side/clearance zone. Full lie animation may be future work.

### Nightstand/table
Expose tabletop surface bounds for small decor snapping.

### Lamp
Toggle real light and emissive state, and persist lamp state when room save schema supports it.

### Dresser/storage
Expose open/store interaction contract and front clearance direction. Drawer animation can be later, but collision must not assume the dresser has no front clearance.

### TV
Support wall mount and future on/off/content hook. Screen should have material identity distinct from casing.

## 12. Performance budget
Initial benchmark budget is a gate, not a final universal number.
- pixel ratio capped around 2 or lower on constrained devices;
- dynamic shadow casters limited to hero/near objects;
- repeated low-priority geometry shares materials/geometries where practical;
- record triangle counts for production GLBs;
- create LOD/decimated variants before widespread repeated placement of very heavy assets;
- avoid one dynamic point light per decorative lamp when many lights are visible; only nearby/active hero lights should be real-time.

No optimization may silently replace a validated production object with a flat sprite in the normal hero-room view.

## 13. QA matrix
### Technical
- module syntax;
- full game regression suite;
- staging validation;
- model file integrity;
- catalog IDs and production manifest references;
- exact ZIP cold extraction.

### Spatial
Test each benchmark item at:
- room center;
- each wall/corner;
- 0/90/180/270 rotation;
- near door/window;
- adjacent to another furniture item;
- duplicate placement.

### Visual
Actual running WebGL proof must show:
- perspective depth;
- dimensional silhouettes;
- believable scale;
- real shadows;
- differentiated materials;
- no obvious floating/sinking;
- no generic chair/bed/table identity collapse in the benchmark.

### Mobile
Test:
- orbit drag;
- select;
- place/move;
- rotate;
- duplicate;
- store/remove;
- save;
- lamp toggle;
- pinch/zoom behavior or documented mobile zoom alternative;
- no unusable UI overlap;
- stable frame pacing during a several-minute decorate session.

## 14. Evidence rules
Generated concept images are design targets only.
Catalog thumbnails are catalog evidence only.
Automated tests are technical evidence only.
Only a screenshot/video captured from the running WebGL room is visual runtime evidence.
Only a real phone/tablet run can grant Device Approved.

## 15. Non-regression
Keep:
- room ownership;
- blueprint economy;
- unlimited placement for owned blueprints;
- family/guest room behavior;
- guestbook/reactions;
- W36 best-of-build philosophy;
- prior catalog IDs and user approvals.

Never make the room visually emptier as part of an upgrade. If a production model fails to load, retain the best available 3D fallback.

## 16. Expansion sequence after benchmark passes
1. Repair obvious subtype metadata.
2. Beds family.
3. Seating family.
4. Tables/desks family.
5. Storage family.
6. Lighting.
7. Rugs/soft decor.
8. Wall electronics/decor.
9. Specialty/interactive furniture.
10. Remaining Home catalog by priority/approval stage.

## 17. Release truthfulness
W39 is a production candidate until actual device proof passes. Do not advance official CURRENT_RELEASE merely because unit tests pass. Report separately:
- Technical Candidate;
- Visual Runtime Approved;
- Device Approved.

## Final rule
> The cabin is not done when a furniture record can be dragged around. It is done when the room looks and behaves like a believable 3D place, the furniture keeps its identity, the placement rules prevent impossible layouts, and the actual phone build proves it.


---
# PRESERVED W36 CURRENT PRODUCTION MASTER

# BLACK FAMILY GAME NIGHT - MASTER GAME BUILD PROMPT W36

> **W36 is the current highest-precedence production directive for Prop Hunt visual quality, third-person gameplay presentation, character animation, Papa's Shop, and visual-regression control.**
>
> Preserve every compatible locked rule, approved family-character decision, catalog approval, cabin system, multiplayer rule, game rule, economy rule, and device-safety rule from the existing master prompt. W36 changes how the flagship 3D experience is produced and approved. It does not erase unrelated approved work.

# MASTER PHASE W36 - PROP HUNT LEAPFROG HYBRID PRODUCTION DIRECTIVE

Active staging candidate: `GAME-NIGHT-STAGING-CANDIDATE-W36-LEAPFROG-HYBRID-57`

Planning date: 2026-08-31 / 2026-09-01 development session

Primary flagship: **Prop Hunt - Papa's Shop**

Primary target platform: **mobile browser first, desktop browser also supported**

Primary visual target: **the approved stylized-realistic Prop Hunt gameplay image showing a polished third-person John inside Papa's working mechanic shop with warm lighting, believable materials, dense environmental storytelling, readable HUD, and professional character posing.**

Primary production principle:

> **A new build may improve architecture without being allowed to make the actual game visually worse. Quality must stack. It may not trade one solved layer for a new regression in another.**

======================================================================
W36.0 - WHY THIS DIRECTIVE EXISTS
======================================================================

Recent Prop Hunt development revealed a repeating failure pattern:

1. an older build contained a fuller and more readable shop/world;
2. a newer build improved controls, rendering architecture, asset loading, collision, animation, or GLB usage;
3. the new system replaced or bypassed older visible content before its replacement was visually ready;
4. the resulting game became technically better in one area but visually emptier, sparser, less recognizable, or less fun to look at;
5. passing tests gave a misleading impression of progress because code correctness did not prove visual quality.

This is no longer acceptable.

W36 establishes a **leapfrog production model**: recover the strongest working visual/gameplay layers from prior builds, preserve the newest engineering, and replace legacy visuals only when a new production asset is demonstrably better in actual gameplay.

The goal is not incremental technical cleverness.

The goal is:

> **Make the real running Prop Hunt game look, move, control, and feel increasingly like the approved target without losing anything that was already better in an earlier build.**

======================================================================
W36.1 - SOURCE OF TRUTH AND PRECEDENCE
======================================================================

For Prop Hunt visual/gameplay production, use this order when sources conflict:

1. explicit current user instruction;
2. approved visual references, including the approved Prop Hunt target image;
3. approved family-character identity and likeness directives;
4. locked Prop Hunt gameplay rules and multiplayer rules;
5. this W36 directive;
6. preserved W35 professional visual-pipeline work that does not conflict with W36;
7. preserved W34 animation-feel work that does not conflict with W36;
8. preserved Build 54 / W30 controller, input, physics, grounding, camera, aim and stability work;
9. prior professional game-design directives W10/W11 and other compatible master-prompt canon;
10. historical phase files, prototype screenshots and obsolete placeholder assets.

If there is uncertainty, **do not delete a working system or visible asset while guessing**. Preserve the stronger current behavior and document the conflict.

======================================================================
W36.2 - NON-NEGOTIABLE QUALITY RATCHET
======================================================================

W36 introduces a permanent **visual quality ratchet**.

A newer build may not be accepted if, from the same benchmark gameplay view, it is materially worse than the best previously working build in any of these areas:

- environment fullness;
- recognizable room/shop structure;
- hero prop visibility;
- character readability;
- lighting readability;
- material readability;
- camera composition;
- prop density;
- gameplay orientation;
- HUD usability;
- animation quality;
- perceived polish.

If a new production asset fails to load, is too sparse, is badly scaled, is visually weaker, or creates an empty area, the previous visual must remain available and visible.

**Newer is not automatically better.**

**Loading successfully is not approval.**

**Having more triangles is not approval.**

**Having a unique file is not approval.**

**Passing automated tests is not visual approval.**

======================================================================
W36.3 - PERMANENT VISUAL REFERENCE SET
======================================================================

Maintain a permanent QA reference set in the project for Prop Hunt.

At minimum include:

1. **APPROVED TARGET** - the approved stylized-realistic Prop Hunt gameplay target image;
2. **FULLER ACTUAL BASELINE** - the strongest earlier actual gameplay capture that clearly shows shop structure, floor/walls, props and environmental fullness;
3. **SPARSE REGRESSION EXAMPLE** - the later actual gameplay capture where the world became visibly empty/sparse;
4. **CURRENT BENCHMARK CAPTURE** - the newest actual running screenshot from the fixed benchmark camera.

These references must remain available in the repository or QA package.

Do not remove an older actual screenshot just because a new build exists. It is evidence in the visual-regression history.

======================================================================
W36.4 - FIXED BENCHMARK CAMERA
======================================================================

Create and preserve a deterministic Prop Hunt visual-QA camera/state for Papa's Shop.

The benchmark should load:

- Papa's Shop;
- John as the active visible character or approved QA proxy where clearly labelled;
- the main mechanic bay;
- repair tractor visible;
- workbench visible;
- tool chest visible;
- shelving/tools visible;
- motorcycle/quad or another recognizable mechanic asset visible;
- barn/yard depth or doorway context visible where possible;
- HUD visible;
- stable lighting and time-of-day conditions.

The camera must use the same position, FOV, player position, player facing and scene state for comparison captures.

Every major visual build should capture this view.

Do not move the camera to flatter a weak build.

======================================================================
W36.5 - HYBRID BEST-OF-EVERY-BUILD WORLD
======================================================================

Do not rebuild Papa's Shop from a blank scene unless explicitly required by a catastrophic technical reason.

Use the **fullest proven Papa property/world** as the gameplay baseline, including the existing shop, barn, yard, circulation space, hiding areas and large prop population.

Layer improved production assets into this world.

The correct migration pattern is:

```text
FULL WORKING WORLD
        +
NEW PRODUCTION ASSET
        +
NEW MATERIAL/LIGHTING PASS
        +
NEW ANIMATION/CHARACTER PASS
        =
BETTER WORKING WORLD
```

The forbidden migration pattern is:

```text
FULL WORKING WORLD
        -> delete
SPARSE NEW SHELL
        -> claim improvement
```

No zone may become empty merely because its replacement art is still in development.

======================================================================
W36.6 - VISUAL PROMOTION LADDER
======================================================================

Every visible world object must support a promotion ladder.

Priority order:

1. `APPROVED_VISUAL`
2. `PRODUCTION_VISUAL`
3. `LEGACY_FALLBACK_VISUAL`
4. `DEBUG_PRIMITIVE` - developer/QA only, never a normal final visual

Example:

```text
TRACTOR
Gameplay identity: tractor_repair_01
Collision: simple gameplay hull
Prop Hunt disguise identity: tractor
Visual priority:
  approved tractor GLB
  production tractor GLB
  legacy tractor visual
  debug primitive only in dev mode
```

Use this pattern for at least:

- shop architecture;
- barn architecture;
- tractor;
- quad;
- motorcycle/dirt bike;
- workbench;
- rolling tool chest;
- compressor;
- welder;
- shelves;
- tire stacks;
- rims;
- chairs/stools;
- barrels;
- jerry cans;
- buckets;
- pallets;
- lumber;
- gates;
- hay bales;
- animal-area props;
- hero clutter;
- character models.

======================================================================
W36.7 - ASSET PROMOTION GATE
======================================================================

A replacement asset is allowed to hide or replace its legacy fallback only after it passes **both** technical and visual promotion.

### Technical eligibility

Check:

- asset loads successfully;
- finite transform values;
- sane bounding box;
- sane scale;
- visible mesh count greater than zero;
- valid materials;
- valid geometry;
- no catastrophic missing texture/material errors;
- no origin/axis error that makes placement unusable;
- no invalid animation skeleton for character assets;
- no immediate severe performance problem.

### Visual eligibility

Then confirm from actual rendered gameplay:

- recognizable silhouette is equal or better;
- scale is believable;
- materials are equal or better;
- scene composition is equal or better;
- no major clipping;
- no empty visual hole left behind;
- no loss of important environmental storytelling;
- no severe color/lighting mismatch;
- mobile readability remains acceptable.

If technical passes but visual is unproven, keep the legacy fallback available.

If visual fails, reject promotion.

======================================================================
W36.8 - GAMEPLAY GEOMETRY AND VISIBLE ART MUST BE SEPARATE
======================================================================

The visible world and the gameplay collision world are related but not the same thing.

Use:

```text
GAMEPLAY LAYER
- simple collision hulls
- walkable surfaces
- mantle surfaces
- line-of-sight blockers
- shooting/hit logic
- prop disguise anchors
- spawn volumes

PRESENTATION LAYER
- authored environment GLB
- production hero props
- approved characters
- PBR materials
- lighting
- animation
- VFX
- decals
- clutter
```

Do not force collision geometry to look pretty.

Do not force visible art to carry unnecessarily expensive collision.

Where authored architecture is reliable, derive or align collision from it, but keep the collision representation optimized and deterministic.

======================================================================
W36.9 - NO PROCEDURAL PRIMITIVES AS FINAL HERO ART
======================================================================

Procedural boxes, cylinders, capsules and simple generated meshes remain allowed for:

- collision;
- debug visualization;
- temporary fallback;
- blockout/prototyping;
- invisible gameplay helpers;
- emergency recovery if a production asset fails.

They do not qualify as final hero visuals for:

- John;
- Papa's Shop architecture;
- tractor;
- motorcycle/quad;
- workbench;
- tool chest;
- major shelves;
- large recognizable disguise props;
- other focal objects in the benchmark scene.

Code should **control** a tractor, not be responsible for drawing the final tractor out of crude primitives.

======================================================================
W36.10 - PAPA'S SHOP WORLD CONTRACT
======================================================================

Papa's Shop is a **large working rural mechanic garage connected directly to a barn/farmyard**.

It must never regress into:

- a retail store;
- a clothing shop;
- a showroom;
- an empty brown room;
- a few isolated props floating in space;
- a generic box warehouse;
- a Roblox-like blockout presented as finished art.

The full property should include, over time and as performance allows:

### Main mechanic bay

- full-size repair tractor;
- repair cue such as raised hood, wheel/part work, jack/stand, or exposed mechanical area;
- quad;
- dirt bike/motorcycle;
- optional second farm machine;
- large open chase lane;
- enough camera space for third-person movement.

### Workbench zone

- heavy workbench;
- vise;
- tool wall/pegboard;
- hand tools;
- grinder/drill press where appropriate;
- welder;
- welding helmet;
- extension reel;
- hoses;
- air tools;
- charger;
- rags;
- small parts.

### Storage/equipment zone

- rolling tool chests;
- tires;
- rims;
- shelves;
- oil/grease containers;
- filters;
- batteries;
- jerry cans;
- chain;
- straps;
- buckets;
- bins;
- pallets;
- lumber/scrap metal.

### Barn connection

The barn must remain physically connected and traversable without a loading screen.

Include believable barn language such as:

- timber stalls;
- gates;
- hay;
- feed sacks;
- buckets;
- troughs;
- barn tools;
- animal pens;
- pigs/goats where supported.

### Prop Hunt density

The map should contain enough genuine disguise objects to make Prop Hunt visually and mechanically interesting.

The benchmark mechanic-bay slice should contain approximately **15 to 20 meaningful disguise candidates**, not hundreds of meaningless filler cubes.

======================================================================
W36.11 - HERO BAY FIRST
======================================================================

Do not attempt to make the entire property equally beautiful at once.

First make the main mechanic bay excellent from the normal third-person camera.

The hero bay must establish:

- John readable in foreground/midground;
- tractor as a focal asset;
- workbench/tool zone;
- shelves and storage;
- tool chest;
- tire/rim/mechanic clutter;
- large garage/barn opening;
- depth toward attached barn/yard;
- believable material separation;
- good hiding/chase lanes;
- professional lighting hierarchy.

Only after the hero bay passes actual-device visual approval should the same production treatment spread outward.

======================================================================
W36.12 - PROFESSIONAL MATERIAL PIPELINE
======================================================================

Final production visuals should use PBR-style material logic.

Do not rely on flat base colors alone for hero surfaces.

Target material groups:

### Concrete

- roughness variation;
- oil/grease staining;
- tire marks;
- subtle cracks;
- drains/channels where appropriate;
- contact dirt near walls/equipment.

### Wood

- visible grain;
- structural timber variation;
- old barn boards;
- workbench wood;
- pallets;
- fresh vs weathered lumber;
- roughness differences.

### Metal

- painted steel;
- bare steel;
- galvanized steel;
- rusty steel;
- oily machinery;
- believable metallic response.

### Rubber

- tractor tires;
- bike/quad tires;
- hoses;
- floor mats.

### Fabric/soft surfaces

- rags;
- gloves;
- clothing;
- seat cushions.

### Glass/plastic

- vehicle glass;
- bottles/containers;
- light covers where appropriate.

Use texture atlases and shared materials intelligently for mobile performance.

If a legacy object has no proper authored texture yet, a runtime material-enhancement pass may improve roughness, normal-like detail, color variation and contact response, but this is an interim bridge, not permission to stop producing real assets.

======================================================================
W36.13 - LIGHTING CONTRACT
======================================================================

Lighting is part of gameplay and visual quality.

Target hierarchy:

1. daylight / bright exterior through large garage or barn openings;
2. warm practical overhead shop lighting;
3. stronger localized workbench/task lighting;
4. softer barn lighting;
5. contact shadows under John, machines, benches, tires and props;
6. slightly darker hiding corners that remain readable;
7. brighter chase/navigation lanes.

Use the existing renderer strengths where available:

- sRGB output;
- filmic tone mapping;
- soft shadows;
- adaptive resolution;
- mobile-conscious shadow budgets.

Do not use post-processing as camouflage for weak geometry.

Do not make the shop so dark that disguise props are unreadable.

======================================================================
W36.14 - CHARACTER VISUAL CONTRACT
======================================================================

The approved family-character artwork remains the visual source of truth.

For John, the in-game production character must preserve:

- recognizable likeness;
- approved face direction;
- approved head/body proportions;
- short dark hair;
- beard/stubble direction where approved;
- red plaid identity where called for in Prop Hunt;
- jeans;
- work boots;
- family-game stylized-realistic tone;
- correct silhouette at gameplay distance.

Do not distort the approved character merely to fit a generic skeleton.

Retarget animation to the character.

A skinned John model may be used as a **clearly labelled animation/rig QA proxy** before likeness approval, but it may not be silently promoted to approved final John.

No QA proxy may be used as evidence that character likeness is finished.

======================================================================
W36.15 - PROFESSIONAL CHARACTER RIG
======================================================================

Use a production humanoid rig with appropriate joints for:

- root;
- pelvis;
- spine;
- chest;
- neck;
- head;
- shoulders;
- upper/lower arms;
- hands;
- fingers where required;
- upper/lower legs;
- ankles;
- feet;
- toe/foot roll where useful.

Provide attachment sockets for:

- prop zapper/weapon;
- handheld props;
- hats/headwear;
- hair accessories;
- backpacks/equipment;
- future game-specific attachments.

Skin weighting must be inspected around:

- shoulders while aiming;
- elbows;
- wrists;
- hips;
- knees;
- neck;
- waist;
- clothing deformation.

Reject collapsed shoulders, rubber elbows, twisted wrists, pinched hips, detached accessories, severe clipping, floating hats and broken feet.

======================================================================
W36.16 - ANIMATION STATE MACHINE
======================================================================

Do not use one crude walk/run switch.

The locomotion presentation must understand at minimum:

- idle;
- start move;
- walk;
- jog;
- run;
- sprint;
- stop move;
- strafe left;
- strafe right;
- backward movement;
- diagonal movement;
- normal turn;
- sharp turn;
- 180-degree redirect;
- jump takeoff;
- airborne rise;
- apex/fall;
- landing;
- hard landing;
- aim;
- fire;
- hit reaction;
- mantle where supported;
- celebration/victory where supported.

Locomotion animation must follow actual measured velocity/input direction, not arbitrary timers.

Match animation playback rate to actual travel speed to reduce foot sliding.

The animation clock/telemetry must advance only once per frame unless a specific documented multi-step design requires otherwise.

======================================================================
W36.17 - ANIMATION BLENDING AND LAYERS
======================================================================

Blend states rather than snapping between them.

Use direction, speed, acceleration, grounded state, vertical velocity, aiming state and action state.

Where supported, separate:

```text
LOWER BODY
- locomotion
- planted turns
- strafe
- sprint

UPPER BODY
- aim
- shoot
- recoil
- weapon carry
- look direction
```

This allows John to move laterally or forward while aiming without turning into a rigid full-body pose.

Controls remain authoritative. The animation may not make the player wait for a theatrical transition before responding.

======================================================================
W36.18 - IK AND CONTACT QUALITY
======================================================================

Use IK or equivalent procedural correction where it materially improves the result.

### Foot contact

Prevent:

- visible skating;
- floating feet;
- feet below the floor;
- bad slope contact;
- unstable leg height.

### Hand/weapon contact

For two-handed equipment:

- primary hand anchors the item;
- secondary hand remains attached correctly;
- weapon does not float or drift;
- recoil does not break the hand relationship.

### Aim contribution

Use a believable contribution from:

- chest;
- shoulders;
- neck/head;
- arms.

Do not rotate only the forearms while the torso remains mannequin-stiff.

======================================================================
W36.19 - MOVEMENT AND CONTROLS TO PRESERVE
======================================================================

Preserve the strongest existing controller behavior from Build 54/W30 and later compatible fixes unless measured device testing proves a regression.

This includes the intent of:

- camera-relative movement;
- controller-authoritative position;
- walk/jog/run/sprint continuum;
- input-strength-based speed;
- acceleration/deceleration smoothing;
- responsive starts/stops;
- semantic turn handling;
- safe input lifecycle cleanup;
- jump buffering/coyote behavior where already implemented;
- stable grounding;
- robust mantle validation;
- finite-value recovery;
- obstruction-aware third-person camera;
- explicit aim state;
- separated camera touch vs shooting input;
- hider lock/align rules;
- safe disguise placement;
- frame-rate-independent simulation.

Do not rewrite working controls simply to make an animation easier.

Animation supports gameplay. Gameplay does not become hostage to animation.

======================================================================
W36.20 - CAMERA CONTRACT
======================================================================

Prop Hunt remains a close third-person game.

Camera requirements:

- player visible;
- camera behind/over shoulder;
- fairly close by default;
- optional zoom where already supported;
- obstruction awareness;
- wall/ceiling collision handling;
- no top-down fallback as normal play;
- no pinning the player to the camera;
- no camera teleporting during ordinary movement;
- player/body facing cooperates with aim/camera;
- tight spaces remain usable;
- large props do not destroy the camera;
- small props do not make the camera unusably low or close.

Camera changes must be tested in doors, clutter, corners, barn transitions and near large machinery.

======================================================================
W36.21 - PROP HUNT GAMEPLAY MUST SURVIVE THE ART UPGRADE
======================================================================

Visual production may not break the game.

Maintain:

- hunter movement;
- hider movement;
- disguise changes;
- health;
- shooting;
- flash;
- decoys;
- lock/align behavior;
- chase lanes;
- line of sight;
- hiding spaces;
- round timing;
- classic/family-chaos rules where already locked;
- multiplayer/reconnect behavior;
- mobile controls.

A beautiful shop with broken Prop Hunt gameplay fails.

======================================================================
W36.22 - WORLD DENSITY WITHOUT CLUTTER CHAOS
======================================================================

The older fuller world demonstrated an important lesson: players need visible environmental density to believe the space.

Preserve useful density.

However, density must be authored rather than random.

Every visible object should serve at least one purpose:

- tells the working-shop/farm story;
- supports hiding;
- supports navigation;
- creates a chase decision;
- creates recognizable scale;
- creates visual depth;
- acts as an interactable/disguise candidate.

Do not fill the world with hundreds of meaningless cubes merely to increase object count.

======================================================================
W36.23 - ZONE-BY-ZONE PRODUCTION
======================================================================

Do not replace the entire map at once.

Recommended order:

1. main mechanic bay;
2. attached barn connection;
3. immediate yard outside garage/barn;
4. animal pen/farmyard;
5. secondary shop/storage areas;
6. distant environment/details.

A zone is not promoted until actual gameplay proof shows it is at least as good as the previous visual layer.

======================================================================
W36.24 - MOBILE PERFORMANCE BUDGET
======================================================================

The approved look must run on the target phones.

Use professional mobile optimization such as:

- texture atlases;
- sensible texture resolution;
- compressed assets where supported;
- mesh instancing for repeated props;
- LOD where useful;
- baked lighting/ambient detail for static architecture where appropriate;
- limited dynamic shadow casters;
- shared materials;
- frustum culling;
- conservative post processing;
- adaptive resolution already present where useful;
- avoiding unnecessary per-frame allocations;
- keeping gameplay physics simple even when visible meshes are detailed.

Do not solve performance by deleting the visual identity of the level.

Optimize intelligently.

======================================================================
W36.25 - VISUAL REGRESSION GATE
======================================================================

Every candidate build must receive an actual gameplay comparison from the fixed benchmark view.

Compare against:

- approved target;
- best fuller actual baseline;
- previous candidate.

Score at least:

1. scene fullness;
2. shop recognizability;
3. character quality;
4. animation pose quality;
5. hero prop quality;
6. materials;
7. lighting;
8. camera composition;
9. HUD readability;
10. overall perceived production quality.

A new candidate fails if it is materially worse than the previous best actual build without a deliberate, documented short-lived QA reason.

Do not promote a visually worse build as the new baseline.

======================================================================
W36.26 - THREE SHIPPING GATES
======================================================================

A Prop Hunt candidate is not approved until all three gates pass.

### Gate A - Gameplay

- controls responsive;
- movement correct;
- camera usable;
- collision stable;
- jump/mantle stable;
- aim/shoot correct;
- Prop Hunt actions work;
- no major glitch loops.

### Gate B - Performance

- acceptable real-phone FPS;
- no severe sustained stutter;
- no catastrophic memory behavior;
- stable several-minute session;
- no repeated need for Reset View.

### Gate C - Visual

- actual gameplay visibly closer to approved target;
- environment no emptier than best baseline;
- John/character visually acceptable for the current approval stage;
- major props recognizable;
- materials and lighting convincing;
- no severe clipping/floating;
- animation reads as intentional rather than puppet-like.

**All three must pass.**

======================================================================
W36.27 - PROOF RULE: ACTUAL GAMEPLAY ONLY
======================================================================

Never use any of the following as proof that the game currently looks good:

- AI-generated concept image;
- image-generation mockup;
- Blender/offline render unrelated to runtime;
- static marketing image;
- a different character;
- a different map;
- a screenshot from an old build presented as current;
- a code test count;
- a GLB thumbnail;
- a manually composed image that did not come from the running game.

Generated images may be used as **targets/references only** and must be labelled as such.

When asked, "What does it actually look like?" show only an actual running capture from the stated build.

If the environment cannot render WebGL, say so plainly.

Do not substitute a generated target and imply that it is gameplay.

======================================================================
W36.28 - HONEST SCREENSHOT REQUIREMENT
======================================================================

For each visually promoted candidate, capture if technically possible:

- exact build ID;
- actual running browser/game;
- actual scene name;
- benchmark camera state;
- visible HUD;
- player character;
- real rendered assets.

If capture is impossible in the build environment, the build remains visually **UNPROVEN** until opened on a real supported browser/device.

Automated technical success may still be reported separately.

======================================================================
W36.29 - DEVICE APPROVAL LOOP
======================================================================

The preferred visual-development loop is:

```text
CODE / ASSET CHANGE
       -> automated regression
       -> staging validation
       -> cold ZIP validation
       -> deploy to staging
       -> real phone gameplay
       -> benchmark screenshot/video
       -> compare to target and prior best
       -> fix exact visible problem
       -> repeat
```

Do not jump directly from tests to "finished."

======================================================================
W36.30 - ROOT-CAUSE REPAIR RULE
======================================================================

When an issue is found, diagnose root cause rather than stacking patches.

Examples:

- if a shop disappears, determine whether branch logic bypassed authored loading;
- if a GLB loads but looks wrong, inspect scale/origin/materials/camera rather than simply increasing brightness;
- if animation jitters, inspect state/telemetry/blending before adding arbitrary smoothing;
- if feet slide, align velocity, gait playback and contact handling;
- if an asset replacement leaves a hole, restore fallback and fix promotion logic;
- if phone performance drops, profile expensive systems rather than deleting core visual content blindly.

======================================================================
W36.31 - NO WHOLESALE REGRESSION REPLACEMENT
======================================================================

Any future developer or AI working from this master prompt must follow this rule:

> **Do not remove a visually useful legacy layer until the replacement has passed actual gameplay comparison.**

If replacement is uncertain:

- keep legacy visible;
- load new asset in QA mode;
- compare;
- promote only after success.

This applies to environments, props, characters, materials, lighting and HUD components.

======================================================================
W36.32 - PROFESSIONAL PROP HUNT VERTICAL SLICE
======================================================================

The flagship production proof is intentionally narrow.

Before spreading the system to the whole family and all maps, prove one excellent slice:

- John;
- main Papa's Shop mechanic bay;
- tractor;
- workbench;
- tool chest;
- shelves/tools;
- motorcycle/quad;
- garage/barn opening;
- approximately 15-20 useful disguise props;
- professional lighting/materials;
- close third-person camera;
- polished movement/aim/shoot animation.

Required movement proof:

- idle;
- walk;
- jog;
- run;
- sprint;
- start;
- stop;
- left/right turn;
- 180 turn;
- strafe left/right;
- backward movement;
- jump;
- landing;
- aim;
- fire;
- move while aiming/firing;
- hit reaction where available.

Only after this slice is clearly good should the production recipe spread.

======================================================================
W36.33 - CROSS-GAME REUSE AFTER FLAGSHIP PROOF
======================================================================

Once Prop Hunt proves a shared improvement, reuse compatible systems across other 3D games:

- camera;
- locomotion;
- animation state machine;
- character loading;
- asset promotion/fallback;
- PBR material utilities;
- lighting utilities;
- collision separation;
- device QA tooling.

Do not spread an unproven system merely because it is architecturally elegant.

Prop Hunt remains the flagship validation gate.

======================================================================
W36.34 - CURRENT W36 IMPLEMENTATION BASELINE
======================================================================

The current W36 Leapfrog candidate intentionally establishes the following baseline behaviors:

- full Papa property/world restored as default rather than sparse benchmark-only shell;
- hero mechanic content repositioned into the shop for the first impression;
- W34 animation improvements preserved;
- W35 authored asset/material/lighting architecture preserved where compatible;
- per-asset technical promotion gates added;
- legacy visual preserved when replacement is weak or fails;
- fixed benchmark camera/state added for visual comparison;
- visual-regression reference set included with the project;
- cache-busting used for current runtime files to reduce stale-browser confusion;
- QA proxy character remains clearly separate from likeness approval.

At the time this directive was written, the W36 candidate passed the automated and cold-package gates but still required real-device visual proof before visual approval.

Do not convert that technical status into a visual PASS without actual gameplay evidence.

======================================================================
W36.35 - DEVELOPMENT PRIORITY ORDER FROM HERE
======================================================================

When resuming Prop Hunt development, use this priority order unless the user explicitly changes it:

1. obtain actual W36 phone/browser screenshot and gameplay feel report;
2. identify the largest visible delta from the approved target;
3. repair that delta without regressing scene fullness or controls;
4. improve John/character visual quality and animation together;
5. improve hero mechanic-bay props and materials;
6. improve lighting/contact shadows;
7. improve camera composition/tight-space behavior;
8. improve disguise readability and chase layout;
9. optimize mobile performance without deleting visual identity;
10. only then expand the same quality bar into barn/yard and other maps.

Do not jump to large content expansion while the hero slice still looks prototype-grade.

======================================================================
W36.36 - FINAL W36 RULES
======================================================================

The following statements are permanent requirements:

> **The game must get better cumulatively, not alternately.**

> **Do not trade a full world for a technically cleaner empty world.**

> **Do not trade responsive controls for prettier animation.**

> **Do not trade a recognizable approved character for an easier generic rig.**

> **Do not trade phone performance for an unplayable cinematic scene.**

> **Do not call a generated target image actual gameplay.**

> **Do not call automated tests visual proof.**

> **Do not hide a working fallback until the replacement has earned promotion.**

> **The actual running benchmark screenshot is the visual truth.**

> **Prop Hunt is not done when it merely runs. It is done when the real game looks, moves, controls and performs like a polished third-person game while preserving the approved Black Family Game Night identity.**

======================================================================
W36.37 - HANDOFF INSTRUCTION
======================================================================

When this master prompt is supplied in a new development conversation:

1. Treat W36 as the highest-precedence Prop Hunt production directive.
2. Preserve all compatible earlier master-prompt canon below it.
3. Start from the strongest current working branch/package, not from an obsolete prototype.
4. Do not remove current working content before understanding why it exists.
5. Inspect actual assets and runtime branch logic before making visual assumptions.
6. Preserve Build 54/W30 gameplay stability and W34 animation gains unless a measured reason requires change.
7. Preserve W35's professional separation of gameplay and presentation where compatible.
8. Preserve W36's full-world default and fallback promotion system.
9. Require a fixed-view visual comparison for major visual changes.
10. If real WebGL proof cannot be produced in the development environment, say so and require real-device proof rather than fabricating evidence.
11. Continue repairing until Gameplay, Performance and Visual gates all pass together.
12. Do not ask the user to choose technical implementation details when there is a clearly superior professional-game-development option. Use best engineering judgment and explain consequential choices.

---

# PRESERVED MASTER PROMPT CANON

Everything below this point is the previously current production master prompt and remains binding wherever it does not conflict with W36 above.

# BLACK FAMILY GAME NIGHT — MASTER GAME BUILD PROMPT W23

> W23 is the current highest-precedence staging directive. Preserve all compatible W22 catalog-approval work, W21 gameplay, and true-3D cabin work.

# MASTER PHASE W23 — CATALOG FIT + ACCESSORIES + TWO-STAGE APPROVAL DIRECTIVE

Release: `GAME-NIGHT-STAGING-PHASE-W23-HEADWEAR-FIT-CORRECTION-46`

This directive has highest precedence for catalog-art production and review. It does not erase the W21 gameplay and true-3D cabin recovery work.

## 1. Problem being corrected
The W20/W21 catalogs contain correct ownership records, prices, collections, blueprint logic and fit metadata, but much of the visible catalog art is generated placeholder SVG artwork. Unique file hashes are not an acceptable proxy for professional art quality. A catalog item is not production-complete merely because it has a unique ID or a unique placeholder image.

## 2. Approved visual target
Use the approved Black Family Game Night master catalog lookbook as the visual contract:
- realistic 3D-product-render presentation;
- rustic/cozy cabin realism as the grounded base;
- strong readable silhouettes;
- believable wood, metal, glass, fabric, leather and painted finishes;
- larger product framing with minimal dead space;
- playful, glam, luxury, funny, family-signature and seasonal layers only where the collection calls for them.

## 3. Catalog scope under review
The review system must cover all 6,000 current design records:
- 2,000 Home items;
- 2,000 Avatar/Wearable items;
- 2,000 World Props.

Review occurs in 60 exact batches of 100 items.

## 4. Production status model
Every record carries a production art status and must advance through these stages in order:
1. Concept
2. Approved Art
3. Production Model
4. 3D Ready
5. Integrated
6. Device Approved

No item may skip a stage or be treated as live/final before Device Approved.

### Hard visual-fidelity gate
**If the final in-game item no longer visibly matches the approved concept, it fails approval and does not go live.**

Optimization may reduce polygon count, texture resolution, draw calls, or runtime complexity, but it may not materially change the approved item's recognizable silhouette, proportions, material language, finish/color family, signature construction details, or overall design identity. The Production Model gate exists specifically to compare the actual game-ready model against Approved Art before the item can become 3D Ready.

A separate reviewer decision is tracked:
- Unreviewed
- Approve Concept
- Needs Changes
- Reject

No item may be treated as production-approved only because it exists in a catalog JSON file.

### Recorded review approval
On 2026-08-28, the user approved Batch 01 Review Board A (items 1-20) at the **Approved Art** stage. These items are approved visual concepts only; their Production Models, 3D readiness, integration, and device proof remain pending. The hard visual-fidelity gate above applies to every one of them.

## 5. Review formats
Every batch must be reviewable in all three formats:
1. Collection Lookbook
2. Grid / Board
3. Real-use Proof

Real-use proof means:
- Home item: shown at believable scale in a 3D room context;
- Wearable: fitted on an actual family avatar using semantic fit anchors;
- World Prop: shown at believable scale in a 3D world context.

The review UI must support notes, approve/change/reject decisions, next-unreviewed navigation, local persistence, and JSON export/import so decisions can be handed back into production.

## 6. Release safety rule
Unapproved new concepts must not become newly purchasable/unlockable in staging by accident. Existing ownership must remain intact. The staging store may preview an unapproved concept, but must show that it is pending approval and block a brand-new unlock until promotion.

## 7. Home-item standards
- Real-world scale with slightly substantial cozy-rustic proportions.
- Doors/windows behave as architectural elements, not stickers.
- Floor, wall and tabletop placement must be explicit.
- Different color/finish does not consume a new design ID when the geometry is the same.
- Different geometry/silhouette/style is a distinct design.
- Browse render, detail preview and placed-room identity must visibly be the same object.

## 8. Wearable standards
Layer stack:
1. hair
2. headwear
3. face/filter
4. earrings
5. neck
6. top
7. outerwear
8. bottoms
9. footwear
10. handheld/back
11. aura/signature

Human wearables use semantic anchor fitting. Dog adaptations are deliberate where appropriate; human garments are not simply stretched onto dogs. Colorways should be selectable finishes when the geometry is unchanged. New IDs are reserved for genuinely different designs.

## 8A. W23 two-stage wearable approval gate
Every Avatar/Wearable item must pass two independent gates. A technical pass can never substitute for visual approval.

### Stage 1 — Technical Catalog Approval
An item is Stage-1 approved only when:
- its catalog record, asset and thumbnail resolve;
- its ID, category, slot and mapping are valid;
- every supported avatar receives finite position, scale and rotation values;
- no required semantic anchor is missing;
- equip and unequip behavior works;
- the item remains visible rather than being silently hidden;
- store preview and avatar-customization preview render;
- Kelsi, Molly and Gunner use deliberate dog-specific fitting where appropriate;
- automated catalog QA passes.

Stage-1 approval means only **Technically Approved**. It does not approve the visual design, fit quality, or production art.

### Stage 2 — Visual Avatar Approval
After Stage 1 passes, the item must be visually reviewed on every applicable avatar for:
- position, scale and rotation;
- clipping, floating, sinking and disappearance;
- glasses alignment with eyes/nose/ears;
- hat/headwear alignment;
- earring visibility;
- necklace and neck-accessory placement;
- headset fit;
- top/chest/badge fit;
- layering with other supported cosmetics;
- store-preview fidelity;
- avatar-customization-preview fidelity;
- cabin/player-panel presentation;
- visible fidelity to the Approved Art concept.

An item is **W23 Approved** only when both Stage 1 and Stage 2 pass.

### W23 redesign rule
If an item technically renders but looks wrong, it is **Needs Redesign**, not approved. Flat/generated placeholder art that does not visibly match the realistic 3D approved visual target cannot pass Stage 2. Existing approved concepts remain Approved Art, but their runtime production asset remains blocked until it visibly matches that approved concept and advances through Production Model, 3D Ready, Integrated and Device Approved.

### Dedicated glasses and accessory fitting
W23 treats glasses as a dedicated fitting layer rather than relying only on a generic face-accessory layer. Glasses must be able to coexist with compatible face accessories. Fit profiles must exist for John, Kristen, Holly, Vanessa, Elizabeth/Lizzy, Logan, James, Dorothy, Papa, Nana, Kelsi, Molly and Gunner. Dogs use individual dog profiles rather than one generic dog scale.

## 9. World-prop standards
Each prop keeps one master visual identity with optimized runtime variants for store/preview, cabin, world dressing and Prop Hunt use where needed. Props are explicitly classified as appropriate combinations of:
- Hideable
- Decor-only
- Climbable
- Interactive
- Ambient animated
- Landmark

Not every prop is disguisable.

## 10. Production priority
1. Cabin Home Essentials
2. Avatar Everyday Wear
3. Prop Hunt Shared World Props
4. Family Signature Collections
5. Funny Filters + Comedy Cosmetics
6. Luxury / Rare / Achievement
7. Seasonal / Event

Priority collections may ship once approved; unfinished/unapproved content stays in staging.

## 11. Truthfulness gate
W22 implements the complete review/approval system and status gating for all 6,000 records. It does **not** claim that all 6,000 production-quality bespoke assets have already been redrawn. Current placeholder images remain visible only as locators/concept placeholders until replaced by approved production art.

## 12. Required acceptance gates
- 6,000 review records, no duplicate review IDs.
- 60 batches of exactly 100.
- Batch 1 is Cabin Home Essentials.
- Three review modes operate.
- Decisions persist locally and export/import correctly.
- Source catalogs include explicit Concept / Unreviewed / not-approved-for-live fields.
- New unlocks of unapproved concepts are blocked in staging.
- W21 gameplay/cabin regressions remain green.
- Real-device review remains required before Device Approved status.

---
# PRESERVED W21 MASTER CONTEXT

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


---

# ARCHIVED CUMULATIVE MASTER CONTENT THROUGH W.20

The following W.20-and-earlier master content is retained for full historical design context. Any sentence below that calls an older phase “CURRENT” is archival wording and does not outrank the W.21 directive above.

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


---

# CUMULATIVE PRIOR DIRECTIVES (W.19 AND EARLIER)

Older “CURRENT” status labels below are historical and do not override W.20.

# BLACK FAMILY GAME NIGHT
# MASTER PHASE W.19 — CABIN ART, EMPTY-ROOM PROGRESSION + UNIVERSAL AVATAR FIT

Planning/build date: 2026-08-28  
Runtime release: `GAME-NIGHT-STAGING-PHASE-W19-CABIN-ART-AVATAR-41`  
Design release: `GAME-NIGHT-DESIGN-PHASE-W19-CABIN-ART-AVATAR-41`  
Status: **HIGHEST-PRECEDENCE CURRENT DIRECTIVE**

W.19 is cumulative on W.18. Preserve every W.18 gameplay repair unless this directive explicitly supersedes it.

## 1. Cabin progression contract

- Every personal bedroom begins as an **empty architectural shell**: rustic pine/wood walls and floor, door/window architecture and simple room lighting only.
- No bed, television, dresser, chair, decoration or other furniture is pre-placed.
- W.19 is a migration, not just a new-player setting. Legacy room placements are cleared when old room data is read. Ownership, guest-book entries, reactions and unlocked blueprints remain intact.
- The only free inventory is a deliberately low-end five-piece Starter Crate:
  1. Pine Single Bed
  2. Simple Nightstand
  3. Basic Desk Chair
  4. Plain Floor Lamp
  5. Neutral Woven Rug
- The existing blueprint economy is authoritative: unlock once, place unlimited copies. Removing/storing a placed object never destroys its blueprint.
- Only the room owner may decorate their room. There is no host/admin decoration override.
- Starting bedroom scale remains approximately 14×16 ft.

## 2. Room editor interaction contract

Phone and desktop must both support the same reliable loop:
1. tap/click a placed item to select it;
2. tap/click a valid room destination to move it;
3. use precision arrows when desired;
4. rotate in 90-degree steps;
5. store/remove it;
6. duplicate it when its blueprint is owned;
7. switch floor/wall surface where the catalog record supports both;
8. snap floor and wall placements to readable placement planes;
9. reject placements that exceed the room footprint;
10. explicitly save dirty room state.

Do not require freeform resizing. Asset scale is art-directed so furniture remains believable.

## 3. Item-art identity contract

The old category-image shortcut is prohibited. “Beds” cannot all reuse one bed image; “Electronics” cannot all reuse one television image.

Every one of the 400 cabin catalog records must have a stable item identity used throughout the product. W.19 ships a generated authored-vector identity pair for every record:
- `public/cabin-assets/generated/thumbs/<Item ID>.svg`
- `public/cabin-assets/generated/placeables/<Item ID>.svg`

The item seed, category silhouette, construction details, finish treatment, accents and rarity treatment are derived per record so all 400 output files are visually and cryptographically distinct.

Identity must remain consistent through:
- Browse / Cabin Shop catalog card
- Collection / owned inventory
- Large preview / turntable-style room preview
- Cabin placement
- Shared cabin-prop references in 3D games where appropriate

Hero / Family Legendary / Secret objects should receive the strongest silhouette, finish and accent treatment.

### Truthfulness boundary
W.19 does **not** claim that all 400 catalog items now have bespoke production GLB meshes. The 400-item collection has distinct 2D/vector browse-and-placement art. The shared 3D art kit gains a smaller production-style rustic prop vocabulary (bed, television, dresser, lamp and rug) that is propagated to priority 3D games. Future authored GLBs must preserve each item’s W.19 identity rather than collapsing back to category clones.

## 4. Store preview contract

- Room store cards use each item’s own thumbnail asset.
- Room preview uses the same item’s own placeable identity against the empty cabin shell.
- Preview uses a subtle turntable/presentation motion rather than a static category photo.
- Avatar store preview is a larger rounded rectangle / bust-body stage, not a tiny circle.
- “Preview in room” remains available before purchase/use.

## 5. Avatar + accessory fit contract

Every wearable/accessory is expected to fit every selectable avatar, including Kelsi, Molly and Gunner.

- Never solve a portrait conflict by silently hiding the cosmetic.
- Use anatomical anchors, scale, offsets and per-avatar fitting.
- Human slots: head, hair, eyes, ears/headset, neck/accessory, jewelry, chest/top and badge.
- Dog slots use dog-specific anchors. Torso/top pieces become fitted dog shirts/harness-style overlays where needed.
- Drop earrings and jewelry remain visible rather than being suppressed by a portrait variant.
- Important presentation priority:
  1. Avatar customization screen
  2. Store preview
  3. Cabin player panels
- Small circular quick-select portraits may remain where space requires them, but primary dressing/fitting surfaces should use larger bust/full-body framing.

## 6. Shared 3D cabin art language

Cross-game priority remains:
1. Family Mystery
2. Family Prop Hunt
3. Island Life
4. Molly’s Light Chase

W.19 implementation:
- **Family Mystery:** room illustrations use the empty cabin shell and actual generated cabin collection props; existing glowing reachable clue blocks, tap-destination routing and obvious kitty-corner secret passages remain.
- **Prop Hunt / Papa’s Shop:** shared 3D art kit adds Cabin Bed, Cabin TV, Cabin Dresser, Cabin Lamp and Cabin Rug geometry/material language. A lodge corner in Papa’s Shop uses this prop family without blocking the established chase lanes.
- **Island Life:** Palm & Pine Home displays shared cabin furniture; home furniture materials use the shared rustic pine, aged wood, cream fabric, iron and forest palette.
- **Molly’s Light Chase:** cabin scene uses cabin collection placeable artwork as environmental dressing while preserving Molly’s growing light-trail gameplay.

The cabin is the visual source of truth. New 3D work should inherit its warm wood, aged pine, cream fabric, iron/brass accents, believable object scale and cozy realism.

## 7. Naming lock

The family character is **Lizzy** or **Elizabeth**. Do not use “Lizzie.”

## 8. QA / acceptance gates

A W.19 build is not shippable unless automated QA proves:
- current release/cache markers are W.19;
- existing W.18 gameplay regression suite still passes;
- room defaults and migrated legacy rooms are empty shells;
- the five low-end starter blueprints are present;
- all 400 catalog records have a thumbnail and placeable asset and all 400 hashes are unique in each set;
- browse and cabin use the per-item art helper rather than category maps;
- room selection/move/rotate/remove/duplicate/surface controls are wired;
- server persists placement surfaces and owner-only rules;
- every cosmetic returns a visible finite fit for every family avatar and dog;
- Family Mystery, Prop Hunt, Island Life and Molly contain the shared W.19 art hooks;
- visible user-facing family spelling contains no “Lizzie.”

Real-device acceptance still matters. Automated tests cannot prove finger feel, perceived visual scale or final art taste on a phone/tablet.
# BLACK FAMILY GAME NIGHT
# MASTER GAME DESIGN + PRODUCTION DIRECTIVE W.18
## Gameplay Reliability + Mexican Train Layout + Family Mystery Realism + Molly Light Chase

Planning/build date: 2026-08-28  
Status: **HIGHEST-PRECEDENCE CURRENT MASTER PROMPT**  
Runtime release: `GAME-NIGHT-STAGING-PHASE-W18-GAMEPLAY-REALISM-40`  
Design release: `GAME-NIGHT-DESIGN-PHASE-W18-GAMEPLAY-REALISM-40`

W.18 is cumulative. It starts from the complete W.17 Cabin/Cosmetics build and preserves all non-conflicting earlier work. W.18 supersedes earlier instructions only where the rules, controls, naming, or presentation below are more specific. Historical sections retained later in this document are reference/foundation material even if their original headers called themselves current.

======================================================================
0. W.18 ABSOLUTE PRECEDENCE + QUALITY GATE
======================================================================

Order of precedence:
1. The user's newest explicit instruction.
2. This W.18 directive.
3. Approved family identity/relationship rules and locked family-specific gameplay.
4. W.17 Cabin and portrait-polish runtime.
5. W.16/W.15 Cabin, cosmetics, collections and realism architecture.
6. W.13/W.12 gameplay and collection foundations.
7. Earlier non-conflicting directives.

**A game is not considered working because it loads, renders a board, or highlights a legal piece.** For every repaired game, QA must prove that a human can start it, perform the legal interaction, see state update immediately, continue for multiple turns, and reach or preserve a valid end-state path. A highlighted card/checker/domino that cannot complete its move is a P0 gameplay failure.

Primary interaction standard:
- Phone and desktop must both work.
- Tap/click is the primary universal interaction.
- Drag may exist as an enhancement, never as the only reliable control.
- Legal destinations should visibly illuminate.
- Where board hit targets can be small, provide a direct-action fallback that invokes the same authoritative engine action.
- Successful actions refresh the visible game state immediately. Never leave the interface dependent on a delayed poll for the player to see their move.
- Do not cosmetically hide an engine failure. Repair the rules/state transition first, then the UI.

======================================================================
1. FAMILY NAME LOCK
======================================================================

The family character is **Lizzy** or **Elizabeth**. Never display the alternate ie-ending spelling in player-facing copy. Legacy lowercase aliases/URLs may remain internally only when necessary for backward compatibility and must continue to resolve to the single Elizabeth identity rather than creating a second person.

======================================================================
2. BACKGAMMON — P0 INTERACTION REPAIR
======================================================================

Required control loop:
1. Dice roll establishes available move values automatically.
2. Tap/click a legal checker.
3. Every legal destination for that checker visibly lights.
4. Tap/click the destination.
5. The checker moves, the appropriate die is consumed, and the board refreshes immediately.

Required reliability:
- A legal checker may never light up without being movable.
- Preserve correct bar priority, hits, blocked points, bearing off, forced-use rules, doubles and doubling-cube rules already implemented.
- Add a visible **LEGAL MOVES** fallback list generated directly from current `bgMove` actions. Board tapping remains primary; fallback buttons guarantee playability if a checker hit target is difficult on a device.
- Touch and mouse must share the same authoritative action path.

======================================================================
3. BLACKGAMMON — DICE ALLOCATION + CHECKER RELIABILITY
======================================================================

For the four-single-dice allocation state:
- The controller may tap two dice from the shared roll.
- Selected dice visibly show selection.
- If a device misses die taps, present direct pair buttons such as `KEEP 2 + 5`, each backed by an authoritative `blackAllocateSingles` action.
- After allocation, legal checker movement uses the same tap-checker → glowing destination → tap-destination model.
- Also provide direct legal-move fallback buttons from `blackMove` actions.
- Successful allocation and movement refresh immediately.

Do not alter the locked Blackgammon 4/4/4/3 opening distribution, special 4 behavior, large tiebreak die, rescue/cover behavior or other already-confirmed house rules except where a newer explicit instruction says otherwise.

======================================================================
4. DECK SWEEP — HAND + FOUR EXPOSED FRONT PILES ARE ALL LIVE
======================================================================

Correct play model:
- The four face-up cards/piles directly in front of a player are **playable cards**, not decorative or locked cards.
- They remain playable while the player still has cards in hand.
- Cards from hand and exposed table cards may be played together when they share the required matching rank.
- Legal combinations may contain hand only, exposed-table only, or hand + exposed-table cards.
- Face-down cards below the four exposed positions remain locked until the player's hand is empty **and** the exposed card above that slot has been cleared, preserving the existing staged-unlock rule.
- Playing a table card must clear its actual table slot in authoritative state.
- All generated actions must reference real card IDs and be accepted by the engine.

UI:
- Clearly label that both `YOUR HAND` and `YOUR 4 EXPOSED TABLE CARDS` are live.
- Legal groups should be easy to identify and tap.
- Never require a player to empty their hand before using the four exposed face-up cards.

======================================================================
5. CAMPFIRE CHAOS — DRAW STACK 4 MUST RESOLVE AND CONTINUE
======================================================================

When a player is facing a pending Draw Stack 4 / Supply Raid value of 4:
- `Take 4 cards` must draw exactly four cards when no further stack/challenge changes the amount.
- Clear the pending draw/challenge state.
- Advance the turn according to the existing Campfire Chaos rules.
- Refresh the UI immediately.
- No modal, animation, pending flag or stale client state may leave the player unable to continue.

The same no-deadlock rule applies to other pending draw totals.

======================================================================
6. GOLF — REJECTED DRAW / VISIBLE DISCARD RULE
======================================================================

Locked family rule:
- If the player takes the visible discard card **or** draws from the stock and decides not to use that card in their grid, they must flip one of their own remaining face-down grid cards.
- This requirement applies while more than one face-down card remains.
- The rejected drawn/taken card goes to discard, the chosen grid card flips face-up, and the turn advances.
- **Exception:** if exactly one face-down card remains, rejecting the drawn/taken card does **not** force that final card to flip. Discard the rejected card, leave the last grid card face-down, and continue the game normally.
- UI must not offer a direct discard-without-flip action while two or more face-down cards remain.

======================================================================
7. MEXICAN TRAIN — PROPER DIGITAL RAIL LAYOUT, NO LITERAL TABLE
======================================================================

Rule reference checked against common Mexican Train rules at MexicanTrain.com and then overridden by the family's explicit house choices where applicable.

Locked presentation:
- Remove the literal furniture/table surface from the core play layout.
- Keep the dominoes, station/engine, boneyard and rails visually clear against a clean transparent/digital play field.
- Central engine/station is the visual anchor.
- The player's own private train must be easy to find and visually prioritized.
- Other players' private trains remain separately readable.
- The **MEXICAN TRAIN · COMMUNITY** is a distinct public/shared rail available to everyone.
- Open player trains must be visibly marked.
- Dominoes lay end-to-end with matching pips; the engine-facing first tile and subsequent open end must read naturally.
- Double tiles render perpendicular/crosswise to the train.

Locked family turn rule:
- Normally play **one domino per turn**.
- When a double is played, the player must play another domino to close/satisfy that double if able.
- An unresolved double is visually obvious and constrains subsequent play according to the existing engine rule until closed.
- If no legal play exists, draw from the boneyard and follow the existing pass/open-train flow.

Do not collapse all trains into one strip. The community rail and each personal rail are distinct game objects.

======================================================================
8. TRAIL TROUBLE — PLAYABILITY RECOVERY
======================================================================

Treat inability to make the first/next move as P0.

Required QA path:
- start game with supported player count / computer fill;
- receive the five-card private hand;
- choose a legal card;
- see legal marker destinations/modes;
- execute move/out/send/split/swap/cabin actions as applicable;
- consume/commit the card;
- animate the marker route;
- advance the turn or honor extra-turn rules;
- repeat several turns without dead state.

UI repair:
- Preserve card → board-marker interaction as the primary board-game feel.
- Add a compact **Quick Move** fallback built from current legal Trail actions when no card is selected, so a valid move can always be invoked even if a small board hit target fails.
- Refresh immediately after Trail actions.

======================================================================
9. PRAIRIE POTS — PLAYABILITY RECOVERY
======================================================================

Treat the reported inability to play as P0.

Required behavior:
- Current legal playable cards/actions must be visible.
- Tapping the card remains supported.
- Provide a prominent direct `PLAY [card]` control tied to the same `prairiePlay` action as a guaranteed fallback.
- Any continue/round transition action must remain available and refresh immediately.
- Verify first turn, normal sequence play, pot/chip state transitions and several successive turns.

======================================================================
10. FAMILY MYSTERY — PREMIUM 3D CABIN-REALISM PASS
======================================================================

Visual target:
- Family Mystery should feel like a playable miniature family property built from the same visual language as the Cabin/home screen, **not** a flat Clue clone.
- Reuse approved Cabin artwork and realism cues generously: warm wood, realistic room scenes, dimensional trim, furniture/prop depth, atmospheric lighting, shadows and miniature-dollhouse presentation.
- Current approved Cabin assets may be used as environment plates/material targets; future authored 3D room assets should preserve this look rather than reverting to generic blocks.
- The high overview remains readable as a board, but closer room moments should feel like entering a real miniature room.

Movement system:
- Keep the roll/move-range rule already present.
- Render movement nodes as slightly raised **3D clue blocks** between rooms.
- On the active player's turn, every reachable legal block/room glows clearly.
- The player taps the **final reachable destination**, not each intermediate block.
- Compute the route and animate the family standee through the intervening blocks automatically.
- Movement animation may be skipped only through the existing user setting.

Corner shortcuts:
- The four true corner rooms are Camper, Shop, Living Room and Papa's Shop.
- Add obvious kitty-corner passages:
  - Camper ↔ Living Room
  - Shop ↔ Papa's Shop
- A corner room displays an obvious `SECRET PASSAGE` control/badge naming the opposite destination.
- Passage movement is legal as a direct adjacency shortcut and should not draw an ugly diagonal hallway across the board.

Camera / cinematic behavior:
- Normal play uses an isometric/dollhouse overview.
- When arriving in a room or entering an investigation/suggestion moment, use a brief closer room-arrival/cinematic view with the room's artwork/scene, then return cleanly to play.
- Do not lose board state or input focus during the camera transition.

Family identity:
- Continue using approved family portraits/standees and established relationships/objects.
- Display Elizabeth as **Lizzy** or **Elizabeth** only; do not use the alternate ie-ending spelling.

======================================================================
11. NEON SNAKE IS REPLACED BY MOLLY'S LIGHT CHASE
======================================================================

There should be one active Molly arcade game, not Molly plus a generic Neon Snake duplicate.

Active game: **Molly's Light Chase**
- Molly is the playable puppy and uses the approved Molly character artwork.
- The game uses a classic growing-chase/snake spatial loop without visually stretching Molly's body.
- Molly's head/body position leads a growing **glowing paw-print/light trail**.
- Steer with keyboard arrows/WASD on desktop, swipe on touch devices, plus visible phone direction buttons.
- A glowing moving/placed light is the collectible target.
- Every collected light adds one trail segment and one point.
- The trail becomes the self-collision hazard as it grows.
- Hitting the boundary or the existing trail ends the run.
- Speed increases in readable steps as more lights are caught.
- Preserve best score and existing achievement hooks.
- Keep the visual environment warm/cabin-like rather than generic neon cyber graphics.

Legacy handling:
- Remove Neon Snake from the active shelf/tutorial/service-worker shell.
- `/neon-snake.html` may remain only as a compatibility redirect to Molly's Light Chase so old links do not break.
- Remove the older duplicate Molly arcade entry if present; Molly's Light Chase is the canonical Molly game.

======================================================================
12. W.18 IMPLEMENTATION MAP
======================================================================

Key runtime areas for this release:
- `extraGames.mjs`: Golf, Deck Sweep, Campfire and other authoritative tabletop state transitions.
- `blackGammon.mjs`: direct four-single allocation action support.
- `public/app.js`: Backgammon/Blackgammon fallback controls, immediate action refresh, Deck Sweep/Golf/Mexican Train/Trail/Prairie UI.
- `public/styles.css`: W.18 tabletop/fallback/Mexican Train presentation.
- `public/new-games.html`: Family Mystery realism, raised clue blocks, auto-routing, corner passages and room-arrival cinematic.
- `public/mollys-light-chase.html`: complete Molly chase replacement gameplay.
- `public/neon-snake.html`: legacy redirect only.
- `public/arcade-tutorials.mjs`: Molly tutorial and obsolete Neon Snake removal.
- `public/sw.js`: W.18 cache identity and obsolete Neon Snake shell removal.
- `test/phase-w18-gameplay-realism.test.mjs`: explicit W.18 regression coverage.

======================================================================
13. W.18 ACCEPTANCE CHECKLIST
======================================================================

A release candidate fails if any answer below is NO:

BACKGAMMON
[ ] Can I tap a highlighted checker and then a highlighted destination?
[ ] If board tapping is awkward, can I execute the same legal move from a direct fallback?
[ ] Does the state refresh immediately?

BLACKGAMMON
[ ] Can I choose two shared dice by tap?
[ ] Can I use a `KEEP X + Y` fallback?
[ ] Can I move checkers through board taps or direct legal-move fallback?

DECK SWEEP
[ ] Can I play one of my four exposed front cards while my hand is nonempty?
[ ] Can a matching hand card and exposed table card be played together?
[ ] Do played table cards disappear from the correct slots?

CAMPFIRE CHAOS
[ ] Does `Take 4` actually add four cards, clear pending draw and advance play?

GOLF
[ ] Does rejecting a stock draw force a face-down flip when more than one remains?
[ ] Does rejecting the visible discard do the same?
[ ] With one hidden card left, can I discard the rejected card and leave the last card hidden?

MEXICAN TRAIN
[ ] Are my train, every other player train, and the community train distinct?
[ ] Is the community rail obviously public?
[ ] Is the literal furniture/table gone from the play surface?
[ ] Do doubles rotate crosswise and force another closing play?

TRAIL TROUBLE / PRAIRIE POTS
[ ] Can a player complete a legal first turn?
[ ] Can several turns continue without stale input?
[ ] Is there a reliable direct fallback for small-hit-target situations?

FAMILY MYSTERY
[ ] Do reachable 3D clue blocks light up?
[ ] Can I tap the final destination and watch the full route animate?
[ ] Are Camper ↔ Living and Shop ↔ Papa's Shop obvious shortcut pairs?
[ ] Does the board reuse the Cabin realism/art direction?
[ ] Does room arrival receive a closer cinematic moment without breaking play?

MOLLY
[ ] Is Neon Snake gone from the active shelf?
[ ] Is Molly visibly the puppy being controlled?
[ ] Does every light make the glowing trail longer?
[ ] Do swipe, direction buttons and keyboard controls work?
[ ] Do boundary/trail collisions and speed ramp work?

NAMING
[ ] No player-facing alternate ie-ending spelling exists in active runtime copy.

AUTOMATED RELEASE GATE
[ ] `npm test` passes in full.
[ ] `npm run check` passes in full.
[ ] W.18 regression tests cover the user-reported failures.

======================================================================
14. DO NOT REGRESS
======================================================================

Do not undo any non-conflicting W.17 Cabin/cosmetics work, W.11 Prop Hunt stability work, approved character art, multiplayer room behavior, birthday systems, existing game rules, or Cloudflare deployment architecture while repairing these games. Fix the broken interaction/state path at the smallest responsible layer and preserve the rest of the collection.

======================================================================
PART B — CUMULATIVE W.17 FOUNDATION CARRIED FORWARD
======================================================================

The following content is the prior cumulative master foundation. It remains binding except where W.18 above is more specific. Historical `current` wording inside the carried-forward material is archival; W.18 is the actual current authority.

# BLACK FAMILY GAME NIGHT
# MASTER GAME DESIGN + PRODUCTION DIRECTIVE W.17
## Cabin Runtime + Portrait-Calibrated Realistic Cosmetics Polish

Planning/build date: 2026-08-28
Status: **HISTORICAL FOUNDATION CARRIED FORWARD UNDER W.18**
Runtime release: `GAME-NIGHT-STAGING-PHASE-W17-CABIN-COSMETICS-POLISH-39`
Design release: `GAME-NIGHT-DESIGN-PHASE-W17-CABIN-COSMETICS-POLISH-39`

W.17 supersedes W.16 for portrait cosmetic fitting and presentation. W.16 remains the architectural foundation for Cabin runtime, 400-room-item catalog integration, Game Night Tokens, and direct home navigation. W.15/W.14 remain the approved visual references.

======================================================================
0. W.17 IMMEDIATE LOCKS
======================================================================

1. **Visit the Cabin** must remain a real direct home-screen route, not a prompt-only requirement.
2. Photo/avatar cosmetics may not use emoji or generic sticker positioning.
3. Portrait wearables use semantic head/eye/ear/neck/chest anchors with approved-family portrait calibration.
4. Cosmetic fitting must suppress built-in portrait accessories where stacking would look wrong.
5. Small tabletop portraits simplify lower-body accessories rather than creating visual clutter.
6. Card/tabletop portrait identity always remains the underlying approved photo/avatar.
7. True 3D modes continue toward socket-mounted 3D wearables rather than stretching 2D portrait art into a 3D world.
8. The W.14/W.15 realistic cabin/shop/wearables mockups remain the visual quality bar.

======================================================================
PART A — W.17 PORTRAIT FITTING STANDARD
======================================================================

The player-facing requirement is not merely that an accessory file loads. It must visually read as worn by that portrait.

Required fitting model:
- named semantic anchors for head, eyes, ears, neck, chest, badge area, and hair accessory area;
- per-family-character calibration;
- item-class scaling for caps, cowboy hats, toques, crowns, glasses, headphones, scarves, necklaces, earrings, tops, and badges;
- independent width/height control for accessory classes whose natural asset aspect ratio would otherwise distort fit;
- clipping to the portrait/avatar frame so wearables look integrated into the avatar rather than floating outside it;
- z-order rules so top layers do not cover the face incorrectly;
- tiny-score-avatar simplification.

Do not consider the feature complete if hats cover eyes, glasses float on foreheads, earrings sit on the nose, scarves cover the mouth, or headphones cross the center of the face.

======================================================================
PART B — W.16 FOUNDATION CARRIED FORWARD
======================================================================

======================================================================
0. W.16 PRECEDENCE
======================================================================

1. Explicit current user instruction.
2. Approved family-character identity and family-specific rules.
3. W.16 Cabin + realistic cosmetics runtime contract.
4. W.15 realistic cosmetics / Cabin-entry target.
5. W.14 premium realistic Cabin visual target.
6. W.13 Cabin topology, economy, room catalog and collection rules.
7. W.12 gameplay corrections.
8. W.11 Prop Hunt stability.
9. W.10 professional production discipline.
10. Non-conflicting historical directives.

======================================================================
PART A — IMPLEMENTED W.16 RUNTIME
======================================================================

## 1. HOME SCREEN
- The home screen MUST expose **Visit the Cabin** directly.
- It is present as both a major hero action and a destination-row entry.
- The action routes to `/cabin.html`.
- The cosmetics link is renamed **Cabin Shop + Cosmetics** to reflect the merged long-term collection layer.

## 2. CABIN RUNTIME
Implemented initial production architecture:
- `/cabin.html` is a real application route, not a static mockup document.
- Cabin overview uses the approved realistic dollhouse visual direction.
- Permanent named family-room targets: John, Kristen, Holly, Vanessa, Lizzy, Logan, James, Dorothy, Papa and Nana.
- New/non-core players resolve to permanent `guest:<profileId>` rooms.
- Room ownership is validated server-side on save.
- Family rooms may only initially be claimed by a profile using the matching family avatar.
- Visitors are read-only.
- Guest-book messages and live-style reactions are stored with the room.
- Room data has an offline/local fallback so the editor does not silently lose work when the server is unavailable.
- The room editor uses the locked 14x16-foot design space, 0.5-foot movement increments and 90-degree rotation.
- Room placements are validated against the authoritative W.13 room catalog before server persistence.
- Room placement also validates blueprint ownership server-side. Starter blueprints are seeded automatically; previously saved/grandfathered placements remain valid for migration safety.
- The 400-item room catalog remains authoritative data.
- Token-purchasable room blueprints use the same Game Night Token wallet as wearables through `/api/cabin/item`.
- Earned/achievement/event/secret room items cannot silently be purchased with tokens.

## 3. REALISTIC COSMETICS RUNTIME
The old W.8 emoji renderer is superseded.

Implemented requirements:
- Cosmetics render as image/SVG assets, not Unicode emoji.
- The live catalog contains **154 fitted wearable records** at W.16 launch.
- The catalog spans hats, hair accessories, eyewear, headsets, neckwear/accessories, jewelry, tops and badges.
- Approved realistic art from the W.15 visual direction is now packaged as runtime artwork instead of prompt-only reference material.
- Material/color variants preserve shading and visual depth instead of appearing as flat colored stickers.
- Equipment slots are independent so a player can combine multiple compatible categories.
- Existing W.8 unlock IDs are retained/migrated where practical so older profiles do not unnecessarily lose their purchases.
- Token-purchased items and play/event/achievement reward items are distinguished in catalog data.

## 4. AVATAR FITTING SYSTEM
A single shared fitted-cosmetic renderer is the canonical portrait renderer.

It MUST be used by:
- home/profile avatar previews;
- lobby avatars;
- card/tabletop player portraits;
- score/seat avatars that call the shared avatar renderer;
- the Cabin Shop live preview.

Fitting model:
- slot-specific anchor, X/Y position, width/scale and rotation;
- character-specific overrides for John, Kristen, Dorothy, James, Nana, Papa, Holly, Vanessa, Lizzy and Logan;
- safe generic fallback for other avatar choices;
- reduced/safe compatibility rules for dog avatars;
- per-item override capability for exceptional assets;
- portrait-variant awareness so existing hats, glasses, scarves and earrings in a chosen portrait are not double-stacked with conflicting cosmetics.

Quality rule:
> An accessory is not considered implemented merely because it appears somewhere over the photo. It must visually sit on the correct anatomical region and remain readable at card-table portrait size.

## 5. REALISTIC STORE
`/tokens-store.html` is now the merged Cabin Shop + Cosmetics runtime, not a wearables-only page.

Required behavior:
- the 400-room-item catalog and 154 fitted wearables browse through one live shop surface;
- a shared Game Night Token wallet pays for eligible room blueprints and eligible cosmetics;
- large realistic item thumbnails;
- live preview on the player's actual selected portrait for wearables;
- live realistic room preview for furniture/room items;
- search and category filters;
- rarity/source labels;
- Game Night Token pricing;
- equip/unequip state;
- reward-only items visibly explain that they are won/earned/event-unlocked instead of pretending to be purchasable;
- current equipped-slot summary;
- owned-blueprint state for room items;
- server-backed room blueprint purchasing;
- direct path into the Cabin.

## 6. ROOM ART COVERAGE — TRUTHFUL STATUS
The W.16 runtime connects all 400 room catalog records, but it does **not** falsely claim that 400 unique production 3D furniture meshes already exist.

Current visual-runtime layer:
- approved realistic Cabin aerial artwork;
- approved realistic room artwork;
- representative realistic furniture/category cards for the connected catalog;
- interactive room placement/persistence architecture.

Still required for a true fully-authored 3D release:
- unique production model/material set for all 400 room items;
- true 3D dollhouse camera and cutaway shell rather than the current high-fidelity 2.5D presentation layer;
- physical visitor avatars walking in rooms;
- authored 3D wearable meshes attached to full-body 3D characters in 3D modes.

Do not hide this distinction in release notes.

## 7. QUALITY / NON-REGRESSION GATES
Before any later phase may call Cabin/Cosmetics complete:
- no emoji cosmetic rendering may reappear;
- Visit the Cabin must remain reachable directly from Home;
- fitted wearables must remain visible in shared tabletop portraits;
- portrait variants that already contain a hat/glasses/etc. must suppress only conflicting overlay slots rather than stacking duplicate accessories;
- room saves may only be written by the owner;
- unowned room blueprints may not be injected into new room placements through a crafted client request;
- secrets/achievement cosmetics may not silently become token purchases;
- approved family base identity may never be painted over or replaced by a cosmetic;
- mobile UI remains touch-sized and readable;
- full project tests + staging validation + cold ZIP validation remain mandatory.

======================================================================
PART B — PREVIOUS MASTER CONTENT CARRIED FORWARD
======================================================================

# BLACK FAMILY GAME NIGHT
# MASTER GAME DESIGN + PRODUCTION DIRECTIVE W.15
## Realistic Cabin Rooms, Premium Cosmetics Expansion, and Home-Screen Cabin Navigation

Planning/build date: 2026-08-28
Status: **HISTORICAL FOUNDATION CARRIED FORWARD UNDER W.18**
Runtime release base: `GAME-NIGHT-STAGING-PHASE-W12-GAMEPLAY-CORRECTIONS-36`
Design release base: `GAME-NIGHT-DESIGN-PHASE-W13-CABIN-ROOMS-COLLECTIONS-37`
Visual target release: `GAME-NIGHT-DESIGN-PHASE-W15-REALISTIC-COSMETICS-CABIN-NAV`

W.15 supersedes W.14 anywhere wearable/avatar cosmetics, cabin-entry navigation from the home screen, or the premium presentation standard for player-facing collections are discussed. W.14 remains authoritative for realistic cabin rooms, W.13 for room-system structure and the 400-item room catalog, W.12 for gameplay corrections, W.11 for Prop Hunt stability, and approved family-character locks remain mandatory.

======================================================================
0. W.15 PRECEDENCE
======================================================================

1. Explicit current user instruction.
2. Approved family-character identity and locked family-specific rules.
3. W.15 realistic cosmetics + home-screen cabin-navigation directive.
4. W.14 realistic cabin rooms premium-visual directive.
5. W.13 cabin rooms / collections directive and 400-item room catalog.
6. W.12 gameplay corrections.
7. W.11 Prop Hunt smoothness/stability.
8. W.10 professional production framework.
9. Non-conflicting older directives.
10. Historical prototypes/obsolete implementation details.

Authoritative room catalog remains: `CABIN_ROOMS_400_ITEM_MASTER_CATALOG_W13.xlsx`.
W.15 adds the authoritative wearable/cosmetics quality bar and the home-screen access requirement for the cabin.

======================================================================
PART A — W.15 IMMEDIATE LOCKS
======================================================================

## 1. HOME SCREEN ACCESS
The home screen must include a prominent **Visit the Cabin** button/destination. This is required, not optional. Selecting it must open the cabin aerial/dollhouse view directly.

## 2. COSMETICS UPGRADE
The cosmetics package must be expanded and upgraded into a larger, more realistic 3D wearable system that looks good on all visible avatars across tabletop/card games, cabin visits, and general player-presence surfaces.

## 3. COSMETICS SCALE
Target a large wearable catalog (recommended 450+ entries) across hats, props, outfits, jackets, glasses, accessories, seasonal items, achievement rewards, and other collectible categories. This sits alongside the room/furniture catalog rather than replacing it.

## 4. QUALITY BAR
Cosmetics should look premium, collectible, and believable. Avoid flat sticker-like accessories, crude clipping, weak materials, or low-detail placeholder geometry. The approved visual direction is realistic, warm, polished, and worth showing off on the first serious pass.

## 5. CROSS-GAME PERSISTENCE
Equipped avatar cosmetics should appear consistently anywhere the avatar is visible and technically appropriate, including card/tabletop views, cabin visits, and related social surfaces.

======================================================================
PART B — W.14 CABIN ROOMS VISUAL TARGET (CARRIED FORWARD)
======================================================================

======================================================================
PART B — W.14 CABIN ROOMS VISUAL TARGET (CARRIED FORWARD)
======================================================================

This directive upgrades the W.13 cabin-room feature from a design/system specification into a premium visual-production target. The goal is that the **first serious production pass** should already look polished, warm, realistic, and worth showing off. Avoid flat placeholders, toy-like furniture, weak textures, empty prototype rooms, or cheap mobile-game clutter.

## 1. NORTH STAR VISUAL GOAL
The cabin experience should feel like a premium, cozy, high-end family lodge mixed with a polished modern casual game UI.

The user has explicitly approved a more realistic direction. The target look should therefore be:
- realistic and visually rich rather than cartoony or blocky;
- warm, inviting, premium, and family-friendly;
- pristine on first presentation;
- readable on desktop and mobile;
- decorative enough to feel aspirational, but still believable as a real cabin interior.

## 2. TARGET SPACES TO MATCH
The system must be capable of presenting three linked views at this quality level:
1. **Cabin aerial / dollhouse view** — a handsome, realistic timber lodge shown from an angled overhead cutaway view, with clearly labeled rooms and smooth room-entry navigation.
2. **Room decorator view** — a beautiful furnished room with realistic wood, textiles, rugs, lamps, wall art, and thoughtfully arranged decor.
3. **Catalog / shop view** — a premium store/catalog experience with large attractive thumbnails/cards for furniture, finishes, and decorations, instead of spreadsheet-like low-fidelity blocks.

## 3. REALISM STANDARD FOR ROOMS
Every room should feel authored, not procedurally thrown together.

Mandatory room-quality rules:
- believable room proportions and furniture scale;
- high-quality wood, fabric, leather, metal, glass, and ceramic material definition;
- soft natural lighting plus warm lamp accent lighting;
- layered decor including rugs, throws, pillows, wall art, plants, books, storage, and small personal objects;
- premium floor and wall finishes;
- tasteful clutter, not messy clutter;
- pleasing composition from the default camera angle;
- no obviously fake or blocky geometry in the primary player-facing shot.

## 4. CATALOG PRESENTATION STANDARD
The full catalog may still contain 400 items in data, but the **player-facing experience** must feel curated.

Catalog UX requirements:
- high-end visual cards/tiles with large item thumbnails;
- item card shows item image, rarity/collection marker where applicable, token price or win-source, and category;
- categories such as Beds, Seating, Storage, Tables, Lighting, Electronics, Decor, Plants, Wall Decor, Flooring, Wallpaper, Pets, Seasonal, Trophies, Structural Expansions, Bathroom, Kitchen, and Special Rewards;
- clean filtering and sorting without making the screen look sterile or spreadsheet-like;
- cozy wood-and-brass / paper-card / soft-panel visual language preferred over flat neon storefront UI;
- reward items should look desirable enough that winning them feels exciting.

## 5. CABIN ARCHITECTURE STYLE
The exterior/interior shell for the cabin and guest house should lean toward:
- large rustic timber family lodge;
- pitched rooflines;
- stone and wood accents;
- warm window glow;
- readable room cutaway volumes from above;
- clearly differentiated bedrooms and expansion sockets;
- shared social spaces that look worth visiting.

## 6. MOBILE-FIRST POLISH
The user approved easy decorating and mobile support. Therefore the realistic presentation must still remain practical on phone.

Mandatory mobile rules:
- buttons large enough for touch;
- readable room labels;
- compact side/bottom trays for placement tools;
- item thumbnails still recognizable on smaller screens;
- camera defaults that show the room attractively without constant adjustment;
- do not bury the room beneath oversized UI chrome.

## 7. ITEM ART DIRECTION
The 400-item catalog should emphasize collectible desirability.

Preferred item families include:
- cabin rustic basics;
- cozy modern lodge;
- western/farm accents;
- trophy/achievement pieces;
- TV/media setups;
- plants and natural decor;
- premium bedding and rugs;
- kids/family-friendly novelty items;
- pet-friendly furnishings;
- holiday/seasonal decor;
- expansion modules such as bathroom, kitchen nook, balcony, bunk area, reading corner, trophy wall, and mini game corner.

Each item should read clearly as one of:
- buyable with tokens;
- winnable from arcade play;
- limited/seasonal;
- achievement/unlock;
- giftable/trade-in eligible.

## 8. ANTI-PROTOTYPE RULES
Do not ship the first serious visual pass if it includes any of the following as the primary presentation:
- empty greybox rooms;
- flat placeholder rectangles standing in for furniture;
- spreadsheet-only catalog presentation;
- crude low-detail beds/dressers/plants;
- weak lighting that makes the cabin feel dead;
- unreadable room labels or cluttered aerial navigation;
- surfaces that look plastic when they should look like wood/fabric/metal.

## 9. TEST / APPROVAL GATE
Before claiming the cabin-room visuals are ready, the build should pass a simple visual gate:
- the aerial cabin view looks immediately impressive;
- at least one fully furnished room looks beautiful and believable;
- the catalog/store screen looks premium and easy to browse;
- the mobile room-decorator screen remains attractive and usable;
- screenshots from these views would be good enough to show a stakeholder without apology.

## 10. IMPLEMENTATION EXPECTATION
Yes — the intended answer to the user's question is that this look is achievable. W.14 therefore locks this realistic direction as the required target for the next production-quality pass and future prompting/build work.

======================================================================
PART C — W.13 CONTENT CARRIED FORWARD
======================================================================

The following W.13 content remains in effect unless directly superseded by the W.14 realism requirements above.

This directive defines the long-term personalization/meta-game layer for Black Family Game Night. It does **not** claim the complete 3D cabin, room editor, visitor networking or 400 authored 3D assets are already implemented. It is the authoritative production contract those systems must now follow.

---

## 1. NORTH STAR

The Cabin is the persistent memory layer above every individual game.

**Core loop:**

> Play → earn → collect → decorate → expand → visit → remember.

A successful room must eventually feel less like a generic bedroom and more like a personal museum of that player’s history in Black Family Game Night.

The system should reward three different motivations at once:

1. **Expression** — “This looks like me.”
2. **Achievement** — “I earned that.”
3. **Family history** — “I remember when we got that.”

Do not optimize the system into a sterile inventory grid. The emotional purpose is visible personal history.

---

## 2. CABIN TOPOLOGY

### Main family cabin
- One large shared **two-storey family cabin**.
- Central great room/staircase acts as the visual anchor in the aerial/dollhouse view.
- Permanent named rooms for the core family members.
- Each room label is visible from the cabin overview, e.g. `John's Room`, `Kristen's Room`.
- Tapping a room smoothly focuses/zooms into that room.
- The home screen receives a prominent **VISIT THE CABIN** destination.

### Guest house
- Every new non-core player receives a **permanent personal room** in a separate guest house.
- Guest rooms are not temporary sessions.
- The guest house expands dynamically as more people join: new rooms, then additional floor/wing capacity as required.
- Guest rooms use the same core editor, collections, expansions and visitor rules as family bedrooms.

### Starting room
- Everyone begins from the same neutral base room.
- Approximate visual scale: **14 ft × 16 ft**.
- Starting room must comfortably support a bed, dresser, TV, seating, wall items and collectibles while leaving obvious value in expansion.

### Shared spaces
The cabin may progressively unlock/customize shared spaces including:
- great room;
- games room;
- trophy hall;
- movie room;
- kitchen;
- deck/patio.

Personal rooms remain owner-controlled. Shared-space editing permissions are a later system and must not introduce a host override over private rooms.

---

## 3. AERIAL / DOLLHOUSE NAVIGATION

The target experience is a **true 3D aerial/dollhouse cabin**, not a static menu pretending to be a floor plan.

Required interaction model:
1. Home → **Visit the Cabin**.
2. Camera opens over the cabin in an angled aerial view.
3. Roof/upper shell cleanly cuts away or fades so interior rooms are readable.
4. Named room labels hover/read clearly without covering the space.
5. Tap/click a room label or room volume.
6. Camera travels smoothly into the selected room.
7. Viewer enters either `VIEW ROOM` or, for their own room, `DECORATE`.
8. Back returns to the dollhouse without a full application reload.

The aerial view must make expansion visible. If a player buys/wins a bathroom, balcony, sitting room or other structural addition, their floor plan should physically grow from the overview.

---

## 4. ROOM OWNERSHIP + VISITING

### Ownership
- Only the room owner can edit/decorate that room.
- There is **no host/admin decorate override** for another person’s room.
- Server-side room writes must validate the owner profile, not trust a hidden client button.

### Visibility
- Rooms are visible to everyone in the private family app.
- No locked/private visibility mode is required at this stage.

### Simultaneous visitors
- Multiple people may view the same room at the same time.
- Physical visitor avatars walking inside the room are **not required yet**.
- Until avatar walking is built, visitors appear as compact profile/avatar bubbles with live reactions.
- Room view includes a shared guest-book/reaction surface.

### Guest book
Support short room reactions/messages such as:
- heart;
- laugh;
- wow;
- cozy;
- “love this room”;
- short free-form family message.

Use basic spam/rate limits even though the app is private.

---

## 5. DOGS

Kelsi, Molly and Gunner do **not** receive bedrooms.

Instead:
- dog beds, bowls, toys and themed decor may be placed throughout family rooms and shared spaces;
- dogs eventually wander between valid rooms/common spaces;
- pet furniture can become wander/rest/interest targets;
- the dog system must preserve each dog’s established visual personality;
- no dog item should imply that the dog permanently belongs only to the room owner unless explicitly designed that way.

---

## 6. DECORATOR UX

The room editor should be easy enough for a phone user who has never used a 3D editor.

### Camera
Use an **easy decorating camera**, not avatar walking.
- orbit/pan around room;
- pinch/scroll zoom;
- reset view;
- optional wall-focused camera when placing wall items.

### Placement model
Use a **hybrid free-placement system**:
- player drags furniture freely;
- gentle underlying grid/snap helps alignment;
- snap to compatible walls, floor, ceiling and tabletop/shelf surfaces;
- allow deliberately imperfect placement when still valid;
- prevent impossible overlap, outside-room placement and blocked architectural openings.

### Rotation
- Furniture rotates in **90-degree steps**.
- Preview rotated footprint before commit.

### Item footprints
Items have actual size metadata, not one universal square.
Examples:
- small decor: 1 × 1 or tabletop anchor;
- dresser: 2 × 1;
- bed: 2 × 3;
- rug: 2 × 2 or larger;
- sectional/showpiece: multi-cell footprint;
- wallpaper/flooring: room-surface application;
- architecture: expansion socket rather than furniture footprint.

### Wall layers
Wallpaper is a room finish and must not occupy the same placement slot as wall decor.
Allow:
- wallpaper;
- multiple frames;
- plaques;
- shelves;
- mirrors;
- wall TVs;
- signs;
- trophies;
on the same wall when their anchor rectangles do not overlap.

### No saved layout presets yet
Do not build multiple named room-layout save slots in the first release. One persistent current layout per room is enough.

### Undo safety
Before production release, decorator should support at least:
- undo recent placement/move/delete;
- cancel preview;
- reset selected item to last valid position;
- safe recovery if an old save references a removed/deprecated item.

---

## 7. CUSTOMIZABLE ROOM SURFACES + ARCHITECTURE

Players can eventually customize:
- furniture;
- wallpaper;
- wall color/finish;
- flooring;
- ceiling finish;
- trim;
- lighting fixtures;
- windows;
- doors;
- architecture/expansion pieces;
- room ambience/time-of-day preset.

Architecture should grow through explicit expansion sockets rather than arbitrary structural mesh editing on phone.

Initial expansion examples and starting target costs:
- closet/storage nook: **300 Game Night Tokens**;
- bathroom: **600**;
- gaming nook: **700**;
- balcony/deck: **900**;
- sitting room: **1,050**;
- kitchenette: **1,200**.

Major achievements may award an expansion directly instead of requiring purchase.

---

## 8. UNIVERSAL CURRENCY — GAME NIGHT TOKENS

Rename the long-term universal reward currency from **Arcade Tokens** to **Game Night Tokens**.

Game Night Tokens may eventually be earned from:
- arcade games;
- card games;
- board/table games;
- Prop Hunt;
- Family Island Life;
- birthday events;
- daily/weekly family challenges;
- achievements;
- duplicate item salvage.

There is **one currency**, not a maze of room coins, arcade coins and furniture credits.

### Starting earn pace
Initial economy target:
- meaningful completed arcade round: **+5**;
- win/complete objective: **+10 additional**;
- first eligible game of the day: **+10**;
- play 3 different eligible games: **+20 daily**;
- daily challenge: **+20–40** depending on difficulty, nominal target 30;
- milestone/achievement: **+25–100**;
- duplicate reward salvage: typically **25%** of equivalent token value.

Do not award completion tokens for instantly entering/quitting a game. “Completed round” requires a meaningful gameplay completion signal per game.

### Purchase pace
- basic decor: **10–50** tokens;
- mid-tier furniture: **75–200**;
- major showpiece: **250–750**;
- structural expansions: roughly **250–1,400**.

Goal: a casual player can normally choose a small/basic purchase after roughly one or two games, while showpieces and expansions remain visible medium/long-term goals.

---

## 9. BLUEPRINT OWNERSHIP, DUPLICATES, SALVAGE + GIFTS

The unlock object is a **blueprint**, not a consumable chair.

### Blueprint rule
Once an item is unlocked:
- it is permanently known by that profile;
- the owner may place unlimited copies in their room, subject to room performance/item-count limits;
- placing or deleting an instance never destroys the blueprint.

### Duplicate reward rule
Because a blueprint is permanent, duplicate drops must not create infinite money.
- duplicate reward copies may be salvaged once for a controlled token amount;
- default salvage target: **25% of equivalent token value**;
- salvage does not remove the already-owned blueprint.

### Gifts
- regular purchasable items can be purchased as gifts;
- regular arcade reward items may be giftable where specified;
- giving a gift does not remove the giver’s already-owned blueprint;
- gift is a new unlock for the receiver;
- gifts appear wrapped and require an `OPEN GIFT` moment;
- gift may contain sender name and short free-form family note.

### Non-giftable prestige
Performance/status items remain account-earned:
- top mastery trophies;
- perfect-run trophies;
- birthday heirlooms tied to that person/year;
- collection mastery trophies;
- secret long-term status objects.

A trophy should continue to mean the room owner did the thing described on the plaque.

---

## 10. RARITY SYSTEM

Use these five tiers:
1. **Common**
2. **Uncommon**
3. **Rare**
4. **Epic**
5. **Family Legendary**

Rarity affects presentation and collection value, not gameplay power.

### Visual treatment
- Common: normal presentation.
- Uncommon: subtle catalog accent.
- Rare: refined trim/accent.
- Epic: gentle sparkle/emissive detail where appropriate.
- Family Legendary: special plaque/aura/animation, but tasteful.

Do not turn every rare room into a flashing casino. The cabin should remain warm and believable.

---

## 11. 400-ITEM LAUNCH CATALOG

Authoritative catalog files:
- `CABIN_ROOMS_400_ITEM_MASTER_CATALOG_W13.xlsx`
- `CABIN_ROOM_ITEM_CATALOG_W13.json`
- `public/cabin-room-catalog.mjs`

Locked distribution:
- **175** Buy with Game Night Tokens;
- **144** individual arcade-game rewards;
- **6** cross-arcade achievement rewards;
- **35** seasonal/birthday rewards;
- **20** collection-completion rewards;
- **20** secret/prestige items;
- **400 total**.

Every one of the 16 active arcade games receives **9 distinct room rewards**, satisfying the 8–15 reward target while keeping launch scope controlled.

Catalog categories include:
- Beds;
- Seating;
- Tables;
- Storage;
- Electronics;
- Lighting;
- Rugs;
- Wall Decor;
- Plants;
- Toys & Hobbies;
- Games;
- Pet Items;
- Decorations;
- Wallpaper;
- Flooring;
- Windows & Doors;
- Ceiling & Trim;
- Special Effects;
- Collectibles;
- Architecture.

Each catalog item must carry build metadata such as:
- stable item ID;
- category/subcategory;
- collection;
- rarity;
- source type;
- source game;
- visible unlock text;
- internal unlock condition;
- purchase/equivalent value;
- salvage rate/value;
- gifting policy;
- account-earned policy;
- secret flag;
- footprint;
- placement surface;
- valid room types;
- rotation behavior;
- style tags;
- animation/VFX hooks;
- audio/ambience hooks;
- future interaction;
- collection set;
- 3D production notes.

Do not collapse this metadata into item names or hard-code rules throughout UI files. The catalog becomes data-driven.

---

## 12. THEMED + FAMILY-SIGNATURE COLLECTIONS

Support coordinated room styles while allowing free mixing.

Launch-facing style families include:
- Everyday Basics;
- Rustic Cabin;
- Modern Lodge;
- Farmhouse;
- Glam Suite;
- Gamer Den;
- Western Lodge;
- Princess & Dance;
- Industrial Shop;
- Retro Game Night;
- Cozy Grandma;
- Outdoors & Fishing;
- Construction Crew;
- Garden Cottage;
- seasonal/event sets;
- arcade reward sets.

Family-signature pieces should appear naturally throughout these sets and reward tracks, including recognizable themes for John, Kristen, Holly, Vanessa, Lizzy, Logan, James, Dorothy, Papa and Nana.

Players may mix sets. Never require the entire room to be one theme.

---

## 13. ARCADE ROOM REWARD TRACKS

Every active arcade game has a nine-piece room-reward track following this design ladder:
1. first clear / first meaningful completion;
2. 5 wins/clears;
3. 10 wins/clears;
4. perfect score or designated high-skill objective;
5. hard-mode/difficult-level milestone;
6. game-specific daily challenge;
7. mastery milestone;
8. game-specific TV channel;
9. long-term Family Legendary trophy.

Active launch tracks:
- Papa's Paddle Battle;
- Gunner's Goat Run;
- John's Shop Bomber;
- James's Lumber Stack;
- Dorothy's Garden Merge;
- Logan's Trail Logic;
- Nana's Goat Whack;
- Holly's Memory Mayhem;
- Lizzy's Dramatic Lights;
- Vanessa's Pipe Problem;
- Molly's Light Chase;
- Gunner's Snack Attack;
- Cabin Breakout;
- Kelsi's Rock 'n' Roll Rescue;
- Campfire Rocket;
- Neon Snake.

The exact item names and conditions live in the W.13 catalog.

Room rewards should visually reuse original Black Family Game Night motifs from those games, not external branded assets.

---

## 14. STORE UX

Keep **one store**, not separate Avatar Shop and Cabin Shop destinations.

Recommended top-level tabs:
- Avatar;
- Furniture;
- Walls & Floors;
- Decorations;
- Specials.

### Required item card states
Every item shows its source classification:
- Buy with Game Night Tokens;
- Win in Game;
- Achievement Reward;
- Birthday / Seasonal Reward;
- Collection Completion Reward;
- Secret.

### Preview
Before purchasing a room item:
- show the item in a miniature/live preview of the player's **actual current room**;
- allow 90° rotation preview where relevant;
- show footprint/surface compatibility;
- preview must not mutate the saved room until confirmed.

### Secret presentation
Before discovery:
- item art/name may appear as `???` / silhouette;
- unlock condition also displays `???`;
- internal condition remains server/catalog data only.

---

## 15. COLLECTION BOOK

Create a persistent collection book/catalog that shows:
- discovered items;
- owned blueprints;
- missing visible items;
- secret question-mark entries;
- collection progress;
- source/unlock route;
- rarity;
- set completion reward.

Completing defined collections unlocks dedicated bonus pieces. W.13 defines 20 launch completion rewards.

The collection book should make progress legible without making the main room editor feel like a spreadsheet.

---

## 16. TROPHIES + FAMILY MEMORY OBJECTS

Room items can preserve actual history.

Support:
- trophy cabinets;
- achievement plaques;
- game trophies;
- birthday heirlooms;
- family photographs;
- framed game screenshots/art;
- customizable text signs/plaques;
- dated/year-stamped memory objects;
- long-term time-capsule pieces.

### Inspect behavior
Visitors should eventually be able to tap an earned trophy/memory and see:
- item name;
- who earned it;
- what was done;
- game/event;
- date/year where meaningful.

### Photos
The system may eventually support user-uploaded family photos for approved room frames in addition to game-generated images/screenshots.

Because uploaded images are user content, store only references/approved derivatives needed by the private app and do not silently publish them elsewhere.

### Custom text
Free-form text is permitted because this is a private family app. Apply practical length limits and safe rendering/escaping.

---

## 17. TV CHANNELS, ARCADE MACHINES + AMBIENCE

### TVs
TVs may support unlockable channels such as:
- Prop Hunt highlight reel/screen saver;
- Logan dirt-bike channel;
- fireplace channel;
- family-photo slideshow;
- classic game screensavers;
- weather-style cabin screen;
- per-arcade game channels from reward tracks.

Channels should default muted and never auto-blast audio when opening a room.

### Arcade machines
Room arcade machines may later launch the relevant mini-game directly.

### Ambience packs
Collectible room ambience may include:
- daytime;
- sunset;
- night;
- fireplace glow;
- rain at window;
- snow;
- fireflies;
- seasonal lighting;
- music/soundscape packs.

Audio and lighting settings are part of the saved room environment, not separate avatar settings.

---

## 18. SEASONAL + BIRTHDAY HISTORY

Seasonal collections may include:
- Christmas;
- Halloween;
- spring/Easter;
- summer camping;
- winter/New Year;
- birthdays.

Birthday events should produce limited yearly room items/heirlooms.

Once earned:
- the birthday item remains permanent;
- preserve relevant person/year/event metadata;
- older birthday rewards become part of the family's visible history rather than disappearing when the event ends.

W.13 includes personalized birthday heirloom slots for John, Kristen, Holly, Vanessa, Lizzy, Logan, James, Dorothy, Papa and Nana.

---

## 19. SECRETS + PRESTIGE

W.13 contains 20 launch secret/prestige pieces.

Player-facing rule:
- undiscovered item = `???`;
- undiscovered condition = `???`.

The internal catalog may store the real condition for development/testing.

Secret items should reward unusual exploration, mastery, long-term family participation or funny family-specific achievements. They should not depend on gambling, paid random loot or real-money purchases.

Prestige can be ridiculous in a warm family-game way. W.13 deliberately reserves pieces such as:
- Family Legendary Golden Toilet;
- indoor hot tub;
- giant wall aquarium;
- hidden bookcase door;
- meteor shower skylight;
- Family Time Capsule;
- Cabin Founder's Grandfather Clock.

---

## 20. PERFORMANCE + TECHNICAL BUDGET

A 400-item catalog does **not** mean 400 meshes are loaded in every room.

### Loading
- Load current room + necessary cabin shell only.
- Lazy-load catalog thumbnails and 3D assets.
- Stream/instantiate placed room assets from stable item IDs.
- Dispose assets after leaving room when not shared elsewhere.

### Repetition
Repeated identical items should share:
- geometry;
- materials/textures;
- LOD data;
- instanced rendering where appropriate.

### LOD
Large/animated furniture gets purposeful LODs. Small tabletop items may use simpler distance culling rather than multiple unnecessary meshes.

### Room item count
Set a conservative launch per-room placed-instance budget after actual phone profiling. Do not choose the number from desktop testing alone.

The editor should warn before a room reaches the tested safe budget, not simply allow infinite placement until the browser crashes.

### Thumbnail/catalog performance
The 400-item store and Collection Book use lazy virtualized lists/grids on phone. Do not build 400 heavy DOM/3D previews simultaneously.

---

## 21. PERSISTENCE + DATA MODEL

Recommended room profile state:
- `roomOwnerProfileId`;
- room version/schema;
- room type/main cabin vs guest house;
- base-room style;
- unlocked expansions;
- wall/floor/ceiling/trim finishes;
- lighting/ambience preset;
- array of placed item instances;
- each instance references stable catalog `itemId` plus transform/anchor metadata;
- guest-book entries;
- reactions summary;
- last edited timestamp.

Recommended collection profile state:
- Game Night Token balance;
- unlocked blueprints;
- duplicate/reward inventory eligible for salvage where required;
- gifted/unopened gifts;
- collection progress;
- achievement metadata;
- birthday/event metadata;
- discovered secret IDs.

### Save migration
Never tie the save permanently to a particular mesh filename.
Stable `itemId` resolves through the current catalog so art can be upgraded without destroying room layouts.

---

## 22. MULTIPLAYER AUTHORITY + CONCURRENCY

Server remains authoritative for:
- token balance;
- purchase/unlock;
- gift transfer/unlock;
- duplicate salvage;
- room ownership;
- placed-layout writes;
- expansion ownership;
- achievement/trophy ownership;
- secret discovery;
- guest-book posts.

Visitors are read-only for furniture state.

If owner is editing while others are viewing:
- visitors receive room revision updates;
- avoid full room reload for each placement;
- send compact item add/move/remove/finish patches where practical;
- version room writes to avoid stale overwrites.

---

## 23. PROFESSIONAL PRODUCTION SEQUENCE

Do not attempt to author 400 final 3D objects before proving the system.

### Gate A — data + economy
- W.13 catalog authoritative and validated;
- Game Night Tokens schema;
- blueprint ownership;
- gift/salvage rules;
- catalog/collection APIs.

### Gate B — one room vertical slice
- one 14 × 16 room;
- owner-only editing;
- free placement + gentle snap;
- 90° rotation;
- floor/wall/surface anchors;
- save/reload;
- 20–30 representative items;
- phone performance proof.

### Gate C — cabin dollhouse
- two-storey cabin shell;
- room labels;
- tap-to-focus navigation;
- one real room per core family profile;
- dynamic guest-house foundation.

### Gate D — social visiting
- room viewer;
- simultaneous visitor presence bubbles;
- reactions;
- guest book;
- read-only enforcement.

### Gate E — progression integration
- Game Night Token earning from games;
- 16 arcade reward tracks;
- achievements;
- gifts;
- collection book;
- TV channels/trophies.

### Gate F — content scale
- author/finalize the full 400 launch-item library;
- LOD/material/thumbnail pass;
- season/birthday content;
- secrets;
- shared spaces;
- room expansions.

Do not let item quantity outrun editor usability or mobile performance.

---

## 24. DEFINITION OF DONE FOR FIRST PLAYABLE CABIN RELEASE

The first real Cabin Rooms runtime is not “done” because a room page opens.

It must prove on an actual phone:
- Visit the Cabin entry from home;
- cabin overview loads without blocking the rest of the app;
- room labels are readable/tappable;
- player can enter own room;
- player can drag, rotate, place and remove furniture reliably;
- invalid overlaps are rejected cleanly;
- wallpaper/flooring and wall items are independent layers;
- layout persists after reload/reconnect;
- visitor can enter but cannot edit;
- another visitor can appear simultaneously;
- reactions/guest book work;
- Game Night Token purchase changes authoritative balance once;
- blueprint remains permanently available after placement/deletion;
- a gift unlocks for the receiver without consuming giver blueprint;
- duplicate salvage cannot be exploited repeatedly;
- secret conditions are not leaked by client-facing UI;
- room remains within agreed mobile frame-time/memory budget.

---

## 25. RESEARCH PRINCIPLES USED

W.13 deliberately borrows **design principles**, not copyrighted art/assets, from successful housing/decorating systems:

- Palia publicly describes home expansion, themed furniture, visiting other homes, and a snap-to-grid option that can be toggled to freeform placement:
  https://palia.com/news/gpfl-highlights
- Palia's customization notes emphasize housing as player expression, mix-and-match themed sets, room sizes/add-ons and inspiration through visiting other homes:
  https://support.palia.com/hc/en-us/articles/7474242903444-Customization
- Nintendo's Animal Crossing materials describe collecting/purchasing/gifting furniture, wallpaper/flooring/lighting and visiting others, reinforcing the value of multiple acquisition paths and social display:
  https://www.nintendo.com/en-ca/store/products/animal-crossing-new-horizons-switch/
- Happy Home Paradise emphasizes easy redecorating, lighting/soundscapes and sharing/visiting designs:
  https://www.nintendo.com/en-ca/store/products/animal-crossing-new-horizons-happy-home-paradise-70050000030669-switch/
- Palia's housing performance notes explicitly pair decor-limit increases with performance optimization and headroom, reinforcing the W.13 rule that content scale must remain inside measured mobile budgets:
  https://palia.com/news/patch-191

These references are inspiration for product/UX patterns only. All Black Family Game Night names, room assets, UI, furniture art and reward designs must remain original/project-specific.

======================================================================
PART B — INHERITED W.12 GAMEPLAY DIRECTIVE
======================================================================

The complete W.12 master prompt follows for continuity. W.13 supersedes only the cabin/token/meta-game topics explicitly changed above.

# BLACK FAMILY GAME NIGHT
# MASTER GAME DESIGN + PRODUCTION DIRECTIVE W.12
## Gameplay correction release: Blackgammon, Prop Hunt controls, Mexican Train table state, Last Haven hand visibility, Deck Sweep progression and Prairie Pots scoring clarity

Planning/build date: 2026-08-28
Status: **HISTORICAL FOUNDATION CARRIED FORWARD UNDER W.18**
Runtime release: `GAME-NIGHT-STAGING-PHASE-W12-GAMEPLAY-CORRECTIONS-36`
Design release: `GAME-NIGHT-DESIGN-PHASE-W12-GAMEPLAY-CORRECTIONS-36`
Supersedes: W.11 wherever this W.12 section explicitly changes gameplay, controls, naming or table UX.
Preserves: W.11 Prop Hunt smoothness/stability architecture, W.10 professional production framework, approved character identity, W.8 tutorial/token systems, all locked rules not explicitly changed below.

======================================================================
0. W.12 PRECEDENCE + RELEASE OBJECTIVE
======================================================================

This is the canonical next-build prompt.

Current precedence:
1. Explicit current user instruction.
2. Approved family turnaround identity and locked family-specific rules.
3. This W.12 correction section and `MASTER_PHASE_W12_GAMEPLAY_CORRECTIONS_DIRECTIVE.md`.
4. W.11 stability requirements.
5. W.10 professional game-design framework.
6. Non-conflicting W.9/W.8/W.7 and older directives.
7. Historical prototypes and obsolete implementation details.

W.12 is a **playability correction release**. A game that visually launches but cannot complete its core turn loop is not considered playable. Each repaired game must expose enough state on screen for a player to understand what can be done next without guessing.

======================================================================
1. BLACKGAMMON — ONE-WORD NAME + GUARANTEED CHECKER MOVEMENT
======================================================================

### Naming lock
- The current product name is **Blackgammon**, one word.
- Standard Backgammon remains a separate game.
- Current shelf labels, current help/tutorial copy, current rules title and current win/error messages should use `Blackgammon`.
- Historical phase reports may retain the old two-word spelling as history.

### Core failure being corrected
Players could roll/allocate dice but then the phone UI could make checker movement effectively inaccessible.

### Required interaction contract
- After rolling and allocation, legal `blackMove` actions must always remain actionable.
- Board-first direct manipulation remains the preferred path: select die/token, select checker/bar source, select legal destination.
- Add a **direct legal-move fallback** below/beside the board. Every legal move can be executed from a readable button even if a checker stack is difficult to tap.
- When only one playable die token exists, it may be preselected to remove unnecessary taps.
- Legal destinations remain visually highlighted.
- Illegal checker taps must not consume the turn or dice.
- After every move, refresh the state immediately and expose remaining legal moves until the assigned dice are exhausted.
- Bar entry, bearing off, forward/backward sets, rescue and transfer rules remain unchanged.

### W.12 acceptance gate
A phone player must be able to start a Blackgammon game, roll, allocate, execute at least two successive checker moves and continue the round without needing precision taps on overlapping checkers.

======================================================================
2. FAMILY PROP HUNT — SPEED, CONTROL DIRECTION, HANDS + WEAPON
======================================================================

W.11 remains authoritative for fixed-step simulation, interpolation, camera hysteresis, collision ownership, recovery, pooling and frame pacing. W.12 changes the **control feel and weapon presentation** only.

### Movement tuning
- Increase Prop Hunt walk speed modestly from the W.11 value so traversal feels lively rather than sluggish.
- Current baseline: walk approximately 3.15 m/s, sprint approximately 5.35 m/s, with responsive acceleration/braking.
- Do not trade stability for speed. W.11 fixed simulation and collision behavior remain mandatory.

### Controller direction
- Fix the reported backwards mobile controller behavior.
- Pushing the left joystick upward must move the player forward relative to the current camera view.
- Pulling down moves backward; left/right strafe left/right relative to camera.
- Desktop WASD remains camera-relative and intuitive.
- Validate on a real touch device with camera yaw changed to at least 0°, 90°, 180° and 270°.

### Hands and Prop Zapper presentation
- Hunter hands and gun must appear **in front of the torso**, not behind the character.
- Right hand remains trigger hand; left hand supports the front grip.
- The procedural fallback rig must use the same forward-axis convention as approved authored rigs.
- Do not fix this with a camera trick that leaves the actual rig backwards.
- The gun must remain visible in normal shoulder gameplay, sprint-to-aim transitions and while firing.
- Muzzle, tracer and impact continue to align with W.11/W.7 shot-validation rules.

### W.12 acceptance gate
On phone: push joystick forward, run toward the center of the view, rotate camera, repeat; hands and gun remain visibly forward; fire at a wall and see aligned muzzle/tracer/impact.

======================================================================
3. MEXICAN TRAIN — FLIPPABLE DOMINOES + COMPLETE TABLE READABILITY
======================================================================

### Domino orientation
- A domino may be played using either end when either end legally matches.
- Provide an explicit **Flip** control on held dominoes so the player can inspect/rearrange the tile end-for-end before choosing it.
- Flip is presentation/orientation state only; server legality continues to validate either matching end and canonicalize placement.

### Full train visibility
The central play surface must show, at the same time:
- the engine;
- the community **Family Train / Mexican Train**;
- every player's personal train/run;
- each train's open end;
- whether each personal train is private or open;
- the visible avatar/open marker when a train becomes available to others;
- unresolved-double state where applicable.

A player should be able to look at the board and answer: **Where can I legally play right now?** without opening another menu.

### Held dominoes
- All of the viewer's held dominoes remain reachable/visible in the rack.
- Rack order can be rearranged on phone and desktop.
- Flipping a rack tile must not lose its identity or corrupt drag/reorder state.

### Score sheet
- The score sheet must live **outside the board play area**, in the side panel on wide screens and below the board on narrow/mobile layouts.
- It must not cover trains or shrink the usable train board.
- Show per-round scores and total; lowest total wins.

### W.12 acceptance gate
A player can visually inspect all personal trains + community line, flip any held tile, identify an open opponent train, select it as a legal destination when rules allow, and read the score without obscuring the board.

======================================================================
4. LAST HAVEN — SHOW THE PLAYER'S HAND / SUPPLY INVENTORY
======================================================================

The planning fantasy requires seeing what you own before deciding whether to build, play or trade.

### Required hand dock
Always expose the viewer's usable private inventory in a dedicated hand/supply area:
- Timber count;
- Scrap count;
- Food count;
- Fuel count;
- Medicine count;
- held Survival cards.

### UX rules
- Label it clearly as the player's supply hand/inventory.
- It remains visible during the main playing phase and trade/build decisions.
- Resource counts must update immediately after a trade, build, gain or spend.
- Do not reveal another player's private held cards/resources unless that game rule explicitly makes them public.

======================================================================
5. DECK SWEEP — RANK SORTING + SPECIAL TEN + SLOT-BY-SLOT TABLE FLOW
======================================================================

### Sorting
- Deck Sweep hands sort **by rank/number first**, not by suit.
- Suit is only a secondary tie-breaker for cards of the same rank.
- Keep rank order stable/predictable throughout the turn.

### Special 10 readability
- Rank 10 is a special Sweep card and must have a persistent visual highlight/reminder.
- Highlight 10s in the player's hand and visible table cards without making other legal-card highlights ambiguous.
- Include a nearby `10 = SPECIAL SWEEP CARD` reminder.

### Table-card progression, locked rule correction
Each player has four table columns/slots:
- one face-up card above;
- one face-down card beneath.

After the player's hand is exhausted:
1. Any legal face-up table card may be played.
2. When the face-up card from a **specific slot** is played, the face-down card under that slot becomes available on a later turn.
3. Other face-up cards do **not** have to be cleared first.
4. A face-down card cannot be played while its own face-up covering card remains.
5. Playing a face-down card is blind; resolve it according to Deck Sweep rules.

### Opponent readability
For every opponent, render the four table slots so the viewer can see:
- which face-up cards remain and their faces;
- which slots have cleared their face-up card;
- whether a face-down card remains under each slot;
- how many cards remain in the opponent's hand.

Never reveal the identities of face-down cards before they are legally turned/played.

### W.12 acceptance gate
With other face-up cards still present, clear one face-up slot and successfully play that slot's face-down card on a later turn. The same state is visually understandable for opponents.

======================================================================
6. PRAIRIE POTS — PROGRESSION + CHIP AWARD CLARITY
======================================================================

### Core goal
Prairie Pots must complete its playable sequence and make earned chip/pot progress unmistakable.

### Required scoring feedback
- Every pot award immediately transfers chips into the winning player's chip total.
- Public state exposes current chip totals.
- Public state exposes the most recent pot award: player, amount and pot(s) claimed.
- Board displays a clear current-status/win message such as `Player claimed 7 chips from the pots!`.
- Display current chip totals near/below the pot board.
- Claimed pots visibly change to claimed/empty state.
- Poker pot resolution remains visible at round start.
- Prairie Pot end-of-round settlement and carryover remain governed by existing locked rules.

### Progression safety
- At every sequence turn, the current player must either have a legal advertised action or the engine must advance according to the house sequence rules.
- A round may not silently stall with no actionable card and no explanation.
- `Continue` between rounds remains explicit and all-player synchronized.
- Final winner is determined by the locked Prairie Pots chip rule after configured rounds.

### W.12 acceptance gate
A test can force a known special pot card, play it, verify the pot empties, verify the player's chip total increases by the pot value, and verify the public/UI state reports the award.

======================================================================
7. CROSS-GAME PROFESSIONAL UX REQUIREMENTS
======================================================================

For every W.12 repair:
- legal action must be visible, not merely present in server JSON;
- critical public state belongs on the play surface or adjacent sidebar, not hidden behind debug/UI menus;
- mobile touch targets must remain comfortable and non-overlapping;
- player-private information stays private, while public table information is deliberately visible;
- server remains authoritative for legal moves; visual flipping/reordering cannot bypass rules;
- reconnect must reconstruct the same visible board state;
- do not regress W.8 HOW TO tutorial access;
- no W.12 correction may break W.11 Prop Hunt frame-pacing/recovery architecture.

======================================================================
8. W.12 DEFINITION OF DONE
======================================================================

A W.12 release candidate is not done until:
- Blackgammon can roll **and move** on phone using either board manipulation or the direct fallback;
- Prop Hunt mobile forward input actually moves forward relative to the camera and hunter hands/gun are visibly in front;
- Mexican Train shows every train + community train, supports rack flipping/reordering and keeps score off the board;
- Last Haven exposes the player's usable supply/survival hand;
- Deck Sweep sorts by rank, identifies 10s, supports per-slot face-down unlocking and shows opponent table-state without leaking hidden cards;
- Prairie Pots proves a pot award changes chips and communicates the award;
- automated regression suite passes;
- staging validator passes;
- the exact shipped ZIP passes archive integrity + cold-extraction regression checks;
- real-device visual/touch QA remains required for Prop Hunt and dense table layouts.

======================================================================
9. IMPLEMENTATION STATUS IN THIS W.12 RUNTIME
======================================================================

Implemented in code for this candidate:
- one-word Blackgammon name and direct legal-move fallback;
- modest Prop Hunt speed increase, corrected mobile joystick direction transform, forward weapon/hand placement;
- Mexican Train tile flip UI, retained rack rearrangement, all personal/community trains visible, score sheet moved to sidebar/below layout;
- Last Haven supply/survival hand dock;
- Deck Sweep rank-first sorting, 10 highlight, per-slot face-down unlock, all-player table stations;
- Prairie Pots chip totals, last-award state and explicit board progression/win feedback.

Still requires actual-device confirmation:
- Prop Hunt direction/weapon presentation under real touch/camera conditions;
- dense Mexican Train and Deck Sweep layouts at target phone sizes;
- Blackgammon overlapping-checker touch comfort in an actual full game.

======================================================================
10. W.11 + EARLIER CANON CONTINUES BELOW
======================================================================

Everything below remains active unless it conflicts with W.12 above.

# BLACK FAMILY GAME NIGHT
# MASTER GAME DESIGN + PRODUCTION DIRECTIVE W.11
## Professional flagship-stability implementation, mobile frame-pacing, Prop Hunt controller/camera/collision ownership, character fidelity and whole-app production standards

Planning/build date: 2026-08-27
Status: **HISTORICAL FOUNDATION CARRIED FORWARD UNDER W.18**
Runtime release: `GAME-NIGHT-STAGING-PHASE-W11-PROP-HUNT-SMOOTHNESS-STABILITY-35`
Design release: `GAME-NIGHT-DESIGN-PHASE-W11-PROP-HUNT-SMOOTHNESS-STABILITY-35`
Supersedes for current production decisions: W.10 where this W.11 section explicitly changes stability/runtime requirements
Preserves: approved family turnarounds, locked game rules, W.10 professional design framework, W.8 arcade/token systems, W.7 combat readability, W.6 gameplay corrections and all non-conflicting earlier work

======================================================================
0. W.11 EXECUTIVE PRODUCTION ORDER
======================================================================

This is now the canonical master prompt for Black Family Game Night.

The immediate flagship objective is **not additional Prop Hunt content**. It is to make the existing John + Papa's Shop slice feel stable, smooth and trustworthy on a real phone.

Use this precedence for current development:
1. Explicit current user instructions.
2. Approved character turnaround identity and locked family rules.
3. This W.11 master prompt and its dedicated W.11 stability directive.
4. W.10 professional design framework embedded below.
5. W.9 character/control quality requirements.
6. W.8/W.7/W.6 and other phase directives when non-conflicting.
7. Historical prototypes, obsolete assets and old generated references.

**Shipping rule:** a working feature is not a finished feature if ordinary play produces camera collapse, collision sticking, transform embedding, visible interpolation jitter, frame-time spikes, stale mobile input or browser-resume failure.

The W.11 runtime implementation and the remaining asset-dependent/future tasks are explicitly separated below so documentation never pretends that an authored LOD, baked-lighting or full prediction system exists before it is actually built and measured.

======================================================================
1. W.11 PROP HUNT SMOOTHNESS + STABILITY CANON
======================================================================

## 1. WHY THIS PHASE EXISTS

Prop Hunt is not allowed to grow through additional maps, characters, effects or feature count while the moment-to-moment 3D experience still feels unstable.

The current quality target is not merely "the feature works." The target is:

> **The feature works continuously, predictably and smoothly on a real phone without camera collapse, collision sticking, visible jitter, frame spikes, control loss or transform corruption.**

W.11 is therefore a systems-health phase. New content is intentionally secondary to controller, camera, collision, animation handoff, frame pacing, networking presentation and recovery.

### W.11 hard scope rule

Until the W.11 gate passes:
- do not add another Prop Hunt map;
- do not propagate unfinished John controller/rig behavior to the whole family;
- do not add expensive decorative clutter solely for visual density;
- do not add new particle-heavy combat effects;
- do not call an automated test pass proof of smoothness.

Papa's Shop + approved John remain the benchmark slice.

---

## 2. SOURCE-OF-TRUTH PRECEDENCE

For Prop Hunt stability work, use this order:

1. Current explicit user instruction.
2. Approved character turnarounds and `MASTER_APPROVED_FAMILY_CHARACTER_DIRECTIVE.md`.
3. Locked Prop Hunt gameplay rules.
4. This W.11 stability directive.
5. `MASTER_GAME_DESIGN_PRODUCTION_PROMPT_W11.md`.
6. W.10 professional design directive.
7. W.9 character/detail/control directive.
8. W.7 character/combat directive.
9. Older architecture notes and historical prototypes.

If an old requirement demands a visually elaborate technique that destabilizes mobile play, W.11 wins unless that old requirement is itself a locked game rule or approved identity requirement.

---

# PART I — SIMULATION OWNERSHIP

## 3. ONE AUTHORITATIVE PLAYER BODY

The player capsule/body is the source of truth for gameplay position.

Rules:
- physics/controller simulation owns `x/y/z`, grounded state and collision;
- the render rig follows the simulation state;
- animation does not independently drag the collision body through the world;
- uncontrolled root motion is prohibited;
- if a future authored animation uses root motion, it must be an explicit bounded state such as a validated mantle and must reconcile back to the authoritative capsule cleanly;
- camera code never directly moves the player except an explicit recovery command;
- visual recoil never modifies gameplay position;
- foot IK never modifies gameplay collision.

This ownership model prevents movement, animation, camera correction and collision correction from fighting each other.

## 4. FIXED GAMEPLAY TIMESTEP

Target simulation cadence: **60 Hz**, step `1/60 s`.

Requirements:
- render rate may vary independently;
- long browser frames are clamped before entering simulation;
- use a maximum catch-up step count so one stall cannot trigger a spiral of death;
- excess accumulated simulation time may be dropped and measured rather than executing dozens of delayed physics steps;
- background/resume must reset the accumulator;
- gameplay timing such as jump buffer, coyote time, collision and bot movement uses fixed-step time;
- presentation effects may use render delta time where appropriate.

Fallback philosophy: a phone that renders 35–45 FPS should still receive stable 60 Hz movement semantics rather than moving farther on slow frames.

## 5. RENDER INTERPOLATION

Maintain previous and current fixed-simulation transforms.

Render at:

`renderTransform = interpolate(previousSimulation, currentSimulation, alpha)`

Apply to:
- local character rig;
- host-simulated bots;
- body yaw;
- appropriate deterministic world movers.

Do not interpolate intentional teleports, round respawns or explicit stuck recovery across the entire map. Snap those safely and reset interpolation history.

---

# PART II — MOVEMENT + COLLISION

## 6. MOVEMENT RESPONSE

The controller should feel responsive but not twitchy.

Baseline targets:
- virtual-stick dead zone: approximately 8–12%;
- analog magnitude controls walking speed;
- acceleration is responsive rather than instant when useful for readability;
- braking is slightly stronger than acceleration so releasing the stick stops reliably;
- air control is useful but weaker than grounded steering;
- diagonal speed is normalized;
- sprint is an explicit semantic state, not simply an animation speed change;
- movement is camera-relative;
- actor facing is damped toward intended movement/aim direction rather than teleporting rotation.

## 7. SMALL STEPS, SLOPES AND WALL SLIDE

World collision should help the player traverse believable clutter rather than catch on it.

Requirements:
- small ledges use a stable step-up allowance;
- ordinary boards/thresholds below the chosen step height should not stop the player dead;
- slopes have a defined walkable maximum;
- horizontal blocked motion should attempt axis/slide resolution rather than converting every contact into a full stop;
- tiny decorative protrusions should normally be non-blocking;
- the authoritative collision shape is simpler than the visual mesh.

### Collision geometry rule

**Never use detailed visible art as the default gameplay collider.**

A visually complex workbench can use one or a few clean invisible boxes. A detailed tractor can use a small compound set of stable primitives. Decorative trim, cables, handles, leaves and tiny tools should not become character Velcro.

## 8. COLLISION LAYERS

Every world collider should be able to express distinct responsibilities.

Core conceptual layers:
- `Player`
- `WorldSolid`
- `Climbable`
- `PropSolid`
- `Decoration`
- `CameraBlocker`
- `ProjectileBlocker`
- `VisionBlocker`
- `Trigger`

At minimum, collider metadata must separately support:
- blocks player;
- blocks camera;
- blocks vision;
- solid/non-solid;
- walkable top;
- climbable.

Examples:
- window glass can block the player but optionally not block AI/visibility logic if required by the map rule;
- small decoration can be visible but block neither player nor camera;
- a wall blocks player, camera, vision and shots;
- a trigger blocks nothing.

## 9. JUMP FORGIVENESS

Family-game controls should prefer player intent over frame-perfect timing.

Baseline:
- coyote time: **100–140 ms**;
- jump buffer: **120–180 ms**;
- variable jump height by early release;
- ground reacquisition must be stable;
- landing should not double-trigger jump;
- jump should remain usable while moving and turning;
- phone multi-touch must allow move + look + jump concurrently.

## 10. VALIDATED MANTLE

Jump may initiate an automatic low/high mantle only if all checks pass:
- forward obstacle exists;
- obstacle top is in the allowed mantle range;
- landing surface exists;
- landing capsule fits;
- head clearance is valid;
- object is climbable or allowed by level rules;
- destination is inside play bounds.

Never start a mantle and discover halfway through that the character cannot fit.

During a mantle:
- controller owns a bounded mantle state;
- camera remains stable;
- animation may drive presentation but must finish at the validated capsule destination;
- failed validation leaves normal movement intact.

---

# PART III — CAMERA STABILITY

## 11. CAMERA AND PLAYER COLLISION ARE SEPARATE SYSTEMS

Camera collision must not use the player's capsule solution as a shortcut.

The camera solves a desired shoulder pose independently against camera-blocking geometry.

## 12. MULTI-SAMPLE / VOLUME CAMERA SOLVE

Do not rely on one thin ray.

The camera solver should sample a small camera volume using centre and offset rays/candidates around the desired view. It should:
- prioritize maintaining useful distance;
- try requested shoulder first;
- allow a neutral/alternate shoulder candidate when necessary;
- try a small set of safe pitch/lift candidates;
- ignore `solid:false` and `blocksCamera:false` geometry;
- never use leaves/tiny decorations as major camera blockers;
- preserve the shot/crosshair relationship.

## 13. CAMERA HYSTERESIS

When obstruction appears:
- retract promptly enough to avoid clipping.

When obstruction clears:
- do **not** immediately expand on one clear frame;
- require a short stable-clear interval;
- expand outward more slowly than the emergency retraction.

This prevents doorframes, rafters and clutter edges from pumping the camera in/out every other frame.

## 14. CAMERA COLLAPSE RECOVERY

If actual camera distance remains below the safe minimum for a sustained interval:
- recover pitch/shoulder/distance automatically;
- do not relocate the player unless the player body is actually invalid;
- retain manual `RESET VIEW` and keyboard `R`;
- record recovery in QA diagnostics.

Camera failure and player-body failure are different events and must not be conflated.

---

# PART IV — SAFE RECOVERY

## 15. LAST-KNOWN-SAFE POSITION

Periodically record a safe transform only when:
- coordinates are finite;
- player is grounded;
- capsule is inside bounds;
- capsule is not embedded in a blocking collider.

If the player becomes invalid:
1. attempt the last-known-safe position;
2. only then use a broader radial safe-position search;
3. zero bad velocity;
4. clear invalid mantle state;
5. snap render interpolation history to the recovered transform;
6. reset camera safely.

Do not run broad geometric recovery every render frame. Recovery is exceptional, not locomotion.

## 16. STUCK DETECTOR

Diagnose at least:
- non-finite transform;
- capsule embedded in solid geometry;
- player outside map bounds;
- player below/above playable vertical limits;
- sustained camera collapse;
- optional future detector: meaningful movement input with near-zero displacement for a sustained period while not intentionally locked.

A false positive that teleports a valid hiding player is worse than a short delay, so movement-input stuck detection must use conservative thresholds.

---

# PART V — SAFE PROP-HUNT TRANSFORMS

## 17. DISGUISE PLACEMENT

Before committing to a prop disguise:
- calculate target prop bounds;
- test capsule/prop footprint against blocking geometry;
- test nearby candidate positions when the exact point does not fit;
- require map bounds and ground support;
- reject unsafe transforms with a clear message;
- never consume the disguise change if the transform cannot safely occur;
- zero stale movement velocity after a successful transformation;
- reset simulation interpolation history for the size/position change.

## 18. DECOY PLACEMENT

Decoys are lightweight gameplay objects, not full players.

Before placement:
- find a nearby open position;
- do not spend a decoy if no valid position exists;
- server validates that a client-requested position is close to the sender's live position;
- decoy uses a simple hitbox and minimal network state;
- decoy does not need full player physics, foot IK or complete animation graphs.

## 19. PROP VISUAL ROTATION VS COLLISION

When practical, visual orientation changes should not rebuild expensive collision data every frame. Keep simple collision representation stable and update only the gameplay-relevant orientation required by the chosen prop.

---

# PART VI — FRAME-TIME + GPU STABILITY

## 20. FRAME-TIME TARGETS

Average FPS alone is insufficient.

Track frame time and especially tail latency.

Reference budgets:
- 60 FPS: ~16.7 ms/frame;
- 45 FPS: ~22.2 ms/frame;
- 30 FPS: ~33.3 ms/frame.

Acceptance targets:
- minimum supported phone: sustained play should not remain above 33.3 ms/frame;
- target phone: strive for p95 frame time around 22–25 ms or better;
- no repeated large spikes during ordinary shooting, disguise or camera movement;
- a stable 40–45 FPS is preferable to oscillating 60 → 25 → 55 → 22.

QA should expose:
- current/short-window FPS;
- p95 recent frame time;
- recent peak frame time;
- draw calls;
- triangles;
- quality tier;
- pixel ratio;
- simulation recovery count.

## 21. DYNAMIC QUALITY GOVERNOR

Quality should adapt before controls become choppy.

Degradation order:
1. reduce render pixel ratio incrementally;
2. reduce nonessential particles/effect budget;
3. reduce/disable expensive dynamic shadows;
4. use more aggressive environment/character LOD when authored LODs exist;
5. hide low-significance decorative detail at the lowest tier.

Recovery upward should be slower than emergency degradation so the renderer does not oscillate quality every few seconds.

Do not lower UI resolution or interaction hit-target quality.

## 22. EFFECT POOLING

Frequently repeated effects must be pooled/reused where practical:
- shot beams/tracers;
- muzzle/impact particles;
- rings;
- poof/transform particles;
- flash effects;
- damage indicators where applicable.

Rules:
- cap simultaneous effect count;
- recycle oldest/nonessential effects when budget is reached;
- use shared immutable geometry where possible;
- do not create unique cylinder/sphere/ring geometry for every shot;
- lower particle counts automatically on lower quality tiers.

## 23. JAVASCRIPT HOT-PATH ALLOCATION

Avoid transient allocations in the animation/render loop.

Reuse:
- `Vector3` scratch objects;
- raycasters;
- quaternions/matrices when possible;
- camera centre coordinates;
- hit-test buffers;
- common geometry and materials.

Do not optimize readability into oblivion, but repeated `new Vector3`, geometry creation or temporary arrays in per-frame/per-shot hot paths should be treated as measurable technical debt because garbage collection creates visible hitches on phones.

---

# PART VII — ART + RENDER COST

## 24. CHARACTER LOD TARGETS

When authored approved GLBs are actually created, target approximately:
- local close-camera LOD0: **8k–12k triangles** where needed for approved likeness;
- nearby player LOD1: **4k–6k**;
- distant LOD2: **1.5k–3k**.

These are budgets, not quotas. Fewer triangles are better if the approved silhouette is preserved.

This W.11 runtime does **not** claim those authored GLBs already exist.

## 25. CHARACTER MATERIAL BUDGET

Aim for approximately **1–3 material groups per character** through atlases/material reuse where practical.

Do not create separate draw calls for every eyebrow, belt part or shirt panel when a texture/material atlas can preserve the approved look.

## 26. STATIC ENVIRONMENT BATCHING / INSTANCING

Repeated Papa's Shop assets such as tires, barrels, fence boards, crates, lumber and repeated hardware should use instancing/batching when the authored scene pipeline reaches that pass.

This is an asset-stage requirement and must not be falsely marked implemented merely because the master prompt contains it.

## 27. SHADOW STRATEGY

Prefer:
- important dynamic shadow: local player, nearby players, essential moving gameplay objects;
- baked/fake/contact shadow solutions for static architecture and clutter where feasible;
- reduced shadow distance and resolution on lower quality tiers.

Do not spend the phone GPU rendering high-quality dynamic shadows for fifty static props.

## 28. VISIBILITY / SIGNIFICANCE

Cull or reduce detail for content that cannot meaningfully affect the current view.

Future authored Papa's Shop pass should consider:
- frustum culling;
- distance significance;
- room/zone visibility where safe;
- lower-detail distant clutter;
- pausing expensive animation outside significance range.

Never cull gameplay-critical objects in a way that changes hiding fairness.

---

# PART VIII — ANIMATION STABILITY

## 29. BLENDED LOCOMOTION

Use semantic states with blending:
- idle;
- walk;
- jog/run;
- sprint;
- strafe left/right;
- backward;
- jump/fall/land;
- mantle;
- hunter upper-body aim/recoil;
- hider transform/lock/reaction.

Avoid abrupt full-body clip swaps when a blend or upper/lower layer can preserve continuity.

## 30. FOOT SLIDING

Match locomotion playback speed to actual planar velocity within reasonable clamp limits.

A visually fast run animation on a slowly moving capsule is a bug even if collision is mathematically correct.

## 31. FOOT IK

Foot IK remains a presentation layer:
- ray/sample terrain beneath each foot;
- adjust foot contact and modest pelvis height;
- damp changes to avoid ankle/pelvis vibration;
- never drive gameplay collision through foot IK;
- reduce/disable expensive IK for distant LODs later.

---

# PART IX — NETWORK SMOOTHNESS

## 32. NETWORK UPDATE RATE

Do not send gameplay state every render frame.

Baseline target for movement snapshots: approximately **10–20 Hz**, adjusted only from measured need.

Send meaningful state such as:
- position;
- velocity;
- yaw;
- animation/role state;
- timestamp/sequence.

## 33. REMOTE INTERPOLATION

Remote characters should render from a short interpolation buffer rather than teleport between snapshots.

Baseline visual buffer: approximately **100–150 ms**, tuned through playtest.

Limited extrapolation may bridge very short gaps but must not continue indefinitely.

## 34. LOCAL RESPONSIVENESS + FUTURE RECONCILIATION

The local player must respond immediately to local input.

The current browser architecture already moves the local player locally and smooths remote snapshots. A future formal multiplayer-authority pass may add full server reconciliation/prediction sequencing, but **do not claim full prediction/reconciliation is implemented until the protocol actually carries the required authoritative sequence/timestamps and correction path.**

Small authoritative corrections should be blended when safe. Large invalid/security corrections may snap.

---

# PART X — BROWSER / PHONE LIFECYCLE

## 35. BACKGROUND / RESUME

When the browser/tab returns from background:
- clear held shoot/jump/movement state that may have become stale;
- reset fixed-step accumulator;
- reset last-frame timestamp;
- do not simulate the entire background duration;
- keep round/network state synchronized through the normal reconnect/state path.

## 36. WEBGL CONTEXT LOSS

Listen for `webglcontextlost` and `webglcontextrestored`.

On loss:
- prevent destructive default behavior where appropriate;
- stop trying to advance/render unstable GPU presentation;
- clear held input;
- record QA reason.

On restore:
- reset simulation accumulator/timing;
- resize/reinitialize view state needed by the renderer;
- reset camera safely;
- resume without launching or teleporting the player.

W.10's requirement to replace unpinned external core 3D dependencies with pinned/self-hosted production dependencies remains technical debt before a true release.

---

# PART XI — PAPA'S SHOP PERFORMANCE BENCHMARK

## 37. WHY PAPA'S SHOP IS THE BENCHMARK

Papa's Shop intentionally combines the most stressful shared systems:
- indoor + outdoor transitions;
- roof/camera obstruction;
- barn geometry;
- clutter;
- tractor/climbables;
- hideable props;
- shooting;
- decoys;
- transformations;
- family characters;
- close third-person camera.

If this map runs smoothly, the shared foundation is meaningfully proven.

## 38. REQUIRED BENCHMARK SCENARIO

On a real target phone, run at least one complete round while deliberately testing:
1. spawn and immediate camera movement;
2. sprint from yard into shop;
3. circle doorframes and tight shelving;
4. jump repeatedly over small thresholds;
5. mantle tractor/workbench-valid surfaces;
6. aim while moving and jumping;
7. fire repeatedly into close and distant surfaces;
8. press the muzzle against a wall and fire;
9. transform beside clutter;
10. attempt an invalid transform;
11. place all ten decoys across the round;
12. use all three disguise changes;
13. use flash;
14. rotate/lock as a prop;
15. enter/leave barn and covered spaces;
16. background the phone briefly and resume;
17. rotate phone if orientation changes are supported;
18. complete round end/rematch without stale controls.

Record frame-time spikes, recoveries and any point where player input feels ignored.

---

# PART XII — DEFINITION OF DONE

## 39. W.11 RUNTIME FOUNDATION — IMPLEMENTED IN THIS PHASE

The W.11 JavaScript/Three.js foundation now includes:
- fixed 60 Hz gameplay runner with bounded catch-up;
- simulation/render transform interpolation;
- camera obstruction hysteresis;
- separate collider flags for player/camera/vision responsibilities;
- last-known-safe player recovery;
- safe disguise placement validation;
- safe decoy placement with server proximity validation;
- dynamic quality tier with pixel-ratio/effect/shadow response;
- capped pooled gameplay effects using shared geometry;
- reduced hot-path vector/ray allocations;
- background/resume fixed-step reset;
- WebGL context-loss/restore handling;
- QA display for FPS, p95 frame time, peak frame time, draw calls, triangles, quality, pixel ratio and recoveries;
- existing substep movement, jump buffer/coyote time, variable jump, animation layers, foot IK, remote snapshot interpolation and controlled ~10 Hz movement sends preserved.

## 40. ASSET / NETWORK WORK STILL REQUIRED — DO NOT FALSELY CLAIM COMPLETE

These remain future work because they require authored assets, device profiling or a broader multiplayer protocol pass:
- approved authored family GLBs with actual LOD0/1/2 meshes;
- character texture/material atlasing down toward 1–3 material groups;
- Papa's Shop authored repeated-prop instancing/batching;
- baked/static lighting and final shadow bake pipeline;
- measured real-phone p95 frame-time approval;
- formal server-authoritative client prediction/reconciliation protocol beyond the current locally responsive + remote interpolation model;
- broad device matrix including target iPhone/Safari and Android/Chrome hardware;
- production self-hosting/pinning of core Three.js dependencies.

## 41. W.11 ACCEPTANCE GATE

W.11 is not visually approved until a real phone demonstrates:
- no camera collapse/top-down failure during benchmark route;
- no persistent player pinning/sticking on ordinary clutter;
- no backwards/stale control after browser resume;
- no visible fixed-step judder under normal frame variation;
- no disguise embedding;
- no decoy placement trapping player;
- shooting remains readable and aligned;
- p95 frame time remains within the selected target-device budget for sustained normal play;
- no repeated garbage-collection-like hitch when rapid firing/effects;
- Reset View works but is not routinely necessary.

### Final rule

> **Smoothness is a shipping feature. Stability is gameplay. If the player notices the engine fighting them, Prop Hunt is not done.**


======================================================================
W.10 PROFESSIONAL DESIGN FRAMEWORK — PRESERVED SUBORDINATE CANON
======================================================================

The complete W.10 design bible follows for all broader game-design, accessibility, production, family identity, mobile UX, round design, level design and QA rules that do not conflict with W.11. Within this embedded historical text, statements saying W.10 is "canonical" are superseded by the W.11 header above.

# BLACK FAMILY GAME NIGHT
# MASTER GAME DESIGN + PRODUCTION DIRECTIVE W.10
## Professional quality framework, flagship Prop Hunt plan, mobile-first controls, character fidelity, production gates and whole-app standards

Planning date: 2026-08-27
Status: HIGHEST-PRECEDENCE NEXT-BUILD DESIGN AND PRODUCTION PROMPT
Base runtime: Phase W.8 Arcade Tutorials + Tokens Store, including all locked W.7 Prop Hunt fixes
Supersedes for next-build planning: the append-only W.9 master prompt where any wording conflicts
Preserves: Project Constitution, approved character identity, locked game rules, existing multiplayer/reconnect, W.1-W.9 approved behavior unless this directive explicitly changes it

======================================================================
0. HOW TO USE THIS DOCUMENT
======================================================================

This is the canonical design and production instruction set for the next build of Black Family Game Night.

The project has accumulated many phase documents. Those documents remain valuable history and contain game-specific rules, but the development process must no longer rely on whichever old sentence is easiest to find. Use the following precedence order.

SOURCE-OF-TRUTH PRECEDENCE
1. Explicit instructions from the user in the current development conversation.
2. Approved visual references and `MASTER_APPROVED_FAMILY_CHARACTER_DIRECTIVE.md` for character identity.
3. Game-specific locked rule files for rules that are already finalized, such as Black Gammon or Prop Hunt round rules.
4. This W.10 Master Game Design + Production Directive.
5. Current phase-specific implementation directives that do not conflict with W.10.
6. Project Constitution.
7. Historical phase directives and reports.
8. Old placeholder art, obsolete GLBs, prototype screenshots and older generated character art.

If two sources conflict and the precedence is not obvious, do not guess. Preserve the current working behavior and document the conflict before changing it.

This directive is intentionally stricter about proof. A passing unit test is code proof. It is not proof that a character looks right, a camera feels good, a touch control is comfortable, or a level is fun.

======================================================================
1. PRODUCT NORTH STAR
======================================================================

Black Family Game Night should feel like a private, polished family game lodge that happens to contain many games, not a folder of browser prototypes.

The emotional target is:
- recognizable family identity;
- quick laughter and low-friction joining;
- games that are understandable within seconds;
- enough depth to replay with family;
- strong phone usability;
- tactile, physical-looking cards, boards, props and characters;
- personal details that feel affectionate and specific without becoming clutter;
- visual quality that is simple, cohesive and deliberate rather than technically elaborate but visually weak.

The player should be able to hand the phone to a family member who has not followed development and have that person understand what to do.

The most important quality rule is:

> PLAYER EXPERIENCE OUTRANKS FEATURE COUNT.

Do not add ten unfinished systems when one polished system would materially improve the game.

======================================================================
2. PRIMARY PLAYER GROUPS AND PLAY CONTEXTS
======================================================================

Design for a mixed family audience rather than a single expert-gamer persona.

Primary contexts:
- adults who play games regularly;
- adults who rarely play games;
- teenagers and children;
- players using a phone on a couch, at a table or at a family gathering;
- players joining from a link with little setup time;
- players returning after days or weeks and needing quick reorientation;
- players who prefer touch, mouse/keyboard or a connected gamepad.

Therefore:
- core controls must be readable without memorizing combinations;
- important state must be visible, not remembered;
- tutorials must be replayable and skippable;
- mistakes should usually be recoverable;
- controls should support sensitivity, inversion and comfort options;
- social play should not punish a less experienced family member with inaccessible mechanics.

======================================================================
3. EXPERIENCE PILLARS
======================================================================

Every major design decision should strengthen at least one of these pillars and should not seriously damage another.

PILLAR A - FAMILY RECOGNITION
Characters, jokes, locations and objects should feel specific to this family. Approved character identity is sacred.

PILLAR B - IMMEDIATE PLAYABILITY
A player should know what to do, what matters and what happened. Controls respond immediately and feedback is unambiguous.

PILLAR C - PHYSICAL GAME-NIGHT READABILITY
Cards, dominoes, boards, marbles, props, weapons and interactables should have believable depth, placement and hierarchy. Decorative framing must never hide the game surface.

PILLAR D - MOBILE-FIRST COMFORT
Phone is a first-class platform. A control scheme that only feels good with a mouse is not finished.

PILLAR E - SOCIAL REPLAYABILITY
Games should create stories, rematches, rivalries and funny moments. Persistence, tokens and achievements support replay but never grant unfair gameplay power.

PILLAR F - POLISH BEFORE EXPANSION
The project should establish a proven quality slice before copying a system across more characters, maps or games.

======================================================================
4. QUALITY PRIORITY LADDER
======================================================================

When tradeoffs are necessary, use this order:
1. Game launches and completes its primary loop.
2. Player can control the game reliably.
3. Camera and visibility remain stable.
4. Rules are correct.
5. Multiplayer state is fair and synchronized.
6. Character and object identity is correct.
7. Gameplay feedback is clear.
8. Performance is stable on phones.
9. Art, animation, audio and effects are polished.
10. Extra content and decorative features are added.

Never sacrifice items 1-8 to add item 10.

======================================================================
5. BUILD STRATEGY: VERTICAL SLICE FIRST
======================================================================

Family Prop Hunt remains the flagship 3D benchmark.

The next 3D production sequence is:
1. Perfect one approved John hunter in Papa's Shop.
2. Prove movement, camera, hands, weapon, shooting and impacts on a real phone.
3. Prove John as a hider, including transformation, decoy, flash, lock, jump and mantle.
4. Prove one full five-minute round with real multiplayer or representative bots.
5. Only after that gate passes, propagate the proven shared system to Kristen, Holly, Vanessa, Lizzy, Logan, James and Dorothy.
6. Finish Papa, Nana, Kelsi, Molly and Gunner turnarounds before treating their new 3D models as approved.
7. Expand to the other Prop Hunt maps only after Papa's Shop is stable.
8. Propagate the proven 3D framework to Island Life and Birthday Seat afterward.

Do not build all characters simultaneously and hope they converge later.

======================================================================
6. DEVELOPMENT WORKFLOW FOR EVERY PHASE
======================================================================

Before editing code:
1. Extract the latest known-good ZIP into a fresh working directory.
2. Read the Constitution, this W.10 directive, the relevant game-specific rule document and all directly affected locked addenda.
3. Identify current behavior in code before replacing it.
4. Write a short implementation plan separating rule changes, UX changes, art changes and technical changes.
5. Protect unrelated games from refactors unless shared infrastructure genuinely requires a change.

During implementation:
- make one system change at a time where possible;
- keep feature flags or clean fallbacks for risky 3D replacements;
- do not delete a known-good fallback until the replacement passes its visual gate;
- avoid fake files, fake GLBs, fake manifests and placeholder claims of completion;
- instrument high-risk systems so camera recovery, stuck recovery and transform failures can be diagnosed.

Before release:
- run syntax/unit/regression tests;
- run build/static-path validation;
- verify routes;
- verify asset manifests;
- verify ZIP integrity;
- extract the exact finished ZIP into a clean directory and rerun tests there;
- record what was actually visually inspected;
- never label a build phone-verified unless it was actually tested on a phone.

======================================================================
7. WHOLE-APP UX STANDARD
======================================================================

Across the app:
- the primary play surface should dominate the screen;
- decorative chrome should be secondary;
- important actions should use consistent wording;
- every game should expose How to Play or How To from inside the game;
- tutorial state is per player and replayable;
- current objective, turn, role or round state should remain glanceable;
- destructive actions require confirmation only when accidental activation would cause meaningful loss;
- routine gameplay actions should not be slowed by confirmation dialogs;
- results screens should be skippable after the first meaningful presentation;
- loading states should explain what is happening rather than leaving a frozen screen.

Use progressive disclosure. Show the player what is needed now, and keep advanced information one tap away.

======================================================================
8. INPUT AND ACCESSIBILITY STANDARD
======================================================================

Controls must be action-based rather than tightly tied to one physical key.

Required settings where technically practical:
- look sensitivity;
- separate horizontal and vertical sensitivity if useful;
- invert X;
- invert Y;
- sprint hold/toggle/auto option where applicable;
- aim assist Off / Light / Standard for touch and gamepad where applicable;
- camera shake Off / Low / Standard;
- haptic vibration Off / Low / Standard when supported;
- reduced motion option for strong camera/effect motion;
- readable UI scale where practical;
- left-handed touch layout preset;
- large-button touch layout preset;
- remappable desktop/gamepad actions when the architecture supports it.

Do not require simultaneous multi-button chords for core family gameplay.
Do not require repeated rapid tapping when a hold or toggle can serve the same purpose.
Do not make a critical cue audio-only or color-only. Pair important state with shape/text/icon/audio where appropriate.

Touch controls:
- target approximately 44 pt minimum comfortable iOS controls and 48 dp Android-equivalent hit areas for important actions;
- use extra invisible padding when visual buttons must look smaller;
- separate adjacent high-risk controls enough to avoid accidental taps;
- respect safe areas, rounded corners and camera cutouts;
- preserve simultaneous move + look + action multi-touch.

======================================================================
9. PERFORMANCE AND WEBGL STANDARD
======================================================================

The game runs in a browser. Design to mobile WebGL realities, not desktop assumptions.

Frame-rate goals:
- preferred target: stable 60 fps on a representative modern phone for active gameplay;
- acceptable fallback floor: stable 30 fps on lower-power supported phones;
- no repeated large frame spikes during shooting, transformation, weather, map randomization or character spawn;
- measure frame-time percentiles, not only average fps.

Rendering principles:
- batch repeated props;
- instance repeated environment objects where practical;
- atlas materials where it reduces draw calls without damaging identity;
- use mipmaps for 3D textures;
- prefer GPU-compressed textures such as KTX2/Basis where supported by the existing pipeline;
- set a per-device/per-pixel memory budget rather than assuming desktop VRAM;
- reduce render resolution dynamically before destroying gameplay assets if a device is fill-rate bound;
- avoid blocking WebGL readbacks in active play;
- pool tracers, impact effects and frequently spawned temporary objects;
- cap particle counts;
- limit real-time shadow casters by significance;
- throttle animation and ambient-life updates by distance/significance;
- cull hidden zones aggressively while avoiding visible pop-in;
- recover gracefully from WebGL context loss where practical.

Initial mobile budget targets for Prop Hunt should be treated as tuning targets, not excuses to break visual quality:
- hero family character LOD0: approximately 8k-12k triangles;
- LOD1: approximately 4k-6k;
- LOD2: approximately 1.5k-2.5k;
- no more than four significant skin weights per vertex unless a visible deformation problem requires otherwise;
- keep material slots low and deliberate;
- use 1024 atlases by default, with 2048 reserved for hero/close-view needs that visibly justify the cost;
- prefer one shared humanoid skeleton and animation library.

======================================================================
10. VISUAL IDENTITY STANDARD
======================================================================

The art direction is not photorealism and not blocky placeholder art.

Target:
- warm, dimensional, tactile cartoon 3D;
- soft stylized PBR materials;
- readable silhouettes;
- believable object thickness;
- strong contact shadows;
- restrained surface detail;
- family likeness through shape, color and signature features rather than realism for its own sake.

For family characters, the approved turnaround controls identity. A more detailed model that looks less like the approved person is a failed model.

For props and environments, prioritize:
1. silhouette;
2. proportion;
3. material separation;
4. contact with the ground/world;
5. useful gameplay readability;
6. secondary detail.

Do not spend geometry on invisible seams while hands, faces, doors or weapons still look wrong.

======================================================================
11. AUDIO AND HAPTIC STANDARD
======================================================================

Audio is gameplay information and personality, not background decoration.

Use layers:
- UI confirmation;
- movement/footstep material response;
- weapon fire and impact;
- hider transform/decoy/flash;
- environment ambience;
- short family reactions;
- round transition cues.

Important events should have both visual and audio feedback.
Haptic feedback may reinforce shooting, damage or important UI actions, but must never be the only signal and must be adjustable/off.

Avoid constant loud stingers. Preserve dynamic range so meaningful events stand out.

======================================================================
12. ONBOARDING AND TUTORIAL DESIGN
======================================================================

Tutorials should teach by doing, not by presenting a wall of instructions.

Use a Prime -> Teach -> Observe pattern:
- Prime: show the immediate goal and one control.
- Teach: let the player perform that action safely.
- Observe: confirm success, then introduce the next mechanic.

For Prop Hunt, tutorial content must be role-specific.

Hunter tutorial sequence:
1. move;
2. look;
3. jump/mantle;
4. follow the crosshair;
5. shoot a harmless training prop;
6. see tracer and impact;
7. understand that hiders can look like props;
8. understand no ammo penalty exists.

Hider tutorial sequence:
1. move/look;
2. choose one assigned prop;
3. transform;
4. lock/unlock;
5. place a decoy;
6. use flash;
7. jump/mantle while disguised;
8. explain the three-change and ten-decoy limits.

Tutorials must be skippable and replayable from How To.
Do not force veteran players through tutorials every match.

======================================================================
13. SOCIAL AND MULTIPLAYER STANDARD
======================================================================

Preserve the private-room foundation:
- invite-link join;
- seat/player selection;
- Ready state;
- host control;
- reconnect;
- bots;
- chat/reactions;
- persistent profile/history systems already in the app.

Network architecture principle:
- local camera and local input response are immediate;
- authoritative room state decides roles, phase, health, eliminations, remaining resources and valid hits;
- remote characters interpolate rather than teleport between snapshots;
- remote animation is driven by replicated state/velocity/aim, not raw remote key presses;
- hidden hider information is not sent to hunters during the hide phase;
- disguise/decoy randomization uses an authoritative seed where all clients must agree;
- reconnect restores the player to a legal role/state without duplicating resources.

======================================================================
14. PROGRESSION AND COSMETICS
======================================================================

Arcade Tokens remain earned-only. No real-money purchase flow.

Cosmetics are identity-safe overlays:
- Hat -> HeadTop socket;
- Glasses -> Face socket;
- Accessory -> ChestAccessory socket.

Cosmetics may not change:
- skin tone;
- hair identity;
- face identity;
- approved body proportions;
- base outfit identity;
- dog coat markings.

Do not introduce power progression into Prop Hunt, board games or arcade games through cosmetics/tokens.

======================================================================
15. GAME-CATEGORY DESIGN STANDARDS
======================================================================

CARD GAMES
- cards are always readable;
- current hand is fully reachable on phone;
- hands larger than the comfortable width use horizontal swipe/scroll rather than microscopic cards;
- draw/discard/played zones have strong hierarchy;
- turn and legal-action feedback is explicit;
- preserve exact family rules.

BOARD/TABLETOP GAMES
- game board/table is the hero, not the decorative room;
- all pieces relevant to a decision remain visible or intentionally scrollable;
- physical depth supports comprehension;
- players can inspect/rearrange personal racks where the real game allows it;
- camera should never make the player fight perspective to understand state.

ARCADE GAMES
- start quickly;
- How To is available inside every game;
- first-time tutorial is opt-in/skip and remembered per player;
- feedback is immediate;
- level progression communicates success clearly;
- each game has a distinct visible identity.

3D FAMILY GAMES
- shared camera/input/character systems are proven in Prop Hunt first;
- do not copy an unstable camera or character rig into other 3D games.

======================================================================
16. FLAGSHIP MODE: FAMILY PROP HUNT VISION
======================================================================

Family Prop Hunt should feel like a polished third-person hide-and-seek action game where the comedy comes from family characters, ridiculous disguises, near misses and map knowledge.

Desired emotional arc of a round:
1. anticipation during role reveal;
2. frantic creativity during hiding;
3. tense searching after HUNT;
4. readable chase or escape;
5. funny reveal/elimination;
6. quick family recap and rematch momentum.

The mode should reward:
- map knowledge;
- clever disguise choice;
- believable placement;
- movement skill;
- hunter observation;
- chase execution;
- decoy timing;
- flash timing.

It should not reward:
- camera exploits;
- hiding inside collision;
- invisible/undersized props;
- network desync;
- unreadable effects;
- guessing based on rendering bugs.

======================================================================
17. PROP HUNT LOCKED MATCH RULES
======================================================================

Preserve the established core rules unless the user explicitly changes them.

Match:
- default 6 rounds;
- Papa's Shop supports up to 12 players;
- Classic and Family Chaos modes remain separate.

Hide phase:
- default 30 seconds;
- hunters see a black screen and countdown;
- hunters cannot move, look, shoot or receive useful positional hider information;
- hiders may move, jump, climb, disguise and place decoys.

Hunt phase:
- default 5 minutes;
- synchronized 3-2-1 -> HUNT transition;
- hunter controls unlock immediately and reliably.

Hiders:
- curated map disguise pool around 30 types for Papa's Shop;
- exactly 4 assigned disguise choices for the round;
- no reroll;
- initial disguise plus up to 3 later disguise changes;
- health carries across disguise changes;
- each disguise refreshes one flash grenade;
- exactly 10 decoys total per hider per round;
- hiders can move, run, jump and climb reasonable surfaces while disguised;
- lock/unlock remains available to stabilize prop position/orientation.

Hunters:
- unlimited ammo;
- no penalty for shooting innocent environment props;
- no separate Aim button;
- permanent crosshair aiming during active hunt;
- tap Shoot fires once;
- hold Shoot uses a tuned controlled rapid-fire rate;
- hunter can move, turn, strafe, jump and shoot together;
- no mid-round combat power upgrades.

Health/elimination:
- standard hider target remains approximately three hits;
- disguise prop breaks visibly on elimination;
- short `That's a sin.` original comedic elimination cue remains;
- Classic: eliminated hider becomes spectator/ghost;
- Family Chaos: caught hider joins hunters.

======================================================================
18. PROP HUNT ROUND STATE MACHINE
======================================================================

Use an explicit state machine. Do not let UI and gameplay infer phase independently.

Recommended states:
LOBBY
ROLE_REVEAL
HIDE_COUNTDOWN
HUNT_RELEASE
HUNT
ROUND_RESOLVE
ROUND_MVP
MATCH_RESOLVE

Every state defines:
- allowed movement;
- allowed camera;
- allowed actions;
- visible HUD;
- allowed network data;
- audio cues;
- transition timeout;
- reconnect behavior.

A phase transition must be idempotent. Repeated network messages cannot grant extra decoys, refresh flash twice or duplicate eliminations.

======================================================================
19. PROP HUNT HUD INFORMATION HIERARCHY
======================================================================

The active viewport is the priority.

Always-visible during hunt:
- role;
- round/time remaining;
- health where relevant;
- small crosshair for hunters;
- role-specific resources only.

Hunter HUD:
- health/status if applicable;
- crosshair;
- Shoot;
- Jump;
- Sprint/toggle state;
- shoulder swap;
- Reset View;
- compact alive-hiders count if already part of the design.

Hider HUD:
- health;
- current disguise;
- disguise changes remaining;
- flash ready/not ready;
- decoys remaining out of 10;
- lock/unlock state;
- Prop / Flash / Decoy / Lock / Jump / Sprint;
- Reset View.

Do not show hider-only controls to hunters or hunter-only shooting controls to hiders.

======================================================================
20. PROP HUNT LEVEL-DESIGN PRINCIPLES
======================================================================

Papa's Shop remains the first map benchmark.

The map should be large enough for up to 12 players and roughly eight times the original prototype's meaningful traversable area.

Core zones remain:
- main shop;
- barn;
- animal pens;
- equipment yard;
- lumber/material storage;
- outdoor apron/grass/property circulation.

Design rules:
- primary circulation uses loops, not funnels;
- major zones aim for roughly three meaningful entrances/exits where practical;
- every large zone includes at least one fast chase route, one slower concealment route and one useful vertical/climb opportunity where theme permits;
- intentional dead-end hiding spots are rare and clearly high-risk;
- no accidental dead ends from collision clutter;
- large props need camera recovery space around them;
- landmarks remain stable across randomization;
- secondary clutter can vary by round without destroying navigation.

Use blockout first. Do not add final art until the greybox proves:
- traversal;
- sightlines;
- hiding density;
- camera clearance;
- spawn safety;
- round pacing.

======================================================================
21. LANDMARKS, GUIDANCE AND READABILITY
======================================================================

Players should build a mental map quickly without needing constant arrows.

Use:
- distinct silhouettes;
- lighting contrast;
- color/material accents;
- unique sounds;
- large recognizable props;
- visible exterior orientation;
- different floor/ground materials by zone.

Papa's yellow tattered chair by the fireplace remains a permanent shop landmark.
Barn, tractor/equipment yard and pen zones should also read as unmistakable anchors.

Avoid visual noise where hunters need to parse props. Clutter should create hiding opportunities, not make every square meter equally chaotic.

======================================================================
22. PROP ECOLOGY AND HIDING QUALITY
======================================================================

A good Prop Hunt map needs believable prop grammar.

Environment props should be arranged with enough consistency that a hider can imitate the world, but enough variation that hunters must observe rather than memorize one exact layout.

Each major zone should include a healthy mix of:
- small props;
- medium props;
- large/risky props;
- props near walls;
- props in clusters;
- props on surfaces;
- some open/exposed props;
- some vertical/climb-related props.

Disguise choices must use gameplay colliders that are fair and stable even if decorative mesh shapes are irregular.

No disguise may:
- fit into gaps smaller than the visible prop suggests;
- clip mostly inside a wall/floor;
- hide its hit volume far away from its visible mesh;
- create a camera pocket that reveals outside geometry;
- become effectively invisible due to scale/lighting.

======================================================================
23. HIDING-PHASE DESIGN
======================================================================

The 30-second hide phase must feel urgent but understandable.

At phase start:
- show the four assigned disguise options clearly;
- show Prop / Decoy / Flash / Lock controls;
- do not cover the screen with a tutorial if the player already skipped/finished it;
- give immediate movement control to hiders;
- hunters remain fully blind and input-locked.

Hider preparation flow:
1. pick an initial prop;
2. move to a plausible area;
3. orient/lock if desired;
4. place decoys deliberately;
5. optionally keep an escape route for the hunt.

If the player is still undisguised near release, provide a clear warning, but do not auto-invent a prop unless an existing rule explicitly supports it.

======================================================================
24. HUNTER SEARCH DESIGN
======================================================================

Hunter play should be about observation plus movement, not simply sweeping the mouse while holding fire.

Support this through design rather than ammo penalties:
- strong prop silhouettes;
- readable tracer/impact so shots feel deliberate;
- map routes that require turning and checking angles;
- vertical hiding possibilities;
- decoys that create uncertainty;
- movement/chase opportunities after a hider is discovered.

Do not add enemy outlines, wall hacks or automatic target reveal.

Aim assist may help input precision, but it may never identify a hidden player that the player has not visually found.

======================================================================
25. MOVEMENT FEEL
======================================================================

Movement is a flagship quality system.

Principles:
- immediate response to directional input;
- acceleration gives body weight without delaying control;
- braking is responsive enough for precise hiding/doorways;
- diagonal input is normalized;
- camera-relative movement is consistent;
- character does not rotate unpredictably when camera crosses behind;
- wall contact slides rather than sticks;
- small steps do not snag;
- slope handling is predictable;
- jump input uses buffering and coyote time;
- landing returns control quickly;
- mantle is validated and never teleports through ceilings/walls.

Initial tuning direction:
- joystick dead zone around 8-12 percent;
- walking available through partial analog input;
- normal run as the primary full-stick speed;
- sprint roughly 20-35 percent faster than run, tuned by actual map scale;
- jump buffer approximately 120-180 ms;
- coyote time approximately 100-140 ms;
- maintain useful but limited air steering;
- no animation may delay the first visible response to movement input.

Use measured tuning rather than copying arbitrary values from another game.

======================================================================
26. MANTLE AND CLIMB SYSTEM
======================================================================

Jump should also attempt a safe mantle when the player is moving toward a valid ledge.

A mantle candidate must validate:
- forward obstruction;
- reachable top height;
- walkable top surface;
- head/character clearance;
- destination collision;
- camera clearance where possible;
- climbable surface rules.

Use at least low and high mantle categories if the animation set supports them.

Failure behavior:
- if mantle is invalid, perform a normal jump or remain grounded as appropriate;
- never freeze input;
- never place the player inside geometry;
- never allow climbing through roofs or closed walls.

Papa's Shop benchmark surfaces include:
- tractor;
- reasonable workbench edges;
- hay/storage routes;
- selected lumber/pallet stacks;
- pen/fence sections intended as traversal;
- barn loft access.

======================================================================
27. THIRD-PERSON CAMERA SYSTEM
======================================================================

Camera quality is a release blocker.

General camera requirements:
- camera follows a solved target point rather than raw origin transforms;
- first frame, respawn and teleport snap to a valid solved view before easing;
- camera collision uses multiple candidates rather than one fragile ray;
- decorative `solid:false` geometry does not block the camera;
- camera tries shoulder/lift/pitch alternatives before collapsing distance;
- sustained collapse triggers automatic recovery;
- Reset View remains available;
- camera cannot become stuck top-down, under roofs, inside the character or inside a prop.

Default hunter framing:
- close right-shoulder view;
- character occupies roughly the left third rather than screen center;
- weapon and hands remain visible;
- crosshair area remains clear;
- shoulder swap available;
- camera may pull slightly back when sprinting or in tight combat if it improves readability.

Hider framing:
- slightly wider situational view;
- camera pivot and near/far distance recalculate from disguise bounds;
- prop transformation cannot inherit an invalid humanoid camera pocket;
- very small props must not put the camera on the floor;
- very large props must not push the camera through walls.

Camera settings:
- default vertical FOV around 58-65 degrees as a starting point, then tune on real target devices;
- allow a reasonable FOV range if the settings architecture supports it;
- separate look sensitivity from FOV;
- reduce camera shake independently from recoil/feedback.

======================================================================
28. HUNTER AIM AND WEAPON SYSTEM
======================================================================

The prop-zapper must be visible, readable and mechanically aligned with the crosshair.

Shot pipeline:
1. screen-center crosshair defines intended camera ray;
2. camera ray resolves intended world point;
3. character upper body and weapon aim toward that point;
4. physical weapon muzzle checks for a blocking wall/object between muzzle and target point;
5. authoritative hit validation uses the final legal shot;
6. muzzle flash, beam/tracer and impact render along that same shot result;
7. hit marker/audio only confirm actual hider damage.

No parallax lie is acceptable where the crosshair, beam and damage disagree.

Weapon presentation:
- right hand = trigger hand;
- left hand = support hand using IK or equivalent constraint;
- weapon cannot float;
- wrist/palm directions are anatomically correct;
- no backwards hands;
- weapon stays visible while walking, strafing and ordinary jumping;
- sprint may lower the weapon slightly but must transition back quickly;
- no conventional reload is required because ammo is unlimited;
- a brief zapper recharge/cooldown visual may communicate controlled fire rate without pretending ammo is limited.

Feedback per shot:
- muzzle flash;
- visible fast beam/tracer;
- impact effect at actual collision point;
- restrained recoil;
- audio;
- optional haptic pulse;
- material-aware impact variation where practical.

Hider hit feedback:
- stronger hit marker;
- short target shake/react;
- distinct audio cue;
- health update;
- no identity reveal until elimination.

======================================================================
29. MOBILE HUNTER CONTROLS
======================================================================

Default layout:
LEFT SIDE
- movement joystick;
- sprint integrated as joystick threshold or separate reachable button depending playtest preference.

RIGHT SIDE
- open drag zone for camera look;
- large Shoot button;
- large Jump/Mantle button;
- smaller shoulder-swap button;
- Reset View accessible but separated from combat actions.

No Aim button.

Requirements:
- player can move + look + shoot at the same time;
- player can move + look + jump at the same time;
- Shoot does not steal the pointer used for camera look;
- camera drag does not begin when the player intended to press Shoot;
- actions use large hit boxes even if art is visually compact;
- UI respects safe areas;
- landscape and portrait policies are explicit rather than accidental.

Default target is landscape for full 3D Prop Hunt unless a later phone test proves portrait genuinely superior.

======================================================================
30. MOBILE HIDER CONTROLS
======================================================================

Default layout keeps movement and camera consistent with hunter controls so role switching does not force relearning.

Role-specific right-side actions:
- Jump/Mantle;
- Prop;
- Flash;
- Decoy;
- Lock/Unlock;
- Sprint where used;
- Reset View.

Resource count appears on or immediately adjacent to the action:
- Prop: changes remaining;
- Decoy: remaining/10;
- Flash: Ready or spent;
- Lock: Locked/Free state.

Avoid stacking six identical round buttons in one cluster. Use visual hierarchy and thumb reach.

Provide at least:
- Default layout;
- Large Buttons layout;
- Left-Handed mirrored layout.

A future custom drag-to-position editor is optional, not required before core controls feel excellent.

======================================================================
31. DESKTOP AND GAMEPAD CONTROLS
======================================================================

DESKTOP DEFAULT
- WASD: movement;
- mouse: look;
- Left Mouse: Shoot for hunter;
- Space: Jump/Mantle;
- Shift: Sprint;
- C: shoulder swap;
- R: Reset View;
- hider role actions use clear remappable keys, preserving existing E/F/Q/L choices where practical unless usability testing supports a cleaner map.

Do not require Right Mouse Aim.

GAMEPAD DEFAULT
- left stick: movement;
- right stick: look;
- right trigger: Shoot hunter;
- south face button: Jump/Mantle;
- left stick click or a comfortable shoulder/face action: Sprint, with toggle option;
- shoulder action: camera shoulder swap;
- hider abilities use available face/shoulder buttons and always show correct glyphs where the web platform exposes mapping data.

Provide dead-zone and sensitivity settings.

======================================================================
32. HIDER TRANSFORMATION SYSTEM
======================================================================

Transformation must be reliable before it is pretty.

On prop change:
1. validate requested prop is one of the player's assigned legal options;
2. validate remaining change count;
3. choose a safe placement/collider solution;
4. update gameplay collider separately from decorative mesh if needed;
5. preserve world-facing direction unless the prop needs a safe snapped orientation;
6. recalculate camera target/clearance;
7. refresh flash per locked rules;
8. continue health unchanged;
9. show a short transformation effect;
10. return full movement control immediately.

If placement is invalid:
- show a clear invalid-placement response;
- search a small nearby safe placement only if it does not move the player unfairly;
- otherwise cancel without consuming the disguise change.

Never consume a limited resource because of a collision-system failure.

======================================================================
33. PROP LOCKING
======================================================================

Locking communicates `I am pretending to be part of the environment`.

Locked state should:
- stabilize visual orientation/position;
- make subtle movement/bob stop;
- keep collision valid;
- preserve camera control;
- be obvious in HUD;
- never trap the player.

Unlock should be immediate.
If movement while locked is not allowed by current implementation, movement input should clearly unlock or be rejected with readable feedback according to the established rule. Do not leave the player wondering why the joystick stopped working.

======================================================================
34. DECOY SYSTEM
======================================================================

Decoy placement should feel deliberate.

Requirements:
- preview legal/illegal placement where practical;
- place near/in front of the player rather than at an ambiguous hidden origin;
- validate support and collision;
- avoid walls and required routes;
- use a small placement effect/audio cue;
- decrement exactly one from the hider's ten total decoys;
- authoritative multiplayer state prevents duplicates;
- decoys visually match the relevant prop type enough to create mind games;
- decoys do not create collision traps.

======================================================================
35. FLASH SYSTEM
======================================================================

Each disguise grants one flash use.

Flash feedback:
- short world-space burst;
- clear activation sound;
- affected hunter receives a brief readable flash effect;
- reduced-motion/accessibility setting can reduce intensity;
- effect never becomes a long full-white screen;
- no photosensitive strobing;
- exact availability is visible to the hider.

======================================================================
36. CHARACTER IDENTITY PIPELINE
======================================================================

Approved turnaround images are the character source of truth.

Production workflow for each character:
1. approved five-view turnaround;
2. orthographic modeling reference extraction;
3. silhouette/proportion blockout;
4. front/side/back comparison render;
5. head/face/hair pass;
6. clothing/footwear pass;
7. shared-rig skinning;
8. neutral animation deformation test;
9. Prop Hunt weapon/aim test;
10. phone LOD/material test;
11. five-view final comparison;
12. only then set `approvedModel: true`.

Use silhouette overlays or side-by-side proof rather than judging from memory.

======================================================================
37. CHARACTER MODEL QUALITY STANDARD
======================================================================

Human LOD0 target for Prop Hunt close camera: approximately 8k-12k triangles.

Spend that detail on:
- face planes and rounded cheeks/jaw;
- eyelids/eye seating;
- nose and mouth volume;
- hair silhouette/clumps;
- hands/thumbs;
- collar/hood/apron/skirt/belt/boot volume;
- clean shoulder/elbow/knee deformation.

Do not spend it on:
- individual hair strands;
- tiny seams;
- hidden geometry;
- micro-wrinkles;
- photoreal pores.

Face standard:
- eyeballs sit inside the head, not on the surface;
- eyelids follow the eyeballs;
- nose has side/profile volume;
- mouth has volume and can smile/frown subtly;
- glasses anchor to nose/ears;
- beard/moustache follows facial planes;
- ears are placed consistently from front/side views.

Hair standard:
- main skull mass plus secondary clumps;
- preserve exact approved silhouette;
- curls/waves read as grouped forms;
- no helmet blob;
- no expensive strand simulation.

======================================================================
38. APPROVED CHARACTER PRODUCTION CARDS
======================================================================

The images still outrank text. These notes clarify what must read during gameplay.

JOHN BLACK
- sturdy/stocky approved cartoon build;
- short brown side-swept hair;
- full short brown beard;
- red/black plaid shirt;
- blue jeans;
- brown belt/work boots;
- hunter stance solid/confident;
- beard and plaid must remain readable at normal camera distance.

KRISTEN
- approved adult female proportions;
- shoulder-length wavy blonde hair;
- black fitted short-sleeve top;
- blue jeans;
- brown belt/boots;
- keep silhouette simple and recognizable.

HOLLY
- child proportions;
- bright blonde double buns;
- approved cream padded sweater/vest look;
- blue backpack/straps;
- blue pants;
- brown shoes;
- youthful rounded face and smaller body scale.

VANESSA
- long voluminous golden-blonde curls;
- burgundy/dark-red long-sleeve top;
- blue jeans;
- brown belt/boots;
- confident posture;
- curls are the dominant silhouette feature.

ELIZABETH / LIZZIE
- child proportions;
- bright blonde high ponytail;
- large pink bow;
- pink hoodie/top;
- pink skirt with white polka dots;
- white socks;
- pink Croc-style shoes;
- restrained ponytail secondary motion only.

LOGAN
- boy/young-teen proportions;
- short messy/spiky blonde hair;
- black fishing/outdoor-logo hoodie;
- dark cargo pants;
- tan/brown work boots;
- energetic personality may appear in idle/reactions, not speed advantage.

JAMES
- older adult compact cartoon proportions;
- short clustered grey curls;
- grey moustache;
- round glasses;
- bright blue button-up shirt;
- blue jeans;
- brown belt/shoes;
- age reads through silhouette/hair/posture, not photoreal wrinkles.

DOROTHY
- older adult compact rounded proportions;
- blonde high updo/bun;
- no glasses;
- blue long-sleeve dress/top;
- cream floral apron;
- blue shoes;
- apron is a major silhouette layer and must deform cleanly.

PAPA, NANA, KELSI, MOLLY, GUNNER
- remain turnaround-pending;
- current compatibility art may remain;
- do not invent final W.10 models until each individual turnaround is approved.

======================================================================
39. SHARED HUMANOID RIG STANDARD
======================================================================

Use one semantic humanoid rig wherever practical.

Required chain:
root -> hips -> lower spine -> chest -> neck -> head
left/right clavicle -> upper arm -> forearm -> hand
left/right thigh -> shin -> foot -> toe where useful

Rig rules:
- one documented forward axis;
- no runtime negative-scale mirroring of hand skeletons;
- freeze/apply transforms before export;
- elbows/knees bend anatomically;
- shoulders preserve volume during two-hand aim;
- foot IK may adapt to reasonable terrain;
- upper-body aim layers independently over lower-body locomotion;
- excessive spine twist triggers whole-body turn;
- head tracking is subtle and clamped.

Gameplay sockets:
- rightHand;
- leftHand;
- rightHandSocket;
- leftHandSupportTarget;
- weaponMuzzle;
- weaponSightTarget;
- back;
- HeadTop;
- Face;
- ChestAccessory.

======================================================================
40. ANIMATION SYSTEM STANDARD
======================================================================

Base locomotion coverage:
- relaxed idle;
- hunter-ready idle;
- forward walk/run;
- backpedal;
- strafe left/right;
- sprint;
- start/stop;
- turn in place;
- jump start;
- fall;
- soft land;
- hard land;
- crouch where used;
- low mantle;
- high mantle;
- fire/recoil;
- hit reaction;
- celebrate;
- transform;
- decoy placement;
- flash use.

Animation principles:
- gameplay input owns responsiveness;
- animation expresses motion, it does not veto valid input;
- avoid foot skating with speed-aware blending;
- avoid hard state snaps;
- use upper-body additive/aim layers;
- keep weapon grip stable through locomotion;
- character-specific personality belongs mainly in idle, reaction and celebration layers so gameplay remains fair.

======================================================================
41. COLLISION AND RECOVERY STANDARD
======================================================================

Common failure modes are release blockers:
- pinned player;
- invisible snag strip;
- camera collapsing into head;
- camera stuck top-down;
- spawn inside geometry;
- transformation inside geometry;
- mantle through roof;
- decorative mesh blocking camera.

Use:
- stable gameplay capsule/body collider;
- sensible skin width;
- slope/step handling;
- sub-step movement at high speed;
- wall sliding;
- safe spawn validation;
- camera-pocket validation;
- transform destination validation;
- sustained-invalid-state recovery.

Recovery must be conservative. Do not teleport during ordinary wall contact.

======================================================================
42. PROP HUNT MAP RANDOMIZATION
======================================================================

Use hybrid randomization.

Permanent anchors:
- main shop;
- barn;
- fireplace/Papa chair;
- major pen zones;
- property boundary/orientation.

Round-variable secondary elements may include:
- lumber arrangements;
- barrels/crates/pallets;
- portable equipment;
- selected doors starting open/closed;
- tractor/trailer parking in validated zones;
- hay clusters;
- workbench clutter;
- selected pen objects;
- rare harmless interactions.

Randomization must be seeded/authoritative and must pass route validation before the round begins.
If a generated arrangement blocks a required route or spawn, reject that arrangement and use a safe alternative.

======================================================================
43. WEATHER AND AMBIENCE
======================================================================

Per-round presets may include clear, sunset, overcast, light rain, light snow, fair fog and windy/cloud movement.

Rules:
- one preset remains stable for the whole round;
- weather does not alter collision;
- fog never becomes strong enough to materially hide one team;
- particles never obscure crosshair/hit feedback;
- snow/rain budgets scale on mobile;
- ambience does not reveal hider positions unfairly;
- positional hider audio remains protected during hide phase.

======================================================================
44. SPECTATOR EXPERIENCE
======================================================================

Classic eliminated players should remain entertained.

Provide:
- free-fly ghost mode;
- follow-living-player camera;
- next/previous target;
- return to free fly;
- no gameplay collision;
- no ability to interact;
- no information channel that can reveal hidden players to hunters through the game systems.

Family Chaos conversion must not accidentally trigger Classic spectator mode.

======================================================================
45. BOT DESIGN
======================================================================

Bots exist to keep games playable, not to demonstrate perfect AI.

Hunter bots:
- blind/frozen during hide phase;
- use believable search routes;
- do not read hidden hider transforms or exact positions;
- detection is based on legal visible information;
- aim skill respects difficulty level;
- avoid robotic instant 180-degree shots.

Hider bots:
- choose legal assigned props;
- move during hide phase;
- place reasonable decoys;
- use flash/escape sometimes;
- do not exploit collision inaccessible to humans.

Bot difficulty should change reaction/search/aim competence, not cheat access to hidden state.

======================================================================
46. ACCESSIBILITY AND COMFORT IN PROP HUNT
======================================================================

At minimum provide or plan for:
- sensitivity sliders;
- invert X/Y;
- reduced camera shake;
- haptic intensity/off;
- aim assist Off/Light/Standard for touch/gamepad;
- sprint hold/toggle/auto preference;
- large-button touch preset;
- left-handed touch preset;
- text/icon plus audio for important transitions;
- no flashing/strobing effects that can be avoided;
- brief flash-grenade exposure with reduced-motion/flash intensity option if practical;
- objective/role instructions reviewable from pause/How To.

Accessibility assists must not reveal hidden players or create competitive information that normal players do not have.

======================================================================
47. GAME FEEL AND FEEDBACK STACK
======================================================================

Every important action should answer three questions:
- Did my input happen?
- What did it affect?
- What can I do next?

Examples:
Shoot:
- input -> muzzle flash/audio immediately;
- beam -> actual impact;
- world hit -> surface response;
- hider hit -> stronger hit marker/audio/target reaction;
- elimination -> break effect + family cue + score state.

Transform:
- selection -> highlighted card;
- validation -> placement state;
- transform -> brief effect/sound;
- resource count -> updates;
- camera -> settles around new prop;
- control -> immediately returns.

Mantle:
- jump input -> immediate jump/mantle intent;
- valid ledge -> body commits;
- landing -> grounded response;
- invalid ledge -> normal jump/fallback, never frozen character.

======================================================================
48. PERFORMANCE BUDGETING FOR PAPA'S SHOP
======================================================================

The expanded property may contain hundreds of visible props and approximately 150 gameplay-meaningful/interactable objects, but it must be architected rather than brute-forced.

Use significance tiers:
TIER 1 - local player, nearby players, aimed-at/active props, weapon effects.
TIER 2 - nearby animated environment/animals/interactions.
TIER 3 - distant characters/ambient life.
TIER 4 - static scenery.

Scale updates, animation and shadows by significance.

Recommended initial WebGL targets on a representative mid-range phone:
- keep active draw calls as low as practical; use an initial engineering target around 150-200 visible draw submissions and revise from profiling rather than treating it as a sacred number;
- avoid more than a small handful of dynamic shadow-casting hero objects at once;
- use instancing for repeated fences, pallets, barrels, lumber pieces, vegetation and similar repeated props;
- keep temporary shot/impact objects pooled;
- use LOD/culling so the entire eight-times-larger property is not fully expensive at once;
- monitor JS heap, GPU memory proxies and context-loss events during a 15-minute soak.

Performance acceptance is based on actual profiling, not asset-count assumptions.

======================================================================
49. PLAYTEST METRICS AND LOCAL QA TELEMETRY
======================================================================

Because this is a private family app, telemetry should be local/developer-oriented by default. Do not add third-party analytics without explicit permission.

Useful debug events/counters:
- cameraResetUsed;
- automaticCameraRecovery;
- stuckRecovery;
- mantleAttempt / mantleSuccess / mantleFailReason;
- transformAttempt / transformSuccess / transformFailReason;
- decoyPlacementFail;
- shotFired;
- shotWorldHit;
- shotHiderHit;
- elimination;
- frameTimeP50 / P95 / P99;
- WebGL context loss;
- round duration;
- role win;
- time to first hider discovery;
- time spent in each map zone.

Use these to diagnose design, not to judge family players.

Balance target direction:
- over enough mixed-skill playtests, neither hunters nor hiders should dominate every map;
- a rough 40-60 percent band per side is a useful investigation threshold, not a rule to force from tiny samples;
- if balance is off, inspect spawn/routing/prop ecology/hunter count before adding artificial power-ups.

======================================================================
50. PROFESSIONAL PLAYTEST METHOD
======================================================================

For every major Prop Hunt iteration, run three types of test.

A. FIRST-TIME PLAYER TEST
Do not explain controls verbally beyond what the game itself teaches. Observe where the player hesitates.

B. EXPERT/DEVELOPER STRESS TEST
Try to break camera, collision, mantle, transform, decoy placement, boundary and networking.

C. FAMILY MATCH TEST
Play full rounds with normal conversation and distractions. Observe whether people understand what happened and whether the round creates funny/replayable moments.

Record:
- confusion points;
- accidental inputs;
- camera discomfort;
- stuck locations;
- unreadable hits;
- hiding spots everyone uses;
- zones nobody visits;
- controls players miss;
- moments players laugh/talk about afterward.

Fix repeated player confusion before adding new content.

======================================================================
51. PAPA'S SHOP JOHN VERTICAL-SLICE GATE
======================================================================

John is the first production gate. He must pass the complete actual-phone vertical-slice gate before the upgraded character/controller is propagated to the rest of the family.
For the hunter pose, the right hand on the trigger and the left hand supporting the fore-end are mandatory. Shooting must include a visible 3D energy tracer, and the proof must be captured on an actual phone.

Do not propagate the W.10 character/control system until one actual-phone capture proves all of these at the same time:

JOHN VISUAL
- unmistakably matches approved John turnaround;
- correct skin/hair/beard/plaid/jeans/boots;
- dimensional face and hair, not blocky;
- hands face anatomically correct direction;
- no severe arm/shoulder deformation;
- close-camera silhouette looks intentional from front 3/4, side and rear play angles.

HUNTER CONTROL
- stable right-shoulder camera;
- move + look + shoot simultaneously;
- jump/mantle works;
- sprint feels controllable;
- shoulder swap works;
- Reset View works;
- no top-down collapse;
- no pinned spawn.

WEAPON
- prop-zapper is clearly visible;
- right trigger hand grips correctly;
- left support hand remains on weapon;
- crosshair is clear;
- shot beam is visible;
- impact is visible;
- beam/crosshair/hit result agree;
- muzzle blocked by wall cannot shoot through wall.

HIDER
- transformation safe;
- camera adapts to prop;
- lock/unlock works;
- decoy placement works;
- flash works;
- jump/mantle works while disguised where allowed;
- resource counts remain correct.

PERFORMANCE
- sustained gameplay meets the target device's acceptable frame-rate tier;
- no major recurring stutters from shots/transforms;
- no WebGL errors/context loss in normal test.

Only after this gate passes can the shared implementation be called `PROVEN_PROP_HUNT_CHARACTER_CONTROLLER` or equivalent.

======================================================================
52. WHOLE-APP LOCKED RECENT CHANGES
======================================================================

Preserve the following recent W.6-W.8 requirements.

VANESSA'S PIPE PROBLEM / TRUCK WASH
- water reaching the grey GMC is the win condition;
- show clear win and advance to next level;
- truck is grey with only the letters GMC shown in pink;
- dimensional pipes, sockets/couplers/bolts, flow and worksite art.

LOGAN'S TRAIL LOGIC
- visual How To/tutorial;
- per-player tutorial choice;
- starts easier;
- early level shows one locked correct bike;
- difficulty grows through larger boards;
- dirt-bike icon must read as a dirt bike.

MEXICAN TRAIN
- game board is outside/above decorative table framing and easy to see;
- all personal dominoes are visible/reachable;
- player can rearrange personal domino rack.

GOLF
- player does not have to flip/replace the last card merely because a stock card was drawn;
- drawn stock card may be discarded while keeping all eight current cards;
- final-turn behavior follows the locked family rule;
- own eight cards and opponents' layouts are readable.

MITTS / GLOVES / SOCKS
- captured cards/points remain visibly in front of the player/team;
- active center pile remains distinct;
- presentation should resemble physical table play.

NANA'S GOAT WHACK
- animals are more dimensional and less blocky;
- point values and do-not-hit object are visible beside gameplay.

KELSI
- Kelsi's Rock 'n' Roll Rescue replaces Neon Star Patrol;
- old separate Kelsi game is removed/redirected according to W.6.

ARCADE TUTORIALS
- every active arcade game has in-game How To;
- detailed visual step tutorial;
- per-player show/skip choice remembered;
- tutorial can always be reopened.

TOKENS STORE
- earned-only Arcade Tokens;
- hats, glasses and accessories;
- cosmetic-only, identity-safe;
- unlocked items persist and can be equipped/removed.

======================================================================
53. 31 BLIND MODE LOCK
======================================================================

31 Blind mode is now defined.

Blind player starts with exactly 3 face-down cards in front of them and does not see those cards. If the player takes the discard, they replace one of their face-down cards without looking at the replaced card. They may pass and wait for the next turn.

Blind player:
- starts with exactly 3 cards face down in front of them;
- does not look at those cards;
- on a turn may choose one of three actions:
  1. flip one of their own face-down cards and keep it;
  2. take the top card from the discard pile and replace one chosen face-down card without looking at the replaced face-down card;
  3. pass and wait for the next turn;
- once one of the player's own cards is flipped and kept, it remains face up for the rest of the round.

Do not invent additional Blind scoring/end conditions beyond the existing 31 rules unless the user clarifies them.

======================================================================
54. DEFINITION OF DONE BY FEATURE TYPE
======================================================================

RULE FEATURE DONE
- rule documented;
- unit tests cover edge cases;
- main gameplay loop proves it;
- multiplayer authoritative state agrees;
- UI communicates it.

CONTROL FEATURE DONE
- works on target inputs;
- simultaneous-input cases work;
- sensitivity/dead zone tuned;
- no accidental input overlap;
- tested on actual phone for touch claims.

CHARACTER FEATURE DONE
- approved turnaround exists;
- model five-view proof matches;
- rig deformation passes;
- gameplay animation passes;
- LOD/material performance passes;
- actual in-game screenshot looks correct;
- only then model is flagged approved.

3D MAP FEATURE DONE
- blockout routes pass;
- collision pass;
- camera pass;
- visual pass;
- performance pass;
- full-round playtest;
- actual-phone proof.

ZIP RELEASE DONE
- tests pass;
- validator passes;
- archive integrity passes;
- exact ZIP cold extraction passes tests;
- changed-files report exists;
- known limitations are stated.

======================================================================
55. RELEASE PROOF BUNDLE
======================================================================

Every major 3D release should include, where tools allow:
- build/test report;
- changed-files list;
- performance/debug summary;
- at least one desktop gameplay screenshot;
- at least one target-phone gameplay screenshot supplied by real device or clearly labeled simulator/preview if not real device;
- character comparison proof for any newly approved model;
- short list of known limitations.

Do not substitute a bind-pose render for actual gameplay proof.

======================================================================
56. FORBIDDEN SHORTCUTS
======================================================================

Do not:
- silently redesign approved characters;
- mark unapproved GLBs approved;
- use fake manifests to imply assets exist;
- fix backwards hands by hiding the entire arm/weapon;
- solve camera collision by moving to permanent top-down view;
- make props tiny/invisible to solve hiding balance;
- add wall outlines to solve hunter difficulty;
- reduce the world to empty boxes to hit fps;
- add input delay so animation looks smoother;
- use giant full-screen effects that hide gameplay;
- make mobile buttons microscopic to preserve art;
- claim automated tests prove visual quality;
- rewrite unrelated game engines during a focused Prop Hunt pass;
- add major unapproved rules because they sound standard in another Prop Hunt game.

======================================================================
57. NEXT IMPLEMENTATION PRIORITIES
======================================================================

Priority 0 - preserve W.8 known-good build and W.9 approved prompt history.

Priority 1 - W.10 John + controls vertical slice
- approved John in actual gameplay;
- correct rig/hands;
- close shoulder camera;
- responsive movement;
- mantle;
- visible prop-zapper;
- aligned shots and impacts;
- mobile control presets;
- local QA counters.

Priority 2 - Papa's Shop gameplay blockout/route proof
- ensure full expanded map supports the improved controller;
- resolve camera/collision traps;
- validate prop ecology/disguise pool;
- full five-minute round.

Priority 3 - hider polish
- transform safety;
- lock;
- decoy preview/placement;
- flash comfort/readability;
- disguised traversal.

Priority 4 - multiplayer/bots/soak
- remote interpolation;
- reconnect;
- hide-phase privacy;
- bot fairness;
- 15-minute mobile soak.

Priority 5 - propagate to remaining turnaround-approved humans one at a time.

Priority 6 - finish remaining family turnarounds, then authored models.

Do not jump to Priority 5 or 6 merely because Priority 1 is difficult.

======================================================================
58. WHOLE-APP HOME LIBRARY AND NAVIGATION CONTINUITY
======================================================================

Preserve the lodge as one coherent entry point.

Primary shelf order remains:
1. Card Games.
2. Board & Tabletop Games.
3. 3D Family Games.
4. Arcade Corner.

The categories may have different visual personality, but they must still feel like one cabin/lodge product.

Home-screen principles:
- current/seasonal family event can receive a prominent hero treatment without burying normal game access;
- game cards communicate game type and player count quickly;
- Requests replaces Store for the original app navigation where that rename is already locked, while the W.8 Tokens Store remains a separate explicit cosmetic-rewards destination;
- Leaderboards show player names and games won according to the locked W. living-app direction;
- Avatars opens character selection and then outfit/cosmetic choices;
- How to Play opens the game list and relevant visual demo/tutorial;
- post-game choices offer Play Again/Reshuffle where applicable or return to the game shelf without destroying the room unnecessarily.

Do not make the lodge more decorative at the cost of slower access to games.

======================================================================
59. WHO'S PLAYING / ASK TO JOIN CONTINUITY
======================================================================

Preserve the shared social presence system where already implemented or specified.

The home experience should make it possible to understand:
- who is currently playing;
- which game/room they are in where privacy rules allow;
- whether a player can request to join;
- whether the request was accepted or declined;
- how reconnect behaves if the player leaves and returns.

Ask-to-Join is a social convenience, not a bypass around host/room rules.
Do not create duplicate room membership or duplicate player identity if a reconnect token already exists.

======================================================================
60. SEASONAL, BIRTHDAY AND FAMILY-EVENT CONTINUITY
======================================================================

Preserve the living-app event system from Phase W.

Event principles:
- events have explicit windows rather than permanently replacing the normal home screen;
- overlapping events blend predictably rather than stacking every decoration;
- event decorations must not obstruct game access or controls;
- event rewards remain cosmetic/memory/progression oriented rather than power advantages.

Birthday principles:
- the birthday person is featured prominently near the top of the home screen during their event window;
- show their approved avatar/character identity, name and birthday decoration;
- provide a prominent Birthday Challenge button that opens that year's personalized mini-event;
- first open during the event window may show a short personalized greeting sequence;
- family-character greetings are individual pop-ins/reactions rather than one generic combined message;
- dogs may use visual/sound reactions where spoken dialogue is inappropriate;
- after the first viewing, the greeting can be skipped so repeat visits are not interrupted;
- birthday rewards and memories are celebratory, not gameplay power;
- photos/memories remain a family-memory feature rather than a public social network.

======================================================================
61. TABLETOP AND CARD GAME RULE AUTHORITY
======================================================================

W.10 does not rewrite established family card/table rules.

Before changing any tabletop/card mechanic, read the relevant locked rule/test files and preserve the current rule engine unless the user explicitly changes the family rule.

Examples of especially sensitive locked behavior include:
- Screw Your Buddy / Fuck Your Buddy bidding, trump and scoring distinctions;
- Smear bidding/trump/scoring and six-card visibility before bidding;
- Black Gammon starting layout and special dice semantics;
- Backgammon standard legal movement/bar/bear-off/doubling behavior;
- Golf's eight-card family rules including the W.6 discard-without-forced-flip behavior;
- 31 standard rules plus the W.10 Blind definition in this prompt;
- Cribbage sorting and send-to-crib flow;
- Mexican Train personal rack visibility/rearrangement;
- any game-specific tests that encode an explicitly approved rule.

When visual polish and rule correctness conflict, rule correctness wins and the visual treatment must adapt.

======================================================================
62. PERSISTENCE, DATA OWNERSHIP AND SAFETY
======================================================================

Use one coherent profile/persistence model where possible.

Persist only what improves the private family experience, such as:
- profile name/avatar/color;
- cosmetic unlocks/equipment;
- Arcade Tokens;
- tutorial-completion preference;
- achievements/high scores;
- family game history where already supported;
- birthday/event memory metadata;
- room/reconnect identity as required.

Rules:
- do not invent a second competing wallet/profile database;
- validate token grants server-side where a server-authoritative path exists;
- token rewards must be idempotent so reconnect/retry cannot duplicate them;
- do not expose hidden Prop Hunt state to unauthorized clients;
- do not add third-party analytics, advertising or tracking to this private family app unless explicitly requested;
- local developer QA telemetry described in W.10 should avoid collecting unnecessary personal information.

======================================================================
63. PRODUCTION SCORECARD
======================================================================

For a major feature, the development team should score the candidate from 1 to 5 in each category before calling it release-ready:
- Rules/logic correctness.
- Input responsiveness.
- Camera/readability.
- Character/object visual fidelity.
- Animation/game feel.
- Audio/feedback.
- Mobile ergonomics.
- Performance/frame pacing.
- Multiplayer/reconnect robustness.
- Tutorial/first-time clarity.
- Accessibility/comfort settings.
- Regression safety.

A score of 1 or 2 in any core category blocks release.
A score of 3 means functional but needs explicit acceptance as a known limitation.
A score of 4 means strong release quality.
A score of 5 means a reusable benchmark for other games.

For Prop Hunt John/Papa's Shop, do not propagate the system until the core categories are at least 4 on the actual target phone, not just in desktop browser testing.

======================================================================
64. CHANGE CONTROL AND SCOPE DISCIPLINE
======================================================================

Every phase should classify requested work as one of:
- Rule correction.
- Playability repair.
- UX/readability improvement.
- Visual fidelity improvement.
- Performance/technical debt.
- New content.

Resolve in roughly that order unless the user explicitly prioritizes something else.

If a new request arrives during an unfinished flagship repair:
- preserve it in the master prompt/backlog;
- do not silently abandon the flagship quality gate;
- separate unrelated code changes into their own phase when possible.

Historical documents remain archived so a later developer can understand why a decision exists, but historical wording does not outrank the W.10 precedence table.


======================================================================
65. FINAL INSTRUCTION TO THE DEVELOPMENT AGENT
======================================================================

Treat Black Family Game Night as a real game product with a small-team production budget.

Do not optimize for the amount of code written, the number of tests generated or the number of features touched.

Optimize for:
- clarity;
- responsiveness;
- family identity;
- fair multiplayer;
- mobile comfort;
- stable performance;
- readable game state;
- fun full-round play;
- evidence that the thing actually works on the device people will use.

For Prop Hunt specifically, the next milestone is not `more 3D`.

The milestone is:

> ONE APPROVED JOHN, IN ONE EXCELLENT PAPA'S SHOP ROUND, WITH CONTROLS, CAMERA, HANDS, WEAPON, SHOOTING, HIDING AND PERFORMANCE THAT FEEL FINISHED ON A PHONE.

Once that exists, scale the proven system outward.


======================================================================
W23.1 HEADWEAR ACTUAL-AVATAR FIT CORRECTION ADDENDUM
======================================================================

- Headwear fit evidence must use the actual app avatar portraits/faces.
- John regular cosmetic surfaces use the clean no-baked-in-headwear approved portrait; birthday-specific art remains a separate presentation concern.
- Headwear assets used for fit calibration must use tight transparent/viewBox bounds.
- Per-avatar head anchors include x/y/width and rotation where required.
- Papa, Nana, Kelsi, Molly and Gunner require individual orientation/offset tuning.
- Conventional hats/caps may use the calibrated head anchor.
- Earmuffs must use ear/headset-style semantic anchoring.
- Bun accessories require bun/hair-accessory anchoring.
- Headbands require forehead/headband anchoring rather than ordinary hat placement.
- A green geometry-fit result does not override the W23 final-art gate: final Stage 2 approval still requires the actual production asset on every applicable actual avatar.


---
# W23 ADDENDUM — W001-W020 EVERYDAY WEAR ART RECOVERY + QA GATE
## Added 2026-08-31

This addendum is highest-precedence for Avatar Everyday Wear items W001-W020. It preserves the W23 technical-fit gate, Build 48 cabin recovery protections, and all prior approved family identity rules.

## 1. Cabin regression lock during art recovery
Catalog art work must not modify cabin renderer startup, cabin save/migration logic, cabin room data, service-worker cabin fallbacks, or cabin artwork paths. Build 48 cabin-recovery behavior is protected. Any catalog-art integration that changes shared runtime code must pass the cabin regression gate before release.

## 2. W001-W020 source-of-truth concepts
- W001 — Cabin Flannel Overshirt: brushed plaid overshirt with rolled sleeves.
- W002 — Chunky Fisherman Knit: heavy cable-knit crew sweater.
- W003 — Denim Snap Shirt: medium-wash denim western snap shirt.
- W004 — Embroidered Western Shirt: dark western shirt with tonal embroidery and piping.
- W005 — River Shirt: light fishing shirt with rolled sleeves and subtle river patch.
- W006 — Pop Charm Hoodie: soft hoodie with removable charm tabs and playful pocket detail.
- W007 — Ballet Wrap Sweater: soft wrap cardigan with ribbon tie and fitted sleeves.
- W008 — Classic Floral Cardigan: traditional cardigan with tiny floral knit pattern.
- W009 — Camp Patch Hoodie: heather hoodie with fictional camp patches.
- W010 — Cabin League Jersey: logo-free family game-night style jersey.
- W011 — Trail Utility Pant: durable tapered trail pants with knee panels.
- W012 — Dark Straight-Leg Denim: clean straight-leg jeans with subtle fade.
- W013 — Western Fringe Skirt: suede-inspired midi skirt with controlled fringe.
- W014 — Lakeside Sundress: flowy sundress with small lake-flower print.
- W015 — Velvet Cabin Dress: deep velvet midi dress with subtle timber-leaf embroidery.
- W016 — Canvas Work Jacket: heavy canvas chore jacket with contrast collar.
- W017 — Wrench Patch Jacket: rugged jacket with small wrench patch and reinforced pockets.
- W018 — Cabin Chic Shacket: tailored plaid shacket with polished hardware and soft lining.
- W019 — Modern Moto Jacket: clean fitted moto jacket in matte leather texture.
- W020 — Quilted Lodge Parka: warm quilted parka with faux-fur hood trim.

## 3. Art-rebuild objective
Rebuild W001-W020 as high-quality stylized-realistic 3D approval art. Preserve each original concept, category, collection identity, and intended personality. This is a quality rebuild, not a random redesign pass.

Every item must visibly show:
- real three-dimensional volume and garment thickness;
- clean silhouette and believable garment construction;
- seams, hems, collars, cuffs, waistbands, closures, trim and layering where applicable;
- believable folds/drape for the stated material;
- material-specific finish such as flannel, cable knit, denim, suede, velvet, canvas, matte leather, quilting or faux fur;
- correct body contact without painted-on, floating, cardboard-thin or paper-doll appearance;
- polished studio lighting and consistent render quality.

Hard rejects include: flat/sticker-like art, painted-on clothing, cardboard geometry, muddy edges, weak shading, severe clipping, warped anatomy, inconsistent render style, or any item that looks materially worse than the batch benchmark.

## 4. Approved-family-avatar presentation rule
Review art must use the approved Black Family Game Night family-avatar visual language, not unrelated substitute models. Concept-art approval does not prove fit on every family avatar. After Approved Art, production versions still require actual-app-avatar Stage 2 fit review on John, Kristen, Holly, Vanessa, Elizabeth/Lizzy, Logan, James, Dorothy, Papa, Nana and applicable dog adaptations for Kelsi, Molly and Gunner.

## 5. Review-board format
Final W001-W020 board:
- exactly 20 items;
- clean 4 x 5 grid;
- W001-W020 labels clearly readable;
- consistent neutral studio background, camera, avatar scale and lighting;
- full-body presentation unless closer framing materially improves evaluation;
- no decorative collage treatment that competes with garment review.

## 6. W001-W020 QA approval checklist
Each item must pass all applicable gates below before Approved Art:

### A. Concept preservation
- original wearable remains recognizable;
- category and intended personality are preserved;
- any major concept change is explicitly surfaced for review.

### B. 3D visual quality
- clearly dimensional volume;
- garment thickness and clean silhouette;
- polished edges/shadows;
- readable at catalog scale;
- no flat, paper-doll, sticker or painted-on appearance.

### C. Garment construction
- believable collar/neckline, sleeves, cuffs, hems, waistband, closures, pockets and trim where applicable;
- layered pieces overlap physically correctly;
- construction makes sense as a wearable object.

### D. Material quality
- fabric/material reads correctly for the design;
- folds, seams, texture direction and surface finish agree with that material;
- no noisy procedural texture or completely flat fill.

### E. Fit on review avatar
- correct shoulders, chest, waist, hips, legs, neck and sleeve attachment;
- no severe clipping, floating, unintended stretching or ballooning;
- oversized/fitted silhouettes look intentional.

### F. Character quality
- approved family-avatar proportions maintained;
- pose/anatomy do not distort the garment;
- character remains recognizable.

### G. Batch consistency
- same realism, lighting, avatar base, render quality, detail density and framing;
- no visibly weak outlier.

### H. Board presentation
- exactly W001-W020 in a 4 x 5 grid;
- labels readable;
- item scale large enough to inspect;
- professional approval-focused presentation.

## 7. Production and live-release gate after Approved Art
Approved Art is not live approval. Each item must still advance through:
Concept -> Approved Art -> Production Model -> 3D Ready -> Integrated -> Actual Avatar Fit -> Device Approved -> Release Approved.

The production wearable must visibly match Approved Art in recognizable silhouette, proportions, material language, finish/color family, construction details and overall design identity. If it does not, it fails even if automated tests pass.

## 8. Art-testing sequence
Do not generate all 20 blindly and assume consistency. Use controlled visual gates:
1. Pilot W001-W005 in one review board.
2. Review Pass / Needs Changes / Reject item by item.
3. Correct the pilot until it establishes the accepted 3D quality benchmark.
4. Continue W006-W010, W011-W015, W016-W020 using the accepted benchmark.
5. Assemble the final W001-W020 4 x 5 board only after all four sub-batches clear their art gate.

Current runtime placeholder/SVG artwork remains NOT Stage-2-approved and NOT approved for live use merely because it technically renders.


======================================================================
W24-W32 CONSOLIDATED PRODUCTION ADDENDUM — 2026-08-31
======================================================================

STATUS / PRECEDENCE
-------------------
This addendum records the full production direction, decisions, findings, failed experiments, successful gates, and current active priorities established during the 2026-08-31 development session.

It is authoritative over earlier conflicting catalog, character, cabin, and Prop Hunt implementation assumptions. It does NOT erase earlier approved rules that remain compatible.

Current precedence for active work:
1. W30 Prop Hunt P0 gameplay-engine contract and its release-blocking rules.
2. W31/W32 Prop Hunt real visual rebuild toward the approved Papa's Shop gameplay target.
3. W25 true-production-asset pipeline for shop/cabin items.
4. W27/W29 temporary family-character V1 pipeline, with known head/profile imperfections explicitly deferred for later polish.
5. Earlier catalog concepts, fit matrices, and approval history remain useful only where they do not contradict these newer production rules.

Do not interpret historical automated test success as visual approval. Actual runtime appearance and device feel remain authoritative.

======================================================================
66. CATALOG REALITY CHECK AND W23/W24 ART-RECOVERY FINDINGS
======================================================================

A full catalog audit established that the wearable catalog contains 2,000 items, not 400. Earlier references to 400 wearable items are stale and must not be used for production planning.

The catalog database is valuable and should be preserved for:
- stable IDs;
- names;
- categories;
- rarity/collection metadata;
- pricing;
- ownership;
- saves;
- unlock state;
- approval state;
- compatibility with existing player data.

The existing generated SVG/PNG-style cosmetic artwork is NOT a finished production asset library. Much of it is flat, placeholder-like, or disconnected from the in-game result.

W23 technical discoveries included:
- 117 glasses/sunglasses/goggle items had been sharing a generic face slot;
- James, Dorothy, Papa and Nana lacked sufficiently explicit individual fitting profiles;
- Kelsi, Molly and Gunner were effectively sharing overly generic dog fitting;
- item-level fit metadata existed but runtime fitting was not consistently respecting it;
- representative rendering across 14 wearable categories confirmed that much of the runtime art did not meet the intended stylized-realistic quality bar.

The two-stage catalog gate remains mandatory:

STAGE 1 — Technical Catalog Approval
- valid record;
- correct category/slot;
- finite transforms;
- valid assets;
- correct preview path;
- correct anchors;
- safe dog adaptation where applicable;
- regression tests.

STAGE 2 — Visual / Actual-Avatar Approval
- actual in-app avatar or production 3D character;
- correct position/scale/rotation;
- no floating;
- no severe clipping;
- category-specific fit correctness;
- shop/customization/cabin presentation quality;
- actual visual match to approved art;
- target-device confirmation.

Stage 1 never implies Stage 2.

Concept boards may approve design direction only. They are never evidence of actual-avatar fit unless the real production avatar and actual runtime asset are used.

======================================================================
67. W24 PRIORITY COSMETIC CATEGORIES AND FLAGSHIP SET
======================================================================

The user explicitly prioritized these shop categories before other cosmetics:
1. Hats
2. Filters
3. Glasses
4. Earrings

A 24-item flagship test set was defined as six items per category.

FIRST SIX HATS
- Everyday Baseball Cap
- Western Cowboy Hat
- Soft Knit Beanie
- Canvas Bucket Hat
- Dressy Wide-Brim Hat
- Winter Pom Hat

FIRST SIX GLASSES
- Clear Fashion Frames
- Classic Aviators
- Oversized Glam Glasses
- Slim Rectangle Sunglasses
- Reading / Smart Frames
- Playful Colored Frames

FIRST SIX EARRINGS
- Small Stud Earrings
- Medium Hoop Earrings
- Pearl Drop Earrings
- Gem Dangle Earrings
- Heart Charm Earrings
- Statement Fashion Earrings

FIRST SIX FILTERS
- Soft Glam Filter
- Freckles Filter
- Blush Glow Filter
- Sparkle Filter
- Festival Filter
- Golden Hour Glow Filter

These items are design benchmarks, not automatic live-release approvals.

W24 earring integration replaced six existing unapproved placeholder records rather than increasing the 2,000-item catalog. This preserved save and ownership compatibility.

The earring pipeline used:
- separate shop hero render;
- separate left/right equipped pair;
- semantic earlobe anchors;
- corrected human earlobe spacing;
- deliberately smaller dog ear-charm adaptations for Kelsi, Molly and Gunner.

Historical automated status for Build 49 was 575/575 tests and 4,262 staging passes with 0 failures. This remains historical technical evidence only. The user later reported that the shop/catalog items still did not visually work as intended, so those results do not count as current visual approval.

======================================================================
68. PROFESSIONAL ASSET-PIPELINE RESET — W25
======================================================================

The central production decision is now locked:

> EVERY FINISHED ITEM HAS ONE REAL PRODUCTION ASSET. THE SHOP IMAGE, AVATAR PREVIEW, CABIN PREVIEW AND IN-GAME RESULT MUST ALL BE PRESENTATIONS OF THAT SAME ASSET.

Do not maintain a disconnected pipeline where:
- concept art looks excellent;
- shop art is a different image;
- equipped runtime item is a weaker overlay;
- cabin result is a generic proxy.

The existing 2,000 wearable records and cabin catalog records remain metadata. Their old generated visuals are placeholders until replaced with production assets.

PRODUCTION WEARABLE PIPELINE
Concept -> Approved Art -> Production 3D Model / Effect -> Materials -> Rig/Anchor -> Actual Character Fit -> Model-Derived Shop Preview -> Runtime Integration -> Device Approval -> Release Approved.

PRODUCTION CABIN ITEM PIPELINE
Concept -> Approved Art -> Production 3D Model -> Materials -> Real Scale/Pivot -> Collision/Placement -> Interaction Hooks -> Model-Derived Shop Preview -> Cabin Runtime Integration -> Device Approval -> Release Approved.

The shop thumbnail must be rendered from the actual production asset. If the shop card looks better than the equipped/placed item, the asset fails.

Unfinished legacy placeholders must not appear as normal finished merchandise. Catalog states are:
- PRODUCTION READY
- CONCEPT / COMING SOON
- INTERNAL / HIDDEN

The normal storefront should feature production-quality assets. Existing records may remain behind Coming Soon/Concept for compatibility.

======================================================================
69. W25 GOLD-STANDARD VERTICAL SLICE — LOCKED ART DIRECTION
======================================================================

Overall visual direction:
- stylized realism;
- approved prior Black Family Game Night imagery is the identity/style reference;
- not blocky Roblox-like geometry;
- not photoreal human uncanny-valley rendering;
- real dimensional materials, lighting and silhouettes.

CABIN STYLE
Upscale rustic lodge:
- approximately 70% warm authentic cabin;
- approximately 30% polished modern;
- timber;
- warm leather;
- cream fabrics;
- blackened metal;
- stone;
- warm practical lighting;
- handcrafted detail.

FOUR GOLD-STANDARD CABIN OBJECTS
1. Heavy timber bed with upholstered headboard
   - deep walnut wood tone.
2. Rich lodge armchair
   - warm cognac brown leather.
3. Solid side table
   - square heavy timber top + black metal legs.
4. Warm table lamp
   - linen shade + bronze base.

FOUR GOLD-STANDARD COSMETIC OBJECTS/EFFECTS
1. Western cowboy hat
   - dark brown ranch hat.
2. Classic aviators
   - gold frame + brown lenses.
3. Medium gold hoops
   - smooth polished gold hoops.
4. Soft-glam filter
   - soft-glam beauty pass, restrained and flattering.

INITIAL CHARACTER PROVING GROUP
- John
- Kristen
- Kelsi

Hair must not simply be deleted to make hats fit. Use intentional hat-specific hair compression/tucking while preserving recognizable hairstyle identity.

Furniture interaction proof:
- armchair should become sittable;
- lamp should switch on/off and persist state;
- bed should initially support correct placement/rotation and later sleep/lie-down animation.

Shop preview standard:
- fast thumbnail rendered from real asset;
- selected item uses live rotatable 3D preview;
- cosmetic preview equips same asset on actual production avatar;
- cabin preview uses same object model that is placed in the room.

Mobile baseline:
- target a mid-range phone approximately 2022 onward;
- desktop may use higher LOD/material quality.

Build 50 historical technical status:
- 581/581 automated tests passed;
- 4,280 staging validations passed;
- 0 staging failures.

Build 50 proved the architecture but did not complete final character/device visual approval.

======================================================================
70. CHARACTER PRODUCTION PIPELINE — W26/W27
======================================================================

A formal Kristen + Kelsi artist handoff was created with:
- orthographic/turnaround references;
- stylized-realism proportions;
- topology/LOD guidance;
- PBR material rules;
- skeleton requirements;
- face/hair requirements;
- hat/glasses/earring/filter sockets;
- dog-specific anchors;
- export requirements;
- GLB delivery checklist.

John's then-existing skinned model was used to prove the technical wearable attachment system because it contained a real skeleton and head bone. The real cowboy hat and aviator GLBs were attached to his actual head bone and followed his Idle animation.

However, this test also exposed that John's original visible production mesh was still too blocky/segmented to be the visual benchmark.

Build 51 historical technical status:
- 587/587 tests passed;
- 4,282 staging validations passed;
- 0 failures.

JOHN W27 HEAD REPAIR
The old John face system was found to combine competing face layers, including painted facial information plus separate 3D facial features. This produced a visibly broken head from some angles.

The W27 repair:
- removed competing/double face presentation;
- preserved the body/clothing/rig that looked better;
- preserved real skeleton and head bone;
- preserved 19 animation clips;
- rebuilt visible head presentation around the approved stylized John reference;
- retuned cowboy hat position;
- retuned aviator size/height;
- made Production Shop previews show the actual cosmetic on the repaired John instead of a disconnected spinning accessory.

Build 52 historical technical status:
- 592/592 tests passed;
- 4,284 staging validations passed;
- 0 failures.

Build 52 became the temporary V1 John visual baseline because it was substantially improved, but it remained imperfect at certain side/profile/rear 3/4 angles.

IMPORTANT W28 REJECTION HISTORY
A later W28 side-seal/head-enlargement experiment solved some apparent temple gaps by changing too much of the head. The user explicitly judged it WORSE than Build 52. That experiment is rejected and must not be resurrected as the preferred head.

Further experiments involving:
- larger side seal geometry;
- heavy hair fillers;
- full atlas wrapping;
- geometry-only face replacement;
were also rejected when they degraded likeness or created helmet/earmuff-like silhouettes.

The temporary accepted approach is:
- preserve the Build 52 front/3-quarter identity;
- accept that it is V1, not final;
- continue the wider family rollout;
- revisit hard profile/head polish later with better authored modeling capability.

Do not claim the John head is final.

======================================================================
71. W29 FAMILY V1 CANDIDATE ROLLOUT
======================================================================

The user approved propagating the temporary Build 52-style character approach to additional family members with the explicit understanding that visual cleanup can continue later.

Seven human V1 candidates were built from their individual approved turnarounds:
- Kristen
- Holly
- Vanessa
- Elizabeth / Lizzy
- Logan
- James
- Dorothy

John remains on the Build 52 temporary baseline.

Each V1 candidate includes:
- GLB candidate model;
- humanoid rig;
- named head/headSocket;
- 19 animation clips;
- individual approved turnaround identity reference;
- individual face/hair treatment;
- V1 Candidate status, not final approval.

A separate Family V1 Lab was added so these characters can be:
- selected;
- rotated;
- zoomed;
- tested with Idle, Walk, Wave and Celebrate;
without replacing all live game avatars yet.

Known limitations remain:
- profiles/rear 3/4 angles;
- some hair silhouettes;
- likeness details;
- final cosmetic fitting;
- final device visual approval.

Papa, Nana and the dogs were NOT forced through the same humanoid process. Dogs remain proper quadruped candidates and must never be treated as short humans.

Build 53 historical technical status:
- 596/596 tests passed;
- 4,294 staging validations passed;
- 0 failures.

======================================================================
72. CABIN REGRESSION AND TRUE-PRODUCTION-ITEM LOCK
======================================================================

The cabin disappeared during one catalog/headwear integration sequence. Investigation established that cabin resilience must be protected whenever shared runtime/catalog code changes.

Build 48 recovery principles remain locked:
- cabin overview must load independently of the 3D room module;
- a static room shell/fallback must appear immediately if 3D loading fails;
- 3D cabin module loads lazily;
- cabin data must remain safe if 3D rendering fails;
- service worker must precache core cabin presentation assets;
- cabin entrypoint must never become blank because an optional external 3D dependency fails.

Important correction:
`cabin-3d-room.mjs` still uses an external Three.js CDN import in the historical builds. The recovery was lazy loading + fallback resilience, NOT a fully local Three.js bundle. Do not claim the CDN dependency has already been removed.

Also preserve the naming rule:
- use Lizzy or Elizabeth;
- never display Lizzie in new production work.

A baked-in old `Lizzie's Room` label was observed in a cabin aerial asset. This is a known visual naming defect to correct when that source image is next edited.

The W25 cabin vertical slice replaced generic proxies for the approved bed/chair/table/lamp records with actual GLB-backed production items. The lamp has real toggleable/persistent light state. The chair has a real seat target, but the actual sit animation must not be called finished until the character animation/rig result is visually approved.

======================================================================
73. PROP HUNT BECOMES THE PRIMARY GAMEPLAY FLAGSHIP — W30
======================================================================

On 2026-08-31 the user supplied a new P0 contract for Family Prop Hunt and explicitly made these the highest priority gameplay problems:
- animation quality;
- controls and movement feel;
- glitchiness / instability.

The required priority order is:
1. Input and controls
2. Character movement
3. Animation
4. Collision and physics stability
5. Camera
6. Aiming and shooting
7. Prop movement/transformation
8. Performance/frame pacing
9. Visual polish
10. Additional content

No new maps, decorative props, particles, texture upgrades, lighting upgrades or additional game modes should displace the P0 gameplay foundation.

The engineering target is a smooth polished third-person 3D game with console-quality control principles adapted to mobile/browser gameplay, while retaining the immediate accessibility of a very good Roblox-style game.

Gameplay-authoritative rule:
- controller determines position, velocity, acceleration, direction, collision and jump;
- animation represents measured movement;
- animation may never unexpectedly change gameplay position, camera, velocity, facing or collision state.

W30 ROOT-CAUSE AUDIT FINDINGS
The audit identified several concrete implementation defects:
- virtual joystick already produced forward-positive input, but Prop Hunt flipped it a second time before movement;
- Sprint had toggle-like/sticky behavior and was not reliably cleared by lifecycle resets;
- pointer-look/joystick handlers did not fully cover lost pointer capture, blur and interrupted touches;
- hunter Aim was effectively hard-wired on instead of being a true player-controlled state;
- touch look and shoot paths were not sufficiently isolated;
- movement bands/turn semantics needed clearer walk/jog/run/sprint behavior;
- grounding and mantle validation were too fragile;
- prop Lock and transformation safety needed stronger rules.

W30 IMPLEMENTATION CHANGES
Controls:
- forward inversion corrected;
- hold-to-Sprint;
- hold-to-Aim;
- hold-to-Shoot;
- robust Jump handling;
- pointercancel/lost capture/blur/visibility cleanup;
- simultaneous-control cleanup;
- touch look separated from firing.

Movement:
- analog walk/jog/run bands;
- Sprint faster than run;
- camera-relative movement;
- diagonal normalization retained/validated;
- target-speed acceleration/braking;
- sharp-turn / planted-180 semantics;
- no waiting for animation callbacks before input response.

Animation:
- jog/sharp-turn/180 semantic states;
- animation follows measured motion;
- Aim becomes an explicit state;
- authored-animation fallback/watchdog remains mandatory.

Collision / physics:
- 9-point ground support probing;
- stronger edge grounding;
- mantle destination validation;
- overhead-clearance validation;
- destination-fit validation;
- finite-value sanitation;
- fixed/sub-stepped simulation remains authoritative.

Hunter:
- real AIM control;
- modest shoulder camera only while aiming;
- separate Shoot;
- controlled rapid fire approximately 4.8 shots/sec;
- mild hip-fire;
- touch camera drag must not fire;
- aim assist may be extremely mild only.

Hider:
- Lock ignores tiny joystick noise;
- intentional movement unlocks immediately;
- Align rotates toward a nearby comparable prop without teleporting;
- unsafe disguise changes are rejected rather than teleport-corrected over large distances;
- safe-fit correction kept to a small range (roughly 22-24 cm);
- Decoy grounding uses stronger support solver;
- Flash strong impairment approximately 1.45 sec with rapid recovery.

A deterministic QA launcher was added so Hunter/Hider sessions can be reproduced without setup noise.

BUILD 54 HISTORICAL GATE 1
- 609/609 automated tests passed;
- 4,304 staging validations passed;
- 0 staging failures;
- ZIP integrity and cold runtime HTTP smoke passed.

CRITICAL VISUAL-GATE CORRECTION
A real attempt to run the exact Build 54 in the available Chromium environment showed the main Prop Hunt play area as blank/black even though the surrounding Game Night shell loaded.

Therefore:
- Build 54 is NOT visually approved;
- 609/609 tests do NOT prove the game visually runs;
- a blank/black play surface is a hard failure regardless of test counts;
- do not ever claim a build is visually successful based only on automated gates.

The environment itself has WebGL/EGL/ANGLE limitations, but that limitation must be stated honestly. If a live browser capture cannot be obtained, use alternate deterministic asset/code proof and leave actual runtime/device approval pending.

======================================================================
74. MOCKUP VS ACTUAL GAME — TRUTHFUL PROOF RULE
======================================================================

During W30 a polished AI-generated Prop Hunt gameplay mockup was created to illustrate the target experience.

The user explicitly rejected presenting a mockup when asking to see how the game ACTUALLY looks.

This establishes a permanent proof rule:

1. MOCKUP / CONCEPT TARGET
   - may show desired future quality;
   - must be labeled as concept/mockup/visual target;
   - may NEVER be described as actual gameplay.

2. DETERMINISTIC ASSET/CODE RENDER
   - may be generated from the real GLBs, camera values, object transforms and HUD layout wired into the build;
   - must be labeled accurately as an offscreen/deterministic render if it is not captured from the browser's live WebGL canvas.

3. ACTUAL RUNNING BROWSER SCREENSHOT
   - must come from the real running build;
   - if the game is blank/broken, show it honestly.

4. REAL-DEVICE APPROVAL
   - only a real device test may be called Device Approved.

Never beautify a failure and call it proof.
Never infer visual success from tests.

======================================================================
75. W31/W32 PROP HUNT VISUAL REBUILD — PAPA'S SHOP
======================================================================

After the user accepted the polished gameplay mockup as a visual direction, the instruction changed from merely fixing controls to coding the ACTUAL game scene toward that look and showing the coded result for approval.

The active visual goal is:
- warm, upscale-rustic Papa's Shop;
- close third-person framing;
- readable full character;
- clear center chase lane;
- richer shelves and merchandise;
- warm practical lighting;
- readable Hunter/Hider HUD;
- weapon clearly presented in-hand;
- dimensional shop props;
- believable materials;
- visually dense enough to feel like a finished game, without blocking gameplay.

W31 CHANGES
The real Papa's Shop scene was rebuilt beyond the sparse blockout with:
- warmer wood shop treatment;
- inward-facing retail shelving;
- stocked displays;
- checkout counter;
- merchandise islands;
- central floor feature/rug;
- hanging practical lights;
- clearer signage;
- open chase lane;
- collisions matching new furniture.

A deterministic W31 approval render was produced from the actual coded assets. It was not claimed as a live browser WebGL screenshot.

W32 CHANGES
The scene was pushed further toward the target by coding additional actual environment detail:
- inner timber wall cladding;
- denser ceiling construction;
- structural beams/posts;
- stone base/kick-course details;
- much denser shelving stock;
- pottery/jars;
- folded merchandise;
- clothing displays;
- plants;
- lanterns;
- baskets;
- tool/workshop details;
- larger checkout area;
- foreground retail tables;
- central rug/floor marker;
- additional warm practical lighting;
- matching colliders for new foreground furniture.

The W32 Papa's Shop scene reached approximately 754 authored 3D pieces in the current coded candidate.

Real gameplay camera was tightened:
- normal camera distance approximately 4.05 (from 4.35);
- Aim camera approximately 2.95 (from 3.25).

The intent is to give the character more presence and move closer to the approved third-person target composition.

The W32-specific visual/integration test set was 5/5 at the time of this master update, but the broader W32 regression/release gate had NOT yet been frozen as Build 55.

CURRENT W32 VISUAL LIMITATIONS
Do not call the scene finished. Remaining high-value improvements include:
1. John/character visual polish.
2. Weapon presentation and believable hand/aim alignment.
3. More differentiated wood/metal/ceramic/fabric material response.
4. Richer lighting, contact shadows and depth.
5. More recognizable shelf merchandise rather than abstract colored silhouettes.
6. Stronger foreground depth/composition.
7. Less procedural wall/ceiling repetition.
8. Final live-browser and target-phone proof.

The user explicitly said the W32 direction is getting better and wants continued improvement.

======================================================================
76. CURRENT PROP HUNT ART + GAMEPLAY TARGET
======================================================================

The visual target created during this session shows the desired feel:
- warm timber Papa's Shop interior;
- detailed shelves and retail clutter;
- substantial wood beams/ceiling;
- warm pendant lighting;
- close third-person Hunter view;
- character visible from behind;
- readable weapon in hand;
- centered crosshair;
- small top HUD chips rather than giant panels;
- bottom-left movement joystick;
- right-side Aim/Shoot/Jump/Sprint controls;
- enough clutter to create hiding/chase interest while preserving sightlines and navigation.

The target image is a VISUAL TARGET ONLY. It is not evidence that the runtime already matches it.

Persistent reference filenames for this phase:
- W32_PROP_HUNT_VISUAL_TARGET.png — desired visual target/mockup only.
- W32_PROP_HUNT_ACTUAL_CODED_PLAYVIEW.png — current deterministic render from the coded W32 production assets/camera/HUD.

The W32 coded render is the current production-asset checkpoint. Continue iterating the coded environment until the real runtime/device view approaches the target honestly.

Do not solve the gap by generating prettier concept images.

======================================================================
77. PROP HUNT VISUAL PRIORITY AFTER W32
======================================================================

Unless the user changes priorities, improve the actual coded scene in this order:

1. CHARACTER + WEAPON PRESENTATION
- better current approved character model where available;
- proper weapon socket/hand grip;
- natural weapon idle;
- raise-to-aim;
- firing recoil;
- run while aiming;
- no floating weapon;
- no rigid statue upper body.

2. LIGHTING + SHADOWS
- warm practical lights;
- readable key/fill balance;
- contact shadows;
- grounded characters/props;
- richer depth without crushing visibility;
- mobile-performance-aware shadow quality.

3. MATERIAL SEPARATION
- wood must not all read as the same brown;
- metal needs controlled highlights/roughness;
- ceramics need distinct gloss;
- fabrics need soft rough response;
- stone needs distinct texture/normal/roughness;
- avoid flat unlit colors.

4. RECOGNIZABLE MERCHANDISE
- shelves should contain actual readable prop classes;
- avoid hundreds of generic cubes/cylinders masquerading as finished merchandise;
- keep geometry/collision sensible for gameplay.

5. FOREGROUND DEPTH + ROOM COMPOSITION
- frame the chase lane with believable foreground furniture;
- preserve navigation width;
- keep camera from clipping into foreground tables/shelves.

6. BREAK REPETITION
- variation in timber planks, beams, display groups and ceiling structure;
- no procedural wallpaper effect.

7. LIVE RUNTIME / DEVICE PROOF
- actual browser capture if available;
- target phone testing;
- controls, movement, camera and collision assessed while viewing the final art;
- do not separate visual and gameplay acceptance at the final gate.

======================================================================
78. CURRENT RELEASE CHAIN / HISTORICAL SNAPSHOTS
======================================================================

These are useful rollback/history markers, not automatic approvals:

Build 45 — W23 Catalog Fit + Accessories
- broad catalog fit/runtime audit.

Build 46 — W23 Headwear Fit Correction
- 17 conventional headwear items geometry-green;
- 3 specialty items still amber at that stage.

Build 47 — W23 Headwear Fit Final
- 20/20 representative headwear geometry-fit green;
- final production artwork still not automatically Stage 2 approved.

Build 48 — Cabin Regression Recovery
- cabin resilience/fallback restored;
- 571/571 tests;
- 4,244 staging passes, 2 warnings, 0 failures.

Build 49 — W24 Flagship Earrings
- six replacement earring records;
- 575/575 tests;
- 4,262 staging passes, 0 failures;
- later user visual feedback showed the overall catalog still looked 2D/poor, so technical green was not visual approval.

Build 50 — W25 Production Asset Vertical Slice
- real GLB cabin/cosmetic assets;
- production-only storefront direction;
- 581/581 tests;
- 4,280 staging passes, 0 failures.

Build 51 — W26 Character/Wearable Fit Proof
- character production handoff;
- John real-head-bone attachment proof;
- 587/587 tests;
- 4,282 staging passes, 0 failures.

Build 52 — W27 John Head Repair
- current temporary John V1 visual baseline;
- 592/592 tests;
- 4,284 staging passes, 0 failures.

Build 53 — W29 Family V1 Candidates
- Kristen, Holly, Vanessa, Elizabeth/Lizzy, Logan, James, Dorothy candidate GLBs/lab;
- 596/596 tests;
- 4,294 staging passes, 0 failures.

Build 54 — W30 Prop Hunt P0 Gameplay
- input/movement/animation/collision/aim/prop-control engineering pass;
- 609/609 tests;
- 4,304 staging passes, 0 failures;
- actual available-environment browser capture still showed blank 3D play area, therefore NOT visually approved.

W31/W32 — Prop Hunt Papa's Shop Visual Rebuild
- active working branch after Build 54;
- not yet frozen as Build 55 at time of this update;
- continue from current W32 actual coded scene, not the older sparse W31 blockout.

======================================================================
79. ACTIVE STOP CONDITIONS
======================================================================

STOP AND CORRECT rather than moving on when any of the following is true:
- Prop Hunt play area is blank/black.
- Character movement still feels backward, sticky, delayed or slippery.
- Camera collapses, clips through walls, becomes top-down or fights player input.
- Animation visibly skates, pops, freezes or breaks control response.
- Weapon floats or aims away from crosshair.
- Prop transformation embeds the player in geometry.
- Grounding jitters or the player becomes stuck in ordinary scenery.
- A concept/mockup is being substituted for actual proof.
- Shop/cabin thumbnails look better than the real production asset.
- A 2D placeholder is presented as a finished production item.
- A family character is called final despite known profile/head failures.
- Dogs are retargeted as short humans.
- Automated tests are being used to overrule obvious visual/device failure.

======================================================================
80. CURRENT NEXT MILESTONE
======================================================================

The immediate milestone is no longer simply:
"Prop Hunt runs" or "the shop has 3D files."

The milestone is:

> A REAL, PLAYABLE PAPA'S SHOP PROP HUNT ROUND THAT VISUALLY APPROACHES THE APPROVED W32 TARGET, WITH A GROUNDED FAMILY CHARACTER, CORRECT WEAPON/HANDS, WARM DIMENSIONAL MATERIALS/LIGHTING, RESPONSIVE CONTROLS, STABLE CAMERA/COLLISION, AND A HUD THAT FEELS LIKE A FINISHED MOBILE 3D GAME.

Do not add more maps/content to escape this quality gate.

After this flagship round passes on the target phone, propagate the proven gameplay + visual pipeline outward.

======================================================================
81. FULL USER-SUPPLIED PROP HUNT P0 CONTRACT — VERBATIM APPENDIX
======================================================================

The following contract was supplied by the user on 2026-08-31 and remains authoritative. Preserve it verbatim for future development agents.

# PROP HUNT P0 GAMEPLAY ENGINE REBUILD

I want you to perform a focused production rebuild of **Family Prop Hunt** in my existing Black Family Game Night project.

The current Prop Hunt has three major problems:

**1. Animation quality**

**2. Controls and movement feel**

**3. Glitchiness / instability**

These are now the **highest-priority P0 issues in the game**.

Do not spend development effort adding new maps, decorative props, particles, textures, lighting upgrades, additional game modes or other visual polish until the core gameplay below is functioning at production quality.

This is **not a cosmetic polish pass**. Treat the current implementation as a prototype of the gameplay rules and rebuild/refactor the underlying control, locomotion, animation, collision, physics and camera systems wherever necessary.

The target is a **smooth, polished third-person 3D game with console-quality control principles adapted to mobile/browser gameplay**, while retaining the immediate accessibility of a very good Roblox-style game.

---

# 1. DEVELOPMENT PRIORITY

Work in this exact priority:

1.  Input and controls 
2.  Character movement 
3.  Animation 
4.  Collision and physics stability 
5.  Camera 
6.  Aiming and shooting 
7.  Prop movement/transformation 
8.  Performance/frame pacing 
9.  Visual polish 
10.  Additional content 

**Do not hide bad controls or bad animation behind better graphics.**

A prettier environment is not progress if the player still slides, snaps, jitters, gets stuck, loses camera control or feels awkward to move.

---

# 2. PLAYER MOVEMENT

Create one robust shared production character controller for all human family characters.

Movement should feel responsive and slightly weighted:

-  very fast response to joystick/input 
-  extremely slight acceleration rather than an instant robotic snap 
-  immediate response when stopping 
-  natural animated settling step without adding control latency 
-  light joystick input = walk 
-  medium input = jog 
-  full input = run 
-  Sprint button = faster run 
-  sprint should be slightly exaggerated for fun but remain controllable 

**Character weight must come from animation, not control delay.**

Movement must be camera-relative.

Pressing forward always means moving toward the horizontal direction the camera is facing.

Normalize diagonal movement so diagonal running is not faster.

---

# 3. MOVEMENT MUST BE GAMEPLAY-AUTHORITATIVE

Normal locomotion should be controller-driven rather than root-motion-driven.

The gameplay controller determines:

-  actual player position 
-  velocity 
-  acceleration 
-  direction 
-  collision 
-  jump movement 

Animation then represents the player's actual measured motion.

An animation clip must never unexpectedly change:

-  player position 
-  velocity 
-  camera 
-  gameplay facing direction 
-  collision state 

Animation is presentation. It must not be capable of breaking gameplay.

---

# 4. MOBILE INPUT MUST BE ROCK SOLID

Build a proper pointer/touch input manager.

Explicitly handle:

-  pointerdown 
-  pointermove 
-  pointerup 
-  pointercancel 
-  lost pointer capture 
-  browser/page blur 
-  visibility changes 
-  interrupted touches 
-  simultaneous fingers 

If a touch is lost, immediately clear its gameplay input.

These bugs are **release blockers**:

-  character continues walking after joystick release 
-  camera continues rotating after finger release 
-  Sprint stays active accidentally 
-  Aim gets stuck 
-  Jump gets stuck 
-  one finger disables another control 
-  controls become unresponsive after changing tabs or losing focus 

Input should visibly affect gameplay on the **next valid simulation update**.

Never wait for an animation callback before responding to player input.

---

# 5. MOBILE CONTROL LAYOUT

Hider controls:

-  left analog movement joystick 
-  right-side drag/swipe camera 
-  Jump 
-  Sprint 
-  Change Prop 
-  Flash 
-  Decoy 
-  Lock/Align where appropriate 

Hunter controls:

-  left analog movement joystick 
-  right-side drag/swipe camera 
-  Jump 
-  Sprint 
-  Aim 
-  Shoot 

Hide controls that are irrelevant to the current role.

Do not cover the screen with unnecessary buttons or giant HUD panels.

---

# 6. CHARACTER ROTATION

Do not instantly snap the entire character toward a new movement direction.

Use smooth target-heading rotation.

Normal direction changes should blend naturally.

Large direction changes should trigger proper turning behavior.

For sharp turns, allow the character to plant and redirect.

Near-180-degree direction changes should use a convincing planted turn rather than rotating the model while its feet slide.

However, visual rotation must never make controls feel sluggish.

Gameplay response always takes priority over completing an animation.

---

# 7. PRODUCTION ANIMATION STATE SYSTEM

Replace fragile animation logic with a proper animation state machine / layered animation controller.

Human characters require at minimum:

### Grounded

-  breathing idle 
-  personality idle 
-  look around 
-  movement start 
-  walk 
-  jog 
-  run 
-  sprint 
-  movement stop 
-  left turn 
-  right turn 
-  sharp turn 
-  180-degree planted turn 

### Airborne

-  jump anticipation 
-  jump rise 
-  falling 
-  landing 

### Traversal

-  low mantle 
-  high mantle if required 

### Hunter

-  weapon idle 
-  raise weapon 
-  aim 
-  firing recoil 
-  hit reaction 

### Status

-  flash/stun 
-  elimination 
-  celebration/victory 

All transitions must blend smoothly.

No animation popping.

No animation freezing.

No character suddenly returning to T-pose/rest pose.

No restarting the same clip every few frames.

---

# 8. ANIMATION SPEED MUST MATCH ACTUAL MOVEMENT

Synchronize locomotion animation speed with actual controller velocity within sensible limits.

Eliminate visible foot sliding.

A build fails visual QA if:

-  feet are sprinting while the character barely moves 
-  the character travels across the floor while feet appear planted 
-  feet visibly skate during turns 
-  the animation plays at a noticeably different speed from movement 

Use blend parameters based on actual velocity rather than arbitrary animation timers.

---

# 9. UPPER-BODY AIMING

Hunters need layered animation.

Lower body handles:

-  walking 
-  jogging 
-  running 
-  sprinting 
-  turning 

Upper body independently handles:

-  torso aim 
-  shoulder position 
-  arm position 
-  head direction 
-  weapon alignment 

The hunter must be able to run while aiming naturally.

The weapon points toward the crosshair.

Allow reasonable torso rotation. Once aim exceeds that range, smoothly rotate the lower body to catch up.

Do not rotate the entire hunter model like a rigid statue.

---

# 10. FOOT PLACEMENT

Add restrained foot-placement IK where technically appropriate.

When standing or moving slowly:

-  feet should follow floor height 
-  feet should not float 
-  feet should not disappear through ramps or steps 
-  knees should react naturally to small height differences 

Fade foot IK during:

-  jumping 
-  falling 
-  mantling 
-  fast locomotion where needed 

---

# 11. COLLISION CONTROLLER

The player controller needs robust:

-  grounded detection 
-  slope detection 
-  wall collision 
-  ceiling collision 
-  step handling 
-  ground snapping 
-  collision skin width 
-  movement sub-stepping 
-  penetration recovery 
-  safe spawning 
-  invalid-position recovery 

Characters may never routinely:

-  fall through the map 
-  sink into the floor 
-  float above surfaces 
-  become embedded in walls 
-  vibrate against door frames 
-  get stuck between ordinary objects 
-  launch into the air after touching a small prop 
-  flick rapidly between grounded and airborne 

If penetration occurs, resolve it smoothly and automatically.

The player should not normally need to press RESET VIEW or respawn to repair gameplay.

---

# 12. FIXED GAMEPLAY SIMULATION

Movement and collision should use a stable simulation timestep or equivalent deterministic/sub-stepped architecture.

Rendering frame rate must not materially change:

-  player speed 
-  acceleration 
-  gravity 
-  jump height 
-  collision behavior 

A frame-rate drop must not cause physics explosions or movement distance changes.

Large frame deltas must be clamped/subdivided safely.

---

# 13. GROUND DETECTION

Do not rely on a single fragile ray.

Use robust capsule/sphere/multi-probe grounding logic.

Determine:

-  distance to ground 
-  ground normal 
-  slope 
-  safe standing surface 

Avoid grounded/airborne state flickering.

---

# 14. JUMPING

Use a useful Roblox-style arcade jump but animate it more naturally.

Include:

-  short jump anticipation 
-  rising phase 
-  apex/fall 
-  appropriate landing 
-  short jump-input buffer 
-  small amount of coyote time 

Do not introduce long animation locks after landing.

Gameplay responsiveness takes priority.

---

# 15. MANTLING

Players should automatically mantle sensible low obstacles rather than getting stuck against them.

Before mantling, verify:

-  valid obstacle 
-  reachable top 
-  sufficient overhead clearance 
-  valid landing area 
-  player capsule fits at destination 

Never mantle through:

-  walls 
-  ceilings 
-  shelves 
-  solid objects 
-  nonexistent floors 

---

# 16. CAMERA

Use a fairly close third-person camera.

The whole character should normally remain visible.

Normal movement camera is centered behind the character.

Hunters smoothly move toward a modest over-the-shoulder camera while aiming.

Mobile:

-  drag/swipe right side to look 
-  pinch zoom remains supported 

Player camera input always has priority.

After inactivity, the camera may gently settle toward travel direction, but never fight the player.

---

# 17. CAMERA OBSTRUCTION SYSTEM

Camera obstruction must smoothly shorten camera distance rather than clipping through geometry.

Use multiple obstruction checks/candidates rather than one fragile ray.

The camera may **never**:

-  pass through solid walls 
-  pass through roofs 
-  jump above buildings 
-  collapse into the avatar 
-  suddenly become top-down 
-  get trapped beneath geometry 
-  suddenly reverse pitch 
-  return NaN/Infinity transforms 

When an obstruction clears, smoothly return toward the player's chosen camera distance.

Decorative `solid:false` geometry must not block the camera.

---

# 18. CAMERA RECOVERY

Every frame, validate the camera solution.

At minimum ensure:

-  finite coordinates 
-  finite rotations 
-  legal pitch 
-  legal distance 
-  correct relationship to player 
-  camera not embedded in solid geometry 

If invalid, automatically restore a safe camera solution.

Do not allow one bad vector to destroy the camera.

---

# 19. NAN / INFINITY SAFETY

Validate critical:

-  positions 
-  velocities 
-  rotations 
-  camera vectors 
-  physics calculations 

If any become NaN, Infinity or otherwise invalid:

-  reject the value 
-  restore last-known-safe state 
-  log the originating system 

Never allow invalid math to cascade through the game.

---

# 20. LAST-KNOWN-SAFE PLAYER POSITION

Continuously maintain a valid recent player transform.

If a catastrophic collision/physics error occurs, recover to the recent safe transform first rather than teleporting all the way back to spawn.

Recovery should feel nearly invisible whenever possible.

---

# 21. HIDER PROP MOVEMENT

A disguised hider becomes the actual 3D prop model with appropriate dimensions/collision.

No:

-  2D sprite substitution 
-  billboard prop 
-  textured cube pretending to be the prop 
-  invisible human body with a fake prop image attached 

Prop locomotion should vary subtly according to object type:

-  barrels may roll/wobble 
-  tires rotate 
-  boxes scoot 
-  chairs shift/lean naturally 
-  small props move appropriately 

Do not give furniture visible human legs.

---

# 22. PROP TRANSFORMATION

Transformation should be fast, approximately 0.25 to 0.4 seconds.

Use a polished transformation effect rather than an abrupt model swap.

Before changing:

1.  validate candidate prop 
2.  calculate new collider 
3.  verify surrounding clearance 
4.  verify resulting position 
5.  transform 
6.  safely transition collision 
7.  update camera profile 

If the selected prop cannot safely fit, deny the transformation with subtle feedback.

Never spawn the player halfway through a wall.

---

# 23. PROP LOCK

Add **LOCK** for hiders.

When stationary, the player may lock their prop in place.

Lock should:

-  zero movement 
-  prevent tiny physics drift 
-  maintain orientation 
-  ignore accidental joystick noise 

Intentional movement immediately unlocks the prop.

Lock must be immediate and responsive.

---

# 24. PROP ALIGNMENT

Allow a stationary disguised player to rotate and align themselves naturally with nearby scenery.

Where appropriate, offer a subtle Align function to match orientation with comparable nearby environmental props.

Do not teleport the prop.

---

# 25. PROP CAMERA

Tiny props must still have a useful gameplay camera.

Do not place the camera at coffee-mug height just because the hider transformed into a mug.

Adapt the camera intelligently while retaining good room visibility.

---

# 26. DECOYS

Each hider retains 10 decoys per round.

Decoys use the current disguise.

Provide safe placement validation/preview.

Decoys may have extremely subtle randomized reactions such as:

-  wobble 
-  small orientation shift 
-  minor response to being shot 

Do not make decoys obviously artificial.

---

# 27. FLASH

Each disguise grants one flash.

Flash should:

-  throw toward camera/crosshair direction 
-  create a strong but short visual impairment 
-  briefly affect directional audio 
-  make aiming difficult 
-  not completely disable hunter movement 
-  recover quickly 

Target roughly 1.25 to 1.75 seconds of strong impairment followed by rapid recovery.

---

# 28. HUNTER AIMING AND SHOOTING

Hunters use:

-  Aim 
-  Shoot 
-  mild hip-fire where appropriate 
-  over-the-shoulder aiming camera 
-  crosshair 
-  recoil animation 
-  muzzle/energy effect 
-  impact effects 
-  directional firing sound 

Unlimited ammo remains.

Apply a sensible maximum fire rate so players cannot produce absurd shot spam.

Add extremely mild touchscreen aim assistance.

It may help fingers but must **not auto-play the game**.

No aggressive target snapping.

---

# 29. DAMAGE FEEDBACK

A successful hunter hit on a disguised player should provide:

Hunter:

-  subtle hit marker 
-  satisfying hit sound 
-  impact effect 

Hider:

-  brief prop reaction/jolt 
-  health feedback 
-  subtle camera response 

Do **not** reveal the player with giant glowing outlines.

Hiders generally require approximately three successful hits to eliminate.

Health carries across disguise changes.

---

# 30. ENVIRONMENT RESPONSE

Shooting normal environmental props should produce appropriate feedback:

-  wood impact 
-  metal impact 
-  small object wobble 
-  appropriate sound 
-  restrained particles 

Do not use uncontrolled physics capable of launching objects or players across the map.

---

# 31. DOORS

Doors should function naturally.

Players should be able to:

-  interact with doors 
-  push suitable doors open while moving 
-  chase through doorways without becoming stuck 

Door collision must not trap the player or camera.

---

# 32. COLLISION LAYERS

Separate collision responsibilities for:

-  player bodies 
-  camera obstruction 
-  static world 
-  movable props 
-  disguised hiders 
-  projectiles 
-  triggers 
-  decorative non-solid objects 

A decorative mesh should never unexpectedly trap a character or camera.

---

# 33. DOGS

Kelsi, Molly and Gunner must use proper quadruped movement/animation systems.

They are **not short humans**.

Dogs require:

-  quadruped idle 
-  walk 
-  trot 
-  run 
-  sprint 
-  turn 
-  jump 
-  land 
-  reactions 
-  appropriate collision profile 
-  dog-specific camera anchor 

Do not blindly retarget human animation onto dog skeletons.

---

# 34. CHARACTER RETARGETING

Shared animation families are acceptable, but every avatar must have validated retargeting.

Check for:

-  foot contact 
-  shoulder alignment 
-  wrist angle 
-  knee deformation 
-  body proportions 
-  weapon grip 
-  camera anchor 

Do not simply stretch one animation onto every character.

---

# 35. ANIMATION WATCHDOG

If an animation or clip fails:

-  do not freeze controls 
-  fall back safely to idle/locomotion 
-  log the error 

Missing animation assets must never make the player unplayable.

---

# 36. ASSET VALIDATION

Before spawning a playable avatar, verify:

-  skeleton 
-  required bones 
-  scale 
-  orientation 
-  animation clips 
-  attachment sockets 
-  collision profile 
-  avatar height 
-  foot placement 
-  camera anchor 
-  weapon attachment 

Catch broken assets before gameplay begins.

---

# 37. PERFORMANCE

Target **60 FPS** on supported phones.

Gameplay must still remain stable and responsive around 30 FPS.

If performance drops, reduce visual expense before gameplay fidelity.

Reduction order should favor:

1.  expensive shadows 
2.  distant detail 
3.  particles 
4.  reflections 
5.  other nonessential graphical effects 

Do not degrade the core controller/collision simulation first.

---

# 38. P0 RELEASE-BLOCKING GLITCHES

Treat all of the following as failures:

-  stuck movement 
-  stuck joystick 
-  camera trapped in geometry 
-  top-down camera collapse 
-  avatar stuck in floor/wall 
-  character jitter 
-  foot skating 
-  broken animation transition 
-  T-pose/rest pose appearing 
-  sudden teleport without recovery reason 
-  physics launch 
-  camera jump 
-  nonresponsive Jump/Sprint/Aim/Shoot 
-  prop collider exploding on transformation 
-  avatar facing wrong direction while moving 
-  weapon aiming away from crosshair 
-  animation preventing control input 

Do not classify these as minor polish issues.

---

# 39. AUTOMATED TESTING

Create or strengthen automated tests for:

-  movement 
-  diagonal speed 
-  jumping 
-  grounded detection 
-  collision 
-  slopes 
-  doorways 
-  camera obstruction 
-  camera recovery 
-  camera pitch 
-  spawn validation 
-  frame-delta variation 
-  pointer cancellation 
-  lost focus 
-  animation states 
-  animation transitions 
-  prop transformation 
-  large/small prop clearance 
-  lock/unlock 
-  NaN/Infinity recovery 
-  last-known-safe recovery 

But automated tests are only **Gate 1**.

---

# 40. REAL-DEVICE GAMEPLAY GATE

Automated test success does **not** mean Prop Hunt is finished.

Gate 2 requires hands-on gameplay on at least:

-  mobile phone 
-  desktop 

Test all of the following manually:

-  walk slowly 
-  jog 
-  run 
-  sprint 
-  stop abruptly 
-  repeatedly change direction 
-  circle movement 
-  180-degree turn 
-  jump repeatedly 
-  jump near ledges 
-  mantle 
-  run through doors 
-  hug walls 
-  navigate clutter 
-  aim while standing 
-  aim while moving 
-  shoot while moving 
-  rotate camera against walls 
-  enter tight rooms 
-  pinch zoom 
-  become very small prop 
-  become large prop 
-  rotate prop 
-  lock/unlock 
-  use decoys 
-  use flash 
-  chase another player 
-  play several continuous minutes without Reset 

If any of these visibly **looks or feels poor**, Prop Hunt fails the gate even if every automated test is green.

---

# 41. VISUAL PROOF REQUIRED

Do not tell me that the rebuild is successful based only on code changes or automated test counts.

I want actual proof from the running build.

After implementing this P0 rebuild, provide:

-  screenshots from actual Prop Hunt gameplay 
-  confirmation of real-device testing 
-  animation/state audit results 
-  control/input test results 
-  camera/collision test results 
-  remaining known defects 

Do not conceal or downgrade remaining problems.

---

# 42. STOP CONDITION

**Do not move on to additional Prop Hunt content until the gameplay foundation passes.**

The current largest problems are **animation, controls and glitchiness**.

I want these engineered to the highest practical standard possible.

Continue debugging, refactoring and retesting instead of declaring success after the first working implementation.

When an issue is found, identify its root cause rather than stacking temporary patches on top of it.

Reuse the shared fixes anywhere else in Black Family Game Night that uses the same third-person controller, animation, camera or collision architecture, but make **Prop Hunt the primary visual and gameplay validation gate**.

**The goal is no longer “Prop Hunt runs.” The goal is “Prop Hunt feels like a finished 3D game.”**

Please begin by auditing the current Prop Hunt implementation against this contract, identify the root causes of the current poor controls, animation and glitchiness, then implement the P0 rebuild in priority order. Do not ask me to choose technical implementation details when there is a clearly superior gameplay-engineering option. Use your best judgment and prioritize actual player feel.

======================================================================
82. FINAL W32 HANDOFF INSTRUCTION
======================================================================

When resuming work from this master prompt:

1. Treat the W32 coded Prop Hunt branch as the active visual/gameplay branch after Build 54.
2. Preserve Build 54's controller/input/physics fixes unless a measured regression proves a change is necessary.
3. Preserve Build 52 John only as a temporary V1 family visual baseline; do not mistake it for final character art.
4. Preserve the W25 real-production-asset rule for shop and cabin.
5. Preserve the Build 48 cabin fallback/regression protections.
6. Continue making actual coded/runtime assets closer to the approved visual target.
7. Do not use AI mockups as evidence of implementation.
8. Run automated gates, but never stop there.
9. Cold-test the exact final ZIP.
10. Show actual running proof when the environment permits it and require target-device confirmation before Device Approved.

The user's quality preference is explicit: continue improving rather than declaring victory at the first technically working version. Visual quality, animation, controls and stability all need to cross the line together.
