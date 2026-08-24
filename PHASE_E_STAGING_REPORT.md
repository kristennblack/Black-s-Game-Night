# Black Family Game Night - Phase E Staging Report

Build: **3D-STAGING-PHASE-E-01**  
Package version: `3.0.1-staging-phase-e-01`  
Date: 2026-08-24  
Status: **STAGING TEST CANDIDATE ONLY - NOT PRODUCTION READY**

## Source continuity note

The accepted Phase D QA report identified its working tree as `/mnt/data/v301_playability`, reported 243/243 tests passing, and intentionally did not create a Phase D release ZIP. That transient worktree was no longer mounted when Phase E began. The latest persisted source archive was `black-family-game-night-v3.0.1-playability-recovery-full-replacement.zip`, which contained the earlier 206-test baseline.

This Phase E package therefore reconstructs the accepted shared camera, collision, body-profile, authored-model, animation-fallback and zoom foundation from the persisted v3.0.1 source plus the accepted Phase D report, then adds Phase E staging instrumentation. It must not be described as a byte-for-byte continuation of the vanished Phase D worktree.

## 1. Complete avatar asset audit

Important definitions used below:

- **Genuine authored 3D model** means a finished artist-authored character asset in the strict sense requested for QA, not merely geometry exported into a GLB.
- **Skeleton** means a glTF skin/skinned skeleton. A named transform hierarchy is called out separately and is not counted as a glTF skeleton.
- **2D image used** distinguishes setup/selection portraits from an in-world billboard/standee.

