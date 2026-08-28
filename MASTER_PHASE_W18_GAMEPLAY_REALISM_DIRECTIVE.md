# BLACK FAMILY GAME NIGHT
# MASTER GAME DESIGN + PRODUCTION DIRECTIVE W.18
## Gameplay Reliability + Mexican Train Layout + Family Mystery Realism + Molly Light Chase

Planning/build date: 2026-08-28  
Status: **HIGHEST-PRECEDENCE CURRENT MASTER PROMPT**  
Runtime release: `GAME-NIGHT-STAGING-PHASE-W18-GAMEPLAY-REALISM-40`  
Design release: `GAME-NIGHT-DESIGN-PHASE-W18-GAMEPLAY-REALISM-40`

W.18 is cumulative. It starts from the complete W.17 Cabin/Cosmetics build and preserves all non-conflicting earlier work. W.18 supersedes earlier instructions only where the rules, controls, naming, or presentation below are more specific. Historical sections retained later in this document are reference/foundation material even if their original headers called themselves current.

======================================================================
0. W.18 ABSOLUTE PRECEDENCE + QUALITY GATE
======================================================================

Order of precedence:
1. The user's newest explicit instruction.
2. This W.18 directive.
3. Approved family identity/relationship rules and locked family-specific gameplay.
4. W.17 Cabin and portrait-polish runtime.
5. W.16/W.15 Cabin, cosmetics, collections and realism architecture.
6. W.13/W.12 gameplay and collection foundations.
7. Earlier non-conflicting directives.

**A game is not considered working because it loads, renders a board, or highlights a legal piece.** For every repaired game, QA must prove that a human can start it, perform the legal interaction, see state update immediately, continue for multiple turns, and reach or preserve a valid end-state path. A highlighted card/checker/domino that cannot complete its move is a P0 gameplay failure.

Primary interaction standard:
- Phone and desktop must both work.
- Tap/click is the primary universal interaction.
- Drag may exist as an enhancement, never as the only reliable control.
- Legal destinations should visibly illuminate.
- Where board hit targets can be small, provide a direct-action fallback that invokes the same authoritative engine action.
- Successful actions refresh the visible game state immediately. Never leave the interface dependent on a delayed poll for the player to see their move.
- Do not cosmetically hide an engine failure. Repair the rules/state transition first, then the UI.

======================================================================
1. FAMILY NAME LOCK
======================================================================

The family character is **Lizzy** or **Elizabeth**. Never display the alternate ie-ending spelling in player-facing copy. Legacy lowercase aliases/URLs may remain internally only when necessary for backward compatibility and must continue to resolve to the single Elizabeth identity rather than creating a second person.

======================================================================
2. BACKGAMMON — P0 INTERACTION REPAIR
======================================================================

Required control loop:
1. Dice roll establishes available move values automatically.
2. Tap/click a legal checker.
3. Every legal destination for that checker visibly lights.
4. Tap/click the destination.
5. The checker moves, the appropriate die is consumed, and the board refreshes immediately.

Required reliability:
- A legal checker may never light up without being movable.
- Preserve correct bar priority, hits, blocked points, bearing off, forced-use rules, doubles and doubling-cube rules already implemented.
- Add a visible **LEGAL MOVES** fallback list generated directly from current `bgMove` actions. Board tapping remains primary; fallback buttons guarantee playability if a checker hit target is difficult on a device.
- Touch and mouse must share the same authoritative action path.

======================================================================
3. BLACKGAMMON — DICE ALLOCATION + CHECKER RELIABILITY
======================================================================

For the four-single-dice allocation state:
- The controller may tap two dice from the shared roll.
- Selected dice visibly show selection.
- If a device misses die taps, present direct pair buttons such as `KEEP 2 + 5`, each backed by an authoritative `blackAllocateSingles` action.
- After allocation, legal checker movement uses the same tap-checker → glowing destination → tap-destination model.
- Also provide direct legal-move fallback buttons from `blackMove` actions.
- Successful allocation and movement refresh immediately.

