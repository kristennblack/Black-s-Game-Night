# Phase H Tabletop Staging Report

**Build:** `GAME-NIGHT-STAGING-PHASE-H-TABLETOP-06`  
**Package:** `3.0.1-staging-phase-h-tabletop-06`  
**Status:** Staging candidate, not production visual signoff

## Implemented in the current source

### Marbles & Jokers

- crafted physical-board styling
- recessed/drilled socket treatment for the shared track
- recessed Start pockets
- routed player-colour Home channels
- glossy radial-shaded marble pieces
- visual seating/contact depth between marble and socket
- board pinch zoom on touch devices
- empty-board one-finger pan while zoomed
- mouse-wheel zoom on desktop
- Fit/Reset-style view support
- waypoint path generation for track and Home movement

### Shared tabletop and card UX

- draw-required deck/pile highlighting
- Crazy Eights Countdown player stage panel with previous stage struck out
- Cribbage Ace-to-King sort order
- Cribbage automatic crib submission after the required selection count
- contextual Cribbage GO control near the hand
- Game School guided interaction scenes for requested tabletop games
- in-game How to Play access that does not replace the live match
- Party and Sly quick reactions through the shared reaction system

### 3D controls retained and extended

- Prop Hunt right-half touch-look
- two-finger third-person camera zoom
- recovered third-person camera solver and automatic collapse recovery

## Verification

- JavaScript syntax checks: PASS
- full automated suite: 259 / 259 PASS
- static/package validator: 120 PASS, 2 WARN, 0 FAIL
- production GLB audit: PASS
- Phase G technical vertical-slice audit: PASS

## Render evidence

Actual Marbles renderer captures produced during development are included as QA evidence:

- `MARBLES_ACTUAL_RENDERER_DESKTOP_PROOF.png`
- `MARBLES_ACTUAL_RENDERER_MOBILE_PROOF.png`
- `MARBLES_ACTUAL_AFTER_DRAW_PROOF.png`
- `MARBLES_ACTUAL_SELECTED_CARD_PROOF.png`

These do not replace real-phone QA.

## Known limitations

### Prop Hunt

The gameplay and technical asset pipeline are present, but John likeness and Papa's Shop visual quality have not passed the approved-reference gate. This build must not be described as final Prop Hunt art.

### Cloudflare

Wrangler was unavailable in the packaging environment. Actual deployment is therefore UNVERIFIED.

### External dependencies

Three.js core and selected addons remain externally loaded through CDNs.

## New-game scope

Mexican Train, Skip-Bo and Backgammon are not implemented in this package. Their supplied specifications require separate rules, multiplayer, bot, tutorial, UI and QA phases.
