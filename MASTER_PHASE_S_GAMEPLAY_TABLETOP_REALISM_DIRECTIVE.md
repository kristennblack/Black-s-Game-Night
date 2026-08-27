# BLACK FAMILY GAME NIGHT

# MASTER NEXT BUILD DIRECTIVE

## Gameplay + Board UX + Realism Pass

### Proposed Phase

**Phase S – Gameplay Repair + Tabletop Realism**

---

# 1. PRIMARY OBJECTIVE

The next build should focus on two things:

1. **Repair games that are currently blocked or missing essential gameplay** 
2. **Upgrade tabletop presentation so the games feel like real, polished board/card games rather than small 2D boards inside oversized decorative tables** 

Do not spread development effort into unrelated redesigns.

Do not rebuild working rule engines unnecessarily.

The next release should materially improve:

-  Skip-Bo 
-  Cribbage 
-  Trail Trouble 
-  Backgammon 
-  Black Gammon 
-  Last Haven 
-  Marbles & Jokers 
-  Screw Your Buddy 
-  Fuck Your Buddy 

Prop Hunt P2 work should remain preserved.

---

# 2. PRIORITY ORDER

Use this order unless a genuine technical dependency requires something different.

## Priority 1: Game-breaking bugs

1.  Trail Trouble cannot start 
2.  Last Haven stops after placing the first camp 
3.  Skip-Bo does not allow proper Stock Pile play 
4.  Backgammon / Black Gammon dice rolling must work reliably 

## Priority 2: Major gameplay usability

5.  Skip-Bo board flow 
6.  Backgammon / Black Gammon board visibility 
7.  Marbles & Jokers board visibility 
8.  Cribbage board/scoring clarity 

## Priority 3: Visual realism

9.  Realistic wooden Cribbage board 
10.  Realistic dimensional Backgammon / Black Gammon boards 
11.  Real cribbage pegs and holes 
12.  Physical-looking pieces/shadows/materials 

## Priority 4: Small but useful UX improvements

13.  Screw Your Buddy bidding context 
14.  Fuck Your Buddy bidding context 

---

# 3. PRESERVATION RULE

Start from the **actual latest project ZIP**.

Preserve all already-working systems unless this directive explicitly requires change.

Do not undo:

-  Phase Q Skip-Bo responsive work 
-  Phase Q Cribbage scoring work 
-  Phase R Gammon screen-first layout work 
-  Prop Hunt P2 work 
-  Black Gammon custom rules 
-  Backgammon standard rules 
-  multiplayer 
-  reconnect 
-  bots 
-  Easy-first bot default 
-  player colors 
-  room/seat/Ready flow 
-  chat/reactions 
-  scoring/history 
-  completed card-game rules 
-  existing family avatars 

A fix for one game must not regress another.

---

# PART A

# SKIP-BO

# 4. CRITICAL SKIP-BO RULE FAILURE

The current Skip-Bo implementation is missing one of the central mechanics of the game:

> **The player must be able to play the exposed top card of their Stock Pile onto the shared Building Piles whenever it is legal.**

This is not optional.

The primary objective of Skip-Bo is to work through the player's Stock Pile.

The Stock Pile must therefore function as a first-class playable card source.

---

# 5. STOCK PILE BEHAVIOR

Each player's Stock Pile should:

-  contain the player's remaining stock cards 
-  display exactly **one exposed face-up top card** 
-  keep all cards underneath hidden 
-  display the remaining stock count 
-  allow the exposed card to be selected when legally playable 

When the exposed Stock card is played:

1.  remove it from the Stock Pile 
2.  reveal the next Stock card automatically 
3.  update Stock count 
4.  immediately make the newly exposed card selectable if legal 
5.  allow continued play during the same turn if rules permit 

The player should be able to play multiple Stock cards in succession if Building Pile conditions allow.

---

# 6. STOCK CARD SELECTION

The exposed Stock card must behave like a playable card source just like:

-  hand cards 
-  top discard cards 

When tapped:

-  selected card visibly lifts/outlines 
-  legal Building Piles glow 
-  illegal destinations dim 
-  tapping a valid Building Pile plays the Stock card 

Do not route the player through an unnecessary menu.

---

# 7. STOCK PILE WIN CONDITION

The game ends when a player's Stock Pile is depleted according to the game's rules.

