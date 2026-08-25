# Phone QA - Phase O Realistic Actions 12

Confirm build: `GAME-NIGHT-STAGING-PHASE-O-REALISTIC-ACTIONS-12`

## Fast motion pass

1. **Screw Your Buddy or Smear**
   - Play a legal card: it should travel from your hand into the trick.
   - Finish a trick: cards should sweep toward the winner's trick pile.
   - No card should duplicate, remain stuck over the UI or block the next turn.

2. **Golf / Cribbage / Poker**
   - Golf face-up cards should flip/settle instead of hard popping.
   - Crib pegs and pegging cards should have short physical motion.
   - Poker community cards should deal/settle cleanly.

3. **Marbles & Jokers / Trail Trouble**
   - Existing piece path motion should still follow the board correctly.
   - Card selection/action buttons should feel pressed without shifting the page layout.

4. **Mexican Train**
   - Play from rack to a train and watch the same domino travel to its destination.
   - Draw from boneyard and confirm the new rack tile enters cleanly.
   - No domino should be clipped or left floating after the animation.

5. **Skip-Bo**
   - Play from hand to a Building Pile.
   - Play from Stock and Discard tops.
   - Draw to five.
   - Cards should move/settle without obscuring pile labels or controls.

6. **Backgammon**
   - Roll: dice should tumble and settle as pip dice.
   - Move a checker: a checker should arc to the destination point.
   - Hit a blot: the captured checker should move toward the Bar.
   - Offer/accept a double: cube should visibly flip/change.
   - Confirm the animation never changes the legal move result.

7. **Family Mystery**
   - Roll dice: a visible pip die should tumble in the Turn Actions panel.
   - Move: standee should still walk step by step across the highlighted path.

8. **3D games - John**
   - Prop Hunt Papa's Shop: idle -> walk -> run -> stop, then jump/land, aim/fire and hit reaction where available.
   - Island Life: walk/run/interaction transitions.
   - Birthday Seat: walk/run/jump/land and finish celebration.
   - Watch specifically for foot skating, animation restart every frame, hard pose snapping or clips freezing.

## Mobile checks

- Test portrait and landscape where practical.
- Confirm Safari bottom bar does not cover critical action controls.
- Test with quick repeated taps; no double action should be sent.
- Pinch/zoom new table games and confirm animations do not break the board transform.
- If iOS Reduce Motion is enabled, repeating/action-detail animations should be substantially reduced.

## Pass rule

Do not call Phase O final solely because automated tests pass. Pass the motion gate when actions are readable, quick enough not to slow play, and do not cause clipping, duplicate pieces or camera/control regressions on the actual family devices.