| Character | Actual in-game model file | Format | Genuine authored 3D model? | GLB/GLTF? | Skeleton | Authored animation clips | Procedural joint animation | Three.js primitive-generated body/fallback | 2D image/sprite/standee use | Intended recognizable look/outfit |
|---|---|---|---|---|---|---|---|---|---|---|
| John | `/public/models/characters/john.glb` when load succeeds; procedural human rig if it fails | Binary glTF | **No, not in the strict artist-authored sense.** Real binary GLB exists, but repository tooling builds it parametrically with Trimesh | Yes, GLB | **No glTF skin.** Named joint transform hierarchy only | **0 clips** | **Yes.** Named GLB joints are driven procedurally because there are no clips | Yes, fallback rig is Three.js procedural geometry | Setup/selection portrait yes. In-world 2D standee no. GLB also uses a mapped face image texture on curved 3D geometry | GLB encodes John's plaid shirt, denim and boots plus face reference. Actual likeness on phone is **UNVERIFIED** |
| Kristen | **REAL 3D AVATAR ASSET MISSING**. Runtime uses procedural human rig | Three.js runtime geometry | No | No character GLB/GLTF | No glTF skeleton | None | Yes | **Yes** | Setup/selection portrait yes; no in-world standee | Code supplies body proportions/outfit colors only. Intended real recognizable avatar is missing |
| Holly | **REAL 3D AVATAR ASSET MISSING**. Runtime uses procedural human rig | Three.js runtime geometry | No | No character GLB/GLTF | No glTF skeleton | None | Yes | **Yes** | Setup/selection portrait yes; no in-world standee | Code cues hoodie/baggy-jeans look only. Intended real recognizable avatar is missing |
| Vanessa | **REAL 3D AVATAR ASSET MISSING**. Runtime uses procedural human rig | Three.js runtime geometry | No | No character GLB/GLTF | No glTF skeleton | None | Yes | **Yes** | Setup/selection portrait yes; no in-world standee | Code cues western look only. Intended real recognizable avatar is missing |
| Elizabeth / Lizzie | **REAL 3D AVATAR ASSET MISSING**. Runtime uses procedural human rig | Three.js runtime geometry | No | No character GLB/GLTF | No glTF skeleton | None | Yes | **Yes** | Setup/selection portrait yes; no in-world standee | Code cues tank/shorts look only. Intended real recognizable avatar is missing |
| Logan | **REAL 3D AVATAR ASSET MISSING**. Runtime uses procedural human rig | Three.js runtime geometry | No | No character GLB/GLTF | No glTF skeleton | None | Yes | **Yes** | Setup/selection portrait yes; no in-world standee | Code cues hoodie/jeans look only. Intended real recognizable avatar is missing |
| James | **REAL 3D AVATAR ASSET MISSING**. Runtime uses procedural human rig | Three.js runtime geometry | No | No character GLB/GLTF | No glTF skeleton | None | Yes | **Yes** | Setup/selection portrait yes; no in-world standee | Code cues denim shirt/jeans only. Intended real recognizable avatar is missing |
| Dorothy | **REAL 3D AVATAR ASSET MISSING**. Runtime uses procedural human rig | Three.js runtime geometry | No | No character GLB/GLTF | No glTF skeleton | None | Yes | **Yes** | Setup/selection portrait yes; no in-world standee | Code cues flowy/floral dress only. Intended real recognizable avatar is missing |
| Papa | **REAL 3D AVATAR ASSET MISSING**. Runtime uses procedural human rig | Three.js runtime geometry | No | No character GLB/GLTF | No glTF skeleton | None | Yes | **Yes** | Setup/selection portrait yes; no in-world standee | Code cues shirt/jeans only. Intended real recognizable avatar is missing |
| Nana | **REAL 3D AVATAR ASSET MISSING**. Runtime uses procedural human rig | Three.js runtime geometry | No | No character GLB/GLTF | No glTF skeleton | None | Yes | **Yes** | Setup/selection portrait yes; no in-world standee | Code cues leggings/shirt only. Intended real recognizable avatar is missing |
| Gunner | `/public/models/dogs/gunner.glb` when load succeeds; procedural dog rig if it fails | Binary glTF | **No, not in the strict artist-authored sense.** Real binary GLB exists, but repository tooling builds it parametrically with Trimesh | Yes, GLB | **No glTF skin.** Named joint transform hierarchy only | **0 clips** | **Yes.** Named GLB joints are driven procedurally because there are no clips | Yes, fallback dog is Three.js procedural geometry | Setup/selection portrait yes; no in-world standee. GLB uses a mapped face/fur reference image | GLB encodes cream/tan farm-dog coloring, harness and facial reference. Actual likeness on phone is **UNVERIFIED** |
| Kelsi | **REAL 3D AVATAR ASSET MISSING**. Runtime uses procedural dog rig | Three.js runtime geometry | No | No dog GLB/GLTF | No glTF skeleton | None | Yes | **Yes** | Setup/selection portrait yes; no in-world standee | Code cues golden-dog/pink-collar look only. Intended real recognizable avatar is missing |
| Molly | **REAL 3D AVATAR ASSET MISSING**. Runtime uses procedural dog rig | Three.js runtime geometry | No | No dog GLB/GLTF | No glTF skeleton | None | Yes | **Yes** | Setup/selection portrait yes; no in-world standee | Code cues golden-dog/tongue-out look only. Intended real recognizable avatar is missing |

### Character GLB structure found

| Asset | Size | Nodes | glTF skins | Skinned nodes | Authored animations | Image textures |
|---|---:|---:|---:|---:|---:|---:|
| John | about 412 KiB | 106 | 0 | 0 | 0 | 1 |
| Gunner | about 273 KiB | 51 | 0 | 0 | 0 | 1 |

The production-asset audit passes GLB headers, hierarchy and calibrated height checks, but that does **not** convert these files into skinned/artist-authored animated characters.

## 2. Complete real-time 3D map asset audit

### Environment art and asset construction