Ensure:

-  Stock count reaches zero correctly 
-  victory triggers at the correct time 
-  bot Stock Piles follow the same rules 
-  reconnect does not recreate Stock cards 
-  UI does not continue showing a phantom card after Stock reaches zero 

---

# 8. SKIP-BO PLAY SOURCES

The game engine should correctly support legal play from:

-  exposed Stock Pile card 
-  player's hand 
-  top card of each of four Discard Piles 
-  Skip-Bo wild card where applicable 

Only exposed/top cards are playable.

Cards buried underneath a discard or stock pile remain inaccessible.

---

# 9. SKIP-BO SCREEN LAYOUT

Retain the portrait-first direction already established.

The player should see, without routine scrolling or zoom:

### Opponent

-  Stock Pile 
-  Stock count 
-  four Discard Piles 
-  opponent hand count only 

Do not reveal opponent hand cards.

### Shared center

-  four Building Piles 
-  Draw Pile 

### Player

-  Stock Pile 
-  four Discard Piles directly above hand 
-  five-card hand 

Cards should dominate the screen.

Decorative framing remains secondary.

---

# 10. SKIP-BO ACCEPTANCE TEST

A valid test sequence must include:

1.  player's Stock top card is playable 
2.  tap Stock card 
3.  correct Building Pile highlights 
4.  play Stock card 
5.  next Stock card automatically reveals 
6.  play another Stock card if legal 
7.  continue turn 
8.  reach final Stock card 
9.  play it 
10.  win triggers correctly 

Test human vs human and human vs bot.

---

# PART B

# CRIBBAGE

# 11. CRIBBAGE VISUAL GOAL

Cribbage should look and behave like a **real physical cribbage board translated into a polished mobile game**.

Use the cribbage reference image supplied in this chat as the design target.

The physical board itself should be the visual hero.

---

# 12. CRIBBAGE BOARD STRUCTURE

Create a realistic wooden cribbage board with:

-  continuous patterned scoring path 
-  properly spaced drilled holes 
-  clear player lanes 
-  correct progression direction 
-  readable start/end regions 
-  target score of 121 
-  realistic rounded/beveled wooden edges 

The scoring track should visually make sense as a continuous route.

Players should visibly progress along the pattern.

Do not scatter peg positions arbitrarily.

---

# 13. TWO PLAYER LANES

Each player must have a clearly identifiable scoring lane/track.

Use the player's selected family-game color beneath or around their peg holes.

Example:

-  Kristen chooses pink → Kristen's scoring lane uses a pink accent 
-  opponent chooses blue → opponent's lane uses a blue accent 

The wood remains dominant.

The color should sit **inside/inset around the scoring path**, rather than painting the entire board a bright color.

---

# 14. PEG HOLES

Peg holes must look physically drilled into the board.

Use:

-  dark hole centers 
-  subtle inset shading 
-  rim highlight 
-  consistent spacing 
-  consistent depth 

Do not display dots that merely look printed onto the board.

---

# 15. PEG DESIGN

Pegs should look like actual cribbage pegs:

-  narrow cylindrical body 
-  rounded head 
-  visible vertical height 
-  bottom appears inserted into hole 
-  small contact shadow 
-  slight cast shadow 
-  subtle material shine 

Pegs must sit exactly on valid scoring holes.

They should never float between holes or appear randomly placed.

---

# 16. TWO PEGS PER PLAYER

Where the scoring design requires traditional cribbage tracking, visually represent current and previous score positions clearly.

The player's active peg and trailing/previous peg should be understandable.

When points are awarded:

-  front peg becomes old score marker 
-  other peg moves ahead appropriately 

Do not lose track of the player's prior score.

---

# 17. PEG MOVEMENT ANIMATION

When points are scored:

-  animate the peg moving along the correct path 
-  move in a short visible sequence 
-  do not teleport randomly across the board 

The animation does not need to visit every hole at full speed if that becomes tedious, but it should visibly communicate progression.

For small scores, moving hole-by-hole is preferable.

---

# 18. PLAYER POSITION CLARITY

The player should be able to see:

-  their color 
-  their pegs 
-  opponent color 
-  opponent pegs 
-  current score 
-  previous score 
-  destination after scoring 

The score track must remain consistent with the numerical score.

---

# 19. CRIBBAGE PEGGING AREA

