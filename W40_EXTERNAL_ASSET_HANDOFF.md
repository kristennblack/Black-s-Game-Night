# W40 External Asset Handoff

## Drop-in locations
Place reviewed candidates here:
- `public/models/w40/incoming/CHAR_JOHN_W40.glb`
- `public/models/w40/incoming/ENV_PAPA_SHOP_HERO_BAY_W40.glb`
- `public/models/w40/incoming/SET_PAPA_SHOP_HERO_PROPS_W40.glb`

Then audit them before changing `public/models/w40/external-asset-manifest.json` from `qaReady:false` to `true`.

## Coordinate contract
- Units: meters.
- Up axis after glTF export: +Y.
- Forward for a neutral character: +Z or document the authored forward direction and normalize during import.
- Environment floor: y=0.
- Environment and authored set should preferably share world coordinates.
- Character origin: floor between feet, centered laterally.
- Individual props: pivot at sensible floor/contact center unless the object specifically hinges/rotates elsewhere.

## Material contract
Hero environment/props: baseColor, normal and roughness minimum. Metallic for bare/painted metals where useful; AO where useful. Use UVs, not screen-space baked tricks. Prefer KTX2/Basis texture delivery after approval/optimization, with source textures archived separately.

## Naming
Use readable names such as `tractor_body`, `tractor_tire_FL`, `workbench_top`, `toolchest_drawer_01`, `john_hand_R`, not anonymous Mesh_0234 where cleanup is practical.

## Before delivery
- apply transforms;
- remove accidental duplicate/internal faces;
- verify normals/tangents;
- verify material assignment;
- verify no 8K textures are needed for mobile;
- inspect at gameplay camera distance;
- export GLB;
- run `node tools/w40_audit_external_glb.mjs <file.glb>`;
- open `/w40-production-proof.html` and drop the file into the matching slot.
