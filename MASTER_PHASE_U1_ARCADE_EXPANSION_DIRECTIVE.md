# BLACK FAMILY GAME NIGHT
# MASTER PHASE U.1 DIRECTIVE
## Arcade Corner Expansion

Use this document as the governing directive for Phase U.1.

## Objective
Expand the existing Arcade Corner without rebuilding or regressing the multiplayer tabletop or 3D games. Preserve Cabin Breakout and add three complete, instant-play HTML5 Canvas arcade games as self-contained HTML files with inline CSS and vanilla JavaScript only.

## New games

### 1. Neon Star Patrol
A responsive top-down space shooter.
- Controls: arrow keys or WASD to move; mouse/touch pointer aims; Space or held pointer fires.
- Enemies: a mixed arcade roster of splitting asteroids and attacking ships.
- Lives: 3.
- Difficulty: wave number increases with survival time; spawn cadence and enemy pressure increase while on-screen objects remain capped.
- Style: retro-vector / neon against a dark starfield.
- Fire rate is limited even while held.
- Movement and projectiles are frame-rate independent.
- Asteroids split into smaller hazards.
- Live score, lives, wave and weapon heat/readiness feedback.
- Game-over overlay shows final score and restart prompt.

Spawn logic: enemies enter from the top or side edges. A timer chooses asteroid or ship spawns, with ship probability and cadence increasing by wave. Object counts are capped for phone performance.

Boss extension: add a boss object with its own health, attack timer and draw routine. Spawn it once when score crosses a configured threshold, temporarily reduce normal enemy spawning, award a large score bonus on defeat, then resume wave play.

### 2. Campfire Rocket
A one-button flapping game inspired by the familiar gap-flying arcade format, using only original geometric visuals.
- Character: small rocket drawn with canvas shapes.
- Obstacles: paired timber/wooden walls with a central passable gap.
- Starting gap: approximately 188 logical pixels, gradually shrinking to a safe minimum of 145.
- Input: click, tap or Space.
- Theme: dark evening sky, cabin wood, ember/gold accents.
- Gravity and flap impulse tuned for a hard-but-fair rhythm.
- Fixed time-step simulation through requestAnimationFrame.
- One point per obstacle cleared.
- Collision with obstacle, ceiling or ground ends the run.
- Persistent high score using localStorage.
- Tap-to-restart game-over overlay.

Balance: gravity is strong enough to require regular corrections while the upward impulse gives enough recovery to cross the full legal gap range. Beginner option: keep the gap fixed around 185-195 or reduce obstacle speed by about 10-15%.

### 3. Neon Snake
A complete classic Snake game.
- Grid: 20 × 20.
- Controls: Arrow keys and WASD, plus swipe on touch devices.
- Theme: neon green snake, pink food, dark lodge-arcade background.
- Persistent high score through localStorage.
- Speed starts around 145 ms per grid step and speeds up every five foods, with a safe lower limit.
- Fixed logical step timing coordinated through requestAnimationFrame.
- Direct reversal into the snake's body is blocked.
- A short two-input queue preserves responsive cornering without allowing illegal reversal.
- Wall or self collision ends the run.
- Game-over overlay shows score/high score and restart prompt.

Harder option: decrease the minimum step time, increase the amount removed every five foods, add internal wall tiles, or move to a larger grid while keeping the visible canvas size fixed.

## Arcade integration
The main lodge's Arcade Corner must contain:
1. Cabin Breakout
2. Neon Star Patrol
3. Campfire Rocket
4. Neon Snake

Each card must:
- show as a 1-player instant-play arcade game
- open its self-contained HTML file directly
- support the existing Share Link action
- use the established lodge visual language

Do not route these games through the multiplayer room engine.

## Technical requirements
- Every new game is one self-contained HTML file.
- Inline CSS and vanilla JavaScript only.
- No libraries, sprite sheets, images, web fonts or remote assets.
- Canvas scales responsively on phones.
- requestAnimationFrame is used for presentation.
- Frame-rate independence is required for continuous-motion games.
- Object counts and effects are bounded for mobile performance.
- Touch interaction must not depend on hover.

## Preservation rule
Preserve all prior Phase U Cabin Breakout work, Phase T.1 Prop Hunt hunter-release and rapid-fire controls, Phase T animation work, Phase S fixes, Black Gammon house rules, tabletop multiplayer, bots, reconnect, player colors, chat, history and all established games.

## Acceptance bar
Phase U.1 is acceptable only when:
1. All three new arcade HTML files exist and are self-contained.
2. Space shooter movement, aim, fire-rate limiting, collisions, score, lives, enemy waves and game over work.
3. Rocket game uses fixed-step physics, fair shrinking gaps, score, high score and restart.
4. Snake uses a 20x20 grid, blocks instant reversal, preserves responsive queued turns, ramps speed every five foods, stores high score and restarts cleanly.
5. All four arcade games appear in Arcade Corner and open directly.
6. Service-worker shell includes all four arcade files.
7. Existing tests still pass.
8. Final ZIP is cold-extracted and validation reruns against the extracted copy before release claims.