Do not alter the locked Blackgammon 4/4/4/3 opening distribution, special 4 behavior, large tiebreak die, rescue/cover behavior or other already-confirmed house rules except where a newer explicit instruction says otherwise.

======================================================================
4. DECK SWEEP — HAND + FOUR EXPOSED FRONT PILES ARE ALL LIVE
======================================================================

Correct play model:
- The four face-up cards/piles directly in front of a player are **playable cards**, not decorative or locked cards.
- They remain playable while the player still has cards in hand.
- Cards from hand and exposed table cards may be played together when they share the required matching rank.
- Legal combinations may contain hand only, exposed-table only, or hand + exposed-table cards.
- Face-down cards below the four exposed positions remain locked until the player's hand is empty **and** the exposed card above that slot has been cleared, preserving the existing staged-unlock rule.
- Playing a table card must clear its actual table slot in authoritative state.
- All generated actions must reference real card IDs and be accepted by the engine.

UI:
- Clearly label that both `YOUR HAND` and `YOUR 4 EXPOSED TABLE CARDS` are live.
- Legal groups should be easy to identify and tap.
- Never require a player to empty their hand before using the four exposed face-up cards.

======================================================================
5. CAMPFIRE CHAOS — DRAW STACK 4 MUST RESOLVE AND CONTINUE
======================================================================

When a player is facing a pending Draw Stack 4 / Supply Raid value of 4:
- `Take 4 cards` must draw exactly four cards when no further stack/challenge changes the amount.
- Clear the pending draw/challenge state.
- Advance the turn according to the existing Campfire Chaos rules.
- Refresh the UI immediately.
- No modal, animation, pending flag or stale client state may leave the player unable to continue.

The same no-deadlock rule applies to other pending draw totals.

======================================================================
6. GOLF — REJECTED DRAW / VISIBLE DISCARD RULE
======================================================================

Locked family rule:
- If the player takes the visible discard card **or** draws from the stock and decides not to use that card in their grid, they must flip one of their own remaining face-down grid cards.
- This requirement applies while more than one face-down card remains.
- The rejected drawn/taken card goes to discard, the chosen grid card flips face-up, and the turn advances.
- **Exception:** if exactly one face-down card remains, rejecting the drawn/taken card does **not** force that final card to flip. Discard the rejected card, leave the last grid card face-down, and continue the game normally.
- UI must not offer a direct discard-without-flip action while two or more face-down cards remain.

======================================================================
7. MEXICAN TRAIN — PROPER DIGITAL RAIL LAYOUT, NO LITERAL TABLE
======================================================================

Rule reference checked against common Mexican Train rules at MexicanTrain.com and then overridden by the family's explicit house choices where applicable.

Locked presentation:
- Remove the literal furniture/table surface from the core play layout.
- Keep the dominoes, station/engine, boneyard and rails visually clear against a clean transparent/digital play field.
- Central engine/station is the visual anchor.
- The player's own private train must be easy to find and visually prioritized.
- Other players' private trains remain separately readable.
- The **MEXICAN TRAIN · COMMUNITY** is a distinct public/shared rail available to everyone.
- Open player trains must be visibly marked.
- Dominoes lay end-to-end with matching pips; the engine-facing first tile and subsequent open end must read naturally.
- Double tiles render perpendicular/crosswise to the train.

Locked family turn rule:
- Normally play **one domino per turn**.
- When a double is played, the player must play another domino to close/satisfy that double if able.
- An unresolved double is visually obvious and constrains subsequent play according to the existing engine rule until closed.
- If no legal play exists, draw from the boneyard and follow the existing pass/open-train flow.

Do not collapse all trains into one strip. The community rail and each personal rail are distinct game objects.

======================================================================
8. TRAIL TROUBLE — PLAYABILITY RECOVERY
======================================================================

Treat inability to make the first/next move as P0.

Required QA path:
- start game with supported player count / computer fill;
- receive the five-card private hand;
- choose a legal card;
- see legal marker destinations/modes;
- execute move/out/send/split/swap/cabin actions as applicable;
- consume/commit the card;
- animate the marker route;
- advance the turn or honor extra-turn rules;
- repeat several turns without dead state.