During card pegging show:

-  played cards 
-  player ownership 
-  current running count 
-  whose turn 
-  Go 
-  15 
-  31 
-  pair 
-  trips 
-  four-of-a-kind 
-  runs 
-  awarded points 

The player should never have to reconstruct the pegging sequence mentally.

---

# 20. CRIB VISIBILITY

The crib must remain hidden while private.

During scoring:

-  reveal all actual crib cards 
-  display starter card 
-  indicate whose crib it is 
-  calculate points 
-  show scoring breakdown 

Keep the scored crib visible long enough for the player to inspect it.

---

# 21. CRIBBAGE HAND SCORING

Every scored hand should show:

-  four hand cards 
-  starter 
-  fifteens 
-  pairs 
-  runs 
-  flush 
-  nobs 
-  total 

Highlight contributing card combinations where practical.

---

# 22. SCORE EXPLANATION

Use a readable breakdown such as:

**Fifteens**

5 + 10 = 2

**Pair**

7 + 7 = 2

**Run**

5, 6, 7 = 3

**Flush**

4 cards = 4

**Nobs**

Jack matches starter suit = 1

**Total: 12**

Do not merely increase the score without explaining why.

---

# 23. CRIBBAGE SCORING SEQUENCE

Preferred sequence:

1.  reveal scoring hand 
2.  highlight scoring groups 
3.  show breakdown 
4.  show total 
5.  animate peg 
6.  next player hand 
7.  animate peg 
8.  reveal crib 
9.  show crib breakdown 
10.  animate dealer peg 
11.  continue next hand 

---

# 24. CRIBBAGE ACCEPTANCE CRITERIA

Cribbage passes when:

-  board visually resembles real cribbage 
-  path is coherent 
-  each player has a clear colored lane 
-  holes are drilled-looking 
-  pegs sit in actual holes 
-  peg positions correspond with scores 
-  pegs visibly progress 
-  crib cards reveal correctly 
-  scoring explanation is present 
-  hand and crib evidence remains inspectable 

---

# PART C

# TRAIL TROUBLE

# 25. CRITICAL START FAILURE

Trail Trouble currently cannot start.

Treat this as a release-blocking game bug.

Do not spend visual polish effort on Trail Trouble until the start flow works.

---

# 26. INVESTIGATE TRAIL TROUBLE START FLOW

Inspect:

-  game creation 
-  room state 
-  minimum player count 
-  bot support 
-  Ready state 
-  host permissions 
-  start button availability 
-  game initialization 
-  initial state creation 
-  deck/state seed 
-  turn assignment 
-  renderer startup 
-  first action generation 
-  client/server synchronization 

---

# 27. TRAIL TROUBLE ACCEPTANCE TEST

Test:

-  host creates room 
-  second human joins 
-  both Ready 
-  host starts 
-  board appears 
-  correct starting positions 
-  first player gets legal action 
-  turn progresses 
-  bot can replace second player if supported 
-  reconnect works 

Do not declare the game fixed merely because the Start button becomes clickable.

The **first full turn must complete**.

---

# PART D

# LAST HAVEN

# 28. CRITICAL PROGRESSION FAILURE

Last Haven currently allows the player to place the first Camp but does not progress properly afterward.

This suggests a state-transition or action-generation bug.

Treat it as a gameplay blocker.

---

# 29. LAST HAVEN INVESTIGATION

Inspect:

-  initial Camp placement state 
-  completion detection 
-  transition after placement 
-  next-player assignment 
-  legal action generation 
-  state machine phase 
-  server state 
-  client rerender 
-  bot response 
-  resource/turn initialization after settlement placement 

---

# 30. LAST HAVEN ACCEPTANCE TEST

Test at least:

1.  start game 
2.  player places first Camp 
3.  turn/state advances 
4.  next required action appears 
5.  second player/bot acts 
6.  first full gameplay round completes 
7.  resource/action systems become available 
8.  subsequent turns continue 

Do not accept a fix that only bypasses the first stuck screen.

---

# PART E

# BACKGAMMON & BLACK GAMMON

# 31. VISUAL GOAL

Use the supplied Backgammon reference image and the generated wooden-board concept from this chat as the target direction.

The board should look like a **physical, dimensional wooden board**, not a flat diagram.

---

# 32. REMOVE FLAT APPEARANCE

