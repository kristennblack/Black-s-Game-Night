# Black Family Game Night
## W34 Prop Hunt Production Animation-Feel Candidate Report

Candidate: `GAME-NIGHT-STAGING-CANDIDATE-W34-PROP-HUNT-ANIMATION-FEEL-55`
Base release: `GAME-NIGHT-STAGING-PHASE-W30-PROP-HUNT-P0-GAMEPLAY-54`
Shared animation revision: `W34.1` (shared gameplay API remains `2.0.0`)
Status: **TECHNICAL CANDIDATE PASS / REAL-PHONE VISUAL GATE PENDING**

## Goal
Move the actual Prop Hunt character presentation toward the approved polished third-person target without falsely approving an unfinished John GLB and without rewriting the W30 controller that already passed technical regression.

## Root causes fixed

1. The procedural family rig only treated `walk` and `run` as moving locomotion states. `jog`, `sprint`, `backward`, `strafeLeft`, `strafeRight`, `startMove`, and `stopMove` could therefore visually collapse toward idle/stiff presentation even while gameplay velocity was correct.
2. Prop Hunt calculated motion telemetry before presentation, then the procedural animator calculated it again. That advanced stride/landing state twice per visual frame and could contribute to poor gait timing, foot mismatch, and landing jitter.
3. Procedural turns lacked a strong planted-body interpretation of the existing W30 turn semantics.
4. Aiming had the correct two-hand pose but the procedural lower body did not fully inherit directional strafe/backpedal semantics while aiming.
5. Hard land lowered the body but did not provide enough visible knee bracing/weight recovery.

## W34 implementation

### Distinct locomotion profiles
Added separate procedural motion profiles for:
- walk
- jog
- run
- sprint
- backward
- strafe left
- strafe right
- start move
- stop move

Profiles now differ in stride amount, reference speed, body lean, arm drive, knee drive, and vertical body motion.

### Single authoritative motion telemetry pass
`updateActorVisuals()` now calculates telemetry once and passes the same object into `animateFamilyRig()`.

The procedural animator only calculates telemetry internally when another game/caller does not provide it. This preserves backward compatibility while removing Prop Hunt's double advancement.

### Planted turning
Existing W30 turn semantics now drive procedural:
- foot counter-planting
- hip turn
- chest counter-rotation
- slight knee brace
- arm counterbalance
- head lead/follow

Sharp and 180-degree changes therefore have a planted body response instead of only yaw damping.

### Directional locomotion while aiming
When the Hunter is aiming, forward gait can now resolve visually into:
- forward gait
- backpedal
- strafe left
- strafe right

The upper body continues using the two-hand prop-zapper stance while the lower body follows the directional locomotion state.

### Start / stop weight
The W30 start/stop transition signals are now consumed by the procedural rig rather than being useful only to authored clip rigs.

### Jump / landing support
The existing air-state logic is preserved. W34 strengthens hard-land recovery with deeper hip drop and knee brace while retaining controller authority.

### Cache-busted animation code path
The candidate uses a W34 query version for `prop-hunt-3d.js` and the shared gameplay module so a staging browser is less likely to reuse a stale animation script.

## Identity / approval gate preserved
The existing John model approval block remains intact.

W34 does **not** change `john-production-skinned.glb` to approved and does not claim that candidate GLB is the final approved John. The currently approved-fallback character remains the safe default until a production model genuinely passes the approved visual identity gate.

This is intentional. Animation quality and character-identity approval are separate gates.

## Automated results
- W34 animation-specific tests: **8 / 8 PASS**
- Full source regression suite: **617 / 617 PASS**
- `npm run check`: **PASS**
- staging validator: **4,304 PASS / 2 WARN / 0 FAIL**

Known staging warnings retained from the base build:
1. Several real-time 3D modules still use Three.js/addon CDN dependencies.
2. Actual Cloudflare/Wrangler deployment cannot be verified in this execution environment.

## What is NOT claimed yet
This report does not claim:
- real-phone visual approval
- zero visible foot slide on device
- final approved John model fidelity
- perfect animation-to-approved-picture equivalence
- Cloudflare deployment verification
- final FPS/frame-pacing approval

Those require the candidate to be run in the actual browser/device.

## Real-device acceptance target
The candidate should not become `CURRENT_RELEASE` unless the following are visibly good on the phone:
1. idle feels alive, not frozen
2. walk has clean foot cadence
3. jog is visibly distinct from walk/run
4. run feels weighted rather than puppet-like
5. sprint has longer stride and stronger lean without skating
6. starts do not snap into full gait
7. stops settle weight instead of freezing
8. 90-degree turns are smooth
9. 180-degree turns visibly plant and redirect
10. aim + forward movement stays stable
11. aim + backpedal looks intentional
12. aim + strafe left/right keeps weapon grip stable
13. jump reads as an actual airborne state
14. landing compresses and recovers
15. repeated movement does not create jitter or drift
16. camera remains calm through rapid direction changes

## Decision
**W34 is ready for staging/device animation QA, not release approval.**
