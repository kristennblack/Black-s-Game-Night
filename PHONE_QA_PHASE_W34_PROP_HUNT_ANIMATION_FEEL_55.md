# Black Family Game Night
## W34 Prop Hunt Animation Feel - Phone QA Gate

Candidate: `GAME-NIGHT-STAGING-CANDIDATE-W34-PROP-HUNT-ANIMATION-FEEL-55`
Map: **Papa's Shop**
Benchmark character: **John**
Status before test: **NOT RELEASE APPROVED**

## Fast QA entry
After the candidate is deployed to the staging origin, use:

### Immediate locomotion / hider test
`/new-games.html?game=prophunt&qa3d=1&autostart=1&qaRole=hider&map=papa`

### Hunter aim / fire test
`/new-games.html?game=prophunt&qa3d=1&autostart=1&qaRole=hunter&map=papa`

The Hunter remains protected/frozen during the normal hide countdown. Do not score Hunter movement until the hunt begins.

## A. First 30 seconds - basic feel
- [ ] character appears in a valid grounded position
- [ ] idle has subtle life and does not vibrate
- [ ] joystick forward moves the character forward
- [ ] camera-relative movement feels correct
- [ ] character does not slide while standing still
- [ ] camera does not collapse into the body

## B. Gait ladder
Using gradually increasing joystick pressure:
- [ ] slow walk is readable
- [ ] jog is visibly distinct from walk
- [ ] run is visibly distinct from jog
- [ ] sprint is visibly distinct from run
- [ ] gait changes blend rather than snap
- [ ] foot cadence approximately matches travel speed
- [ ] no obvious moonwalking / skating

## C. Start / stop
Repeat 10 times:
1. stand still
2. move forward quickly
3. release the joystick completely

Pass only if:
- [ ] movement response is immediate
- [ ] the first step does not pop
- [ ] the body leans/commits into motion
- [ ] stopping shows weight recovery
- [ ] character does not continue drifting after input release

## D. Turning
Perform:
- [ ] gentle left arc
- [ ] gentle right arc
- [ ] sharp left redirect
- [ ] sharp right redirect
- [ ] 180-degree left reversal
- [ ] 180-degree right reversal

Watch feet, hips, chest and camera.

Pass only if:
- [ ] feet visibly plant during sharp redirects
- [ ] hips begin the redirect
- [ ] upper body counter-rotates naturally
- [ ] no instant mannequin spin
- [ ] no large foot skating through the turn
- [ ] camera remains stable

## E. Hunter directional aim
When the hunt is active, hold AIM and test:
- [ ] forward movement
- [ ] backpedal
- [ ] strafe left
- [ ] strafe right
- [ ] diagonal forward-left
- [ ] diagonal forward-right
- [ ] transition from forward to backpedal while aiming

Pass only if:
- [ ] weapon remains in both hands
- [ ] upper body keeps a believable aiming stance
- [ ] lower body changes direction independently
- [ ] arms do not detach/twist
- [ ] weapon does not wobble wildly
- [ ] character does not snap between forward and strafe poses

## F. Fire while moving
Test:
- [ ] fire standing still
- [ ] fire while walking
- [ ] fire while strafing
- [ ] fire while backpedaling
- [ ] repeated shots while tracking a target

Pass only if:
- [ ] recoil does not break hand placement
- [ ] locomotion continues under the shot animation
- [ ] crosshair/weapon direction feels coherent
- [ ] firing does not freeze the legs

## G. Jump / landing
Repeat jumps while:
- [ ] stationary
- [ ] walking
- [ ] running
- [ ] sprinting
- [ ] changing direction just before jump

Pass only if:
- [ ] takeoff is immediate
- [ ] legs clearly leave the grounded gait
- [ ] falling reads differently from running
- [ ] landing compresses the body
- [ ] stronger falls produce stronger recovery
- [ ] feet do not remain visibly floating after landing

## H. Stress loop
For at least 3 minutes continuously:
- sprint
- stop
- 180 turn
- sprint
- jump
- aim
- strafe
- fire
- release aim
- turn again

Pass only if:
- [ ] no animation state gets stuck
- [ ] no permanent twisted limb
- [ ] no accumulating character lean
- [ ] no increasing foot jitter
- [ ] no control loss
- [ ] no need to use Reset View in normal movement

## Approval result
Choose one only:

- [ ] **GREEN - animation feel is good enough to continue toward final model/animation polish**
- [ ] **AMBER - clearly improved, but list specific visual defects for W34.1 repair**
- [ ] **RED - still feels puppet-like/glitchy; do not propagate to other family characters**

## Record defects by action
For every defect, record:
- action being performed
- whether AIM was held
- joystick direction/strength
- camera direction
- whether it happened once or repeatedly
- screenshot/video timestamp if available

Do not approve based only on automated tests. This gate is visual and tactile.
