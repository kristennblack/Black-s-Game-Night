# BLACK FAMILY GAME NIGHT - PHASE U.3 MASTER DIRECTIVE
## Family Arcade Personalization Pass

### Governing sources
Continue from the latest working project ZIP, the Project Constitution and the cumulative Master Development Directive. Do not start over and do not remove unrelated working systems.

### Primary objective
Transform the first ten Phase U.2 Arcade Corner games from generic family-themed browser games into character-specific Black Family arcade games. The mechanical core should remain understandable, but each game must clearly belong to a specific person through title, environment, objects, dialogue, scoring language, intro/game-over presentation and visual details.

### Personalized main games
1. Papa's Paddle Battle - Papa - warm Papa's Shop paddle duel, yellow chair/fireplace/workshop details, Papa Bot, Papa-specific win/loss lines.
2. Gunner's Goat Run - Gunner - oversized goofy farm dog crossing traffic and creek logs to get goats home.
3. John's Shop Bomber - John - safe spark charges, workshop maze, wrench/fixer identity, runaway tires/shop vac/toolbox enemies.
4. James's Lumber Stack - James - falling-block mechanics re-themed as calm lumber/timber organization.
5. Dorothy's Garden Merge - Dorothy - 2048-style merging from seed to garden/greenhouse/backyard oasis with a smoke-break flavored game-over line.
6. Logan's Minefield - Logan - harmless outdoor hazards such as mud, hooks, rocks and angry-goose spots with fishing/reluctant teen humor.
7. Nana's Goat Whack - Nana - goats, pigs and chickens, red-toolbox penalty and recurring family-safe Nana reactions including "That's a sin."
8. Holly's Memory Mayhem - Holly - cozy original toy/squishy/dog/hoodie/treat matching with Easy/Medium/Hard modes.
9. Lizzie's Dramatic Lights - Lizzie - Simon-style stage pads with dramatic dance cues and theatrical reactions.
10. Vanessa's Pipe Problem - Vanessa - procedural pipe puzzles themed around washing the grey GMC, filling the hot tub or feeding campsite water, with sarcastic/eye-roll commentary.

### Bonus dog mini-games
Add three lightweight original bonus games:
- Kelsi's Rock Hunt - timed shiny/prized-rock search.
- Molly's Light Chase - fast reaction game chasing a moving light.
- Gunner's Snack Attack - lumbering but responsive snack collection while avoiding chores.

### Kristen's Arcade Corner
Kristen acts as the Arcade Corner host layer. Rename the shelf presentation to "Kristen's Arcade Corner" and use one restrained host joke. Display local play count and unlocked-achievement count where available.

### Shared local progression
Use localStorage only. Do not add a server dependency.

Shared keys:
- bfgn_arcade_progress_v1
- bfgn_arcade_achievements_v1

Track local plays and achievements. Achievements are optional and must not block normal play.

Target achievements include:
- Papa Approved
- Good Boy Gunner
- John Fix-It
- James-Level Organized
- Dorothy Green Thumb
- Logan Found a Safe Path
- That is a Sin
- Holly Memory Star
- Drama Queen
- Eye Roll Expert
- Rock Princess
- Molly Loves Lights
- Snack Attack

### Character intro standard
Every personalized main game must present the character name, game title and a short premise before normal play begins. A ready-state canvas overlay counts as the intro card if it is clear and skippable by the first input.

### End-state standard
Use themed end-state headings instead of generic GAME OVER where appropriate. Always retain score/result information and a clear restart path.

### Mobile requirements
- Touch control is required where relevant.
- Keyboard/mouse may remain as secondary controls.
- Canvas interactions must not require hover.
- Touch targets should be large enough for iPhone use.
- Canvas should scale responsively while maintaining internal coordinates.
- Avoid page scrolling during direct canvas interaction where possible.

### Technical standard
Prefer one self-contained HTML file per arcade game with inline CSS and vanilla JavaScript. No libraries or external sprite dependencies are required for these personalized games. Keep them static and Cloudflare Pages friendly.

### Originality
Use classic mechanics as inspiration only. Do not copy branded characters, logos, copyrighted art, proprietary sounds or commercial game level layouts. All family presentation is original to this project.

### Existing-game preservation
Preserve all prior 3D, tabletop, multiplayer and arcade work not explicitly replaced in this phase. Keep Cabin Breakout, Neon Star Patrol, Campfire Rocket and Neon Snake unchanged.

The ten generic Phase U.2 game cards are replaced by the personalized versions. Do not show duplicate generic and personalized cards.

### Release identity
Target staging release:
GAME-NIGHT-STAGING-PHASE-U3-FAMILY-ARCADE-23

Target ZIP:
black-family-game-night-STAGING-PHASE-U3-FAMILY-ARCADE-23.zip

### Required deliverables
- updated staging ZIP;
- updated cumulative Master Development Directive;
- this Phase U.3 directive;
- BLACK_FAMILY_GAME_NIGHT_PROJECT_CONSTITUTION.md;
- Phase U.3 implementation report;
- phone QA checklist;
- exact cold-package verification report;
- SHA256 checksum.

### Acceptance standard
Opening the Arcade Corner should feel like opening a strange, funny, personalized arcade made for this family, not a folder of generic Canvas examples. Gameplay must remain more important than decoration.

Do not claim phone visual approval unless actual phone testing occurred.
