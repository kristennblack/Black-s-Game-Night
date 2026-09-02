# Phase R Phone QA

## Build to verify
`GAME-NIGHT-STAGING-PHASE-R-PROP-HUNT-P2-GAMMON-UX-16`

Test the deployed staging build on the portrait phone normally used for family play. Confirm the visible build ID first so screenshots are not taken from a cached Phase Q build.

# A. Family Prop Hunt: Papa's Shop / John P2

## Character appearance
- Start Papa's Shop as John.
- Capture John from front three-quarter, side and rear gameplay views.
- Confirm head, beard, eyes/brows, torso, hands and boots are visibly less block-like than P1.
- Confirm selected player-color tint changes only intended clothing regions and does not recolor skin/face/hair.

## Movement
- Walk slowly forward and turn.
- Run and sprint across the main shop.
- Jump and land.
- Mantle/climb a reasonable surface.
- Watch the feet for skating, floating or sinking.
- Watch hips/torso for stiffness or abrupt snapping.

## Aim / shooting
- Aim while standing.
- Aim while walking.
- Aim while running where allowed.
- Fire while moving.
- Confirm legs continue locomotion while the upper body aims/fires.
- Confirm weapon stays in the hands and points reasonably with the crosshair.

## Camera
- Walk through the main door, barn passage and around tractor/workbench.
- Jump near walls/roof edges.
- Confirm no top-down collapse, avatar-inside-camera, severe wall clipping or visual pinning.
- Use Reset View and confirm it reliably recovers the camera.

## Papa's Shop lighting
- Inspect fireplace/Papa's yellow chair corner.
- Inspect center work bay.
- Inspect barn interior.
- Confirm local depth is improved but the shop is still easy to navigate.
- Confirm no obvious overexposed orange blob or dark unreadable corner was introduced.

# B. Standard Backgammon

## Board layout
- Open Backgammon in portrait.
- Confirm the board is the dominant surface and is no longer trapped inside the oversized rounded green table.
- Confirm all points/checkers/bar/bear-off areas are readable without mandatory zoom.
- Tap Fit, + and - and confirm controls work.
- Confirm panning does not accidentally begin when pressing Roll or another button.

## Dice
- Start human vs bot.
- Roll the opening roll.
- Complete moves and roll the next turn.
- Confirm a visible active Roll button always responds when legally allowed.
- Confirm dice values update promptly.
- Repeat after a reconnect/reload if possible.

## Visual artifact
- Inspect the right-side player/status area.
- Confirm the long vertical blue/player-color line from the previous screenshot is gone.

# C. Black Gammon

## Opening board
- Confirm the locked 4 / 4 / 4 / 3 setup remains correct for both colors.
- Confirm player-selected colors still apply to checkers and normal dice.

## Rolling
- Roll both players' normal dice.
- Confirm normal unequal totals progress to controller/allocation correctly.
- When normal totals tie, confirm the special large die appears and works.
- If the large die ties, confirm reroll behavior still works.

## Move presentation
- Select a checker and inspect legal destinations.
- Confirm blue means forward.
- Confirm red means backward.
- Confirm gold is used for rescue/save context where applicable.
- Confirm illegal taps show a short reason rather than silently failing.

## Special rules smoke test
When practical, verify:
- double direction is one direction for the whole set;
- special single 4 behavior remains intact;
- bar priority remains intact;
- normal maximum own-color stack of 4 remains intact;
- contested-stack/rescue behavior has not changed.

# D. Regression spot checks

- Open Skip-Bo and confirm the full-screen portrait card layout still exists.
- Open Cribbage and confirm the real-board/peg/scoring-recap UI still exists.
- Add a bot in any room and confirm Easy is the default and the selector is readable.

# Report back
The most useful screenshots/video are:
1. John front/side/rear in Papa's Shop.
2. John walking/running while aiming.
3. Papa's chair/fireplace area.
4. Standard Backgammon full portrait screen with Roll available.
5. Black Gammon full portrait screen after dice are rolled.
6. Right-side player/status area proving the vertical line is gone.

Do not mark Phase R production-approved until these real-device checks are complete.
