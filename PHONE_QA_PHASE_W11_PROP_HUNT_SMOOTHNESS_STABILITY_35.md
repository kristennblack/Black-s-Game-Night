# PHONE QA — PHASE W.11 PROP HUNT SMOOTHNESS + STABILITY 35

Use on a real phone. Automated tests do not complete this checklist.

## Device/build
- Device:
- OS/browser:
- Build: GAME-NIGHT-STAGING-PHASE-W11-PROP-HUNT-SMOOTHNESS-STABILITY-35
- Map: Papa's Shop
- Character: Approved John
- Network: Solo / family multiplayer

## Frame pacing
- [ ] Normal yard movement feels continuous with no regular hitch.
- [ ] Shop/barn entry does not create a large repeated frame spike.
- [ ] Rapid fire does not create a rhythmic garbage-collection hitch.
- [ ] Ten decoys can exist without obvious collapse in responsiveness.
- [ ] p95 frame time is recorded from QA overlay.
- [ ] Recent peak frame time is recorded.
- [ ] Minimum device does not sustain >33.3 ms frames during ordinary play.
- [ ] Target device strives for p95 ~22–25 ms or better.

## Controller
- [ ] Partial joystick input walks; full input runs/sprints as designed.
- [ ] Move + camera look simultaneously.
- [ ] Move + look + jump simultaneously.
- [ ] Move + look + shoot simultaneously.
- [ ] Releasing movement stops without long drift.
- [ ] Diagonal movement is not faster than straight movement.
- [ ] Small thresholds do not pin the player.
- [ ] Wall contact slides rather than glues.
- [ ] Coyote jump works at a ledge.
- [ ] Buffered jump works just before landing.
- [ ] Variable jump height is perceptible and controllable.
- [ ] Valid tractor/workbench mantle succeeds.
- [ ] Invalid mantle fails without trapping the player.

## Camera
- [ ] Doorframe edges do not pump camera rapidly in/out.
- [ ] Camera ignores tiny/non-camera-blocking decoration.
- [ ] Camera retracts before clipping into real walls.
- [ ] Camera expands smoothly after obstruction clears.
- [ ] Camera never collapses into persistent top-down/inside-head view.
- [ ] Shoulder swap remains stable near walls.
- [ ] Reset View recovers safely.
- [ ] A camera problem does not unnecessarily teleport a valid player.

## Recovery
- [ ] Deliberate geometry stress does not leave the player permanently embedded.
- [ ] Last-known-safe recovery returns to a nearby believable point if forced.
- [ ] Falling outside valid world height recovers.
- [ ] Recovery clears bad velocity.
- [ ] Recovery does not loop repeatedly after one correction.

## Prop transformations
- [ ] Valid disguise works beside normal open space.
- [ ] Unsafe disguise near tight geometry is refused or shifted safely.
- [ ] Failed disguise does not consume the change.
- [ ] All three disguise changes remain usable.
- [ ] Decoy finds a safe nearby point.
- [ ] Failed decoy placement does not consume a decoy.
- [ ] All ten decoys remain lightweight/readable.

## Shooting/effects
- [ ] Zapper remains visible.
- [ ] Crosshair, intended shot, tracer and impact align.
- [ ] Muzzle against wall correctly hits the wall.
- [ ] Repeated shots do not steadily degrade frame pacing.
- [ ] Low quality tier reduces effects before controls become unusable.

## Browser lifecycle
- [ ] Background app/tab for 10–30 sec, return, and player does not launch/teleport.
- [ ] Held shoot/jump does not remain stuck after resume.
- [ ] Camera remains recoverable after resume.
- [ ] If WebGL context loss can be simulated, restore returns to safe view.

## Verdict
- [ ] PASS W.11 phone stability gate
- [ ] FAIL — attach screenshot/video and QA overlay values

Notes:
