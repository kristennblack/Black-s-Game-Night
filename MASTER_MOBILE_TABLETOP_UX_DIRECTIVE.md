# BLACK FAMILY GAME NIGHT

## Master Mobile Tabletop UX Directive

### PRIMARY OBJECTIVE

Rebuild tabletop and card-game presentation around the way the family actually plays: on a phone held in portrait orientation.

The game should not feel like a desktop board shrunk into a small box. The important play surface should become the screen itself. Players should be able to understand the current state, see the objects they need, and make a legal move without zooming, panning, hunting, or scrolling around the game board.

This directive begins with **Skip-Bo** and **Cribbage**, then establishes a reusable standard for other tabletop games where the same approach improves playability.

The priority is not to remove personality. Keep the Black Family Game Night lodge/rustic visual language, but reduce decorative framing whenever it competes with the cards, pegs, dominoes, checkers, or other game pieces.

**Gameplay first. Theme supports gameplay.**

---

# 1. PORTRAIT-FIRST TABLETOP STANDARD

Design the primary gameplay state for a phone held vertically.

For applicable tabletop games:

- No required pinch-zoom to make a normal move.
- No required panning to inspect essential game information.
- No tiny board floating inside a large decorative table.
- No important player hand hidden below the fold.
- No core piles, tracks, scores, or legal destinations placed off-screen during ordinary play.
- Core game state and the player's actionable pieces should be visible together.
- Decorative scenery may be compressed, simplified, or removed if it reduces readability.
- Touch targets must remain large enough for comfortable phone use.
- The active player, selected piece/card, and legal destinations must be obvious.

If a game truly requires a large board, preserve optional zoom/pan as a secondary inspection tool. Do not make it the normal way to play.

---

# 2. SKIP-BO IS A FULL-SCREEN CARD LAYOUT

Skip-Bo should stop behaving like a zoomable miniature tabletop.

The Skip-Bo play area should fill the useful phone viewport and keep the important piles visible at the same time.

## Opponent area

Show each opponent's:

- Name/avatar.
- Hand **count only**. Never reveal the actual cards in an opponent's hand.
- Stock pile count and visible stock top card.
- Four discard piles with the top card visible.
- Turn/status information.

Keep the opponent area compact so it does not steal space from the active player's cards.

## Shared center area

Always show:

- Four shared Building Piles.
- The top card/value of each Building Pile.
- The number needed next.
- The draw pile near the Building Piles.
- A clear indication when the player must draw.

The four Building Piles should remain readable as a single shared row wherever practical on a portrait phone.

## Current player area

Always show:

- The player's Stock Pile.
- All four of the player's Discard Piles.
- The top card of every Discard Pile fully visible.
- The player's hand along the bottom of the play surface.

The hand may use slight overlap when necessary, but all five cards should remain identifiable and tappable without horizontal hunting during ordinary play.

## Interaction

Use a direct two-step touch model:

1. Tap a card/source.
2. Tap the destination.

When a card/source is selected:

- All legal Building Piles glow.
- Legal Discard Piles glow when a hand card may be discarded there.
- Invalid destinations visibly dim.
- The selected source remains clearly raised/highlighted.
- Tapping the selected source again cancels selection.

Do not require a generic action menu when the destination can be shown directly on the board.

## Skip-Bo visual priority

Space priority is:

1. Player hand.
2. Shared Building Piles.
3. Player Stock and four Discard Piles.
4. Compact opponent information.
5. Decorative framing.

The cards should dominate the screen.

---

# 3. CRIBBAGE SHOULD FEEL LIKE CRIBBAGE

Cribbage should look and behave like a real cribbage game adapted intelligently to a portrait phone.

The crib board is not decorative background. It is a primary gameplay object.

## Crib board

Use a traditional-looking wooden cribbage board with modern mobile readability:

- Clearly separated player lanes.
- Players visually beside one another.
- Player color integrated into lane/peg identity.
- Current score readable without counting holes manually.
- Physical-looking pegs.
- Current peg and previous peg visible where practical.
- Short, visible peg movement feedback when points are awarded.
- Race to 121 clearly represented.

Avoid turning the board into a tiny strip that players cannot read.

## Pegging area

During pegging, clearly show:

- Running total.
- Cards played in the current pegging sequence.
- Which player played each card.
- Whose turn it is.
- GO when appropriate.
- Point events such as 15, 31, pairs, trips, four-of-a-kind, and runs.

The pegging state should be understandable at a glance.

## Crib

The crib remains hidden while it should be private.

When the crib is revealed for scoring:

- Show the actual crib cards.
- Show the starter card with them.
- Identify whose crib it is.
- Show exactly how many points the crib earned.
- Explain why those points were earned.

After a hand finishes, preserve a visible scoring recap so the family can inspect what was in the hands and crib rather than having the game instantly erase the evidence.

## Hand scoring

Explain every hand-scoring event, not only the crib.

For each scored hand show:

- The four-card hand.
- Starter card.
- Fifteens.
- Pairs.
- Runs.
- Flushes.
- Nobs where applicable.
- Total points.
- Peg movement caused by the score.

The scoring explanation should teach the game while confirming that the engine counted correctly.

## Scoring sequence

The visual order should read naturally:

1. Reveal a scoring hand.
2. Show the card set and scoring explanation.
3. Award points.
4. Move the appropriate peg.
5. Continue through the remaining hands.
6. Reveal the crib.
7. Show the crib breakdown.
8. Award crib points and move the peg.

If server timing makes a fully paused sequence impractical, preserve the complete completed-hand recap immediately afterward so none of this information is lost.

---

# 4. PLAYER IDENTITY

