# Black Family Game Night

**Build:** `GAME-NIGHT-STAGING-PHASE-Q-MOBILE-TABLETOP-UX-15`  
**Package:** `3.2.0-staging-phase-q-mobile-tabletop-ux-15`  
**Status:** Staging / real-device portrait QA candidate

## Phase Q: Mobile tabletop UX rebuild

Phase Q adds `MASTER_MOBILE_TABLETOP_UX_DIRECTIVE.md` and applies its first two priorities: **Skip-Bo** and **Cribbage**. The new rule for applicable tabletop games is that the game itself should occupy the useful portrait-phone screen. Normal turns should not require navigating a tiny zoomable table.

### Skip-Bo

Skip-Bo now has a dedicated portrait-first play surface rather than using the generic zoom/pan tabletop viewport.

- opponent hands remain private and show count only
- opponent stock and four discard tops remain visible
- four shared build piles stay in the central action zone
- the draw pile sits beside the builds
- the player's stock and four discard piles stay directly above the hand
- all five hand cards remain identifiable, with slight overlap permitted on narrow screens
- tap a source card, then tap a directly highlighted destination
- legal destinations glow; invalid destinations dim
- a hand card can be sent directly to a build or one of four discard piles without opening a generic move list
- decorative framing is reduced so the cards dominate

### Cribbage

Cribbage now uses a more physical, readable board presentation and preserves scoring evidence that previously disappeared too quickly.

- wood crib-board presentation with player-color identity
- current and previous peg positions
- short peg movement feedback
- played pegging cards identify the player who played them
- running count stays central and readable
- crib remains private until the scoring state
- scoring data now preserves actual hand/crib cards, starter, point details, and score movement
- completed hand/crib recap remains visible after the next deal begins
- player seating is presented side-by-side instead of relying on the generic oval-table layout

### Shared tabletop direction

After Skip-Bo and Cribbage are proven on a real phone, the same principle can be audited game-by-game for Mexican Train, Marbles & Jokers, Backgammon, Black Gammon, and other tabletop modules. The principle is reusable; the exact layout is not forced onto every game.

## Preserved systems

Phase Q is intentionally focused. It preserves the Phase P1 Prop Hunt flagship work, existing multiplayer/reconnect behavior, Black Gammon and regular Backgammon, Easy-first bot defaults, player colors, room/lobby behavior, chat/reactions, and the existing game-rule engines except for the Cribbage public scoring evidence needed by the new UI.

The separate `MASTER_3D_DEVELOPMENT_DIRECTIVE.md` continues to govern the 3D flagship track. `MASTER_MOBILE_TABLETOP_UX_DIRECTIVE.md` governs applicable tabletop/card-game presentation.

## Validate locally

```bash
npm run check
npm run build
python tools/audit_production_assets.py
```

Recorded release results are in:

- `PHASE_Q_TEST_RESULTS.txt`
- `PHASE_Q_BUILD_VALIDATION.txt`
- `PHASE_Q_ASSET_AUDIT.txt`
- `PHASE_Q_PACKAGE_VERIFICATION.txt`

## Important visual status

Automated checks do **not** equal phone approval. Phase Q remains staging until Skip-Bo and Cribbage are inspected on a real portrait phone for card readability, touch comfort, fit, peg readability, and scoring clarity.

See `PHONE_QA_PHASE_Q_MOBILE_TABLETOP_UX_15.md`.

## Deploy to staging

```bash
npm run deploy:staging
```

Confirm the visible build ID is:

`GAME-NIGHT-STAGING-PHASE-Q-MOBILE-TABLETOP-UX-15`
