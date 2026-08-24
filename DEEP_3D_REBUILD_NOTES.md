# v1.5.0 Deep 3D Rebuild Notes

## Problem found on live-device testing
The v1.3/v1.4 architecture had a real WebGL renderer, depth buffer and 3D camera, but most visible assets were still low-detail primitives. The live iPhone screenshot made the difference obvious: the engine was 3D, while the art layer still read as a prototype.

## Architectural change
A new shared module, `public/shared-3d-art-kit.mjs`, is now the visual foundation for both real-time 3D games. Gameplay collision remains deliberately simpler than display geometry. This keeps mobile movement and raycasting predictable while allowing the rendered object to contain much more detail.

## Material system
The shared kit creates repeatable runtime textures rather than relying on one flat color per mesh. Material families include wood/painted wood, concrete, gravel/dirt, metal/painted metal/galvanized steel, rubber, fabric/leather, stone, hay, pegboard and glass.

## Prop Hunt asset pass
Papa's Shop is the main quality target. It now contains constructed building surfaces and a reusable asset library for its equipment and clutter. The same library is used across Camper/Campsite, Backyard/Acreage and Goat/Farm.

## Characters
The old box/cylinder person has been replaced by a rounded hierarchical rig. Facial features live only on the front of the head, so rear/side views remain rear/side views. Dogs use true four-legged hierarchical rigs. The prop-zapper is intentionally smaller and more readable than the previous oversized black silhouette.

## Island Life asset pass
Village stores, homes, interiors and furniture now use the same shared art system. This is important because the life-sim will eventually contain far more objects than Prop Hunt; a shared builder/material architecture prevents each new object from becoming another one-off block.

## Performance strategy
- Detailed visible meshes, simplified collision boxes.
- Material/texture caches so repeated objects reuse materials.
- Procedural textures are 256px and reused.
- Device pixel ratio remains capped.
- Shadow quality remains bounded for mobile.

## Next quality ceiling
This build moves the games from grey-box procedural geometry to detailed stylized procedural 3D. The next major visual ceiling, if desired, is replacing selected hero assets and family characters with authored GLB/GLTF models and baked textures while keeping the gameplay/collision/network architecture built here.
