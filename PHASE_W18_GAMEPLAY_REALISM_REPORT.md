# Black Family Game Night W.18 Release Report

Release: `GAME-NIGHT-STAGING-PHASE-W18-GAMEPLAY-REALISM-40`  
Date: 2026-08-28

## Base build
W.18 was built cumulatively from W.17 Cabin Cosmetics Polish 39. Existing Cabin, cosmetics, multiplayer, birthday, Prop Hunt, Island Life and other non-conflicting work is retained.

## Completed repairs and upgrades

### Backgammon
- Retained tap-checker -> tap-destination as primary play.
- Added generated LEGAL MOVES buttons as a guaranteed fallback for small/failed hit targets.
- Added immediate refresh for backgammon movement actions.

### Blackgammon
- Four-single allocation still supports tapping two dice.
- Added authoritative `KEEP X + Y` pair controls through `blackAllocateSingles`.
- Added direct legal-checker move fallback buttons.
- Added immediate refresh for allocation and movement.

### Deck Sweep
- The four exposed player-front cards are now playable while the hand is nonempty.
- Matching hand and exposed-table cards can be combined in one play.
- Face-down cards retain the staged unlock rule after hand/exposed cards are cleared.

### Campfire Chaos
- Pending Draw Stack 4 resolves through `campDrawPenalty`, draws the full pending amount, clears the pending/challenge state and advances play.
- Client refresh now happens immediately after penalty/draw/play/keep actions to avoid apparent deadlocks.

### Golf
- Rejecting a card taken from stock or visible discard requires flipping one own face-down card while more than one hidden card remains.
- When exactly one hidden card remains, the rejected card can be discarded and the last own card remains hidden while play continues.

### Mexican Train
- Removed the literal table/furniture feel from the core rail surface.
- Central engine, boneyard, distinct player trains and `MEXICAN TRAIN · COMMUNITY` are emphasized.
- Viewer train is prioritized visually.
- Doubles remain crosswise and the UI explicitly requires another domino to close the double.
- Common layout/rule behavior was checked against MexicanTrain.com; the user's one-at-a-time/double continuation house rule is authoritative.

### Trail Trouble
- Added Quick Move direct fallbacks generated from legal actions.
- Kept card/marker board play as primary interaction.
- Trail actions now refresh immediately.

### Prairie Pots
- Added prominent direct PLAY controls tied to legal `prairiePlay` actions.
- Prairie play/continue actions refresh immediately.

### Family Mystery
- Raised 3D-style clue movement blocks with reachable glow.
- Tap the final reachable block/room and animate the full route automatically.
- Added obvious kitty-corner secret passages:
  - Camper <-> Living Room
  - Shop <-> Papa's Shop
- Added closer room-arrival cinematic view.
- Brought Cabin artwork into the board/room presentation using the cabin aerial, starter room and approved Cabin shop visual targets.
- Increased dimensional shadows, borders, room presentation, standee depth and warm Cabin realism.

### Molly's Light Chase
- Replaced active Neon Snake with Molly's game.
- Molly uses the approved puppy artwork and continuously chases glowing lights on a 20x20 play grid.
- Each light grows a glowing paw-print trail and score.
- Boundary/self-trail collision ends the run.
- Speed ramps as score rises.
- Keyboard, swipe and visible mobile direction controls are supported.
- Best score and achievements are retained.
- Old `/neon-snake.html` is only a compatibility redirect to Molly's Light Chase and is no longer an active shelf/tutorial/service-worker entry.

### Naming
- Active user-facing runtime now uses `Lizzy` or `Elizabeth` only.
- Legacy internal aliases may remain for compatibility but resolve to the same Elizabeth identity.

## QA
- `npm run check`: PASS
- Node syntax checks: PASS
- Full automated suite: **531 / 531 passing**
- `npm run staging:validate`: **227 pass, 0 fail, 2 warnings** (existing Three.js CDN dependency; Wrangler deployment executable unavailable in this packaging environment)
- Dedicated W.18 regression suite added in `test/phase-w18-gameplay-realism.test.mjs` for the reported gameplay and presentation failures.

## Device QA note
The codebase and automated interaction/state regressions pass in this environment. Final touch-target feel, animation timing and visual framing should still be checked on the actual phones/tablets used by the family before calling the visual polish immutable, because automated tests cannot reproduce every real-device browser quirk.
