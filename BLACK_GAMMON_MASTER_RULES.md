# Blackgammon - Master House Rules

**Status:** Locked implementation specification for Black Family Game Night  
**Build:** `GAME-NIGHT-STAGING-PHASE-P0-FLAGSHIP-FOUNDATION-13`

Blackgammon is a two-player Black family house game inspired by backgammon. It keeps the familiar 24-point board, Bar, home boards and bearing-off race, but changes the opening layout, dice control, matching-dice bonuses, direction, stacking, rescue and transfer rules.

## 1. Players, colours and board

- Exactly 2 players.
- Each player chooses a player colour. The same colour is used for that player's checkers and two normal dice.
- Each player has 15 checkers.
- The board uses the standard backgammon occupied starting point locations, with Blackgammon counts of 4 / 4 / 4 / 3:
  - Player 1: point 24 = 4, point 13 = 4, point 8 = 4, point 6 = 3.
  - Player 2: point 1 = 4, point 12 = 4, point 17 = 4, point 19 = 3.
- The confirmed visual reference is `BLACK_GAMMON_STARTING_SETUP.png`.
- Viewer orientation keeps the player's entry/start side at the bottom and the player's home/bear-off area at the top-right.

## 2. Winning

- A player must bring all 15 checkers into their home board before bearing off.
- Bearing off then follows normal exact-die and higher-die/farthest-checker rules, subject to Blackgammon's direction rules.
- The first player to bear off all 15 checkers wins immediately. Remaining dice/moves are not resolved after the 15th checker leaves.
- A borne-off checker is permanently safe and never returns to the board.
- One completed game counts as one win. No gammon/backgammon multiplier scoring is used.

## 3. The normal four-dice roll

- At the start of every roll, including the opening roll, both players roll two normal dice.
- Compare the sum of each player's two dice.
- The higher-total player controls allocation of the shared pool of all four normal dice and moves first.
- The other player moves second.
- Normal dice values count positively when comparing totals, even when their eventual movement is backward.

## 4. Tied totals and the large die

- If the two normal-dice totals tie, use the one shared large tiebreak die.
- Large-die faces/values are: 2, 4, 6, 8, 16, 32, 64.
- The die is visually passed from right side to left side and back between players.
- Both players roll it. A tied large-die result is rerolled until somebody wins.
- The large-die winner must play/control all four normal dice from that roll.
- The large die is only a tiebreaker. It never changes stakes or scoring.

## 5. Shared dice and matching sets

Once both normal rolls exist, the four dice are treated as one shared pool. Original ownership no longer matters.

### Singles
- Ordinary single dice are played forward.
- Singles cannot voluntarily be declared backward.
- A transferred matching single stays a single and cannot upgrade another single/double into a new double/triple set.
- The special single-4 rule is the exception described below.

### Doubles
- Two matching dice create a double worth 4 moves of that value.
- The player who controls/receives a double chooses the whole set forward or backward when the rules give them that choice.
- All four moves must use the same chosen direction.
- Matching-set moves may be distributed among checkers or used as a legal simultaneous group move.

### Triples
- Three matching dice create a triple worth 12 moves of that value.
- All 12 moves use one declared direction: all forward or all backward.
- The higher roller chooses which player receives the triple and may assign an opponent's triple forward or backward.
- With a triple plus one unmatched single, both players play the unmatched single; only one player receives the triple.

### Quadruples
- Four matching dice create a quadruple worth 24 moves of that value.
- The tied normal totals are resolved by the large die.
- The large-die winner receives the quadruple and the other player has no initial moves from that roll.
- Quadruples are played forward by the large-die winner.

### Two different doubles
- Example: 2,2,5,5.
- The higher roller chooses which double they keep.
- The other double goes to the opponent.
- The higher roller chooses whether the opponent's double is forward or backward.
- The player keeping their own double may also choose its direction.

### One double plus two singles
- The higher roller may keep the double plus one single, leaving the other single to the opponent.
- The higher roller may give the double to the opponent and keep both singles.
- The higher roller may break the natural pair apart and split all four as ordinary singles.

## 6. Mandatory movement and unused dice

- A player must use as many legally playable assigned moves as possible.
- The player chooses which legal checkers to move and the order, provided the direction rule is obeyed.
- Unused bonus movement from doubles, triples or quadruples disappears. It never transfers.
- An assigned ordinary single die that cannot legally be played transfers once to the other player.
- If the higher roller cannot use an ordinary single, it is added to the lower player's movement opportunity.
- If the lower player cannot use an ordinary single, it transfers back to the higher roller and gives that player another movement opportunity in the same overall roll.
- The receiving player treats it as an ordinary single. It does not form a new matching bonus set.
- If the receiver also cannot legally play that transferred die, it is discarded.

## 7. Special single 4

- A single 4 counts as +4 for deciding the higher roll.
- If the player has any checker outside their home board, a single 4 moves backward.
- A single 4 cannot re-enter a checker from the Bar.
- As soon as all of that player's checkers are in the home board, an unused single 4 immediately becomes positive/forward and may be used for bearing off.
- If the last outside checker enters home partway through a movement opportunity, the unused single 4 flips positive immediately.
- A transferred single 4 follows the receiving player's current board state.
- Double/triple 4s are matching sets and may be declared forward or backward normally. They are not forced backward by the single-4 rule.

