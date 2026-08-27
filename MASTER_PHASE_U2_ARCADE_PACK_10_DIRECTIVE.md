# BLACK FAMILY GAME NIGHT — MASTER PHASE U.2 DIRECTIVE
## Arcade Corner: Original Family Remix Pack 10

Build from the latest Phase U.1 working project. Preserve all existing games and systems. Add ten small, original, Cloudflare-friendly browser games using self-contained HTML/CSS/vanilla JavaScript wherever practical. These are family-themed reinterpretations of familiar arcade/puzzle mechanics, not copies of branded artwork, names, characters, audio, or presentation.

## New games
1. **Camp Pong** — paddle-and-ball rally against a bot; mouse/touch/keyboard.
2. **Goat Crossing** — a little goat crosses moving yard traffic; lives and repeat crossings.
3. **Shop Bomber** — Papa’s Shop grid maze with harmless timed blast charges that clear crates.
4. **Cabin Blocks** — falling-block row-clearing puzzle with responsive mobile controls.
5. **Camp 2048** — four-by-four merging puzzle with score and directional controls.
6. **Minefield** — hazard-clearing logic game with tap reveal and right-click/long-press flags.
7. **Goat Whack** — 30-second reaction game; tap goats as they appear.
8. **Memory Mayhem** — family-night icon matching with move count.
9. **Firelight Simon** — growing sequence-memory game using campfire-themed signals.
10. **Papa’s Pipes** — rotate shop-pipe pieces in a relaxed touch-first puzzle.

## Integration requirements
- Add all ten to Arcade Corner on the main game list.
- Preserve Cabin Breakout, Neon Star Patrol, Campfire Rocket, Neon Snake and every non-arcade game.
- Each new game must launch directly from its shelf card.
- Prioritize phone readability, 44px+ touch targets, portrait responsiveness and instant restart.
- No remote assets, libraries, analytics or network dependencies inside these ten games.
- Keep code light enough for static Cloudflare delivery and offline caching.
- Do not claim visual approval until tested on a real phone.

## Acceptance gate
A build passes Phase U.2 when all ten shelf entries launch, each game has a complete playable loop, restart works, existing shelf entries remain intact, and the final ZIP contains all new HTML files and updated service-worker cache entries.