| Game | Map / environment | Main source files | Authored environment GLB/GLTF? | Procedural portions / Three.js primitives | Explicit placeholders / fallbacks | Actual packaged 3D props | Textures / materials | Is the map primarily finished authored artwork? |
|---|---|---|---|---|---|---|---|---|
| Family Prop Hunt | Papa's Shop | `public/prop-hunt-3d.js`, `public/shared-3d-art-kit.mjs`, `public/prop-hunt-core.mjs` | **No environment GLB** | Floor, segmented walls, ceilings, sloped roof panels, barn structure, trim, fences, trees, doors and much of the clutter/furniture are generated geometry, including boxes/cylinders/planes and art-kit mesh builders | **Yes.** Procedural workbench, tool chest, shelving, tractor, motorcycle, fireplace and Papa chair are created first as fallbacks and hidden/replaced if their GLBs load | Tractor GLB, motorcycle GLB, Papa chair GLB, fireplace GLB, workbench GLB, tool chest GLB, shelving GLB; hunter zapper GLB. These files are themselves repository-generated parametric GLBs, not a complete authored environment | `art.material(...)` uses procedural CanvasTexture/PBR-style material detail. Hero GLBs mainly use material factors; no external map texture set | **No. Primarily procedural primitive/generated geometry.** Papa's Shop has the strongest GLB prop coverage but remains a generated map rather than a finished authored environment |
| Family Prop Hunt | Camper / Campsite | Same Prop Hunt sources | **No** | Camper shell, interior walls/ceiling/roof, bed, counter, couch, bunks, bathroom, ground, water, tent/truck/fire/clutter are procedural mesh builders and primitive geometry | No authored-asset loader fallback set. Most objects are procedural stand-ins by construction | No packaged environment GLB props are installed on this map | Procedural art-kit materials plus MeshPhysical/standard materials; water is a generated plane/material | **No. Primarily procedural primitive/generated geometry** |
| Family Prop Hunt | Acreage / Backyard + Fire Pit | Same Prop Hunt sources | **No** | Deck/planks/posts, hot tub, bins, trailer, boat, shop/shed buildings, trampoline, pool, firepit, garden, fences and clutter are generated mesh builders/primitives | No authored-asset loader fallback set. Visual objects are procedural approximations | No packaged environment GLB props installed here | Procedural art-kit CanvasTexture/material system and standard/physical materials | **No. Primarily procedural primitive/generated geometry** |
| Family Prop Hunt | Farm / Goat area | Same Prop Hunt sources | **No** | Coop/shed structures, sea can, lumber, goat stairs, crates, stalls, mud, fences and market structures are generated geometry | No authored-asset loader fallback set. Visual objects are procedural approximations | No packaged environment GLB props installed here | Procedural art-kit materials and generated surface detail | **No. Primarily procedural primitive/generated geometry** |
| Family Island Life | Island exterior | `public/island-life.js`, `public/island-life-core.mjs`, shared 3D modules | **No** | Water, island sand/terrain, plaza, paths, stores, resident houses, marina, stalls, trees/bushes/rocks, docks, benches, lamps, fields and loose props are generated. Terrain is procedural heightfield-style geometry; several shapes use cylinders/spheres/boxes/planes | No separate authored environment load. Generated objects are the production visuals currently present | No packaged environment GLB set for the island | Art-kit procedural CanvasTexture/PBR-style materials, MeshPhysical water and MeshStandard materials | **No. Primarily procedural generated geometry** |
| Family Island Life | Resident home interior | `public/island-life.js`, `public/island-life-core.mjs`, shared 3D modules | **No** | Floor, walls, windows, base/crown trim, ceiling, lights/fan, door casing, partitions, fixed shelving/workbench and runtime furniture are generated geometry | No authored environment loader. Furniture is generated rather than imported final art | No packaged home-interior GLB set | Procedural art-kit materials and standard materials | **No. Primarily procedural primitive/generated geometry** |
| John's Birthday Seat | Birthday obstacle course / family obby | `public/birthday-climb.js`, shared 3D modules | **No** | Ground, all 33 route nodes, crates, workbench/tool-chest forms, tractor/tire/lumber/shelf/cooler/picnic/bins/camper/log/deck/hay/ramp/trough/sea-can/gifts/table/cake/balloon/banner/crown/throne forms, route supports and moving platforms are procedural/art-kit geometry | No imported environment/obstacle GLB replacement layer. The course art itself is generated | No packaged course GLB props are installed | Procedural art-kit materials plus standard/physical materials | **No. It is a real WebGL obstacle course, but visually it is still primarily procedural primitive/generated geometry** |

### Collision, spawn, camera-risk and interior audit

