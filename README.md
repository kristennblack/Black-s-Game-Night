# Black Family Game Night

**Build:** `GAME-NIGHT-STAGING-PHASE-H-TABLETOP-06`  
**Package:** `3.0.1-staging-phase-h-tabletop-06`  
**Status:** Staging / real-device QA candidate

## What this package is

This full-replacement source package combines the accepted gameplay-recovery foundation with the latest tabletop and application UX work. The strongest new visual work is in **Marbles & Jokers**, including recessed board sockets, glossy seated marbles, clearer Start and Home treatment, and mobile board gestures.

This is not a claim that the Prop Hunt art has reached the approved John and Papa's Shop reference standard. The technical Prop Hunt asset pipeline and repaired controller remain included, but the character likeness and final environment-art gate remain open.

## Phase H highlights

- Marbles & Jokers dimensional physical-board presentation
- recessed track, Start and Home sockets
- glossy marbles with contact depth
- routed Home channels
- pinch zoom, empty-board pan and mouse-wheel zoom
- animated marble movement waypoints
- visible draw-required pile highlighting
- Crazy Eights Countdown stage panel
- Cribbage Ace-through-King hand sorting
- automatic crib-card submission
- contextual GO control above the hand
- guided Game School interaction scenes
- in-game How to Play access
- Party and Sly quick reactions
- Prop Hunt right-side touch look and camera pinch zoom

## Earlier work retained

The package retains E1/E2/F/G systems, including:

- third-person camera, collision, movement, spawn and recovery repairs
- Reset View and camera obstruction handling
- Prop Hunt shot/disguise/decoy safety repairs
- immediate legal single-card play where appropriate
- complete vertical Buddy score sheets
- Smear's visible six-card bidding hand
- saved Avatar Hub profile and clothing-colour contract
- Requests, Leaderboards and shared match-end flow
- Trail Trouble five-card hands, private reconnect state, bots and board gestures
- Cloudflare Workers Static Assets + Durable Object architecture

## Test status

The source used for this package records:

- `npm run check`: **259 / 259 tests passing**
- `npm run build`: **120 passes, 2 warnings, 0 failures**
- production GLB audit: **PASS**
- Phase G technical vertical-slice audit: **PASS**

The warnings are intentional and declared:

1. Three.js and selected addons still load from external CDNs.
2. Wrangler is unavailable in the packaging environment, so actual Cloudflare deployment is unverified.

## Prop Hunt art warning

The included John, shop, barn and prop GLBs validate technically. That does not mean they have passed the user's visual-reference gate. The approved family lineup and rustic-property artwork remain the target for a future proper DCC asset-production pass.

## Install and validate

```bash
npm install
npm run check
npm run build
```

Expected:

- 259 tests pass
- 0 build-validation failures

## Deploy to staging

```bash
npm run deploy:staging
```

Do not overwrite the production Worker until phone QA is complete. Confirm that the running screen displays:

`GAME-NIGHT-STAGING-PHASE-H-TABLETOP-06`

Then follow `PHONE_QA_PHASE_H_TABLETOP_06.md`.

## Scope not included

The supplied Mexican Train, Skip-Bo and Backgammon specifications describe full new game modules. They are not included in this package and should be implemented in separate controlled phases after the current staging work is accepted.
