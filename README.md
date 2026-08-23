# Black Family Game Night v1.8.0-prop-redesign-test

This test release is a **deep Prop Hunt presentation/renderer redesign**. The goal is to move the browser game much closer to the approved cozy, detailed Prop Hunt concepts instead of continuing to decorate the old prototype renderer.

## Prop Hunt v1.8

### Camera and role clarity
- Corrected the camera basis that could render the world inverted.
- Added an explicit **YOU ARE A HIDER / YOU ARE A HUNTER** banner and **HIDING MODE / SHOOTING MODE** ribbon.
- Hiders and hunters now receive different action clusters rather than one ambiguous control set.
- Hunter AIM tightens the third-person camera/FOV.

### Illustrated props
- Added a 44-image rustic/cartoon prop sprite library derived from the approved Prop Hunt art direction.
- Scenery and player disguises use the same sprite lookup, so a disguised object matches the ordinary world object.
- Procedural drawing remains only as fallback for object types that do not yet have a dedicated sprite.

### Richer rooms and buildings
- Room-specific object palettes populate kitchens, bedrooms, bathrooms, mudrooms, shops, barns, campsites and outdoor areas differently.
- Clutter density is substantially higher in major rooms.
- Structural faces now receive log/plank/fence/metal detailing.
- Ground/floors now receive wood, gravel, grass, earth or water-edge treatment based on the area.
- Added fixed room dressing/fixtures so large rooms read as furnished spaces rather than geometry boxes.

### Retained expansion
- Keeps all of the larger v1.7 maps, named areas, AREA indicator and player-only minimap.
- Keeps full-body family characters, avatar-style HUD, phone joystick/D-pad, jump/climb, sprint, camera reset, flash, decoy and prop lock.

## Other retained work
- Family Mystery v1.6 deduction/board/mobile upgrades.
- Cribbage phone layout and detailed scoring review.
- Global suit + high-to-low card sorting.
- Avatar packs and per-bot character/style/difficulty setup.
- Black Family Lodge birthday home and animated fireplace.

## Verification

`npm run check` passes **193 / 193 automated tests** with **0 failures**.

Prop Hunt is still a custom browser 2.5D/third-person renderer rather than a fully modelled WebGL game. v1.8 substantially improves the renderer, artwork, HUD, material treatment and world dressing while preserving the existing game rules and family systems.
