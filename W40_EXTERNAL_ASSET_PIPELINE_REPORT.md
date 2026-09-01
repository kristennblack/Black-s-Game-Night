# W40 External Asset Pipeline Proof - Implementation Report

Candidate: `GAME-NIGHT-STAGING-CANDIDATE-W40-EXTERNAL-ASSET-PIPELINE-59`
Official release marker intentionally remains W30 pending real-device visual approval.

## Problem proven by actual gameplay
The user-provided Prop Hunt screenshot was saved as `visual_proofs/W40_ACTUAL_PROP_HUNT_FAILURE_BASELINE.png`. It shows the central production failure clearly: a steep camera, procedural/block-like visible art, weak surface definition and insufficient depth. The W40 response is a pipeline change, not another claim that the current fallback art is finished.

## Implemented
- W40 external asset manifest with separate candidate/fallback/qaReady/approved states.
- Exact incoming filenames for approved John, Papa's Shop hero bay and hero prop set.
- Runtime truth overlay for Prop Hunt showing exact build, renderer, character source/approval, world source, external candidate state, HDRI state, camera, scene geometry and PBR texture coverage.
- W40 cabin runtime truth showing WebGL versus static fallback and production/design/legacy furniture counts.
- W40 professional Prop Hunt camera override: closer, shoulder-level and near-level starting pitch while retaining existing collision/recovery architecture.
- Fail-safe image-based environment lighting hook using the Poly Haven Small Workshop benchmark when network access permits.
- External asset promotion gate: candidate GLBs are not even attempted until `qaReady:true`; failed/rejected candidates leave the proven fallback visible.
- Real WebGL `/w40-production-proof.html` drop-in bench for local John/shop/prop GLBs, with scale/mesh/triangle/material/texture/skin/bone/animation inspection and simple character clip playback.
- Dependency-free CLI GLB auditor: `node tools/w40_audit_external_glb.mjs <file.glb>`.
- External handoff, Meshy prompt pack, Blender export, character/animation and glTF optimization checklists.
- W40 cache busting on Prop Hunt and Cabin entrypoints.
- W40 modules/proof/manifest added to service-worker shell without falsely changing the official W30 release cache marker.
- W40 master directive and complete merged production master.

## Current fallback asset audit
The new auditor confirms why the current scene cannot match the approved target yet:
- John legacy skinned GLB: 58,720 triangles, 17 joints, 19 clips, 3 base-color textures, zero normal/roughness-metallic/AO maps.
- Papa's Shop + barn fallback GLB: 16,524 triangles, 926 meshes, 79 materials, zero textures/images and zero PBR maps.
- Papa's Shop hero-prop fallback set: 16,716 triangles, 171 meshes, 22 materials, zero textures/images and zero PBR maps.

Those files remain useful fallbacks but are not falsely described as finished production visuals.

## Automated verification
- W40 focused tests: 8/8 PASS.
- Full project tests: 647/647 PASS.
- `npm run check`: PASS, including 647/647 tests.
- staging validator: 4,314 PASS, 2 WARN, 0 FAIL.
- production 3D asset audit: PASS.

Known infrastructure warnings:
1. Core Three.js/addon modules still use CDN imports.
2. Wrangler is unavailable here, so actual Cloudflare deployment is unverified.

## Visual proof boundary
A local Chromium proof attempt was made and the sandbox GPU process could not initialize the required GL implementation, so this environment still cannot be used as the final visual approval source. A real staging/phone screenshot with W40 runtime truth is required. External Meshy/Blender/Reallusion services are not connected to this workspace, so W40 prepares and validates their output but does not pretend to have generated finished external GLBs here.

## Next production action
Create/obtain the three incoming candidate GLBs, audit them on `/w40-production-proof.html` and with the CLI tool, then set only the technically ready slot(s) to `qaReady:true`. Prop Hunt will promote them while preserving W36 fallbacks on any failure. John still requires separate likeness approval.
