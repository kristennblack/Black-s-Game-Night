# Phase Q - Mobile Tabletop UX Rebuild

## Objective

Implement the first release governed by `MASTER_MOBILE_TABLETOP_UX_DIRECTIVE.md`: rebuild Skip-Bo and Cribbage around portrait-phone play while preserving rules, multiplayer behavior, privacy, and the Phase P1 3D flagship work.

## Skip-Bo changes

The previous Skip-Bo renderer lived inside the generic Three New Games zoom/pan viewport. That presentation has been replaced with a dedicated Skip-Bo gameplay route whose useful screen area is the play surface.

The new layout keeps the opponent summary, shared build area, current player's stock/discards, and hand in one portrait-first composition. Opponent hand cards remain private and only the count is shown. The current player sees all four discard piles and their top cards, all four shared build piles, and the draw pile.

Interaction now follows a source/destination model. Tapping a playable hand, stock, or discard source stores that source selection. Legal build targets glow. When a hand card is selected, legal discard targets also glow. Invalid targets dim. Selecting a destination invokes the existing advertised engine action rather than inventing a parallel rules path.

## Cribbage changes

The generic tabletop presentation is replaced with a dedicated Cribbage gameplay route. The board is styled as a physical wood crib board with player lanes, current and trailing peg positions, explicit score labels, player-color ownership, and short peg-movement feedback.

Pegging cards now carry the ID of the player who played them in public state so the UI can identify card ownership in the sequence.

The server-side scoring engine still supports automatic counting, but Phase Q now preserves the evidence that automatic counting previously erased too quickly. Public Cribbage state can expose the current counted hand/crib when appropriate and retains a completed round summary containing the starter, each counted hand, the crib, score details, and from/to score movement. The UI renders that recap so players can inspect what was scored and why even after the next deal begins.

## Shared mobile standard

Phase Q adds responsive styles for screen-filling tabletop surfaces, direct target glow/dimming, compact side information, and portrait breakpoints. Skip-Bo and Cribbage are the first applications. Other tabletop games are intentionally not blindly rewritten in this release.

## Preservation

This release retains the Phase P1 Prop Hunt flagship work, existing 3D systems, Black Gammon, regular Backgammon, Easy-first bots, readable bot controls, multiplayer/reconnect, game rules, and private/public information contracts except for the additional Cribbage scoring evidence required for the new presentation.

## Validation boundary

The release is staging. Automated tests, syntax checks, build validation, and package integrity checks are recorded separately. These do not replace real-device visual confirmation. Skip-Bo and Cribbage must still be inspected on a portrait phone before this phase is called visually approved.

## Recorded technical validation

- `npm test`: 345 / 345 pass.
- `npm run check`: syntax/module checks pass and 345 / 345 tests pass.
- staging validator: 144 pass, 2 warnings, 0 failures.
- production 3D asset audit: pass.
- the two validator warnings are unchanged staging cautions: external Three.js/addon CDN usage and no live Cloudflare deployment verification in this packaging environment.
- an automated local Chromium render was attempted, but the environment blocked browser navigation to the local QA server. Therefore no browser screenshot is being represented as visual proof. Real-device portrait QA remains the visual gate.