| Game / map | Collision representation | Spawn / recovery | Known camera-problem areas to verify on phone | Interior playable areas |
|---|---|---|---|---|
| Prop Hunt - Papa's Shop | AABB collider records with solid/climbable/walkable-top flags, raycast mesh association, shared swept movement and camera-volume ray tests | Base spawn `(5.2, 0, 11.2)` plus radial actor offsets, then shared safe-position/camera-pocket search | Shop ceiling and sloped roof, barn roof/rafters, overhead/main doors, barn passage, workbench/shelving/crates, Papa chair/fireplace and tight furniture | **Yes:** shop and attached barn are playable/searchable |
| Prop Hunt - Camper/Campsite | Same AABB/swept/camera-volume system | Base spawn `(10.6, 0, 7.8)` plus radial offsets and safe-position search | Approx. 2.43 m camper ceiling, roof, narrow doorway, bed/bunks/counter/couch/bathroom, tent and truck edges | **Yes:** camper interior is playable/searchable |
| Prop Hunt - Acreage | Same AABB/swept/camera-volume system | Base spawn `(9.2, 0, 5.6)` plus radial offsets and safe-position search | Trailer/shop/shed roofs and overhangs, deck/hot tub/pool/fences and map edges | No full authored interior system; structures are mainly generated exterior/play geometry |
| Prop Hunt - Farm | Same AABB/swept/camera-volume system | Base spawn `(6.0, 0, 7.0)` plus radial offsets and safe-position search | Coop/shed roofs, stalls, sea can, goat/crate stairs, fences and map edges | Open/generated structures and stalls, but no full authored building-interior environment |
| Island Life - Island exterior | World AABBs plus generated ground-height/terrain support, radial island boundary and navigation grid | Default exterior around `(0, ground, 16)` unless saved live/world state overrides; safe-position recovery can relocate invalid starts | Shore/terrain height changes, docks, house thresholds/roofs, stores/trees/rails, exterior furniture and island edge | Resident homes can be entered into the separate interior scene; exterior business shells are not separate authored interiors |
| Island Life - Resident home | AABB walls/furniture plus shared swept movement/support/ceiling rules | Interior entry `(0, 0, minZ + 1.2)` with bounds/recovery logic | 2.8 m ceiling, partitions, windows/entry and dense furniture. Roof/ceiling fade behavior requires phone verification | **Yes:** full playable generated resident-home interior |
| Birthday Seat - Obstacle course | AABB per route node; moving colliders update and carry riders; support/ceiling collision; checkpoint recovery | Player starts near `(-0.825, 0.29, -0.275)` before safe-position search. Falls recover to last checkpoint | Platform undersides/edges, stacked narrow steps, moving platforms, bounce section, final crown/throne and any close-camera collapse near route geometry | No building interior; open obstacle course |

### Primitive/placeholder conclusion

Every current production real-time map is true WebGL 3D space, not a flat 2D renderer. However, **all seven real-time environments are still visually constructed primarily from procedural geometry and Three.js/art-kit primitives rather than finished authored environment assets**. Papa's Shop has seven imported GLB hero props/furniture, but the map itself is still a procedural structure. This staging package intentionally does not redesign or decorate those environments because Phase E is foundation/device QA.

## 3. Expected fourth 3D game

**EXPECTED FOURTH 3D GAME: NOT FOUND**

Repository-wide `WebGLRenderer` search finds only:

1. `public/prop-hunt-3d.js` - Family Prop Hunt
2. `public/island-life.js` - Family Island Life
3. `public/birthday-climb.js` - John's Birthday Seat
4. `public/_deep3d_qa.html` - QA harness, not a game

`public/birthday-climb.js` explicitly labels John's Birthday Seat as the **REAL WEBGL FAMILY OBBY** and implements the platform/jumping/obstacle-course intent. No separate fourth platform/obby/tower/birthday-course/family-chaos WebGL game exists elsewhere in the repository.

Family Mystery remains the existing illustrated HTML/CSS board/standee game. It was not converted or reclassified as the fourth third-person game.

## 4. CDN / local bundling status

**STATUS: NOT COMPLETED IN THIS BUILD RUNNER. STAGING RISK REMAINS.**

Current real-time runtime still imports exact Three.js release `0.185.1` from jsDelivr and GLTFLoader/SkeletonUtils for the same version from esm.sh.

The architecture is compatible with local/package-managed Three.js. The blocker was environmental package retrieval, not a Three.js API incompatibility:

