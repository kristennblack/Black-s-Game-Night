# Black Family Game Night
## W35 True Production Visual Slice Report

Candidate: `GAME-NIGHT-STAGING-CANDIDATE-W35-TRUE-PRODUCTION-VISUAL-SLICE-56`
Status: Technical candidate only. Real-device visual approval is still required.

## What W35 changes

W35 changes the flagship Papa's Shop path from procedural visible art to a professional separation between gameplay geometry and visible authored art.

### Visible world
- Papa's Shop now loads `/models/environments/papa-shop-barn-production.glb` as the primary visible environment.
- The authored production prop set `/models/sets/papa-shop-production-props.glb` is loaded into the same gameplay scene.
- The large Phase V primitive-built world remains available only through the explicit `legacyPapa=1` diagnostic flag.

### Gameplay collision
- Simple JavaScript geometry remains for invisible floor and property-boundary collision only.
- Procedural disguise/collision props are hidden from final presentation.
- Building wall collision is extracted from authored shop/barn wall meshes after the GLB loads.
- The W35 authored environment currently exposes 29 named shop/barn wall collision candidates.

### Materials
- W35 adds authored material classification for concrete, gravel, dirt, wood, rubber, glass, painted metal, bare metal and fabric.
- Existing authored colors are preserved while roughness, metalness, environment response and restrained micro-surface variation are tuned by material class.
- This is a runtime material recovery layer. It does not falsely claim that the existing environment has a complete externally authored PBR texture set.

### Lighting
- W35 adds a dedicated production-lighting group for Papa's Shop with directional key light, doorway light, warm work lights, barn fill and fireplace contribution.
- Existing ACES Filmic tone mapping, sRGB rendering, soft shadows and adaptive-resolution behavior remain active.

### John animation development proxy
- The approved-character gate remains intact.
- The unapproved John skinned GLB is not silently promoted into normal gameplay.
- In QA mode only, `w35ProxyJohn=1` can load the skinned 19-clip John rig for animation-development testing.
- The runtime visibly labels this mode `ANIMATION PROXY - JOHN LIKENESS NOT YET APPROVED`.

## Technical validation

### Full regression
- 621 / 621 PASS
- 0 FAIL

### Staging validation
- 4,305 PASS
- 2 WARN
- 0 FAIL

Known staging warnings:
1. Several 3D modules still use external Three.js/addon CDN dependencies.
2. Wrangler/Cloudflare deployment is unavailable in this execution environment.

### JavaScript/source check
- PASS
- Includes the full 621-test suite.

### Production asset audit
- PASS after updating the stale John face-material expectation from the retired `John_FacePhoto` name to the W27-approved `John_ApprovedStylizedFace` material.

Key asset figures:
- John: 3,071.1 KiB, 73 nodes, 58,720 triangles, 1 skin, 19 clips, 3 embedded images.
- Papa shop + barn: 410.8 KiB, 927 nodes, 16,524 triangles, 79 materials.
- Papa production prop set: 193.7 KiB, 172 nodes, 16,716 triangles, 22 materials.

### Static runtime smoke
All returned HTTP 200 from a local clean server:
- `/`
- `/new-games.html`
- `/prop-hunt-3d.js`
- `/w35-production-visuals.mjs`
- `/shared-3d-gameplay.mjs`
- `/shared-3d-studio.mjs`
- `/models/manifest.json`
- `/models/environments/papa-shop-barn-production.glb`
- `/models/sets/papa-shop-production-props.glb`
- `/models/characters/john-production-skinned.glb`

## Browser proof attempt

A real W35 Chromium/WebGL screenshot was attempted from the actual candidate using:
- Papa's Shop
- Hunter QA role
- W35 skinned John development proxy
- automated solo start

Chromium could not initialize ANGLE/EGL in this container and repeatedly returned `EGL_NOT_INITIALIZED`. Therefore no W35 gameplay screenshot is claimed as proof from this environment.

This is an environment limitation, not a visual PASS.

## Release decision

W35 is a test candidate, not an approved release.

The next valid gate is a real phone/browser run. The candidate passes only if the actual rendered game visibly shows:
- authored Papa's Shop instead of primitive room geometry,
- authored tractor/prop-set presentation,
- correct wall/camera collision,
- stable frame pacing,
- improved directional animation and aiming,
- no stale W30/W33 asset cache,
- no generated image substituted for live proof.
