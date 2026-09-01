# BLACK FAMILY GAME NIGHT - MASTER PHASE W40
## External Asset Pipeline, Runtime Truth, and Professional 3D Proof

Build candidate: `GAME-NIGHT-STAGING-CANDIDATE-W40-EXTERNAL-ASSET-PIPELINE-59`
Official current release remains W30 until real-device visual approval.

## 1. Why W40 exists
The user-provided actual Prop Hunt screenshot proves that repeated internal code passes have not produced the required visual result. The scene still reads as steep/top-down, procedural, sparsely textured and weakly lit. W40 changes the production method rather than adding another cosmetic patch.

The game engine remains Three.js. Gameplay systems, collision, networking, Prop Hunt rules and proven movement work are preserved. Final visual content is moved to an authored-asset workflow.

## 2. Flagship vertical slice
Prove one real mechanic-bay scene before expanding again:
- approved John;
- main Papa's Shop mechanic bay;
- bright garage opening;
- tractor;
- workbench;
- rolling tool chest;
- shelving;
- tires;
- welder/compressor;
- roughly ten readable hider props.

The slice must work with the actual game camera and gameplay. It is not a poster, concept board or isolated beauty render.

## 3. Asset states
Every visible hero asset has four separate states:
- `fallback`: proven existing visual remains visible;
- `candidate`: external authored file exists and is being audited;
- `qaReady`: file passes technical import checks and may be tested in runtime;
- `approved`: separate visual/device approval has been recorded.

Never equate `candidate` or `qaReady` with `approved`.

## 4. John contract
Expected filename: `public/models/w40/incoming/CHAR_JOHN_W40.glb`.

Requirements:
- approved recognizable John likeness and proportions;
- approximately 1.82 m game height unless art review changes it;
- clean humanoid hierarchy and skin weights;
- production hands/shoulders/neck/head;
- plaid shirt, jeans, boots, hair and beard/stubble as actual authored surfaces;
- weapon hand/socket support;
- recommended LOD0 20k-65k triangles, LOD1 <=30k;
- core clips or retargetable equivalents for Idle, Walk, Run, Sprint, Start/Stop, Turn, Jump/Fall/Land, Mantle, Aim and Fire.

The legacy John GLB remains a QA animation proxy only while `approvedModel:false`. W40 may not silently override that gate.

## 5. Papa's Shop hero-bay contract
Expected filename: `public/models/w40/incoming/ENV_PAPA_SHOP_HERO_BAY_W40.glb`.

Requirements:
- coherent authored coordinate system and meter scale;
- origin and floor at y=0;
- readable garage walls/openings/doorway/ceiling structure;
- UV-mapped materials;
- baseColor + normal + roughness minimum on hero surfaces;
- metallic/AO where physically appropriate;
- no baked gameplay colliders required in the visible model;
- no invisible giant meshes or bad bounds;
- static geometry suitable for simplified collision extraction/proxies.

## 6. Hero prop-set contract
Expected filename: `public/models/w40/incoming/SET_PAPA_SHOP_HERO_PROPS_W40.glb`.

It must share the hero-bay coordinate contract or use clearly documented independent pivots. Required hero identities include tractor, workbench, tool chest, shelving, tires, welder, compressor, gas can, bucket and toolbox. A different object may not masquerade as one of those names merely to satisfy a manifest check.

## 7. Professional camera
W40 Prop Hunt candidate camera target:
- distance ~3.72 m;
- aim distance ~2.88 m;
- camera target height ~1.34 m;
- shoulder ~0.46 m;
- normal FOV ~56 degrees;
- aim FOV ~49 degrees;
- initial/recovery pitch near level rather than steep top-down.

Existing obstruction collision, pinch/zoom/look controls and recovery behavior remain mandatory.

## 8. Lighting and color
- sRGB output;
- ACES filmic tone mapping;
- soft shadows within mobile budget;
- HDR/image-based environment lighting when available;
- cool/neutral exterior daylight plus warm shop practicals;
- contact shadows under John, machinery and furniture;
- exposure chosen to preserve material detail.

W40 may use the Poly Haven Small Workshop HDRI as a CC0 lighting benchmark when network access permits. Failure to load it must degrade safely without taking down gameplay.

## 9. Runtime truth overlay
The QA overlay is mandatory for W40 proof and must expose:
- exact candidate build;
- WebGL status and DPR;
- character source and approval state;
- authored environment/prop-set status;
- W40 incoming candidate state;
- camera distance/pitch/FOV/target height;
- visible mesh and triangle counts;
- material and PBR map counts;
- production/legacy/collision-only counts;
- warnings for unapproved character, missing authored environment, very low texture coverage or camera problems.

Cabin QA receives an equivalent W40 truth panel showing true-3D versus static fallback and production-GLB versus design/legacy furniture counts.

## 10. Clean external proof bench
`/w40-production-proof.html` is an isolated real-WebGL import bench. It must be able to load project fallbacks and local user-selected GLBs for John, shop and hero props, report geometry/material/rig/animation statistics, and provide a shoulder-level camera and basic animation playback. This page is technical/visual QA only and does not mark assets approved.

## 11. Optimization
Every candidate passes a glTF audit before game integration. Remove unused nodes/materials/textures, deduplicate where safe, compress meshes/textures only after visual comparison, keep mobile texture sizes sensible, and create LODs/decimation for heavy models. Never optimize by deleting the visual identity that made an item pass approval.

## 12. Cabin/furniture relation
W39 true-3D cabin remains active. W40 adds runtime truth so a static SVG fallback cannot be mistaken for the 3D room. The same external pipeline should later produce real furniture GLBs, but Prop Hunt's flagship slice remains the first W40 visual proof.

## 13. QA sequence
1. Open `/w40-production-proof.html` and inspect external GLBs before integration.
2. Run the GLB audit tool.
3. Put accepted candidate filenames in `public/models/w40/incoming/`.
4. Keep manifest `qaReady:false` until technical review passes.
5. Set `qaReady:true` only for a candidate ready for runtime comparison.
6. Open Prop Hunt with `w40Truth=1` and capture actual screenshots/video.
7. Compare against the user-provided W40 failure baseline and approved visual target.
8. Mark visual/device approval separately.

## 14. Shipping gates
A W40 visual advancement requires all of:
- automated regression green;
- staging validator green except known infrastructure warnings;
- production asset audit green;
- exact ZIP cold extraction/test green;
- actual running phone/browser visual proof;
- user approval of the visible result.

Until then, W40 remains a staging candidate and W30 remains official current release.