Improve:

-  wood grain 
-  beveled frame 
-  inset playing surface 
-  point/triangle materials 
-  central bar 
-  bearing tray 
-  checker geometry 
-  checker highlights 
-  checker contact shadows 
-  dice 
-  recessed/inlaid point numbering 

The board should have visible depth.

---

# 33. BOARD SHOULD FILL THE PLAY AREA

Continue the Phase R screen-first approach.

Remove any remaining unnecessary:

-  green felt table 
-  giant decorative background 
-  oversized board container 
-  empty framing 

The board itself should dominate.

---

# 34. BOARD PROPORTION

Match a familiar Backgammon physical-board ratio.

Avoid:

-  unusually tall skinny boards 
-  distorted triangles 
-  huge empty center gaps 
-  tiny checkers 

The board should immediately read as Backgammon.

---

# 35. CHECKER DESIGN

Checkers should look like dimensional game pieces.

Use:

-  beveled/ridged edge 
-  glossy or satin surface 
-  contact shadow 
-  stacking overlap 
-  player-selected colors 

Do not render checkers as plain flat circles.

---

# 36. STACK PRESENTATION

Checker stacks should be easy to read.

For stacks larger than comfortably visible:

-  compress spacing slightly 
-  keep each piece visibly distinct 
-  optionally add count badge if needed 

Black Gammon's temporary 5+ stacks must remain readable.

---

# 37. DICE

Dice should look physical:

-  dimensional cube 
-  rounded edges 
-  proper pips 
-  shadows 
-  player color where required 

Rolling should have a brief satisfying animation.

Do not make the dice animation so long that it slows gameplay.

---

# 38. DICE FUNCTIONALITY

Preserve and verify the Phase R roll repair.

Test actual play, not merely button existence.

Ensure:

-  first roll works 
-  subsequent roll works 
-  bot turn works 
-  tied Black Gammon roll works 
-  big die works 
-  reroll of tied big die works 
-  state updates immediately 

---

# 39. BLACK GAMMON RULE PRESERVATION

Absolutely preserve:

-  4/4/4/3 starting layout 
-  shared four-dice pool 
-  higher sum controls allocation 
-  big-die tie rule 
-  doubles 
-  triples 
-  quads 
-  backward doubles/triples 
-  single 4 rule 
-  bar rules 
-  stacking 
-  single-checker death 
-  rescue 
-  overstacking 
-  transfers 
-  bearing off 
-  bots 

Do not simplify the rule engine while upgrading visuals.

---

# 40. MOVE HIGHLIGHTING

Backgammon:

-  selected checker clearly highlighted 
-  legal destinations visible 

Black Gammon:

- **blue = forward** 
- **red = backward** 
- **gold = rescue** 

Use glow/rings/outline.

Do not rely solely on text menus.

---

# 41. GAMMON ACCEPTANCE CRITERIA

Both games pass when:

-  board fills useful screen space 
-  wood looks dimensional 
-  checkers look physical 
-  dice roll 
-  no stray line/debug artifact 
-  checker selection works 
-  legal moves visible 
-  zoom works 
-  default view does not require zoom 
-  phone layout is playable 
-  desktop layout is polished 

---

# PART F

# MARBLES & JOKERS

# 42. CURRENT PROBLEM

Marbles & Jokers is difficult to see because the playable board is sitting inside a decorative felt/table presentation.

The game board itself needs more space.

---

# 43. REMOVE FELT TABLE CONSTRAINT

Remove or greatly reduce the felt table/background around the game.

The board should effectively fill the gameplay area.

Keep only enough surrounding style to retain Black Family Game Night identity.

---

# 44. BOARD SCALE

On phone:

-  board uses most available width 
-  marble holes are visible 
-  routes are readable 
-  marbles are large enough to touch 
-  card hand remains accessible 
-  team ownership remains clear 

---

# 45. RESPONSIVE MARBLES LAYOUT

For portrait:

-  board should take the majority of screen 
-  hand may sit below 
-  game controls should remain compact 
-  secondary chat/status may collapse 

For desktop:

-  board may expand while status panel sits beside it 

---

# 46. MARBLE VISUAL QUALITY

Make marbles more dimensional.

Use:

-  glossy material 
-  light reflection 
-  contact shadow 
-  player color 
-  clear selected state 