UI repair:
- Preserve card → board-marker interaction as the primary board-game feel.
- Add a compact **Quick Move** fallback built from current legal Trail actions when no card is selected, so a valid move can always be invoked even if a small board hit target fails.
- Refresh immediately after Trail actions.

======================================================================
9. PRAIRIE POTS — PLAYABILITY RECOVERY
======================================================================

Treat the reported inability to play as P0.

Required behavior:
- Current legal playable cards/actions must be visible.
- Tapping the card remains supported.
- Provide a prominent direct `PLAY [card]` control tied to the same `prairiePlay` action as a guaranteed fallback.
- Any continue/round transition action must remain available and refresh immediately.
- Verify first turn, normal sequence play, pot/chip state transitions and several successive turns.

======================================================================
10. FAMILY MYSTERY — PREMIUM 3D CABIN-REALISM PASS
======================================================================

Visual target:
- Family Mystery should feel like a playable miniature family property built from the same visual language as the Cabin/home screen, **not** a flat Clue clone.
- Reuse approved Cabin artwork and realism cues generously: warm wood, realistic room scenes, dimensional trim, furniture/prop depth, atmospheric lighting, shadows and miniature-dollhouse presentation.
- Current approved Cabin assets may be used as environment plates/material targets; future authored 3D room assets should preserve this look rather than reverting to generic blocks.
- The high overview remains readable as a board, but closer room moments should feel like entering a real miniature room.

Movement system:
- Keep the roll/move-range rule already present.
- Render movement nodes as slightly raised **3D clue blocks** between rooms.
- On the active player's turn, every reachable legal block/room glows clearly.
- The player taps the **final reachable destination**, not each intermediate block.
- Compute the route and animate the family standee through the intervening blocks automatically.
- Movement animation may be skipped only through the existing user setting.

Corner shortcuts:
- The four true corner rooms are Camper, Shop, Living Room and Papa's Shop.
- Add obvious kitty-corner passages:
  - Camper ↔ Living Room
  - Shop ↔ Papa's Shop
- A corner room displays an obvious `SECRET PASSAGE` control/badge naming the opposite destination.
- Passage movement is legal as a direct adjacency shortcut and should not draw an ugly diagonal hallway across the board.

Camera / cinematic behavior:
- Normal play uses an isometric/dollhouse overview.
- When arriving in a room or entering an investigation/suggestion moment, use a brief closer room-arrival/cinematic view with the room's artwork/scene, then return cleanly to play.
- Do not lose board state or input focus during the camera transition.

Family identity:
- Continue using approved family portraits/standees and established relationships/objects.
- Display Elizabeth as **Lizzy** or **Elizabeth** only; do not use the alternate ie-ending spelling.

======================================================================
11. NEON SNAKE IS REPLACED BY MOLLY'S LIGHT CHASE
======================================================================

There should be one active Molly arcade game, not Molly plus a generic Neon Snake duplicate.

Active game: **Molly's Light Chase**
- Molly is the playable puppy and uses the approved Molly character artwork.
- The game uses a classic growing-chase/snake spatial loop without visually stretching Molly's body.
- Molly's head/body position leads a growing **glowing paw-print/light trail**.
- Steer with keyboard arrows/WASD on desktop, swipe on touch devices, plus visible phone direction buttons.
- A glowing moving/placed light is the collectible target.
- Every collected light adds one trail segment and one point.
- The trail becomes the self-collision hazard as it grows.
- Hitting the boundary or the existing trail ends the run.
- Speed increases in readable steps as more lights are caught.
- Preserve best score and existing achievement hooks.
- Keep the visual environment warm/cabin-like rather than generic neon cyber graphics.

Legacy handling:
- Remove Neon Snake from the active shelf/tutorial/service-worker shell.
- `/neon-snake.html` may remain only as a compatibility redirect to Molly's Light Chase so old links do not break.
- Remove the older duplicate Molly arcade entry if present; Molly's Light Chase is the canonical Molly game.

