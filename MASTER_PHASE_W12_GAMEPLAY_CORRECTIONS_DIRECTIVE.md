# BLACK FAMILY GAME NIGHT
# MASTER GAME DESIGN + PRODUCTION DIRECTIVE W.12
## Gameplay correction release: Blackgammon, Prop Hunt controls, Mexican Train table state, Last Haven hand visibility, Deck Sweep progression and Prairie Pots scoring clarity

Planning/build date: 2026-08-28
Status: **HIGHEST-PRECEDENCE CURRENT MASTER PROMPT**
Runtime release: `GAME-NIGHT-STAGING-PHASE-W12-GAMEPLAY-CORRECTIONS-36`
Design release: `GAME-NIGHT-DESIGN-PHASE-W12-GAMEPLAY-CORRECTIONS-36`
Supersedes: W.11 wherever this W.12 section explicitly changes gameplay, controls, naming or table UX.
Preserves: W.11 Prop Hunt smoothness/stability architecture, W.10 professional production framework, approved character identity, W.8 tutorial/token systems, all locked rules not explicitly changed below.

======================================================================
0. W.12 PRECEDENCE + RELEASE OBJECTIVE
======================================================================

This is the canonical next-build prompt.

Current precedence:
1. Explicit current user instruction.
2. Approved family turnaround identity and locked family-specific rules.
3. This W.12 correction section and `MASTER_PHASE_W12_GAMEPLAY_CORRECTIONS_DIRECTIVE.md`.
4. W.11 stability requirements.
5. W.10 professional game-design framework.
6. Non-conflicting W.9/W.8/W.7 and older directives.
7. Historical prototypes and obsolete implementation details.

W.12 is a **playability correction release**. A game that visually launches but cannot complete its core turn loop is not considered playable. Each repaired game must expose enough state on screen for a player to understand what can be done next without guessing.

======================================================================
1. BLACKGAMMON — ONE-WORD NAME + GUARANTEED CHECKER MOVEMENT
======================================================================

### Naming lock
- The current product name is **Blackgammon**, one word.
- Standard Backgammon remains a separate game.
- Current shelf labels, current help/tutorial copy, current rules title and current win/error messages should use `Blackgammon`.
- Historical phase reports may retain the old two-word spelling as history.

### Core failure being corrected
Players could roll/allocate dice but then the phone UI could make checker movement effectively inaccessible.

### Required interaction contract
- After rolling and allocation, legal `blackMove` actions must always remain actionable.
- Board-first direct manipulation remains the preferred path: select die/token, select checker/bar source, select legal destination.
- Add a **direct legal-move fallback** below/beside the board. Every legal move can be executed from a readable button even if a checker stack is difficult to tap.
- When only one playable die token exists, it may be preselected to remove unnecessary taps.
- Legal destinations remain visually highlighted.
- Illegal checker taps must not consume the turn or dice.
- After every move, refresh the state immediately and expose remaining legal moves until the assigned dice are exhausted.
- Bar entry, bearing off, forward/backward sets, rescue and transfer rules remain unchanged.

### W.12 acceptance gate
A phone player must be able to start a Blackgammon game, roll, allocate, execute at least two successive checker moves and continue the round without needing precision taps on overlapping checkers.

======================================================================
2. FAMILY PROP HUNT — SPEED, CONTROL DIRECTION, HANDS + WEAPON
======================================================================

W.11 remains authoritative for fixed-step simulation, interpolation, camera hysteresis, collision ownership, recovery, pooling and frame pacing. W.12 changes the **control feel and weapon presentation** only.

### Movement tuning
- Increase Prop Hunt walk speed modestly from the W.11 value so traversal feels lively rather than sluggish.
- Current baseline: walk approximately 3.15 m/s, sprint approximately 5.35 m/s, with responsive acceleration/braking.
- Do not trade stability for speed. W.11 fixed simulation and collision behavior remain mandatory.

### Controller direction
- Fix the reported backwards mobile controller behavior.
- Pushing the left joystick upward must move the player forward relative to the current camera view.
- Pulling down moves backward; left/right strafe left/right relative to camera.
- Desktop WASD remains camera-relative and intuitive.
- Validate on a real touch device with camera yaw changed to at least 0°, 90°, 180° and 270°.

