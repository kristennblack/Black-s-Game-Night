# Phase S Phone QA Checklist

**Build:** `GAME-NIGHT-STAGING-PHASE-S-GAMEPLAY-TABLETOP-REALISM-17`

Use a normal portrait phone first. Do not zoom unless the checklist specifically asks for it.

## 1. Skip-Bo – Stock Pile critical path

- [ ] Start a human vs bot match.
- [ ] Confirm your exposed Stock card is obvious and says it is playable/important.
- [ ] When the Stock top is legal, tap it.
- [ ] Confirm valid Building Piles glow and invalid destinations dim.
- [ ] Play the Stock card.
- [ ] Confirm the next Stock card appears immediately without refreshing the browser.
- [ ] If the next Stock card is also legal, play it during the same turn.
- [ ] Confirm hand and four Discard Piles remain visible.
- [ ] Confirm opponent hand is count-only.
- [ ] If practical, play down the final Stock card and confirm the win triggers.

## 2. Trail Trouble – start blocker

- [ ] Create Trail Trouble with another player or bot in a valid mode.
- [ ] Everyone presses Ready.
- [ ] Host taps Start.
- [ ] Confirm the board appears immediately instead of remaining in the lobby.
- [ ] Confirm the current player has five cards.
- [ ] Complete one legal card action.
- [ ] Confirm the next turn/extra-turn behavior is correct.

## 3. Last Haven – Camp to Route blocker

- [ ] Start Last Haven.
- [ ] Place the first Camp.
- [ ] Confirm large `ROUTE` choices appear immediately on connected edges.
- [ ] Tap a Route target.
- [ ] Confirm setup proceeds to the next required Camp/Route placement.
- [ ] Continue until setup finishes.
- [ ] Confirm normal `Roll` gameplay appears.
- [ ] Roll and complete the first regular turn.

## 4. Cribbage – physical board

- [ ] Confirm there is one shared wooden board, not a separate board for each player.
- [ ] Confirm each player has a visible color lane running through the shared pattern.
- [ ] Confirm peg holes look recessed/drilled rather than printed dots.
- [ ] Confirm every peg appears seated directly in a hole.
- [ ] Confirm current and previous pegs are distinguishable.
- [ ] Score points and confirm a peg visibly progresses along the route.
- [ ] Confirm the numeric score agrees with the peg position.
- [ ] During pegging, confirm running count and played-card ownership remain readable.
- [ ] During counting, confirm the actual hand/starter appear with point explanation.
- [ ] Confirm the crib stays private until scoring, then reveals its real cards and point breakdown.

## 5. Backgammon

- [ ] Board fills the useful screen and no giant green felt table surrounds it.
- [ ] Wood/frame/points look dimensional rather than flat.
- [ ] Checkers look raised with shadows.
- [ ] Dice look physical and readable.
- [ ] Opening Roll works.
- [ ] Later Roll works.
- [ ] Selecting a checker makes legal destinations clear.
- [ ] Fit view is playable without mandatory zoom.
- [ ] Zoom + / − still works if wanted.
- [ ] No stray vertical blue line appears.

## 6. Black Gammon

- [ ] Confirm correct 4/4/4/3 opening layout.
- [ ] Both players can roll their two dice.
- [ ] Unequal totals proceed to allocation/movement.
- [ ] If totals tie, the large die flow works.
- [ ] Blue forward destinations are visually distinct.
- [ ] Red backward destinations are visually distinct.
- [ ] Gold rescue destinations are visually distinct when applicable.
- [ ] Board/checkers/dice have the same dimensional quality as regular Backgammon.
- [ ] No standard-Backgammon rule has replaced a Black Gammon house rule.

## 7. Marbles & Jokers

- [ ] Board is the dominant play surface.
- [ ] The old oversized outer felt/table shell is gone from normal play.
- [ ] Track holes and Home channels are easy to see.
- [ ] Marbles are large enough to identify and tap.
- [ ] Hand/deck remain reachable without shrinking the board into a tiny window.
- [ ] Normal play does not require panning around a decorative table.

## 8. Screw Your Buddy

- [ ] Open a bidding round.
- [ ] `How many tricks?` shows the current card count and trump at the same time.
- [ ] Confirm examples read naturally, such as `2 ♣` or `7 NT`.

## 9. Fuck Your Buddy

- [ ] Open several bidding rounds.
- [ ] Hand size and suit/No Trump context are visible in the bid box.
- [ ] Special power-rank context appears when the special round requires it.

## Report back

Screenshots that are especially useful:

1. Skip-Bo immediately after tapping the Stock card.
2. Cribbage after a peg has scored/moved.
3. Backgammon opening board with dice visible.
4. Black Gammon opening board and a forward/backward move-selection state.
5. Marbles & Jokers full portrait board.
6. Last Haven immediately after placing the first Camp.
