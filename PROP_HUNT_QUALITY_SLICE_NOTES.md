# Black Family Game Night v2.1.0
## Prop Hunt Quality Slice - Papa's Shop

This release intentionally narrows scope. It does **not** claim that all 3D games are finished. It takes the strongest complaints from live phone testing and repairs one complete scene first so the project can establish a repeatable quality standard.

## Problems addressed

### Characters felt oversized / wrong
The procedural human rig is approximately 2.08 m tall at scale 1.0. Earlier Prop Hunt profiles drew John at scale 1.0 while his gameplay collider was 1.82 m. Similar mismatches existed for the children and dogs. v2.1 calibrates visual scale to gameplay height and adds per-person silhouette ratios. Holly/Elizabeth use larger relative heads and narrower bodies; older adults and Papa have their own width ratios; Gunner is longer/larger than Kelsi/Molly.

### Family members depended too heavily on color
The shared rig now supports proportion metadata and meaningful 3D identity cues. Prop Hunt adds procedural plaid for John and patterned fabric for Dorothy in addition to glasses, facial hair, hair length, hood, buns and Papa's actual 3D cowboy hat.

### Papa's Shop architecture contained scale mistakes
The large shop opening previously had a small swing-door mesh at one side. It now uses a garage-sized segmented overhead door plus a separate man door. Exterior trim, ridge caps, chimney, rafters and practical details better explain the building.

### The outside view ended too abruptly
A non-colliding rural backdrop extends fields beyond gameplay bounds and adds tree lines, sheds, utility poles and sagging utility wires. This is visual depth only and does not alter collision or shooting.

### Interior clutter existed without believable placement
The shop now has floor drain/oil wear, hose reel, conduit, tire stack and a separate fireplace side table. Small props support explicit Y placement so mugs/helmet can sit on real surfaces rather than always spawning at floor level.

### Bots could push into obstacles
Prop Hunt bots now use the shared navigation grid for chase/escape/wander movement, while line-of-sight remains geometry-aware.

### Phone diagnosis was guesswork
`?qa3d=1` enables an opt-in live HUD with FPS, position, animation, camera distance, actor/collider counts, draw calls/triangles, network state and nav path count. It is hidden during normal play.

## Deliberate non-goals for this slice

- Camper/Campsite is not visually signed off yet.
- Backyard/Acreage is not visually signed off yet.
- Goat/Farm is not visually signed off yet.
- Family Island Life remains on the v2.0 Studio Realism scene baseline.
- Birthday Seat remains on the v2.0 Studio Realism scene baseline.
- Bespoke skinned family GLBs still do not exist; the authored-model pipeline remains ready, while procedural rigs are the fallback.

The next map/game should inherit only the fixes that survive Papa's Shop real-device QA.
