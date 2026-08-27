# BLACK FAMILY GAME NIGHT — PHASE F PLATFORM UPGRADE REPORT

**Build ID:** `GAME-NIGHT-STAGING-PHASE-F-PLATFORM-04`  
**Package version:** `3.0.1-staging-phase-f-platform-04`  
**Status:** CODE-SIDE STAGING CANDIDATE. REAL-PHONE / FINAL VISUAL QA REQUIRED.

This build preserves the E1 gameplay-continuity repairs and the E2/UX-03 card/home/3D-UI work, then implements the requested platform features and Trail Trouble repair.

## 1. Smear — six cards visible before bidding

Root cause was presentation-only. The server already dealt six private cards before bidding, but the client bidding-hand condition omitted Smear.

Implemented:
- Smear now renders the viewer's full six-card hand during bidding.
- Bidding controls remain separate from card play; cards are inspectable but cannot be accidentally played during bidding.
- Public player records expose only `handCount`; opponent card identities are not included.
- Automated server test starts a four-player Smear room and verifies four distinct private six-card hands before bidding.

Smear deck, bids, trump, team scoring and win rules were not changed.

## 2. End-of-game flow

A shared table-game end action area now offers:
- **KEEP PLAYING** — host starts a clean rematch in the same room.
- **RETURN TO GAME SHELF** — player exits to the shelf.

Room rematches preserve player identity/profile, avatar, outfit/style, player colour, seats, teams/settings and bots while resetting match-specific cards, scores, winner state and round history.

Also wired:
- Family Prop Hunt: host rematch route and matching end-screen choices.
- John's Birthday Seat: Keep Playing / Return to Game Shelf.
- Family Mystery current implementation: matching end choices.

Family Island Life is a persistent life-sim world and has no ordinary completed-match/winner state, so a match-end dialog is not applicable there.

## 3. Avatar Hub / saved player profile

The Home **Avatars** destination is now a real profile hub:

1. Choose character.
2. Choose outfit/style.
3. Choose player colour.
4. Save / Use This Look.

Saved profile data includes a stable local `profileId`, name, avatar, style/variant, legacy outfit variant, player colour and tutorial progress. New rooms start with these defaults, while pre-game changes remain available.

Duplicate family avatars remain allowed.

### Player colour → clothing

The existing 2D avatar clothing overlay now uses the player's identity colour. It does not recolour skin, face, hair or eyes.

A future-authored-GLB contract `applyPrimaryClothingColor()` was added. It only recolours explicitly tagged/named primary clothing materials such as shirt/top/jacket/hoodie and preserves unrelated materials/textures.

**Important:** the current packaged family GLBs do not yet constitute the requested finished authored family-avatar set. The material hook is future-compatible; it is not a claim that missing 3D art is solved.

## 4. Requests replaces Store

The home navigation now includes **Requests** rather than Store.

Players can submit:
- New Game
- Fix a Game
- Improvement
- Bug
- Other

Each request stores:
- stable profile ID when available
- player name
- category
- text
- timestamp
- status (`Requested`)

Requests are stored in the existing singleton GameHub Durable Object under `requests:v1` and survive normal refreshes/game changes on a deployed Worker. A family request-history view is included.

## 5. Shared Leaderboards

The old browser-only recent-history view was not sufficient as a shared leaderboard.

This build adds server-side GameHub leaderboard storage:
- stable match IDs
- one persisted result record per match (`result:<matchId>`)
- duplicate callback protection
- winner records keyed by stable player profile ID rather than selected avatar
- total wins
- per-game win counts
- recent results
- overall and game-specific leaderboard views

Bots are not credited as family player profiles.

**Identity note:** this private family app does not currently have account authentication. The profile ID is stable client identity data, not a cryptographically authenticated user account.

## 6. Interactive How to Play / Game School

Home **How to Play** now opens the implemented game collection rather than a single text wall.

The tutorial framework:
- is client-side practice state and never joins a live room;
- never records wins/statistics;
- supports steps, progress, Back, Restart, Exit and required highlighted actions;
- includes guided interactive examples for Smear, Screw Your Buddy, Fuck Your Buddy and Trail Trouble;
- includes game-specific step scripts for the rest of the implemented shelf, including the board/3D experiences.

Tutorial text is derived from the existing implemented rules and does not rewrite game engines.

## 7. Trail Trouble — five-card game-state repair

The old implementation had one public `drawn` card per turn. It did not have a persistent hand.

Trail Trouble now uses an authoritative private five-card hand for every human and bot:
- five cards dealt at game start;
- hand persists across turns;
- one selected held card drives legal pawn/move options;
- played card goes to discard;
- one replacement card is drawn back to five;
- draw pile recycles the discard pile when needed;
- reconnect/state reads return the viewer's current hand rather than a newly dealt hand;
- opponent card identities are not exposed in public player summaries;
- bots receive and use the same five-card model.

