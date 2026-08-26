# Phone QA - Phase O Black Gammon + Bots 12

Use a fresh/private browser tab after deploying the staging build and confirm the visible build ID is `GAME-NIGHT-STAGING-PHASE-O-BLACK-GAMMON-BOTS-12`.

## Game Shelf / lobby

- Backgammon and Black Gammon both appear as separate games.
- Create Black Gammon: maximum 2 seats.
- Add Computer defaults to Easy.
- Bot character and difficulty dropdowns have readable light backgrounds/text and do not appear as a black box.
- Medium/Hard can be selected and saved.

## Black Gammon visual setup

- Starting stacks match `BLACK_GAMMON_STARTING_SETUP.png` and total 15 per player.
- Player-selected colour appears on that player's checkers and two normal dice.
- From the viewer's perspective, entry/start is at the bottom and home/bear-off is at the top-right.
- Board fits the phone without hiding critical controls; pinch/pan/Fit remain usable.

## Rules spot checks

- Both players roll two dice; higher sum gets allocation control and moves first.
- Tied totals activate the large 2/4/6/8/16/32/64 die.
- Double direction is all forward or all backward.
- Triple direction is all forward or all backward and represents 12 moves.
- Quad represents 24 moves after the large-die tiebreak.
- Single 4 moves backward while anything is outside home and cannot enter from Bar.
- Single 4 flips positive immediately once all checkers are home.
- Bar clears before other movement.
- Lone opposing checker is hit immediately; 2+ opposing checkers use covering/rescue rules.
- Forward destinations show blue; backward red; rescue gold.
- Illegal taps explain the rule instead of silently failing.
- Ordinary unusable single transfers once; unused matching-set bonus moves disappear.
- Game ends immediately when checker 15 bears off.

## Standard Backgammon parity check

- Standard Backgammon still uses standard rules.
- Its dice use the active player's selected colour.
- Standard Backgammon has not inherited Black Gammon movement/stacking rules.
