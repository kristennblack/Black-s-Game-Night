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
