# Phase S – Gameplay Repair + Tabletop Realism

**Build:** `GAME-NIGHT-STAGING-PHASE-S-GAMEPLAY-TABLETOP-REALISM-17`  
**Package:** `3.4.0-staging-phase-s-gameplay-tabletop-realism-17`  
**Status:** Staging. Technical/rule regression validation completed in the working tree; real-device visual approval is still required.

## Governing directive

Phase S follows `MASTER_PHASE_S_GAMEPLAY_TABLETOP_REALISM_DIRECTIVE.md`. It begins from the Phase R source and preserves unrelated working systems.

## Implemented repairs

### Skip-Bo

- Preserved the existing engine support for Stock Pile play and added an explicit regression proving two consecutive exposed Stock cards can be played in the same turn and the final Stock card triggers the win.
- The exposed Stock card is now visually labelled as the primary objective: `STOCK · PLAY THIS TOP CARD`.
- Selecting Stock keeps the selected source active while legal Building Piles glow instead of disabling the selected Stock control.
- Stock/hand/discard direct-play actions now explicitly refresh room state after the server accepts the action, then clear local selection and rerender. This makes the next exposed Stock card appear immediately rather than depending only on SSE timing.

### Trail Trouble

- Preserved the established Trail Trouble rules/board.
- Host Start now immediately fetches fresh room state after `/api/start` and rerenders.
- Added a deterministic regression that starts a two-player solo game, verifies the five-card hand, executes a legal first movement card, and confirms the turn advances.

### Last Haven

- Preserved the existing setup/rules engine.
- Setup Route edges now receive large `ROUTE` touch targets at the legal edge midpoint instead of requiring the user to tap a thin SVG line.
- During `setupRoute`, a fallback action panel also lists legal Supply Route choices.
- Added a regression that completes the entire Camp/Route snake setup for three players, reaches `playing`, rolls, and ends the first normal turn successfully.

### Backgammon / Black Gammon

- Preserved the Phase R screen-first dedicated Gammon route and immediate post-roll room refresh.
- Added stronger physical-board styling: layered wood grain, deep frame/inset shading, dimensional points, darker central bar, dimensional checker faces/contact shadows, and physical dice treatment.
- Preserved Black Gammon's complete custom rule engine and 4/4/4/3 opening layout.

## Tabletop visual/UX upgrades

### Cribbage

- Replaced the separate per-player track presentation with one shared physical-style wooden board.
- Each player receives a distinct selected-color lane under the same continuous scoring pattern.
- Added drilled-looking holes for scores 0–120 plus the 121 game hole.
- Current and previous pegs use the exact same board coordinate system as their matching holes, so the peg position is anchored to a real score location rather than an unrelated overlay position.
- Pegs have a visible stem, head, contact shadow, and selected player color.
- Added a short score-path animation driven by `lastPegEvent`.
- Preserved starter, crib reveal, score combinations, current count and completed-round scoring recap.

### Marbles & Jokers

- Added a dedicated board-first gameplay route instead of the generic extra-game felt/table shell.
- Board viewport now occupies the useful game surface with transparent surrounding viewport, while the hand/deck/control areas remain accessible.
- Preserved the detailed wood board, holes, home channels and dimensional marbles already established in the renderer.

### Screw Your Buddy / Fuck Your Buddy

- Added a compact `THIS ROUND` block directly in the trick-bid card.
- Shows hand size plus trump context, e.g. `2 ♣`, `7 NT`.
- Fuck Your Buddy also exposes the special power-rank context when active.

## Build/cache isolation

Updated the app version, service-worker cache, asset query markers, QA build marker and staging Worker name to Phase S so the new UI is not confused with Phase R cached assets.

## Regression coverage

Added `test/phase-s-gameplay-tabletop-realism.test.mjs` covering:

- Skip-Bo Stock chain and Stock depletion win
- Skip-Bo Stock/direct-target UI contract
- Trail Trouble start and first full normal turn
- Last Haven full setup and first normal gameplay turn
- Last Haven Route touch UI
- shared physical Cribbage board/peg state
- Gammon screen-first + dimensional treatment
- immediate Gammon roll state refresh
- Marbles dedicated board-first route
- Screw/Fuck bid context
- immediate state refresh on critical Phase S actions

## Working-tree validation

- `npm test`: **367 / 367 passed**
- `npm run check`: **367 / 367 tests passed**, syntax checks passed
- `npm run build`: **158 pass, 2 warning, 0 fail**
- `npm run assets:audit`: **PASS**

The two build warnings are declared staging limitations:

1. Existing Three.js/addon runtime CDN dependency remains for 3D modes.
2. Wrangler executable is unavailable in this environment, so live Cloudflare deployment is unverified.

## Visual validation status

A static headless Chromium render was attempted for the new Cribbage/Gammon visual harness. Chromium did not complete reliably in this sandbox, so **no browser-rendered or phone-rendered screenshot is claimed as proof**.

The implementation has been reviewed at source/geometry/layout level, but the following still require the user's real-device test:

- Cribbage physical peg/hole appearance and mobile board readability
- Backgammon / Black Gammon depth, scaling and checker readability
- Marbles & Jokers phone-scale readability
- Skip-Bo repeated Stock play interaction on the real device
- Trail Trouble live room start
- Last Haven Camp → Route interaction on touch

See `PHONE_QA_PHASE_S_GAMEPLAY_TABLETOP_REALISM_17.md`.
