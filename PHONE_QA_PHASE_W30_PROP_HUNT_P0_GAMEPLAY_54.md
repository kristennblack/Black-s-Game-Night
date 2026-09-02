# PHONE + DESKTOP QA — W30 PROP HUNT P0 GAMEPLAY 54

Build: `GAME-NIGHT-STAGING-PHASE-W30-PROP-HUNT-P0-GAMEPLAY-54`

## Gate rule
Automated tests are Gate 1 only. This checklist is Gate 2. Any visibly poor or unreliable control, animation, collision, camera, aiming, prop, or frame-pacing behavior keeps the build out of release approval.

## Recommended QA launch
For a deterministic local/served QA route, use the Prop Hunt page with:

`new-games.html?game=prophunt&qa3d=1&autostart=1&qaRole=hider&test=1`

and

`new-games.html?game=prophunt&qa3d=1&autostart=1&qaRole=hunter&test=1`

The `autostart` and `qaRole` behavior is active only when `qa3d=1`.

## A. Mobile input lifecycle
- [ ] Forward joystick moves the character forward relative to the camera.
- [ ] Release joystick: character stops immediately and never keeps walking.
- [ ] Drag right side to look, release: camera stops immediately.
- [ ] Interrupt a drag with another finger: neither control gets stuck.
- [ ] Hold Sprint, release: Sprint turns off immediately.
- [ ] Hold Aim, release: Aim turns off immediately.
- [ ] Hold Shoot, release: firing stops immediately.
- [ ] Press/release Jump repeatedly: Jump never sticks.
- [ ] Put browser in background during movement/Aim/Sprint/Shoot, return: all held actions are cleared.
- [ ] Switch tabs during a touch gesture and return: controls remain responsive.
- [ ] Use two fingers simultaneously for movement + camera/action without one disabling the other.

## B. Movement feel
- [ ] Light stick input produces a walk.
- [ ] Medium stick input produces a jog.
- [ ] Full stick input produces a run.
- [ ] Hold Sprint at full input produces a faster run.
- [ ] Diagonal movement is not faster than straight movement.
- [ ] Stop abruptly from Sprint: control response is immediate, animation settles naturally.
- [ ] Repeated left/right changes feel responsive without robotic body snaps.
- [ ] Near-180-degree redirect visibly plants/turns without locking player control.
- [ ] Circle-strafe/move around clutter without sliding sideways unexpectedly.

## C. Animation
- [ ] Idle is alive and does not freeze or restart every few frames.
- [ ] Walk/jog/run/sprint visibly match actual travel speed.
- [ ] No obvious foot skating during straight movement.
- [ ] No obvious foot skating during sharp turns.
- [ ] Jump anticipation is short and does not delay the jump.
- [ ] Rise/fall/landing transition without T-pose or popping.
- [ ] Aim while moving: lower body continues locomotion while upper body aims.
- [ ] Fire while moving: recoil does not interrupt locomotion control.
- [ ] Missing/failing animation never freezes controls.

## D. Collision and grounding
- [ ] Stand near floor/ledge edges without grounded/airborne flicker.
- [ ] Walk up normal slopes without hovering or sinking.
- [ ] Move down slopes without repeated bouncing.
- [ ] Run through doorways without vibrating or sticking.
- [ ] Hug walls and slide along them without penetration.
- [ ] Navigate between ordinary clutter without becoming trapped.
- [ ] Jump near walls/ceilings without embedding in geometry.
- [ ] If penetrated, recovery is smooth and does not require Reset View.
- [ ] No physics launch from small props.

## E. Mantling
- [ ] Approach a valid low obstacle and mantle automatically.
- [ ] Mantle completes quickly and control resumes immediately.
- [ ] Try a surface with inadequate top clearance: mantle is denied.
- [ ] Try under a low ceiling: mantle is denied.
- [ ] Never mantle through walls/shelves or onto nonexistent floors.

## F. Camera
- [ ] Whole character normally remains visible.
- [ ] Camera stays behind movement during normal travel without fighting player look input.
- [ ] Drag camera repeatedly against walls and roof edges.
- [ ] Camera shortens smoothly instead of passing through solid geometry.
- [ ] When obstruction clears, camera returns smoothly.
- [ ] Enter tight rooms without top-down collapse.
- [ ] Camera never collapses into avatar.
- [ ] Camera never flips pitch or jumps above roofs/buildings.
- [ ] Pinch zoom works and preserves legal camera distance.
- [ ] Several minutes of play without needing Reset View.

## G. Hunter controls
- [ ] During hide countdown, hunter view is protected and movement/look/weapon input remains locked.
- [ ] At hunt release, controls unlock exactly once and work immediately.
- [ ] Aim is an explicit hold action.
- [ ] Aim transitions smoothly toward over-the-shoulder camera.
- [ ] Shoot works while aiming.
- [ ] Mild hip-fire works without Aim.
- [ ] Touch camera drag does not accidentally fire.
- [ ] Hold Shoot fires at a controlled maximum rate, not absurd spam.
- [ ] Weapon points toward crosshair.
- [ ] Mild touch aim assistance helps but never snaps aggressively between targets.
- [ ] Hit marker/audio/impact response appears on successful hider hit.

## H. Hider prop behavior
- [ ] Transform into each of the four offered props.
- [ ] Transformation is quick and never teleports the player a large distance just to fit.
- [ ] Try transforming in an unsafe tight gap: transformation is denied cleanly.
- [ ] Very small prop retains a useful gameplay camera.
- [ ] Large prop collider remains stable.
- [ ] LOCK immediately stops tiny drift.
- [ ] Intentional joystick movement immediately unlocks the prop.
- [ ] Tiny joystick noise does not unintentionally unlock.
- [ ] ALIGN rotates toward a nearby matching environmental prop without teleporting.
- [ ] Decoy placement rejects unsafe spots and never overlaps walls badly.
- [ ] Flash strongly impairs hunter briefly, then recovers quickly.

## I. Continuous stability
Play continuously for at least 5 minutes on each target device.
- [ ] No stuck movement.
- [ ] No stuck joystick.
- [ ] No stuck Aim/Sprint/Jump/Shoot.
- [ ] No camera collapse.
- [ ] No NaN/Infinity visible behavior.
- [ ] No character jitter.
- [ ] No unexpected teleport.
- [ ] No T-pose/rest-pose flash.
- [ ] No severe frame-pacing spikes during ordinary movement/combat.
- [ ] Gameplay remains responsive if frame rate falls toward ~30 FPS.

## J. Required evidence
Record for each device:
- Device/browser
- Hider test: PASS / FAIL
- Hunter test: PASS / FAIL
- Approximate FPS / obvious hitching
- Screenshots from running gameplay
- Any video clip showing a movement/camera/animation defect
- Exact repro steps for every failure

## Gate result
- [ ] MOBILE PASS
- [ ] DESKTOP PASS
- [ ] P0 DEVICE GATE APPROVED

Do not check the final box unless both device classes pass the hands-on test.
