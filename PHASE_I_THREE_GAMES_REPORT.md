# Phase I Three-Game Integration Report

**Build:** `GAME-NIGHT-STAGING-PHASE-I-THREE-GAMES-07`  
**Package:** `3.0.1-staging-phase-i-three-games-07`  
**Status:** Code-verified staging candidate; real-device visual QA required

## Integration architecture

The three modules are implemented in `threeNewGames.mjs` and routed through the existing `extraGames.mjs` adapter. They therefore share the established Worker/Durable Object room, persistence, reconnect, bot, profile, reaction, chat, leaderboard and rematch architecture rather than creating a separate application.

## Mexican Train implementation

- 91 unique Double-12 dominoes
- 2–8 players
- supplied deal counts
- temporary high-pip first-player draw
- highest-double engine opening
- private and shared trains
- boneyard and private rack privacy
- family-avatar open-train marker
- forced double closure
- three-round automatic scoring and low-total winner
- vertical complete score sheet
- responsive pan/zoom tabletop

## Skip-Bo implementation

- 162 cards: 12 copies of each 1–12 plus 18 Wilds
- 2–6 players
- selectable 10/20/30 Stock size
- private hands and private future Stock cards
- public Stock top/count and public four-pile Discard areas
- four central Building Piles
- draw-to-five and mid-turn five-card refill
- hand/Stock/Discard play sources
- Wild represented values
- completed-pile recycling
- Stock-clear win condition
- responsive pan/zoom table

## Backgammon implementation

- standard 24-point / 15-checker setup
- complete legal sequence enumeration
- mandatory use of maximum possible dice
- larger-die rule when only one value can be used
- doubles as four move values
- blocked points, hits, Bar and forced re-entry
- bearing-off eligibility, exact and oversized removal
- normal, gammon and backgammon results
- doubling cube offer, acceptance, decline, ownership and redoubling
- Automatic Doubles, Beavers and Jacoby settings
- server-authoritative dice results
- dimensional tabletop UI

## Privacy and persistence

- Mexican Train opponent racks expose counts only.
- Skip-Bo opponent hands and future Stock cards remain hidden; public pile tops remain visible.
- Backgammon has no hidden checker state; authoritative dice and board state remain server-owned.
- Reconnect uses the existing persisted room snapshot and does not redeal/restart.

## Bot support

The existing Easy/Medium/Hard extra-game bot driver consumes only the legal actions exposed by each authoritative game state. It does not receive hidden opponent racks/hands or future random values.

## Tutorials and app integration

All three games are added to:

- the game shelf
- room creation/switching
- saved avatar and player-colour presentation
- Quick Reactions/chat
- Leaderboards
- shared Keep Playing / Return to Game Shelf flow
- the Game School / in-game How to Play entry

## Automated QA

The final source records:

- 303 / 303 automated tests passing
- 138 static/package passes
- 2 declared warnings
- 0 build-validation failures

Dedicated Phase I tests cover:

- Double-12 uniqueness and deal sizes
- engine/open-train/double/scoring behavior
- Skip-Bo deck distribution, privacy, Building/Discard/Stock behavior and win flow
- Backgammon setup, Bar, hits, mandatory dice, bearing off and cube scoring
- new shelf/table/tutorial/responsive UI contracts

## Declared limitations

- Actual Cloudflare deployment is unverified in this environment.
- Real-phone presentation, gesture comfort and full-match pacing remain unverified.
- Skip-Bo partnership mode and optional long-form scoring remain future options.
- Backgammon dice use authoritative results with dimensional settle animation, not a full rigid-body WebGL physics engine.
- Existing Prop Hunt production-art approval is not resolved by this tabletop release.
