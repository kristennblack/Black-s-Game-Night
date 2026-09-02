# MASTER PROMPT INSERT - W40 EXTERNAL ASSET PIPELINE PROOF

This directive has highest precedence for flagship 3D visual production until superseded by a later explicit user-approved directive.

## Objective
Stop trying to manufacture final visual art from gameplay code. Prove one professional real-time slice using authored GLB assets, PBR materials, a shoulder-level third-person camera, believable lighting, explicit fallbacks, and runtime truth telemetry.

## Visual proof slice
The flagship proof is John in the main mechanic bay of Papa's Shop with a garage opening, tractor, workbench, rolling tool chest, shelving, tires, welder/compressor and roughly ten readable Prop Hunt props. The actual running build must look substantially closer to the approved visual target than the W40 failure baseline.

## Source-of-truth hierarchy
1. Device-approved external/authored GLB.
2. QA candidate external/authored GLB.
3. Best proven project fallback.
4. Procedural/debug art only when no better visible fallback exists.

A candidate may never hide the fallback merely because a file exists. Promotion requires load success, sane bounds, required rig/geometry/material data, and then separate visual/device approval.

## Character rule
John's approved likeness remains mandatory. Do not set approvedModel=true, label a legacy/proxy rig approved, or promote an external character until the actual face/proportions/clothing pass visual QA. A QA proxy may be used for animation development only and must be visibly labelled NOT APPROVED.

## Environment rule
Papa's Shop production art must be authored outside the gameplay code or imported as real GLB content. Final hero art may not be a collection of BoxGeometry/cylinders pretending to be the approved shop. Collision proxies may remain simple and invisible.

## Materials
Hero assets require UVs and game-ready PBR materials. Minimum environment/prop coverage: base color, normal and roughness. Metallic and AO are expected where appropriate. Wood must read as wood, concrete as concrete, painted/bare metal as metal, rubber as rubber, glass as glass and textiles as textiles.

## Camera
Normal Prop Hunt gameplay uses a close shoulder-level third-person camera. It must not begin in a steep top-down presentation. The camera must preserve readable character body language, shop depth and object silhouettes while retaining obstruction recovery and mobile look controls.

## Lighting
Use image-based environment lighting when available plus restrained directional/practical lights and contact shadows. Lighting must reveal material response and depth instead of washing the scene into flat brown shapes.

## Runtime truth
QA builds must expose a visible runtime truth overlay showing exact build, renderer, camera state, character source/approval, environment source, prop source, production/fallback counts, mesh/triangle/material counts, PBR map coverage and obvious fallback warnings. A screenshot with the overlay is stronger evidence than a version number in release notes.

## External workflow
Preferred workflow: Meshy or equivalent for fast reference-to-3D block-in, Blender for cleanup/UV/retopology/material/export, Character Creator/AccuRIG or equivalent for humanoid construction/rigging, Mixamo or equivalent for animation starting points, Poly Haven or equivalent for legal HDRI/PBR references, and glTF inspection/optimization before integration.

External services are production tools, not automatic approval. Their output must still pass identity, art, performance, animation and device gates.

## Drop-in file contract
- CHAR_JOHN_W40.glb
- ENV_PAPA_SHOP_HERO_BAY_W40.glb
- SET_PAPA_SHOP_HERO_PROPS_W40.glb

Incoming candidates remain qaReady=false in the W40 manifest until they have been audited. Missing/rejected candidates must preserve the proven fallback.

## Gate
W40 is not visually approved because tests pass. Acceptance requires an actual running WebGL screenshot/video from staging/phone showing the production slice and runtime truth overlay. Generated target images are never runtime proof.
