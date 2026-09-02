# W40 Phone / Staging QA - External Asset Pipeline 59

Candidate: `GAME-NIGHT-STAGING-CANDIDATE-W40-EXTERNAL-ASSET-PIPELINE-59`

## 1. Prop Hunt runtime truth
Open:
`/new-games.html?game=prophunt&qa3d=1&autostart=1&qaRole=hider&map=papa&w40Truth=1`

Capture one screenshot immediately after the world and character have loaded. The black W40 RUNTIME TRUTH panel must be readable.

Record:
- exact BUILD shown;
- CHAR source and approval state;
- WORLD environment + prop-set state;
- W40 incoming environment/props state;
- HDRI lighting state;
- camera distance, pitch and FOV;
- PBR map counts;
- any STATUS warnings.

### Visual gate
Compare directly with `visual_proofs/W40_ACTUAL_PROP_HUNT_FAILURE_BASELINE.png`.
PASS only if the actual running candidate is clearly more shoulder-level, readable and dimensional without losing the fuller W36 shop/farm world.

Do not mark the art approved merely because the camera is improved. If `CHARACTER NOT FINAL`, `AUTHORED ENVIRONMENT NOT ACTIVE`, or `VERY LOW PBR MAP COVERAGE` appears, the overlay is correctly telling us the production-art gate is still open.

## 2. Hunter controls
Open:
`/new-games.html?game=prophunt&qa3d=1&autostart=1&qaRole=hunter&map=papa&w40Truth=1`

The hunter is intentionally protected/frozen during the normal hide countdown. After the hunt begins test:
- walk / jog / run / sprint;
- gentle, sharp and 180-degree turns;
- aim while moving forward/back/strafe;
- fire while moving;
- jump/land;
- camera around shelving/tractor/doorways;
- three-minute stress loop.

## 3. External GLB proof bench
Open:
`/w40-production-proof.html`

Before integrating any new Meshy/Blender/Reallusion/Fab asset:
- load it using the matching local GLB picker;
- verify scale and orientation;
- inspect triangles/materials/PBR maps;
- for John, inspect skin/bone/animation counts;
- use the shoulder camera and basic animation controls;
- do not call the candidate approved from this page alone.

## 4. Cabin runtime truth
Open the normal Cabin room with `&w40Truth=1` (or `?w40Truth=1` if it is the only query parameter).

The W40 CABIN RUNTIME TRUTH panel must say `RENDERER WebGL` for true 3D. If it says STATIC FALLBACK ACTIVE or renderer failed, that screenshot is not valid true-3D furniture proof.

Record:
- production GLB count;
- design fallback count;
- legacy fallback count;
- load errors;
- PBR map coverage;
- visual scale/placement of bed, chair, nightstand/lamp and any other placed furniture.

## 5. Result
Return one of:
- GREEN: gameplay + performance + visuals visibly improved and no critical fallback warning;
- AMBER: technically usable but production/fallback/material/camera issue remains;
- RED: stuck, top-down, sparse, flat, broken, severe clipping, missing shop/furniture, bad FPS or renderer failure.

Include screenshots and timestamps for every AMBER/RED defect.
