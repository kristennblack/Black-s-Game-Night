# Phase W.6 Multigame Rules + UX Report

**Release:** `GAME-NIGHT-STAGING-PHASE-W6-MULTIGAME-UX-31`

## Implemented

- Vanessa's Pipe Problem now completes when connected water reaches the grey GMC destination, celebrates and advances automatically. The truck is grey with pink GMC letters only; pipes/truck rendering is more dimensional.
- Logan's Trail Logic begins at 5x5, gives one locked correct starter bike on early Journey levels, offers a per-profile optional visual tutorial, and uses a more recognizable dirt-bike drawing.
- Visual How To is available across the app: shared Phase W arcade overlays, guided tabletop/card demos, and inline visual overlays for the legacy self-contained arcade titles.
- Mexican Train uses a board-first layout with the full domino rack visible/reachable and rearrangeable via touch arrows or desktop drag.
- Golf permits discarding a stock draw without flipping/replacing a grid card, shows all eight viewer cards, opponent grids, and the final-turn state after a player closes the hole.
- Mitts / Gloves / Socks retains capture records and renders captured cards/points on table capture mats.
- Nana's Goat Whack uses more dimensional animal/toolbox drawing plus a persistent points and negative-target guide.
- Kelsi's Rock 'n' Roll Rescue replaces Neon Star Patrol in the active shelf. The legacy Kelsi URL redirects to the new game.
- 31 Blind mode remains intentionally pending the exact family rule. No guessed implementation was added.

## Mobile intent

The pass favors whole-board visibility, full-hand/rack reachability, touch-sized controls, and visual rules demonstrations. Real-device approval is still required.

## Regression gate

A dedicated W.6 regression file covers the new behavior in addition to the complete project suite.

## Working-tree validation

- `npm run check`: **457 / 457 tests passed**.
- `npm run staging:validate`: **208 pass, 0 fail, 2 environment warnings**.
- Warnings: existing Three.js CDN dependency and live Cloudflare deployment unavailable from the local validation environment.
