# Black Family Game Night

**Build:** `GAME-NIGHT-STAGING-PHASE-I-THREE-GAMES-07`  
**Package:** `3.0.1-staging-phase-i-three-games-07`  
**Status:** Staging / real-device QA candidate

## What is new in Phase I

This full-replacement staging source adds three playable multiplayer game modules to the existing Black Family Game Night application:

### Mexican Train

- 2–8 humans/bots through the existing private-room architecture
- complete unique Double-12 set
- supplied rack sizes: 15 for 2–4 players, 12 for 5–6, 11 for 7–8
- temporary high-pip draw for the initial first player
- highest-double engine search
- private trains, shared Family/Mexican Train, boneyard and open-train states
- miniature saved family-avatar marker on open private trains
- forced double closure
- one-tile warning
- three rounds, automatic remaining-pip scoring and lowest-total winner
- complete three-round score sheet
- private racks, responsive table zoom/pan and guided tutorial scene

### Skip-Bo

- 2–6 humans/bots
- 162-card original Black Family visual deck: 144 numbered cards plus 18 Wilds
- host-selectable 10, 20 or 30-card Stock Piles, with the 30-card option limited to 2–4 players
- private five-card hands and private future Stock cards
- public Stock top/count and four public Discard Piles for every player
- four shared Building Piles
- draw-to-five, unlimited legal building plays and immediate five-card refill when the hand empties mid-turn
- play from hand, Stock top or Discard top
- Wild cards display the value they represent
- completed 1–12 Building Piles recycle into the Draw Pile
- discarding one hand card into one of four Discard Piles ends the turn
- first player to clear their Stock Pile wins
- responsive table zoom/pan and guided tutorial scene

### Backgammon

- 2-player human/human or human/bot play
- standard mirrored 15-checker setup on 24 points
- opposite movement directions
- complete legal-turn-sequence generation
- both-dice rule, larger-die rule and four-move doubles
- blocked points, blots/hits, center Bar and forced re-entry
- exact and oversized bearing off
- normal, gammon and backgammon scoring
- server-authoritative dice results
- doubling cube with offer, accept, decline, ownership and redoubles
- optional Automatic Doubles, Beavers and Jacoby settings
- dimensional crafted-board presentation, checker stacks, dice, cup and cube
- responsive board zoom/pan and guided tutorial scene

## Existing systems reused

The three modules use the existing:

- game shelf and room/lobby flow
- Durable Object persistence
- humans, bots and reconnect
- saved family avatar/outfit/player colour
- chat and Quick Reactions
- Leaderboards and duplicate-safe result recording
- Keep Playing / Return to Game Shelf flow
- in-game How to Play / Game School framework
- phone-first table zoom and pan controls

The package also retains all previously accepted Phase E–H gameplay, tabletop, Trail Trouble, Cribbage, Marbles & Jokers, profile, Requests and 3D-controller work.

## Validation recorded for this source

- `npm run check`: **303 / 303 automated tests passing**
- `npm run build`: **138 passes, 2 warnings, 0 failures**
- manifest/static asset audit: **PASS**
- 13 packaged GLBs present and valid

The two declared warnings are:

1. Three.js and selected addons still load from public CDNs.
2. Wrangler is not installed in the packaging environment, so actual Cloudflare deployment is **UNVERIFIED**.

## Staging limitations

- The three new games are complete staging implementations of their standard individual-play rule sets, but real-phone visual/game-feel QA is still required.
- Skip-Bo partnership/team mode and optional multi-match scoring are not enabled in this first staging module.
- Backgammon is presented as a dimensional DOM/CSS physical board with authoritative dice and settle animation; it is not a rigid-body WebGL physics simulation.
- Mexican Train automatically announces one tile remaining; it does not require a separate manual announcement button.
- Existing Prop Hunt visual art still has not passed the final approved-John/Papa’s-Shop art gate.

## Validate locally

```bash
npm install
npm run check
npm run build
```

Expected:

- 303 tests pass
- 0 build-validation failures

## Deploy to staging

```bash
npm run deploy:staging
```

Confirm that the loaded screen displays:

`GAME-NIGHT-STAGING-PHASE-I-THREE-GAMES-07`

Then follow `PHONE_QA_PHASE_I_THREE_GAMES_07.md` before replacing production.