======================================================================
12. W.18 IMPLEMENTATION MAP
======================================================================

Key runtime areas for this release:
- `extraGames.mjs`: Golf, Deck Sweep, Campfire and other authoritative tabletop state transitions.
- `blackGammon.mjs`: direct four-single allocation action support.
- `public/app.js`: Backgammon/Blackgammon fallback controls, immediate action refresh, Deck Sweep/Golf/Mexican Train/Trail/Prairie UI.
- `public/styles.css`: W.18 tabletop/fallback/Mexican Train presentation.
- `public/new-games.html`: Family Mystery realism, raised clue blocks, auto-routing, corner passages and room-arrival cinematic.
- `public/mollys-light-chase.html`: complete Molly chase replacement gameplay.
- `public/neon-snake.html`: legacy redirect only.
- `public/arcade-tutorials.mjs`: Molly tutorial and obsolete Neon Snake removal.
- `public/sw.js`: W.18 cache identity and obsolete Neon Snake shell removal.
- `test/phase-w18-gameplay-realism.test.mjs`: explicit W.18 regression coverage.

======================================================================
13. W.18 ACCEPTANCE CHECKLIST
======================================================================

A release candidate fails if any answer below is NO:

BACKGAMMON
[ ] Can I tap a highlighted checker and then a highlighted destination?
[ ] If board tapping is awkward, can I execute the same legal move from a direct fallback?
[ ] Does the state refresh immediately?

BLACKGAMMON
[ ] Can I choose two shared dice by tap?
[ ] Can I use a `KEEP X + Y` fallback?
[ ] Can I move checkers through board taps or direct legal-move fallback?

DECK SWEEP
[ ] Can I play one of my four exposed front cards while my hand is nonempty?
[ ] Can a matching hand card and exposed table card be played together?
[ ] Do played table cards disappear from the correct slots?

CAMPFIRE CHAOS
[ ] Does `Take 4` actually add four cards, clear pending draw and advance play?

GOLF
[ ] Does rejecting a stock draw force a face-down flip when more than one remains?
[ ] Does rejecting the visible discard do the same?
[ ] With one hidden card left, can I discard the rejected card and leave the last card hidden?

MEXICAN TRAIN
[ ] Are my train, every other player train, and the community train distinct?
[ ] Is the community rail obviously public?
[ ] Is the literal furniture/table gone from the play surface?
[ ] Do doubles rotate crosswise and force another closing play?

TRAIL TROUBLE / PRAIRIE POTS
[ ] Can a player complete a legal first turn?
[ ] Can several turns continue without stale input?
[ ] Is there a reliable direct fallback for small-hit-target situations?

FAMILY MYSTERY
[ ] Do reachable 3D clue blocks light up?
[ ] Can I tap the final destination and watch the full route animate?
[ ] Are Camper ↔ Living and Shop ↔ Papa's Shop obvious shortcut pairs?
[ ] Does the board reuse the Cabin realism/art direction?
[ ] Does room arrival receive a closer cinematic moment without breaking play?

MOLLY
[ ] Is Neon Snake gone from the active shelf?
[ ] Is Molly visibly the puppy being controlled?
[ ] Does every light make the glowing trail longer?
[ ] Do swipe, direction buttons and keyboard controls work?
[ ] Do boundary/trail collisions and speed ramp work?

NAMING
[ ] No player-facing alternate ie-ending spelling exists in active runtime copy.

AUTOMATED RELEASE GATE
[ ] `npm test` passes in full.
[ ] `npm run check` passes in full.
[ ] W.18 regression tests cover the user-reported failures.

======================================================================
14. DO NOT REGRESS
======================================================================

Do not undo any non-conflicting W.17 Cabin/cosmetics work, W.11 Prop Hunt stability work, approved character art, multiplayer room behavior, birthday systems, existing game rules, or Cloudflare deployment architecture while repairing these games. Fix the broken interaction/state path at the smallest responsible layer and preserve the rest of the collection.
