# Phone QA: GAME-NIGHT-STAGING-PHASE-H-TABLETOP-06

Before testing, confirm the visible build ID is exactly:

`GAME-NIGHT-STAGING-PHASE-H-TABLETOP-06`

Close and reopen the browser tab after deployment so the new service-worker cache is active.

## Marbles & Jokers

Check:

- board is centred in the usable play area
- empty track spaces look recessed rather than flat
- marbles look round, glossy and seated in sockets
- Start areas are obvious
- Home channels are obvious and distinct from Start
- five cards are readable and selectable
- playable card highlighting is understandable
- selected card rises clearly
- legal marble and destination highlighting is understandable
- marble movement follows the route rather than teleporting
- two-finger pinch zoom works
- one-finger empty-board pan works while zoomed
- pinch/pan does not accidentally select a piece
- browser page itself does not zoom on the board
- Fit/Reset restores the view

## Cribbage

Check:

- hand sorts Ace through King
- selecting the required crib cards automatically submits them
- no hidden Send button is required
- GO appears directly above/near the hand only when legal
- rapid taps do not submit extra cards

## Crazy Eights Countdown

Check:

- all players' names are readable
- current countdown stage is clear
- previous stage is crossed out
- the progress panel does not cover the hand

## Shared tabletop

Check:

- required draw pile visibly highlights
- Party reaction appears and synchronizes
- Sly reaction appears and synchronizes
- in-game How to Play is accessible
- guided demo opens without destroying the live game

## Prop Hunt regression check

This is a gameplay regression check, not visual-art approval.

Verify:

- initial camera behind player
- movement joystick
- right-side touch look
- pinch camera zoom
- jump and sprint
- Reset View
- wall/roof camera recovery
- hunter/hider controls remain role-appropriate

Record separately whether John and Papa's Shop meet the visual target. They are not claimed as approved in this build.

## Report each problem with

- observed symptom
- game
- device/browser
- location/phase
- screenshot or video
- whether Reset/Fit recovered it
- build ID shown on screen
