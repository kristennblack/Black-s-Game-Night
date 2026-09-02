# Phone QA - Phase P1 Flagship Upgrade 14

Build expected: `GAME-NIGHT-STAGING-PHASE-P1-FLAGSHIP-UPGRADE-14`

The purpose of this QA pass is visual/game-feel acceptance, not just technical validation.

## A. Home screen

- Confirm the approved cozy cabin composition is present.
- Confirm John remains integrated into the fireplace scene.
- Confirm Game Shelf names are sharp and do not appear doubled/blurry.
- Confirm the new game medallion icons read cleanly at phone size.
- Confirm game controls feel dimensional/crafted rather than flat web cards.
- Confirm selection/press states do not obscure labels.

## B. Prop Hunt PH-CHAR-01 - John

Capture screenshots/video of John:

1. front three-quarter idle
2. side view
3. rear view
4. walking
5. running/sprinting
6. stopping/turning
7. jumping and landing
8. mantling/climbing a reasonable surface
9. aiming while walking/running
10. firing while walking/running
11. in the main Papa's Shop doorway for scale
12. beside the tractor/workbench
13. near Papa's yellow chair/fireplace lighting

Fail the visual gate if:

- face/l likeness is not recognizable enough
- proportions, hands, feet or clothing look obviously broken from normal gameplay distance
- feet visibly skate during ordinary movement
- aiming freezes/replaces lower-body locomotion
- weapon attachment visibly separates from the hands
- character clips through ordinary floor/doorway geometry

## C. Camera/game feel

- Start a Prop Hunt round and verify camera begins in a sensible third-person position.
- Run underneath roofs/awnings and near walls.
- Jump/mantle while rotating camera.
- Confirm no top-down collapse, inside-character spawn, severe clipping, pinned-camera state or persistent roof trapping.
- Test Reset View.

## D. Aim/shoot

- Confirm crosshair is clearly readable.
- On touch, place a target just inside the small assist cone and confirm assistance is mild rather than snapping the camera.
- Confirm walls/solid props still block shots.
- Confirm Shoot is comfortably reachable and visibly distinct from other action buttons.

## E. Papa's Shop

- Check shop/barn architecture, tractor, motorcycle, workbench, tool chest, shelving, fireplace and yellow Papa chair from normal gameplay distance.
- Confirm shop remains navigable and collision matches visible architecture well enough for play.
- Check interior/exterior lighting transitions and shadow readability.
- Check performance while moving quickly through the cluttered shop.

## F. Preservation smoke test

- Confirm Backgammon and Black Gammon both remain on the shelf.
- Confirm a bot defaults to Easy and Medium/Hard can still be selected.
- Confirm bot chooser text/options remain readable.
- Confirm one non-3D card/board game still creates/joins normally.

Do not lock PH-CHAR-01 or Papa's Shop as visually approved until the running-game proof meets the intended quality bar.
