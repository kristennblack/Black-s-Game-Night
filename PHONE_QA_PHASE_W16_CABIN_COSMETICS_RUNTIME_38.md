# Phone QA — W.16 Cabin + Cosmetics Runtime 38

Use the exact packaged build on a real phone.

## Home
- [ ] Home visibly shows **Visit the Cabin** without scrolling through a hidden settings/menu flow.
- [ ] Tapping it opens `/cabin.html`.
- [ ] Back/Lodge returns to Home.
- [ ] Cabin Shop + Cosmetics link opens the merged store.

## Cabin overview
- [ ] Aerial cabin image fills the useful screen area without unreadable microscopic room labels.
- [ ] Each named family room opens correctly.
- [ ] Guest House opens a permanent guest-room key for a guest profile.
- [ ] My Room route resolves to the correct owner room.

## Room editor
- [ ] Owner can add owned starter/blueprint items.
- [ ] Move controls change placement in 0.5-ft steps.
- [ ] Rotate changes by exactly 90°.
- [ ] Save persists after full reload.
- [ ] A visitor cannot move/remove/save furniture.
- [ ] Visitor can leave reaction and guest-book message.
- [ ] Unowned token/secret reward item cannot be injected through the normal UI.

## Merged shop
- [ ] ALL / ROOM / WEAR tabs work.
- [ ] Search finds both room items and wearables.
- [ ] Room category filters work.
- [ ] Wearable category filters work.
- [ ] Starter room blueprints show Owned.
- [ ] Buying an eligible room blueprint deducts the correct Game Night Tokens.
- [ ] Earned/secret room items are not purchasable.
- [ ] Wearable purchase/equip/unequip works.
- [ ] Game Night Token balance stays synchronized after reload.

## Portrait cosmetic fit
Check more than one portrait variant per person.
- [ ] Hats sit above/on the hairline rather than in the forehead.
- [ ] Glasses sit over the eyes rather than eyebrows/cheeks.
- [ ] Headphones cup the sides of the head and do not cross the mouth/nose.
- [ ] Scarves/necklaces stay around the neck/chest.
- [ ] Tops remain below the face.
- [ ] A portrait that already has glasses does not receive a second pair.
- [ ] A portrait that already has a hat does not stack another hat.
- [ ] Elizabeth glam can suppress built-in-earring conflicts while still allowing a necklace.
- [ ] Cosmetics remain readable at small card-table avatar sizes.

## Card/tabletop regression
- [ ] Enter at least one card game with cosmetics equipped.
- [ ] Equipped cosmetic is visible on the player portrait.
- [ ] Cards, bids, score UI and touch targets are not blocked by an oversized cosmetic.
- [ ] Other players' fitted cosmetics render consistently when their profile state includes them.

## Performance / stability
- [ ] Opening shop with the combined catalog does not freeze the phone.
- [ ] Scrolling the catalog remains responsive.
- [ ] Cabin route survives background/resume.
- [ ] No missing-image icons appear.
- [ ] No old emoji cosmetic appears anywhere.
