# Phase W.3 Vanessa + Logan Upgrade 28

## Scope
Focused Arcade Corner upgrade built on the validated Phase W.2 release. All W.2 Backgammon/Black Gammon and Trail Trouble/Prairie Pots repairs, W.1 join response work, and Dorothy Garden upgrades are preserved.

## Vanessa's Pipe Problem
- Replaces flat grey-line pipe rendering with dimensional socketed metal pipes.
- Pipe bodies use layered steel shading, highlight passes, couplers, hubs, recessed sockets, bolts and animated water-flow dashes.
- Pipe rotation now animates physically rather than snapping.
- Later service calls add repairable mud clogs, leaks and stuck valves before rotation.
- Adds a detailed grey transport/work truck across the worksite apron with cab, deck, rails, mirrors, lights, tires and tie-down details.
- Adds Vanessa's signature pink GMC-style pickup on the grey transport deck using original stylized game artwork.
- Vehicle/worksite scene stays visible on the start state rather than being hidden behind a full-board overlay.
- Missions center the truck/service-call fantasy while keeping the existing pipe-rotation loop recognizable.

## Logan's Trail Logic
- Replaces the old Minefield/Minesweeper rules completely while retaining the legacy URL for compatibility.
- New rules: exactly one dirt bike per row, one per column, one per terrain region, and no bikes touching horizontally, vertically or diagonally.
- Tap cycles Empty -> X -> Dirt Bike -> Empty; right-click can place a bike directly on desktop.
- Mistakes remain placeable but conflicting bikes glow instead of being blocked.
- Terrain regions are connected, irregular outdoor zones with mud, forest, gravel, shoreline, grass, sand, creek, camp and rock treatments.
- Puzzle generator validates a unique solution before play and preserves its intended solution while shaping terrain.
- Journey progression uses 6x6, 7x7, 8x8 and 9x9 boards.
- Adds a deterministic Daily Puzzle.
- Adds a three-stage hint loop: focus row, impossible X, reveal one correct bike.
- Fishing is integrated through shoreline/creek terrain and completion fish-jump scenery while dirt bikes remain the main placement piece.

## Home / offline integration
- Home shelf now names Logan's game `Logan's Trail Logic` with the new rules in the subtitle.
- Vanessa shelf description now references the detailed worksite, pink GMC and grey hauler.
- Service worker cache advances to W.3 and includes both new logic/render modules for offline use.

## Validation
- Phase W.3 focused tests cover unique connected Logan puzzles at all four sizes, rule conflicts, shelf identity, Vanessa pipe flow/rotation/hazards, and required presentation hooks.
- Full suite: 434 / 434 automated tests pass.
- Build validator: 199 pass, 0 fail, 2 environment warnings.
- Container Chromium screenshot capture remains unreliable in this environment, so actual-device visual approval remains required after deployment.

## Release identity
GAME-NIGHT-STAGING-PHASE-W3-VANESSA-LOGAN-UPGRADE-28
