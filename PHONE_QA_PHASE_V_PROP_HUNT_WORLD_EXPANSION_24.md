# Phase V Phone QA - Family Prop Hunt Papa's Shop World Expansion

Use the exact Phase V staging ZIP after deployment. Test on the phone that will actually be used for family game night.

## 1. First impression / scale
- Open Family Prop Hunt -> Papa's Shop.
- Confirm the world immediately feels dramatically larger than the previous Papa build.
- Walk from one map edge to the opposite edge.
- Confirm shop, barn, pens, yard, lumber zone and exterior grass all represent actual playable territory.
- Confirm clear-weather rounds show a believable blue outdoor sky.
- Confirm the red survey/boundary treatment makes the map edge understandable without looking like a developer debug wall.

## 2. Main shop
- Run through all large bays and man-door routes.
- Confirm center aisles are wide enough for two players to pass/chase.
- Test workbench, shelving, fireplace/Papa-chair and tool areas for collision snags.
- Confirm Papa's yellow tattered chair remains recognizable beside the fireplace.

## 3. Barn
- Enter through multiple openings.
- Move through stalls and center aisle.
- Climb both loft approaches.
- Move on the loft and return to ground without camera collapse.
- Confirm there is no routine one-door trap.

## 4. Animal pens
- Jump/mantle into both pens.
- Exit through gaps and by reasonable jump/mantle routes.
- Run around outside the fences.
- Confirm no fence corner pins the player or traps the camera.

## 5. Equipment and lumber yard
- Run around tractor, motorcycle, trailer, lumber piles, pallets and tires.
- Climb reasonable large objects.
- Confirm open chase lanes remain available despite prop density.

## 6. 12-player stress target
When practical, create a room with bots/players up to 12 total.
- Confirm the room allows 12 but not 13.
- Confirm spawns do not overlap badly.
- Confirm players spread into multiple zones rather than all being forced into one space.
- Watch performance/frame pacing around the busiest shop and barn areas.

## 7. Four-choice disguises
As a hider:
- Confirm exactly four disguise choices appear for the round.
- Confirm there is no reroll button or reroll gesture.
- Confirm all four choices can be selected.
- Change disguise and verify the remaining change count decreases correctly after the initial disguise.
- Confirm health does not refill/reset when changing prop.
- Start a later round and confirm the four choices change.

## 8. Large-prop scoring
- Hide as a small prop and watch survival points.
- Hide as a large/giant prop in another round if assigned.
- Confirm the displayed multiplier is larger for risky large props.
- Confirm scoring increases with survival time and does not alter HP.

## 9. Hunter phase
- Confirm the existing 30-second black hiding screen still fully blocks the hunter view.
- Confirm hunter cannot move/look/shoot during hiding time.
- Confirm HUNT release works.
- Confirm there is still no Aim button.
- Confirm crosshair is always active.
- Tap Shoot once, then hold Shoot for rapid fire.
- Run, strafe, jump and turn while firing.

## 10. Explicit interactions
Find and use as many as practical:
- tractor horn;
- shop lights;
- barn bell;
- shortcut gate;
- old radio;
- rare surprise interactions;
- Papa-chair legendary Easter egg.

Confirm interaction prompts appear only at sensible distance and no interaction can lock someone into an area.

## 11. Weather / round variety
Play several rounds or restart rooms.
- Confirm weather/time mood can change between rounds.
- Confirm the mood stays fixed during a round.
- Confirm rain, snow and fog remain playable and do not hide hiders unfairly.
- Confirm secondary clutter changes without relocating the major shop/barn landmarks beyond recognition.

## 12. Elimination
In Classic mode:
- eliminate a hider;
- confirm the prop visibly breaks;
- confirm `That's a sin.` is heard if the phone/browser supports speech synthesis;
- confirm the eliminated player becomes a ghost rather than being stuck on a dead screen;
- use free ghost movement;
- use JUMP to rise and SPRINT to descend;
- switch to FOLLOW PLAYER and cycle targets;
- confirm ghost cannot shoot, disguise, flash or affect the match.

In Family Chaos:
- confirm eliminated hider still becomes a hunter instead of a ghost.

## 13. MVP / round transition
- Let a round end by elimination and by timer if practical.
- Confirm the MVP card identifies Best Hider and Best Hunter.
- Confirm the card is skippable.
- If not skipped, confirm next round starts after roughly 10 seconds.
- Confirm a five-minute hunt timer is used by default.
- Confirm lifetime stats update without affecting gameplay.

## 14. Camera recovery regression
Repeat in shop, barn loft, pens, tractor/lumber area and map boundary:
- sprint;
- jump/mantle;
- rotate camera against walls;
- move through doors;
- use Reset View.

Fail Phase V visual approval if the camera returns to the old top-down/near-avatar collapse, if the player becomes pinned, or if the expanded environment performs poorly enough to make play frustrating.

## Signoff labels
Only mark what was actually completed:
- [ ] code verified
- [ ] tests verified
- [ ] package verified
- [ ] browser visually inspected
- [ ] phone visually verified