Use the player's chosen Black Family Game Night color consistently for:

- Cribbage pegs and lanes.
- Player outlines/status accents.
- Skip-Bo opponent identity accents.
- Other tabletop pieces where color ownership matters.

Do not reveal private information simply to make the board look fuller.

---

# 5. TOUCH FEEDBACK

Every applicable tabletop game should clearly communicate:

- What is selected.
- What can be selected.
- Where the selected piece/card can legally go.
- Why a destination is unavailable when useful.
- When an action ends the turn.
- When the game is waiting for another player.

Prefer board-level visual feedback over pop-up menus.

Use glow, lift, dimming, outlines, and concise labels rather than cluttering the screen with instructions.

---

# 6. DECORATION MUST NOT STEAL THE BOARD

Keep the warm lodge/family style, but stop giving decorative furniture more screen space than the game.

For Skip-Bo and similar card layouts:

- Tone down the outer table frame.
- Keep a subtle wood/felt/lodge material treatment.
- Let cards and piles carry the visual hierarchy.

For Cribbage:

- The wooden crib board itself can carry much of the theme.
- Use believable wood, holes, grooves, pegs, and restrained shadows.

The goal is a crafted game interface, not a webpage floating on top of a decorative scene.

---

# 7. RESPONSIVE BEHAVIOR

Portrait phone is the primary target.

Also support larger phones, tablets, and desktop without simply stretching the phone composition.

On larger screens:

- Increase breathing room.
- Preserve the same information hierarchy.
- Do not reintroduce unnecessary zoom/pan just because more space exists.

On very small screens:

- Slight card overlap is acceptable.
- Compact labels are acceptable.
- Essential card faces, values, piles, scores, and action targets must remain readable.

---

# 8. APPLY THE PRINCIPLE TO OTHER TABLETOP GAMES

After Skip-Bo and Cribbage are proven, review:

- Mexican Train.
- Marbles & Jokers.
- Backgammon.
- Black Gammon.
- Other card/tabletop modules.

For each game ask:

**Can a normal turn be understood and completed in portrait mode without navigating around the board?**

If no, redesign the presentation using the same screen-first principles while preserving the game's actual rules and identity.

Do not blindly force every game into the same template. Reuse the principle, not a single rigid layout.

---

# 9. PRESERVATION RULE

Do not break established gameplay while rebuilding presentation.

Preserve:

- Existing rules engines.
- Multiplayer synchronization.
- Private/public card visibility.
- Reconnect behavior.
- Bot behavior unless explicitly being improved.
- Approved player-color system.
- Existing completed game modules.

UI work must not silently change the rules.

---

# 10. DEVELOPMENT ORDER

### Phase Q1: Skip-Bo mobile rebuild

- Remove Skip-Bo from the mandatory zoom/pan tabletop viewport.
- Make the playable surface fill the useful screen.
- Build the opponent/shared/player/hand zones.
- Implement tap-source then highlighted-destination play.
- Keep all four Building Piles and four personal Discard Piles visible.
- Validate on portrait phone sizes.

### Phase Q2: Cribbage realism and scoring

- Upgrade the board to a believable wooden two-lane-first cribbage presentation.
- Show physical peg positions and movement feedback.
- Make pegging ownership and count clearer.
- Reveal crib cards at scoring time.
- Preserve completed-hand scoring information.
- Show point explanations for hands and crib.

### Phase Q3: Shared tabletop standard

- Extract reusable mobile tabletop spacing, selection, target-glow, and responsive patterns.
- Audit the next tabletop games one at a time.

---

# 11. ACCEPTANCE CRITERIA

## Skip-Bo passes when

- A portrait-phone player can see their hand, Stock Pile, four Discard Piles, shared Building Piles, draw pile, and opponent status without zooming or panning.
- Opponent hands remain private and show count only.
- Tapping a source visibly identifies every legal destination.
- Invalid destinations dim.
- The top card of each personal Discard Pile is fully readable.
- The player can make a normal turn without opening a generic move list.

## Cribbage passes when

- The board immediately reads as a real cribbage board.
- Players and their peg lanes are visually paired.
- Score and peg position agree.
- Peg movement is visibly acknowledged when points are awarded.
- Pegging cards identify who played them.
- The crib remains private until the appropriate reveal.
- The actual crib cards can be inspected when scored.
- Completed hand and crib scoring show the point breakdown.
- A player can understand why the awarded total was correct.

## Shared mobile standard passes when

- Core play does not require zooming/panning on a normal portrait phone.
- Important game pieces are larger and clearer than decorative framing.
- Existing rules and multiplayer behavior remain intact.

---

# 12. RELEASE DISCIPLINE

For every tabletop UX milestone:

1. Preserve the previous known-good ZIP.
2. Make focused changes against the latest project.
3. Run engine and regression tests.
4. Test responsive layouts at representative portrait widths.
5. Inspect the actual rendered game, not only the source code.
6. Record what was changed and what still needs real-device confirmation.
7. Package a new staging ZIP only after the build passes technical checks.

Do not claim real-device visual approval until the user has actually tested the build on their phone.

---

## INSTRUCTION FOR THE DEVELOPMENT CHAT

Use this directive together with the existing **Master 3D Development Directive**. They govern different areas of the same project:

- The 3D directive governs flagship 3D quality, beginning with Family Prop Hunt.
- This directive governs portrait-first tabletop/card-game usability, beginning with Skip-Bo and Cribbage.

Start from the actual latest project ZIP. Preserve completed rules and multiplayer systems. Do not rebuild unrelated games merely to make a release look larger.

The objective is simple:

**When the family opens a tabletop game on a phone, the game itself should be right there in their hands.**