Holes/routes should visually indicate where marbles belong.

---

# 47. MARBLES ACCEPTANCE CRITERIA

Pass when:

-  board is immediately readable 
-  no giant felt table 
-  routes/holes visible 
-  marbles easy to distinguish 
-  card hand still usable 
-  legal movement visible 
-  normal play does not require zoom/pan 

---

# PART G

# SCREW YOUR BUDDY & FUCK YOUR BUDDY

# 48. BIDDING CONTEXT PROBLEM

When the game asks:

> **How many tricks?**

the player should not have to remember the current hand size and trump round.

Add a small round-context indicator directly in the bidding box.

---

# 49. REQUIRED BID CONTEXT

Display:

**[hand size] [trump]**

Examples:

- **2 Clubs** 
- **5 Hearts** 
- **9 Diamonds** 
- **13 Spades** 
- **7 No Trump** 

Use suit symbol if appropriate:

-  2 ♣ 
-  5 ♥ 
-  9 ♦ 
-  13 ♠ 
-  7 NT 

The wording should remain clear even for users unfamiliar with suit symbols.

---

# 50. SCREW YOUR BUDDY

For normal Screw Your Buddy, show the current:

-  number of cards dealt 
-  trump suit / No Trump 

inside or immediately above the **How many tricks?** bid selector.

---

# 51. FUCK YOUR BUDDY

Use the same concept but respect all custom rounds.

Show appropriate context for:

-  Hearts round 
-  Clubs 
-  Diamonds 
-  Spades 
-  No Trump 
-  special 3 round 
-  any randomized round designation 

If a special round is active, use a clear label rather than forcing it into a normal suit name.

Examples:

- **3 cards · Special 3** 
- **1 card · Hearts** 
- **8 cards · No Trump** 

---

# 52. BID CONTEXT ACCEPTANCE TEST

The player should never need to leave the bidding box to answer:

-  how many cards do I have? 
-  what is trump? 
-  what special round is active? 

---

# PART H

# SHARED TABLETOP PRESENTATION

# 53. SCREEN-FIRST RULE

Continue using the global principle:

> **The game itself should fill the useful screen.**

Remove decorative tables when they make the actual game smaller.

This applies particularly to:

-  Skip-Bo 
-  Cribbage 
-  Backgammon 
-  Black Gammon 
-  Marbles & Jokers 

Decoration supports gameplay.

Gameplay does not shrink to accommodate decoration.

---

# 54. PORTRAIT-FIRST

Primary mobile target remains portrait.

At common phone widths:

-  no page-level sideways scroll 
-  no essential clipped elements 
-  no tiny central game board 
-  touch targets remain usable 
-  primary game state stays visible 

---

# 55. REALISTIC TABLETOP MATERIALS

For physical board games, prioritize:

-  wood 
-  carved/inset details 
-  raised pieces 
-  subtle shadows 
-  material depth 
-  realistic object contact 

Avoid making everything flat CSS rectangles.

This does **not** require true 3D WebGL if convincing dimensional CSS/SVG rendering is more performant.

The target is the **appearance and feel**, not unnecessary technical complexity.

---

# 56. PERFORMANCE RULE

Do not sacrifice phone performance for decorative realism.

Prefer:

-  CSS depth 
-  SVG 
-  optimized textures 
-  lightweight shadows 
-  reusable assets 

before heavy rendering when the same appearance can be achieved more efficiently.

---

# PART I

# BUG REPORTING & QA

# 57. EVERY REPORTED BUG MUST HAVE A SPECIFIC TEST

Create explicit regression tests for:

### Skip-Bo

Stock top card can be played.

### Trail Trouble

Game starts and first full turn completes.

### Last Haven

Game continues after Camp placement.

### Backgammon

Dice roll and first move work.

### Black Gammon

Dice roll, allocation and first move work.

### Cribbage

Peg score location matches score and crib reveals.

### Marbles & Jokers

Board is readable at phone dimensions.

### Screw/Fuck Your Buddy

Bid box shows hand/trump context.

---

# 58. VISUAL QA

Automated tests alone are insufficient for:

-  crib board realism 
-  peg placement 
-  Backgammon dimensionality 
-  board scale 
-  Marbles readability 
-  responsive layout 

Capture visual proof.

---

# 59. REQUIRED SCREENSHOTS

