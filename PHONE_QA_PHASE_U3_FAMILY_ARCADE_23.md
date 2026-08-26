# Phase U.3 Phone QA - Family Arcade Personalization

Use the exact Phase U.3 staging ZIP after deployment or a local static server. Test on a real phone before visual signoff.

## Arcade Corner shell
- Home loads without blank screen or JavaScript error.
- Shelf title reads Kristen's Arcade Corner.
- 17 arcade cards are visible.
- No duplicate Camp Pong / Goat Crossing / generic Phase U.2 cards remain.
- Local play count increments after launching personalized games.
- Achievement count updates after an achievement is unlocked and the home screen is reloaded.

## Papa's Paddle Battle
- Intro identifies Papa and the game.
- Touch drag moves the player paddle.
- Arrow keys still work on desktop.
- Paddle rebound angle changes based on hit position.
- First to 7 ends the match and restart works.

## Gunner's Goat Run
- Gunner is visibly a large dog, not a generic goat avatar.
- Swipe movement works.
- Road collisions cost a life.
- Logs carry Gunner across water.
- Reaching the goat pen increments Saved/Level.

## John's Shop Bomber
- D-pad controls work on phone.
- Spark Charge button works.
- Crates break, enemies clear, rooms advance.
- John can be damaged by his own blast as designed.
- Controls remain responsive after a life loss.

## James's Lumber Stack
- Five touch buttons work.
- Swipe controls do not cause page scrolling.
- Rotation wall kicks still work.
- Line clears score correctly.
- Restart works after top-out.

## Dorothy's Garden Merge
- Intro screen appears before first move.
- Swipes move/merge tiles.
- Garden names and numeric values are both readable.
- New Garden returns to a clean ready state.
- Game-over restart works.

## Logan's Minefield
- Tap opens a safe square.
- Long press flags without opening the square.
- Numbers match adjacent hazards.
- Clearing all safe squares wins.
- Best-time display persists after reload.

## Nana's Goat Whack
- Targets are easy to tap.
- Goats, pigs and chickens score.
- Toolbox subtracts score/resets combo.
- Nana reaction text changes during play.
- 30-second end state and restart work.

## Holly's Memory Mayhem
- Easy/Medium/Hard buttons all rebuild the correct grid.
- Cards are large enough to tap.
- Mismatched pairs flip back.
- Matched pairs stay visible.
- Win screen appears and reshuffle works.

## Lizzie's Dramatic Lights
- Audio initializes after user input.
- Each pad lights and has a distinct tone.
- Sequence input is accepted only after playback.
- Wrong input ends the run.
- Restart works.

## Vanessa's Pipe Problem
- Intro appears before the first puzzle interaction.
- First tap enters play without accidentally rotating a pipe.
- Pipe rotation updates connectivity.
- Completed network triggers the win screen.
- Next problem and New Problem work.

## Kelsi's Rock Hunt
- Shiny/prized rocks are distinguishable.
- Taps register accurately.
- Timer ends the run.
- Restart works.

## Molly's Light Chase
- Light moves smoothly.
- Touch hit detection is forgiving enough on phone.
- Score/best update.
- Restart works.

## Gunner's Snack Attack
- Touch buttons work.
- Swipe movement works.
- Snacks increase score.
- Chores reduce score/return Gunner to start.
- Timer and restart work.

## Non-regression spot checks
- Family Prop Hunt opens.
- Prop Hunt hunter hiding-screen / crosshair shooting changes remain present.
- Island Life opens.
- Birthday Seat opens.
- Black Gammon opens.
- Skip-Bo opens.
- Existing multiplayer room creation still works.

## Signoff labels
Do not mark Phone Visually Verified until all critical failures are resolved on a real phone.
