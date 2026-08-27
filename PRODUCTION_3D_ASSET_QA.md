# Production3D Papa's Shop real-device QA

This checklist judges the new asset pipeline, not whether the JavaScript test suite is green.

## John

- [ ] John reads as John from the front without relying only on shirt color.
- [ ] Plaid, beard, hair, jeans, belt and boots remain recognizable from normal gameplay distance.
- [ ] Walking behind John shows an honest back view with no front-facing portrait trick.
- [ ] Side view has a believable nose/jaw/head silhouette.
- [ ] Feet meet the floor and his visual height agrees with doors/furniture.
- [ ] Walk/run/jump/land/aim motion moves the imported GLB joints rather than leaving the model static.
- [ ] Prop-zapper is appropriately scaled and attached at the hand rather than floating.

## Gunner

- [ ] Gunner is clearly the largest family dog.
- [ ] Head, muzzle, droopy ears, tongue, chest, haunches, paws and tail read from multiple angles.
- [ ] Four-leg gait remains stable while moving and the backpack zapper stays attached.
- [ ] Gunner does not look like Molly/Kelsi scaled up.

## Papa's Shop hero assets

- [ ] Tractor reads as a tractor from the doorway, side and rear.
- [ ] Tractor wheels/seat/roll frame/hood have enough silhouette detail to beat the procedural fallback.
- [ ] Papa's yellow chair reads as upholstered furniture with wear, not a yellow box stack.
- [ ] Imported hero assets align with their collision footprints and do not visibly sink or float.

## Camera and world

- [ ] No character or gun is visible through solid walls.
- [ ] Camera does not pass outside through a wall.
- [ ] Aiming near doorways remains usable.
- [ ] Outside view has field/tree-line/utility depth and does not expose the edge of the playable rectangle.
- [ ] Interior exposure remains readable while exterior daylight is visible.

## Phone diagnostics

Launch Prop Hunt with `?qa3d=1` and capture one frame if something feels wrong. The HUD should identify the player asset as `GLB+joints` for John/Gunner when the production asset loaded successfully.

## Approved-reference face mapping

- [ ] John's facial texture follows the curved head and does not read as a flat rectangle.
- [ ] John's approved face remains recognizable at normal gameplay distance.
- [ ] The face does not appear on the side/back of the head.
- [ ] Gunner's fur/face texture follows his 3D head and does not become a floating photo patch.
- [ ] Rear views of both characters contain only rear geometry/materials.

## Expanded hero kit

- [ ] Old motorcycle reads clearly from side/front/rear and has separate tires, spokes/frame, tank, engine, seat and headlamp.
- [ ] Fireplace has individual masonry mass, hearth, mantel, firebox and grate depth.
- [ ] Workbench reads as a used shop bench with pegboard/tools/vise rather than a rectangular table.
- [ ] Rolling tool chest has visible drawers/handles/casters.
- [ ] Loaded shelving has structural posts, shelves and stored bins.
