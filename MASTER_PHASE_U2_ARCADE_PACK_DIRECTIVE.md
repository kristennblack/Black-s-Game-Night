# BLACK FAMILY GAME NIGHT
# MASTER PHASE U.2 DIRECTIVE
## Family Arcade Pack: First Ten Original Variants

Use this document as the governing master prompt for Phase U.2. It extends Phase U.1 and preserves every locked tabletop, multiplayer and 3D rule unless this directive explicitly changes it.

## Objective
Expand Arcade Corner with ten original, family-themed HTML5 Canvas games based on familiar public-domain/generic arcade and puzzle mechanics. Do not copy branded art, names, characters, music, level layouts or presentation. Build each game as its own self-contained HTML file with inline CSS and vanilla JavaScript only so it can be deployed as a static Cloudflare asset and played immediately on phone or desktop.

## Phase U.2 game list

### 1. Camp Pong
Original family-cabin paddle duel.
- One player against Papa Bot.
- Player paddle supports mouse, touch and keyboard control.
- Ball rebound angle changes based on where the paddle is struck so the player can aim shots.
- Warm wood/campfire presentation with an ember-style ball.
- First player to 7 wins.
- Ball speed increases gradually during rallies but remains bounded.
- Win/lose overlay and instant rematch.

### 2. Goat Crossing
Original family farm crossing game.
- The player is a small goat drawn entirely with canvas shapes.
- Cross alternating grass, road and creek lanes to reach hay at the top.
- Cars/trucks move across road lanes.
- Floating logs carry the goat across creek lanes.
- Three lives.
- Successful crossings increase level and traffic/log speed.
- Controls: arrows/WASD and swipe/touch.
- Do not use branded Frogger art, names or level layouts.

### 3. Shop Bomber
Original Papa's Shop maze-clearing game.
- Grid maze made of permanent shop obstacles and destructible wooden crates.
- Player places family-safe spark charges with a short fuse.
- Blast travels in four directions and stops at solid walls; destructible crates break.
- Wandering goat/pig critters act as moving targets/hazards.
- Player can be caught in a blast and has three lives.
- Room number and enemy pressure progress after each clear.
- Touch D-pad plus charge button, with arrows/WASD and Space on desktop.
- Do not copy branded Bomberman characters, art, maps or sound.

### 4. Cabin Blocks
Original falling-block puzzle.
- 10-column by 20-row playfield.
- Seven familiar geometric block families rendered as original colored timber-style pieces.
- Move, rotate, soft drop and hard drop.
- Completed rows clear and award increasing points.
- Level increases every 10 cleared rows and fall speed increases safely.
- Rotation uses small wall-kick attempts for forgiving phone play.
- Touch controls and keyboard controls.
- Persistent best score.
- Do not use branded Tetris name, art, music or exact visual presentation.

### 5. Camp 2048
Original camping merge puzzle using familiar slide-and-merge mechanics.
- 4x4 board.
- Matching camp items merge upward through a themed progression such as Match, Kindling, Log, Lantern, Tent, Cooler, Camper, Campsite, Cabin, Lodge and Game Night.
- Arrow keys and swipe controls.
- Live score and persistent best score.
- Game-over overlay when no legal merges remain.
- The visual identity is Black Family camping/lodge themed, not a copy of any branded implementation.

### 6. Minefield
Original rustic mine-clearing logic puzzle.
- Easy 9x9 board with 10 mines by default.
- Optional Medium 12x12 board with 20 mines.
- First revealed square and its immediate neighbors are protected before mine placement.
- Tap reveals a square.
- Hold on touch or right-click flags/unflags.
- Zero-value cells flood-reveal adjacent safe cells.
- Mine count, flag count and timer are visible.
- Win and loss overlays restart cleanly.

### 7. Goat Whack
Original reaction game set in the goat pen.
- 3x3 pen/hole layout.
- Goats and pigs appear for short windows and award points when tapped.
- A red toolbox is a negative target and should be avoided.
- Thirty-second runs.
- Consecutive successful taps build a combo and can increase point value.
- Persistent high score.
- Difficulty naturally ramps by shortening spawn cadence during the run.

### 8. Memory Mayhem
Original family memory-match game.
- 4x4 board with eight family-themed pairs.
- Family references may include John, Kristen, Holly, Vanessa, Lizzie, Logan, Kelsi and Gunner using original text/emoji symbols only.
- Flip two cards at a time.
- Matches stay revealed; misses turn back after a short readable delay.
- Track moves and elapsed time.
- Store persistent best move count.
- Completed board shows a clean victory overlay and tap-to-reshuffle flow.

### 9. Firelight Simon
Original campfire sequence-memory game.
- Four large glowing stones arranged around a campfire.
- Game plays an increasingly long random sequence.
- Player repeats the sequence by tapping stones or pressing 1-4.
- Each stone has a distinct original color and generated oscillator tone.
- No external sound files.
- Persistent best round.
- Playback speeds up gradually while remaining readable.
- A wrong press ends the run and offers immediate restart.

