# Phone QA - Phase Q Mobile Tabletop UX 15

## Device setup

Test the deployed staging build on the portrait phone normally used for family play. Confirm the visible build ID is `GAME-NIGHT-STAGING-PHASE-Q-MOBILE-TABLETOP-UX-15` before reporting screenshots.

## Skip-Bo

- Open a two-player room and start a game.
- Confirm there is no required zoom toolbar and no need to pan the board for a normal turn.
- Confirm the player's hand is readable at the bottom.
- Confirm the player's stock and all four discard piles are visible directly above the hand.
- Confirm the top card of each non-empty discard pile is fully readable.
- Confirm all four shared build piles and the draw pile are visible in the main action zone.
- Confirm the opponent's actual hand cards are hidden and only hand count is shown.
- Confirm opponent stock/discard status is still understandable.
- Tap a playable hand card. Confirm valid build/discard destinations glow and invalid destinations dim.
- Tap a stock/discard source. Confirm only legal build destinations glow.
- Complete plays and confirm the existing rules engine still accepts/rejects moves correctly.
- Check that cards are large enough to tap without accidental neighboring taps.
- Capture one screenshot of the normal turn and one screenshot with a source selected.

## Cribbage

- Start a two-player game.
- Confirm the central object reads immediately as a crib board rather than a generic table.
- Confirm both players are visually paired with their lanes/scores.
- Confirm current and trailing peg positions are distinguishable.
- During pegging, confirm the running count is readable and played cards identify who played them.
- Confirm peg movement receives a short visible acknowledgement when points are awarded.
- Confirm the crib remains hidden before its scoring reveal.
- Complete a hand and confirm the score recap shows actual hand cards, starter, score details, and score movement.
- Confirm the crib recap shows the actual crib cards and its point explanation.
- Confirm the completed scoring evidence remains inspectable after the next hand begins.
- Confirm the layout does not require horizontal panning to understand normal play.
- Capture one screenshot during pegging and one screenshot of the completed score recap.

## Shared regression

- Confirm lobby, bot controls, reconnect, player colors, chat/reactions, and rematch still behave normally.
- Confirm Black Gammon and standard Backgammon still open separately.
- Confirm Prop Hunt Phase P1 changes are still present and were not replaced by the tabletop work.

## Approval rule

Do not mark Phase Q visually approved from automated results alone. Use the phone screenshots and actual touch/gameplay experience as the acceptance gate.