### Hands and Prop Zapper presentation
- Hunter hands and gun must appear **in front of the torso**, not behind the character.
- Right hand remains trigger hand; left hand supports the front grip.
- The procedural fallback rig must use the same forward-axis convention as approved authored rigs.
- Do not fix this with a camera trick that leaves the actual rig backwards.
- The gun must remain visible in normal shoulder gameplay, sprint-to-aim transitions and while firing.
- Muzzle, tracer and impact continue to align with W.11/W.7 shot-validation rules.

### W.12 acceptance gate
On phone: push joystick forward, run toward the center of the view, rotate camera, repeat; hands and gun remain visibly forward; fire at a wall and see aligned muzzle/tracer/impact.

======================================================================
3. MEXICAN TRAIN — FLIPPABLE DOMINOES + COMPLETE TABLE READABILITY
======================================================================

### Domino orientation
- A domino may be played using either end when either end legally matches.
- Provide an explicit **Flip** control on held dominoes so the player can inspect/rearrange the tile end-for-end before choosing it.
- Flip is presentation/orientation state only; server legality continues to validate either matching end and canonicalize placement.

### Full train visibility
The central play surface must show, at the same time:
- the engine;
- the community **Family Train / Mexican Train**;
- every player's personal train/run;
- each train's open end;
- whether each personal train is private or open;
- the visible avatar/open marker when a train becomes available to others;
- unresolved-double state where applicable.

A player should be able to look at the board and answer: **Where can I legally play right now?** without opening another menu.

### Held dominoes
- All of the viewer's held dominoes remain reachable/visible in the rack.
- Rack order can be rearranged on phone and desktop.
- Flipping a rack tile must not lose its identity or corrupt drag/reorder state.

### Score sheet
- The score sheet must live **outside the board play area**, in the side panel on wide screens and below the board on narrow/mobile layouts.
- It must not cover trains or shrink the usable train board.
- Show per-round scores and total; lowest total wins.

### W.12 acceptance gate
A player can visually inspect all personal trains + community line, flip any held tile, identify an open opponent train, select it as a legal destination when rules allow, and read the score without obscuring the board.

======================================================================
4. LAST HAVEN — SHOW THE PLAYER'S HAND / SUPPLY INVENTORY
======================================================================

The planning fantasy requires seeing what you own before deciding whether to build, play or trade.

### Required hand dock
Always expose the viewer's usable private inventory in a dedicated hand/supply area:
- Timber count;
- Scrap count;
- Food count;
- Fuel count;
- Medicine count;
- held Survival cards.

### UX rules
- Label it clearly as the player's supply hand/inventory.
- It remains visible during the main playing phase and trade/build decisions.
- Resource counts must update immediately after a trade, build, gain or spend.
- Do not reveal another player's private held cards/resources unless that game rule explicitly makes them public.

======================================================================
5. DECK SWEEP — RANK SORTING + SPECIAL TEN + SLOT-BY-SLOT TABLE FLOW
======================================================================

### Sorting
- Deck Sweep hands sort **by rank/number first**, not by suit.
- Suit is only a secondary tie-breaker for cards of the same rank.
- Keep rank order stable/predictable throughout the turn.

### Special 10 readability
- Rank 10 is a special Sweep card and must have a persistent visual highlight/reminder.
- Highlight 10s in the player's hand and visible table cards without making other legal-card highlights ambiguous.
- Include a nearby `10 = SPECIAL SWEEP CARD` reminder.

### Table-card progression, locked rule correction
Each player has four table columns/slots:
- one face-up card above;
- one face-down card beneath.

After the player's hand is exhausted:
1. Any legal face-up table card may be played.
2. When the face-up card from a **specific slot** is played, the face-down card under that slot becomes available on a later turn.
3. Other face-up cards do **not** have to be cleared first.
4. A face-down card cannot be played while its own face-up covering card remains.
5. Playing a face-down card is blind; resolve it according to Deck Sweep rules.

### Opponent readability
For every opponent, render the four table slots so the viewer can see:
- which face-up cards remain and their faces;
- which slots have cleared their face-up card;
- whether a face-down card remains under each slot;
- how many cards remain in the opponent's hand.

