# Phase L New Games Shelf Fix

**Build:** `GAME-NIGHT-STAGING-PHASE-L-NEW-GAMES-SHELF-09`
**Package:** `3.0.1-staging-phase-l-new-games-shelf-09`

## Root cause
Mexican Train, Skip-Bo and Backgammon were fully present in the Phase K source and game engine, but the `home()` shelf `categoryOrder` omitted their game keys. They could exist in metadata/routing and still not render as visible Create Game cards on the lodge shelf.

## Fix
- Added a visible **New Table Games** shelf category.
- Added **Mexican Train**, **Skip-Bo** and **Backgammon** to that shelf.
- Kept all three in the existing multiplayer/room/bot/reconnect/tutorial/leaderboard flow.
- Bumped app and service-worker cache IDs so a previously cached shelf cannot mask the repair.
- Added a regression test that validates actual shelf visibility, not merely module/source presence.

## Visual 3D status
John Character Lab 02 remains in the production character slot from Phase K. This shelf repair does not claim final 3D art approval.
