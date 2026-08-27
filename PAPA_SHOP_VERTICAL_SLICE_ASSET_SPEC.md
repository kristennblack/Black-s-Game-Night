# Papa's Shop Finished Visual Vertical Slice

Papa's Shop is the first full-quality art proof. Do not expand all maps until this slice works visually and technically on a real phone.

## Preserve from current gameplay layout

- shop footprint and floor heights
- attached searchable/playable barn footprint
- overhead-door/man-door openings
- outdoor apron/playable area
- current spawn/safe-recovery areas
- tested invisible collision boundaries
- climbable routes and support heights
- tractor and motorcycle gameplay locations
- Papa chair/fireplace landmark relationship
- workbench/shelving gameplay lanes

## First proper human

**John**

Required:
- recognizable face/head/hair/facial-hair treatment from approved references
- established plaid shirt, jeans and boots look
- authored body topology
- humanoid armature and skin weights
- GLB export compatible with the shared character loader
- animation proof with idle/walk/run/turn/jump/fall/land plus a Prop Hunt action state

## First proper dog

**Gunner**

Required:
- recognizable large dog proportions/head/coat
- authored quadruped topology
- dog skeleton and weights
- idle/trot/run proof clips

## Shop/barn art set

Required finished visible assets:

- shop shell
- roof/trim
- overhead door
- man doors
- windows/glass
- attached barn shell/interior structure
- Papa's old tattered yellow chair with high curved arms
- fireplace
- workbench
- shelving
- tool chest/storage
- tractor
- old motorcycle
- lumber/pallets
- buckets/cords/oil containers/tools/shop clutter
- representative hideable objects
- proper wood/paint/metal/rubber/glass/fabric/concrete/dirt materials
- intentional interior/exterior lighting

## Integration rules

- detailed visual meshes do not replace simplified gameplay collision automatically
- preserve existing gameplay coordinates unless a documented visual/collision mismatch requires a targeted adjustment
- keep model loading errors visible in QA mode but not as intrusive player UI
- do not silently fall back and call the fallback finished
- tune LOD/texture sizes for mobile browser performance

## Acceptance gate before expansion

On a target phone verify:

1. John no longer reads as a primitive mannequin.
2. Gunner reads as a proper dog rather than generated shapes.
3. Shop and barn read as authored spaces rather than box blockouts.
4. Camera remains readable through doors, beside shelves, near the roof and in the barn.
5. Collision still matches visible walls/doors/floors closely enough for play.
6. Prop Hunt hide/shoot/climb interactions remain functional.
7. Asset delivery works from Cloudflare staging.
8. Mobile frame rate is acceptable.
9. No missing-model/texture errors occur.
10. The visual direction is explicitly approved before building the remaining large maps.