- `npm install --save-exact three@0.185.1` was attempted.
- The execution container cannot resolve `registry.npmjs.org`, `cdn.jsdelivr.net` or `esm.sh` through its shell/DNS path.
- An alternate controlled download path was also attempted. JavaScript downloads are blocked by that tool's content-type policy, and downloading the entire 375 MB source mirror only to extract four small modules would be disproportionate and would not prove npm/package integration.
- I therefore did **not** switch to partial/local imports that could break the staging client.
- I also did **not** change Three.js versions.

Before a final production release, run in a network-enabled source environment:

`npm install --save-exact three@0.185.1`

Then update the three game entry modules and `shared-3d-studio.mjs` to local/bundled imports for Three.js, GLTFLoader, SkeletonUtils and GLTFLoader's local addon dependency chain. Re-run all tests and phone QA after that packaging change.

## 5. Files changed / reconstructed for Phase E

Because the accepted Phase D worktree was not persisted, an exact filesystem diff "since Phase D" cannot be truthfully generated. The Phase E package contains these deliberate changes relative to the persisted v3.0.1 source baseline, including reconstitution of accepted Phase D foundation behavior:

### Shared gameplay foundation reconstructed

- `public/prop-hunt-core.mjs` - swept/sub-stepped character motion, camera-volume obstruction and line-of-sight behavior
- `public/shared-3d-gameplay.mjs` - one family body/profile contract, camera obstruction/recovery telemetry
- `public/shared-3d-studio.mjs` - authored asset pipeline, missing-asset/error reporting, no-clip authored-rig fallback support
- `public/prop-hunt-3d.js` - shared profiles, authored John/Gunner usage, safe recovery, diagnostics hooks
- `public/island-life.js` - shared profiles, authored John/Gunner usage, preserve user zoom, recovery/diagnostics hooks
- `public/birthday-climb.js` - shared profiles, authored John/Gunner usage, procedural animation if no clips, bot ceiling rule, preserve user zoom, recovery/diagnostics hooks
- `public/models/manifest.json` - only real packaged model entries; John/Gunner enabled across all three real-time games

### Phase E staging-only additions/changes

- `public/phase-e-qa.mjs` - build badge, optional diagnostic panel, FPS, asset/recovery warning channel, mobile interaction guards, zoom +/- controls
- `public/app.js` - staging version/cache registration marker
- `public/sw.js` - staging cache namespace and QA module precache
- `public/index.html`, `public/new-games.html`, `public/island-life.html` - staging/versioned static references
- `package.json` - staging version and validation/deploy commands
- `VERSION.txt` - visible staging identifier
- `wrangler.staging.jsonc` - separate Cloudflare staging Worker name with same bindings/static architecture
- `tools/phase_e_validate.mjs` - deployment-shape/static/case/model/cache validator
- `test/phase-e-staging.test.mjs` - Phase E regression coverage
- existing tests updated only where stale assertions referenced the old cache/version or old collision semantics
- `PHASE_E_STAGING_REPORT.md`, `DEVICE_QA_ISSUE_TEMPLATE.md`, `PHASE_E_CHANGED_FILES.txt`, `START_HERE.txt`, `BUILD_MANIFEST.txt`, `FINAL_TEST_REPORT.txt` - staging handoff documentation

## 6. Staging build/version

Visible build identifier: **3D-STAGING-PHASE-E-01**

Service-worker cache namespace: `black-family-game-night-3d-staging-phase-e-01`

The identifier is displayed unobtrusively in each real-time game. The diagnostics toggle remains available even when `qa3d=1` is not in the URL.

## 7. Build / automated validation result

`npm run check`: **214 / 214 tests PASS**

`npm run build`: **PASS as repository staging/static production-shape validation**

Phase E validator: **108 PASS, 2 WARNINGS, 0 FAILURES**

Validated:

- static output directory `public/` exists
- expected HTML entries exist
- all required JS/ESM entry modules exist and parse
- 10 packaged GLBs exist and have valid `glTF` headers
- 199 packaged image/texture files are present
- manifest paths and literal local asset references match exact case
- no required static asset uses a local filesystem-only path
- Worker static-assets directory/binding and SPA fallback are configured
- production and staging Durable Object bindings are present
- staging cache/version markers are consistent

