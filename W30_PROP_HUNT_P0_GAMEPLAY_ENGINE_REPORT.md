# W30 Prop Hunt P0 Gameplay Engine Rebuild Report

Release: `GAME-NIGHT-STAGING-PHASE-W30-PROP-HUNT-P0-GAMEPLAY-54`
Package version: `3.27.0-staging-phase-w30-prop-hunt-p0-gameplay-54`
Base: Build 53 / W29 Family V1 Candidates

## Status

**Gate 1 — Technical / automated: PASS**

**Gate 2 — hands-on mobile + desktop gameplay: PENDING**

This build is not release-approved until Gate 2 passes. The execution environment used for this rebuild cannot initialize Chromium WebGL/EGL, so an honest running-WebGL screenshot or real-device hands-on pass could not be produced here.

## Audit: root causes found

1. Mobile forward input was inverted twice: the shared joystick already returned forward-positive Z and Prop Hunt negated it again before movement.
2. Sprint used toggle-style behavior and was not reliably cleared by all pointer/window lifecycle events.
3. Pointer look and joystick handling did not completely handle lost pointer capture, browser blur, visibility changes, and interrupted touches.
4. Hunter aiming was effectively hard-wired to the hunter role rather than controlled by an explicit Aim state.
5. Stage pointer behavior could let touch camera interaction enter shooting paths.
6. Locomotion had coarse speed behavior rather than a clean walk/jog/run/sprint continuum driven by actual input strength.
7. Character turns only damped yaw; sharp and near-180 redirects lacked meaningful turn semantics.
8. Ground support used a fragile/simple support query rather than a footprint/multi-probe solution.
9. Mantling did not adequately validate top space, overhead clearance, and destination fit before committing.
10. Hider Lock did not reliably release on intentional movement and there was no Align action.
11. Disguise placement could search too far from the original position, making a safe-fit correction feel like a teleport.
12. Finite-value recovery existed late in the frame path but needed stronger pre-simulation safeguards.

## P0 implementation

### 1. Input and controls
- Removed the Prop Hunt-specific joystick Z re-inversion.
- Added lifecycle-safe `bindHoldButton` handling.
- Jump, Sprint, Aim and Shoot are hold controls.
- Added pointerup, pointercancel, lostpointercapture, blur and hidden-tab cleanup.
- Clearing input now also clears gamepad-held states and joystick state.
- Touch camera gestures cannot become mouse-fire events.
- Hunter hide-phase gating disables movement/look/actions rather than merely hiding UI.
- Added QA-only deterministic autostart/role hooks for future device/browser reproduction.

### 2. Character movement
- Added input-strength-based walk, jog, run and Sprint tiers.
- Kept movement controller-authoritative.
- Added smoothed velocity using already-scaled target speed exactly once.
- Added semantic normal/sharp/180 turn classification while preserving immediate control response.

### 3. Animation
- Added jog/sharp-turn/180 semantic aliases/fallbacks to the shared studio animation layer.
- Locomotion animation now follows measured gait/velocity rather than only arbitrary timers.
- Explicit Aim state is propagated into presentation instead of forcing all hunters into aim.
- Existing authored animation fallback/watchdog behavior is preserved.
- Visual foot-placement and animation quality remain part of Gate 2 because automated tests cannot prove skating/popping quality.

### 4. Collision and physics stability
- Added 9-point ground support probing.
- Added validated mantle target solving with overhead/top/destination checks.
- Added pre-simulation finite kinematics sanitation/recovery.
- Existing sub-stepped/fixed simulation and safe-position recovery remain active.

### 5. Camera
- Existing multi-candidate obstruction-aware third-person camera remains in place.
- Added/retained finite-value validation and safe reset behavior.
- Camera and movement/look are fully gated during protected hunter hide.
- Aim shoulder presentation is now driven by explicit Aim.

### 6. Aiming and shooting
- Added visible Aim control for hunters.
- Aim is hold-based; Shoot remains hold-based with a capped 4.8 shots/sec interval.
- Mild hip-fire is retained.
- Touch camera input is separated from firing.
- Mild aim-assist cone remains intentionally restrained.

### 7. Prop movement/transformation
- Lock ignores tiny noise but immediately releases on intentional movement.
- Added Align to copy orientation from a nearby matching environmental prop without teleporting.
- Disguise safe-fit search is limited to ~0.22 m and rejects corrections over ~0.24 m.
- Decoy grounding now uses robust support logic.
- Flash strong impairment/recovery timing is ~1.45 s.

### 8. Performance/frame pacing
- Existing fixed-step/sub-stepped gameplay loop remains the authority.
- Renderer/game performance monitor remains active.
- The new input/movement logic avoids adding physics work proportional to frame rate.
- Real phone FPS remains a Gate 2 measurement.

## Automated validation

Source/full regression suite:
- **609 / 609 PASS**
- **0 FAIL**

Staging validation:
- **4,304 PASS**
- **2 WARN**
- **0 FAIL**

Warnings:
1. Existing core Three.js/addon CDN dependencies remain in several 3D modules.
2. Wrangler executable is unavailable in this environment, so actual Cloudflare deployment is unverified.

## Running-browser proof attempt

A QA-only autostart path was added so Prop Hunt can launch directly into deterministic Hider/Hunter solo sessions for testing.

Chromium was then launched against a locally served build with WebGL/SwiftShader options. Chromium could not initialize EGL/ANGLE in this container and timed out before a valid gameplay frame could be captured. This is recorded as an environment limitation, not a passing visual test.

## Known/Pending defects and gates

The following are **not claimed as passed yet**:
- real phone input feel
- real desktop input feel
- visible foot sliding / turn quality
- camera feel inside every tight room and doorway
- repeated jump/mantle behavior during hands-on play
- hunter Aim/Shoot feel and crosshair alignment on device
- small/large prop transform/camera behavior on device
- Lock/Align/Decoy/Flash feel on device
- sustained 30/60 FPS frame pacing
- dog quadruped movement quality during actual gameplay
- several continuous minutes without needing Reset View

## Release decision

Do not advance Prop Hunt to additional content or release approval yet.

Next required action: run `PHONE_QA_PHASE_W30_PROP_HUNT_P0_GAMEPLAY_54.md` on at least one phone and one desktop. Any issue from that checklist returns to P0 engineering with root-cause repair before visual/content expansion.

## Final exact-package verification

The finished Build 54 ZIP was integrity-tested, extracted into a new clean directory, and tested from that extraction.

Cold-ZIP results:
- `npm test`: **609 / 609 PASS**, 0 fail
- `npm run check`: **PASS**
- `npm run staging:validate`: **4,304 PASS**, 2 warning, 0 fail
- ZIP integrity: **PASS**, no compressed-data errors

Cold static runtime smoke:
- `/`: HTTP 200
- `/new-games.html`: HTTP 200
- `/prop-hunt-3d.js`: HTTP 200
- `/prop-hunt-core.mjs`: HTTP 200
- `/shared-3d-gameplay.mjs`: HTTP 200
- `/shared-3d-studio.mjs`: HTTP 200
- `/prop-hunt-3d.css`: HTTP 200
- W30 runtime ID present: PASS
- explicit Aim UI present: PASS
- QA deterministic autostart hook present: PASS

A WebGL screenshot was also attempted from the exact cold extraction. Chromium failed EGL/ANGLE initialization (`EGL_NOT_INITIALIZED`) and timed out, so no valid gameplay screenshot was generated. This is why Gate 2 remains pending rather than being inferred from technical success.
