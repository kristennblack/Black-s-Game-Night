# W49 Phone QA — Gunner 30 Looks Shop + Shop Cleanup

Candidate: `GAME-NIGHT-STAGING-CANDIDATE-W49-GUNNER-30-LOOKS-SHOP-CLEANUP-67`

## 1. Cache refresh
1. Deploy the W49 ZIP.
2. Fully close/reopen the site or hard refresh once so the new W49 service worker activates.
3. Confirm old cached broken John/Holly cards do not remain.

## 2. Looks Shop
Open `/looks-shop.html`.
- Confirm tabs: John 30, Holly 30, Gunner 30.
- Confirm John thumbnails all display.
- Confirm Holly thumbnails all display.
- Confirm Gunner thumbnails all display and visibly match the approved Gunner board.
- Buy one locked Gunner look and confirm tokens decrease once.
- Equip it, leave the shop, return, and confirm ownership/equip persists.

## 3. Gunner win rewards
- Gunner's Goat Run: save the first goat and confirm Game Night Buddy unlocks.
- Save 5 goats and confirm Trail Champion unlocks.
- Gunner's Snack Attack: reach 20 snacks and confirm Adventure Harness unlocks.
- Confirm each reward appears as owned in the same Looks Shop collection.

## 4. Cabin Room Shop
Open `/cabin-room-shop.html`.
- Search/filter items.
- Buy one affordable room blueprint.
- Confirm tokens decrease and the card becomes Owned Blueprint.
- Open the Cabin and confirm the blueprint appears in the owner's room inventory.

## 5. Player-facing cleanup
From Lodge, Arcade and Cabin navigation, confirm the shopping experience only advertises:
- Looks Shop
- Cabin Room Shop

Confirm there are no normal links for Approved Lookbook, Production Lab, John Head Fit Proof, Approval Studio or Family V1 Lab.

## 6. Regression spot check
- Open at least one card game.
- Open Prop Hunt.
- Open Cabin overview and a room.
- Confirm existing gameplay/navigation still loads.

Report any broken image with the character name + look number so the exact W49 file can be checked.