Architecture note: this repository serves native browser ESM from `public/`; it does not currently have a separate Rollup/Vite-style `dist` bundle. Therefore there is no monolithic "bundled JavaScript" output to validate. That is also why the remaining external Three.js module imports are explicitly reported rather than hidden.

## 8. Cloudflare staging validation status

Static/config validation: **PASS**

Local static HTTP smoke test: **PASS** for `/`, `/new-games.html`, `/island-life.html`, `phase-e-qa.mjs`, and every manifest GLB with `glTF` magic.

Actual Wrangler dry-run/deployment: **UNVERIFIED**

Reason: `node_modules/.bin/wrangler` is not present and package retrieval is blocked by the current execution container's DNS/network path. No claim is made that parsing the configuration proves a Cloudflare deployment.

Staging config uses:

- Worker: `black-family-game-night-phase-e-staging`
- main: `worker.mjs`
- static directory: `./public`
- binding: `ASSETS`
- SPA fallback: `single-page-application`
- Durable Objects: `GameHub`, `PropHuntRoom`, `IslandLifeRoom`

Cloudflare MIME/edge serving of GLBs and actual SPA fallback behavior remain part of deployment smoke QA.

## 9. Remaining UNVERIFIED items

The following are explicitly **UNVERIFIED** until the real phone test:

- WebGL renderer success on the target phone/GPU/browser
- actual John/Gunner GLB loading from the deployed origin
- visual likeness/recognizability of John and Gunner
- all other family members' real avatars, because those assets are actually missing
- natural-looking procedural walk/run/turn/jump/fall/land animation
- feet-to-ground/movement visual match
- initial camera composition in every tested map
- orbit/look comfort and full pitch range
- pinch and +/- zoom feel
- roof/awning/wall/furniture camera obstruction on a real device
- Reset View touch usability and automatic recovery feel
- joystick/action/control layout on the target screen size
- jump/run/landing feel and collision feel
- sustained FPS/frame-time/memory behavior
- map visual quality and whether procedural art is acceptable
- deployed Cloudflare GLB MIME/path behavior
- real Cloudflare Worker/Durable Object deployment
- CDN-free Three.js packaging, because it could not be completed in this runner

## 10. Exact staging deployment and phone-test instructions

There is **no live test URL from this build runner** because Cloudflare deployment could not be executed here.

On a machine with normal npm/Cloudflare connectivity:

1. Extract the Phase E staging ZIP.
2. From the extracted project directory run `npm install` to install the pinned Wrangler dev dependency.
3. Run `npm run check` and confirm 214/214 tests pass.
4. Run `npm run build` and confirm the Phase E validator has 0 failures.
5. Run `npm run deploy:staging`.
6. Use the `workers.dev` or staging-domain URL printed by Wrangler. Do **not** deploy over the production Worker for this phone test.
7. On the phone, open the new staging URL in a fresh/reopened tab and confirm the on-screen badge reads exactly **3D-STAGING-PHASE-E-01**. If it does not, stop testing because the wrong/cache-stale build is loaded.
8. QA-mode URLs after deployment are:
   - Prop Hunt: `<STAGING_BASE>/new-games.html?game=prophunt&qa3d=1`
   - Island Life: `<STAGING_BASE>/island-life.html?qa3d=1`
   - Birthday Seat: `<STAGING_BASE>/new-games.html?game=birthday&qa3d=1`
9. The QA toggle can close the diagnostics panel at any time. The visible build badge remains.
10. Run the requested device sequence in order: A Initial Spawn, B Movement, C Camera, D Recovery, E Visual Quality.

### Important CDN caveat for this staging package

Because exact local Three.js vendoring was blocked in this runner, the staging URL currently requires access to the existing Three.js/addon CDNs. If a phone cannot reach those CDNs, that is a **staging dependency failure**, not proof that the game/map itself failed.

## Device feedback repair rule

For every screenshot/video/device problem, record and repair only the narrow failure using the fields in `DEVICE_QA_ISSUE_TEMPLATE.md`. Do not rewrite a working shared system after one observation.
