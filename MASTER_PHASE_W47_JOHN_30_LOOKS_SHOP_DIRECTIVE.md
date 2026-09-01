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
