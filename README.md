# Black Family Game Night

**Build:** `GAME-NIGHT-STAGING-PHASE-S-GAMEPLAY-TABLETOP-REALISM-17`  
**Package:** `3.4.0-staging-phase-s-gameplay-tabletop-realism-17`  
**Status:** Staging / technical validation candidate. Real-device visual approval is still required.

## Phase S focus

Phase S follows `MASTER_PHASE_S_GAMEPLAY_TABLETOP_REALISM_DIRECTIVE.md` and fixes reported gameplay blockers before applying the tabletop-realism pass.

### Gameplay repairs

- **Skip-Bo**: the exposed Stock Pile card is explicitly presented as a playable source; Stock play exposes the next card immediately; direct legal Building Pile targets remain highlighted; fresh room state is fetched after Stock/build/discard actions so the next playable Stock card appears without waiting on SSE timing.
- **Trail Trouble**: the start flow now fetches and renders fresh state immediately after the host starts; the engine regression test proves a 2-player solo game starts with five-card hands and completes a normal first turn.
- **Last Haven**: after a Camp is placed, every legal connected setup Route receives a large tap target on the board plus a fallback Route action panel; the regression test completes the full initial Camp/Route setup and proves the first regular roll/end-turn cycle continues.
- **Backgammon / Black Gammon**: Phase R's explicit post-roll refresh remains in place and is covered by Phase S regression tests.

### Tabletop realism and readability

- **Cribbage** now uses one shared physical-style wooden scoring board instead of separate player boards. Each player has a color-inlaid route, drilled-looking holes, current and previous physical-style pegs, exact peg-to-hole coordinates, short score-movement animation, revealed crib/scoring evidence, and the existing scoring explanations/recap.
- **Backgammon / Black Gammon** keep the screen-first Phase R layout and add a stronger physical-board treatment: wood grain, bevel/depth, inset points, darker center bar, dimensional checkers, shadows and physical dice treatment. Black Gammon's 4/4/4/3 setup and locked rules are unchanged.
- **Marbles & Jokers** now has a dedicated board-first route. The oversized generic felt-table shell is removed from its normal gameplay route so the board consumes the useful play area while the hand and controls stay accessible.
- **Screw Your Buddy / Fuck Your Buddy** bidding now shows the current hand size and trump/special round directly in the “How many tricks?” box.

## Preserved work

Phase S does not replace the Prop Hunt P2 benchmark, Phase Q Skip-Bo/Cribbage mobile foundation, Black Gammon rule engine, standard Backgammon rules, Easy-first bots, player colors, multiplayer, reconnect, room/seat/Ready flow, chat/reactions, leaderboard/history, or other completed games.

## Governing directives

- `MASTER_PHASE_S_GAMEPLAY_TABLETOP_REALISM_DIRECTIVE.md`
- `MASTER_NEXT_BUILD_DEVELOPMENT_DIRECTIVE.md`
- `MASTER_3D_DEVELOPMENT_DIRECTIVE.md`
- `MASTER_MOBILE_TABLETOP_UX_DIRECTIVE.md`
- `BLACK_GAMMON_MASTER_RULES.md`

## Validate locally

```bash
npm run check
npm run build
npm run assets:audit
```

Phase S validation logs:

- `PHASE_S_TEST_OUTPUT.tap`
- `PHASE_S_CHECK_OUTPUT.txt`
- `PHASE_S_BUILD_VALIDATION.txt`
- `PHASE_S_ASSET_AUDIT.txt`

The final ZIP is cold-extracted and the same validation is rerun against that extracted copy. See `PHASE_S_PACKAGE_VERIFICATION.txt`.

## Visual/device status

The code, engine transitions, build markers, asset manifest and packaging can be validated in this environment. The environment did **not** successfully produce a reliable headless Chromium render of the Phase S visual QA harness, and no real phone is attached here. Therefore the release must remain **staging** until device screenshots confirm:

- Skip-Bo Stock selection and repeated Stock play feel obvious on phone.
- Cribbage pegs visually sit in the intended holes and the shared track is easy to follow.
- Backgammon / Black Gammon look sufficiently dimensional and fill the useful screen.
- Marbles & Jokers is large and readable without the old felt-table shell.
- Trail Trouble actually starts through the live room flow.
- Last Haven visibly advances from Camp to Route to normal gameplay.

Use `PHONE_QA_PHASE_S_GAMEPLAY_TABLETOP_REALISM_17.md` for the device pass.

## Deploy to staging

```bash
npm run deploy:staging
```

Expected visible build ID:

`GAME-NIGHT-STAGING-PHASE-S-GAMEPLAY-TABLETOP-REALISM-17`