Never reveal the identities of face-down cards before they are legally turned/played.

### W.12 acceptance gate
With other face-up cards still present, clear one face-up slot and successfully play that slot's face-down card on a later turn. The same state is visually understandable for opponents.

======================================================================
6. PRAIRIE POTS — PROGRESSION + CHIP AWARD CLARITY
======================================================================

### Core goal
Prairie Pots must complete its playable sequence and make earned chip/pot progress unmistakable.

### Required scoring feedback
- Every pot award immediately transfers chips into the winning player's chip total.
- Public state exposes current chip totals.
- Public state exposes the most recent pot award: player, amount and pot(s) claimed.
- Board displays a clear current-status/win message such as `Player claimed 7 chips from the pots!`.
- Display current chip totals near/below the pot board.
- Claimed pots visibly change to claimed/empty state.
- Poker pot resolution remains visible at round start.
- Prairie Pot end-of-round settlement and carryover remain governed by existing locked rules.

### Progression safety
- At every sequence turn, the current player must either have a legal advertised action or the engine must advance according to the house sequence rules.
- A round may not silently stall with no actionable card and no explanation.
- `Continue` between rounds remains explicit and all-player synchronized.
- Final winner is determined by the locked Prairie Pots chip rule after configured rounds.

### W.12 acceptance gate
A test can force a known special pot card, play it, verify the pot empties, verify the player's chip total increases by the pot value, and verify the public/UI state reports the award.

======================================================================
7. CROSS-GAME PROFESSIONAL UX REQUIREMENTS
======================================================================

For every W.12 repair:
- legal action must be visible, not merely present in server JSON;
- critical public state belongs on the play surface or adjacent sidebar, not hidden behind debug/UI menus;
- mobile touch targets must remain comfortable and non-overlapping;
- player-private information stays private, while public table information is deliberately visible;
- server remains authoritative for legal moves; visual flipping/reordering cannot bypass rules;
- reconnect must reconstruct the same visible board state;
- do not regress W.8 HOW TO tutorial access;
- no W.12 correction may break W.11 Prop Hunt frame-pacing/recovery architecture.

======================================================================
8. W.12 DEFINITION OF DONE
======================================================================

A W.12 release candidate is not done until:
- Blackgammon can roll **and move** on phone using either board manipulation or the direct fallback;
- Prop Hunt mobile forward input actually moves forward relative to the camera and hunter hands/gun are visibly in front;
- Mexican Train shows every train + community train, supports rack flipping/reordering and keeps score off the board;
- Last Haven exposes the player's usable supply/survival hand;
- Deck Sweep sorts by rank, identifies 10s, supports per-slot face-down unlocking and shows opponent table-state without leaking hidden cards;
- Prairie Pots proves a pot award changes chips and communicates the award;
- automated regression suite passes;
- staging validator passes;
- the exact shipped ZIP passes archive integrity + cold-extraction regression checks;
- real-device visual/touch QA remains required for Prop Hunt and dense table layouts.

======================================================================
9. IMPLEMENTATION STATUS IN THIS W.12 RUNTIME
======================================================================

Implemented in code for this candidate:
- one-word Blackgammon name and direct legal-move fallback;
- modest Prop Hunt speed increase, corrected mobile joystick direction transform, forward weapon/hand placement;
- Mexican Train tile flip UI, retained rack rearrangement, all personal/community trains visible, score sheet moved to sidebar/below layout;
- Last Haven supply/survival hand dock;
- Deck Sweep rank-first sorting, 10 highlight, per-slot face-down unlock, all-player table stations;
- Prairie Pots chip totals, last-award state and explicit board progression/win feedback.

Still requires actual-device confirmation:
- Prop Hunt direction/weapon presentation under real touch/camera conditions;
- dense Mexican Train and Deck Sweep layouts at target phone sizes;
- Blackgammon overlapping-checker touch comfort in an actual full game.

======================================================================
10. FINAL W.12 INSTRUCTION
======================================================================

Repair core turns before adding polish. Do not call a game playable because its engine contains a legal action if the player cannot see or execute that action from the shipped interface.
