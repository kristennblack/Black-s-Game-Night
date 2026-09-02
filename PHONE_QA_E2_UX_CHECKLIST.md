# Phone QA Checklist - 3D-STAGING-PHASE-E2-UX-03

Stop immediately if the visible staging build ID is not exactly `3D-STAGING-PHASE-E2-UX-03`.

## A. Home screen

- Home loads without broken images.
- John focal portrait uses the intended approved reference look and is framed well.
- BLACK FAMILY / GAME NIGHT hierarchy reads clearly.
- No bouncing/jittering title text.
- Firelight is restrained, not distracting.
- Game cards do not overlap.
- Buttons are finger-sized.
- No notch/safe-area collisions.
- Smaller phone portrait remains readable.
- Tablet and desktop use the available width without stretching cards absurdly.
- Try OS reduced-motion mode and confirm ambient motion stops/reduces.

**Visual result is not pre-approved by automated tests. Judge it directly.**

## B. Screw Your Buddy immediate card play

- Reach normal card-playing phase.
- Legal cards are highlighted/active.
- Tap one legal card once: it should acknowledge immediately and play without a Confirm button.
- Rapidly double tap the same legal card: only one server play should occur.
- Tap an illegal/grey card: it must not play.
- Confirm hand and center trick update correctly.
- Confirm turn advances according to existing rules.
- Repeat over several tricks and at least two rounds.

## C. Fuck Your Buddy immediate card play

Repeat B, including Joker/power-rank situations. The server rule engine must remain authoritative.

## D. Smear immediate card play

Repeat B. Bidding remains multi-step where required. Normal card-to-trick play should be single tap.

## E. Genuine multi-step actions

Spot-check:
- Cribbage crib selection still allows multiple card choices before commit.
- Marbles & Jokers / Trail Trouble still allow card + pawn/target selection.
- Golf still preserves draw then swap/discard/flip decisions.
- Any wild/suit/target choice still receives the extra choice it genuinely needs.

## F. Screw Your Buddy complete score sheet

At round end verify:
- every scheduled round is already represented vertically
- completed earlier round scores remain visible
- current/just-completed row is highlighted
- future rounds are visible with neutral empty cells
- player totals are easy to find
- vertical scroll works
- horizontal scroll works only when needed for many players
- text remains readable at phone size

## G. Fuck Your Buddy complete score sheet

Verify the sheet uses the actual schedule generated for that game, including hand/trump/power data. Confirm earlier scores, future rounds, highlight and totals as in F.

## H. Standard 3D UI

Open each game WITHOUT `qa3d=1`:
- no large QA panel
- no developer missing-asset warning banner over play
- build ID remains visible but unobtrusive
- compact ↔ shoulder control visible
- compact ↺ Reset View visible
- +/- zoom visible but not dominating the action
- settings/audio buttons compact
- joystick/action buttons do not cover the character or central play area

## I. Prop Hunt gameplay regression

- spawn safely
- walk/run/jump/climb
- orbit and zoom camera
- test inside Papa's Shop/barn and beside roof/shelves/tractor
- Reset View
- hunter shoot around walls/props and verify muzzle obstruction behavior
- hider disguise near props at different heights
- place decoy on elevated support and confirm correct height
- test Flash/Decoy/Lock/Prop controls

## J. Island Life gameplay regression

- spawn/load correct world
- movement/jump/zoom/orbit/reset
- interaction LOS around furniture/objects
- visitor movement does not walk directly through blocking geometry in obvious cases
- home interior camera remains readable

## K. Birthday Seat gameplay regression

- spawn/checkpoint
- run/jump/fall/land
- moving platform carry
- Reset View
- camera keeps the forward route understandable
- no extreme overhead tilt in normal play

## L. QA mode

Repeat one game with `?qa3d=1` and confirm QA diagnostics and exact asset-error reporting are available when deliberately enabled.

## M. Art acceptance truth

This build still contains procedural/fallback 3D art. Do not accept the visual-art milestone merely because controls/UI are cleaner. The proper John/Gunner/Papa's Shop authored vertical slice remains an external 3D production step.
