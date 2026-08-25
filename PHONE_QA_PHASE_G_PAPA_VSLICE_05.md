# Phone QA — Phase G Papa's Shop Vertical Slice 05

Build ID must read: `GAME-NIGHT-STAGING-PHASE-G-PAPA-VSLICE-05`

This checklist is the real-device acceptance gate. Automated tests and the offline proof render do not replace it.

## Before testing

- Confirm the build ID is correct.
- Hard refresh once after deployment so the service worker/cache picks up the new GLBs.
- Test in normal play first, not QA mode.
- If diagnostics are needed, enable the project's QA mode only after reproducing the issue.

## Fixed screenshot checkpoints

Capture these from the same phone/orientation so future builds can be compared directly:

1. Outside facing Papa's Shop and the overhead door.
2. Walking through the overhead door.
3. Main shop interior with tractor/motorcycle visible.
4. Papa chair + fireplace landmark area.
5. Attached barn interior.
6. John close to a shop wall with the camera compressed.
7. John running.
8. John jumping / landing.
9. Hunter aiming / shooting.

## John / animation

Reject if John still reads as the previous segmented runtime mannequin.

Check:

- approved face/hair direction reads reasonably at gameplay distance,
- plaid shirt and denim are present,
- player-colour tint affects the intended primary-clothing material only,
- idle does not freeze unnaturally,
- Walk and Run visibly differ,
- animation speed agrees with movement speed,
- turning blends without a 180-degree snap,
- Jump -> Fall -> Land transitions are visible,
- Fire/aim state does not permanently lock the rig,
- no obvious severe foot sliding or exploding skin weights.

## Papa's Shop + barn

Reject if the old procedural wall/roof/blockout remains the dominant visible shell after the Phase G assets load.

Verify:

- shop sign is visible,
- overhead opening remains playable,
- attached barn remains fully searchable,
- roof/walls/windows/trim render without missing materials,
- tractor and motorcycle remain in their intended gameplay positions,
- Papa's yellow chair and fireplace are recognizable landmarks,
- workbench/tool chest/shelving and clutter render,
- old collision still matches the visible openings/floor.

## Camera / controls

### Mobile

- left joystick moves the player only,
- right-side empty gameplay drag orbits/looks without moving the player,
- two-finger pinch changes third-person camera distance,
- pinch does not trigger Jump/Prop/Shoot/other actions,
- Reset View still recovers a bad camera,
- indoor camera does not become top-down,
- camera does not remain buried in John's body,
- camera obstruction recovers after leaving a wall/doorway.

### Desktop

- WASD movement,
- mouse/drag look,
- mouse-wheel zoom,
- Space jump,
- Shift sprint,
- R Reset View,
- Prop Hunt action controls remain functional.

## Performance / loading

Record:

- device/browser,
- initial John load time,
- whether the shop/barn/prop set appears before or after fallback,
- any missing-texture/model warning in QA mode,
- noticeable hitch when first playing an animation,
- approximate FPS/feel outside, inside shop, and inside barn,
- any WebGL/context crash.

## Acceptance states

- **CODE VERIFIED:** automated package tests pass.
- **ASSET VERIFIED:** GLB skin/animations/environment/prop files pass technical audit.
- **RENDER VERIFIED:** offline packaged-asset proof has been visually inspected.
- **PHONE VERIFIED:** mark PASS only after the above real-device checks and screenshots are acceptable.

Do not expand the production-art conversion to Island Life or Birthday Seat until this Papa's Shop phone gate passes.
