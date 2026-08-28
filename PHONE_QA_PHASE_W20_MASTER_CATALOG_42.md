# W.20 Phone / Tablet QA — Master Catalog 42

Release: `GAME-NIGHT-STAGING-PHASE-W20-MASTER-CATALOG-42`

Use at least one phone and one tablet if possible. Test portrait and landscape where the page supports both.

## A. Fresh load / release identity
- [ ] Hard refresh after deployment and confirm W.20 loads rather than cached W.19.
- [ ] Home, cabin, store and game shelf open without a blank screen.
- [ ] No visible “Lizzie”; family character is Lizzy/Elizabeth.

## B. 4,000-item store performance
- [ ] Open the store and confirm it does not try to display all 4,000 cards at once.
- [ ] Switch All → Home → Avatar quickly without input freezing.
- [ ] Search by item name and clear the search.
- [ ] Filter by category.
- [ ] Filter by collection.
- [ ] Filter by rarity.
- [ ] Change sort order.
- [ ] Use Load More repeatedly and confirm scrolling remains responsive.
- [ ] Re-open the approved W.20 catalog lookbook/reference.

## C. Home identity consistency
Choose at least 10 items from different categories.
- [ ] Store card art is distinguishable from neighboring items.
- [ ] Large preview clearly matches the chosen card.
- [ ] After buying/unlocking, Collection/Inventory shows the same identity.
- [ ] Placing the item in the room still clearly reads as that item.
- [ ] Beds, TVs, chairs, lighting and décor do not collapse into one repeated category image.

## D. Blueprint economy / room editing
- [ ] Buy/unlock one home item once.
- [ ] Place two or more copies without another purchase.
- [ ] Tap/click a placed item to select it.
- [ ] Move it by tapping/clicking a valid destination.
- [ ] Use precision move controls.
- [ ] Rotate 90°.
- [ ] Duplicate it.
- [ ] Store/remove one copy and confirm blueprint ownership remains.
- [ ] Wall/floor surface placement behaves sensibly.
- [ ] Out-of-bounds placement is rejected.
- [ ] Save, leave room, return and confirm layout persists.

## E. Empty-room / migration behavior
For a new/fresh room:
- [ ] Room starts as bare rustic shell plus simple lighting.
- [ ] No purchased furniture is pre-placed.
- [ ] Low-end starter inventory is available but not pre-placed.

For an existing W.19 decorated room:
- [ ] W.20 does **not** wipe W.19 placements.
- [ ] Existing owned blueprints still show owned.

If an older pre-W.19 test room is available:
- [ ] It migrates to the intended bare-shell progression state once.

## F. Architectural finishes
- [ ] Find/buy a wall finish.
- [ ] Preview it before applying.
- [ ] Apply it to a compatible wall surface.
- [ ] Find/buy a floor finish.
- [ ] Apply it to the floor.
- [ ] Incompatible surface application is blocked.
- [ ] Reset wall/floor to bare pine.
- [ ] Leave/re-enter and confirm selected finishes persist.

## G. Avatar store / universal fitting
Test several humans plus Kelsi, Molly and Gunner.
- [ ] Avatar preview is large enough to judge fit.
- [ ] Hats sit on the head rather than floating far above/below it.
- [ ] Earrings remain visible.
- [ ] Glasses align with the face.
- [ ] Wigs/hair sit convincingly.
- [ ] Top + outerwear layering remains readable.
- [ ] Bottom + shoes remain readable.
- [ ] Back items do not cover the entire avatar unexpectedly.
- [ ] Funny ears/horns/wings/tails attach sensibly.
- [ ] Snapchat-style filters align with the face.
- [ ] No accessory silently disappears because of avatar choice.
- [ ] Dog clothing adapts into sensible dog presentation rather than human-shaped floating clothing.
- [ ] Equip, leave page, return and confirm equipped items persist.

## H. Signature / hero collections
- [ ] Find at least one Family Signature home object.
- [ ] Find at least one Family Signature wearable.
- [ ] Hero/signature items visibly feel more distinctive than basic items.
- [ ] Signature collections still coexist with a strong generic rustic catalog.

## I. Family Mystery art integration
- [ ] Rooms contain W.20 cabin-style objects without losing readability.
- [ ] Reachable movement blocks still light up.
- [ ] Tap a reachable destination and character route animates correctly.
- [ ] Corner-room diagonal shortcuts remain obvious and usable.
- [ ] Close/cinematic room framing still works.

## J. Prop Hunt / Papa’s Shop art integration
- [ ] W.20 rustic catalog props are visible in Papa’s Shop.
- [ ] Added décor does not block normal chase paths.
- [ ] Camera/movement recovery remains functional.
- [ ] Hunter/hider controls remain playable.

## K. Island Life art integration
- [ ] Furniture shop loads catalog-derived sample furniture.
- [ ] New sample props fit the shared rustic/cabin material language.
- [ ] World/home switching and camera behavior remain stable.

## L. Molly’s Light Chase
- [ ] Molly is visible and animated as the playable puppy.
- [ ] Light pickup works.
- [ ] Trail grows as lights are collected.
- [ ] W.20 Pet Corner/cozy cabin props appear without obstructing play.
- [ ] Old generic Neon Snake experience is not exposed as a competing Molly game.

## M. Visual/performance sanity
- [ ] No obvious broken/missing SVGs in store or room.
- [ ] No long frozen frame while filtering/searching.
- [ ] No severe scroll-jank after multiple Load More operations.
- [ ] No giant accessory causing the avatar preview to become unusable.
- [ ] No room prop renders far outside the intended placement area.
- [ ] Touch targets are usable without pixel-perfect tapping.

## Acceptance
Mark W.20 device QA complete only when the critical flows above work on the real deployment. Record device/browser, screenshots and any failing item IDs so art/fitting issues can be corrected by identity rather than by weakening the global system.
