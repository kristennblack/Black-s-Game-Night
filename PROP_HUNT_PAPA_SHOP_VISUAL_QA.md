# Prop Hunt / Papa's Shop Visual QA
## v2.1.0 quality-slice acceptance checklist

This checklist exists because automated tests can prove geometry, collision, state and code paths, but they **cannot prove that the game looks right on an iPhone**. Papa's Shop is the first 3D scene that must pass a real visual review before the same quality standard is applied to Camper/Campsite, Backyard/Farm, Island Life or Birthday Seat.

## How to test

Use the real deployed build on the target phone. For one diagnostic run, add `?qa3d=1` to the page URL. The small QA panel shows FPS, position, animation, camera distance, draw calls, triangle count, collider count and network state. Normal players never see that panel.

Take these screenshots or short clips:

1. **Outside approach**: 8-12 m from Papa's Shop, looking at the overhead door, man door, barn attachment and horizon.
2. **Interior overview**: just inside the overhead door looking diagonally across the shop toward the workbench/fireplace.
3. **Character turntable**: John from front, side and rear at roughly the same camera distance.
4. **Dog motion**: Gunner walking or running past the camera, then viewed from the rear/side.
5. **Aim view**: hunter aiming toward a wall/doorway with the prop-zapper visible.
6. **Occlusion proof**: another player walks behind a solid wall and becomes completely hidden.
7. **Climb proof**: jump/mantle onto a crate, workbench or tractor surface.
8. **Diagnostic**: one screenshot with `?qa3d=1` visible if anything feels stuttery or oddly framed.

## A. Character scale and likeness

PASS only if:

- John reads as an adult around 1.82 m relative to a ~2.16 m man door. He must no longer look almost as tall as the shop ceiling.
- Holly and Elizabeth are unmistakably smaller children, with proportionally larger heads and narrower bodies rather than scaled-down adult silhouettes.
- Logan reads as a teen/young man and is not an exact John body clone.
- James, Dorothy, Nana and Papa have visibly different silhouettes at gameplay distance.
- John's plaid is readable as plaid, not a flat burgundy shirt.
- Dorothy's dress has patterned material and a dress/skirt silhouette.
- Papa's hat is true 3D and remains visible from side/rear views.
- Faces exist on the **front only**. Looking at the back of a head must never show front-facing eyes/mouth.
- Weapon scale looks believable against the hands and torso and does not dominate half the screen.

FAIL if any character still resembles an oversized primitive mannequin or if mesh height obviously disagrees with door/furniture scale.

## B. Dogs

PASS only if:

- Kelsi and Molly read as golden dogs with distinct collar/personality details.
- Molly's tongue is visible when appropriate.
- Kelsi's bandana/collar detail reads from more than one angle.
- Gunner is visibly larger, longer-bodied and cream/tan, not a recolored copy of Molly.
- Four legs articulate as a quadruped and stay visually grounded.
- Backpack zapper sits on the back rather than floating beside the dog.

## C. Camera and controls

PASS only if:

- Normal third-person camera shows enough environment around the character to navigate a room.
- Holding AIM moves to a deliberate shoulder view without swallowing the whole screen with the character/gun.
- Camera moves inward at walls rather than crossing them.
- Camera does not violently pop between distances at doorways.
- Character rotation follows camera direction smoothly rather than snapping like a compass needle.
- Joystick partial movement produces partial speed.
- Sprint, jump and aim can be used simultaneously on a phone without impossible thumb placement.
- Automatic shoulder relief makes tight doorway aiming usable.

## D. Papa's Shop architecture

PASS only if:

- Main shop opening is visibly a garage/overhead door approximately 3.55 m wide, not a tiny house door in a large hole.
- Separate man door reads as a pedestrian entrance.
- Exterior has corner trim, eaves/gutters, roof ridge, chimney and believable wall thickness/detail.
- Windows have frames and glass and block players/shots correctly.
- Shop has a ceiling/roof above the player; it must not feel like scenery standing in an empty skybox.
- Attached barn reads as a connected but different-use space.
- Structural rafters/ceiling elements give scale overhead.

## E. Interior scene dressing

PASS only if the shop tells a coherent story rather than merely containing objects:

- Workbench is against a logical work wall with tools/pegboard.
- Tool chest, shelving, drill press, compressor, welding cart, ladder and conduit are intentionally placed and do not randomly overlap paths.
- Tractor and motorcycle have enough negative space around them to walk/search/climb.
- Concrete has drain/oil/wear cues so it does not read as one flat rectangle.
- Hose reel/conduit/electrical panel provide believable wall utility detail.
- Fireplace, Papa's yellow chair and side table read as a distinct hangout corner.
- Coffee mugs appear on a mantel/table, not mysteriously on the floor.
- Firewood is near the fireplace.
- Small clutter does not block every navigation route.

## F. Exterior / outside view

PASS only if:

- Looking out a door/window shows continued rural ground rather than the playable rectangle visibly ending.
- A distant tree line creates depth.
- Distant sheds/utility poles/power lines provide scale.
- Sky/fog transition is gradual and the horizon does not look like a hard edge.
- Exterior apron has tire wear, materials and vegetation variation rather than one flat color.

## G. Gameplay / collision

PASS only if:

- Solid walls fully occlude players.
- Shots hit the first wall/object before a player behind it.
- Bots navigate through doors and around equipment instead of continuously pushing into walls.
- Character-to-character separation does not produce violent jitter.
- Mantling works on intentionally climbable crates/workbench/tractor surfaces and not on ceilings/walls.
- Small raised props do not create invisible full-height blockers.

## H. Phone performance

The QA HUD is diagnostic, not a beauty score. During normal movement through Papa's Shop:

- target: close to the configured 55 fps where the device allows it;
- acceptable during dense moments: stable and responsive without sustained severe stutter;
- investigate if FPS remains low while draw calls/triangles spike sharply or camera movement becomes input-lagged.

Visual detail may be reduced before sacrificing control response. Collision complexity should remain simpler than visible mesh complexity.

## Quality gate

**Do not move to Camper/Campsite just because automated tests pass.**

Papa's Shop passes only after real-device footage confirms:

- correct character scale,
- front/side/back character readability,
- usable camera,
- believable building shell,
- believable exterior horizon,
- coherent object placement,
- working occlusion/collision,
- stable controls/performance.

Any failure becomes a named fix in Papa's Shop before the next map inherits the system.