## 8. Forward and backward movement

- Forward means the player's normal direction toward home/bearing off.
- Backward means the exact opposite direction.
- When a double or triple is declared backward, the player still chooses which of their own checkers move and in what order, but all moves in that set remain backward.
- A backward move that would travel beyond the physical end of the board is illegal.
- Backward movement can force checkers out of the home board. Those checkers must return home before bearing off can continue.

## 9. The Bar

- The Bar is separate from normal contested-stack mechanics.
- Opposing checkers on the Bar do not cover, kill or interact with each other.
- A player with checkers on the Bar must re-enter as many as legally possible before moving any other checker or bearing off.
- Bar entry itself is always made in the normal forward entry direction, even when the assigned matching set is backward.
- After the required bar entries are made, any remaining moves in a backward double/triple continue backward on the board.
- Example: two checkers on Bar with backward double 3s: use two 3-moves to re-enter normally; the remaining two 3-moves are backward.
- A single 4 cannot enter from the Bar; double/triple/quad 4s may.
- On entry, a point containing exactly one opposing checker may be entered and that checker is immediately sent to the Bar.
- A normal entry point containing two or more opposing checkers is blocked when the entering player has no own presence there.
- A mixed point that already contains the entering player's own checkers may accept another re-entering checker when the mixed-point strength rule and own-colour occupancy limit allow it.
- A player cannot enter a fifth own checker from the Bar onto a point already containing four of their own colour.

## 10. Normal point occupancy and immediate kills

- Both colours may occupy the same board point.
- Normally, a player may keep no more than four of their own checkers on one point.
- A point containing exactly one opposing checker uses the immediate-kill rule: if an opponent legally lands there, that lone checker immediately goes to the Bar, regardless of whether the incoming group contains one, two, three or more checkers.
- A point containing two or more opposing checkers uses the contested-stack rules below instead of immediate death.

## 11. Covering, contested stacks and group moves

- A player may land on a point containing 2+ opposing checkers only if their resulting own count at that point is equal to or greater than the opposing count.
- Own checkers already on that point count toward the comparison.
- Partial reinforcement that still leaves the player's side weaker is not a legal rescue/cover move.
- Simultaneous group movement can be created only by doubles, triples or quadruples.
- Unrelated single dice cannot be combined to manufacture a group move.
- Equal mixed stacks are safe.
- If one side becomes numerically greater, that side is considered the stronger/top side and the other side becomes endangered.

## 12. Rescue and death

- An endangered/underlying stack gets its next movement opportunity to rescue as many checkers as the player chooses/can.
- Rescue can be done by moving trapped checkers away or by legally reinforcing the point to at least equal strength.
- If only some can be saved, those saved escape and the remaining endangered checkers go to the Bar at the end of that movement opportunity.
- If no legal rescue exists, the endangered checkers still go to the Bar when that opportunity ends.
- The player may deliberately choose not to rescue and let the checkers die.
- Backward matching-set moves may be used as rescue moves when legal.
- If a player voluntarily weakens their own previously safe/strong mixed stack during their movement opportunity, they have the remainder of that same movement opportunity to fix it. Any checkers still weaker at the end go to the Bar.
- Equalization makes both sides safe again.
- If reinforcement makes the formerly weaker side greater, the other side becomes endangered and receives the corresponding next-opportunity rescue rule.
- Deadlines still resolve even when a player receives no movement in that roll.

## 13. Temporary overstack exception

- Four own checkers is the normal permanent maximum on a point.
- While covering an opposing stack, an attacking side may temporarily pile 5, 6, 7 or more checkers on that mixed point if the move is otherwise legal.
- Once the stack is subject to its overstack deadline, the player must reduce their own count to 4 or fewer on their next movement opportunity/roll.
- Any extra own checkers still above four after that deadline die and go to the Bar, even if no legal move existed to save them.

## 14. Bearing off

- All 15 checkers must be in home before bearing off begins.
- Bar checkers always take priority and prevent bearing off.
- Exact bearing-off numbers and the normal higher-die/farthest-checker rule are used.
- A single 4 is positive once every checker is home.
- If backward movement later sends any checker out of home, bearing off pauses until that checker returns.
- Contested-stack, rescue and death rules continue to apply inside home.

## 15. Digital presentation

- Blackgammon remains a separate Game Shelf entry from standard Backgammon.
- Standard Backgammon shares the same family/player-colour treatment for checkers and normal dice, but keeps standard backgammon rules.
- When a Blackgammon checker is selected:
  - blue highlight = legal forward destination
  - red highlight = legal backward destination
  - gold highlight = legal rescue/save destination
- Do not show a giant rescue warning banner.
- Illegal taps should explain why, such as:
  - Need enough checkers to equal/cover this point.
  - Clear the Bar first.
  - Point already has 4 of your checkers.
  - Single 4 cannot enter from the Bar.
- Blackgammon supports human-vs-human and human-vs-bot play.

## 16. Bots / shared app behavior

- Easy is the default bot difficulty across Black Family Game Night.
- Medium and Hard remain selectable.
- Add-Bot character and difficulty controls must remain visibly readable on phone and desktop rather than rendering as a dark unreadable box.
