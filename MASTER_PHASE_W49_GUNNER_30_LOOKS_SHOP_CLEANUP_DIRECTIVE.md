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
