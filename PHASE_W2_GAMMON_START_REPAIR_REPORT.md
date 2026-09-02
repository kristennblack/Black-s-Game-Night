# Phase W.2 Gammon + Start Repair 27

## Scope
Focused repair release. Backgammon and Black Gammon are the visual quality gate. Trail Trouble and Prairie Pots receive start-flow recovery. Phase W.1 join-response and Dorothy Garden changes are preserved.

## Backgammon visual repair
- Board-first layout uses the full game width rather than a permanent side control rail.
- Playing surface is a long physical Backgammon case with four six-point quadrants.
- Center Bar is vertical, raised, and capable of displaying captured stacks for both players.
- Checker renderer now produces one physical disc for every checker in state. The former three-disc cap and count replacement are removed.
- Checker faces are true 1:1 circles with bevel, rim and thickness cues rather than flattened oval shapes.
- Starting engine remains standard 2 / 5 / 3 / 5 mirrored 15-checker setup.
- Bear-off trays are integrated into the physical case and render each borne-off checker as a disc.
- Player home board is oriented bottom-right for the viewer.
- Dice and cube information live beneath the physical board; secondary roster/help panels move below the game surface.

## Black Gammon visual repair
- Shares the corrected Backgammon board geometry and responsive layout.
- Keeps the locked 4 / 4 / 4 / 3 custom 15-checker setup.
- Uses a darker material treatment while retaining blue Forward, red Backward and gold Rescue guidance.
- Mixed stacks remain individually round and readable rather than being horizontally scaled.
- Uses the same viewer-home bottom-right orientation.

## Trail Trouble / Prairie Pots start recovery
- Host start flow exposes Ready & Start instead of an unexplained disabled button.
- Lobby identifies the player or requirement still blocking start.
- Solo test path offers Quick Start vs Computer where valid, adds a Medium bot, seats/readies the host and starts.
- Team-mode minimums remain enforced.

## Visual QA note
Static W.2 starting-board fixtures are included for Backgammon and Black Gammon. Container Chromium remains unreliable for screenshot capture in this environment, so real-device visual approval remains required after deployment.

## Release identity
GAME-NIGHT-STAGING-PHASE-W2-GAMMON-START-REPAIR-27

## Validation result
- 427 / 427 automated tests pass.
- Full JavaScript syntax + regression check passes.
- Build validator: 196 pass, 0 fail, 2 environment warnings.
- Remaining warnings: core 3D CDN dependency and live Cloudflare deployment unverified from the local container.