### No-legal-move handling

The repository contained no authoritative five-card rule for a turn where none of the five cards can make any move. The least-invasive continuation of the old behavior was used:

- only when **the entire five-card hand has no legal action**, the player may discard one held card;
- one replacement card is drawn;
- the turn ends.

A card that is individually unplayable remains in hand if another held card can be used.

### Existing Trail rules preserved

The existing authoritative Trail implementation remains the source for:
- four markers per player, with one initially on the trail;
- card 2 launch/extra-turn behavior;
- 4 moving backward;
- 10 offering +10 / -1;
- split 7;
- 11 swap;
- Hit the Trail;
- Send Packing;
- Cabin Call / cabin events;
- solo/team modes;
- bump/send-back behavior;
- Safe Trail / Home completion.

The source currently has **no implemented Trail Trouble `Scavenge` card/rule**. This build does not invent one.

## 8. Trail Trouble interaction and presentation

### Card/move UX
- Five-card hand remains visible on phone.
- Legal cards are highlighted and illegal cards muted.
- Tap card → legal markers/moves appear → tap marker/destination/action.
- No redundant Confirm step.
- Submission lock prevents duplicate rapid actions.

### Pawn animation
The server records the complete logical route sequence for multi-space moves. The client animates through those waypoints instead of using only one start-to-end interpolation.

### Board view
Trail Trouble remains in its existing DOM/CSS rendering architecture. It was not unnecessarily converted to WebGL.

Added/strengthened:
- terrain dressing and campground landmarks;
- clearer camps, Safe Trails, Home spaces and cabins;
- legal-marker glow and selected-marker treatment;
- board toolbar and view status;
- continuous two-finger pinch zoom;
- one-finger pan on the board when moved/zoomed;
- mouse-wheel zoom and desktop pointer pan;
- zoom centered around the gesture area where practical;
- gesture suppression so pinch/pan cannot accidentally select a marker;
- Reset View;
- game-surface `touch-action:none` so board pinch is handled by the game rather than browser-page zoom.

## 9. Previously requested E2 UX repairs retained

Still present and regression-tested:
- normal legal single-card tap-to-play for Screw Your Buddy, Fuck Your Buddy and Smear;
- double-submit guard;
- complete vertical score sheets for Screw Your Buddy and Fuck Your Buddy;
- cleaned cabin home presentation and approved John reference crop;
- reduced debug/QA clutter in standard 3D play;
- E1 camera/movement/collision/spawn recovery foundation.

## 10. 3D art status — still unresolved by code

This build **does not** claim that the current real-time 3D games now have finished production character/environment art.

The known art gap remains:
- most family members do not have genuine finished authored/skinned 3D avatar assets;
- current real-time environments remain primarily procedural/generated geometry;
- existing John/Gunner/prop GLBs validate technically but are not being represented as the final requested authored visual standard.

See:
- `3D_ASSET_PRODUCTION_PLAN.md`
- `PAPA_SHOP_VERTICAL_SLICE_ASSET_SPEC.md`
- `PHASE_E_STAGING_REPORT.md`

The correct art production order remains one real avatar/dog + Papa's Shop authored vertical slice before mass-producing the remaining maps.

## 11. Validation completed

- `npm run check`: **245 / 245 PASS**
- Platform static validation: **116 PASS / 2 WARN / 0 FAIL**
- Packaged GLB integrity audit: **PASS 10 / 10**
- Local static HTTP smoke:
  - `/` 200
  - `/new-games.html` 200
  - `/island-life.html` 200
  - `/app.js` 200
  - `/styles.css` 200
  - `/sw.js` 200
  - `/models/manifest.json` 200
  - John/Gunner GLBs 200 with valid `glTF` magic

### Declared warnings
1. Three.js 0.185.1 / addon runtime CDN references still remain.
2. Wrangler is not installed in this runtime, therefore actual Cloudflare deployment remains **UNVERIFIED**.

### Visual verification
A headless Chromium render was attempted again, but the container Chromium process did not complete a reliable render and timed out with environment/DBus compositor issues.

Therefore:

**VISUAL RESULT UNVERIFIED**

The code and state behavior are tested. Trail board appearance, home composition, Smear phone hand spacing, new modal layouts, and all 3D visual/game-feel results still require the next real-phone test.

## 12. Next-device priority

Use `PHONE_QA_PHASE_F_PLATFORM_04.md` and verify the visible build identifier is exactly:

`GAME-NIGHT-STAGING-PHASE-F-PLATFORM-04`

Do not treat any screenshot from an older cached build as evidence for this package.
