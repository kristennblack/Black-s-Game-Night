# BLACK FAMILY GAME NIGHT
# MASTER PHASE U DIRECTIVE
## Cabin Breakout Arcade Addition

Use this document as the governing directive for Phase U.

## Objective
Add a complete, satisfying HTML5 Canvas Breakout / brick-breaker game to the Black Family Game Night lodge without rebuilding or regressing existing room, tabletop, or 3D games.

## Locked Phase U inputs
- Brick layout: **6 rows x 10 columns, colored by row**
- Lives: **3**
- Paddle control: **both mouse and arrow keys**, plus touch/pointer drag for phone play
- Color theme: **Black Family Game Night cabin arcade** with dark lodge wood, ember/gold highlights, forest-dark playfield, and row-based brick colors
- Extra: **MULTI-ball power-up**
- Delivery: **one self-contained HTML file** with inline CSS and vanilla JavaScript on a `<canvas>` and no external assets or libraries

## Required gameplay
- Moveable paddle
- Ball bounce against walls, paddle, and bricks
- Bricks disappear on hit and award points
- Live score
- Lives counter
- Missed ball costs one life
- New ball waits for player launch after a lost life
- Win screen when all bricks are cleared
- Game-over screen when lives reach zero
- Tap/click/Space restart prompt from win/game-over
- Paddle reflection angle changes based on impact position so the player can deliberately aim
- MULTI power-up may drop from destroyed bricks; catching it creates additional live balls

## Collision requirement
High-speed balls must not tunnel through bricks. Use continuous collision detection, not only end-of-frame overlap checks.

The implementation should sweep the ball's movement segment against expanded brick/paddle rectangles (Minkowski-expanded AABBs), resolve the earliest time of impact, reflect, consume the remaining frame time, and continue for a bounded number of collision iterations.

## Mobile requirement
The game must remain fully playable in portrait phone layout. Touch/pointer movement is required in addition to the requested mouse/keyboard controls. The canvas should scale responsively while preserving one logical coordinate space.

## Lodge integration
Add **Cabin Breakout** to a dedicated **Arcade Corner** on the main game list.

The game card must:
- be visually consistent with the lodge shelf
- identify the game as 1-player instant play
- open `/breakout.html`
- support a share link

Do not route Cabin Breakout through the multiplayer room engine. It is a self-contained instant arcade game.

## Preservation rule
Preserve all Phase T.1 Prop Hunt hunter-release / rapid-fire changes, Phase T animation work, Phase S repairs, Black Gammon rules, existing game room systems, reconnect, bots, player colors, chat, leaderboard/history, and all other established games.

## Acceptance bar
Phase U is acceptable only when:
1. Cabin Breakout exists as one self-contained HTML file.
2. 60 bricks appear as 6 x 10 and are colored by row.
3. The paddle works with mouse, arrow keys, and touch/pointer drag.
4. Paddle hit position changes the outgoing angle.
5. Continuous collision detection prevents ordinary high-speed tunneling through bricks.
6. Score, lives, win, game-over, launch, and restart flows are present.
7. MULTI-ball can create additional balls.
8. Cabin Breakout appears in the main lodge's Arcade Corner and opens directly.
9. Existing game systems remain regression-tested.
10. The final ZIP is cold-extracted and validation is rerun against the extracted package before release claims are made.