### 10. Papa's Pipes
Original workshop pipe-rotation puzzle.
- 6x6 grid.
- Each level is generated from a solvable spanning pipe network.
- Pipe tiles are randomly rotated at the start.
- Tapping a tile rotates it 90 degrees.
- Connected pipework lights up from the source.
- Puzzle is complete when the full network is energized.
- Track moves, elapsed time and level.
- Completing a job advances to a fresh generated pipe job.

## Arcade Corner after Phase U.2
Preserve the four existing Arcade Corner games:
1. Cabin Breakout
2. Neon Star Patrol
3. Campfire Rocket
4. Neon Snake

Add the ten Phase U.2 games:
5. Camp Pong
6. Goat Crossing
7. Shop Bomber
8. Cabin Blocks
9. Camp 2048
10. Minefield
11. Goat Whack
12. Memory Mayhem
13. Firelight Simon
14. Papa's Pipes

Arcade Corner therefore contains 14 instant-play games in this phase.

## Integration requirements
- All arcade cards appear in the main lodge Arcade Corner.
- Each game opens its own direct static HTML route.
- Each card retains the existing Share Link action.
- Arcade games do not enter the multiplayer room engine unless a future directive explicitly adds multiplayer.
- Service-worker shell/cache must include all 14 arcade HTML files so updates deploy cleanly and offline caching remains coherent.
- Update the visible lodge game count to 14 Arcade games.
- Use a new Phase U.2 cache/version identifier so prior installed builds do not remain stuck on an old service worker.

## Global technical requirements
- One self-contained HTML file per arcade game.
- Inline CSS and vanilla JavaScript only.
- No external libraries, sprite sheets, web fonts, audio files or remote assets.
- All character/object art is drawn with Canvas primitives, text or emoji available on-device.
- Responsive layout must fit phone screens without horizontal page scrolling.
- Touch controls must work without hover.
- Keyboard/mouse controls remain available when appropriate.
- Continuous-motion games use requestAnimationFrame with frame-rate-independent movement or a fixed logical step.
- Object counts and effects are bounded for mobile performance.
- Game state must restart cleanly without duplicate listeners or runaway timers.
- localStorage may be used only for local high scores/settings, never as required multiplayer state.

## Originality rule
Familiar mechanics are allowed, but these are Black Family Game Night versions. Do not copy another game's proprietary art, audio, branded characters, logos, title treatments, source code or distinctive level data. Mechanics should be rebuilt in original code and themed for the family lodge/farm/shop/camp world.

## Preservation rule
Do not regress or remove:
- Phase U.1 arcade games and Cabin Breakout;
- Phase T.1 Prop Hunt hunter hiding-screen privacy, crosshair-first controls and hold-to-fire behavior;
- Phase T character/animation work;
- all Phase S tabletop repairs;
- Black Gammon custom rules and starting layout;
- multiplayer rooms, reconnect, bots, player colors, chat, history and all existing tabletop games;
- existing 3D playtests and locked camera/playability recovery work.

## Phase U.2 acceptance test
The phase is acceptable only when:
1. All ten new HTML files exist and are self-contained.
2. Every new game starts, accepts phone-friendly input, can reach a win/game-over/completion state where applicable, and restarts cleanly.
3. Camp Pong has position-based paddle reflection and a working bot.
4. Goat Crossing correctly handles road collisions, moving logs, lives and successful crossings.
5. Shop Bomber handles charges, four-way blasts, destructible crates, hazards and room progression.
6. Cabin Blocks clears rows, blocks illegal placement/reversal states, rotates safely and ramps speed.
7. Camp 2048 merges only matching values once per move and detects no-move game over.
8. Minefield guarantees a safe first reveal area, supports flagging and flood reveal, and detects win/loss.
9. Goat Whack has timed target windows, combo scoring, negative toolbox targets and a 30-second end state.
10. Memory Mayhem enforces two-card comparison, delayed mismatch flipback and completion.
11. Firelight Simon plays and validates an increasing sequence, with distinct generated tones and best-round storage.
12. Papa's Pipes always begins from a generated solvable network and detects full-network connectivity.
13. All 14 arcade cards appear in Arcade Corner and direct-link correctly.
14. Service worker includes all 14 arcade files with the Phase U.2 cache identifier.
15. Existing automated project tests still pass.
16. The exact final ZIP is cold-extracted and validation is rerun against the extracted copy before claiming release readiness.

**Target release name:** `GAME-NIGHT-STAGING-PHASE-U2-ARCADE-PACK-22`

The goal of this pack is variety without architectural weight: ten small, satisfying family arcade games that can be deployed as static Cloudflare assets and tested quickly before deciding whether to expand Arcade Corner again.