Before release, capture:

### Skip-Bo

-  player's Stock card selected 
-  legal Build destination highlighted 

### Cribbage

-  full board 
-  peg in hole 
-  scoring hand 
-  revealed crib 

### Backgammon

-  opening board 
-  dice rolled 
-  selected checker 

### Black Gammon

-  opening 4/4/4/3 board 
-  roll/allocation 
-  forward/backward highlight 

### Marbles

-  full board on portrait phone 

### Trail Trouble

-  started game 

### Last Haven

-  state after first Camp placement 

### Trick games

-  bidding panel with round context 

---

# 60. NO FALSE VISUAL CLAIMS

Use exact language in the release report:

-  code tested 
-  rule tested 
-  cold-ZIP tested 
-  visually inspected 
-  phone verified 

Only use **phone verified** if an actual device was used.

---

# PART J

# IMPLEMENTATION ORDER

# 61. RECOMMENDED PASS ORDER

### S1

Fix Skip-Bo Stock Pile engine.

### S2

Fix Trail Trouble start.

### S3

Fix Last Haven progression.

### S4

Verify/fix Gammon rolling.

### S5

Rebuild Cribbage physical board and pegs.

### S6

Upgrade Gammon wooden-board visual treatment.

### S7

Remove Marbles felt table and expand board.

### S8

Add trick-bidding context labels.

### S9

Responsive polish.

### S10

Regression and visual QA.

---

# 62. DO NOT PACKAGE HALFWAY THROUGH

Do not create a new release ZIP simply because one or two fixes are complete.

Complete the focused Phase S scope first.

Then:

1.  run tests 
2.  run build validation 
3.  inspect visuals 
4.  create ZIP 
5.  cold-extract ZIP 
6.  rerun tests against extracted copy 
7.  produce QA report 
8.  produce phone checklist 

---

# 63. RELEASE NAMING

Suggested release:

**Black Family Game Night – Phase S Gameplay Repair + Tabletop Realism**

Suggested ZIP:

`black-family-game-night-STAGING-PHASE-S-GAMEPLAY-TABLETOP-REALISM-17.zip`

Keep the previous Phase R ZIP untouched.

---

# 64. FINAL PHASE S ACCEPTANCE BAR

Do **not** call Phase S complete unless all of these are true:

### Skip-Bo

-  exposed Stock card is playable 
-  next Stock card reveals 
-  Stock depletion can win game 

### Cribbage

-  convincing wooden board 
-  clear player lanes/colors 
-  pegs sit in real holes 
-  pegs progress correctly 
-  crib cards reveal 
-  scoring explanations work 

### Trail Trouble

-  game starts 
-  first full turn completes 

### Last Haven

-  first Camp placement no longer dead-ends 
-  gameplay continues 

### Backgammon

-  large screen-first wooden board 
-  dice work 
-  moves work 
-  no visual line artifact 

### Black Gammon

-  same visual improvement 
-  dice allocation works 
-  all Black Gammon rules preserved 

### Marbles & Jokers

-  felt table no longer wastes space 
-  game board fills useful screen area 
-  marbles/routes are readable 

### Screw Your Buddy

-  bidding box shows hand count + trump 

### Fuck Your Buddy

-  bidding box shows hand count + correct suit/special-round context 

---

# FINAL INSTRUCTION TO THE DEVELOPMENT CHAT

Use this document as the **governing directive for Phase S**.

Begin with the actual latest Phase R project.

Do not rebuild unrelated systems.

Fix functional blockers before visual polish.

Treat the supplied cribbage and Backgammon images in this conversation as **visual references for craftsmanship, board depth, wood treatment, peg/checker dimensionality and screen hierarchy**, not as assets to copy literally.

The final goal is:

> **Every game should make immediate visual and gameplay sense when opened on a phone.**

Skip-Bo should finally play around the Stock Pile as intended.

Cribbage should feel like a real wooden cribbage game.

Backgammon and Black Gammon should feel like physical wooden boards in your hands.

Trail Trouble and Last Haven must actually progress.

Marbles & Jokers should be large enough to enjoy.

And the trick-taking games should give the player the small pieces of information they need exactly where they need them.

**Do not measure success by how much code was changed. Measure it by whether the games are easier to play, more understandable, more attractive, and actually work from beginning to end.**